import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RemoveGemini.com - Free AI Watermark Removal Tool',
  description:
    'Remove Gemini AI watermarks instantly. 100% free, private, and lossless. Browser-based watermark removal with no uploads.',
  keywords:
    'remove gemini watermark, gemini watermark remover, AI watermark removal, free watermark remover, removegemini.com',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
