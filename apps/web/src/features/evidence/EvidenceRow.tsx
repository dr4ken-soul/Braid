'use client';

/**
 * One extracted fact with provenance. Empty values render as Missing, never
 * as a guess. Used by the case review evidence tab and the intake demo.
 */

import { SourceBadge } from '@braid/ui';
import type { EvidenceItem } from '@braid/domain';
import { confidenceLabel, fieldKeyLabel, sourceReferenceLabel } from '@/lib/format';

const ROW =
  'grid grid-cols-1 gap-2 border-b border-[var(--border-subtle)] py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-4';

const LABEL = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const VALUE = 'font-mono text-[0.8125rem] font-medium leading-[1.35] text-[var(--text-primary)]';

const MISSING = 'font-mono text-[0.8125rem] font-medium leading-[1.35] text-[var(--warning)]';

export function EvidenceRow({ item }: { item: EvidenceItem }) {
  const missing = item.valueText === '';
  return (
    <li className={ROW}>
      <div className="grid gap-1">
        <p className={LABEL}>{fieldKeyLabel(item.fieldKey)}</p>
        <p className={missing ? MISSING : VALUE}>{missing ? 'Missing' : item.valueText}</p>
        <p className={LABEL}>
          {sourceReferenceLabel(item.sourceReference)} · confidence{' '}
          {confidenceLabel(item.confidence)}
        </p>
      </div>
      <SourceBadge source={item.sourceType} className="sm:justify-self-end" />
    </li>
  );
}
