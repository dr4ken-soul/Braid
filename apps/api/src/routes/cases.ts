/**
 * Case routes: list, detail, and demo case creation.
 *
 * Cases are synthetic challenge records. Reviewer auth is optional in
 * the demo build: when REVIEWER_TOKEN is unset the console is open.
 */

import type { Request, Response } from 'express';
import type { CaseListQuery, CreateCaseRequest } from '@braid/validation';
import { caseListQuerySchema, createCaseRequestSchema } from '@braid/validation';
import type { BraidRepository } from '../adapters/repository';
import { createCaseFromScript } from '../seed/pipeline';
import { findScript } from '../seed/call-scripts';
import { checkRateLimit } from '../services/rate-limit';

function reviewerAuth(req: Request): boolean {
  const reviewerToken = process.env.REVIEWER_TOKEN;
  if (!reviewerToken) return true;
  return req.header('x-reviewer-token') === reviewerToken;
}

/** GET /api/cases */
export function handleCaseList(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    if (!reviewerAuth(req)) {
      res.status(401).json({
        requestId: res.locals.requestId,
        error: { code: 'UNAUTHORIZED', message: 'Reviewer token required.' },
      });
      return;
    }
    const ip = req.ip ?? 'unknown';
    if (!checkRateLimit(`get-cases:${ip}`, 60)) {
      res.status(429).json({
        requestId: res.locals.requestId,
        error: { code: 'RATE_LIMITED', message: 'Rate limit reached. Try again shortly.' },
      });
      return;
    }
    const parsed = caseListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid query.' },
      });
      return;
    }
    const query = parsed.data as CaseListQuery;
    const cases = repository.listCases({
      status: query.status,
      language: query.language,
      limit: query.limit,
    });
    res.status(200).json({ requestId: res.locals.requestId, cases });
  };
}

/** GET /api/cases/:caseId, accepts uuid or external reference. */
export function handleCaseDetail(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    if (!reviewerAuth(req)) {
      res.status(401).json({
        requestId: res.locals.requestId,
        error: { code: 'UNAUTHORIZED', message: 'Reviewer token required.' },
      });
      return;
    }
    const ip = req.ip ?? 'unknown';
    if (!checkRateLimit(`get-case:${ip}`, 120)) {
      res.status(429).json({
        requestId: res.locals.requestId,
        error: { code: 'RATE_LIMITED', message: 'Rate limit reached. Try again shortly.' },
      });
      return;
    }
    const detail = repository.getCaseDetail(req.params.caseId);
    if (!detail) {
      res.status(404).json({
        requestId: res.locals.requestId,
        error: { code: 'NOT_FOUND', message: 'No case exists with this reference.' },
      });
      return;
    }
    repository.addRedactionEvent(detail.caseId, {
      id: repository.shortId('rd-'),
      caseId: detail.caseId,
      field: 'claimant.phone',
      action: 'masked',
      view: 'case-detail',
      at: new Date().toISOString(),
    });
    res.status(200).json({ requestId: res.locals.requestId, case: detail });
  };
}

/** POST /api/cases, creates a demo case through the synthetic pipeline. */
export function handleCaseCreate(repository: BraidRepository) {
  return (req: Request, res: Response) => {
    const ip = req.ip ?? 'unknown';
    if (!checkRateLimit(`post-cases:${ip}`, 10)) {
      res.status(429).json({
        requestId: res.locals.requestId,
        error: { code: 'RATE_LIMITED', message: 'Rate limit reached. Try again shortly.' },
      });
      return;
    }
    const parsed = createCaseRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        requestId: res.locals.requestId,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid case request.' },
      });
      return;
    }
    const request = parsed.data as CreateCaseRequest;
    const script = findScript(request.scenario, request.language);
    const result = createCaseFromScript(script, repository);
    const detail = repository.getCaseDetail(result.caseId);
    res.status(201).json({ requestId: res.locals.requestId, case: detail });
  };
}
