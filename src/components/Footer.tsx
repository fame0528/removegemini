/**
 * Footer Component
 * @fileoverview Application footer with copyright and links
 */

'use client';

import { useState, useEffect } from 'react';
import { i18n } from '@/lib/i18n';

export function Footer() {
  const [footerDesc, setFooterDesc] = useState(i18n.t('footer.desc'));
  const [copyright, setCopyright] = useState(
    i18n.t('footer.copyright', { year: new Date().getFullYear().toString() })
  );

  useEffect(() => {
    // Subscribe to locale changes
    const unsubscribe = i18n.onChange(() => {
      setFooterDesc(i18n.t('footer.desc'));
      setCopyright(
        i18n.t('footer.copyright', { year: new Date().getFullYear().toString() })
      );
    });

    return unsubscribe;
  }, []);

  return (
    <footer className="glass border-t border-gray-700/50 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              RemoveGemini.com
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{footerDesc}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {i18n.t('footer.links')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/fame0528/removegemini"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {i18n.t('footer.github')}
                </a>
              </li>
              <li>
                <a
                  href="/terms.html"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {i18n.t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {i18n.t('footer.tech')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✅ {i18n.t('feature.privacy.title')}</li>
              <li>⚡ {i18n.t('feature.speed.title')}</li>
              <li>🆓 {i18n.t('feature.free.title')}</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-center text-gray-500">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
