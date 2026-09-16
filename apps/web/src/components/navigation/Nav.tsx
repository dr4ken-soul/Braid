'use client';

/**
 * Dual-pill split navigation.
 *
 * Brand pill left, action pill right. No logo mark. Braid renders as text.
 * Mobile renders a bottom bar with Braid, the current section, and one action.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SECTION_NAMES: Record<string, string> = {
  '/': 'Overview',
  '/conversation': 'Conversation',
  '/cases': 'Cases',
  '/evaluations': 'Evaluations',
};

const BRAND_PILL =
  'inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-veil)] px-4 py-2.5 font-display text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] backdrop-blur-md transition-colors duration-200 ease-out hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const ACTION_PILL =
  'flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--surface-veil)] p-1.5 backdrop-blur-md';

const NAV_LINK =
  'rounded-full px-3 py-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)] transition-colors duration-200 ease-out hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const PRIMARY_ACTION =
  'rounded-full bg-[var(--accent)] px-4 py-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-colors duration-200 ease-out hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]';

const MOBILE_BAR =
  'fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--surface-veil-strong)] p-2 backdrop-blur-md sm:hidden';

const MOBILE_LINK =
  'flex min-h-11 items-center rounded-xl px-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const MOBILE_PRIMARY =
  'flex min-h-11 items-center rounded-xl bg-[var(--accent)] px-4 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]';

/** Shared desktop and mobile dual-pill navigation. */
export function Nav() {
  const pathname = usePathname() ?? '/';
  const [sectionName, setSectionName] = useState(SECTION_NAMES[pathname] ?? 'Overview');

  useEffect(() => {
    setSectionName(SECTION_NAMES[pathname] ?? 'Overview');
  }, [pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[90] -translate-y-16 rounded-md bg-[var(--accent)] px-4 py-2 font-mono text-xs text-[var(--bg-primary)] transition-transform focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed left-0 right-0 top-0 z-50 hidden items-start justify-between px-5 py-5 sm:flex sm:px-8 lg:px-12 xl:px-16">
        <Link href="/" className={BRAND_PILL}>
          Braid
        </Link>
        <nav aria-label="Primary" className={ACTION_PILL}>
          <Link href="/conversation" className={NAV_LINK}>
            Conversation
          </Link>
          <Link href="/cases" className={NAV_LINK}>
            Cases
          </Link>
          <Link href="/evaluations" className={NAV_LINK}>
            Evaluations
          </Link>
          <Link href="/conversation" className={PRIMARY_ACTION}>
            Open a case
          </Link>
        </nav>
      </header>
      <nav aria-label="Mobile primary" className={MOBILE_BAR}>
        <Link href="/" className={MOBILE_LINK}>
          Braid
        </Link>
        <span aria-hidden="true" className="px-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {sectionName}
        </span>
        <Link href="/conversation" className={MOBILE_PRIMARY}>
          Open a case
        </Link>
      </nav>
    </>
  );
}
