/**
 * Webhook signature and route tests. Signatures are HMAC SHA-256 over
 * the raw body, verified timing safely, and storage is idempotent.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { signWebhookPayload, verifyWebhookSignature } from '@braid/elevenlabs';
import { createApp } from '../src/server';

const SECRET = 'test-webhook-secret';

beforeAll(() => {
  process.env.BRAID_WEBHOOK_SECRET = SECRET;
});

describe('signature helpers', () => {
  it('round trips a signature', () => {
    const body = JSON.stringify({ type: 'post-call', data: { conversationId: 'x', caseRef: 'y' } });
    const signature = signWebhookPayload(body, SECRET);
    expect(verifyWebhookSignature(body, signature, SECRET)).toBe(true);
  });

  it('rejects a tampered body', () => {
    const body = JSON.stringify({ type: 'post-call', data: { conversationId: 'x', caseRef: 'y' } });
    const signature = signWebhookPayload(body, SECRET);
    expect(verifyWebhookSignature(body + ' ', signature, SECRET)).toBe(false);
  });

  it('rejects a missing signature', () => {
    const body = JSON.stringify({ type: 'post-call', data: {} });
    expect(verifyWebhookSignature(body, undefined, SECRET)).toBe(false);
  });

  it('rejects a wrong secret', () => {
    const body = JSON.stringify({ type: 'post-call', data: {} });
    const signature = signWebhookPayload(body, 'other-secret');
    expect(verifyWebhookSignature(body, signature, SECRET)).toBe(false);
  });
});

describe('POST /api/webhooks/elevenlabs', () => {
  it('rejects a missing signature', async () => {
    const { app } = createApp();
    const body = JSON.stringify({
      type: 'post-call',
      data: { conversationId: 'conv-unsigned', caseRef: 'FNOL-2026-0142' },
    });
    const response = await request(app).post('/api/webhooks/elevenlabs').send(body);
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('stores a signed post-call payload and stays idempotent', async () => {
    const { app } = createApp();
    const body = JSON.stringify({
      type: 'post-call',
      data: {
        conversationId: 'conv-test-1',
        caseRef: 'FNOL-2026-0142',
        language: 'en',
        transcript: [{ speaker: 'agent', text: 'Disclosure delivered.' }],
      },
    });
    const signature = signWebhookPayload(body, SECRET);

    const first = await request(app)
      .post('/api/webhooks/elevenlabs')
      .set('x-braid-signature', signature)
      .send(body);
    expect(first.status).toBe(200);
    expect(first.body.stored).toBe(true);
    expect(first.body.duplicate).toBe(false);

    const second = await request(app)
      .post('/api/webhooks/elevenlabs')
      .set('x-braid-signature', signature)
      .send(body);
    expect(second.status).toBe(200);
    expect(second.body.duplicate).toBe(true);
    expect(second.body.stored).toBe(false);
  });

  it('rejects an unknown case reference', async () => {
    const { app } = createApp();
    const body = JSON.stringify({
      type: 'post-call',
      data: { conversationId: 'conv-test-2', caseRef: 'FNOL-9999-9999' },
    });
    const signature = signWebhookPayload(body, SECRET);
    const response = await request(app)
      .post('/api/webhooks/elevenlabs')
      .set('x-braid-signature', signature)
      .send(body);
    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
