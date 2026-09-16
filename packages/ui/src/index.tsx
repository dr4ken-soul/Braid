/**
 * Braid shared UI primitives.
 *
 * Every colour comes from the CSS tokens defined in apps/web globals.css.
 * No component may hardcode a hex value or use an emoji icon.
 */

import type { ReactNode } from 'react';
import type {
  ContradictionStatus,
  SourceType,
  ToolOutcome,
} from '@braid/domain';

export type UiState =
  | 'loading'
  | 'live'
  | 'stale'
  | 'unavailable'
  | 'empty'
  | 'error'
  | 'transcript-processing'
  | 'evidence-extracted'
  | 'contradiction-found'
  | 'handoff-pending'
  | 'handoff-accepted'
  | 'handoff-failed';

const STATE_LABELS: Record<UiState, string> = {
  loading: 'Loading',
  live: 'Live',
  stale: 'Stale',
  unavailable: 'Unavailable',
  empty: 'Empty',
  error: 'Error',
  'transcript-processing': 'Transcript processing',
  'evidence-extracted': 'Evidence extracted',
  'contradiction-found': 'Contradiction found',
  'handoff-pending': 'Handoff pending',
  'handoff-accepted': 'Handoff accepted',
  'handoff-failed': 'Handoff failed',
};

const STATE_TONE: Record<UiState, string> = {
  loading: 'border-[var(--border-default)] text-[var(--text-muted)]',
  live: 'border-[var(--info)] text-[var(--info)]',
  stale: 'border-[var(--text-muted)] text-[var(--text-muted)]',
  unavailable: 'border-[var(--error)] text-[var(--error)]',
  empty: 'border-[var(--border-default)] text-[var(--text-muted)]',
  error: 'border-[var(--error)] text-[var(--error)]',
  'transcript-processing': 'border-[var(--info)] text-[var(--info)]',
  'evidence-extracted': 'border-[var(--success)] text-[var(--success)]',
  'contradiction-found': 'border-[var(--error)] text-[var(--error)]',
  'handoff-pending': 'border-[var(--accent)] text-[var(--accent)]',
  'handoff-accepted': 'border-[var(--success)] text-[var(--success)]',
  'handoff-failed': 'border-[var(--error)] text-[var(--error)]',
};

const SOURCE_LABELS: Record<SourceType, string> = {
  claimant: 'Claimant',
  'policy-record': 'Policy record',
  'repair-record': 'Repair record',
  operator: 'Operator',
};

const CONTRADICTION_STATUS_LABELS: Record<ContradictionStatus, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
  escalated: 'Escalated',
};

const TOOL_OUTCOME_LABELS: Record<ToolOutcome, string> = {
  allowed: 'Allowed',
  blocked: 'Blocked',
  failed: 'Failed',
};

const TOOL_OUTCOME_TONE: Record<ToolOutcome, string> = {
  allowed: 'border-[var(--success)] text-[var(--success)]',
  blocked: 'border-[var(--error)] text-[var(--error)]',
  failed: 'border-[var(--error)] text-[var(--error)]',
};

export const UI_LABELS = {
  state: STATE_LABELS,
  source: SOURCE_LABELS,
  contradictionStatus: CONTRADICTION_STATUS_LABELS,
  toolOutcome: TOOL_OUTCOME_LABELS,
};

/** Base badge shell. */
function badgeTone(extra: string): string {
  return `inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] ${extra}`;
}

/** Operational state pill, for example live, stale, unavailable. */
export function StatePill({ state, className = '' }: { state: UiState; className?: string }) {
  return (
    <span className={`${badgeTone(STATE_TONE[state])} ${className}`}>
      <span aria-hidden="true">{STATE_LABELS[state]}</span>
      <span className="sr-only">state: {STATE_LABELS[state]}</span>
    </span>
  );
}

/** Source badge linking a fact to where it came from. */
export function SourceBadge({ source, className = '' }: { source: SourceType; className?: string }) {
  return (
    <span
      className={`${badgeTone('border-[var(--border-default)] text-[var(--text-secondary)]')} ${className}`}
    >
      {SOURCE_LABELS[source]}
    </span>
  );
}

/** Risk state badge for contradictions. */
export function RiskState({
  label = 'Contradiction',
  tone = 'error',
  className = '',
}: {
  label?: string;
  tone?: 'error' | 'warning' | 'success';
  className?: string;
}) {
  const toneClass =
    tone === 'error'
      ? 'border-[var(--error)] bg-[var(--error-wash)] text-[var(--error)]'
      : tone === 'warning'
        ? 'border-[var(--warning)] bg-[var(--warning-wash)] text-[var(--warning)]'
        : 'border-[var(--success)] bg-[var(--success-wash)] text-[var(--success)]';
  return (
    <span className={`${badgeTone(`font-semibold ${toneClass}`)} ${className}`}>
      {label}
    </span>
  );
}

/** Tool call outcome badge. */
export function OutcomeBadge({ outcome, className = '' }: { outcome: ToolOutcome; className?: string }) {
  return (
    <span className={`${badgeTone(TOOL_OUTCOME_TONE[outcome])} ${className}`}>
      {TOOL_OUTCOME_LABELS[outcome]}
    </span>
  );
}

/** Contradiction status badge. */
export function ContradictionStatusBadge({
  status,
  className = '',
}: {
  status: ContradictionStatus;
  className?: string;
}) {
  const tone =
    status === 'resolved'
      ? 'border-[var(--success)] text-[var(--success)]'
      : status === 'escalated'
        ? 'border-[var(--error)] text-[var(--error)]'
        : 'border-[var(--accent)] text-[var(--accent)]';
  return (
    <span className={`${badgeTone(tone)} ${className}`}>
      {CONTRADICTION_STATUS_LABELS[status]}
    </span>
  );
}

/** Skeleton shimmer block for loading states. Spinners are not used. */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`braid-skeleton rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] ${className}`}
    />
  );
}

/** Mono label and value pair used across evidence surfaces. */
export function LabelValue({
  label,
  value,
  tone = 'default',
  className = '',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'muted' | 'missing';
  className?: string;
}) {
  const valueTone =
    tone === 'muted'
      ? 'text-[var(--text-muted)]'
      : tone === 'missing'
        ? 'text-[var(--warning)]'
        : 'text-[var(--text-primary)]';
  return (
    <div className={`grid gap-2 ${className}`}>
      <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
        {label}
      </span>
      <span className={`font-mono text-xs leading-relaxed ${valueTone}`}>{value}</span>
    </div>
  );
}

/** Neutral empty state. */
export function EmptyState({
  title,
  body,
  action,
  className = '',
}: {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-3 border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-6 ${className}`}
    >
      <StatePill state="empty" />
      <p className="font-display text-lg font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {title}
      </p>
      <p className="max-w-[36rem] font-display text-base leading-snug text-[var(--text-secondary)]">
        {body}
      </p>
      {action}
    </div>
  );
}

/** Unavailable dependency state. Names the dependency and routes to a human. */
export function UnavailableState({
  dependency,
  lastSuccessAt,
  humanPath,
  className = '',
}: {
  dependency: string;
  lastSuccessAt: string | null;
  humanPath: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-3 border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 ${className}`}
    >
      <StatePill state="unavailable" />
      <p className="font-display text-lg font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {dependency} is unavailable
      </p>
      <p className="font-mono text-xs text-[var(--text-secondary)]">
        {lastSuccessAt ? `Last successful observation: ${lastSuccessAt}` : 'No successful observation recorded yet.'}
      </p>
      <p className="max-w-[36rem] font-display text-base leading-snug text-[var(--text-secondary)]">
        {humanPath}
      </p>
    </div>
  );
}

/** Error state with retry only when retry is safe. */
export function ErrorState({
  title,
  body,
  retry,
  className = '',
}: {
  title: string;
  body: string;
  retry?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-start gap-3 border border-[var(--error)] bg-[var(--bg-surface)] p-6 ${className}`}
    >
      <StatePill state="error" />
      <p className="font-display text-lg font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {title}
      </p>
      <p className="max-w-[36rem] font-display text-base leading-snug text-[var(--text-secondary)]">
        {body}
      </p>
      {retry}
    </div>
  );
}
