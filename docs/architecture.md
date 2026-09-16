# Braid Architecture

## System overview

Braid is a multilingual insurance claims evidence reconciliation agent that runs on the ElevenLabs Agents Platform and is reviewed through a Next.js web console. The API layer is a TypeScript service that receives post-call data, runs scoped tool adapters, stores evidence, and routes unresolved cases to a human adjuster queue.

The three deployment zones are:

1. **Caller and channel** -- claimant speaks to the ElevenLabs agent in English or Arabic.
2. **ElevenLabs platform** -- speech, transcription, workflow branching, tool calls, knowledge base, post-call webhook.
3. **Institution layer (Braid API)** -- webhook receiver, tool adapters, evidence store, contradiction service, audit store, adjuster queue, and the web review console.

## Data flow

```
Caller (English / Arabic)
    |
    v
ElevenLabs Agent
    |-- identifies itself as AI (opening disclosure node)
    |-- captures consent
    |-- records transcript with timestamps and speaker labels
    |-- extracts factual evidence fields with source spans
    |-- calls scoped tools:
    |       claims-record  --> Braid API /api/tools/claims-record
    |       repair-record  --> Braid API /api/tools/repair-record
    |       adjuster-handoff --> Braid API /api/cases/:caseId/handoff
    |-- detects contradictions (claimant account vs repair record)
    |-- declines coverage, liability, settlement, payment, fraud, closure decisions
    |-- routes unresolved cases to adjuster queue
    |-- sends post-call webhook --> Braid API POST /api/webhooks/elevenlabs
    |
    v
Braid API
    |-- verifies HMAC SHA-256 signature (x-braid-signature / x-elevenlabs-signature)
    |-- validates and normalises payload (redaction applied to sensitive fields)
    |-- persists transcript segments, evidence items, source records, tool calls
    |-- stores contradiction records with severity, rationale, and source references
    |-- creates handoff packets (adjuster-queue or human-follow-up-queue)
    |-- appends to audit store (tool calls, redaction events, system events)
    |
    v
In-memory repository (challenge build; optional Postgres via db/migrations)
    |-- cases, conversations, transcript_segments, evidence_items
    |-- source_records, contradictions, handoffs, tool_calls
    |-- evaluations, redaction_events, system_events
    |
    v
Web review console (Next.js 14, port 3000)
    |-- GET /cases      --> cases list (filterable by status, language)
    |-- GET /cases/:id  --> full case review (7 tabs: summary, transcript,
    |                         evidence, source records, contradictions,
    |                         tool calls, handoff)
    |-- GET /conversation --> demo intake (scripted replay of synthetic flows)
    |-- GET /evaluations  --> Agent Testing scenarios, pass rates, per-run outcomes
```

## Trust boundaries

### Caller boundary

The caller is untrusted. Braid does not request PINs, passwords, or unnecessary personal data. Caller identity claims are not treated as authoritative outside the approved challenge flow.

### ElevenLabs boundary

Speech, conversation flow, knowledge retrieval, tool routing, transcript, and evaluation are handled by the ElevenLabs platform. The agent cannot bypass tool permissions enforced by the platform.

### Application boundary

Every webhook is signature-verified before persistence. Field-level redaction is applied to sensitive values in logs and the reviewer view. Immutable audit events are appended for every tool call, redaction, and system event. The tool registry enforces gate logic at the code level, not only in the prompt.

### Institution boundary

Claims-sandbox and repair-sandbox are internal synthetic adapters. The adjuster queue is a mock. Approval and claim decisions remain human-controlled. The `CLAIMS_SANDBOX_AVAILABLE=false` environment variable triggers the dependency failure path.

## Decision boundary

The agent gathers evidence. It does not produce or invoke:

- liability determination
- coverage approval or denial
- settlement value recommendation
- payment authorisation
- fraud scoring
- legal or medical advice
- autonomous claim closure

These are hard boundaries enforced by:

- the absence of those tools from the tool registry
- the agent prompt (opening disclosure, boundary nodes, refusal language)
- the evaluation suite (BRD-SC-06, BRD-SC-07, BRD-SC-10)
- the fact that every handoff routes to a queue, never to an automated payment

The decision boundary statement in every post-call analysis:

> Braid prepares evidence only. Liability, coverage, settlement value, payment, and claim closure remain with qualified human adjusters.

(Arabic: يجمع بريد الأدلة فقط. تبقى المسؤولية والتغطية وقيمة التسوية والدفع وإغلاق المطالبة مع مُسوّي المطالبات المؤهلين.)

## Components

### API service (apps/api)

| File | Responsibility |
| --- | --- |
| `routes/cases.ts` | GET /api/cases, POST /api/cases, GET /api/cases/:caseId |
| `routes/handoff.ts` | POST /api/cases/:caseId/handoff |
| `routes/evaluations.ts` | GET /api/evaluations |
| `routes/tools.ts` | POST /api/tools/claims-record, POST /api/tools/repair-record |
| `routes/health.ts` | GET /api/health |
| `webhooks/elevenlabs.ts` | POST /api/webhooks/elevenlabs (HMAC verification, idempotent) |
| `adapters/claims-sandbox.ts` | Synthetic claims record adapter |
| `adapters/repair-record.ts` | Synthetic repair record adapter |
| `adapters/repository.ts` | In-memory case store with seeded synthetic cases |
| `services/redaction.ts` | Field-level sensitive value redaction |
| `services/logger.ts` | Request-scoped logging with redaction |
| `services/rate-limit.ts` | Per-session and per-case rate limiting |

### Web app (apps/web)

| File | Responsibility |
| --- | --- |
| `app/page.tsx` | Landing page: evidence braid hero, product overview, audit explainer |
| `app/conversation/page.tsx` | Demo intake: choose language and scenario, create a case, review the run |
| `app/cases/page.tsx` | Cases board: filterable list of all cases |
| `app/cases/[caseId]/page.tsx` | Full case review: 7 tabs |
| `app/evaluations/page.tsx` | Agent Testing: scenarios, pass rates, per-run details |
| `lib/api.ts` | Typed client for the API (createCase, listCases, getCase, createHandoff, getEvaluations) |
| `lib/format.ts` | Formatting helpers: timestamps, offsets, source labels, field labels |

### Shared packages

| Package | Contents |
| --- | --- |
| `@braid/domain` | All domain types: TranscriptSegment, ToolCall, EvidenceItem, CaseDetail, Evaluation, Handoff, Contradiction, QueueTarget, ToolName, ToolOutcome, WorkflowNode, Scenario, Language, SourceType, Severity |
| `@braid/ui` | StatePill, OutcomeBadge, RiskState, STATE_LABELS, SOURCE_LABELS, CONTRADICTION_STATUS_LABELS |

## Security and compliance controls

- AI identity disclosure at call opening (enforced by workflow node, verified by BRD-SC-01)
- Consent capture before claim details are stored (enforced by workflow node, verified by BRD-SC-01, BRD-SC-02, BRD-SC-09)
- Webhook signature verification (HMAC SHA-256, enforced in `webhooks/elevenlabs.ts`)
- Scoped tools with least privilege (tools limited to the case reference in the request)
- Field-level redaction in logs and reviewer views (`services/redaction.ts`)
- No PINs, passwords, or unnecessary secrets requested (agent prompt, BRD-SC-07)
- Human approval required for consequential decisions (tool registry, BRD-SC-06)
- Opt-out and human escalation paths exist (BRD-SC-08, BRD-SC-09)
- Source timestamps preserved on every entity
- Synthetic data only (no production personal data)

## Storage

The challenge build uses an in-memory TypeScript repository seeded with 6 synthetic cases and 10 evaluation scenarios on startup. To persist, set `DATABASE_URL` to a Postgres connection and apply the migrations in `db/migrations`:

- `001_initial_schema.sql` -- core tables (cases, conversations, transcript_segments, evidence_items, source_records, contradictions, handoffs, tool_calls, evaluations, redaction_events, system_events)
- `002_audit_extensions.sql` -- audit and event extensions