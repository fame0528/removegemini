import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RemoveGemini.com - Free AI Watermark Removal Tool',
  description:
    'Remove Gemini AI watermarks instantly. 100% free, private, and lossless. Browser-based watermark removal with no uploads. Remove watermarks from Google Gemini generated images.',
  keywords:
    'remove gemini watermark, gemini watermark remover, AI watermark removal, free watermark remover, removegemini.com, google gemini watermark, remove ai watermark',
  authors: [{ name: 'RemoveGemini.com' }],
  creator: 'RemoveGemini.com',
  publisher: 'RemoveGemini.com',
  applicationName: 'RemoveGemini.com',
  metadataBase: new URL('https://removegemini.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://removegemini.com',
    siteName: 'RemoveGemini.com',
    title: 'RemoveGemini.com - Free AI Watermark Removal Tool',
    description:
      'Remove Gemini AI watermarks instantly. 100% free, private, and lossless. Browser-based watermark removal with no uploads.',
    images: [
      {
        url: '/branding/logo-full.png',
        width: 1200,
        height: 630,
        alt: 'RemoveGemini.com - Free AI Watermark Removal Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RemoveGemini.com - Free AI Watermark Removal Tool',
    description:
      'Remove Gemini AI watermarks instantly. 100% free, private, and lossless.',
    images: ['/branding/logo-full.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
