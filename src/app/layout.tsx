import type { Metadata } from 'next';
import { Inter, Oswald, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SplashLoader from '@/src/components/SplashLoader';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});

const BASE_URL = 'https://maarga-web-app.vercel.app';

export const metadata: Metadata = {
  title: 'Maarga - Fuel Station Finder',
  description:
    'Never Run on Empty Again. Find the nearest fuel stations, check real-time availability, and get turn-by-turn directions instantly.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Maarga - Fuel Station Finder',
    description:
      'Never Run on Empty Again. Find the nearest fuel stations, check real-time availability, and get turn-by-turn directions instantly.',
    url: BASE_URL,
    siteName: 'Maarga',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1024,
        height: 1024,
        alt: 'Maarga - Fuel Station Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maarga - Fuel Station Finder',
    description: 'Never Run on Empty Again. Find the nearest fuel stations.',
    images: [`${BASE_URL}/og-image.png`],
  },
  icons: {
    icon: '/og-image.png',
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'icon', url: '/icon-192.png', sizes: '192x192' }],
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${oswald.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        <SplashLoader />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
