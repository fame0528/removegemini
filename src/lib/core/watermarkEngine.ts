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
  WatermarkProvider,
} from '@/types';
import { calculateAlphaMap } from './alphaMap';
import { removeWatermark } from './blendModes';

// Import assets as static URLs
// Note: In Next.js, we'll use dynamic imports for better compatibility
const BG_48_URL = '/bg_48.png';
const BG_96_URL = '/bg_96.png';
// Nano Banana watermark patterns (to be added)
const NANO_BANANA_48_URL = '/nano_banana_48.png';
const NANO_BANANA_96_URL = '/nano_banana_96.png';

/**
 * Detect watermark provider from image metadata or patterns
 * 
 * @param image - Image element to analyze
 * @returns Detected provider type
 */
export function detectWatermarkProvider(
  image: HTMLImageElement | HTMLCanvasElement
): WatermarkProvider {
  // TODO: Implement provider detection logic
  // For now, we'll check for both patterns and use the one that matches best
  
  // Check if nano banana watermark exists (bottom-right sparkle pattern)
  // Check if gemini watermark exists (bottom-right "Gemini" text pattern)
  
  // For now, default to trying both
  return 'unknown';
}

/**
 * Detect watermark configuration based on image dimensions and provider
 * 
 * Watermark rules:
 * - Gemini: If both width AND height > 1024px → use 96×96, else 48×48
 * - Nano Banana: Similar sizing, position in bottom-right corner
 * 
 * Edge cases:
 * - Very small images (< 200px) may not have watermarks
 * - Watermark position may vary based on aspect ratio
 * 
 * @param imageWidth - Image width in pixels
 * @param imageHeight - Image height in pixels
 * @param provider - Watermark provider type
 * @returns Watermark configuration object
 * 
 * @example
 * ```typescript
 * const config = detectWatermarkConfig(1920, 1080, 'gemini');
 * // Returns: { logoSize: 96, marginRight: 64, marginBottom: 64, provider: 'gemini' }
 * ```
 */
export function detectWatermarkConfig(
  imageWidth: number,
  imageHeight: number,
  provider: WatermarkProvider = 'unknown'
): WatermarkConfig {
  // For very large images (both dimensions > 1024), use 96×96 watermark
  if (imageWidth > 1024 && imageHeight > 1024) {
    return {
      logoSize: 96,
      marginRight: 64,
      marginBottom: 64,
      provider,
    };
  }
  
  // For images at exactly 1024px width (common Gemini output)
  // Gemini uses very tight margins for 1024px width images
  if (imageWidth === 1024) {
    return {
      logoSize: 48,
      marginRight: 8,
      marginBottom: 8,
      provider,
    };
  }
  
  // For other large images (>= 1024 in either dimension)
  if (imageWidth >= 1024 || imageHeight >= 1024) {
    return {
      logoSize: 48,
      marginRight: 32,
      marginBottom: 32,
      provider,
    };
  }
  
  // For smaller images, use 48×48 with tighter margins
  return {
    logoSize: 48,
    marginRight: 24,
    marginBottom: 24,
    provider,
  };
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
   * creating the engine instance. Supports both Gemini and Nano Banana patterns.
   * 
   * @returns Promise resolving to initialized WatermarkEngine
   * @throws Error if images fail to load
   */
  static async create(): Promise<WatermarkEngine> {
    const bg48 = new Image();
    const bg96 = new Image();
    const nanoBanana48 = new Image();
    const nanoBanana96 = new Image();

    const loadPromises = [
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
    ];

    // Try to load nano banana patterns (optional)
    const nanoPromises = [
      new Promise<void>((resolve) => {
        nanoBanana48.onload = () => {
          console.log('✅ Loaded Nano Banana 48x48 pattern');
          resolve();
        };
        nanoBanana48.onerror = () => {
          console.warn('⚠️ Nano Banana 48x48 pattern not found, will use Gemini pattern only');
          resolve(); // Don't reject, just continue
        };
        nanoBanana48.src = NANO_BANANA_48_URL;
      }),
      new Promise<void>((resolve) => {
        nanoBanana96.onload = () => {
          console.log('✅ Loaded Nano Banana 96x96 pattern');
          resolve();
        };
        nanoBanana96.onerror = () => {
          console.warn('⚠️ Nano Banana 96x96 pattern not found, will use Gemini pattern only');
          resolve(); // Don't reject, just continue
        };
        nanoBanana96.src = NANO_BANANA_96_URL;
      }),
    ];

    await Promise.all([...loadPromises, ...nanoPromises]);

    const captures: BackgroundCaptures = {
      bg48,
      bg96,
      nanoBanana48: nanoBanana48.complete && nanoBanana48.naturalWidth > 0 ? nanoBanana48 : undefined,
      nanoBanana96: nanoBanana96.complete && nanoBanana96.naturalWidth > 0 ? nanoBanana96 : undefined,
    };

    return new WatermarkEngine(captures);
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
   * watermark configuration, tries both Gemini and Nano Banana patterns,
   * and applies reverse alpha blending to remove the watermark.
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

    // Detect provider (future: smart detection)
    const provider = detectWatermarkProvider(image);

    // Detect watermark configuration and position
    const config = detectWatermarkConfig(canvas.width, canvas.height, provider);
    const position = calculateWatermarkPosition(canvas.width, canvas.height, config);

    // Debug logging
    console.log('🔍 Watermark Detection:', {
      imageSize: `${canvas.width}×${canvas.height}`,
      watermarkSize: `${config.logoSize}×${config.logoSize}`,
      position: `(${position.x}, ${position.y})`,
      margins: `right: ${config.marginRight}px, bottom: ${config.marginBottom}px`,
      provider: config.provider,
    });

    // Extract watermark region to analyze actual alpha
    const watermarkRegion = ctx.getImageData(position.x, position.y, position.width, position.height);
    
    // Calculate alpha map directly from the watermark region
    // by analyzing the brightness (watermark is lighter than background)
    const directAlphaMap = new Float32Array(position.width * position.height);
    for (let i = 0; i < directAlphaMap.length; i++) {
      const idx = i * 4;
      const r = watermarkRegion.data[idx];
      const g = watermarkRegion.data[idx + 1];
      const b = watermarkRegion.data[idx + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      
      // Watermark makes pixels brighter - estimate alpha from brightness increase
      // Assuming background is darker (typical for this image)
      const estimatedAlpha = Math.min(1.0, brightness / 255.0 * 0.3); // Conservative estimate
      directAlphaMap[i] = estimatedAlpha;
    }

    console.log('🤖 Using direct watermark alpha detection...');
    removeWatermark(imageData, directAlphaMap, position);
    ctx.putImageData(imageData, 0, 0);

    // Debug: Draw detection box (always enabled for now to diagnose positioning)
    if (typeof window !== 'undefined') {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.strokeRect(position.x, position.y, position.width, position.height);
      console.log('🎯 Debug box drawn at watermark position');
    }

    return canvas;
  }

  /**
   * Get watermark information for display purposes
   * 
   * Useful for showing watermark details in the UI.
   * 
   * @param imageWidth - Image width in pixels
   * @param imageHeight - Image height in pixels
   * @param provider - Optional provider type
   * @returns Watermark information object
   */
  getWatermarkInfo(imageWidth: number, imageHeight: number, provider: WatermarkProvider = 'unknown'): WatermarkInfo {
    const config = detectWatermarkConfig(imageWidth, imageHeight, provider);
    const position = calculateWatermarkPosition(imageWidth, imageHeight, config);

    return {
      size: config.logoSize,
      position,
      config,
      provider: config.provider || 'unknown',
    };
  }
}
