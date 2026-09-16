'use client';

/**
 * Section 8: institutional integration.
 *
 * Reassure and explain. Six named systems in one strip. Direction flows left
 * to right and is explained in text; no connector library and no third-party
 * icons are used.
 */

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const LAYOUT =
  'relative z-20 mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16';

const STRIP =
  'grid grid-cols-1 gap-px border border-[var(--border-default)] bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-6';

const NODE = 'min-h-40 bg-[var(--bg-surface)] p-5';

const NODE_NAME =
  'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-primary)]';

const NODE_BODY = 'mt-3 font-display text-sm leading-snug text-[var(--text-secondary)]';

const NODES = [
  {
    name: 'Caller',
    body: 'Speaks on a recorded line and hears the AI disclosure before anything else.',
  },
  {
    name: 'ElevenLabs Agent',
    body: 'Runs the Braid voice workflow with the approved prompt, tools, and guard rules.',
  },
  {
    name: 'Knowledge Base',
    body: 'Read-only source for policy wording and document requirements.',
  },
  {
    name: 'Claims System',
    body: 'Sandbox claim and policy records read through the claims-record tool.',
  },
  {
    name: 'Adjuster Queue',
    body: 'Where the evidence packet waits for a named human adjuster.',
  },
  {
    name: 'Audit Store',
    body: 'Every transcript segment, tool call, and guard decision is written here.',
  },
];

export function InstitutionalIntegration() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  return (
    <section
      ref={containerRef}
      id="integration"
      aria-labelledby="integration-heading"
      className={LAYOUT}
    >
      <div data-reveal>
        <SectionHeading
          index="08"
          kicker="Institutional integration"
          title="Six systems, one record"
          body="Direction flows left to right. The caller speaks to the agent, the agent reads the knowledge base and the claims system through its tools, the completed packet waits in the adjuster queue, and every step is written to the audit store. Claims and repair systems stay read-only for the agent. Tool calls never mutate records."
        />
        <div className={STRIP}>
          {NODES.map((node) => (
            <div key={node.name} className={NODE}>
              <div className="flex items-center justify-between gap-2">
                <p className={NODE_NAME}>{node.name}</p>
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.6875rem] text-[var(--text-muted)]"
                >
                  {'>'}
                </span>
              </div>
              <p className={NODE_BODY}>{node.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
