'use client';

/**
 * Section 4: evidence braid.
 *
 * Asymmetric 12 column bento grid. Each layer has a distinct data
 * responsibility and size:
 *   claimant account   md:col-span-5 md:row-span-2
 *   policy requirement md:col-span-3
 *   repair record      md:col-span-4
 *   system facts       md:col-span-4
 *   match summary      md:col-span-3
 */

import { LabelValue, RiskState, SourceBadge } from '@braid/ui';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const LAYOUT =
  'relative z-20 mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-40 xl:px-16';

const LAYERS =
  'grid grid-cols-1 gap-px border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-12';

const LAYER_CELL =
  'relative min-h-44 bg-[var(--bg-surface)] p-5 transition-colors duration-200 ease-out hover:bg-[var(--bg-elevated)] hover:translate-y-[-2px]';

const LAYER_TITLE = 'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const LAYER_HEADING = 'font-display text-2xl font-semibold leading-[0.98] tracking-[-0.01em] text-[var(--text-primary)]';

const LAYER_BODY = 'font-display text-base leading-snug text-[var(--text-secondary)]';

export function EvidenceBraid() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section ref={containerRef} id="evidence-braid" aria-labelledby="evidence-braid-heading" className={LAYOUT}>
      <SectionHeading
        index="04"
        kicker="Evidence braid"
        title="Four sources, one woven view"
        body="Braid is not a transcript summary tool. It braids the spoken account with the policy requirements, the repair record, and the system facts, so a reviewer sees their relationships in one view."
      />
      <div className={LAYERS}>
        <article data-reveal className={`${LAYER_CELL} md:col-span-5 md:row-span-2 md:min-h-96`}>
          <p className={LAYER_TITLE}>Claimant account</p>
          <h3 className={`${LAYER_HEADING} mt-2`}>The spoken account</h3>
          <p className={`${LAYER_BODY} mt-4`}>
            What the claimant said, separated from interpretation. Every line keeps its timestamp
            and speaker so a reviewer can replay the exact wording.
          </p>
          <ul className="mt-6 grid gap-px border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
            <li className="bg-[var(--bg-surface)] p-3">
              <div className="grid gap-1">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">00:38</p>
                <p className="font-mono text-[0.8125rem] leading-relaxed text-[var(--text-primary)]">
                  The rear bumper is cracked and the boot does not close properly.
                </p>
              </div>
            </li>
            <li className="bg-[var(--bg-surface)] p-3">
              <LabelValue label="Damage date" value="30 August 2026" />
              <LabelValue label="Location" value="Al Reem Street near the corniche" tone="muted" />
            </li>
          </ul>
        </article>

        <article data-reveal className={`${LAYER_CELL} md:col-span-3`}>
          <div className="flex items-baseline justify-between gap-2">
            <p className={LAYER_TITLE}>Policy requirements</p>
            <SourceBadge source="policy-record" />
          </div>
          <h3 className={`${LAYER_HEADING} mt-2`}>What the policy asks for</h3>
          <ul className="mt-4 grid gap-2 font-mono text-[0.8125rem] leading-[1.35] text-[var(--text-primary)]">
            <li>Police report, on file</li>
            <li>Repair estimate, on file</li>
            <li className="text-[var(--warning)]">Driving licence copy, missing</li>
          </ul>
        </article>

        <article data-reveal className={`${LAYER_CELL} md:col-span-4`}>
          <div className="flex items-baseline justify-between gap-2">
            <p className={LAYER_TITLE}>Repair record</p>
            <SourceBadge source="repair-record" />
          </div>
          <h3 className={`${LAYER_HEADING} mt-2`}>What the garage found</h3>
          <p className={`${LAYER_BODY} mt-4`}>
            Repair order RPR-3327 confirms the rear bumper and tailgate work that the claim
            account described, with an observation time recorded when the record was retrieved.
          </p>
          <LabelValue label="Assessment date" value="2026-09-01" className="mt-4" />
        </article>

        <article data-reveal className={`${LAYER_CELL} md:col-span-4`}>
          <p className={LAYER_TITLE}>System facts</p>
          <h3 className={`${LAYER_HEADING} mt-2`}>What the platform recorded</h3>
          <p className={`${LAYER_BODY} mt-4`}>
            Consent captured and retrievable, disclosure delivered as the first act of the call,
            tool observations timestamped per record, and reviewer views redacted on access.
          </p>
          <LabelValue label="Consent" value="Captured in call" tone="muted" className="mt-4" />
        </article>

        <article data-reveal className={`${LAYER_CELL} md:col-span-3`}>
          <p className={LAYER_TITLE}>Match summary</p>
          <h3 className={`${LAYER_HEADING} mt-2`}>Where it agrees</h3>
          <p className={`${LAYER_BODY} mt-4`}>
            Date, location, and vehicle match across account and records. Damage description
            matches the repair breakdown line by line.
          </p>
          <div className="mt-4 grid gap-2">
            <RiskState label="3 fields reconciled" tone="success" />
          </div>
        </article>
      </div>
    </section>
  );
}
