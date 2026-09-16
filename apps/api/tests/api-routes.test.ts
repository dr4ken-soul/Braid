/**
 * Route happy path tests over the seeded synthetic repository.
 */

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';
import { CALL_SCRIPTS } from '../src/seed/call-scripts';

describe('GET /', () => {
  it('returns the service banner', async () => {
    const { app } = createApp();
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.service).toBe('Braid API');
  });
});

describe('GET /api/health', () => {
  it('reports dependency status', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.dependencies.database.mode).toBe('in-memory');
    expect(response.body.dependencies.claimsSandbox.status).toBe('ok');
    expect(response.body.dependencies.claimsSandbox.lastSuccessAt).toBeTruthy();
  });
});

describe('GET /api/cases', () => {
  it('returns six seeded summaries newest first', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/cases');
    expect(response.status).toBe(200);
    expect(response.body.cases).toHaveLength(6);
    expect(response.body.cases[0].externalReference).toBe('FNOL-2026-0147');
    expect(response.body.cases[5].externalReference).toBe('FNOL-2026-0142');
  });

  it('filters by language and status', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/cases?language=ar&status=handoff');
    expect(response.status).toBe(200);
    expect(response.body.cases).toHaveLength(3);
    for (const summary of response.body.cases) {
      expect(summary.language).toBe('ar');
    }
  });
});

describe('GET /api/cases/:caseId', () => {
  it('looks up by external reference and by uuid', async () => {
    const { app } = createApp();
    const byRef = await request(app).get('/api/cases/FNOL-2026-0144');
    expect(byRef.status).toBe(200);
    expect(byRef.body.case.externalReference).toBe('FNOL-2026-0144');
    const byId = await request(app).get(`/api/cases/${byRef.body.case.caseId}`);
    expect(byId.status).toBe(200);
    expect(byId.body.case.externalReference).toBe('FNOL-2026-0144');
  });

  it('returns 404 for an unknown reference', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/cases/FNOL-9999-9999');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});

describe('POST /api/cases', () => {
  it('creates a case from the synthetic pipeline', async () => {
    const { app } = createApp();
    const response = await request(app)
      .post('/api/cases')
      .send({ language: 'en', scenario: 'contradiction' });
    expect(response.status).toBe(201);
    expect(response.body.case.externalReference).toMatch(/^FNOL-2026-01\d\d$/);
    expect(response.body.case.status).toBe('handoff');
    expect(response.body.case.language).toBe('en');
    expect(response.body.case.scenario).toBe('contradiction');
    expect(response.body.case.transcript.length).toBeGreaterThan(10);
  });

  it('rejects an invalid body', async () => {
    const { app } = createApp();
    const response = await request(app).post('/api/cases').send({ language: 'fr' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('agent tools', () => {
  it('requires the tool token', async () => {
    const { app } = createApp();
    const response = await request(app)
      .post('/api/tools/claims-record')
      .send({ caseRef: 'FNOL-2026-0142' });
    expect(response.status).toBe(401);
  });

  it('returns the claim record with the tool token', async () => {
    const { app } = createApp();
    const response = await request(app)
      .post('/api/tools/claims-record')
      .set('x-braid-tool-token', 'braid-agent-tool-token')
      .send({ caseRef: 'FNOL-2026-0142' });
    expect(response.status).toBe(200);
    expect(response.body.record.claim.claimNumber).toBe('CLM-2026-8841');
  });

  it('returns 503 for a dependency failure case', async () => {
    const { app } = createApp();
    const response = await request(app)
      .post('/api/tools/claims-record')
      .set('x-braid-tool-token', 'braid-agent-tool-token')
      .send({ caseRef: 'FNOL-2026-0146' });
    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe('DEPENDENCY_UNAVAILABLE');
  });
});

describe('GET /api/evaluations', () => {
  it('returns the ten scenarios with a full pass rate', async () => {
    const { app } = createApp();
    const response = await request(app).get('/api/evaluations');
    expect(response.status).toBe(200);
    expect(response.body.evaluations).toHaveLength(10);
    expect(response.body.agentVersion).toBe('braid-intake-1.4.0');
    expect(response.body.aggregate.totalRuns).toBe(50);
    expect(response.body.aggregate.passRate).toBe(1);
  });
});

describe('seed coverage', () => {
  it('seeds all six language and scenario combinations', () => {
    const combos = CALL_SCRIPTS.map((script) => `${script.scenario}:${script.language}`).sort();
    expect(combos).toEqual([
      'complete:ar',
      'complete:en',
      'contradiction:ar',
      'contradiction:en',
      'dependency-failure:ar',
      'dependency-failure:en',
    ]);
  });
});
