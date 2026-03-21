import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const oswald = Oswald({
  variable: '--font-oswald',
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
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
