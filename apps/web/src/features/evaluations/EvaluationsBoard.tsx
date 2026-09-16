'use client';

/**
 * Evaluation board. Multi-run Agent Testing results read from the Braid
 * service: aggregate pass rate, every evaluated scenario, and the recorded
 * tool gate outcomes per run. Failure reasons stay readable.
 */

import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, OutcomeBadge, Skeleton } from '@braid/ui';
import type { Evaluation, EvaluationSummary } from '@braid/domain';
import { BraidApiError, getEvaluations } from '@/lib/api';
import { formatTimestamp, languageLabel, passRateLabel } from '@/lib/format';

const PAGE_HEAD = 'mx-auto w-full max-w-[1440px] px-5 pt-10 pb-12 sm:px-8 lg:px-12 xl:px-16';

const TITLE =
  'font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-[var(--text-primary)]';

const STAT_GRID = 'mt-10 grid gap-px border border-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-5';

const STAT_CELL = 'grid gap-2 bg-[var(--bg-surface)] p-5';

const STAT_VALUE =
  'font-display text-3xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]';

const STAT_LABEL =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const BOARD =
  'mx-auto grid w-full max-w-[1440px] gap-px bg-[var(--border-default)] px-4 pb-24 sm:px-8 lg:px-12 xl:px-16';

const ROW = 'grid gap-4 bg-[var(--bg-surface)] p-6 sm:p-8';

const NAME = 'font-display text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)]';

const META = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const RUN_LABEL = 'font-mono text-xs leading-relaxed text-[var(--text-secondary)]';

function languageTextLabel(language: Evaluation['language']): string {
  if (language === 'en' || language === 'ar') return languageLabel(language);
  return language;
}

function categoryLabel(category: Evaluation['category']): string {
  if (category === 'tool-gate') return 'Tool gate';
  if (category === 'guardrail') return 'Guardrail';
  return 'Intake';
}

export function EvaluationsBoard() {
  const [evaluationData, setEvaluationData] = useState<EvaluationSummary | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('The Braid service could not read evaluation results.');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setEvaluationData(null);
    setState('loading');
    getEvaluations()
      .then((response) => {
        if (cancelled) return;
        setEvaluationData(response);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setMessage(
          error instanceof BraidApiError
            ? error.message
            : 'The Braid service could not read evaluation results.',
        );
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return (
    <div className="grid gap-12 pb-12">
      <header className={PAGE_HEAD}>
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          Evaluations
        </p>
        <h1 className={TITLE}>Recorded proof of the wiring</h1>
        <p className="mt-6 max-w-[44rem] font-display text-xl leading-snug text-[var(--text-secondary)]">
          Every evaluated scenario runs multiple times through Agent Testing. Intake behaviour,
          guardrails, and tool gates are verified against their recorded runs.
        </p>

        {state === 'loading' && (
          <div className={STAT_GRID}>
            {[0, 1, 2, 3, 4].map((cell) => (
              <div key={cell} className={STAT_CELL}>
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        )}

        {evaluationData && (
          <div className={STAT_GRID}>
            <div className={STAT_CELL}>
              <p className={STAT_VALUE}>{passRateLabel(evaluationData.aggregate.passRate)}</p>
              <p className={STAT_LABEL}>Aggregate pass rate</p>
            </div>
            <div className={STAT_CELL}>
              <p className={STAT_VALUE}>{evaluationData.aggregate.passed}</p>
              <p className={STAT_LABEL}>Passed of {evaluationData.aggregate.totalRuns} runs</p>
            </div>
            <div className={STAT_CELL}>
              <p className={STAT_VALUE}>{evaluationData.aggregate.scenarios}</p>
              <p className={STAT_LABEL}>Scenarios</p>
            </div>
            <div className={STAT_CELL}>
              <p className={STAT_VALUE}>{evaluationData.aggregate.runsPerScenario}</p>
              <p className={STAT_LABEL}>Runs per scenario</p>
            </div>
            <div className={STAT_CELL}>
              <p className="font-mono text-sm font-semibold leading-snug text-[var(--text-primary)]">
                {evaluationData.agentVersion}
              </p>
              <p className={STAT_LABEL}>Agent version</p>
            </div>
          </div>
        )}
      </header>

      {state === 'error' && (
        <div className={PAGE_HEAD}>
          <ErrorState
            title="Evaluation results could not be read"
            body={message}
            retry={
              <button
                type="button"
                onClick={() => setReloadToken((token) => token + 1)}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--accent)] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
              >
                Retry
              </button>
            }
          />
        </div>
      )}

      {state === 'ready' && evaluationData && evaluationData.evaluations.length === 0 && (
        <div className={PAGE_HEAD}>
          <EmptyState
            title="No evaluations on record"
            body="The Braid service holds no evaluation runs yet. Recorded results appear here once the Agent Testing suite has produced them."
          />
        </div>
      )}

      {state === 'ready' && evaluationData && evaluationData.evaluations.length > 0 && (
        <div className={BOARD}>
          {evaluationData.evaluations.map((evaluation) => {
            const passedRuns = evaluation.runs.filter((run) => run.passed).length;
            return (
              <article key={evaluation.evaluationId} className={ROW}>
                <div className="grid gap-2">
                  <h2 className={NAME}>{evaluation.name}</h2>
                  <p className={META}>
                    {evaluation.scenarioId} · {categoryLabel(evaluation.category)} ·{' '}
                    {languageTextLabel(evaluation.language)} · agent {evaluation.agentVersion}
                  </p>
                </div>
                <p className={META}>
                  {passedRuns}/{evaluation.runs.length} runs passed · pass rate{' '}
                  {passRateLabel(evaluation.passRate)} · last run{' '}
                  {formatTimestamp(evaluation.lastRunAt)}
                </p>
                <ul className="grid gap-2">
                  {evaluation.runs.map((run) => (
                    <li key={run.run} className="grid gap-2 border-t border-[var(--border-subtle)] pt-3">
                      <p className={RUN_LABEL}>
                        run {run.run} ·{' '}
                        <span
                          className={
                            run.passed
                              ? 'text-[var(--success)]'
                              : 'text-[var(--warning)]'
                          }
                        >
                          {run.passed ? 'passed' : 'failed'}
                        </span>
                      </p>
                      <p className={RUN_LABEL}>{run.reason}</p>
                      {run.toolCalls.length > 0 && (
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[var(--text-secondary)]">
                          {run.toolCalls.map((call, index) => (
                            <span
                              key={`${run.run}-${call.toolName}-${index}`}
                              className="flex items-center gap-2"
                            >
                              {call.toolName}
                              <OutcomeBadge outcome={call.outcome} />
                            </span>
                          ))}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
