'use client';

/**
 * Section 9: closing action.
 *
 * Convert. One action, repeated from the hero: open a case. The supporting
 * line points at the console where the case can be inspected as an adjuster
 * would receive it.
 */

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const WRAPPER =
  'relative z-20 mx-auto grid min-h-[42rem] w-full max-w-[1440px] place-items-center border-t border-[var(--border-default)] px-5 py-24 text-center sm:px-8 lg:px-12 lg:py-40 xl:px-16';

const HEADLINE =
  'max-w-[10ch] font-display text-[clamp(3.5rem,9vw,9rem)] font-bold leading-[0.84] tracking-[-0.045em] text-[var(--text-primary)]';

const SUPPORTING =
  'mx-auto mt-6 max-w-[36rem] font-display text-lg leading-snug text-[var(--text-secondary)]';

const ACTION =
  'mt-10 inline-flex min-h-14 items-center justify-center rounded-md bg-[var(--accent)] px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]';

export function ClosingAction() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section ref={containerRef} id="closing" aria-labelledby="closing-heading" className={WRAPPER}>
      <div data-reveal>
        <h2 id="closing-heading" className={HEADLINE}>
          Judgment stays human
        </h2>
        <p className={SUPPORTING}>
          Braid braids the claim transcript with the claim, policy, and repair records, marks every
          contradiction it finds, and hands the packet to an adjuster. Coverage, liability, and
          payment decisions are never made by the system.
        </p>
        <div className="grid place-items-center">
          <Link href="/conversation" className={ACTION}>
            Open a case
          </Link>
        </div>
        <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Seeded case files FNOL-2026-0142 through FNOL-2026-0147 on the cases board
        </p>
      </div>
    </section>
  );
}
