/**
 * Formatting helper contract. These helpers render machine-derived values on
 * every review surface, so their output is part of the review vocabulary.
 */
import { describe, expect, it } from 'vitest';
import {
  confidenceLabel,
  fieldKeyLabel,
  formatOffset,
  formatTimestamp,
  languageLabel,
  passRateLabel,
  scenarioLabel,
  sourceReferenceLabel,
  statusLabel,
} from './format';

describe('formatTimestamp', () => {
  it('renders a compact UTC label', () => {
    expect(formatTimestamp('2026-05-02T10:41:30.000Z')).toBe('2026-05-02 10:41:30 UTC');
  });

  it('renders a missing timestamp as not recorded', () => {
    expect(formatTimestamp(null)).toBe('not recorded');
    expect(formatTimestamp('')).toBe('not recorded');
  });

  it('passes through an unparseable value', () => {
    expect(formatTimestamp('not-a-date')).toBe('not-a-date');
  });
});

describe('formatOffset', () => {
  it('renders 00:00 at call start', () => {
    expect(formatOffset(0)).toBe('00:00');
  });

  it('rounds to seconds', () => {
    expect(formatOffset(75800)).toBe('01:16');
    expect(formatOffset(3200)).toBe('00:03');
    expect(formatOffset(102500)).toBe('01:43');
  });

  it('never goes negative', () => {
    expect(formatOffset(-40)).toBe('00:00');
  });
});

describe('sourceReferenceLabel', () => {
  it('expands a transcript span', () => {
    expect(sourceReferenceLabel('segment:7')).toBe('transcript segment 7');
  });

  it('expands a record reference', () => {
    expect(sourceReferenceLabel('record:CLM-2026-8841')).toBe('record CLM-2026-8841');
  });

  it('shows missing sources as no source', () => {
    expect(sourceReferenceLabel(null)).toBe('no source');
    expect(sourceReferenceLabel(undefined)).toBe('no source');
  });

  it('passes through other reference shapes', () => {
    expect(sourceReferenceLabel('claims-sandbox:CLM-2026-8841')).toBe('claims-sandbox:CLM-2026-8841');
  });
});

describe('fieldKeyLabel', () => {
  it('title-cases underscored field keys', () => {
    expect(fieldKeyLabel('incident_date')).toBe('Incident Date');
    expect(fieldKeyLabel('policy_number')).toBe('Policy Number');
  });
});

describe('passRateLabel and confidenceLabel', () => {
  it('renders rates as percentages', () => {
    expect(passRateLabel(0.9166)).toBe('92%');
    expect(passRateLabel(1)).toBe('100%');
    expect(confidenceLabel(0.78)).toBe('78%');
  });

  it('renders missing confidence as not scored', () => {
    expect(confidenceLabel(null)).toBe('not scored');
  });
});

describe('languageLabel', () => {
  it('maps scoped languages', () => {
    expect(languageLabel('en')).toBe('English');
    expect(languageLabel('ar')).toBe('Arabic');
  });
});

describe('scenarioLabel', () => {
  it('maps every seeded scenario', () => {
    expect(scenarioLabel('complete')).toBe('Complete account');
    expect(scenarioLabel('contradiction')).toBe('Contradiction');
    expect(scenarioLabel('dependency-failure')).toBe('Dependency failure');
  });
});

describe('statusLabel', () => {
  it('capitalizes a status', () => {
    expect(statusLabel('handoff')).toBe('Handoff');
    expect(statusLabel('closed')).toBe('Closed');
  });
});
