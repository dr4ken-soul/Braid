import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Nav } from '@/components/navigation/Nav';

export const metadata: Metadata = {
  title: 'Braid',
  description:
    'Braid turns a multilingual insurance claim call into a source-linked evidence packet for a human adjuster.',
};

/**
 * Root layout. Applies the page shell classes from the frontend specification.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-clip bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <Nav />
        <main id="main-content" className="relative pb-24 sm:pb-20">{children}</main>
      </body>
    </html>
  );
}
