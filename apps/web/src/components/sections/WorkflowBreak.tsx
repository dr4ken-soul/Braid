'use client';

/**
 * Section 2: workflow break.
 *
 * Educates on the intake pipeline while staying honest about timings. No
 * fabricated numbers: where elapsed data is not measured, the strip labels
 * it baseline required. Node content names the guards that hold workshops
 * and reviewers accountable.
 */

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const LAYOUT =
  'relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-40 xl:px-16';

const STATEMENT =
  'max-w-[9ch] font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.86] tracking-[-0.04em] text-[var(--text-primary)]';

const STRIP =
  'grid grid-cols-1 gap-px border border-[var(--border-default)] bg-[var(--border-default)] sm:grid-cols-5';

const NODE =
  'min-h-36 bg-[var(--bg-surface)] p-4 transition-colors duration-200 ease-out hover:bg-[var(--bg-elevated)]';

const NODE_TITLE = 'font-display text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)]';

const NODE_BODY = 'mt-3 font-display text-sm leading-snug text-[var(--text-secondary)]';

const NODE_MONO = 'mt-4 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const NODE_TIME = 'mt-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]';

const NODES = [
  {
    title: 'Disclosure',
    body: 'The agent names itself as an AI and states record keeping before any intake question.',
    item: 'node 1',
    timing: 'baseline required',
  },
  {
    title: 'Intake',
    body: 'The claimant account is captured with timestamps so every line becomes addressable.',
    item: 'node 2',
    timing: 'baseline required',
  },
  {
    title: 'Evidence',
    body: 'Facts are extracted with a value, a transcript span, and a confidence score.',
    item: 'node 3',
    timing: 'baseline required',
  },
  {
    title: 'Comparison',
    body: 'Claim, policy, and repair records are compared with the spoken account.',
    item: 'node 4',
    timing: 'baseline required',
  },
  {
    title: 'Human handoff',
    body: 'Unresolved conflicts and caller questions route to a queue. Braid does not decide.',
    item: 'node 5',
    timing: 'baseline required',
  },
];

export function WorkflowBreak() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section ref={containerRef} id="workflow" aria-labelledby="workflow-heading" className={LAYOUT}>
      <div data-reveal>
        <SectionHeading
          index="02"
          kicker="Workflow"
          title="One disclosed path"
        />
        <p className={STATEMENT}>
          Hear, structure, reconcile, escalate.
        </p>
      </div>
      <div data-reveal className="grid content-center gap-6">
        <div className={STRIP}>
          {NODES.map((node) => (
            <article key={node.title} className={NODE}>
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)]">
                {node.item}
              </p>
              <h3 className={`${NODE_TITLE} mt-3`}>{node.title}</h3>
              <p className={NODE_BODY}>{node.body}</p>
              <p className={NODE_MONO}>Elapsed time</p>
              <p className={NODE_TIME}>{node.timing}</p>
            </article>
          ))}
        </div>
        <p className="max-w-[36rem] font-display text-base leading-snug text-[var(--text-secondary)]">
          Timings shown are baseline placeholders, not measured results. The build records real
          tool latency per call, and those values appear in the audit explorer on live cases.
        </p>
      </div>
    </section>
  );
}
