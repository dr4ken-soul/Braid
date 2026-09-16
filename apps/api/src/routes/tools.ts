/**
 * Agent-scoped server tool routes.
 *
 * Claims record and repair record retrieval. Read-only, limited to the
 * case reference supplied by the server. Tool calls are recorded in the
 * audit trail with request, response, and result state.
 */

import type { Request, Response } from 'express';
import type { ToolRequest } from '@braid/validation';
import { toolRequestSchema } from '@braid/validation';
import type { BraidRepository } from '../adapters/repository';
import type { RepairRecordPayload } from '@braid/domain';
import { getClaimsRecord } from '../adapters/claims-sandbox';
import { getRepairRecord } from '../adapters/repair-record';
import { checkRateLimit } from '../services/rate-limit';
import { logToolEvent } from '../services/logger';

const TOOL_TOKEN = process.env.BRAID_TOOL_TOKEN ?? 'braid-agent-tool-token';
const DEMO_TOKEN = process.env.BRAID_DEMO_TOKEN ?? 'braid-demo-token';

function toolAuth(req: Request): boolean {
  const toolToken = req.header('x-braid-tool-token');
  const demoToken = req.header('x-braid-demo-token');
  return toolToken === TOOL_TOKEN || demoToken === DEMO_TOKEN;
}

/** Find the claim, policy, and repair payloads recorded for a case. */
function findRecordPayloads(detail: NonNullable<ReturnType<BraidRepository['getCaseDetail']>>) {
  const claimRecord = detail.sourceRecords.find((item) => item.recordType === 'claim');
  const policyRecord = detail.sourceRecords.find((item) => item.recordType === 'policy');
  const repairRecord = detail.sourceRecords.find((item) => item.recordType === 'repair');
  return { claimRecord, policyRecord, repairRecord };
}

/** POST /api/tools/claims-record */
export function handleClaimsRecord(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    if (!toolAuth(req)) {
      res.status(401).json({
        requestId: res.locals.requestId,
        error: { code: 'UNAUTHORIZED', message: 'Agent tool token missing or invalid.' },
      });
      return;
    }
    const parsed = toolRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid tool request.' },
      });
      return;
    }
    const request = parsed.data as ToolRequest;
    const caseId = repository.findCaseId(request.caseRef);
    const detail = caseId ? repository.getCaseDetail(caseId) : null;
    if (!caseId || !detail) {
      res.status(404).json({
        requestId: res.locals.requestId,
        error: { code: 'NOT_FOUND', message: 'No case exists with this reference.' },
      });
      return;
    }
    if (!checkRateLimit(`tool:${caseId}:claims-record`, 30)) {
      res.status(429).json({
        requestId: res.locals.requestId,
        error: { code: 'RATE_LIMITED', message: 'Rate limit reached. Try again shortly.' },
      });
      return;
    }

    const record = repository.getCase(caseId);
    const { claimRecord, policyRecord } = findRecordPayloads(detail);
    const result = record && claimRecord && policyRecord
      ? getClaimsRecord(
          record,
          claimRecord.payload as Parameters<typeof getClaimsRecord>[1],
          policyRecord.payload as Parameters<typeof getClaimsRecord>[2],
          claimRecord.retrievedAt,
        )
      : { available: false, error: { code: 'DEPENDENCY_UNAVAILABLE' as const, dependency: 'claims-sandbox' as const, message: 'The claims system cannot be reached right now.' } };

    if (!result.available || !result.claim || !result.policy) {
      const message =
        record?.language === 'ar'
          ? 'لا يمكن الوصول إلى نظام المطالبات الآن.'
          : 'The claims system cannot be reached right now. The case is marked for human follow-up.';
      repository.saveToolCall(caseId, {
        id: repository.shortId('tc-'),
        conversationId: detail.conversations[0]?.conversationId ?? null,
        caseId,
        toolName: 'claims-record',
        requestPayload: { caseRef: request.caseRef, tool: 'claims-record' },
        responsePayload: { error: 'DEPENDENCY_UNAVAILABLE', dependency: 'claims-sandbox' },
        outcome: 'failed',
        offsetMs: 0,
        latencyMs: 3200,
        createdAt: new Date().toISOString(),
      });
      logToolEvent({ requestId: res.locals.requestId, toolName: 'claims-record', caseId, outcome: 'failed', latencyMs: 3200 });
      res.status(503).json({
        requestId: res.locals.requestId,
        error: { code: 'DEPENDENCY_UNAVAILABLE', message },
      });
      return;
    }

    repository.saveToolCall(caseId, {
      id: repository.shortId('tc-'),
      conversationId: detail.conversations[0]?.conversationId ?? null,
      caseId,
      toolName: 'claims-record',
      requestPayload: { caseRef: request.caseRef, tool: 'claims-record' },
      responsePayload: { claimNumber: result.claim.claimNumber, policyNumber: result.policy.policyNumber, verified: true },
      outcome: 'allowed',
      offsetMs: 0,
      latencyMs: 420,
      createdAt: new Date().toISOString(),
    });
    logToolEvent({ requestId: res.locals.requestId, toolName: 'claims-record', caseId, outcome: 'allowed', latencyMs: 420 });
    res.status(200).json({
      requestId: res.locals.requestId,
      record: { claim: result.claim, policy: result.policy, observedAt: result.retrievedAt },
    });
  };
}

/** POST /api/tools/repair-record */
export function handleRepairRecord(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    if (!toolAuth(req)) {
      res.status(401).json({
        requestId: res.locals.requestId,
        error: { code: 'UNAUTHORIZED', message: 'Agent tool token missing or invalid.' },
      });
      return;
    }
    const parsed = toolRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid tool request.' },
      });
      return;
    }
    const request = parsed.data as ToolRequest;
    const caseId = repository.findCaseId(request.caseRef);
    const detail = caseId ? repository.getCaseDetail(caseId) : null;
    if (!caseId || !detail) {
      res.status(404).json({
        requestId: res.locals.requestId,
        error: { code: 'NOT_FOUND', message: 'No case exists with this reference.' },
      });
      return;
    }
    if (!checkRateLimit(`tool:${caseId}:repair-record`, 30)) {
      res.status(429).json({
        requestId: res.locals.requestId,
        error: { code: 'RATE_LIMITED', message: 'Rate limit reached. Try again shortly.' },
      });
      return;
    }

    const { repairRecord } = findRecordPayloads(detail);
    if (!repairRecord) {
      const message = 'The repair record system cannot be reached right now.';
      repository.saveToolCall(caseId, {
        id: repository.shortId('tc-'),
        conversationId: detail.conversations[0]?.conversationId ?? null,
        caseId,
        toolName: 'repair-record',
        requestPayload: { caseRef: request.caseRef, tool: 'repair-record' },
        responsePayload: { error: 'DEPENDENCY_UNAVAILABLE', dependency: 'repair-sandbox' },
        outcome: 'failed',
        offsetMs: 0,
        latencyMs: 380,
        createdAt: new Date().toISOString(),
      });
      logToolEvent({ requestId: res.locals.requestId, toolName: 'repair-record', caseId, outcome: 'failed', latencyMs: 380 });
      res.status(503).json({
        requestId: res.locals.requestId,
        error: { code: 'DEPENDENCY_UNAVAILABLE', message },
      });
      return;
    }

    const repairPayload = repairRecord.payload as RepairRecordPayload;
    const record = repository.getCase(caseId);
    const result = record ? getRepairRecord(record, repairPayload, repairRecord.retrievedAt) : null;
    repository.saveToolCall(caseId, {
      id: repository.shortId('tc-'),
      conversationId: detail.conversations[0]?.conversationId ?? null,
      caseId,
      toolName: 'repair-record',
      requestPayload: { caseRef: request.caseRef, tool: 'repair-record' },
      responsePayload: { repairOrder: repairPayload.repairOrder, verified: true },
      outcome: 'allowed',
      offsetMs: 0,
      latencyMs: 380,
      createdAt: new Date().toISOString(),
    });
    logToolEvent({ requestId: res.locals.requestId, toolName: 'repair-record', caseId, outcome: 'allowed', latencyMs: 380 });
    res.status(200).json({
      requestId: res.locals.requestId,
      record: { repair: result?.repair ?? repairPayload, observedAt: repairRecord.retrievedAt },
    });
  };
}
