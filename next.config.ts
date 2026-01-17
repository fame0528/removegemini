import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Professional Vercel deployment configuration
  // All processing happens client-side for privacy
  images: {
    unoptimized: true, // Images processed client-side only
  },
  webpack: (config) => {
    // Handle image assets properly
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
