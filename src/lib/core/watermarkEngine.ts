/**
 * Watermark Engine - Main Module
 * @fileoverview Coordinates watermark detection, alpha map calculation, and removal operations
 * @module watermarkEngine
 */

import type {
  WatermarkConfig,
  WatermarkPosition,
  WatermarkInfo,
  BackgroundCaptures,
} from '@/types';
import { calculateAlphaMap } from './alphaMap';
import { removeWatermark } from './blendModes';

// Import assets as static URLs
// Note: In Next.js, we'll use dynamic imports for better compatibility
const BG_48_URL = '/bg_48.png';
const BG_96_URL = '/bg_96.png';

/**
 * Detect watermark configuration based on image dimensions
 * 
 * Gemini's watermark rules:
 * - If both width AND height > 1024px → use 96×96 watermark
 * - Otherwise → use 48×48 watermark
 * 
 * @param imageWidth - Image width in pixels
 * @param imageHeight - Image height in pixels
 * @returns Watermark configuration object
 * 
 * @example
 * ```typescript
 * const config = detectWatermarkConfig(1920, 1080);
 * // Returns: { logoSize: 96, marginRight: 64, marginBottom: 64 }
 * ```
 */
export function detectWatermarkConfig(
  imageWidth: number,
  imageHeight: number
): WatermarkConfig {
  if (imageWidth > 1024 && imageHeight > 1024) {
    return {
      logoSize: 96,
      marginRight: 64,
      marginBottom: 64,
    };
  } else {
    return {
      logoSize: 48,
      marginRight: 32,
      marginBottom: 32,
    };
  }
}

/**
 * Calculate watermark position in image
 * 
 * The watermark is always positioned in the bottom-right corner
 * with specific margins based on the watermark size.
 * 
 * @param imageWidth - Image width in pixels
 * @param imageHeight - Image height in pixels
 * @param config - Watermark configuration
 * @returns Watermark position object with x, y, width, height
 * 
 * @example
 * ```typescript
 * const config = { logoSize: 48, marginRight: 32, marginBottom: 32 };
 * const position = calculateWatermarkPosition(1920, 1080, config);
 * // Returns: { x: 1840, y: 1000, width: 48, height: 48 }
 * ```
 */
export function calculateWatermarkPosition(
  imageWidth: number,
  imageHeight: number,
  config: WatermarkConfig
): WatermarkPosition {
  const { logoSize, marginRight, marginBottom } = config;

  return {
    x: imageWidth - marginRight - logoSize,
    y: imageHeight - marginBottom - logoSize,
    width: logoSize,
    height: logoSize,
  };
}

/**
 * Watermark Engine Class
 * 
 * Provides high-level API for watermark removal operations.
 * Manages alpha maps, background captures, and coordinates the removal process.
 * 
 * @example
 * ```typescript
 * const engine = await WatermarkEngine.create();
 * const result = await engine.removeWatermarkFromImage(imageElement);
 * const blob = await new Promise(resolve => result.toBlob(resolve, 'image/png'));
 * ```
 */
export class WatermarkEngine {
  private bgCaptures: BackgroundCaptures;
  private alphaMaps: Record<48 | 96, Float32Array | null>;

  /**
   * Create new WatermarkEngine instance
   * @param bgCaptures - Background capture images for alpha map calculation
   */
  constructor(bgCaptures: BackgroundCaptures) {
    this.bgCaptures = bgCaptures;
    this.alphaMaps = {
      48: null,
      96: null,
    };
  }

  /**
   * Static factory method to create and initialize engine
   * 
   * Loads background capture images asynchronously before
   * creating the engine instance.
   * 
   * @returns Promise resolving to initialized WatermarkEngine
   * @throws Error if images fail to load
   */
  static async create(): Promise<WatermarkEngine> {
    const bg48 = new Image();
    const bg96 = new Image();

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        bg48.onload = () => resolve();
        bg48.onerror = (e) => {
          console.error('Failed to load bg_48.png:', e);
          reject(new Error(`Failed to load bg_48.png from ${BG_48_URL}`));
        };
        bg48.src = BG_48_URL;
      }),
      new Promise<void>((resolve, reject) => {
        bg96.onload = () => resolve();
        bg96.onerror = (e) => {
          console.error('Failed to load bg_96.png:', e);
          reject(new Error(`Failed to load bg_96.png from ${BG_96_URL}`));
        };
        bg96.src = BG_96_URL;
      }),
    ]);

    return new WatermarkEngine({ bg48, bg96 });
  }

  /**
   * Get or calculate alpha map for watermark size
   * 
   * Caches calculated alpha maps for performance.
   * 
   * @param size - Watermark size (48 or 96)
   * @returns Promise resolving to Float32Array alpha map
   */
  async getAlphaMap(size: 48 | 96): Promise<Float32Array> {
    // Return cached alpha map if available
    if (this.alphaMaps[size]) {
      return this.alphaMaps[size]!;
    }

    // Select background image based on watermark size
    const bgImage = size === 48 ? this.bgCaptures.bg48 : this.bgCaptures.bg96;

    // Extract ImageData from background image
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bgImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, size, size);

    // Calculate and cache alpha map
    const alphaMap = calculateAlphaMap(imageData);
    this.alphaMaps[size] = alphaMap;

    return alphaMap;
  }

  /**
   * Remove watermark from image
   * 
   * Main entry point for watermark removal. Automatically detects
   * watermark configuration, calculates position, and applies
   * reverse alpha blending to remove the watermark.
   * 
   * @param image - Input image (HTMLImageElement or HTMLCanvasElement)
   * @returns Promise resolving to canvas with watermark removed
   * 
   * @example
   * ```typescript
 * const engine = await WatermarkEngine.create();
   * const processedCanvas = await engine.removeWatermarkFromImage(img);
   * document.body.appendChild(processedCanvas);
   * ```
   */
  async removeWatermarkFromImage(
    image: HTMLImageElement | HTMLCanvasElement
  ): Promise<HTMLCanvasElement> {
    // Create canvas for processing
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;

    // Draw original image
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Detect watermark configuration and position
    const config = detectWatermarkConfig(canvas.width, canvas.height);
    const position = calculateWatermarkPosition(canvas.width, canvas.height, config);

    // Get alpha map for this watermark size
    const alphaMap = await this.getAlphaMap(config.logoSize);

    // Remove watermark from image data
    removeWatermark(imageData, alphaMap, position);

    // Write processed image data back to canvas
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  /**
   * Get watermark information for display purposes
   * 
   * Useful for showing watermark details in the UI.
   * 
   * @param imageWidth - Image width in pixels
   * @param imageHeight - Image height in pixels
   * @returns Watermark information object
   */
  getWatermarkInfo(imageWidth: number, imageHeight: number): WatermarkInfo {
    const config = detectWatermarkConfig(imageWidth, imageHeight);
    const position = calculateWatermarkPosition(imageWidth, imageHeight, config);

    return {
      size: config.logoSize,
      position,
      config,
    };
  }
}
