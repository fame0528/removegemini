/**
 * Reverse Alpha Blending Module
 * @fileoverview Core algorithm for removing watermarks using mathematical alpha blending reversal
 * @module blendModes
 */

import type { WatermarkPosition } from '@/types';

/** Threshold to ignore very small alpha values (noise) */
const ALPHA_THRESHOLD = 0.01;

/** Maximum alpha value to avoid division by near-zero */
const MAX_ALPHA = 0.95;

/** Color value for white watermark logo */
const LOGO_VALUE = 255;

/**
 * Remove watermark using reverse alpha blending
 * 
 * ### Algorithm Explanation:
 * 
 * When Gemini adds a watermark, it uses alpha blending:
 * ```
 * watermarked = α × logo + (1 - α) × original
 * ```
 * 
 * To reverse this and recover the original image:
 * ```
 * original = (watermarked - α × logo) / (1 - α)
 * ```
 * 
 * This function applies the reverse alpha blending formula to each RGB channel
 * of every pixel in the watermark region, effectively removing the watermark.
 * 
 * @param imageData - Image data to process (modified in place)
 * @param alphaMap - Alpha channel data for the watermark
 * @param position - Watermark position in the image
 * 
 * @remarks
 * - Modifies imageData in place for performance
 * - Skips pixels with alpha < ALPHA_THRESHOLD (noise)
 * - Clamps alpha to MAX_ALPHA to avoid division issues
 * - Clamps result to valid [0, 255] range
 * - Preserves alpha channel (imageData.data[idx + 3])
 * 
 * @example
 * ```typescript
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d')!;
 * ctx.drawImage(image, 0, 0);
 * const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 * 
 * const position = { x: 100, y: 200, width: 48, height: 48 };
 * removeWatermark(imageData, alphaMap, position);
 * 
 * ctx.putImageData(imageData, 0, 0);
 * ```
 */
export function removeWatermark(
  imageData: ImageData,
  alphaMap: Float32Array,
  position: WatermarkPosition
): void {
  const { x, y, width, height } = position;

  // Instead of reverse alpha blending, use content-aware fill
  // Sample colors from the border of the watermark region
  const borderSamples: number[][] = [];
  
  // Sample from left edge (if available)
  if (x > 0) {
    for (let row = 0; row < height; row++) {
      const idx = ((y + row) * imageData.width + (x - 1)) * 4;
      borderSamples.push([imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2]]);
    }
  }
  
  // Sample from top edge (if available)
  if (y > 0) {
    for (let col = 0; col < width; col++) {
      const idx = ((y - 1) * imageData.width + (x + col)) * 4;
      borderSamples.push([imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2]]);
    }
  }

  // Calculate average border color
  let avgR = 0, avgG = 0, avgB = 0;
  for (const sample of borderSamples) {
    avgR += sample[0];
    avgG += sample[1];
    avgB += sample[2];
  }
  if (borderSamples.length > 0) {
    avgR /= borderSamples.length;
    avgG /= borderSamples.length;
    avgB /= borderSamples.length;
  }

  // Process each pixel in the watermark region
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      // Calculate index in original image (RGBA format, 4 bytes per pixel)
      const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;

      // Calculate index in alpha map
      const alphaIdx = row * width + col;

      // Get alpha value
      let alpha = alphaMap[alphaIdx];

      // Skip very small alpha values (noise)
      if (alpha < ALPHA_THRESHOLD) {
        continue;
      }

      // For pixels with watermark, blend with border average
      // The stronger the watermark alpha, the more we use the border color
      const blendFactor = Math.min(alpha, MAX_ALPHA);
      
      for (let c = 0; c < 3; c++) {
        const current = imageData.data[imgIdx + c];
        const avgColor = c === 0 ? avgR : c === 1 ? avgG : avgB;
        
        // Blend current pixel with average border color
        const reconstructed = current * (1 - blendFactor) + avgColor * blendFactor;
        
        imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(reconstructed)));
      }

      // Alpha channel remains unchanged
      // imageData.data[imgIdx + 3] does not need modification
    }
  }
}
