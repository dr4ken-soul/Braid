/**
 * Formatting helpers for machine-derived values.
 */

/** Format an ISO timestamp as a compact UTC machine label. */
export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return 'not recorded';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  const isoString = date.toISOString();
  return `${isoString.slice(0, 10)} ${isoString.slice(11, 19)} UTC`;
}

/** Format milliseconds from conversation start as mm:ss. */
export function formatOffset(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Render a source reference, for example segment:7, as a readable label. */
export function sourceReferenceLabel(reference: string | null | undefined): string {
  if (!reference) return 'no source';
  if (reference.startsWith('segment:')) {
    return `transcript segment ${reference.slice('segment:'.length)}`;
  }
  if (reference.startsWith('record:')) {
    return `record ${reference.slice('record:'.length)}`;
  }
  return reference;
}

/** Human label for a field key, for example incident_date becomes Incident date. */
export function fieldKeyLabel(fieldKey: string): string {
  return fieldKey
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Pass rate as a percentage label. */
export function passRateLabel(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/** Confidence as a percentage label, handling null confidence. */
export function confidenceLabel(confidence: number | null): string {
  if (confidence === null || confidence === undefined) return 'not scored';
  return `${Math.round(confidence * 100)}%`;
}

/** Language label. */
export function languageLabel(language: string): string {
  return language === 'ar' ? 'Arabic' : 'English';
}

/** Scenario label. */
export function scenarioLabel(scenario: string): string {
  if (scenario === 'complete') return 'Complete account';
  if (scenario === 'contradiction') return 'Contradiction';
  return 'Dependency failure';
}

/** Status label. */
export function statusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
