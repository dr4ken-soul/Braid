/**
 * Field-level redaction for reviewer views and logs.
 * Claimant phone numbers never appear raw in any response or log line.
 */

/**
 * Mask a phone number. Keeps the country code prefix, masks the middle
 * digits, keeps the last four digits. Example: +971 50 555 0142
 * becomes +971 50 *** 0142.
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.length < 6) return phone;
  const groups = phone.trim().split(/\s+/);
  if (groups.length < 3) {
    const last4 = digits.slice(-4);
    const prefix = digits.slice(0, 3);
    return `${prefix} *** ${last4}`;
  }
  const head = groups.slice(0, 2).join(' ');
  const last4 = digits.slice(-4);
  return `${head} *** ${last4}`;
}

/** Redact phone-like sequences from any string before logging. */
export function redactSensitiveValues(value: string): string {
  return value.replace(/\+\d{1,3}[\s-]?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/g, '[redacted]');
}

/** Mask a display name for restricted views. */
export function maskDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => (part.length <= 1 ? part : `${part[0]}${'*'.repeat(Math.min(part.length - 1, 4))}`))
    .join(' ');
}
