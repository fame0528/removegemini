/**
 * Upload Area Component
 * @fileoverview Drag-and-drop upload area for images
 */

'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { i18n } from '@/lib/i18n';

interface UploadAreaProps {
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
}

export function UploadArea({ onFilesSelected, disabled = false }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-3xl p-16
        transition-all duration-300 cursor-pointer
        ${isDragging
          ? 'border-blue-500 glass-light scale-105 shadow-2xl shadow-blue-500/30'
          : disabled
          ? 'border-gray-700 glass cursor-not-allowed opacity-50'
          : 'border-gray-600 glass hover:border-blue-400 hover:scale-102 hover:shadow-xl card-hover'
        }
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Upload Icon */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 rounded-full blur-2xl transition-all ${
            isDragging ? 'bg-blue-500 opacity-60' : 'bg-blue-500 opacity-30'
          }`}></div>
          <div
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center transition-all
              ${isDragging ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110' : 'bg-gradient-to-br from-gray-700 to-gray-800'}
            `}
          >
          <svg
            className={`w-10 h-10 transition-colors ${
              isDragging ? 'text-white' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          </div>
        </div>

        {/* Upload Text */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold text-white mb-2">
            {i18n.t('upload.text')}
          </p>
          <p className="text-base text-gray-400">{i18n.t('upload.hint')}</p>
        </div>

        {/* Steps */}
        <div className="flex items-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-sm text-gray-300">{i18n.t('step.1')}</span>
          </div>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm text-gray-300">{i18n.t('step.2')}</span>
          </div>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-sm text-gray-300">{i18n.t('step.3')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
