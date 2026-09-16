'use client';

/**
 * One retrieved external record. Field labels follow the payload kind, the
 * provider reference stays mono, and an unavailable record states the
 * dependency honestly instead of showing a skeleton full of guessed values.
 */

import {
  LabelValue,
  UnavailableState,
} from '@braid/ui';
import type { SourceRecord } from '@braid/domain';
import { formatTimestamp } from '@/lib/format';

const CARD = 'grid gap-4 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5';

const HEAD = 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2';

const NAME = 'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-primary)]';

const REFERENCE = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const DOC_ROW =
  'grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[var(--border-subtle)] py-2 last:border-b-0';

const RECORD_LABELS = {
  claim: 'Claim record',
  policy: 'Policy record',
  repair: 'Repair record',
} as const;

const DOC_STATE_LABELS = {
  provided: 'Provided',
  missing: 'Missing',
  'on-file': 'On file',
} as const;

export function SourceRecordPanel({ record }: { record: SourceRecord }) {
  if (!record.available) {
    return (
      <article className={CARD}>
        <div className={HEAD}>
          <p className={NAME}>{RECORD_LABELS[record.recordType]}</p>
          <p className={REFERENCE}>{record.providerReference}</p>
        </div>
        <UnavailableState
          dependency={record.providerReference}
          lastSuccessAt={null}
          humanPath="Retrieval failed during intake. The facts below stay unverified and a human completes the check."
        />
      </article>
    );
  }

  const payload = record.payload;

  return (
    <article className={CARD}>
      <div className={HEAD}>
        <p className={NAME}>{RECORD_LABELS[record.recordType]}</p>
        <p className={REFERENCE}>{record.providerReference}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {payload.kind === 'claim-record' && (
          <>
            <LabelValue label="Claim number" value={payload.claimNumber} tone="muted" />
            <LabelValue label="Policy number" value={payload.policyNumber} tone="muted" />
            <LabelValue label="Incident date on file" value={payload.incidentDateOnFile} />
            <LabelValue label="Vehicle plate on file" value={payload.vehiclePlateOnFile} />
            <LabelValue label="Damage on file" value={payload.damageOnFile} />
            <LabelValue label="Status" value={payload.status} tone="muted" />
            <LabelValue label="Registered at" value={formatTimestamp(payload.registeredAt)} tone="muted" />
          </>
        )}
        {payload.kind === 'policy-record' && (
          <>
            <LabelValue label="Policy number" value={payload.policyNumber} tone="muted" />
            <LabelValue label="Product" value={payload.product} />
            <LabelValue label="Policyholder" value={payload.policyholder} tone="muted" />
            <LabelValue label="Status" value={payload.status} tone="muted" />
          </>
        )}
        {payload.kind === 'repair-record' && (
          <>
            <LabelValue label="Repair order" value={payload.repairOrder} tone="muted" />
            <LabelValue label="Vehicle plate" value={payload.vehiclePlate} />
            <LabelValue label="Assessment" value={payload.damageAssessment} />
            <LabelValue label="Assessment date" value={payload.assessmentDate} tone="muted" />
            <LabelValue label="Garage" value={payload.garage} tone="muted" />
            <LabelValue label="Repaired parts" value={payload.repairedParts.join(', ')} />
          </>
        )}
      </div>
      {payload.kind === 'policy-record' && payload.requiredDocuments.length > 0 && (
        <div className="grid gap-2">
          <p className={REFERENCE}>Required documents on the policy record</p>
          <ul>
            {payload.requiredDocuments.map((document) => (
              <li key={document.key} className={DOC_ROW}>
                <span className="font-mono text-[0.6875rem] text-[var(--text-primary)]">
                  {document.label}
                </span>
                <span
                  className={`font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] ${
                    document.state === 'missing' ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {DOC_STATE_LABELS[document.state]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className={REFERENCE}>
        Retrieved {formatTimestamp(record.retrievedAt)}
      </p>
    </article>
  );
}
