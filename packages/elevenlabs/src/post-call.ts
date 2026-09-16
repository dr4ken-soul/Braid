/**
 * Post-call payload mapping.
 *
 * Converts a verified ElevenLabs post-call webhook payload into domain
 * conversation and transcript segment drafts ready for persistence.
 */

import type { Channel, Conversation, Language, Speaker, TranscriptSegment, WorkflowNode } from '@braid/domain';
import type { WebhookPayload } from '@braid/validation';

const KNOWN_NODES = new Set<string>([
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
]);

export interface WebhookConversationDraft {
  conversation: Omit<Conversation, 'endedAt'> & { endedAt: string };
  segments: Array<Omit<TranscriptSegment, 'conversationId'>>;
}

/** Map a parsed webhook payload to a conversation draft with segments. */
export function mapWebhookToConversation(
  payload: WebhookPayload,
  caseId: string,
  now: string,
): WebhookConversationDraft {
  const language: Language = payload.data.language ?? 'en';
  const channel: Channel = 'web';
  const conversation = {
    conversationId: payload.data.conversationId,
    caseId,
    elevenlabsConversationId: payload.data.conversationId,
    channel,
    startedAt: now,
    endedAt: now,
    transcriptStatus: 'complete' as const,
  };

  const segments = (payload.data.transcript ?? []).map((entry, index) => ({
    sequence: index + 1,
    speaker: entry.speaker as Speaker,
    node: (KNOWN_NODES.has(entry.node ?? '') ? entry.node : 'intake') as WorkflowNode,
    text: entry.text,
    language,
    startMs: entry.startMs ?? 0,
    endMs: entry.endMs ?? entry.startMs ?? 0,
  }));

  return { conversation, segments };
}
