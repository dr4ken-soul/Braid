/**
 * Footer landmark. Renders the decision boundary statement verbatim from the
 * domain package and text links. Braid stays text only.
 */

import Link from 'next/link';
import { DECISION_BOUNDARY_STATEMENT } from '@braid/domain';

const FOOTER_LINK =
  'rounded-sm font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)] underline-offset-4 transition-colors duration-200 ease-out hover:text-[var(--text-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 xl:px-16">
        <div className="grid gap-4">
          <p className="font-display text-3xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            Braid
          </p>
          <p className="max-w-[34rem] font-display text-lg leading-snug text-[var(--text-secondary)]">
            {DECISION_BOUNDARY_STATEMENT}
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Voice AI challenge build. All claim and claimant data shown is synthetic.
          </p>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-3">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Console
          </p>
          <Link href="/conversation" className={FOOTER_LINK}>
            Conversation
          </Link>
          <Link href="/cases" className={FOOTER_LINK}>
            Cases
          </Link>
          <Link href="/evaluations" className={FOOTER_LINK}>
            Evaluations
          </Link>
        </nav>
      </div>
    </footer>
  );
}
