/**
 * Synthetic intake pipeline.
 *
 * Converts a CallScript into the full set of repository records:
 * case, conversation, transcript segments, evidence, source records,
 * contradictions, handoff, tool calls, post-call analysis, and system
 * events. The seeded cases use fixed identifiers so tests and documents
 * stay deterministic. Cases created through POST /api/cases use fresh
 * identifiers and current timestamps.
 *
 * Consent guard: when the claimant does not consent, no claim details
 * are stored and the case closes without evidence or handoff.
 */

import type {
  BraidCase,
  Conversation,
  Contradiction,
  EvidenceItem,
  Handoff,
  PostCallAnalysis,
  SourceRecord,
  SystemEvent,
  ToolCall,
  TranscriptSegment,
  WorkflowNode,
} from '@braid/domain';

import type { BraidRepository } from '../adapters/repository';
import type { CallScript } from './call-scripts';

const CONSENT_YES_PATTERN = /yes|نعم أوافق|أوافق|fine|agree|consent|موافق/i;
const CONSENT_REFUSE_PATTERN = /not consent|decline|refuse|أرفض|لا أوافق|غير موافق/i;

/** True when the script shows a consenting claimant. */
function consentGranted(script: CallScript): boolean {
  const consentSegments = script.segments.filter(
    (segment) => segment.node === 'consent' && segment.speaker === 'claimant',
  );
  if (consentSegments.length === 0) return false;
  return consentSegments.every(
    (segment) =>
      !CONSENT_REFUSE_PATTERN.test(segment.text) && CONSENT_YES_PATTERN.test(segment.text),
  );
}

interface Timestamps {
  base: number;
  baseIso: string;
}

function addMs(timestamps: Timestamps, offsetMs: number): string {
  return new Date(timestamps.base + offsetMs).toISOString();
}

export interface PipelineResult {
  caseId: string;
  externalReference: string;
  conversationId: string;
  consentGranted: boolean;
}

/** Offset used to record the contradiction on the case timeline. */
function contradictionOffset(script: CallScript): number {
  const comparisonSegments = script.segments.filter((segment) => segment.node === 'comparison');
  const last = comparisonSegments[comparisonSegments.length - 1];
  return (last?.endMs ?? script.segments[script.segments.length - 1].endMs) + 500;
}

/** Run the pipeline for a script with fixed seed identifiers. */
export function runSeedPipeline(script: CallScript, repository: BraidRepository): PipelineResult {
  const caseNumber = script.externalReference.slice(-4);
  const toolHandoffId =
    (script.toolCalls.find((call) => call.toolName === 'adjuster-handoff')?.responsePayload as
      | { handoffId?: string }
      | undefined)?.handoffId ?? `ho-${caseNumber}-01`;
  return persistScript(script, repository, {
    caseId: script.caseId,
    conversationId: script.conversationId,
    externalReference: script.externalReference,
    baseIso: script.baseTimestamp,
    evidenceId: (index: number) => `ev-${caseNumber}-${String(index + 1).padStart(2, '0')}`,
    sourceRecordId: (index: number) => `sr-${caseNumber}-${String(index + 1).padStart(2, '0')}`,
    toolCallId: (index: number) => `tc-${caseNumber}-${String(index + 1).padStart(2, '0')}`,
    contradictionId: () => `ct-${caseNumber}-01`,
    handoffId: () => toolHandoffId,
    redactionId: () => `rd-${caseNumber}-01`,
    systemEventId: (index: number) => `se-${caseNumber}-${String(index + 1).padStart(2, '0')}`,
  });
}

/** Run the pipeline with fresh identifiers and current timestamps. */
export function createCaseFromScript(script: CallScript, repository: BraidRepository): PipelineResult {
  const externalReference = repository.reserveExternalReference();
  const caseId = crypto.randomUUID();
  const conversationId = crypto.randomUUID();
  return persistScript(script, repository, {
    caseId,
    conversationId,
    externalReference,
    baseIso: new Date().toISOString(),
    evidenceId: () => repository.shortId('ev-'),
    sourceRecordId: () => repository.shortId('sr-'),
    toolCallId: () => repository.shortId('tc-'),
    contradictionId: () => repository.shortId('ct-'),
    handoffId: () => repository.shortId('ho-'),
    redactionId: () => repository.shortId('rd-'),
    systemEventId: () => repository.shortId('se-'),
  });
}

interface IdFactories {
  caseId: string;
  conversationId: string;
  externalReference: string;
  baseIso: string;
  evidenceId: (index: number) => string;
  sourceRecordId: (index: number) => string;
  toolCallId: (index: number) => string;
  contradictionId: () => string;
  handoffId: () => string;
  redactionId: () => string;
  systemEventId: (index: number) => string;
}

function persistScript(
  script: CallScript,
  repository: BraidRepository,
  ids: IdFactories,
): PipelineResult {
  const timestamps: Timestamps = { base: new Date(ids.baseIso).getTime(), baseIso: ids.baseIso };
  const lastSegment = script.segments[script.segments.length - 1];
  const endedAt = addMs(timestamps, lastSegment.endMs);
  const granted = consentGranted(script);

  const record: BraidCase = {
    caseId: ids.caseId,
    externalReference: ids.externalReference,
    status: granted ? 'handoff' : 'closed',
    language: script.language,
    scenario: script.scenario,
    claimant: {
      displayName: script.claimant.displayName,
      phoneMasked: maskPhoneFromScript(script),
      consentCaptured: granted,
    },
    createdAt: ids.baseIso,
    updatedAt: endedAt,
  };
  repository.saveCase(record);

  const conversation: Conversation = {
    conversationId: ids.conversationId,
    caseId: ids.caseId,
    elevenlabsConversationId: null,
    channel: 'web',
    startedAt: ids.baseIso,
    endedAt,
    transcriptStatus: 'complete',
  };
  repository.saveConversation(conversation);

  const segments: TranscriptSegment[] = script.segments.map((segment, index) => ({
    conversationId: ids.conversationId,
    sequence: index + 1,
    speaker: segment.speaker,
    node: segment.node,
    text: segment.text,
    language: script.language,
    startMs: segment.startMs,
    endMs: segment.endMs,
  }));
  repository.saveSegments(ids.conversationId, segments);

  const systemEvents: SystemEvent[] = [];
  let eventIndex = 0;
  if (!granted) {
    systemEvents.push({
      id: ids.systemEventId(eventIndex),
      kind: 'consent-withdrawn',
      message: 'Consent not granted. Claim details were not stored.',
      caseId: ids.caseId,
      at: addMs(timestamps, segments.find((s) => s.node === 'consent')?.endMs ?? 0),
    });
    eventIndex += 1;
  } else {
    const evidence: EvidenceItem[] = script.evidence.map((item, index) => ({
      id: ids.evidenceId(index),
      caseId: ids.caseId,
      category: item.category,
      fieldKey: item.fieldKey,
      valueText: item.valueText,
      confidence: item.valueText === '' ? null : item.confidence,
      sourceType: item.sourceType,
      sourceReference: item.valueText === '' && script.scenario === 'dependency-failure' && item.sourceType === 'policy-record'
        ? item.sourceReference
        : item.sourceReference,
    }));
    repository.saveEvidence(ids.caseId, evidence);

    const sourceRecords: SourceRecord[] = script.sourceRecords.map((item, index) => ({
      id: ids.sourceRecordId(index),
      caseId: ids.caseId,
      recordType: item.recordType,
      providerReference: item.providerReference,
      payload: item.payload,
      retrievedAt: addMs(timestamps, item.offsetMs),
      available: true,
    }));
    repository.saveSourceRecords(ids.caseId, sourceRecords);

    if (script.contradiction) {
      const createdAt = addMs(timestamps, contradictionOffset(script));
      const contradiction: Contradiction = {
        id: ids.contradictionId(),
        caseId: ids.caseId,
        fieldKey: script.contradiction.fieldKey,
        severity: script.contradiction.severity,
        leftValue: script.contradiction.leftValue,
        rightValue: script.contradiction.rightValue,
        leftSource: script.contradiction.leftSource,
        rightSource: script.contradiction.rightSource,
        leftReference: script.contradiction.leftReference,
        rightReference: script.contradiction.rightReference,
        rationale: script.contradiction.rationale,
        status: 'escalated',
        createdAt,
      };
      repository.saveContradictions(ids.caseId, [contradiction]);
    }

    const toolCalls: ToolCall[] = script.toolCalls.map((call, index) => ({
      id: ids.toolCallId(index),
      conversationId: ids.conversationId,
      caseId: ids.caseId,
      toolName: call.toolName,
      requestPayload: call.requestPayload,
      responsePayload: call.responsePayload,
      outcome: call.outcome,
      offsetMs: call.offsetMs,
      latencyMs: call.latencyMs,
      createdAt: addMs(timestamps, call.offsetMs),
    }));
    for (const call of toolCalls) repository.saveToolCall(ids.caseId, call);

    const handoffCall = script.toolCalls.find((call) => call.toolName === 'adjuster-handoff');
    if (handoffCall) {
      const handoff: Handoff = {
        id: ids.handoffId(),
        caseId: ids.caseId,
        destination: script.handoff.destination,
        reason: script.handoff.reason,
        createdBy: script.handoff.createdBy,
        createdAt: addMs(timestamps, handoffCall.offsetMs),
        queueAcceptance: {
          queue: script.handoff.destination,
          acceptedBy: 'adjuster-queue-mock',
          acceptedAt: addMs(timestamps, handoffCall.offsetMs + handoffCall.latencyMs),
          state: 'accepted',
        },
        packet: {
          caseRef: ids.externalReference,
          language: script.language,
          escalationReason: script.handoff.reason,
          transcriptRef: ids.conversationId,
          evidenceRefs: evidence.map((item) => item.id),
          contradictionRefs: script.contradiction ? [ids.contradictionId()] : [],
          sourceRefs: sourceRecords.map((item) => item.id),
          followUpItems: script.handoff.followUpItems,
          callerQuestions: script.handoff.callerQuestions,
          decisionBoundary: script.analysis.decisionBoundary,
        },
      };
      repository.saveHandoff(ids.caseId, handoff);
    }

    const analysis: PostCallAnalysis = {
      conversationId: ids.conversationId,
      caseRef: ids.externalReference,
      language: script.language,
      summary: script.analysis.summary,
      durationMs: lastSegment.endMs,
      fieldsExtracted: evidence.length,
      fieldsWithSourceSpans: evidence.filter((item) => item.sourceReference).length,
      openContradictions: script.contradiction ? 1 : 0,
      escalationReason: script.handoff.reason,
      decisionBoundary: script.analysis.decisionBoundary,
      nextAction: script.analysis.nextAction,
      generatedAt: endedAt,
    };
    repository.saveAnalysis(ids.conversationId, analysis);

    if (script.scenario === 'dependency-failure') {
      systemEvents.push({
        id: ids.systemEventId(eventIndex),
        kind: 'dependency-failure',
        message:
          script.language === 'ar'
            ? 'نظام المطالبات غير متاح أثناء الاستقبال وحُول الملف إلى متابعة بشرية.'
            : 'Claims sandbox unavailable during tool retrieval. Case routed to human follow-up.',
        caseId: ids.caseId,
        at: addMs(timestamps, script.toolCalls.find((call) => call.toolName === 'claims-record')?.offsetMs ?? 0),
      });
      eventIndex += 1;
    }
    systemEvents.push({
      id: ids.systemEventId(eventIndex),
      kind: 'intake-completed',
      message: `Synthetic intake pipeline completed for ${ids.externalReference}`,
      caseId: ids.caseId,
      at: endedAt,
    });
  }

  for (const event of systemEvents) repository.addSystemEvent(ids.caseId, event);

  repository.addRedactionEvent(ids.caseId, {
    id: ids.redactionId(),
    caseId: ids.caseId,
    field: 'claimant.phone',
    action: 'masked',
    view: 'case-detail',
    at: endedAt,
  });

  return {
    caseId: ids.caseId,
    externalReference: ids.externalReference,
    conversationId: ids.conversationId,
    consentGranted: granted,
  };
}

/** Mask the synthetic claimant phone from the script fixture. */
function maskPhoneFromScript(script: CallScript): string {
  const digits = script.claimant.phone.replace(/[^\d+]/g, '');
  const groups = script.claimant.phone.trim().split(/\s+/);
  if (groups.length < 3) return digits;
  return `${groups.slice(0, 2).join(' ')} *** ${digits.slice(-4)}`;
}

/** Workflow node list for a script, deduplicated in call order. */
export function workflowNodesFor(script: CallScript): WorkflowNode[] {
  const nodes: WorkflowNode[] = [];
  for (const segment of script.segments) {
    if (!nodes.includes(segment.node)) nodes.push(segment.node);
  }
  return nodes;
}
