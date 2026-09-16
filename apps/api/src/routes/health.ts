/**
 * Health route. Public status subset with dependency observations.
 */

import type { Request, Response } from 'express';
import type { BraidRepository } from '../adapters/repository';
import { claimsSandboxAvailable } from '../adapters/claims-sandbox';

export function handleHealth(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    const claimsAvailable = claimsSandboxAvailable();
    const lastClaimSuccess = repository.latestClaimRecordTime();
    const lastRepairSuccess = repository.latestRepairRecordTime();
    const claimsStatus = claimsAvailable ? 'ok' : 'unavailable';
    res.status(200).json({
      requestId: res.locals.requestId,
      status: claimsAvailable ? 'ok' : 'degraded',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      dependencies: {
        api: 'ok' as const,
        database: { mode: 'in-memory' as const, status: 'ok' as const },
        claimsSandbox: { status: claimsStatus, lastSuccessAt: lastClaimSuccess },
        repairSandbox: { status: 'ok' as const, lastSuccessAt: lastRepairSuccess },
      },
    });
  };
}
