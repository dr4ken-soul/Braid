'use client';

/**
 * Section 3: case intake.
 *
 * Left: a real transcript column with speaker, node, and offset. Right: the
 * facts the agent extracted from those lines, each carrying a source badge
 * and a reference. Demonstrates that a transcript line becomes evidence only
 * when it has a source and confidence.
 */

import { SourceBadge } from '@braid/ui';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { confidenceLabel, fieldKeyLabel, formatOffset, sourceReferenceLabel } from '@/lib/format';

const LAYOUT =
  'relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-px bg-[var(--border-default)] px-4 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-12 xl:px-16';

const TRANSCRIPT_COLUMN =
  'bg-[var(--bg-secondary)] p-6 sm:p-10 lg:min-h-[38rem] lg:p-12';

const EXTRACTION_COLUMN =
  'bg-[var(--bg-surface)] p-6 sm:p-10 lg:min-h-[38rem] lg:p-12';

const COLUMN_HEADER =
  'mb-6 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]';

const SEGMENT =
  'grid gap-1 border-l-2 border-[var(--border-default)] pl-4 first:border-[var(--accent)]';

const SPEAKER = 'font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]';

const SEGMENT_TEXT = 'font-display text-lg leading-snug text-[var(--text-primary)]';

const SEGMENT_META = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const FACT_ROW =
  'grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--border-subtle)] py-4 last:border-b-0';

const FACT_VALUE = 'font-mono text-[0.8125rem] font-medium leading-[1.35] text-[var(--text-primary)]';

const FACT_LABEL = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const SEGMENTS = [
  {
    speaker: 'Agent',
    node: 'intake',
    offset: 31700,
    text: 'Please describe what happened. Include when it happened, where, the vehicle, the other party, and any damage you noticed.',
  },
  {
    speaker: 'Claimant',
    node: 'intake',
    offset: 36900,
    text: 'It was Sunday evening, around five forty, on Al Reem Street near the corniche. I was slowing for a red light by the marina entrance when a delivery van hit my car from behind. My car is a white sedan, plate Abu Dhabi 12345.',
  },
  {
    speaker: 'Claimant',
    node: 'intake',
    offset: 49800,
    text: 'The rear bumper is cracked and the boot does not close properly. My neck was a little sore the next morning, so I went to a clinic.',
  },
];

const FACTS = [
  {
    fieldKey: 'incident_date',
    valueText: '30 August 2026',
    sourceType: 'claimant',
    reference: 'segment:5',
    confidence: 0.94,
  },
  {
    fieldKey: 'incident_location',
    valueText: 'Al Reem Street near the corniche',
    sourceType: 'claimant',
    reference: 'segment:6',
    confidence: 0.92,
  },
  {
    fieldKey: 'vehicle_plate',
    valueText: 'Abu Dhabi 12345',
    sourceType: 'claimant',
    reference: 'segment:6',
    confidence: 0.88,
  },
  {
    fieldKey: 'damage_description',
    valueText: 'Rear bumper cracked, boot does not close',
    sourceType: 'claimant',
    reference: 'segment:7',
    confidence: 0.85,
  },
] as const;

export function CaseIntake() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section ref={containerRef} id="intake" aria-labelledby="intake-heading" className={LAYOUT}>
      <div data-reveal className={TRANSCRIPT_COLUMN}>
        <p className={COLUMN_HEADER}>Transcript, recorded and attributed</p>
        <div aria-live="polite">
          <ul className="grid gap-6">
            {SEGMENTS.map((segment) => (
              <li key={segment.offset} className={SEGMENT}>
                <p className={SPEAKER}>{segment.speaker}</p>
                <p className={SEGMENT_TEXT}>{segment.text}</p>
                <p className={SEGMENT_META}>
                  node {segment.node} · {formatOffset(segment.offset)} · transcript segment
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div data-reveal className={EXTRACTION_COLUMN}>
        <SectionHeading index="03" kicker="Case intake" title="What was said, structured" />
        <div className={COLUMN_HEADER}>Extracted facts</div>
        <ul>
          {FACTS.map((fact) => (
            <li key={fact.fieldKey} className={FACT_ROW}>
              <div className="grid gap-1">
                <p className={FACT_LABEL}>{fieldKeyLabel(fact.fieldKey)}</p>
                <p className={FACT_VALUE}>{fact.valueText}</p>
                <p className={FACT_LABEL}>
                  {sourceReferenceLabel(fact.reference)} · confidence {confidenceLabel(fact.confidence)}
                </p>
              </div>
              <SourceBadge source={fact.sourceType} />
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[30rem] font-display text-base leading-snug text-[var(--text-secondary)]">
          A transcript line is a statement. It becomes evidence at the moment it carries a source
          span, a value, and a confidence score. Missing fields are rendered as missing, never
          guessed.
        </p>
      </div>
    </section>
  );
}
