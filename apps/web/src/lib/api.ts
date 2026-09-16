/**
 * Braid API client.
 *
 * Talks to the Braid API service. All data is synthetic challenge data.
 */

import type {
  CaseDetail,
  CaseSummary,
  EvaluationSummary,
  HealthResponse,
} from '@braid/domain';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const DEMO_TOKEN = process.env.NEXT_PUBLIC_DEMO_TOKEN ?? 'braid-demo-token';

export const apiBaseUrl = API_BASE;

export class BraidApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'BraidApiError';
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'x-braid-demo-token': DEMO_TOKEN,
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new BraidApiError(
      'SERVICE_UNREACHABLE',
      'The Braid service is not reachable. Start it with: npm run dev:api',
      0,
    );
  }

  const body = await response.json().catch(() => null);
  if (!response.ok || !body) {
    const code = body?.error?.code ?? 'REQUEST_FAILED';
    const message =
      body?.error?.message ??
      `The Braid service could not complete this request. Status ${response.status}.`;
    throw new BraidApiError(code, message, response.status);
  }
  return body as T;
}

export interface CaseListResponse {
  requestId: string;
  cases: CaseSummary[];
}

export interface CaseDetailResponse {
  requestId: string;
  case: CaseDetail;
}

export interface CreateCaseResponse {
  requestId: string;
  case: CaseDetail;
}

export interface HandoffResponse {
  requestId: string;
  handoff: {
    id: string;
    destination: string;
    reason: string;
    queueAcceptance: { state: string; queue: string; acceptedAt: string; acceptedBy: string } | null;
  };
}

export interface EvaluationsResponse extends EvaluationSummary {
  requestId: string;
}

/** List cases with optional filters. */
export function listCases(params?: {
  status?: string;
  language?: string;
  limit?: number;
}): Promise<CaseListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  if (params?.language) search.set('language', params.language);
  if (params?.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  return request<CaseListResponse>(`/api/cases${query ? `?${query}` : ''}`);
}

/** Fetch the full case detail. */
export function getCase(caseId: string): Promise<CaseDetailResponse> {
  return request<CaseDetailResponse>(`/api/cases/${caseId}`);
}

/** Create a demo case by running the synthetic intake pipeline. */
export function createCase(input: {
  language: 'en' | 'ar';
  scenario: 'complete' | 'contradiction' | 'dependency-failure';
}): Promise<CreateCaseResponse> {
  return request<CreateCaseResponse>('/api/cases', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Route a case to a human queue. */
export function createHandoff(
  caseId: string,
  input: {
    reason: string;
    destination: string;
    createdBy?: 'agent' | 'operator';
  },
): Promise<HandoffResponse> {
  return request<HandoffResponse>(`/api/cases/${caseId}/handoff`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Read evaluation results. */
export function getEvaluations(): Promise<EvaluationsResponse> {
  return request<EvaluationsResponse>('/api/evaluations');
}

/** Read service health. */
export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health');
}
