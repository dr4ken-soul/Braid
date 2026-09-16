/**
 * Synthetic claims sandbox adapter.
 *
 * Returns the claim and policy records for a case from the challenge
 * fixtures. When the claims dependency is unavailable, by environment
 * switch or by the scripted dependency-failure scenario, it reports
 * DEPENDENCY_UNAVAILABLE instead of guessing.
 */

import type { BraidCase, ClaimRecordPayload, PolicyRecordPayload } from '@braid/domain';

export interface ClaimsRecordResult {
  available: boolean;
  claim?: ClaimRecordPayload;
  policy?: PolicyRecordPayload;
  retrievedAt?: string;
  error?: { code: 'DEPENDENCY_UNAVAILABLE'; dependency: 'claims-sandbox'; message: string };
}

/** Environment availability for the claims system. */
export function claimsSandboxAvailable(): boolean {
  return process.env.CLAIMS_SANDBOX_AVAILABLE !== 'false';
}

/** Retrieve the synthetic claim and policy records for a case. */
export function getClaimsRecord(
  record: BraidCase,
  claimPayload: ClaimRecordPayload | null,
  policyPayload: PolicyRecordPayload | null,
  retrievedAt: string,
): ClaimsRecordResult {
  const scenarioUnavailable = record.scenario === 'dependency-failure';
  if (scenarioUnavailable || !claimsSandboxAvailable() || !claimPayload || !policyPayload) {
    const message =
      record.language === 'ar'
        ? 'لا يمكن الوصول إلى نظام المطالبات الآن.'
        : 'The claims system cannot be reached right now.';
    return {
      available: false,
      error: { code: 'DEPENDENCY_UNAVAILABLE', dependency: 'claims-sandbox', message },
    };
  }
  return { available: true, claim: claimPayload, policy: policyPayload, retrievedAt };
}
