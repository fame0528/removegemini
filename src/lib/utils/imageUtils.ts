/**
 * Image Utilities
 * @fileoverview Utility functions for image loading and EXIF processing
 * @module imageUtils
 */

import exifr from 'exifr';

/**
 * Load image from File or Blob
 * 
 * Creates an HTMLImageElement from a File/Blob object
 * and waits for it to load asynchronously.
 * 
 * @param file - Image file to load
 * @returns Promise resolving to loaded HTMLImageElement
 * @throws Error if image fails to load
 * 
 * @example
 * ```typescript
 * const input = document.querySelector('input[type="file"]');
 * const file = input.files[0];
 * const img = await loadImage(file);
 * console.log(`Image dimensions: ${img.width}x${img.height}`);
 * ```
 */
export async function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Check if image is original (not processed by AI)
 * 
 * Examines EXIF metadata to detect Gemini/AI processing.
 * AI-generated images typically have specific EXIF patterns.
 * 
 * @param file - Image file to check
 * @returns Promise resolving to true if original, false if AI-processed
 * 
 * @example
 * ```typescript
 * const file = input.files[0];
 * const isOriginal = await checkOriginal(file);
 * if (!isOriginal) {
 *   console.warn('This image has been processed by AI');
 * }
 * ```
 */
export async function checkOriginal(file: File | Blob): Promise<boolean> {
  try {
    const exif = await exifr.parse(file, {
      tiff: true,
      xmp: true,
      icc: false,
      iptc: false,
      jfif: false,
      ihdr: false,
      translateKeys: false,
      translateValues: false,
      reviveValues: false,
      sanitize: false,
      mergeOutput: false,
    });

    // No EXIF data means likely original
    if (!exif) {
      return true;
    }

    // Check for AI processing indicators
    const software = exif.Software?.toLowerCase() || '';
    const userComment = exif.UserComment?.toLowerCase() || '';
    const imageDescription = exif.ImageDescription?.toLowerCase() || '';

    // Gemini and other AI tools leave fingerprints
    const aiIndicators = ['gemini', 'imagen', 'dalle', 'midjourney', 'stable diffusion'];

    for (const indicator of aiIndicators) {
      if (
        software.includes(indicator) ||
        userComment.includes(indicator) ||
        imageDescription.includes(indicator)
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // If EXIF parsing fails, assume original
    console.warn('EXIF parsing failed:', error);
    return true;
  }
}

/**
 * Download canvas as image file
 * 
 * Converts canvas to blob and triggers browser download.
 * 
 * @param canvas - Canvas to download
 * @param filename - Output filename
 * @param mimeType - Image MIME type (default: 'image/png')
 * @param quality - JPEG quality 0-1 (default: 0.95)
 * 
 * @example
 * ```typescript
 * await downloadCanvas(processedCanvas, 'watermark-removed.png');
 * ```
 */
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType: string = 'image/png',
  quality: number = 0.95
): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      },
      mimeType,
      quality
    );
  });
}

/**
 * Get file extension from MIME type
 * 
 * @param mimeType - MIME type string
 * @returns File extension (e.g., 'png', 'jpg')
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
  };

  return map[mimeType] || 'png';
}
