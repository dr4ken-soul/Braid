'use client';

/**
 * Shared case-review rendering parts, extracted so the case review page and the
 * intake replay can show the identical transcript view.
 */

import type { CaseDetail, TranscriptSegment } from '@braid/domain';
import type { UiState } from '@braid/ui';
import { formatOffset } from '@/lib/format';

const LIST = 'grid gap-6';

const SEGMENT = 'grid gap-1 border-l-2 border-[var(--border-default)] pl-4 first:border-[var(--accent)]';

const SEGMENT_SPEAKER =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]';

const SEGMENT_TEXT = 'font-display text-lg leading-snug text-[var(--text-primary)]';

/** Ordered transcript with left-to-right and right-to-left handling per language. */
export function TranscriptRowView({ segments }: { segments: TranscriptSegment[] }) {
  return (
    <ul className={LIST} aria-live="polite">
      {segments.map((segment) => (
        <li key={segment.sequence} className={SEGMENT}>
          <p className={SEGMENT_SPEAKER}>
            {segment.speaker} · node {segment.node} · {formatOffset(segment.startMs)}
          </p>
          <p className={SEGMENT_TEXT} dir={segment.language === 'ar' ? 'rtl' : 'ltr'}>
            {segment.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Map a case detail to the headline state pill shown on review surfaces. */
export function caseState(detail: CaseDetail): UiState {
  if (detail.status === 'closed') return 'stale';
  if (detail.contradictions.length > 0) return 'contradiction-found';
  if (detail.handoffs.some((handoff) => handoff.queueAcceptance)) return 'handoff-accepted';
  if (detail.handoffs.length > 0) return 'handoff-pending';
  if (detail.scenario === 'dependency-failure') return 'unavailable';
  return 'evidence-extracted';
}
