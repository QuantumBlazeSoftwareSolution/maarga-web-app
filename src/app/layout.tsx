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

export const metadata: Metadata = {
  title: 'Maarga - Fuel Station Finder',
  description: 'Never Run on Empty Again. Find the nearest fuel stations, check real-time availability, and get turn-by-turn directions instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${oswald.variable} ${plusJakartaSans.variable} antialiased font-sans`}>
        <SplashLoader />
        {children}
      </body>
    </html>
  );
}
