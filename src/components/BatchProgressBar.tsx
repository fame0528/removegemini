/**
 * Batch Progress Bar Component
 * @fileoverview Visual progress indicator for batch watermark removal operations
 */

'use client';

import { useEffect, useState } from 'react';
import type { BatchProgress, BatchState } from '@/types';
import { i18n } from '@/lib/i18n';

interface BatchProgressBarProps {
  /** Batch processing state */
  state: BatchState;
  /** Progress information */
  progress: BatchProgress;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
}

/**
 * BatchProgressBar Component
 * 
 * Displays real-time progress for batch watermark removal with statistics.
 * 
 * @example
 * ```tsx
 * <BatchProgressBar
 *   state={batchState}
 *   progress={batchProgress}
 *   onCancel={() => cancelBatch()}
 * />
 * ```
 */
export function BatchProgressBar({ state, progress, onCancel }: BatchProgressBarProps) {
  const [statusText, setStatusText] = useState('');
  const [statsText, setStatsText] = useState('');

  useEffect(() => {
    // Update status text based on state
    if (state === 'processing') {
      setStatusText(
        i18n.t('batch.processing', {
          current: progress.processed.toString(),
          total: progress.total.toString(),
        })
      );
    } else if (state === 'complete') {
      setStatusText(
        i18n.t('batch.complete', {
          success: progress.success.toString(),
          total: progress.total.toString(),
        })
      );
    } else if (state === 'cancelled') {
      setStatusText(i18n.t('batch.cancelled'));
    }

    // Update stats text
    if (progress.total > 0) {
      setStatsText(
        i18n.t('batch.stats', {
          success: progress.success.toString(),
          failed: progress.failed.toString(),
        })
      );
    }
  }, [state, progress]);

  // Subscribe to locale changes
  useEffect(() => {
    const unsubscribe = i18n.onChange(() => {
      // Force update by re-setting status
      if (state === 'processing') {
        setStatusText(
          i18n.t('batch.processing', {
            current: progress.processed.toString(),
            total: progress.total.toString(),
          })
        );
      }
    });

    return unsubscribe;
  }, [state, progress]);

  if (state === 'idle' || progress.total === 0) {
    return null;
  }

  return (
    <div className="mb-6 glass rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {i18n.t('progress.text')}
          </h3>
          <p className="text-sm text-gray-400">{statusText}</p>
        </div>
        {state === 'processing' && onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-200 border border-red-500/30"
          >
            {i18n.t('btn.cancelBatch')}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-700/50 rounded-full overflow-hidden mb-3">
        {/* Background glow */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          style={{
            width: `${progress.percentage}%`,
            transition: 'width 0.3s ease',
          }}
        />
        {/* Progress fill */}
        <div
          className="relative h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress.percentage}%` }}
        >
          {/* Animated shine effect */}
          {state === 'processing' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{statsText}</span>
        <span className="font-bold text-white">
          {progress.percentage}%
        </span>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {/* Total */}
        <div className="text-center p-2 rounded-lg bg-gray-700/30">
          <div className="text-2xl font-bold text-white">{progress.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>

        {/* Pending */}
        <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">{progress.pending}</div>
          <div className="text-xs text-yellow-400/80">Pending</div>
        </div>

        {/* Success */}
        <div className="text-center p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">{progress.success}</div>
          <div className="text-xs text-green-400/80">Success</div>
        </div>

        {/* Failed */}
        <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">{progress.failed}</div>
          <div className="text-xs text-red-400/80">Failed</div>
        </div>
      </div>
    </div>
  );
}
