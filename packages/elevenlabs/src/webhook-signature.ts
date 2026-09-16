/**
 * Webhook signature helpers.
 *
 * Post-call payloads are signed with HMAC SHA-256 over the raw request
 * body using the shared BRAID_WEBHOOK_SECRET. Verification is timing safe.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

/** Compute the hex HMAC SHA-256 signature for a raw request body. */
export function signWebhookPayload(rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
}

/**
 * Verify a webhook signature against the raw body. Returns false when the
 * signature header is missing, malformed, or does not match. The comparison
 * is timing safe and length mismatch never throws.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | undefined,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected = signWebhookPayload(rawBody, secret);
  const expectedBuffer = Buffer.from(expected, 'utf8');
  let providedBuffer: Buffer;
  try {
    providedBuffer = Buffer.from(signature, 'utf8');
  } catch {
    return false;
  }
  if (providedBuffer.length !== expectedBuffer.length) return false;
  try {
    return timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}
