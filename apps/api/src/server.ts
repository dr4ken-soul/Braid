/**
 * Braid API service entry point.
 *
 * Express app with request context, rate limiting, scoped routes, the
 * signed ElevenLabs webhook receiver, and structured JSON logging. The
 * in-memory repository is seeded with synthetic challenge records at
 * startup. No real claimant data exists in this build.
 */

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { BraidRepository } from './adapters/repository';
import { seedRepository } from './seed/seed';
import { handleHealth } from './routes/health';
import { handleCaseCreate, handleCaseDetail, handleCaseList } from './routes/cases';
import { handleHandoff } from './routes/handoff';
import { handleClaimsRecord, handleRepairRecord } from './routes/tools';
import { handleEvaluations } from './routes/evaluations';
import { handleElevenLabsWebhook } from './webhooks/elevenlabs';
import { logRequest, logSystemEvent } from './services/logger';
import { pruneRateLimiter } from './services/rate-limit';

/** Build the Braid app. Used by the server entry point and by tests. */
export function createApp(): { app: Express; repository: BraidRepository } {
  const repository = new BraidRepository();
  seedRepository(repository);

  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: process.env.BRAID_DEPLOYMENT_URL ?? true, credentials: false }));

  // Request context: unique id per request, timing, structured logging.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = crypto.randomUUID();
    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
      const latencyMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      logRequest(
        { requestId, method: req.method, path: req.originalUrl },
        res.statusCode,
        Math.round(latencyMs),
      );
    });
    next();
  });

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      requestId: res.locals.requestId,
      service: 'Braid API',
      status: 'ok',
      health: '/api/health',
    });
  });

  app.get('/api/health', handleHealth(repository));
  app.get('/api/cases', handleCaseList(repository));
  app.get('/api/cases/:caseId', handleCaseDetail(repository));
  app.post('/api/cases', express.json(), handleCaseCreate(repository));
  app.post('/api/cases/:caseId/handoff', express.json(), handleHandoff(repository));

  // Tools take JSON bodies.
  app.post('/api/tools/claims-record', express.json(), handleClaimsRecord(repository));
  app.post('/api/tools/repair-record', express.json(), handleRepairRecord(repository));

  // Webhook takes the raw body for signature verification before parsing.
  app.post(
    '/api/webhooks/elevenlabs',
    express.raw({ type: '*/*', limit: '256kb' }),
    handleElevenLabsWebhook(repository),
  );

  app.get('/api/evaluations', handleEvaluations(repository));

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      requestId: res.locals.requestId,
      error: { code: 'NOT_FOUND', message: 'No route exists at this path.' },
    });
  });

  app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : 'Unhandled service error.';
    res.status(500).json({
      requestId: res.locals.requestId,
      error: { code: 'INTERNAL_ERROR', message },
    });
  });

  return { app, repository };
}

const isDirectRun = process.argv[1]?.includes('server');
if (isDirectRun) {
  const port = Number(process.env.API_PORT ?? 4000);
  const { app } = createApp();
  app.listen(port, () => {
    logSystemEvent('startup', `Braid API ready on port ${port} with 6 synthetic cases and 10 evaluation scenarios`);
  });
  setInterval(() => pruneRateLimiter(), 60_000).unref();
}
