'use client';

/**
 * Case review. The adjuster view: every fact is traceable, every conflict is
 * written down, every tool call shows its request and recorded response, and
 * the handoff stays disabled until the case holds enough to be reviewed.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ContradictionStatusBadge,
  EmptyState,
  ErrorState,
  OutcomeBadge,
  RiskState,
  Skeleton,
  StatePill,
  UnavailableState,
} from '@braid/ui';
import type { CaseDetail, Severity } from '@braid/domain';
import { BraidApiError, getCase } from '@/lib/api';
import { TranscriptRowView, caseState } from '@/features/cases/CaseReviewParts';
import { EvidenceRow } from '@/features/evidence/EvidenceRow';
import { SourceRecordPanel } from '@/features/evidence/SourceRecordPanel';
import { HandoffPanel } from '@/features/handoff/HandoffPanel';
import { TabRow } from '@/components/ui/TabRow';
import {
  fieldKeyLabel,
  formatOffset,
  formatTimestamp,
  languageLabel,
  scenarioLabel,
} from '@/lib/format';

const PAGE = 'mx-auto w-full max-w-[1440px] px-5 pt-10 pb-24 sm:px-8 lg:px-12 xl:px-16';

const BACK =
  'inline-flex items-center gap-2 rounded-sm font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)] underline-offset-4 transition-colors duration-200 ease-out hover:text-[var(--text-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const COLUMN =
  'mt-3 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const TITLE =
  'font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.9] tracking-[-0.03em] text-[var(--text-primary)]';

const SUMMARY_GRID = 'grid gap-6 sm:grid-cols-3';

const CARD = 'grid gap-3 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5';

const NUMBER = 'font-display text-4xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]';

const PARAGRAPH = 'max-w-[46rem] font-display text-base leading-snug text-[var(--text-secondary)]';

const MONO_LABEL = 'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const MONO_LINE = 'font-mono text-xs leading-relaxed text-[var(--text-secondary)]';

const CONTRADICTION_CARD =
  'grid gap-4 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 sm:p-6';

const COMPARE_GRID = 'grid gap-4 sm:grid-cols-2';

const COMPARE_CELL = 'grid gap-2 border-t border-[var(--border-subtle)] pt-3';

const COMPARE_VALUE = 'font-mono text-[0.8125rem] font-medium leading-[1.35] text-[var(--text-primary)]';

const TOOL_CARD = 'grid gap-4 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5';

const TOOL_HEAD =
  'flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-secondary)]';

const PAYLOAD_KEY = 'font-mono text-[0.8125rem] leading-[1.35] text-[var(--text-primary)]';

type LoadState = 'loading' | 'ready' | 'error';

function severityBadge(severity: Severity): { label: string; tone: 'error' | 'warning' } {
  if (severity === 'high') return { label: 'High severity', tone: 'error' };
  if (severity === 'medium') return { label: 'Medium severity', tone: 'warning' };
  return { label: 'Low severity', tone: 'warning' };
}

export function CaseReview({ caseId }: { caseId: string }) {
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [message, setMessage] = useState('The case could not be read from the Braid service.');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    setDetail(null);
    getCase(caseId)
      .then((response) => {
        if (cancelled) return;
        setDetail(response.case);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setMessage(
          error instanceof BraidApiError ? error.message : 'The case could not be read from the Braid service.',
        );
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [caseId, reloadToken]);

  if (state === 'loading') {
    return (
      <div className={PAGE}>
        <Link href="/cases" className={BACK}>
          &larr; Back to cases
        </Link>
        <div className="mt-8 grid gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-80 max-w-full" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="mt-12 grid gap-4">
          <Skeleton className="h-10 w-full max-w-[32rem]" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (state === 'error' || !detail) {
    return (
      <div className={PAGE}>
        <Link href="/cases" className={BACK}>
          &larr; Back to cases
        </Link>
        <div className="mt-8">
          <ErrorState
            title="Case could not be read"
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
      </div>
    );
  }

  const analysis = detail.analysis.postCall;
  const primaryHandoff = detail.handoffs[0] ?? null;

  const tabs = [
    {
      id: 'summary',
      label: 'Summary',
      content: (
        <div className="grid gap-8">
          {detail.scenario === 'dependency-failure' && (
            <UnavailableState
              dependency="Claims sandbox"
              lastSuccessAt={null}
              humanPath="The claims system could not be reached during intake. Claim and policy facts stay unverified. A human completes verification before any range of outcomes is discussed."
            />
          )}
          <div className={SUMMARY_GRID}>
            <div className={CARD}>
              <p className={MONO_LABEL}>Fields extracted</p>
              <p className={NUMBER}>{analysis?.fieldsExtracted ?? detail.evidence.length}</p>
            </div>
            <div className={CARD}>
              <p className={MONO_LABEL}>With source spans</p>
              <p className={NUMBER}>{analysis?.fieldsWithSourceSpans ?? 0}</p>
            </div>
            <div className={CARD}>
              <p className={MONO_LABEL}>Open contradictions</p>
              <p className={NUMBER}>{detail.contradictions.length}</p>
            </div>
          </div>
          {analysis && (
            <div className="grid gap-3">
              <p className={COLUMN}>Call summary</p>
              <p className={PARAGRAPH}>{analysis.summary}</p>
              <p className={COLUMN}>Next action</p>
              <p className={PARAGRAPH}>{analysis.nextAction}</p>
              <p className={COLUMN}>Escalation reason</p>
              <p className={PARAGRAPH}>{analysis.escalationReason ?? 'No escalation was required.'}</p>
              <p className={COLUMN}>Decision boundary</p>
              <p className={PARAGRAPH}>{analysis.decisionBoundary}</p>
            </div>
          )}
          {primaryHandoff && (
            <div className={CARD}>
              <p className={MONO_LABEL}>Adjuster packet</p>
              <p className={MONO_LINE}>
                {primaryHandoff.packet.evidenceRefs.length} evidence refs ·{' '}
                {primaryHandoff.packet.contradictionRefs.length} contradiction refs ·{' '}
                {primaryHandoff.packet.sourceRefs.length} source refs · language{' '}
                {primaryHandoff.packet.language.toUpperCase()}
              </p>
              {primaryHandoff.packet.followUpItems.length > 0 && (
                <div className="grid gap-1">
                  <p className={MONO_LABEL}>Follow-up items</p>
                  {primaryHandoff.packet.followUpItems.map((item) => (
                    <p key={item} className={PAYLOAD_KEY}>
                      {item}
                    </p>
                  ))}
                </div>
              )}
              {primaryHandoff.packet.callerQuestions.length > 0 && (
                <div className="grid gap-1">
                  <p className={MONO_LABEL}>Caller questions, not answered by the agent</p>
                  {primaryHandoff.packet.callerQuestions.map((question) => (
                    <p key={question} className={PAYLOAD_KEY}>
                      {question}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className={CARD}>
            <p className={MONO_LABEL}>System events</p>
            <ul className="grid gap-2">
              {detail.analysis.systemEvents.map((event) => (
                <li key={event.id} className={MONO_LINE}>
                  {formatTimestamp(event.at)} · {event.kind} · {event.message}
                </li>
              ))}
            </ul>
          </div>
          <div className={CARD}>
            <p className={MONO_LABEL}>Redactions applied to this view</p>
            <ul className="grid gap-2">
              {detail.analysis.redactionEvents.map((event) => (
                <li key={event.id} className={MONO_LINE}>
                  {formatTimestamp(event.at)} · {event.field} masked in the {event.view} view
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'transcript',
      label: 'Transcript',
      content: <TranscriptRowView segments={detail.transcript} />,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      content: (
        <ul>
          {detail.evidence.map((item) => (
            <EvidenceRow key={item.id} item={item} />
          ))}
        </ul>
      ),
    },
    {
      id: 'sources',
      label: 'Source records',
      content: (
        <div className="grid gap-4">
          {detail.sourceRecords.map((record) => (
            <SourceRecordPanel key={record.id} record={record} />
          ))}
          {detail.scenario === 'dependency-failure' &&
            !detail.sourceRecords.some((record) => record.recordType === 'claim') && (
              <UnavailableState
                dependency="Claims sandbox"
                lastSuccessAt={null}
                humanPath="The claim and policy records never arrived during intake. The claimant account stays unverified against them and a human completes the retrieval."
              />
            )}
        </div>
      ),
    },
    {
      id: 'contradictions',
      label: 'Contradictions',
      content:
        detail.contradictions.length === 0 ? (
          <EmptyState
            title="No contradictions on record"
            body="Sources matched on every shared field for this case. When sources disagree, both values and both references stay visible here."
          />
        ) : (
          <div className="grid gap-4">
            {detail.contradictions.map((contradiction) => {
              const badge = severityBadge(contradiction.severity);
              return (
                <article key={contradiction.id} className={CONTRADICTION_CARD}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-[var(--text-primary)]">
                      {fieldKeyLabel(contradiction.fieldKey)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskState label={badge.label} tone={badge.tone} />
                      <ContradictionStatusBadge status={contradiction.status} />
                    </div>
                  </div>
                  <div className={COMPARE_GRID}>
                    <div className={COMPARE_CELL}>
                      <p className={MONO_LABEL}>{contradiction.leftSource}</p>
                      <p className={COMPARE_VALUE}>{contradiction.leftValue}</p>
                      <p className={COLUMN}>{contradiction.leftReference}</p>
                    </div>
                    <div className={COMPARE_CELL}>
                      <p className={MONO_LABEL}>{contradiction.rightSource}</p>
                      <p className={COMPARE_VALUE}>{contradiction.rightValue}</p>
                      <p className={COLUMN}>{contradiction.rightReference}</p>
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <p className={MONO_LABEL}>Why Braid cannot resolve this</p>
                    <p className={PARAGRAPH}>{contradiction.rationale}</p>
                    <p className={COLUMN}>Recorded {formatTimestamp(contradiction.createdAt)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ),
    },
    {
      id: 'tools',
      label: 'Tool calls',
      content: (
        <div className="grid gap-4">
          {[...detail.toolCalls]
            .sort((left, right) => left.offsetMs - right.offsetMs)
            .map((call) => (
              <article key={call.id} className={TOOL_CARD}>
                <div className={TOOL_HEAD}>
                  <span className="text-[var(--text-primary)]">{call.toolName}</span>
                  <span>
                    recorded {formatOffset(call.offsetMs)} into the call · latency {call.latencyMs} ms
                  </span>
                  <span>{formatTimestamp(call.createdAt)}</span>
                  <OutcomeBadge outcome={call.outcome} className="justify-self-end" />
                </div>
                <div className="grid gap-1">
                  <p className={MONO_LABEL}>Request</p>
                  <p className={PAYLOAD_KEY}>{JSON.stringify(call.requestPayload).replace(/"([a-zA-Z]+)":/g, '$1: ')}</p>
                </div>
                <div className="grid gap-1">
                  <p className={MONO_LABEL}>Recorded response</p>
                  <p className={PAYLOAD_KEY}>
                    {call.responsePayload
                      ? JSON.stringify(call.responsePayload).replace(/"([a-zA-Z]+)":/g, '$1: ')
                      : 'No response recorded'}
                  </p>
                </div>
              </article>
            ))}
        </div>
      ),
    },
    {
      id: 'handoff',
      label: 'Handoff',
      content: (
        <HandoffPanel
          caseId={detail.caseId}
          evidenceCount={detail.evidence.length}
          hasTranscript={detail.transcript.length > 0}
          handoffs={detail.handoffs.map((handoff) => ({
            id: handoff.id,
            destination: handoff.destination,
            reason: handoff.reason,
            createdAt: handoff.createdAt,
            createdBy: handoff.createdBy,
            queueAcceptance: handoff.queueAcceptance
              ? {
                  state: handoff.queueAcceptance.state,
                  acceptedAt: handoff.queueAcceptance.acceptedAt,
                  acceptedBy: handoff.queueAcceptance.acceptedBy,
                }
              : null,
          }))}
        />
      ),
    },
  ];

  return (
    <div className={PAGE}>
      <Link href="/cases" className={BACK}>
        &larr; Back to cases
      </Link>
      <header className="mt-8 grid gap-4">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          {detail.externalReference}
        </p>
        <h1 className={TITLE}>{detail.claimant.displayName}</h1>
        <p className="flex flex-wrap items-center gap-2">
          <StatePill state={caseState(detail)} />
          <span className={COLUMN}>
            {scenarioLabel(detail.scenario)} · {languageLabel(detail.language)} · status{' '}
            {detail.status} · consent{' '}
            {detail.claimant.consentCaptured ? 'captured' : 'not captured'} · phone{' '}
            {detail.claimant.phoneMasked}
          </span>
        </p>
        <p className={COLUMN}>
          created {formatTimestamp(detail.createdAt)} · updated {formatTimestamp(detail.updatedAt)}
        </p>
      </header>
      <div className="mt-10">
        <TabRow tabs={tabs} label="Case review views" />
      </div>
    </div>
  );
}
