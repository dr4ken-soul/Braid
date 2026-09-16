'use client';

/**
 * Section 6: human handoff.
 *
 * Converts evidence into a controlled institutional action. The timeline
 * shows the reduction from claim call to packet. The primary action stays
 * disabled until a case has a transcript, extracted facts, source
 * references, an escalation reason, and a human queue target.
 */

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const LAYOUT =
  'relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-12 lg:py-40 xl:px-16';

const TIMELINE = 'relative border-l border-[var(--border-default)] pl-6';

const TIMELINE_ITEM = 'relative pb-10 last:pb-0';

const TIMELINE_MARKER =
  'absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--accent)]';

const TIMELINE_TITLE = 'font-display text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)]';

const TIMELINE_BODY = 'mt-2 max-w-[32rem] font-display text-base leading-snug text-[var(--text-secondary)]';

const TIMELINE_REF = 'mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const TRACK_STEPS = [
  {
    title: 'Transcript captured',
    body: 'The full call transcript is stored with speakers, timestamps, and workflow nodes. Nothing is summarized away.',
    ref: 'segments stored per conversation',
  },
  {
    title: 'Facts extracted with sources',
    body: 'Each field carries a value, a confidence score, and the transcript span or record it came from.',
    ref: 'evidence items with source spans',
  },
  {
    title: 'Records retrieved',
    body: 'Claim, policy, and repair records are pulled from the institutional systems. Availability is stated, never assumed.',
    ref: 'tool calls with observations',
  },
  {
    title: 'Contradiction detected',
    body: 'When two sources disagree, the conflict is written down with both values and a plain reason it cannot be resolved by Braid.',
    ref: 'contradictions stay visible',
  },
  {
    title: 'Packet routed',
    body: 'The adjuster packet leaves with the escalation reason, references, follow ups, and the caller questions. The decision is not in the packet.',
    ref: 'queue acceptance recorded',
  },
];

export function HumanHandoff() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section ref={containerRef} id="handoff" aria-labelledby="handoff-heading" className={LAYOUT}>
      <div data-reveal>
        <SectionHeading
          index="06"
          kicker="Human handoff"
          title="Decisions stay with people"
        />
        <ol className={TIMELINE}>
          {TRACK_STEPS.map((step) => (
            <li key={step.title} className={TIMELINE_ITEM}>
              <span className={TIMELINE_MARKER} aria-hidden="true" />
              <h3 className={TIMELINE_TITLE}>{step.title}</h3>
              <p className={TIMELINE_BODY}>{step.body}</p>
              <p className={TIMELINE_REF}>{step.ref}</p>
            </li>
          ))}
        </ol>
      </div>

      <div data-reveal className="grid content-center">
        <div className="grid gap-6 border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-10">
          <div className="grid gap-2">
            <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)]">
              Adjuster queue action
            </p>
            <h3 className="font-display text-3xl font-semibold leading-[0.98] tracking-[-0.01em] text-[var(--text-primary)]">
              Send the packet
            </h3>
            <p className="mt-2 font-display text-base leading-snug text-[var(--text-secondary)]">
              On a case review this action routes the evidence packet to a named queue and
              records acceptance. It is unavailable until the case holds everything an adjuster
              needs to make the call: a transcript, extracted facts, source references, an
              escalation reason, and a queue target.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex min-h-14 w-full items-center justify-center rounded-md bg-[var(--accent)] px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Route to adjuster
          </button>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Disabled on this page. The action is usable on a case review with complete evidence.
          </p>
        </div>
      </div>
    </section>
  );
}
