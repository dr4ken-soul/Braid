/**
 * Rate limit tests. POST /api/cases allows 10 per minute per session.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';
import { resetRateLimiter } from '../src/services/rate-limit';

beforeEach(() => {
  resetRateLimiter();
});

describe('POST /api/cases rate limit', () => {
  it('returns 429 after ten rapid requests from one session', async () => {
    const { app } = createApp();
    let sawRateLimit = false;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      const response = await request(app)
        .post('/api/cases')
        .set('x-forwarded-for', '203.0.113.77')
        .send({ language: 'en', scenario: 'complete' });
      if (response.status === 429) {
        sawRateLimit = true;
        expect(response.body.error.code).toBe('RATE_LIMITED');
        break;
      }
      expect(response.status).toBe(201);
    }
    expect(sawRateLimit).toBe(true);
  });
});
