import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ClipBridge',
  description: 'The trusted marketplace connecting brands with content creators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
