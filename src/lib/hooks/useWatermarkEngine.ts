/**
 * Watermark Engine Hook
 * @fileoverview React hook for managing watermark engine state and operations
 * @module hooks/useWatermarkEngine
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ImageQueueItem, WatermarkInfo, BatchState, BatchProgress } from '@/types';
import { WatermarkEngine } from '@/lib/core/watermarkEngine';
import { loadImage, checkOriginal, downloadCanvas, getExtensionFromMimeType } from '@/lib/utils/imageUtils';

/**
 * Hook return type
 */
interface UseWatermarkEngineReturn {
  /** Watermark engine instance (null until initialized) */
  engine: WatermarkEngine | null;
  /** Loading state */
  isLoading: boolean;
  /** Image processing queue */
  imageQueue: ImageQueueItem[];
  /** Currently selected image index */
  currentIndex: number;
  /** Batch processing state */
  batchState: BatchState;
  /** Batch processing progress */
  batchProgress: BatchProgress;
  /** Process uploaded files */
  processFiles: (files: FileList | File[]) => Promise<void>;
  /** Remove watermark from specific image */
  removeWatermark: (index: number) => Promise<void>;
  /** Process all pending images in batch */
  processBatch: () => Promise<void>;
  /** Cancel ongoing batch operation */
  cancelBatch: () => void;
  /** Download processed image */
  downloadImage: (index: number) => void;
  /** Download all processed images */
  downloadAll: () => void;
  /** Reset and clear all images */
  reset: () => void;
  /** Set current image index */
  setCurrentIndex: (index: number) => void;
}

/**
 * Watermark Engine Hook
 * 
 * Manages watermark engine lifecycle, image queue, and processing operations.
 * 
 * @returns Hook state and functions
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const {
 *     engine,
 *     isLoading,
 *     imageQueue,
 *     processFiles,
 *     removeWatermark,
 *     downloadImage,
 *   } = useWatermarkEngine();
 * 
 *   const handleUpload = async (files: FileList) => {
 *     await processFiles(files);
 *   };
 * 
 *   return (
 *     <div>
 *       {imageQueue.map((item, index) => (
 *         <div key={index}>
 *           <img src={item.originalUrl} alt="Original" />
 *           {item.processedUrl && (
 *             <img src={item.processedUrl} alt="Processed" />
 *           )}
 *           <button onClick={() => removeWatermark(index)}>
 *             Remove Watermark
 *           </button>
 *           {item.processedUrl && (
 *             <button onClick={() => downloadImage(index)}>
 *               Download
 *             </button>
 *           )}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWatermarkEngine(): UseWatermarkEngineReturn {
  const [engine, setEngine] = useState<WatermarkEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageQueue, setImageQueue] = useState<ImageQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [batchState, setBatchState] = useState<BatchState>('idle');
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    pending: 0,
    percentage: 0,
  });
  
  // Store canvas references to prevent garbage collection
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  
  // Flag to cancel batch processing
  const cancelBatchRef = useRef(false);

  /**
   * Initialize watermark engine
   */
  useEffect(() => {
    const initEngine = async () => {
      try {
        setIsLoading(true);
        const engineInstance = await WatermarkEngine.create();
        setEngine(engineInstance);
      } catch (error) {
        console.error('Failed to initialize watermark engine:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initEngine();
  }, []);

  /**
   * Update batch progress based on current queue state
   */
  const updateBatchProgress = useCallback(() => {
    setImageQueue((currentQueue) => {
      const total = currentQueue.length;
      const success = currentQueue.filter((item) => item.status === 'success').length;
      const failed = currentQueue.filter((item) => item.status === 'failed').length;
      const processing = currentQueue.filter((item) => item.status === 'processing').length;
      const pending = currentQueue.filter((item) => item.status === 'pending').length;
      const processed = success + failed;
      const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;

      setBatchProgress({
        total,
        processed,
        success,
        failed,
        pending,
        percentage,
      });

      return currentQueue;
    });
  }, []);

  /**
   * Process uploaded files
   * 
   * Loads images, checks if they're original, and adds them to the queue WITH auto-processing.
   */
  const processFiles = useCallback(async (files: FileList | File[]): Promise<void> => {
    if (!engine) return;

    setIsLoading(true);

    try {
      const fileArray = Array.from(files);
      const newItems: ImageQueueItem[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping non-image file: ${file.name}`);
          continue;
        }

        // Load image
        const img = await loadImage(file);

        // Check if original
        const isOriginal = await checkOriginal(file);

        // Get watermark info
        const watermarkInfo = engine.getWatermarkInfo(img.width, img.height);

        // Create object URL for preview
        const originalUrl = URL.createObjectURL(file);

        newItems.push({
          id: Date.now() + i,
          file,
          name: file.name,
          originalImage: img,
          originalImg: img,
          originalUrl,
          processedCanvas: null,
          processedUrl: null,
          processedBlob: null,
          status: 'pending',
          isOriginal,
          watermarkInfo,
        });
      }

      // Add items to queue
      const startIndex = imageQueue.length;
      setImageQueue((prev) => [...prev, ...newItems]);
      
      // Update progress
      setTimeout(updateBatchProgress, 0);

      // Auto-process each image after adding to queue
      for (let i = 0; i < newItems.length; i++) {
        const index = startIndex + i;
        await processImageAtIndex(index, newItems[i]);
        updateBatchProgress();
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [engine, imageQueue.length, updateBatchProgress]);

  /**
   * Internal function to process a specific image
   */
  const processImageAtIndex = useCallback(async (index: number, item: ImageQueueItem): Promise<void> => {
    if (!engine) return;

    setImageQueue((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], status: 'processing' };
      }
      return updated;
    });

    try {
      const processedCanvas = await engine.removeWatermarkFromImage(item.originalImage);
      
      // Store canvas reference
      canvasRefs.current.set(index, processedCanvas);

      // Create object URL from canvas
      const blob = await new Promise<Blob>((resolve, reject) => {
        processedCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      });

      const processedUrl = URL.createObjectURL(blob);

      setImageQueue((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            processedCanvas,
            processedUrl,
            processedBlob: blob,
            status: 'success',
          };
        }
        return updated;
      });
    } catch (error) {
      console.error('Error removing watermark:', error);
      setImageQueue((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], status: 'failed' };
        }
        return updated;
      });
    }
  }, [engine]);

  /**
   * Remove watermark from specific image (manual trigger)
   */
  const removeWatermark = useCallback(async (index: number): Promise<void> => {
    if (!engine || index < 0 || index >= imageQueue.length) return;

    const item = imageQueue[index];
    
    // Skip if already processing or successfully processed
    if (item.status === 'processing' || item.status === 'success') return;

    await processImageAtIndex(index, item);
  }, [engine, imageQueue, processImageAtIndex]);

  /**
   * Download processed image
   */
  const downloadImage = useCallback((index: number): void => {
    if (index < 0 || index >= imageQueue.length) return;

    const item = imageQueue[index];
    if (!item.processedCanvas) return;

    const originalName = item.file.name;
    const extension = getExtensionFromMimeType(item.file.type);
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const newName = `${baseName}_no_watermark.${extension}`;

    downloadCanvas(item.processedCanvas, newName, item.file.type);
  }, [imageQueue]);

  /**
   * Download all processed images
   */
  const downloadAll = useCallback((): void => {
    imageQueue.forEach((item, index) => {
      if (item.processedCanvas) {
        downloadImage(index);
      }
    });
  }, [imageQueue, downloadImage]);

  /**
   * Process all pending images in batch
   */
  const processBatch = useCallback(async (): Promise<void> => {
    if (!engine || batchState === 'processing') return;

    // Reset cancel flag
    cancelBatchRef.current = false;
    setBatchState('processing');

    try {
      const pendingItems = imageQueue
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.status === 'pending' || item.status === 'failed');

      for (const { item, index } of pendingItems) {
        // Check if batch was cancelled
        if (cancelBatchRef.current) {
          setBatchState('cancelled');
          break;
        }

        await processImageAtIndex(index, item);
        updateBatchProgress();
      }

      // Update final state
      if (!cancelBatchRef.current) {
        setBatchState('complete');
      }
    } catch (error) {
      console.error('Batch processing error:', error);
      setBatchState('idle');
    }
  }, [engine, batchState, imageQueue, processImageAtIndex, updateBatchProgress]);

  /**
   * Cancel ongoing batch operation
   */
  const cancelBatch = useCallback((): void => {
    cancelBatchRef.current = true;
    setBatchState('cancelled');
  }, []);

  /**
   * Reset and clear all images
   */
  const reset = useCallback((): void => {
    // Cancel any ongoing batch
    cancelBatchRef.current = true;
    
    // Revoke object URLs to prevent memory leaks
    imageQueue.forEach((item) => {
      if (item.originalUrl) {
        URL.revokeObjectURL(item.originalUrl);
      }
      if (item.processedUrl) {
        URL.revokeObjectURL(item.processedUrl);
      }
    });

    // Clear canvas references
    canvasRefs.current.clear();

    setImageQueue([]);
    setCurrentIndex(0);
    setBatchState('idle');
    setBatchProgress({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0,
      pending: 0,
      percentage: 0,
    });
  }, [imageQueue]);

  return {
    engine,
    isLoading,
    imageQueue,
    currentIndex,
    batchState,
    batchProgress,
    processFiles,
    removeWatermark,
    processBatch,
    cancelBatch,
    downloadImage,
    downloadAll,
    reset,
    setCurrentIndex,
  };
}
