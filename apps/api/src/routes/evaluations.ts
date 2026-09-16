/**
 * Evaluations route. Agent Testing scenario results for reviewers.
 */

import type { Request, Response } from 'express';
import type { BraidRepository } from '../adapters/repository';

export function handleEvaluations(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    const reviewerToken = process.env.REVIEWER_TOKEN;
    if (reviewerToken && req.header('x-reviewer-token') !== reviewerToken) {
      res.status(401).json({
        requestId: res.locals.requestId,
        error: { code: 'UNAUTHORIZED', message: 'Reviewer token required.' },
      });
      return;
    }
    const evaluations = repository.getEvaluations();
    const totalRuns = evaluations.reduce((total, item) => total + item.runs.length, 0);
    const passed = evaluations.reduce((total, item) => total + item.runs.filter((run) => run.passed).length, 0);
    const runsPerScenario = evaluations.length > 0 ? evaluations[0].runs.length : 0;
    res.status(200).json({
      requestId: res.locals.requestId,
      agentVersion: evaluations[0]?.agentVersion ?? 'unknown',
      aggregate: {
        scenarios: evaluations.length,
        runsPerScenario,
        totalRuns,
        passed,
        passRate: totalRuns > 0 ? passed / totalRuns : 0,
      },
      evaluations,
    });
  };
}
