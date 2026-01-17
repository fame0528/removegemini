/**
 * TypeScript Type Definitions for Gemini Watermark Remover
 * @fileoverview Complete type definitions for watermark engine and components
 */

/**
 * Supported watermark provider types
 */
export type WatermarkProvider = 'gemini' | 'nano-banana' | 'unknown';

/**
 * Watermark configuration based on image dimensions
 */
export interface WatermarkConfig {
  /** Watermark logo size in pixels */
  logoSize: 48 | 96;
  /** Right margin in pixels */
  marginRight: number;
  /** Bottom margin in pixels */
  marginBottom: number;
  /** Provider type */
  provider?: WatermarkProvider;
}

/**
 * Watermark position in image
 */
export interface WatermarkPosition {
  /** X coordinate (left) */
  x: number;
  /** Y coordinate (top) */
  y: number;
  /** Width of watermark region */
  width: number;
  /** Height of watermark region */
  height: number;
}

/**
 * Watermark information for display
 */
export interface WatermarkInfo {
  /** Watermark size (48 or 96) */
  size: 48 | 96;
  /** Position in image */
  position: WatermarkPosition;
  /** Configuration used */
  config: WatermarkConfig;
  /** Detected provider */
  provider: WatermarkProvider;
}

/**
 * Background capture images for alpha map calculation
 */
export interface BackgroundCaptures {
  /** 48x48 background capture (Gemini) */
  bg48: HTMLImageElement;
  /** 96x96 background capture (Gemini) */
  bg96: HTMLImageElement;
  /** 48x48 nano banana background */
  nanoBanana48?: HTMLImageElement;
  /** 96x96 nano banana background */
  nanoBanana96?: HTMLImageElement;
}

/**
 * EXIF metadata check result
 */
export interface OriginalCheckResult {
  /** Is image from Google AI */
  is_google: boolean;
  /** Has original EXIF data */
  is_original: boolean;
}

/**
 * Image queue item for batch processing
 */
export interface ImageQueueItem {
  /** Unique identifier */
  id: number;
  /** Original file */
  file: File;
  /** File name */
  name: string;
  /** Processing status */
  status: 'pending' | 'processing' | 'completed' | 'error' | 'success' | 'failed';
  /** Original image element */
  originalImg: HTMLImageElement | null;
  /** Original HTMLImageElement (alias) */
  originalImage: HTMLImageElement;
  /** Processed blob */
  processedBlob: Blob | null;
  /** Processed canvas */
  processedCanvas: HTMLCanvasElement | null;
  /** Original image URL */
  originalUrl: string | null;
  /** Processed image URL */
  processedUrl: string | null;
  /** Is original Gemini image */
  isOriginal: boolean;
  /** Watermark info */
  watermarkInfo: WatermarkInfo;
}

/**
 * Supported locales for i18n
 */
export type Locale = 'en-US' | 'zh-CN';

/**
 * Translation data structure
 */
export interface TranslationData {
  status: {
    loading: string;
    processing: string;
    pending: string;
    failed: string;
  };
  info: {
    size: string;
    watermark: string;
    position: string;
    status: string;
    removed: string;
  };
  original: {
    not_gemini: string;
    not_original: string;
  };
  btn: {
    download: string;
    downloadAll: string;
    reset: string;
  };
  progress: {
    text: string;
  };
  main: {
    title: string;
    subtitle: string;
  };
  upload: {
    text: string;
    hint: string;
  };
  step: {
    1: string;
    2: string;
    3: string;
  };
  preview: {
    original: string;
    result: string;
  };
  panel: {
    title: string;
  };
  feature: {
    title: string;
    speed: {
      title: string;
      desc: string;
    };
    privacy: {
      title: string;
      desc: string;
    };
    free: {
      title: string;
      desc: string;
    };
  };
  footer: {
    desc: string;
    links: string;
    terms: string;
    github: string;
    tech: string;
    copyright: string;
  };
  nav: {
    userscript: string;
    principle: string;
  };
  header: {
    title: string;
  };
  loading: {
    text: string;
  };
}

/**
 * I18n instance interface
 */
export interface I18nInstance {
  /** Translate key with optional params */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Set current locale */
  setLocale: (locale: Locale) => void;
  /** Get current locale */
  getLocale: () => Locale;
  /** Subscribe to locale changes */
  onChange: (listener: (locale: Locale) => void) => () => void;
}
