import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Static export for 100% client-side operation
  images: {
    unoptimized: true, // Required for static export
  },
  webpack: (config) => {
    // Handle PNG images as assets
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;
