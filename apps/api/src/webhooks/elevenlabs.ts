/**
 * ElevenLabs post-call webhook handler.
 *
 * Receives signed post-call conversation data. The signature is verified
 * over the raw body before parsing. Storage is idempotent by conversation
 * identifier so provider retries never duplicate a conversation.
 */

import type { Request, Response } from 'express';
import type { WebhookPayload } from '@braid/validation';
import { webhookPayloadSchema } from '@braid/validation';
import { mapWebhookToConversation, verifyWebhookSignature } from '@braid/elevenlabs';
import type { BraidRepository } from '../adapters/repository';

/** Webhook secret is resolved per request so deploys and tests can set it. */
function webhookSecret(): string {
  return process.env.BRAID_WEBHOOK_SECRET ?? 'braid-webhook-secret-change-me';
}

/** Handle POST /api/webhooks/elevenlabs. */
export function handleElevenLabsWebhook(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body ?? {});
    const signature =
      (req.header('x-braid-signature') as string | undefined) ??
      (req.header('x-elevenlabs-signature') as string | undefined);

    if (!verifyWebhookSignature(rawBody, signature, webhookSecret())) {
      res.status(401).json({
        requestId: res.locals.requestId,
        error: { code: 'UNAUTHORIZED', message: 'Invalid or missing webhook signature.' },
      });
      return;
    }

    let payload: WebhookPayload;
    try {
      payload = webhookPayloadSchema.parse(JSON.parse(rawBody));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid webhook payload.';
      res.status(400).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message },
      });
      return;
    }

    const existing = repository.getConversation(payload.data.conversationId);
    if (existing) {
      res.status(200).json({
        requestId: res.locals.requestId,
        conversationId: existing.conversationId,
        caseId: existing.caseId,
        stored: false,
        duplicate: true,
      });
      return;
    }

    const caseId = repository.findCaseId(payload.data.caseRef) ?? (payload.data.caseId ? repository.findCaseId(payload.data.caseId) : null);
    if (!caseId) {
      res.status(422).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message: 'Unknown case reference.' },
      });
      return;
    }

    const now = new Date().toISOString();
    const draft = mapWebhookToConversation(payload, caseId, now);
    repository.saveConversation(draft.conversation);
    repository.saveSegments(draft.conversation.conversationId, [
      ...draft.segments.map((segment) => ({ ...segment, conversationId: draft.conversation.conversationId })),
    ]);
    repository.saveAnalysis(draft.conversation.conversationId, {
      conversationId: draft.conversation.conversationId,
      caseRef: payload.data.caseRef,
      language: draft.conversation.caseId ? repository.getCase(caseId)?.language ?? 'en' : 'en',
      summary: payload.data.analysis?.summary ?? 'Post-call webhook received.',
      durationMs: 0,
      fieldsExtracted: 0,
      fieldsWithSourceSpans: 0,
      openContradictions: 0,
      escalationReason: null,
      decisionBoundary: 'Post-call storage from webhook. Analysis fields pending.',
      nextAction: 'Reviewer inspects the stored transcript and evidence.',
      generatedAt: now,
    });
    repository.addSystemEvent(caseId, {
      id: repository.shortId('se-'),
      kind: 'post-call-webhook',
      message: `Post-call data stored for ${payload.data.caseRef}`,
      caseId,
      at: now,
    });
    repository.updateCaseStatus(caseId, repository.getCase(caseId)?.status ?? 'review');

    res.status(200).json({
      requestId: res.locals.requestId,
      conversationId: draft.conversation.conversationId,
      caseId,
      stored: true,
      duplicate: false,
    });
  };
}
