/**
 * Structured JSON logger. Never logs request or response bodies.
 * Tool routes log tool name, caseId, outcome, and latency only.
 */

export interface RequestContext {
  requestId: string;
  method: string;
  path: string;
}

export function logRequest(context: RequestContext, status: number, latencyMs: number): void {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    kind: 'request',
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    status,
    latencyMs,
  });
  console.log(line);
}

export function logToolEvent(input: {
  requestId: string;
  toolName: string;
  caseId: string;
  outcome: string;
  latencyMs: number;
}): void {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    kind: 'tool-call',
    requestId: input.requestId,
    toolName: input.toolName,
    caseId: input.caseId,
    outcome: input.outcome,
    latencyMs: input.latencyMs,
  });
  console.log(line);
}

export function logSystemEvent(kind: string, message: string): void {
  const line = JSON.stringify({ at: new Date().toISOString(), kind, message });
  console.log(line);
}
