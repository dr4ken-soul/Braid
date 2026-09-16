/**
 * Schema validation tests. The queue allow list is enforced here,
 * in code at the boundary, not only in the agent prompt.
 */

import { describe, expect, it } from 'vitest';
import {
  caseListQuerySchema,
  createCaseRequestSchema,
  handoffRequestSchema,
  toolRequestSchema,
  webhookPayloadSchema,
} from '@braid/validation';

describe('createCaseRequestSchema', () => {
  it('accepts a valid request', () => {
    const result = createCaseRequestSchema.safeParse({ language: 'en', scenario: 'complete' });
    expect(result.success).toBe(true);
  });

  it('accepts Arabic with the dependency failure scenario', () => {
    const result = createCaseRequestSchema.safeParse({
      language: 'ar',
      scenario: 'dependency-failure',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown language', () => {
    const result = createCaseRequestSchema.safeParse({ language: 'fr', scenario: 'complete' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown scenario', () => {
    const result = createCaseRequestSchema.safeParse({ language: 'en', scenario: 'half' });
    expect(result.success).toBe(false);
  });
});

describe('caseListQuerySchema', () => {
  it('parses filters', () => {
    const result = caseListQuerySchema.safeParse({ status: 'handoff', language: 'ar', limit: '5' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.limit).toBe(5);
  });

  it('rejects a limit above 100', () => {
    const result = caseListQuerySchema.safeParse({ limit: '500' });
    expect(result.success).toBe(false);
  });
});

describe('handoffRequestSchema', () => {
  it('accepts an approved queue with a real reason', () => {
    const result = handoffRequestSchema.safeParse({
      destination: 'adjuster-queue',
      reason: 'Contradiction requires a human adjuster decision.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid queue target', () => {
    const result = handoffRequestSchema.safeParse({
      destination: 'supervisor-queue',
      reason: 'Contradiction requires a human adjuster decision.',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a short reason', () => {
    const result = handoffRequestSchema.safeParse({
      destination: 'adjuster-queue',
      reason: 'check',
    });
    expect(result.success).toBe(false);
  });
});

describe('toolRequestSchema', () => {
  it('accepts a case reference', () => {
    const result = toolRequestSchema.safeParse({ caseRef: 'FNOL-2026-0142' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty reference', () => {
    const result = toolRequestSchema.safeParse({ caseRef: '' });
    expect(result.success).toBe(false);
  });
});

describe('webhookPayloadSchema', () => {
  it('accepts a valid post-call payload', () => {
    const result = webhookPayloadSchema.safeParse({
      type: 'post-call',
      data: {
        conversationId: 'conv-1',
        caseRef: 'FNOL-2026-0142',
        transcript: [{ speaker: 'agent', text: 'Disclosure delivered.' }],
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a wrong event type', () => {
    const result = webhookPayloadSchema.safeParse({
      type: 'in-call',
      data: { conversationId: 'conv-1', caseRef: 'FNOL-2026-0142' },
    });
    expect(result.success).toBe(false);
  });
});
