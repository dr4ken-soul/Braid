/**
 * Adjuster handoff route. THE HIGH STAKES GATED ACTION.
 *
 * Guard order:
 * 1. Case must exist.
 * 2. Decision guard: reasons expressing coverage, settlement, payment,
 *    closure, fraud, or advice intent are refused and recorded as a
 *    blocked tool call. Braid routes for human review only.
 * 3. Queue gate: destination must be in the approved queue allow list,
 *    enforced by schema validation at the boundary, recorded as blocked.
 * 4. Readiness: transcript, evidence, source records, and a real reason
 *    must exist.
 *
 * This endpoint must never approve, deny, settle, or close a claim.
 */

import type { Request, Response } from 'express';
import { DECISION_BOUNDARY_STATEMENT, QUEUE_TARGETS } from '@braid/domain';
import type { HandoffRequest } from '@braid/validation';
import { handoffRequestSchema } from '@braid/validation';
import type { BraidRepository } from '../adapters/repository';
import type { CaseDetail, Handoff } from '@braid/domain';
import { checkRateLimit } from '../services/rate-limit';

const DECISION_INTENT =
  /approve|deny|reject claim|settle|closure|close claim|coverage decision|coverage determination|payment|pay claim|legal advice|medical advice|fraud/i;

function blockedToolCall(repository: BraidRepository, caseId: string, body: Record<string, unknown>, error: string, extra: Record<string, unknown> = {}) {
  repository.saveToolCall(caseId, {
    id: repository.shortId('tc-'),
    conversationId: null,
    caseId,
    toolName: 'adjuster-handoff',
    requestPayload: body,
    responsePayload: { error, ...extra },
    outcome: 'blocked',
    offsetMs: 0,
    latencyMs: 0,
    createdAt: new Date().toISOString(),
  });
}

function readinessGaps(detail: CaseDetail): string[] {
  const gaps: string[] = [];
  if (detail.transcript.length === 0) gaps.push('transcript');
  if (detail.evidence.length === 0) gaps.push('extracted facts');
  if (detail.sourceRecords.length === 0) gaps.push('source records');
  return gaps;
}

/** POST /api/cases/:caseId/handoff */
export function handleHandoff(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    const caseIdOrRef = req.params.caseId;
    const caseId = repository.findCaseId(caseIdOrRef);
    if (!caseId) {
      res.status(404).json({
        requestId: res.locals.requestId,
        error: { code: 'NOT_FOUND', message: 'No case exists with this reference.' },
      });
      return;
    }

    if (!checkRateLimit(`handoff:${caseId}`, 10)) {
      res.status(429).json({
        requestId: res.locals.requestId,
        error: { code: 'RATE_LIMITED', message: 'Rate limit reached. Try again shortly.' },
      });
      return;
    }

    const rawBody = req.body as Record<string, unknown>;
    const reason = typeof rawBody.reason === 'string' ? rawBody.reason : '';

    // Guard 2: decision intent is out of scope for this endpoint.
    if (DECISION_INTENT.test(reason) || DECISION_INTENT.test(String(rawBody.destination ?? ''))) {
      blockedToolCall(repository, caseId, rawBody, 'DECISION_OUT_OF_SCOPE');
      res.status(422).json({
        requestId: res.locals.requestId,
        error: {
          code: 'DECISION_OUT_OF_SCOPE',
          message: 'Braid routes cases for human review only. Claim decisions are not supported on this endpoint.',
        },
      });
      return;
    }

    // Guard 3: queue allow list, enforced by schema.
    const parsed = handoffRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const isQueueIssue = issue?.path.includes('destination');
      if (isQueueIssue) {
        blockedToolCall(repository, caseId, rawBody, 'INVALID_QUEUE_TARGET', {
          allowedQueues: QUEUE_TARGETS,
        });
        res.status(400).json({
          requestId: res.locals.requestId,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Unknown queue target. Allowed queues: ${QUEUE_TARGETS.join(', ')}.`,
          },
        });
        return;
      }
      blockedToolCall(repository, caseId, rawBody, 'VALIDATION_ERROR');
      res.status(400).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message: issue?.message ?? 'Invalid handoff request.' },
      });
      return;
    }

    const request = parsed.data as HandoffRequest;
    const detail = repository.getCaseDetail(caseId);
    if (!detail) {
      res.status(404).json({
        requestId: res.locals.requestId,
        error: { code: 'NOT_FOUND', message: 'No case exists with this reference.' },
      });
      return;
    }

    // Guard 4: readiness.
    const gaps = readinessGaps(detail);
    if (gaps.length > 0) {
      blockedToolCall(repository, caseId, rawBody, 'CASE_NOT_READY', { missing: gaps });
      res.status(422).json({
        requestId: res.locals.requestId,
        error: {
          code: 'VALIDATION_ERROR',
          message: `The case is missing required evidence: ${gaps.join(', ')}.`,
        },
      });
      return;
    }

    const previousHandoffs = repository.getCaseDetail(caseId)?.handoffs ?? [];
    const latestPacket = previousHandoffs[0]?.packet;
    const now = new Date().toISOString();
    const handoffId = repository.shortId('ho-');
    const handoff: Handoff = {
      id: handoffId,
      caseId,
      destination: request.destination as Handoff['destination'],
      reason: request.reason,
      createdBy: request.createdBy ?? 'operator',
      createdAt: now,
      queueAcceptance: {
        queue: request.destination,
        acceptedBy: 'adjuster-queue-mock',
        acceptedAt: new Date().toISOString(),
        state: 'accepted',
      },
      packet: {
        caseRef: detail.externalReference,
        language: detail.language,
        escalationReason: request.reason,
        transcriptRef: detail.conversations[0]?.conversationId ?? '',
        evidenceRefs: detail.evidence.map((item) => item.id),
        contradictionRefs: detail.contradictions.map((item) => item.id),
        sourceRefs: detail.sourceRecords.map((item) => item.id),
        followUpItems:
          latestPacket?.followUpItems && latestPacket.followUpItems.length > 0
            ? latestPacket.followUpItems
            : ['Human review requested from case console'],
        callerQuestions: latestPacket?.callerQuestions ?? [],
        decisionBoundary: DECISION_BOUNDARY_STATEMENT,
      },
    };
    repository.saveHandoff(caseId, handoff);

    repository.saveToolCall(caseId, {
      id: repository.shortId('tc-'),
      conversationId: detail.conversations[0]?.conversationId ?? null,
      caseId,
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: detail.externalReference, destination: request.destination, reason: request.reason },
      responsePayload: { handoffId, queue: request.destination, state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 0,
      latencyMs: 5,
      createdAt: now,
    });

    res.status(201).json({ requestId: res.locals.requestId, handoff });
  };
}
