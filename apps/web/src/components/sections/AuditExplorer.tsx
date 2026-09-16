'use client';

/**
 * Section 7: audit explorer.
 *
 * Reassure and prove. A tabbed explorer over one real scripted case
 * (FNOL-2026-0142) plus guard rows from the other seeded cases. Every tool
 * call row shows the request, the recorded response, the timestamp, and the
 * result state. A successful call is never shown without its response.
 */

import { OutcomeBadge } from '@braid/ui';
import { DECISION_BOUNDARY_STATEMENT } from '@braid/domain';
import { TabRow, type TabDefinition } from '@/components/ui/TabRow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fieldKeyLabel, formatOffset, sourceReferenceLabel } from '@/lib/format';

const LAYOUT =
  'relative z-20 mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16';

const SEGMENT = 'grid gap-1 border-l-2 border-[var(--border-default)] pl-4 first:border-[var(--accent)]';

const SEGMENT_SPEAKER =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]';

const SEGMENT_TEXT = 'font-display text-lg leading-snug text-[var(--text-primary)]';

const SEGMENT_META = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const EVIDENCE_ROW =
  'grid grid-cols-1 gap-2 border-b border-[var(--border-subtle)] py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-4';

const EVIDENCE_LABEL = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const EVIDENCE_VALUE = 'font-mono text-[0.8125rem] font-medium leading-[1.35] text-[var(--text-primary)]';

const TOOL_CARD = 'grid gap-4 border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5';

const TOOL_HEAD =
  'flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-secondary)]';

const TOOL_REFERER = 'text-[var(--text-muted)]';

const SOURCE_ROW =
  'grid gap-2 border-b border-[var(--border-subtle)] py-5 last:border-b-0 sm:grid-cols-2 sm:gap-4';

const ANALYSIS_GRID = 'grid gap-6 sm:grid-cols-3';

const ANALYSIS_CELL = 'grid gap-1 border-t border-[var(--border-default)] pt-4';

const ANALYSIS_NUMBER = 'font-display text-4xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]';

const PARAGRAPH =
  'max-w-[46rem] font-display text-base leading-snug text-[var(--text-secondary)]';

const MONO_NOTE = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

interface TranscriptRow {
  speaker: string;
  node: string;
  offsetMs: number;
  text: string;
}

interface EvidenceRow {
  fieldKey: string;
  valueText: string;
  sourceType: 'claimant' | 'policy-record' | 'repair-record';
  reference: string;
}

interface ToolRow {
  caseRef: string;
  toolName: string;
  request: string;
  response: string;
  offsetMs: number;
  latencyMs: number;
  outcome: 'allowed' | 'failed';
}

interface SourceRow {
  recordLabel: string;
  providerReference: string;
  retrievedAt: number;
  lines: string[];
}

const TRANSCRIPT: TranscriptRow[] = [
  {
    speaker: 'Agent',
    node: 'intake',
    offsetMs: 31700,
    text: 'Please describe what happened. Include when it happened, where, the vehicle, the other party, and any damage you noticed.',
  },
  {
    speaker: 'Claimant',
    node: 'intake',
    offsetMs: 36900,
    text: 'It was Sunday evening, around five forty, on Al Reem Street near the corniche. I was slowing for a red light by the marina entrance when a delivery van hit my car from behind. My car is a white sedan, plate Abu Dhabi 12345.',
  },
  {
    speaker: 'Claimant',
    node: 'intake',
    offsetMs: 49800,
    text: 'The rear bumper is cracked and the boot does not close properly. My neck was a little sore the next morning, so I went to a clinic.',
  },
  {
    speaker: 'Agent',
    node: 'clarification',
    offsetMs: 57700,
    text: 'Thank you. Two details are still missing from the record: the exact incident date, and the police report number. Can you provide them?',
  },
  {
    speaker: 'Claimant',
    node: 'clarification',
    offsetMs: 64000,
    text: 'The accident was on the thirtieth of August. The police report number is PO 2026 88 413.',
  },
  {
    speaker: 'Agent',
    node: 'handoff',
    offsetMs: 89700,
    text: 'Your case is ready for a human adjuster. I am sending a packet with the transcript, the extracted facts, the policy and repair records, and one open item: the injury follow-up. I cannot confirm coverage or predict the outcome. An adjuster will contact you within one business day.',
  },
  {
    speaker: 'Agent',
    node: 'close',
    offsetMs: 102500,
    text: 'Thank you. This call has been recorded for audit. Every decision on this claim stays with a human adjuster. Goodbye.',
  },
];

const EVIDENCE: EvidenceRow[] = [
  { fieldKey: 'incident_date', valueText: '2026-08-30', sourceType: 'claimant', reference: 'segment:10' },
  { fieldKey: 'incident_time', valueText: 'approximately 17:40', sourceType: 'claimant', reference: 'segment:7' },
  { fieldKey: 'incident_location', valueText: 'Al Reem Street near the corniche, by the marina entrance', sourceType: 'claimant', reference: 'segment:7' },
  { fieldKey: 'vehicle_description', valueText: 'white sedan', sourceType: 'claimant', reference: 'segment:7' },
  { fieldKey: 'vehicle_plate', valueText: 'Abu Dhabi 12345', sourceType: 'claimant', reference: 'segment:7' },
  { fieldKey: 'other_party', valueText: 'delivery van, rear impact, details exchanged', sourceType: 'claimant', reference: 'segment:7' },
  { fieldKey: 'damage_description', valueText: 'cracked rear bumper, boot does not close properly', sourceType: 'claimant', reference: 'segment:8' },
  { fieldKey: 'injuries_reported', valueText: 'neck soreness the next morning, clinic visit', sourceType: 'claimant', reference: 'segment:8' },
  { fieldKey: 'police_report_reference', valueText: 'PO 2026 88 413', sourceType: 'claimant', reference: 'segment:10' },
  { fieldKey: 'policy_number', valueText: 'POL-TR-55-0021', sourceType: 'policy-record', reference: 'record:CLM-2026-8841' },
  { fieldKey: 'document_driving_licence', valueText: '', sourceType: 'policy-record', reference: 'record:POL-TR-55-0021' },
  { fieldKey: 'repair_assessment', valueText: 'rear bumper cracked, tailgate misaligned', sourceType: 'repair-record', reference: 'record:RPR-3327' },
];

const TOOL_CALLS: ToolRow[] = [
  {
    caseRef: 'FNOL-2026-0142',
    toolName: 'claims-record',
    request: '{ caseRef FNOL-2026-0142, tool claims-record }',
    response: '{ claimNumber CLM-2026-8841, policyNumber POL-TR-55-0021, verified true }',
    offsetMs: 75800,
    latencyMs: 420,
    outcome: 'allowed',
  },
  {
    caseRef: 'FNOL-2026-0142',
    toolName: 'repair-record',
    request: '{ caseRef FNOL-2026-0142, tool repair-record }',
    response: '{ repairOrder RPR-3327, verified true }',
    offsetMs: 77200,
    latencyMs: 380,
    outcome: 'allowed',
  },
  {
    caseRef: 'FNOL-2026-0142',
    toolName: 'adjuster-handoff',
    request: '{ caseRef FNOL-2026-0142, destination adjuster-queue, reason Intake complete. Injury follow-up and one missing document require human review. }',
    response: '{ handoffId ho-0142-01, queue adjuster-queue, state accepted }',
    offsetMs: 96100,
    latencyMs: 610,
    outcome: 'allowed',
  },
  {
    caseRef: 'FNOL-2026-0144',
    toolName: 'adjuster-handoff',
    request: '{ caseRef FNOL-2026-0144, destination adjuster-queue, reason Contradiction between claimant account and repair record on damage location. }',
    response: '{ handoffId ho-0144-01, queue adjuster-queue, state accepted }',
    offsetMs: 94000,
    latencyMs: 590,
    outcome: 'allowed',
  },
  {
    caseRef: 'FNOL-2026-0146',
    toolName: 'claims-record',
    request: '{ caseRef FNOL-2026-0146, tool claims-record }',
    response: '{ error DEPENDENCY_UNAVAILABLE, dependency claims-sandbox, message The claims system cannot be reached right now. }',
    offsetMs: 59500,
    latencyMs: 3200,
    outcome: 'failed',
  },
];

const POLICY_SOURCES: SourceRow[] = [
  {
    recordLabel: 'Claim record',
    providerReference: 'claims-sandbox:CLM-2026-8841',
    retrievedAt: 75800,
    lines: [
      'policy on file POL-TR-55-0021',
      'incident date on file 2026-08-30',
      'registered 2026-08-30 19:05 UTC',
      'status first-notice-of-loss',
    ],
  },
  {
    recordLabel: 'Policy record',
    providerReference: 'claims-sandbox:POL-TR-55-0021',
    retrievedAt: 75900,
    lines: [
      'product motor comprehensive sandbox',
      'status active',
      'police report on file',
      'repair estimate on file',
      'driving licence copy missing',
    ],
  },
  {
    recordLabel: 'Repair record',
    providerReference: 'repair-sandbox:RPR-3327',
    retrievedAt: 77200,
    lines: [
      'assessment rear bumper cracked, tailgate misaligned',
      'vehicle Abu Dhabi 12345',
      'assessment date 2026-08-31',
      'garage sandbox repair network unit 4',
    ],
  },
];

const ANALYSIS_STATS = [
  { label: 'Fields extracted', value: '12' },
  { label: 'Claimant facts with transcript spans', value: '9' },
  { label: 'Open contradictions', value: '0' },
];

export function AuditExplorer() {
  const containerRef = useScrollReveal<HTMLElement>('[data-reveal]');

  const tabs: TabDefinition[] = [
    {
      id: 'transcript',
      label: 'Transcript',
      content: (
        <ul className="grid gap-6" aria-live="polite">
          {TRANSCRIPT.map((row) => (
            <li key={row.offsetMs} className={SEGMENT}>
              <p className={SEGMENT_SPEAKER}>{row.speaker}</p>
              <p className={SEGMENT_TEXT}>{row.text}</p>
              <p className={SEGMENT_META}>
                node {row.node} · {formatOffset(row.offsetMs)}
              </p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'evidence',
      label: 'Evidence',
      content: (
        <ul>
          {EVIDENCE.map((row) => (
            <li key={row.fieldKey} className={EVIDENCE_ROW}>
              <div className="grid gap-1">
                <p className={EVIDENCE_LABEL}>{fieldKeyLabel(row.fieldKey)}</p>
                <p className={EVIDENCE_VALUE}>
                  {row.valueText === '' ? 'Missing, never guessed' : row.valueText}
                </p>
                <p className={EVIDENCE_LABEL}>{sourceReferenceLabel(row.reference)}</p>
              </div>
              <p className={`${EVIDENCE_LABEL} sm:justify-self-end`}>
                {sourceLabelFor(row.sourceType)}
              </p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'tool-calls',
      label: 'Tool calls',
      content: (
        <div className="grid gap-4">
          {TOOL_CALLS.map((call) => (
            <article key={`${call.caseRef}-${call.toolName}-${call.offsetMs}`} className={TOOL_CARD}>
              <div className={TOOL_HEAD}>
                <span className="text-[var(--text-primary)]">{call.toolName}</span>
                <span className={TOOL_REFERER}>{call.caseRef}</span>
                <span className={TOOL_REFERER}>
                  recorded {formatOffset(call.offsetMs)} into the call
                </span>
                <span className={TOOL_REFERER}>latency {call.latencyMs} ms</span>
                <OutcomeBadge outcome={call.outcome} className="justify-self-end" />
              </div>
              <div className="grid gap-2">
                <p className={EVIDENCE_LABEL}>Request</p>
                <p className={EVIDENCE_VALUE}>{call.request}</p>
              </div>
              <div className="grid gap-2">
                <p className={EVIDENCE_LABEL}>Recorded response</p>
                <p className={EVIDENCE_VALUE}>{call.response}</p>
              </div>
            </article>
          ))}
          <p className={MONO_NOTE}>
            The FNOL-2026-0146 row shows the honest failure path: the recorded response is the
            dependency error, nothing successful is implied, and the case routes to a human queue.
          </p>
        </div>
      ),
    },
    {
      id: 'policy-sources',
      label: 'Policy sources',
      content: (
        <div>
          {POLICY_SOURCES.map((row) => (
            <article key={row.providerReference} className={SOURCE_ROW}>
              <div className="grid gap-1">
                <p className={EVIDENCE_LABEL}>{row.recordLabel}</p>
                <p className={EVIDENCE_VALUE}>{row.providerReference}</p>
                <p className={EVIDENCE_LABEL}>retrieved {formatOffset(row.retrievedAt)} into the call</p>
              </div>
              <ul className="grid content-start gap-2 sm:justify-self-end sm:text-right">
                {row.lines.map((line) => (
                  <li key={line} className={`${EVIDENCE_VALUE} font-normal normal-case`}>
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ),
    },
    {
      id: 'analysis',
      label: 'Analysis',
      content: (
        <div className="grid gap-8">
          <div className={ANALYSIS_GRID}>
            {ANALYSIS_STATS.map((stat) => (
              <div key={stat.label} className={ANALYSIS_CELL}>
                <p className={EVIDENCE_LABEL}>{stat.label}</p>
                <p className={ANALYSIS_NUMBER}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3">
            <p className={EVIDENCE_LABEL}>Call summary</p>
            <p className={PARAGRAPH}>
              English intake completed. Nine claimant facts extracted with source spans. Claims,
              policy, and repair records retrieved and matched on date, location, vehicle, and
              damage. No contradictions detected. Injury follow-up and one missing document routed
              to the adjuster queue.
            </p>
            <p className={EVIDENCE_LABEL}>Next action</p>
            <p className={PARAGRAPH}>
              An adjuster reviews the packet and contacts the claimant within one business day.
            </p>
            <p className={EVIDENCE_LABEL}>Decision boundary</p>
            <p className={PARAGRAPH}>{DECISION_BOUNDARY_STATEMENT}</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section ref={containerRef} id="audit" aria-labelledby="audit-heading" className={LAYOUT}>
      <div data-reveal>
        <SectionHeading
          index="07"
          kicker="Audit explorer"
          title="Every call leaves a record"
          body="Open the exact artifacts the agent wrote for reference FNOL-2026-0142: the transcript speakers and offsets, the extracted fields with sources, the tool calls with request and recorded response, the retrieved records, and the post-call analysis. Guard rows from FNOL-2026-0144 and FNOL-2026-0146 show the contradiction and failure paths."
        />
        <TabRow tabs={tabs} initialTab="transcript" />
      </div>
    </section>
  );
}

function sourceLabelFor(sourceType: string) {
  if (sourceType === 'claimant') return 'Claimant';
  if (sourceType === 'policy-record') return 'Policy record';
  return 'Repair record';
}
