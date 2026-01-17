'use client';

import dynamic from 'next/dynamic';

// Dynamically import the WatermarkRemover with no SSR
const WatermarkRemover = dynamic(() => import('@/components/WatermarkRemover'), {
  ssr: false,
});

export default function Home() {
  return <WatermarkRemover />;
}
