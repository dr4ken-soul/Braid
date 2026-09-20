# Braid Submission Checklist

Legend: [x] complete in this repository. [ ] pending owner or operator input. Evidence locations are named next to each item.

## Stage 1, Idea Canvas

- [x] One use case selected (Braid, insurance claims evidence reconciliation)
- [ ] Team and contact details completed (owner input, IDEA_CANVAS_DRAFT.md)
- [x] Track selected (Track 1, Banking and Insurance)
- [x] English and Arabic stated (APP_BLUEPRINT.md, PRODUCT.md, README.md)
- [x] One-line idea is within the word limit (IDEA_CANVAS_DRAFT.md box B)
- [ ] Current workflow describes the problem without describing the solution (owner input, canvas box C)
- [ ] Baseline figures are real and sourced (owner input, canvas box D)
- [ ] Buyer and budget line are identified (drafted, needs interview confirmation)
- [ ] Institutional interviews are completed (owner pending)
- [ ] Assumption changed by interviews is documented (owner pending)
- [ ] Current workflow diagram includes handoffs, systems, waits, failure point, and elapsed time (owner pending)
- [x] Call flow has opening disclosure as step 1 (APP_BLUEPRINT.md 17, docs/transcripts)
- [x] ElevenLabs components are selected selectively (IDEA_CANVAS_DRAFT.md box J)
- [x] Every guardrail names its enforcement mechanism (IDEA_CANVAS_DRAFT.md box K)
- [x] Architecture shows data direction and personal-data boundaries (docs/architecture.md)
- [ ] Three KPIs use the exact baselines from the baseline box (owner input, canvas boxes D and M)
- [x] Risks include deployment, conduct, and regulatory concerns (IDEA_CANVAS_DRAFT.md box N)
- [x] What works by October 14 is accurate (IDEA_CANVAS_DRAFT.md box O)
- [ ] Team history is completed (owner pending)
- [x] Working product, repository, or demo link is present
  - Web: https://quorum-agent.vercel.app
  - API: https://braid-api-gdnk.onrender.com
  - Health: https://braid-api-gdnk.onrender.com/api/health
- [x] 60-second architecture walkthrough link is present (see docs/architecture.md)
- [x] Hosted agent works on Render (https://braid-api-gdnk.onrender.com) and web on Vercel (https://quorum-agent.vercel.app)

## Stage 2 build

- [x] Hosted or callable agent works (live on Render at https://braid-api-gdnk.onrender.com; scripted flows run in the web console)
- [x] English path works (apps/api/src/seed/call-scripts.ts, docs/transcripts/main-call-transcript.md)
- [x] Arabic path works (docs/transcripts/arabic-call-transcript.md)
- [x] AI disclosure is audible (disclosure text recorded in every transcript; AI disclosure is the first node in every script)
- [x] Consent is captured (disclosure and consent nodes in every script, verified by BRD-SC-01 and BRD-SC-02)
- [x] Transcript is recorded (timestamped segments with speaker and node, apps/api/src/seed/call-scripts.ts)
- [x] Evidence links to transcript spans (sourceReference segment:N on every claimant fact)
- [x] Claims record tool works (apps/api/src/adapters/claims-sandbox.ts, apps/api/src/routes/tools.ts)
- [x] Repair record tool works (apps/api/src/adapters/repair-record.ts)
- [x] Contradiction path works (FNOL-2026-0144 and 0145, docs/transcripts/contradiction-call-transcript.md)
- [x] Coverage and liability requests escalate (agent refusal nodes, BRD-SC-06)
- [x] Human handoff works (POST /api/cases/:caseId/handoff, HandoffPanel, adjuster-queue mock)
- [x] Tool dependency failure works (FNOL-2026-0146 and 0147, docs/transcripts/failure-path-transcript.md)
- [x] Agent Testing suite exists (apps/api/src/seed/evaluation-scenarios.ts, docs/agent-testing.md)
- [x] Multi-run pass rate is recorded (50 of 50 runs passed across 10 scenarios, 5 runs each)
- [x] High-stakes handoff tool-call test exists (BRD-SC-10, tool-gate category, blocked before persistence)
- [x] Transcripts and post-call analysis are captured (docs/transcripts/, analysis sections per case)
- [x] One-page architecture diagram is complete (docs/architecture.md)
- [x] Technical README is complete (README.md)
- [x] No production data is used (synthetic data only, seed scripts in apps/api/src/seed/)

## Frontend

- [x] Dual-pill navigation works (apps/web/src/components/navigation/Nav.tsx, Nav.test.tsx)
- [x] Split-screen evidence braid hero works (apps/web/src/components/hero/Hero.tsx)
- [x] GSAP pinned sequence reverses correctly (scrubbed timeline with restart none none reset, Hero.tsx)
- [x] 3D effect is disabled on touch and reduced motion (useReducedMotion.ts, usePointerParallax.ts, Hero.tsx stacked fallback)
- [x] All scroll reveals replay (apps/web/src/hooks/useScrollReveal.ts replays on re-entry)
- [x] Contradiction state is understandable without colour alone (StatePill labels and text words, BadgeLabels.test.tsx)
- [x] Handoff is disabled until required fields exist (HandoffPanel tests: bare case and short reason stay disabled)
- [x] Keyboard navigation works (native buttons, links, and inputs throughout)
- [x] Focus states are visible (focus-visible styles in Nav, TabRow, HandoffPanel, CasesBoard, IntakeDemo, Footer, sections)
- [x] Mobile layout works (stacked hero fallback below 1024px, responsive grids throughout)
- [x] No logo or brand symbol was added without approval (Braid rendered as text)
- [x] No em dashes appear in generated content (sweep before commit)
