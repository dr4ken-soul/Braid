# Braid App Blueprint

Status: approved product blueprint
Project: Braid
Challenge: Future of Voice AI Challenge
Track: Banking and Insurance
Use case: multilingual insurance claims evidence reconciliation
Platform: ElevenLabs Agents
Primary deployment for challenge: hosted web agent and test-number or simulated call flow
Primary buyer: Chief Claims Officer or Head of Claims Operations

## 1. Product summary

Braid helps insurers turn a claimant's spoken account into an evidence-ready adjuster packet.

A caller explains an accident in English or Arabic. Braid records and transcribes the conversation, extracts factual fields, checks the applicable policy and claims requirements, compares the account with repair or system records, identifies contradictions, and hands unresolved decisions to a qualified adjuster.

Braid does not determine liability, coverage, fraud, settlement value, or payment. It prepares evidence and routes judgment to the institution's human process.

Core promise:

> Braid turns one spoken claim into a traceable evidence package.

## 2. Challenge fit

The supplied challenge brief requires:

- one selected use case
- English and Arabic at minimum
- a multilingual voice agent built on ElevenLabs
- documented digital integrations through APIs or webhooks
- recorded and transcribed conversations
- auditable operation
- human approval for consequential decisions
- a working link in the Stage 1 Idea Canvas
- a live callable agent or hosted web deployment during Stage 2
- a failure or escalation path
- Agent Testing results, including a tool-call test on a high-stakes action
- transcripts, post-call analysis, architecture diagram, and technical README

Braid is intentionally scoped to a single insurance claims workflow. It does not attempt to be a general claims assistant.

## 3. Institutional problem

Motor and property claims often begin as unstructured conversations. The claimant account, policy data, repair estimate, and claim system may disagree or remain incomplete.

The current process creates:

- repeated questioning
- slow handoff from contact centre to adjuster
- missing evidence
- avoidable rework
- unclear provenance
- unsafe pressure on voice agents to decide coverage
- inconsistent language access

The expensive failure is not that a voice agent cannot answer a question. It is that a partial or contradictory case reaches an adjuster without a clear explanation of what is missing.

## 4. Product thesis

A voice agent should not replace the adjuster. It should improve the quality of the adjuster's first packet.

Braid differentiates through:

1. evidence provenance for every extracted fact
2. contradiction detection across independent sources
3. a hard boundary between factual intake and institutional judgment
4. structured human handoff
5. full conversation and tool-call auditability

## 5. Target customer segments

1. UAE motor insurers with high first-notice-of-loss volume.
2. Health or property insurers with multilingual claimant populations.
3. Third-party administrators that prepare claims for multiple insurers.

Economic buyers:

- Chief Claims Officer
- Head of Claims Operations
- Head of Customer Experience
- Chief Digital Officer
- Compliance Operations Director

Operational users:

- adjusters
- claims supervisors
- contact-centre managers
- quality assurance and compliance reviewers

## 6. Market validation plan

Required before final Idea Canvas submission:

- speak to at least two claims professionals
- speak to at least one contact-centre or compliance professional
- record dates, roles, and the assumption that changed
- obtain a measurable baseline for first-notice-of-loss handling
- validate whether repair records are accessible through an API or sandbox
- confirm which actions require adjuster approval

Questions:

- Where is the first claim account recorded today?
- Which fields are most often missing or contradictory?
- Which source is trusted when claimant and repair data disagree?
- What must a contact-centre agent never promise?
- Which actions can be automated, and which require an adjuster?
- How is the case currently audited?

Do not invent interview names, baseline figures, or institutional system names in the Idea Canvas.

## 7. Baseline and KPI design

The Idea Canvas requires box D and box M to use the same baseline numbers. Braid should use no more than three KPIs.

Candidate baselines to measure:

| KPI | Baseline required | Target direction |
| --- | --- | --- |
| Time from first notice to adjuster-ready packet | Interview or pilot measurement | Reduce |
| Percentage of cases returned for missing or contradictory information | Claims operations measurement | Reduce |
| Percentage of calls requiring manual re-entry | Contact-centre measurement | Reduce |

The submission must replace these fields with real measured values. Do not claim a reduction until the baseline source is documented.

## 8. Competitive landscape

Braid is not competing with voice quality alone. It competes with existing claims workflow tools and contact-centre systems.

| Alternative | Strength | Gap Braid addresses |
| --- | --- | --- |
| Core claims platform | System of record | Often receives unstructured notes without cross-source evidence reconciliation |
| Contact-centre suite | Routing, recording, QA | Usually does not create a source-linked claims packet from the call |
| Generic voice agent | Natural conversation | Does not enforce claims decision boundaries or contradiction handoff |
| Human first-notice-of-loss team | Contextual judgment | Expensive and inconsistent for repetitive factual intake |
| Document extraction tool | Structured document fields | Does not resolve spoken claimant context and source conflict |

Pricing for enterprise competitors is generally quote-based or varies by contract. The first commercial proof should be faster, more complete adjuster packets, not a claim that Braid replaces an existing platform.

## 9. Commercial model

Braid should initially be sold as an institutional workflow module, not as a consumer insurance assistant.

Possible model:

- Pilot: fixed implementation fee plus usage allowance
- Growth: monthly platform fee plus per completed intake
- Enterprise: annual contract with volume, audit retention, and integration support

Illustrative pricing assumptions for planning only:

| Tier | Monthly platform | Included calls | Additional call |
| --- | ---: | ---: | ---: |
| Pilot | 2,500 USD | 500 | 2.50 USD |
| Growth | 8,000 USD | 5,000 | 1.25 USD |
| Enterprise | Custom | Custom | Custom |

These are internal hypotheses, not submission claims. Validate procurement expectations with an insurer before publishing.

The feature most likely to create paid demand is the evidence reconciliation and adjuster packet, not voice conversation by itself.

## 10. MVP feature set

### Feature 1: multilingual claim intake

User story: As a claimant, I want to describe an incident in English or Arabic so that I do not need to translate the account myself.

Acceptance:

- opening disclosure states that the caller is speaking with an AI agent
- language is selected or detected
- agent captures only factual claim information
- transcript is stored with timestamps
- caller can request a human

Complexity: high.

### Feature 2: evidence extraction

User story: As an adjuster, I want spoken facts converted into structured fields so that I can review a claim without replaying the entire call.

Acceptance:

- extracted fields include incident date, location, parties, damage, injuries, and required follow-up
- every field links to a transcript span
- confidence and source are visible
- missing fields remain visibly missing
- no unsupported value is invented

Complexity: high.

### Feature 3: contradiction reconciliation

User story: As a claims supervisor, I want mismatches between claimant, policy, repair, and system data identified so that unresolved issues reach a human early.

Acceptance:

- compares at least two external or simulated records
- displays the conflicting values
- identifies source and observation time
- explains why the agent cannot resolve the contradiction
- creates an escalation reason

Complexity: high.

### Feature 4: governed adjuster handoff

User story: As an adjuster, I want a complete evidence packet routed to my queue so that I can make the decision with the right context.

Acceptance:

- handoff requires required fields and escalation reason
- no coverage or liability decision is produced by the agent
- tool call records request, response, and result
- human queue target is explicit
- caller receives a clear next-step message

Complexity: high.

### Feature 5: audit and evaluation console

User story: As a compliance reviewer, I want to inspect the call, tool calls, sources, and handoff so that I can audit agent behaviour.

Acceptance:

- transcript, evidence, tools, sources, and analysis are separate views
- calls are filterable by outcome
- failure and escalation paths are preserved
- Agent Testing results can be linked to a version
- sensitive values are redacted in the reviewer view where required

Complexity: medium.

## 11. Explicitly out of scope for Version 1

- liability determination
- coverage approval or denial
- fraud scoring
- settlement value recommendation
- payment authorization
- legal or medical advice
- autonomous claims closure
- direct customer document storage without consent
- production telephony rollout
- real claimant personal data
- insurer logo or branded institution identity
- multilingual support beyond English and Arabic in the first build

These limits protect the demo and make the guardrails demonstrable.

## 12. ElevenLabs component selection

Select only components required by the use case:

- Agents Platform
- Agent Workflows
- Eleven v3 or an appropriate low-latency conversational voice model
- Scribe v2 Realtime
- Knowledge Base with RAG
- Server tools or webhooks
- Agent Testing
- Post-call webhooks
- Web SDK or test-number integration

Use sub-agents only if they make the workflow clearer. A practical first design has an intake agent and a handoff or clarification node, rather than many artificial agents.

Why the less obvious choices matter:

- Agent Workflows enforce branching between complete intake, missing evidence, contradiction, and human escalation.
- Agent Testing proves that a high-stakes tool call is blocked or routed correctly, rather than relying on a prompt instruction.
- Post-call webhooks preserve the audit record and evaluation result outside the live conversation.

## 13. Technical architecture

### Client layer

- Next.js with TypeScript
- Tailwind CSS
- ElevenLabs web conversation integration or hosted agent link
- case review console
- transcript and evidence explorer
- responsive layout following FRONTEND_SPEC.md

### Agent layer

- ElevenLabs Agent
- Agent Workflows
- Scribe v2 Realtime
- selected voice model
- Knowledge Base containing approved claims procedures and policy excerpts
- scoped tools
- explicit disclosure and consent nodes

### Service layer

- TypeScript API
- schema validation with Zod
- webhook receiver
- claims sandbox adapter
- repair-record adapter
- audit persistence
- redaction service
- test and evaluation record service

### Storage layer

- PostgreSQL or Supabase Postgres
- object storage only for approved demo artefacts
- no real claimant data
- encrypted secrets through deployment provider configuration

## 14. Trust boundaries

Caller boundary:

- caller may be untrusted
- agent does not request PINs, passwords, or unnecessary secrets
- caller identity claims are not treated as authoritative without the approved challenge flow

ElevenLabs boundary:

- speech, conversation flow, knowledge retrieval, tool routing, transcript, and evaluation
- agent cannot bypass tool permissions

Application boundary:

- validates every webhook
- verifies signature where supported
- applies field-level redaction
- stores immutable audit events

Institution boundary:

- mock claims system
- mock repair record
- adjuster queue
- approval remains human-controlled

## 15. Data model

Core tables:

| Table | Purpose |
| --- | --- |
| cases | Claim case identity and lifecycle |
| conversations | Call metadata and transcript references |
| transcript_segments | Timestamped speech segments |
| evidence_items | Extracted facts with source spans |
| source_records | Policy, repair, and system facts |
| contradictions | Conflicting fields and resolution state |
| handoffs | Adjuster packet and queue status |
| tool_calls | Tool request and response audit |
| evaluations | Agent Testing and post-call results |
| redaction_events | Sensitive-field handling |
| system_events | Integration errors and operational events |

Relationships:

- one case has many conversations
- one conversation has many transcript segments
- one case has many evidence items
- one evidence item may reference one or more transcript segments
- one case has many source records and contradictions
- one case has zero or more handoffs
- one conversation has many tool calls
- one agent version has many evaluations

## 16. API architecture

### GET /api/cases

Purpose: list reviewable cases.

Auth: authenticated reviewer.

Rate limit: 60 requests per minute.

### GET /api/cases/:caseId

Purpose: return case state, evidence, contradictions, handoff, and source references.

Auth: authenticated reviewer.

Rate limit: 120 requests per minute.

### POST /api/cases

Purpose: create a demo case or start a permitted intake.

Auth: public demo token or authenticated operator.

Rate limit: 10 requests per minute per session.

### POST /api/webhooks/elevenlabs

Purpose: receive post-call conversation data and evaluation results.

Auth: signed webhook or secret header.

Rate limit: provider-specific.

### POST /api/tools/claims-record

Purpose: retrieve an approved mock claim record.

Auth: agent-scoped server tool.

Rate limit: 30 requests per minute per conversation.

### POST /api/tools/repair-record

Purpose: retrieve an approved repair record.

Auth: agent-scoped server tool.

Rate limit: 30 requests per minute per conversation.

### POST /api/cases/:caseId/handoff

Purpose: create an adjuster handoff packet.

Auth: authenticated operator or controlled agent tool.

Rate limit: 10 requests per minute per case.

Critical rule: this endpoint must not approve, deny, settle, or close a claim.

### GET /api/evaluations

Purpose: return Agent Testing results and pass rates.

Auth: admin or challenge reviewer.

Rate limit: 60 requests per minute.

### GET /api/health

Purpose: return service and dependency health.

Auth: public status subset, private diagnostic detail.

## 17. User flows

### Caller intake

1. Opening disclosure.
2. Language confirmation.
3. Consent and case reference.
4. Factual account.
5. Clarifying questions limited to missing fields.
6. Evidence retrieval through scoped tools.
7. Contradiction or complete-case branch.
8. Human handoff or next-step message.
9. Post-call audit webhook.

### Reviewer flow

1. Open case console.
2. Select case.
3. Read summary.
4. Compare transcript and evidence.
5. Inspect contradictions.
6. Review tool calls and sources.
7. Accept or reject handoff packet.
8. Export or retain audit record according to policy.

### Failure flow

1. Tool dependency is unavailable.
2. Agent says the record cannot be verified.
3. Agent avoids making a claim decision.
4. Case is marked for human follow-up.
5. Failure is captured in transcript and evaluation data.

## 18. Screen map

### Landing and demo screen

Purpose: explain Braid and start an approved demo.

Components:

- split-screen evidence braid hero
- dual-pill navigation
- case preview
- open case action
- system status

### Live conversation screen

Purpose: show the call flow.

Components:

- transcript
- language state
- disclosure and consent state
- current workflow node
- tool activity
- escalation status

### Case review screen

Purpose: inspect evidence.

Components:

- case identity
- claimant account
- evidence items
- policy requirements
- repair record
- contradiction desk
- handoff action

### Audit explorer

Purpose: demonstrate accountability.

Components:

- transcript tab
- evidence tab
- tool call tab
- policy source tab
- analysis tab
- redaction state

### Evaluation screen

Purpose: prove the build.

Components:

- test scenario list
- pass rate
- failure path
- tool-call test
- transcript link
- agent version

## 19. Loading and error states

Loading:

- show case skeletons
- label unavailable evidence as loading
- never imply that a field is verified before the response arrives

Unavailable:

- show dependency name
- show last successful observation time
- route to human follow-up

Error:

- explain what failed
- show retry only when retry is safe
- preserve the conversation and case state

Empty:

- explain that no case exists
- provide the Open a case action

## 20. Security and compliance controls

- disclose AI identity at call opening
- capture consent before collecting claim details
- never request PINs, passwords, or unnecessary secrets
- use scoped tools with least privilege
- redact sensitive fields in logs and reviewer views
- separate factual extraction from decision authority
- require human approval for liability, coverage, settlement, and payment decisions
- preserve opt-out and human escalation paths
- retain source timestamps
- sign and validate webhooks
- do not use production personal data in the challenge build
- store test secrets only in deployment configuration

## 21. Monetisation and institutional adoption

Braid is a B2B workflow product.

Initial pilot:

- one claims line
- one language pair
- one sandbox claims system
- one adjuster queue
- measured baseline and target

Expansion:

- additional languages
- additional claim types
- claims QA and audit analytics
- contact-centre integration
- document and repair-provider integrations

The commercial proof is reduced rework and faster adjuster readiness, not autonomous claim settlement.

## 22. Distribution strategy

First institutional conversations:

1. UAE insurers with motor claims teams
2. third-party administrators
3. claims BPO and contact-centre operators
4. repair networks
5. insurance technology integrators

Demo distribution:

- publish the hosted review console
- provide a test call or web agent
- show the failure path
- publish Agent Testing evidence
- share the one-page architecture diagram
- ask claims professionals to challenge the guardrails

X posting is optional and must never expose claimant data or imply production deployment.

## 23. Build plan aligned to the challenge

### Stage 1, Idea Canvas

- select Braid as one use case
- conduct institutional interviews
- measure baseline
- complete every box within its word limit
- add a working product or repository link
- record the 60-second architecture walkthrough required by the canvas
- validate English and Arabic call flow

### Stage 2, build sprint

#### Days 1 to 2

- configure ElevenLabs agent
- define disclosure, consent, language, and escalation
- create approved knowledge base
- create mock claims and repair tools

Deliverable: opening to factual intake works.

#### Days 3 to 5

- implement workflow branches
- implement Scribe transcription
- implement evidence extraction
- add source spans and confidence
- add missing-field path

Deliverable: transcript becomes structured evidence.

#### Days 6 to 8

- implement contradiction comparison
- add tool-call audit records
- implement human handoff packet
- add failure and dependency-down path

Deliverable: contradiction reaches a human queue without a claim decision.

#### Days 9 to 11

- build case review console
- add audit explorer
- add Agent Testing scenarios
- run multi-run pass-rate tests
- test English and Arabic

Deliverable: evidence and guardrails are visible.

#### Days 12 to 14

- polish frontend according to FRONTEND_SPEC.md
- verify responsive and reduced-motion behaviour
- capture transcripts and post-call analysis
- prepare architecture diagram and technical README
- record final demo

Deliverable: submission-ready build.

## 24. Repository structure

Braid/
- apps/web/src/app
- apps/web/src/components
- apps/web/src/features/conversation
- apps/web/src/features/cases
- apps/web/src/features/evidence
- apps/web/src/features/handoff
- apps/web/src/features/evaluations
- apps/web/src/lib
- apps/api/src/routes
- apps/api/src/services
- apps/api/src/adapters
- apps/api/src/webhooks
- packages/domain
- packages/validation
- packages/elevenlabs
- packages/ui
- db/migrations
- docs
- FRONTEND_SPEC.md
- APP_BLUEPRINT.md
- BUILD_GUIDE.md
- CLAUDE.md
- PRODUCT.md
- DEMO_SCRIPT.md
- IDEA_CANVAS_DRAFT.md
- MARKETING.md
- README.md
- SUBMISSION_CHECKLIST.md
- .env.example

## 25. Environment contract

The eventual .env.example should include:

- ElevenLabs API key
- ElevenLabs agent ID
- webhook secret
- database URL
- claims sandbox URL
- repair sandbox URL
- session signing secret
- PostHog key
- Sentry DSN
- deployment URL
- demo access token

No real value should be committed.

## 26. Definition of done

The build is submission-ready when:

- the agent identifies itself as AI
- English and Arabic are demonstrated
- the call is recorded and transcribed
- evidence fields link to transcript spans
- at least two source records can disagree
- contradiction creates a clear escalation
- the agent cannot decide liability or coverage
- the handoff tool call is testable
- a dependency failure produces a human path
- Agent Testing includes multi-run results and a high-stakes tool-call test
- transcripts and post-call analysis are available
- architecture and technical README are complete
- the hosted link works without production data
- the final video shows the main flow and failure path

