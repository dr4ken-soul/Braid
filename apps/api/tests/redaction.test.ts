/**
 * Redaction tests. Raw claimant phone numbers never leave the service.
 */

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';
import { maskPhone, maskDisplayName } from '../src/services/redaction';

describe('maskPhone', () => {
  it('masks the middle digits and keeps the code and last four', () => {
    expect(maskPhone('+971 50 555 0142')).toBe('+971 50 *** 0142');
  });

  it('handles compact formats without throwing', () => {
    const masked = maskPhone('+971505550143');
    expect(masked).not.toContain('555');
  });

  it('leaves very short values unchanged', () => {
    expect(maskPhone('123')).toBe('123');
  });
});

describe('maskDisplayName', () => {
  it('masks name parts beyond the initial', () => {
    const masked = maskDisplayName('Synthetic claimant EN-A');
    expect(masked.startsWith('S')).toBe(true);
    expect(masked).not.toBe('Synthetic claimant EN-A');
  });
});

describe('case responses', () => {
  it('never returns the raw phone', async () => {
    const { app } = createApp();
    const detail = await request(app).get('/api/cases/FNOL-2026-0142');
    expect(detail.status).toBe(200);
    const raw = JSON.stringify(detail.body);
    expect(raw).not.toContain('555 0142');
    expect(detail.body.case.claimant.phoneMasked).toBe('+971 50 *** 0142');
  });

  it('omits phone fields from list summaries', async () => {
    const { app } = createApp();
    const list = await request(app).get('/api/cases');
    expect(list.status).toBe(200);
    const raw = JSON.stringify(list.body);
    expect(raw).not.toContain('phone');
    expect(raw).not.toContain('555 01');
  });
});
