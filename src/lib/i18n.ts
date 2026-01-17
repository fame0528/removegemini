/**
 * Internationalization (i18n) System
 * @fileoverview Provides multi-language support with dynamic locale switching
 * @module i18n
 */

import type { I18nInstance } from '@/types';
import enUS from '@/i18n/en-US.json';
import zhCN from '@/i18n/zh-CN.json';

/**
 * Supported locales
 */
export type Locale = 'en-US' | 'zh-CN';

/**
 * Translation dictionaries
 */
const translations: Record<Locale, Record<string, string>> = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

/**
 * Detect user's preferred locale from browser
 * 
 * Checks navigator.language and falls back to 'en-US' if not supported.
 * 
 * @returns Detected locale
 */
function detectLocale(): Locale {
  const browserLang = navigator.language;

  // Check for exact match
  if (browserLang === 'zh-CN' || browserLang === 'zh') {
    return 'zh-CN';
  }

  // Default to English
  return 'en-US';
}

/**
 * Create i18n instance
 * 
 * Provides translation functions and locale management.
 * 
 * @param initialLocale - Initial locale (defaults to auto-detected)
 * @returns i18n instance
 * 
 * @example
 * ```typescript
 * const i18n = createI18n();
 * console.log(i18n.t('header.title')); // "Gemini Watermark Remover"
 * 
 * i18n.setLocale('zh-CN');
 * console.log(i18n.t('header.title')); // "Gemini Watermark Remover"
 * ```
 */
export function createI18n(initialLocale?: Locale): I18nInstance {
  let currentLocale: Locale = initialLocale || detectLocale();
  const listeners: Array<(locale: Locale) => void> = [];

  /**
   * Translate key to current locale
   * 
   * @param key - Translation key (dot notation)
   * @param params - Optional parameters for interpolation
   * @returns Translated string
   */
  function t(key: string, params?: Record<string, string | number>): string {
    let text = translations[currentLocale][key] || key;

    // Replace parameters {{param}} with values
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      });
    }

    return text;
  }

  /**
   * Set current locale
   * 
   * @param locale - New locale
   */
  function setLocale(locale: Locale): void {
    if (currentLocale !== locale) {
      currentLocale = locale;
      listeners.forEach((listener) => listener(locale));
    }
  }

  /**
   * Get current locale
   * 
   * @returns Current locale
   */
  function getLocale(): Locale {
    return currentLocale;
  }

  /**
   * Subscribe to locale changes
   * 
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  function onChange(listener: (locale: Locale) => void): () => void {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  return {
    t,
    setLocale,
    getLocale,
    onChange,
  };
}

/**
 * Global i18n instance
 */
export const i18n = createI18n();
