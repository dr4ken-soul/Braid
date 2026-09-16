/**
 * Braid domain types and constants.
 *
 * Shared contract between the API service, the web console, and the
 * documentation fixtures. Braid prepares evidence for human adjusters.
 * It never decides liability, coverage, settlement value, payment,
 * fraud, or claim closure.
 */

/* ------------------------------------------------------------------ */
/* Unions and primitives                                              */
/* ------------------------------------------------------------------ */

/** Supported intake languages for Version 1. */
export type Language = 'en' | 'ar';

/** Case lifecycle status. */
export type CaseStatus = 'intake' | 'review' | 'handoff' | 'closed';

/** Conversation channel. */
export type Channel = 'voice' | 'web';

/** Transcript speaker. */
export type Speaker = 'agent' | 'claimant' | 'system';

/** Simulated intake scenario used by the demo pipeline. */
export type Scenario = 'complete' | 'contradiction' | 'dependency-failure';

/** Workflow node names, in call order. */
export type WorkflowNode =
  | 'disclosure'
  | 'language'
  | 'consent'
  | 'intake'
  | 'clarification'
  | 'tool-retrieval'
  | 'comparison'
  | 'contradiction'
  | 'handoff'
  | 'close'
  | 'failure';

/** Evidence category, aligned with the evidence_items table. */
export type EvidenceCategory = 'incident' | 'policy' | 'damage' | 'identity' | 'timeline' | 'contact';

/** Where an extracted fact came from. */
export type SourceType = 'claimant' | 'policy-record' | 'repair-record' | 'operator';

/** External record types. */
export type RecordType = 'claim' | 'policy' | 'repair';

/** Contradiction severity. */
export type Severity = 'low' | 'medium' | 'high';

/** Contradiction lifecycle. */
export type ContradictionStatus = 'open' | 'acknowledged' | 'resolved' | 'escalated';

/** Agent tools available in the challenge build. */
export type ToolName = 'claims-record' | 'repair-record' | 'adjuster-handoff' | 'request-human';

/** Recorded outcome of a tool call. */
export type ToolOutcome = 'allowed' | 'blocked' | 'failed';

/** Approved human queue targets. */
export type QueueTarget = 'adjuster-queue' | 'human-follow-up-queue' | 'compliance-queue';

/** Handoff creator. */
export type HandoffCreator = 'agent' | 'operator';

/** Evaluation scenario category. */
export type EvaluationCategory = 'intake' | 'guardrail' | 'tool-gate';

/* ------------------------------------------------------------------ */
/* Entities                                                           */
/* ------------------------------------------------------------------ */

/** Synthetic claimant profile. Reviewer views receive masked fields. */
export interface ClaimantProfile {
  displayName: string;
  /** Masked for reviewer views, for example +971 50 *** 0142. */
  phoneMasked: string;
  /** True once consent is captured in the call. */
  consentCaptured: boolean;
}

/** A claim case. */
export interface BraidCase {
  caseId: string;
  externalReference: string;
  status: CaseStatus;
  language: Language;
  scenario: Scenario;
  claimant: ClaimantProfile;
  createdAt: string;
  updatedAt: string;
}

/** A recorded conversation. */
export interface Conversation {
  conversationId: string;
  caseId: string;
  elevenlabsConversationId: string | null;
  channel: Channel;
  startedAt: string;
  endedAt: string | null;
  transcriptStatus: 'pending' | 'complete' | 'failed';
}

/** One timestamped transcript segment. */
export interface TranscriptSegment {
  conversationId: string;
  sequence: number;
  speaker: Speaker;
  /** Workflow node active when the segment was spoken. */
  node: WorkflowNode;
  text: string;
  language: Language;
  startMs: number;
  endMs: number;
}

/** An extracted fact with provenance. Empty valueText means the field is missing. */
export interface EvidenceItem {
  id: string;
  caseId: string;
  category: EvidenceCategory;
  fieldKey: string;
  /** Empty string renders as Missing in the console. */
  valueText: string;
  confidence: number | null;
  sourceType: SourceType;
  /** Segment or record reference, for example segment:7 or record:CLM-8841. */
  sourceReference: string | null;
}

/** Payload of the synthetic claim record. */
export interface ClaimRecordPayload {
  kind: 'claim-record';
  claimNumber: string;
  policyNumber: string;
  incidentDateOnFile: string;
  vehiclePlateOnFile: string;
  damageOnFile: string;
  registeredAt: string;
  status: string;
}

/** Payload of the synthetic policy record. */
export interface PolicyRecordPayload {
  kind: 'policy-record';
  policyNumber: string;
  product: string;
  policyholder: string;
  status: string;
  requiredDocuments: Array<{
    key: string;
    label: string;
    state: 'provided' | 'missing' | 'on-file';
  }>;
}

/** Payload of the synthetic repair record. */
export interface RepairRecordPayload {
  kind: 'repair-record';
  repairOrder: string;
  vehiclePlate: string;
  damageAssessment: string;
  repairedParts: string[];
  assessmentDate: string;
  garage: string;
}

/** A retrieved external record. available false marks a dependency failure. */
export interface SourceRecord {
  id: string;
  caseId: string;
  recordType: RecordType;
  providerReference: string;
  payload: ClaimRecordPayload | PolicyRecordPayload | RepairRecordPayload;
  retrievedAt: string;
  available: boolean;
}

/** A detected mismatch between two independent sources. */
export interface Contradiction {
  id: string;
  caseId: string;
  fieldKey: string;
  severity: Severity;
  leftValue: string;
  rightValue: string;
  leftSource: string;
  rightSource: string;
  leftReference: string;
  rightReference: string;
  rationale: string;
  status: ContradictionStatus;
  createdAt: string;
}

/** Evidence packet routed to a human queue. Contains no decision. */
export interface AdjusterPacket {
  caseRef: string;
  language: Language;
  escalationReason: string;
  transcriptRef: string;
  evidenceRefs: string[];
  contradictionRefs: string[];
  sourceRefs: string[];
  followUpItems: string[];
  callerQuestions: string[];
  decisionBoundary: string;
}

/** Mock queue acceptance recorded when a handoff is created. */
export interface QueueAcceptance {
  queue: string;
  acceptedBy: string;
  acceptedAt: string;
  state: 'accepted';
}

/** A routed adjuster handoff. */
export interface Handoff {
  id: string;
  caseId: string;
  destination: QueueTarget;
  reason: string;
  packet: AdjusterPacket;
  createdBy: HandoffCreator;
  createdAt: string;
  queueAcceptance: QueueAcceptance | null;
}

/** Audit record of one agent tool call. */
export interface ToolCall {
  id: string;
  conversationId: string | null;
  caseId: string | null;
  toolName: ToolName;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown> | null;
  outcome: ToolOutcome;
  /** Milliseconds from conversation start, used by the conversation player. */
  offsetMs: number;
  latencyMs: number;
  createdAt: string;
}

/** Redaction applied to a reviewer view. */
export interface RedactionEvent {
  id: string;
  caseId: string;
  field: string;
  action: 'masked';
  view: string;
  at: string;
}

/** Operational system event, for example a dependency failure. */
export interface SystemEvent {
  id: string;
  kind: string;
  message: string;
  caseId: string | null;
  at: string;
}

/** Post-call analysis produced after each conversation. */
export interface PostCallAnalysis {
  conversationId: string;
  caseRef: string;
  language: Language;
  summary: string;
  durationMs: number;
  fieldsExtracted: number;
  fieldsWithSourceSpans: number;
  openContradictions: number;
  escalationReason: string | null;
  decisionBoundary: string;
  nextAction: string;
  generatedAt: string;
}

/** One Agent Testing run record. */
export interface EvaluationRunRecord {
  run: number;
  passed: boolean;
  reason: string;
  toolCalls: Array<{ toolName: ToolName; outcome: ToolOutcome }>;
}

/** One evaluated scenario with multi-run results. */
export interface Evaluation {
  evaluationId: string;
  scenarioId: string;
  name: string;
  language: Language | 'en + ar';
  category: EvaluationCategory;
  agentVersion: string;
  runs: EvaluationRunRecord[];
  passRate: number;
  lastRunAt: string;
  transcriptRef: string | null;
}

/* ------------------------------------------------------------------ */
/* Aggregates returned by the API                                     */
/* ------------------------------------------------------------------ */

/** Case summary row for list views. */
export interface CaseSummary {
  caseId: string;
  externalReference: string;
  language: Language;
  status: CaseStatus;
  scenario: Scenario;
  claimantDisplayName: string;
  createdAt: string;
  updatedAt: string;
  evidenceCount: number;
  openContradictions: number;
  handoffState: 'none' | 'pending' | 'accepted' | 'failed';
  transcriptSegments: number;
}

/** Full case review payload. */
export interface CaseDetail extends BraidCase {
  conversations: Conversation[];
  transcript: TranscriptSegment[];
  evidence: EvidenceItem[];
  sourceRecords: SourceRecord[];
  contradictions: Contradiction[];
  handoffs: Handoff[];
  toolCalls: ToolCall[];
  analysis: {
    postCall: PostCallAnalysis | null;
    redactionEvents: RedactionEvent[];
    systemEvents: SystemEvent[];
  };
}

/** Aggregate evaluation results. */
export interface EvaluationSummary {
  agentVersion: string;
  aggregate: {
    scenarios: number;
    runsPerScenario: number;
    totalRuns: number;
    passed: number;
    passRate: number;
  };
  evaluations: Evaluation[];
}

/* ------------------------------------------------------------------ */
/* API envelopes                                                      */
/* ------------------------------------------------------------------ */

/** Structured error body. */
export interface ApiErrorBody {
  requestId: string;
  error: {
    code: string;
    message: string;
  };
}

/** Health dependency status. */
export interface HealthResponse {
  requestId: string;
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
  dependencies: {
    api: 'ok';
    database: { mode: 'in-memory' | 'postgres'; status: 'ok' | 'unavailable' };
    claimsSandbox: { status: 'ok' | 'unavailable'; lastSuccessAt: string | null };
    repairSandbox: { status: 'ok' | 'unavailable'; lastSuccessAt: string | null };
  };
}

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

/** Version of the Braid intake agent under test. */
export const AGENT_VERSION = 'braid-intake-1.4.0';

/** Workflow nodes in call order. */
export const WORKFLOW_NODE_ORDER: WorkflowNode[] = [
  'disclosure',
  'language',
  'consent',
  'intake',
  'clarification',
  'tool-retrieval',
  'comparison',
  'contradiction',
  'handoff',
  'close',
  'failure',
];

/** Approved human queue targets for handoff. */
export const QUEUE_TARGETS: QueueTarget[] = [
  'adjuster-queue',
  'human-follow-up-queue',
  'compliance-queue',
];

/** Tools exposed to the agent. Decision tools intentionally do not exist. */
export const AGENT_TOOLS: ToolName[] = [
  'claims-record',
  'repair-record',
  'adjuster-handoff',
  'request-human',
];

/**
 * Statement attached to every adjuster packet and post-call analysis.
 * Keeps the decision boundary explicit for reviewers.
 */
export const DECISION_BOUNDARY_STATEMENT =
  'Braid prepares evidence only. Liability, coverage, settlement value, payment, and claim closure remain with qualified human adjusters.';
