/**
 * Synthetic repair record adapter.
 *
 * Returns the repair record for a case from the challenge fixtures.
 * The repair network is independent from the claims system, so a claims
 * outage does not block repair record retrieval.
 */

import type { BraidCase, RepairRecordPayload } from '@braid/domain';

export interface RepairRecordResult {
  available: boolean;
  repair?: RepairRecordPayload;
  retrievedAt?: string;
  error?: { code: 'DEPENDENCY_UNAVAILABLE'; dependency: 'repair-sandbox'; message: string };
}

/** Retrieve the synthetic repair record for a case. */
export function getRepairRecord(
  record: BraidCase,
  repairPayload: RepairRecordPayload | null,
  retrievedAt: string,
): RepairRecordResult {
  if (!repairPayload) {
    return {
      available: false,
      error: {
        code: 'DEPENDENCY_UNAVAILABLE',
        dependency: 'repair-sandbox',
        message:
          record.language === 'ar'
            ? 'لا يمكن الوصول إلى سجل الإصلاح الآن.'
            : 'The repair record cannot be reached right now.',
      },
    };
  }
  return { available: true, repair: repairPayload, retrievedAt };
}
