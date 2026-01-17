/**
 * Header Component
 * @fileoverview Application header with title and language switcher
 */

'use client';

import { useState, useEffect } from 'react';
import { i18n, type Locale } from '@/lib/i18n';

export function Header() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.getLocale());
  const [title, setTitle] = useState(i18n.t('header.title'));

  useEffect(() => {
    // Subscribe to locale changes
    const unsubscribe = i18n.onChange((locale) => {
      setCurrentLocale(locale);
      setTitle(i18n.t('header.title'));
    });

    return unsubscribe;
  }, []);

  const toggleLocale = () => {
    const newLocale: Locale = currentLocale === 'en-US' ? 'zh-CN' : 'en-US';
    i18n.setLocale(newLocale);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-75 animate-glow"></div>
              <img 
                src="/branding/logo-icon.png" 
                alt="RemoveGemini Logo" 
                className="relative w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">RemoveGemini</h1>
              <p className="text-xs text-gray-400">.com</p>
            </div>
          </a>

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className="group relative flex items-center space-x-2 px-5 py-2.5 rounded-xl glass-light hover:scale-105 transition-all duration-300 btn-shine"
            aria-label="Toggle language"
          >
            <svg
              className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <span className="text-sm font-semibold text-white">
              {currentLocale === 'en-US' ? 'EN' : '中文'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
