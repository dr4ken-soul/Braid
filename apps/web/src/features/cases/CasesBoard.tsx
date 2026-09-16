'use client';

/**
 * Cases board. Filterable list over seeded synthetic cases. Loading uses
 * skeletons, failures get a retry, and an empty filter result states itself.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EmptyState, ErrorState, RiskState, Skeleton, StatePill } from '@braid/ui';
import type { CaseSummary } from '@braid/domain';
import { BraidApiError, listCases } from '@/lib/api';
import { formatTimestamp, languageLabel, scenarioLabel, statusLabel } from '@/lib/format';

const PAGE_HEAD =
  'mx-auto w-full max-w-[1440px] px-5 pt-10 pb-12 sm:px-8 lg:px-12 xl:px-16';

const TITLE =
  'font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-[var(--text-primary)]';

const FILTER_ROW = 'mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-[40rem]';

const LABEL =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const CONTROL =
  'w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-3 font-mono text-xs text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const BOARD = 'mx-auto grid w-full max-w-[1440px] gap-px bg-[var(--border-default)] px-4 sm:px-8 lg:px-12 xl:px-16';

const ROW = 'grid gap-4 bg-[var(--bg-surface)] p-6 sm:grid-cols-[10rem_1fr_auto] sm:p-8';

const REF = 'font-mono text-sm font-semibold uppercase tracking-[0.04em] text-[var(--text-primary)]';

const META = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const NAME = 'font-display text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)]';

const BADGES = 'grid justify-items-start gap-2 sm:justify-items-end';

type LoadState = 'loading' | 'ready' | 'error';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'intake', label: 'Intake' },
  { value: 'review', label: 'Review' },
  { value: 'handoff', label: 'Handoff' },
  { value: 'closed', label: 'Closed' },
];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'All languages' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
];

export function CasesBoard() {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [message, setMessage] = useState('The Braid service could not list cases.');
  const [statusFilter, setStatusFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setCases(null);
    setState('loading');
    listCases({
      status: statusFilter || undefined,
      language: languageFilter || undefined,
    })
      .then((response) => {
        if (cancelled) return;
        setCases(response.cases);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setMessage(
          error instanceof BraidApiError
            ? error.message
            : 'The Braid service could not list cases.',
        );
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [statusFilter, languageFilter, reloadToken]);

  function handoffPill(state: CaseSummary['handoffState']) {
    if (state === 'pending') return <StatePill state="handoff-pending" />;
    if (state === 'accepted') return <StatePill state="handoff-accepted" />;
    if (state === 'failed') return <StatePill state="handoff-failed" />;
    return null;
  }

  return (
    <div className="grid gap-12 pb-24">
      <header className={PAGE_HEAD}>
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          Cases board
        </p>
        <h1 className={TITLE}>Seeded case files</h1>
        <p className="mt-6 max-w-[44rem] font-display text-xl leading-snug text-[var(--text-secondary)]">
          Six synthetic FNOL cases recorded by scripted intake calls. Open one to read the case
          exactly as an adjuster would receive it.
        </p>
        <div className={FILTER_ROW}>
          <div className="grid gap-2">
            <label className={LABEL} htmlFor="cases-status-filter">
              Status
            </label>
            <select
              id="cases-status-filter"
              className={CONTROL}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className={LABEL} htmlFor="cases-language-filter">
              Language
            </label>
            <select
              id="cases-language-filter"
              className={CONTROL}
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {state === 'loading' && (
        <div className={BOARD}>
          {[0, 1, 2].map((row) => (
            <div key={row} className="bg-[var(--bg-surface)] p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-[10rem_1fr_auto]">
                <Skeleton className="h-5 w-32" />
                <div className="grid gap-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {state === 'error' && (
        <div className={BOARD}>
          <div className="bg-[var(--bg-surface)] p-6 sm:p-8">
            <ErrorState
              title="Cases could not be read"
              body={message}
              retry={
                <button
                  type="button"
                  onClick={() => setReloadToken((token) => token + 1)}
                  className="rounded-md bg-[var(--accent)] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] hover:bg-[var(--accent-hover)]"
                >
                  Retry
                </button>
              }
            />
            <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Start the API from the project root with npm run dev:api, then retry.
            </p>
          </div>
        </div>
      )}

      {state === 'ready' && cases && cases.length === 0 && (
        <div className={BOARD}>
          <div className="bg-[var(--bg-surface)] p-6 sm:p-8">
            <EmptyState
              title="Nothing under these filters"
              body="No case matches the selected status and language pair. Clear a filter to see the seeded set."
            />
          </div>
        </div>
      )}

      {state === 'ready' && cases && cases.length > 0 && (
        <div className={BOARD}>
          {cases.map((row) => (
            <Link key={row.caseId} href={`/cases/${row.caseId}`} className="block">
              <article className={ROW}>
                <div className="grid gap-2">
                  <p className={REF}>{row.externalReference}</p>
                  <p className={META}>{formatTimestamp(row.createdAt)}</p>
                </div>
                <div className="grid gap-2">
                  <p className={NAME}>{row.claimantDisplayName}</p>
                  <p className={META}>
                    {scenarioLabel(row.scenario)} · {languageLabel(row.language)} ·{' '}
                    {statusLabel(row.status)} · {row.evidenceCount} fields ·{' '}
                    {row.transcriptSegments} transcript segments
                  </p>
                </div>
                <div className={BADGES}>
                  {row.openContradictions > 0 && (
                    <RiskState
                      label={`${row.openContradictions} open contradiction${row.openContradictions === 1 ? '' : 's'}`}
                      tone="error"
                    />
                  )}
                  {handoffPill(row.handoffState)}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
