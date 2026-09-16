/**
 * Braid request validation schemas.
 *
 * Every request body and query string is validated at the API boundary
 * with these schemas. The handoff queue gate is enforced here in code,
 * not only in the agent prompt.
 */

import { z } from 'zod';
import { QUEUE_TARGETS } from '@braid/domain';

export const createCaseRequestSchema = z.object({
  language: z.enum(['en', 'ar']),
  scenario: z.enum(['complete', 'contradiction', 'dependency-failure']),
});

export type CreateCaseRequest = z.infer<typeof createCaseRequestSchema>;

export const caseListQuerySchema = z.object({
  status: z.enum(['intake', 'review', 'handoff', 'closed']).optional(),
  language: z.enum(['en', 'ar']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CaseListQuery = z.infer<typeof caseListQuerySchema>;

export const handoffRequestSchema = z.object({
  destination: z.enum(QUEUE_TARGETS as [string, ...string[]]),
  reason: z.string().min(10, 'Reason must be at least 10 characters.'),
  createdBy: z.enum(['agent', 'operator']).optional(),
});

export type HandoffRequest = z.infer<typeof handoffRequestSchema>;

export const toolRequestSchema = z.object({
  caseRef: z.string().min(3),
});

export type ToolRequest = z.infer<typeof toolRequestSchema>;

export const webhookPayloadSchema = z.object({
  type: z.literal('post-call'),
  data: z.object({
    conversationId: z.string().min(1),
    caseRef: z.string().min(1),
    caseId: z.string().optional(),
    agentId: z.string().optional(),
    language: z.enum(['en', 'ar']).optional(),
    transcript: z
      .array(
        z.object({
          speaker: z.enum(['agent', 'claimant', 'system']),
          text: z.string(),
          startMs: z.coerce.number().optional(),
          endMs: z.coerce.number().optional(),
          node: z.string().optional(),
        }),
      )
      .optional(),
    analysis: z.object({ summary: z.string().optional() }).optional(),
  }),
});

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
