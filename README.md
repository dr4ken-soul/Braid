# Braid

Braid is a multilingual (English and Arabic) insurance claims evidence reconciliation agent built for the Future of Voice AI Challenge (Banking and Insurance track).

It listens to a claimant's factual account, records and transcribes the conversation, extracts evidence with source spans, compares the account with claims and repair records, exposes contradictions, and prepares a structured human adjuster handoff.

## Safety boundary

Braid prepares evidence. It never decides liability, coverage, settlement value, payment, fraud, legal or medical questions, or claim closure. Those remain with qualified human adjusters.

## Repository layout

npm workspaces monorepo.

| Path | Purpose |
| --- | --- |
| apps/api | TypeScript API: routes, webhook receiver, claims and repair sandbox adapters, in-memory store, seed scripts |
| apps/web | Next.js 14 review console: landing, conversation demo, cases, evaluations |
| packages/domain | Shared TypeScript domain types |
| packages/ui | Shared badge and state components |
| docs | Architecture, routes contract, agent testing results, call transcripts |
| db/migrations | Postgres migrations (optional persistence) |

## Requirements

- Node.js 18.17 or newer
- npm 9 or newer

## Setup

```bash
npm install
cp .env.example .env
```

The challenge build runs entirely on synthetic data with an in-memory repository. No database or external credentials are required to run it locally.

Optional environment variables (see `.env.example`):

| Variable | Purpose | Default behaviour |
| --- | --- | --- |
| `API_PORT` | API port | 4000 |
| `BRAID_WEBHOOK_SECRET` | HMAC SHA-256 secret for the ElevenLabs post-call webhook | `change-me-in-deployment` |
| `BRAID_DEMO_TOKEN` | Demo access token checked on write routes | `braid-demo-token` |
| `REVIEWER_TOKEN` | When set, GET /api/evaluations requires it | unset (evaluations open in demo mode) |
| `CLAIMS_SANDBOX_AVAILABLE` | Set to `false` to demonstrate the dependency failure path live | `true` |
| `DATABASE_URL` | Postgres connection for persistence; empty uses the in-memory store | in-memory |
| `NEXT_PUBLIC_API_URL` | API base URL for the web app | `http://localhost:4000` (live: `https://braid-api-gdnk.onrender.com`) |

## Run

### Local development

```bash
# Terminal 1: API on http://localhost:4000
npm run dev:api

# Terminal 2: Web console on http://localhost:3000
npm run dev:web
```

### Live

- Web: https://braid-chi.vercel.app
- API: https://braid-api-gdnk.onrender.com
- Health: https://braid-api-gdnk.onrender.com/api/health
- Webhook: https://braid-api-gdnk.onrender.com/api/webhooks/elevenlabs

On boot the API reports: `Braid API ready on port 4000 with 6 synthetic cases and 10 evaluation scenarios`.

## Routes

Web (live at https://braid-chi.vercel.app):

| Route | Purpose |
| --- | --- |
| `/` | Product overview with the evidence braid hero and audit explainer |
| `/conversation` | Scripted demo intake: choose language and scenario, create a case, review the run |
| `/cases` | Reviewer board of all cases |
| `/cases/[caseId]` | Full case review: transcript, evidence, source records, contradictions, tool calls, handoff |
| `/evaluations` | Agent Testing scenarios, per-run outcomes, and aggregate pass rate |

API (live at https://braid-api-gdnk.onrender.com):

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Service and dependency health |
| `/api/cases` | GET | List cases (supports `status`, `language`, `limit`) |
| `/api/cases/:caseId` | GET | Full case detail |
| `/api/cases` | POST | Create a demo case from a scripted intake flow |
| `/api/cases/:caseId/handoff` | POST | Create an adjuster handoff packet (human review only) |
| `/api/evaluations` | GET | Agent Testing results and pass rates |
| `/api/tools/claims-record` | POST | Scoped mock claims record tool |
| `/api/tools/repair-record` | POST | Scoped mock repair record tool |
| `/api/webhooks/elevenlabs` | POST | Signed post-call webhook (HMAC SHA-256) |

Route contracts are defined in `docs/routes.md`.

## Demo access token

Write routes expect the header `x-braid-demo-token`. The default value is `braid-demo-token` and matches the web client's default `NEXT_PUBLIC_DEMO_TOKEN`. No secrets are needed for read routes in demo mode.

The webhook route requires a valid HMAC SHA-256 signature in `x-braid-signature` or `x-elevenlabs-signature`, computed over the raw request body with `BRAID_WEBHOOK_SECRET`.

## Testing

```bash
npm run typecheck   # type checks every workspace
npm run test        # runs API and web test suites
npm run build       # production build of the web app
```

Expected results:

- API: 60 tests passing (schema, workflow, tool adapters, webhook signature, redaction, evaluations)
- Web: 37 tests passing (components, formatting, navigation, handoff, demo intake, evaluations)
- Build: 7 static pages compiled successfully

## Seeded demo cases

| Reference | Language | Scenario | Case ID |
| --- | --- | --- | --- |
| FNOL-2026-0142 | English | Complete account | `9f1c2a34-0142-4b0e-9c1d-a00000000142` |
| FNOL-2026-0143 | Arabic | Complete account | `9f1c2a34-0143-4b0e-9c1d-a00000000143` |
| FNOL-2026-0144 | English | Contradiction | `9f1c2a34-0144-4b0e-9c1d-a00000000144` |
| FNOL-2026-0145 | Arabic | Contradiction | `9f1c2a34-0145-4b0e-9c1d-a00000000145` |
| FNOL-2026-0146 | English | Dependency failure | `9f1c2a34-0146-4b0e-9c1d-a00000000146` |
| FNOL-2026-0147 | Arabic | Dependency failure | `9f1c2a34-0147-4b0e-9c1d-a00000000147` |

The scripted conversation demo on `/conversation` replays recorded synthetic intake flows. It is not a live phone call.

## Documentation

- `PRODUCT.md`, product brief and trust boundary
- `APP_BLUEPRINT.md`, approved product blueprint
- `FRONTEND_SPEC.md`, design system and frontend contract
- `BUILD_GUIDE.md`, build phases and required scenarios
- `CLAUDE.md`, project instructions
- `DEMO_SCRIPT.md`, 2 minute 30 second demo narration
- `SUBMISSION_CHECKLIST.md`, submission evidence tracker
- `docs/architecture.md`, data flow, trust boundaries, and decision boundary
- `docs/routes.md`, API route contract
- `docs/agent-testing.md`, Agent Testing scenarios and pass rates
- `docs/transcripts/`, verbatim synthetic call transcripts (English, Arabic, contradiction, failure path)

## Data policy

Synthetic records only. Do not commit API keys, personal data, call recordings, or real insurer documents.
