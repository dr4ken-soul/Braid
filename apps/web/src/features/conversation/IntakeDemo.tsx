'use client';

/**
 * Scripted intake replay. Picks a language and a recorded scenario, runs the
 * same synthetic intake pipeline the agent uses, and shows the resulting case:
 * transcript, extracted evidence, tool calls, and system events. It never makes
 * a live call and never decides a claim.
 */

import { useState } from 'react';
import Link from 'next/link';
import { ErrorState, OutcomeBadge, Skeleton, StatePill } from '@braid/ui';
import type { CaseDetail, Scenario } from '@braid/domain';
import { BraidApiError, createCase } from '@/lib/api';
import { TranscriptRowView, caseState } from '@/features/cases/CaseReviewParts';
import { EvidenceRow } from '@/features/evidence/EvidenceRow';
import {
  formatOffset,
  formatTimestamp,
  languageLabel,
  scenarioLabel,
} from '@/lib/format';

const PAGE = 'mx-auto w-full max-w-[1440px] px-5 pt-10 pb-24 sm:px-8 lg:px-12 xl:px-16';

const TITLE =
  'font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-[var(--text-primary)]';

const LABEL =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const NOTICE =
  'font-mono text-xs leading-relaxed text-[var(--text-secondary)]';

const SUBMIT =
  'inline-flex min-h-14 items-center justify-center rounded-md bg-[var(--accent)] px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50';

const LINK =
  'inline-flex items-center gap-2 rounded-sm font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)] underline-offset-4 transition-colors duration-200 ease-out hover:text-[var(--text-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const OPTION =
  'flex min-h-11 items-center gap-3 rounded-md border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-3 font-mono text-xs text-[var(--text-primary)] focus-within:ring-2 focus-within:ring-[var(--accent)]';

const CARD = 'grid gap-3 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5';

const MONO_LABEL =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const MONO_LINE = 'font-mono text-xs leading-relaxed text-[var(--text-secondary)]';

const TOOL_HEAD =
  'flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-secondary)]';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
] as const;

const SCENARIO_OPTIONS = [
  { value: 'complete', label: 'Complete account' },
  { value: 'contradiction', label: 'Contradiction' },
  { value: 'dependency-failure', label: 'Dependency failure' },
] as const;

export function IntakeDemo() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [scenario, setScenario] = useState<Scenario>('complete');
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setFailure(null);
    try {
      const response = await createCase({ language, scenario });
      setDetail(response.case);
    } catch (error) {
      setFailure(
        error instanceof BraidApiError
          ? error.message
          : 'The demo intake could not be completed.',
      );
      setDetail(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={PAGE}>
      <header className="grid gap-6">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          Web demo intake
        </p>
        <h1 className={TITLE}>Replay a scripted intake</h1>
        <p className={NOTICE}>
          Scripted web demo intake. This replays recorded synthetic intake flows. It is not a live
          phone call.
        </p>
      </header>

      <section className="mt-12 grid gap-8" aria-label="Demo intake controls">
        <fieldset className="grid gap-2">
          <legend className={LABEL}>Language</legend>
          <div className="grid gap-2 sm:grid-cols-2 sm:max-w-[24rem]">
            {LANGUAGE_OPTIONS.map((option) => (
              <label key={option.value} className={OPTION}>
                <input
                  type="radio"
                  name="demo-language"
                  value={option.value}
                  checked={language === option.value}
                  onChange={() => setLanguage(option.value)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className={LABEL}>Recorded scenario</legend>
          <div className="grid gap-2 sm:grid-cols-3 sm:max-w-[40rem]">
            {SCENARIO_OPTIONS.map((option) => (
              <label key={option.value} className={OPTION}>
                <input
                  type="radio"
                  name="demo-scenario"
                  value={option.value}
                  checked={scenario === option.value}
                  onChange={() => setScenario(option.value)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={submit} disabled={submitting} className={SUBMIT}>
          {submitting ? 'Running intake' : 'Run demo intake'}
        </button>
      </section>

      {submitting && (
        <section className="mt-12 grid gap-4" aria-live="polite">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-80 max-w-full" />
          <Skeleton className="h-32 w-full" />
        </section>
      )}

      {failure && !submitting && (
        <section className="mt-12">
          <ErrorState
            title="Demo intake failed"
            body={failure}
            retry={
              <button type="button" onClick={submit} className={SUBMIT}>
                Retry
              </button>
            }
          />
        </section>
      )}

      {detail && !submitting && (
        <section className="mt-16 grid gap-10 border-t border-[var(--border-subtle)] pt-12">
          <div className="grid gap-4">
            <p className="flex flex-wrap items-center gap-3">
              <StatePill state={caseState(detail)} />
              <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                {detail.externalReference}
              </span>
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
              {detail.claimant.displayName} · {scenarioLabel(detail.scenario)} ·{' '}
              {languageLabel(detail.language)}
            </h2>
            <p className={MONO_LINE}>
              created {formatTimestamp(detail.createdAt)} · status {detail.status}
            </p>
            <Link href={`/cases/${detail.caseId}`} className={LINK}>
              Open this case in the case review &rarr;
            </Link>
          </div>

          <div className="grid gap-3">
            <p className={MONO_LABEL}>Transcript</p>
            <TranscriptRowView segments={detail.transcript} />
          </div>

          <div className="grid gap-3">
            <p className={MONO_LABEL}>Extracted evidence</p>
            <ul>
              {detail.evidence.map((item) => (
                <EvidenceRow key={item.id} item={item} />
              ))}
            </ul>
          </div>

          <div className="grid gap-4">
            <p className={MONO_LABEL}>Tool calls, in call order</p>
            <div className="grid gap-4">
              {[...detail.toolCalls]
                .sort((left, right) => left.offsetMs - right.offsetMs)
                .map((call) => (
                  <article key={call.id} className={CARD}>
                    <div className={TOOL_HEAD}>
                      <span className="text-[var(--text-primary)]">{call.toolName}</span>
                      <span>
                        recorded {formatOffset(call.offsetMs)} into the call · latency{' '}
                        {call.latencyMs} ms
                      </span>
                      <OutcomeBadge outcome={call.outcome} className="justify-self-end" />
                    </div>
                  </article>
                ))}
            </div>
          </div>

          {detail.scenario === 'dependency-failure' && (
            <div className={CARD} role="status">
              <p className={MONO_LABEL}>System events</p>
              <ul className="grid gap-2">
                {detail.analysis.systemEvents.map((event) => (
                  <li key={event.id} className={MONO_LINE}>
                    {formatTimestamp(event.at)} · {event.kind} · {event.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.analysis.postCall && (
            <div className={CARD}>
              <p className={MONO_LABEL}>Next action</p>
              <p className="max-w-[46rem] font-display text-base leading-snug text-[var(--text-secondary)]">
                {detail.analysis.postCall.nextAction}
              </p>
              <p className="max-w-[46rem] font-display text-base leading-snug text-[var(--text-secondary)]">
                {detail.analysis.postCall.decisionBoundary}
              </p>
            </div>
          )}

          <p className="max-w-[46rem] font-display text-base leading-snug text-[var(--text-secondary)]">
            This replay ends with structured facts and a human handoff record. Braid does not decide
            liability, coverage, settlement, payment, fraud, or closure.
          </p>
        </section>
      )}
    </div>
  );
}
