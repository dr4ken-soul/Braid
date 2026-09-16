'use client';

/**
 * Adjuster handoff for a case review.
 *
 * The user picks an approved queue target and writes a reason of at least ten
 * characters. The action stays disabled until the case holds extracted
 * evidence and a transcript. Success records the queue acceptance; failure is
 * announced in an assertive live region and offers a retry.
 */

import React from 'react';
import { useState } from 'react';
import { StatePill } from '@braid/ui';
import type { QueueTarget } from '@braid/domain';
import { QUEUE_TARGETS } from '@braid/domain';
import { BraidApiError, createHandoff } from '@/lib/api';
import { formatTimestamp } from '@/lib/format';

const PANEL = 'grid gap-6';

const BLOCK = 'grid gap-2';

const LABEL =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const CONTROL =
  'w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-3 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const BUTTON =
  'inline-flex min-h-14 items-center justify-center rounded-md bg-[var(--accent)] px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50';

const CARD = 'grid gap-3 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5';

const DETAIL = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-secondary)]';

const EXISTING_ROW = 'grid gap-1 border-b border-[var(--border-subtle)] py-4 last:border-b-0';

const QUEUE_LABELS: Record<QueueTarget, string> = {
  'adjuster-queue': 'Adjuster queue',
  'human-follow-up-queue': 'Human follow-up queue',
  'compliance-queue': 'Compliance queue',
};

type HandoffState = 'handoff-accepted' | 'handoff-failed' | 'handoff-pending';

export interface HandoffPanelProps {
  caseId: string;
  evidenceCount: number;
  hasTranscript: boolean;
  handoffs: Array<{
    id: string;
    destination: string;
    reason: string;
    createdAt: string;
    createdBy: string;
    queueAcceptance: { state: string; acceptedAt: string; acceptedBy: string } | null;
  }>;
}

export function HandoffPanel({ caseId, evidenceCount, hasTranscript, handoffs }: HandoffPanelProps) {
  const [destination, setDestination] = useState<QueueTarget | ''>('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<HandoffResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const ready = evidenceCount > 0 && hasTranscript && reason.trim().length >= 10 && destination !== '';

  async function submit() {
    if (!destination || !ready || submitting) return;
    setSubmitting(true);
    setFailure(null);
    try {
      const response = await createHandoff(caseId, {
        destination,
        reason: reason.trim(),
        createdBy: 'operator',
      });
      setResult(response.handoff);
    } catch (error) {
      setFailure(
        error instanceof BraidApiError
          ? error.message
          : 'The handoff request could not be completed.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={PANEL}>
      <div className="grid gap-1">
        <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)]">
          Route to a human
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
          Route this case to an adjuster
        </h3>
        <p className="max-w-[32rem] font-display text-base leading-snug text-[var(--text-secondary)]">
          The packet leaves with the transcript, the extracted facts with sources, the recorded
          contradictions, and your escalation reason. No decision leaves with it.
        </p>
      </div>

      <div className={BLOCK}>
        <label className={LABEL} htmlFor="handoff-destination">
          Queue target
        </label>
        <select
          id="handoff-destination"
          className={CONTROL}
          value={destination}
          onChange={(event) => setDestination(event.target.value as QueueTarget)}
        >
          <option value="" disabled>
            Select a queue
          </option>
          {QUEUE_TARGETS.map((target) => (
            <option key={target} value={target}>
              {QUEUE_LABELS[target]}
            </option>
          ))}
        </select>
      </div>

      <div className={BLOCK}>
        <label className={LABEL} htmlFor="handoff-reason">
          Escalation reason
        </label>
        <textarea
          id="handoff-reason"
          className={CONTROL}
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain what a human must decide and why"
        />
        <p className={DETAIL}>
          {reason.trim().length} characters, minimum 10
        </p>
      </div>

      <button type="button" onClick={submit} disabled={!ready || submitting} className={BUTTON}>
        {submitting ? 'Routing' : 'Route to adjuster'}
      </button>

      <div aria-live={failure ? 'assertive' : 'off'} role={failure ? 'alert' : undefined}>
        {failure && (
          <div className={`${CARD} border-[var(--error)]`}>
            <StatePillRow state="handoff-failed" />
            <p className="font-display text-base leading-snug text-[var(--text-primary)]">
              {failure}
            </p>
            <button type="button" onClick={submit} className={BUTTON}>
              Retry handoff
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className={CARD}>
          <StatePillRow state={result.queueAcceptance ? 'handoff-accepted' : 'handoff-pending'} />
          <p className={DETAIL}>
            handoff {result.id} · destination {result.destination}
          </p>
          <p className="font-mono text-xs text-[var(--text-primary)]">{result.reason}</p>
          {result.queueAcceptance && (
            <p className={DETAIL}>
              queue acceptance {result.queueAcceptance.state} · {result.queueAcceptance.acceptedBy} ·{' '}
              {formatTimestamp(result.queueAcceptance.acceptedAt)}
            </p>
          )}
        </div>
      )}

      {handoffs.length > 0 && (
        <div className="grid gap-2">
          <p className={LABEL}>Recorded handoffs on this case</p>
          <ul>
            {handoffs.map((handoff) => (
              <li key={handoff.id} className={EXISTING_ROW}>
                <p className={DETAIL}>
                  {handoff.destination} · {handoff.createdBy} · {formatTimestamp(handoff.createdAt)}
                </p>
                <p className="font-mono text-xs text-[var(--text-primary)]">{handoff.reason}</p>
                <p className={DETAIL}>
                  queue{' '}
                  {handoff.queueAcceptance
                    ? `${handoff.queueAcceptance.state} · accepted by ${handoff.queueAcceptance.acceptedBy}`
                    : 'pending acceptance'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatePillRow({ state }: { state: HandoffState }) {
  return <StatePill state={state} />;
}

interface HandoffResult {
  id: string;
  destination: string;
  reason: string;
  queueAcceptance: { state: string; queue: string; acceptedAt: string; acceptedBy: string } | null;
}
