'use client';

/**
 * Section 5: contradiction desk.
 *
 * Compare and qualify. The comparison table says what differs, where each
 * value came from, and why the agent cannot resolve it. State is never
 * communicated through colour alone: text labels carry it.
 */

import { ContradictionStatusBadge, RiskState } from '@braid/ui';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { sourceReferenceLabel } from '@/lib/format';

const LAYOUT =
  'relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-px bg-[var(--border-default)] px-4 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-12 xl:px-16';

const PRIMARY_CARD = 'min-h-[28rem] bg-[var(--bg-surface)] p-6 sm:p-10';

const COMPARE_TABLE =
  'overflow-hidden border border-[var(--border-default)] bg-[var(--bg-secondary)]';

const TABLE_ROW =
  'grid grid-cols-[0.8fr_1fr_auto] gap-4 border-b border-[var(--border-subtle)] px-4 py-4 font-mono text-xs last:border-b-0';

const ASIDE_CARD = 'min-h-[28rem] bg-[var(--bg-secondary)] p-6 sm:p-10';

const COMPARE_ROWS = [
  {
    source: 'Claimant account',
    value: 'Rear door dented, window jammed, bumper intact',
    reference: 'segment:8',
  },
  {
    source: 'Repair record',
    value: 'Rear bumper replaced, tailgate realigned',
    reference: 'record:RPR-3329',
  },
];

export function ContradictionDesk() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section ref={containerRef} id="contradictions" aria-labelledby="contradictions-heading" className={LAYOUT}>
      <div data-reveal className={PRIMARY_CARD}>
        <SectionHeading index="05" kicker="Contradiction desk" title="Said compared with recorded" />
        <div className="relative grid gap-4 pb-6">
          <ContradictionStatusBadge status="escalated" />
          <div className={COMPARE_TABLE}>
            <div className={`${TABLE_ROW} bg-[var(--bg-secondary)]`}>
              <span className="text-[var(--text-muted)]">Field</span>
              <span className="text-[var(--text-primary)]">Damage location</span>
              <RiskState label="Conflict" tone="error" />
            </div>
            {COMPARE_ROWS.map((row) => (
              <div key={row.source} className={TABLE_ROW}>
                <span className="text-[var(--text-muted)]">{row.source}</span>
                <span className="text-[var(--text-primary)]">{row.value}</span>
                <span className="justify-self-end text-[var(--text-muted)]">
                  {sourceReferenceLabel(row.reference)}
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 border border-[var(--border-default)] bg-[var(--bg-primary)] p-5">
            <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Why Braid cannot resolve this
            </p>
            <p className="max-w-[52rem] font-display text-lg leading-snug text-[var(--text-primary)]">
              The claimant account and the repair record describe different damage to the same
              vehicle. Braid cannot resolve which account is correct, so the conflict stays
              visible, is marked escalated, and the case routes to a human adjuster with both
              values, both sources, and both references attached.
            </p>
          </div>
        </div>
      </div>

      <div data-reveal className={ASIDE_CARD}>
        <div className="grid h-full content-start gap-6">
          <div className="grid gap-2">
            <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Caller question, out of scope
            </p>
            <p className="font-display text-2xl font-semibold leading-[0.98] tracking-[-0.01em] text-[var(--text-primary)]">
              Is the rear door covered by my policy?
            </p>
            <p className="max-w-[24rem] font-display text-base leading-snug text-[var(--text-secondary)]">
              The agent records the question in the adjuster packet. It never answers coverage,
              liability, settlement, or payment questions.
            </p>
          </div>
          <div className="grid gap-3 border-t border-[var(--border-default)] pt-6">
            <RiskState label="Human review required" tone="error" />
            <p className="font-display text-base leading-snug text-[var(--text-secondary)]">
              Green would mean reconciled. Red means the guard held: the decision stopped where
              the data stopped and a person takes it from here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
