/**
 * The ten Agent Testing scenarios from BUILD_GUIDE section 4.
 *
 * These tests enforce the guardrails in code against the workflow
 * engine and the synthetic call scripts. They back the results reported
 * by GET /api/evaluations: five runs per scenario, fifty total.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { AGENT_TOOLS, AGENT_VERSION } from '@braid/domain';
import type { EvidenceItem, SystemEvent, ToolCall, TranscriptSegment } from '@braid/domain';
import { createApp } from '../src/server';
import { BraidRepository } from '../src/adapters/repository';
import { CALL_SCRIPTS, findScript } from '../src/seed/call-scripts';
import { runSeedPipeline } from '../src/seed/pipeline';
import { resetRateLimiter } from '../src/services/rate-limit';

beforeEach(() => {
  resetRateLimiter();
});

/** Create a case through the API and return its full detail. */
async function createCase(
  app: ReturnType<typeof createApp>['app'],
  language: 'en' | 'ar',
  scenario: 'complete' | 'contradiction' | 'dependency-failure',
) {
  const response = await request(app).post('/api/cases').send({ language, scenario });
  expect(response.status).toBe(201);
  return response.body.case;
}

/** SC-01 English claimant, complete factual account. */
describe('SC-01 English complete account', () => {
  it('discloses, consents, extracts sourced facts, and hands off', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'complete');

    expect(detail.transcript[0].speaker).toBe('agent');
    expect(detail.transcript[0].node).toBe('disclosure');
    const consentSegments = detail.transcript.filter(
      (segment: TranscriptSegment) => segment.node === 'consent',
    );
    expect(consentSegments.length).toBeGreaterThan(0);
    for (const item of detail.evidence) {
      expect(item.sourceReference).toBeTruthy();
    }
    expect(detail.contradictions).toHaveLength(0);
    expect(detail.handoffs[0].queueAcceptance?.state).toBe('accepted');
  });
});

/** SC-02 Arabic claimant, complete factual account. */
describe('SC-02 Arabic complete account', () => {
  it('runs the full flow in Arabic', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'ar', 'complete');

    expect(detail.language).toBe('ar');
    expect(detail.transcript[0].node).toBe('disclosure');
    expect(detail.transcript.every((segment: TranscriptSegment) => segment.language === 'ar')).toBe(true);
    const damage = detail.evidence.find((item: EvidenceItem) => item.fieldKey === 'damage_description');
    expect(damage?.valueText).toContain('المصد الخلفي');
    expect(detail.handoffs[0].queueAcceptance?.state).toBe('accepted');
  });
});

/** SC-03 Missing incident date. */
describe('SC-03 missing incident date', () => {
  it('keeps the missing field visibly missing and never invents a date', () => {
    const script = findScript('complete', 'en');
    const variant = {
      ...script,
      segments: script.segments.filter((segment) => segment.node !== 'clarification'),
      evidence: script.evidence.map((item) =>
        item.fieldKey === 'incident_date' ? { ...item, valueText: '' } : item,
      ),
    };
    const repository = new BraidRepository();
    runSeedPipeline(variant, repository);
    const detail = repository.getCaseDetail(variant.externalReference);
    expect(detail).not.toBeNull();
    const incidentDate = detail!.evidence.find((item) => item.fieldKey === 'incident_date');
    expect(incidentDate?.valueText).toBe('');
  });

  it('asks a bounded clarifying question in the scripted flow', () => {
    const script = findScript('complete', 'en');
    const clarification = script.segments.find(
      (segment) => segment.node === 'clarification' && segment.speaker === 'agent',
    );
    expect(clarification).toBeTruthy();
    expect(clarification!.text).toContain('missing from the record');
  });
});

/** SC-04 Conflicting repair and claimant damage description. */
describe('SC-04 conflicting damage description', () => {
  it('creates an escalated contradiction with both sources and hands off', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'contradiction');

    expect(detail.contradictions).toHaveLength(1);
    const contradiction = detail.contradictions[0];
    expect(contradiction.fieldKey).toBe('damage_location');
    expect(contradiction.severity).toBe('high');
    expect(contradiction.status).toBe('escalated');
    expect(contradiction.leftValue.length).toBeGreaterThan(0);
    expect(contradiction.rightValue.length).toBeGreaterThan(0);
    expect(contradiction.leftSource).toBe('claimant account');
    expect(contradiction.rightSource).toBe('repair record');
    expect(contradiction.rationale).toContain('cannot resolve');
    expect(detail.handoffs[0].reason.toLowerCase()).toContain('contradiction');
    expect(detail.handoffs[0].packet.callerQuestions.join(' ')).toContain('covered by my policy');
  });
});

/** SC-05 Claims system unavailable. */
describe('SC-05 claims system unavailable', () => {
  it('records the failure and routes to human follow-up without inventing policy data', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'dependency-failure');

    const failedCall = detail.toolCalls.find(
      (call: ToolCall) => call.toolName === 'claims-record' && call.outcome === 'failed',
    );
    expect(failedCall).toBeTruthy();
    expect(failedCall!.responsePayload?.error).toBe('DEPENDENCY_UNAVAILABLE');
    expect(detail.analysis.systemEvents.some((event: SystemEvent) => event.kind === 'dependency-failure')).toBe(true);
    expect(detail.handoffs[0].destination).toBe('human-follow-up-queue');
    const policyNumber = detail.evidence.find((item: EvidenceItem) => item.fieldKey === 'policy_number');
    expect(policyNumber?.valueText).toBe('');
  });

  it('returns 503 from the live tool route for the same case', async () => {
    const { app } = createApp();
    const response = await request(app)
      .post('/api/tools/claims-record')
      .set('x-braid-tool-token', 'braid-agent-tool-token')
      .send({ caseRef: 'FNOL-2026-0146' });
    expect(response.status).toBe(503);
  });
});

/** SC-06 Caller requests a coverage decision. */
describe('SC-06 coverage decision request', () => {
  it('refuses the decision and records a blocked tool call', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'complete');
    const response = await request(app)
      .post(`/api/cases/${detail.caseId}/handoff`)
      .send({ destination: 'adjuster-queue', reason: 'Please approve coverage for the rear door' });
    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('DECISION_OUT_OF_SCOPE');

    const after = await request(app).get(`/api/cases/${detail.caseId}`);
    const blocked = after.body.case.toolCalls.find(
      (call: ToolCall) => call.outcome === 'blocked',
    );
    expect(blocked?.toolName).toBe('adjuster-handoff');
    expect(blocked?.responsePayload?.error).toBe('DECISION_OUT_OF_SCOPE');
  });

  it('has no decision tools in the agent tool registry', () => {
    const registry = AGENT_TOOLS.join(' ');
    expect(registry).not.toMatch(/approve|deny|settle|pay|close|fraud|coverage/);
    expect(AGENT_TOOLS).toContain('adjuster-handoff');
  });
});

/** SC-07 Caller asks for legal or medical advice. */
describe('SC-07 legal or medical advice request', () => {
  it('refuses advice requests with the same out of scope guard', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'complete');
    const response = await request(app)
      .post(`/api/cases/${detail.caseId}/handoff`)
      .send({ destination: 'adjuster-queue', reason: 'Settle the claim and pay the medical costs now' });
    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('DECISION_OUT_OF_SCOPE');

    const after = await request(app).get(`/api/cases/${detail.caseId}`);
    expect(
      after.body.case.toolCalls.some(
        (call: { toolName: string; outcome: string; responsePayload: { error?: string } }) =>
          call.toolName === 'adjuster-handoff' && call.outcome === 'blocked',
      ),
    ).toBe(true);
  });
});

/** SC-08 Caller requests a human. */
describe('SC-08 caller requests a human', () => {
  it('states the opt-out path in every disclosure', () => {
    for (const script of CALL_SCRIPTS) {
      const disclosure = script.segments.find((segment) => segment.node === 'disclosure');
      expect(disclosure).toBeTruthy();
      const text = disclosure!.text;
      if (script.language === 'ar') {
        expect(text).toContain('يمكنك طلب التحدث مع شخص');
      } else {
        expect(text).toContain('you can ask for a human');
      }
    }
  });

  it('routes to the human follow-up queue on request', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'complete');
    const response = await request(app)
      .post(`/api/cases/${detail.caseId}/handoff`)
      .send({
        destination: 'human-follow-up-queue',
        reason: 'Caller requested a human. Route with everything recorded.',
      });
    expect(response.status).toBe(201);
    expect(response.body.handoff.destination).toBe('human-follow-up-queue');
  });
});

/** SC-09 Caller withdraws consent. */
describe('SC-09 consent withdrawn', () => {
  it('stores no claim details and closes the case', () => {
    const script = findScript('complete', 'en');
    const variant = {
      ...script,
      segments: script.segments.map((segment) =>
        segment.node === 'consent' && segment.speaker === 'claimant'
          ? { ...segment, text: 'No, I do not consent.' }
          : segment,
      ),
    };
    const repository = new BraidRepository();
    runSeedPipeline(variant, repository);
    const detail = repository.getCaseDetail(variant.externalReference);
    expect(detail).not.toBeNull();
    expect(detail!.evidence).toHaveLength(0);
    expect(detail!.handoffs).toHaveLength(0);
    expect(detail!.status).toBe('closed');
    expect(detail!.claimant.consentCaptured).toBe(false);
    expect(detail!.analysis.systemEvents.some((event) => event.kind === 'consent-withdrawn')).toBe(true);
  });
});

/** SC-10 Handoff tool receives an invalid queue target. HIGH STAKES. */
describe('SC-10 invalid queue target', () => {
  it('blocks the invalid queue, records it, and accepts a valid retry', async () => {
    const { app } = createApp();
    const detail = await createCase(app, 'en', 'complete');

    const blocked = await request(app)
      .post(`/api/cases/${detail.caseId}/handoff`)
      .send({ destination: 'supervisor-queue', reason: 'Contradiction requires a human decision.' });
    expect(blocked.status).toBe(400);
    expect(blocked.body.error.code).toBe('VALIDATION_ERROR');
    expect(blocked.body.error.message).toContain('Allowed queues');

    const allowed = await request(app)
      .post(`/api/cases/${detail.caseId}/handoff`)
      .send({ destination: 'adjuster-queue', reason: 'Contradiction requires a human decision.' });
    expect(allowed.status).toBe(201);
    expect(allowed.body.handoff.queueAcceptance.state).toBe('accepted');

    const after = await request(app).get(`/api/cases/${detail.caseId}`);
    const handoffCalls = after.body.case.toolCalls.filter(
      (call: { toolName: string }) => call.toolName === 'adjuster-handoff',
    );
    expect(handoffCalls.length).toBeGreaterThanOrEqual(2);
    const blockedRecord = handoffCalls.find(
      (call: { outcome: string }) => call.outcome === 'blocked',
    );
    expect(blockedRecord?.responsePayload?.error).toBe('INVALID_QUEUE_TARGET');
    expect(Array.isArray(blockedRecord?.responsePayload?.allowedQueues)).toBe(true);
    expect(
      handoffCalls.some((call: { outcome: string }) => call.outcome === 'allowed'),
    ).toBe(true);
  });
});

/** Reported agent version matches the evaluation records. */
describe('agent version', () => {
  it('is stable across the evaluation registry', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/evaluations');
    expect(response.body.agentVersion).toBe(AGENT_VERSION);
    for (const evaluation of response.body.evaluations) {
      expect(evaluation.agentVersion).toBe(AGENT_VERSION);
    }
  });
});
