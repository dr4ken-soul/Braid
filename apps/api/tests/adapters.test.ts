/**
 * Adapter tests. Dependency failure is scripted, never guessed.
 */

import { afterEach, describe, expect, it } from 'vitest';
import type { BraidCase } from '@braid/domain';
import { CALL_SCRIPTS, findScript } from '../src/seed/call-scripts';
import { claimsSandboxAvailable, getClaimsRecord } from '../src/adapters/claims-sandbox';
import { getRepairRecord } from '../src/adapters/repair-record';
import type { ClaimRecordPayload, PolicyRecordPayload, RepairRecordPayload } from '@braid/domain';

function caseFromScript(language: 'en' | 'ar', scenario: 'complete' | 'dependency-failure'): BraidCase {
  const script = findScript(scenario, language);
  return {
    caseId: script.caseId,
    externalReference: script.externalReference,
    status: 'handoff',
    language: script.language,
    scenario: script.scenario,
    claimant: { displayName: script.claimant.displayName, phoneMasked: '', consentCaptured: true },
    createdAt: script.baseTimestamp,
    updatedAt: script.baseTimestamp,
  };
}

function claimPayloadFrom(script: (typeof CALL_SCRIPTS)[number]): ClaimRecordPayload | null {
  const record = script.sourceRecords.find((item) => item.recordType === 'claim');
  return (record?.payload ?? null) as ClaimRecordPayload | null;
}

function policyPayloadFrom(script: (typeof CALL_SCRIPTS)[number]): PolicyRecordPayload | null {
  const record = script.sourceRecords.find((item) => item.recordType === 'policy');
  return (record?.payload ?? null) as PolicyRecordPayload | null;
}

function repairPayloadFrom(script: (typeof CALL_SCRIPTS)[number]): RepairRecordPayload | null {
  const record = script.sourceRecords.find((item) => item.recordType === 'repair');
  return (record?.payload ?? null) as RepairRecordPayload | null;
}

describe('claims sandbox adapter', () => {
  it('returns the claim and policy records for a complete case', () => {
    const script = findScript('complete', 'en');
    const result = getClaimsRecord(
      caseFromScript('en', 'complete'),
      claimPayloadFrom(script),
      policyPayloadFrom(script),
      '2026-09-01T08:15:00.000Z',
    );
    expect(result.available).toBe(true);
    expect(result.claim?.claimNumber).toBe('CLM-2026-8841');
    expect(result.policy?.policyNumber).toBe('POL-TR-55-0021');
  });

  it('reports dependency unavailable for a dependency failure case', () => {
    const script = findScript('dependency-failure', 'en');
    const result = getClaimsRecord(
      caseFromScript('en', 'dependency-failure'),
      claimPayloadFrom(script),
      policyPayloadFrom(script),
      '2026-09-07T10:00:00.000Z',
    );
    expect(result.available).toBe(false);
    expect(result.error?.code).toBe('DEPENDENCY_UNAVAILABLE');
    expect(result.error?.dependency).toBe('claims-sandbox');
  });

  it('reports an Arabic message for an Arabic case', () => {
    const script = findScript('dependency-failure', 'ar');
    const result = getClaimsRecord(
      caseFromScript('ar', 'dependency-failure'),
      claimPayloadFrom(script),
      policyPayloadFrom(script),
      '2026-09-07T12:00:00.000Z',
    );
    expect(result.available).toBe(false);
    expect(result.error?.message).toContain('نظام المطالبات');
  });

  it('honours the environment availability switch', () => {
    process.env.CLAIMS_SANDBOX_AVAILABLE = 'false';
    try {
      expect(claimsSandboxAvailable()).toBe(false);
      const script = findScript('complete', 'en');
      const result = getClaimsRecord(
        caseFromScript('en', 'complete'),
        claimPayloadFrom(script),
        policyPayloadFrom(script),
        '2026-09-01T08:15:00.000Z',
      );
      expect(result.available).toBe(false);
    } finally {
      delete process.env.CLAIMS_SANDBOX_AVAILABLE;
    }
  });
});

describe('repair record adapter', () => {
  afterEach(() => {
    delete process.env.CLAIMS_SANDBOX_AVAILABLE;
  });

  it('returns the repair record even when the claims sandbox is down', () => {
    const script = findScript('dependency-failure', 'en');
    const result = getRepairRecord(
      caseFromScript('en', 'dependency-failure'),
      repairPayloadFrom(script),
      '2026-09-07T10:00:00.000Z',
    );
    expect(result.available).toBe(true);
    expect(result.repair?.repairOrder).toBe('RPR-3331');
  });
});
