/**
 * Image Preview Component
 * @fileoverview Side-by-side image comparison with zoom
 */

'use client';

import { useEffect, useRef } from 'react';
import type { ImageQueueItem } from '@/types';
import { i18n } from '@/lib/i18n';
import mediumZoom from 'medium-zoom';

interface ImagePreviewProps {
  item: ImageQueueItem;
  onRemoveWatermark: () => void;
  onDownload: () => void;
}

export function ImagePreview({ item, onRemoveWatermark, onDownload }: ImagePreviewProps) {
  const originalImgRef = useRef<HTMLImageElement>(null);
  const processedImgRef = useRef<HTMLImageElement>(null);
  const zoomOriginal = useRef<any>(null);
  const zoomProcessed = useRef<any>(null);

  useEffect(() => {
    // Clean up existing zoom instances
    if (zoomOriginal.current) {
      zoomOriginal.current.detach();
    }
    if (zoomProcessed.current) {
      zoomProcessed.current.detach();
    }

    // Initialize medium-zoom on original image
    if (originalImgRef.current) {
      zoomOriginal.current = mediumZoom(originalImgRef.current, {
        background: 'rgba(0, 0, 0, 0.9)',
        margin: 48,
      });
    }

    // Initialize medium-zoom on processed image
    if (processedImgRef.current && item.processedUrl) {
      zoomProcessed.current = mediumZoom(processedImgRef.current, {
        background: 'rgba(0, 0, 0, 0.9)',
        margin: 48,
      });
    }

    // Cleanup function
    return () => {
      if (zoomOriginal.current) {
        zoomOriginal.current.detach();
      }
      if (zoomProcessed.current) {
        zoomProcessed.current.detach();
      }
    };
  }, [item.processedUrl, item.originalUrl]);

  const formatSize = (width: number, height: number) => {
    return `${width} × ${height}`;
  };

  const getStatusColor = (status: ImageQueueItem['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: ImageQueueItem['status']) => {
    switch (status) {
      case 'success':
        return i18n.t('status.success');
      case 'processing':
        return i18n.t('status.processing');
      case 'failed':
        return i18n.t('status.failed');
      default:
        return i18n.t('status.pending');
    }
  };

  const getOriginalWarning = () => {
    if (!item.isOriginal) {
      return {
        text: i18n.t('original.not_original'),
        color: 'text-yellow-600 bg-yellow-50',
      };
    }
    return {
      text: i18n.t('original.pass'),
      color: 'text-green-600 bg-green-50',
    };
  };

  const warning = getOriginalWarning();

  return (
    <div className="space-y-4">
      {/* Image Comparison - Main Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Original */}
        <div className="group glass rounded-xl overflow-hidden card-hover">
          <div className="relative">
            <img
              ref={originalImgRef}
              src={item.originalUrl || ''}
              alt="Original"
              className="w-full h-auto max-h-[70vh] object-contain cursor-zoom-in"
            />
            {/* Compact overlay label */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg glass-light">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Original</span>
            </div>
          </div>
        </div>

        {/* Processed */}
        <div className="group glass rounded-xl overflow-hidden card-hover">
          <div className="relative min-h-[200px]">
            {item.processedUrl ? (
              <>
                <img
                  ref={processedImgRef}
                  src={item.processedUrl}
                  alt="Processed"
                  className="w-full h-auto max-h-[70vh] object-contain cursor-zoom-in"
                />
                {/* Compact overlay label with success indicator */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-md border border-green-500/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-300 uppercase tracking-wider">Watermark Removed</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px] bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <div className="text-center">
                  {item.status === 'processing' ? (
                    <>
                      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-400">Processing...</p>
                    </>
                  ) : (
                    <button
                      onClick={onRemoveWatermark}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 btn-shine"
                    >
                      Remove Watermark
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Info Bar - Below images, minimal height */}
      <div className="glass-light rounded-xl p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Key Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-400">{formatSize(item.originalImage.width, item.originalImage.height)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-sm text-gray-400">Watermark: {item.watermarkInfo.size}×{item.watermarkInfo.size}</span>
            </div>
            {item.isOriginal && (
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-green-500/10">
                <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-green-400">Original</span>
              </div>
            )}
          </div>

          {/* Right: Action Button */}
          {item.processedUrl && (
            <button
              onClick={onDownload}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 btn-shine shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
