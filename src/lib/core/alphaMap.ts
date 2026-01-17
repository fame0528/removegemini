/**
 * Alpha Map Calculator
 * @fileoverview Calculate alpha map from captured background image for watermark removal
 * @module alphaMap
 */

/**
 * Calculate alpha map from background captured image
 * 
 * The alpha map represents the transparency values of the watermark overlay.
 * We extract this by taking the maximum RGB channel value from each pixel
 * and normalizing it to a 0.0-1.0 range.
 * 
 * @param bgCaptureImageData - ImageData object for background capture
 * @returns Float32Array containing alpha values (0.0-1.0) for each pixel
 * 
 * @example
 * ```typescript
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d')!;
 * ctx.drawImage(bgImage, 0, 0);
 * const imageData = ctx.getImageData(0, 0, 48, 48);
 * const alphaMap = calculateAlphaMap(imageData);
 * ```
 */
export function calculateAlphaMap(bgCaptureImageData: ImageData): Float32Array {
  const { width, height, data } = bgCaptureImageData;
  const alphaMap = new Float32Array(width * height);

  // Process each pixel
  for (let i = 0; i < alphaMap.length; i++) {
    const idx = i * 4; // RGBA format: 4 bytes per pixel
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Take the maximum value of RGB channels as brightness
    // This represents the watermark's opacity at this pixel
    const maxChannel = Math.max(r, g, b);

    // Normalize to [0.0, 1.0] range with slight boost for better removal
    alphaMap[i] = Math.min(1.0, (maxChannel / 255.0) * 1.05);
  }

  return alphaMap;
}
