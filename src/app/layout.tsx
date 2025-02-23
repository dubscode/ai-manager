import '@/styles/globals.css';

import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Manager',
  description: 'Replace your boss with a bot!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className='dark'
    >
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
        >
          {children}
          <SpeedInsights />
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  );
}
