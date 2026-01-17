/**
 * Watermark Remover - Main Application Component
 * @fileoverview Orchestrates the entire watermark removal workflow
 */

'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { UploadArea } from './UploadArea';
import { ImagePreview } from './ImagePreview';
import { useWatermarkEngine } from '@/lib/hooks/useWatermarkEngine';
import { i18n } from '@/lib/i18n';

export default function WatermarkRemover() {
  const {
    isLoading,
    imageQueue,
    currentIndex,
    processFiles,
    removeWatermark,
    downloadImage,
    downloadAll,
    reset,
    setCurrentIndex,
  } = useWatermarkEngine();

  const [mainTitle, setMainTitle] = useState(i18n.t('main.title'));
  const [mainSubtitle, setMainSubtitle] = useState(i18n.t('main.subtitle'));

  useEffect(() => {
    // Subscribe to locale changes
    const unsubscribe = i18n.onChange(() => {
      setMainTitle(i18n.t('main.title'));
      setMainSubtitle(i18n.t('main.subtitle'));
    });

    return unsubscribe;
  }, []);

  const handleFilesSelected = async (files: FileList) => {
    await processFiles(files);
  };

  const handleRemoveWatermark = async (index: number) => {
    await removeWatermark(index);
  };

  const handleDownload = (index: number) => {
    downloadImage(index);
  };

  const handleReset = () => {
    reset();
  };

  const handleDownloadAll = () => {
    downloadAll();
  };

  const currentItem = imageQueue[currentIndex];
  const hasProcessedImages = imageQueue.some((item) => item.processedUrl);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-light mb-6 animate-float">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">100% Free & Private</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="gradient-text">{mainTitle}</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {mainSubtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Speed */}
          <div className="group glass rounded-xl p-5 card-hover">
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-white group-hover:text-blue-400 transition-colors">
                  {i18n.t('feature.speed.title')}
                </h3>
                <p className="text-sm text-gray-400 leading-snug">
                  {i18n.t('feature.speed.desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="group glass rounded-xl p-5 card-hover">
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-white group-hover:text-green-400 transition-colors">
                  {i18n.t('feature.privacy.title')}
                </h3>
                <p className="text-sm text-gray-400 leading-snug">
                  {i18n.t('feature.privacy.desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Free */}
          <div className="group glass rounded-xl p-5 card-hover">
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-white group-hover:text-purple-400 transition-colors">
                  {i18n.t('feature.free.title')}
                </h3>
                <p className="text-sm text-gray-400 leading-snug">
                  {i18n.t('feature.free.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {isLoading && imageQueue.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-400">{i18n.t('status.loading')}</p>
            </div>
          </div>
        ) : imageQueue.length === 0 ? (
          <UploadArea onFilesSelected={handleFilesSelected} disabled={isLoading} />
        ) : (
          <div>
            {/* Image Thumbnails */}
            {imageQueue.length > 1 && (
              <div className="mb-4 flex items-center space-x-3 overflow-x-auto pb-3">
                {imageQueue.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden
                      border-2 transition-all
                      ${
                        index === currentIndex
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-700 hover:border-blue-500'
                      }
                    `}
                  >
                    <img
                      src={item.originalUrl || ''}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {item.processedUrl && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Current Image Preview */}
            {currentItem && (
              <ImagePreview
                item={currentItem}
                onRemoveWatermark={() => handleRemoveWatermark(currentIndex)}
                onDownload={() => handleDownload(currentIndex)}
              />
            )}

            {/* Batch Actions */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleReset}
                className="group px-8 py-4 glass-light hover:scale-105 text-white font-semibold rounded-xl transition-all duration-300 btn-shine border-2 border-gray-600 hover:border-gray-500"
              >
                {i18n.t('btn.reset')}
              </button>
              {hasProcessedImages && (
                <button
                  onClick={handleDownloadAll}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75 hover:scale-105 btn-shine"
                >
                  {i18n.t('btn.downloadAll')}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
