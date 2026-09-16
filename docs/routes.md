# Braid route definitions

This file is an implementation contract for the API layer. It defines the route surface before application code is written.

## Read routes

### `GET /api/health`

Returns service status, database connectivity, and ElevenLabs dependency status. The public response exposes only coarse health information.

### `GET /api/cases`

Returns paginated cases for an authenticated reviewer. Supports `status`, `language`, and `limit` query parameters. Never returns raw secrets or unrestricted provider payloads.

### `GET /api/cases/:caseId`

Returns the case summary, transcript references, extracted evidence, source records, contradictions, and latest handoff packet. Claim decisions are not computed by this route.

### `GET /api/evaluations`

Returns Agent Testing runs, scenario outcomes, tool-call outcomes, and aggregate pass rates for an authorized reviewer.

## Write routes

### `POST /api/cases`

Creates a demo case or a permitted intake session. Validates the external reference and language. The caller cannot use this route to approve, deny, settle, or close a claim.

### `POST /api/cases/:caseId/handoff`

Creates an adjuster handoff packet from the current evidence state. Requires a reason and source references. It may route a case for human review only.

### `POST /api/webhooks/elevenlabs`

Receives signed post-call conversation data, transcript metadata, and evaluation results. The handler must verify the signature before persistence and must be idempotent for repeated provider events.

## Scoped tool routes

### `POST /api/tools/claims-record`

Returns an approved mock claim record for an agent-scoped conversation. The response is read-only and limited to the case reference supplied by the server.

### `POST /api/tools/repair-record`

Returns an approved mock repair record for an agent-scoped conversation. The response is read-only and limited to the case reference supplied by the server.

## Shared response rules

- Use JSON responses with a stable `requestId`.
- Validate request bodies and query parameters at the boundary.
- Return structured error codes without exposing provider keys, stack traces, or hidden prompts.
- Log tool name, case ID, outcome, and latency, but never raw credentials.
- Keep claim authority with the institution's human process.
