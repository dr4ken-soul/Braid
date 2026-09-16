# Braid Build Guide

Status: approved implementation sequence
Read first: FRONTEND_SPEC.md, APP_BLUEPRINT.md, and CLAUDE.md

## 1. Build objective

Build a working multilingual insurance claims evidence reconciliation agent on ElevenLabs.

The demonstrable loop is:

Hear the claim -> structure the facts -> compare sources -> expose contradictions -> hand off to an adjuster

## 2. Non-negotiable rules

- Use test data only.
- Identify the agent as AI.
- Support English and Arabic in the first build.
- Keep liability, coverage, settlement, payment, and claim closure human-controlled.
- Use scoped tools.
- Validate model and tool outputs.
- Preserve transcript and source provenance.
- Test at least one dependency failure.
- Do not add a logo or sponsor symbol without approval.
- Do not use em dashes anywhere in generated content.

## 3. Build phases

### Phase 0: foundation

- create the approved repository structure
- configure TypeScript
- configure linting and formatting
- configure environment variables
- add logging with sensitive-value redaction
- add health endpoint
- add error boundary

Exit condition: the project starts locally and reports dependency status.

### Phase 1: ElevenLabs agent

- create the agent
- write the opening disclosure
- configure language selection
- configure consent
- add approved claims knowledge
- define the workflow branches
- define human handoff conditions
- create one test conversation

Exit condition: a caller can start an intake in English or Arabic.

### Phase 2: transcript and evidence

- receive transcript data
- create transcript segments
- define evidence schema
- link evidence to transcript spans
- show confidence and source
- preserve missing fields

Exit condition: a conversation produces a reviewable evidence list.

### Phase 3: records and contradiction

- implement claims sandbox tool
- implement repair record tool
- validate tool responses
- compare records with claimant facts
- create contradiction states
- create failure state when a dependency is unavailable

Exit condition: at least one controlled contradiction reaches the escalation branch.

### Phase 4: handoff and audit

- create adjuster packet
- require escalation reason
- route to mock adjuster queue
- preserve tool calls
- add post-call webhook
- create audit explorer

Exit condition: the case can be reviewed from opening disclosure through handoff.

### Phase 5: frontend

- implement the dual-pill navigation
- implement split-screen evidence braid hero
- implement the GSAP pinned sequence
- implement 3D frame interaction
- implement evidence bento and contradiction desk
- implement responsive and reduced-motion states
- implement keyboard navigation

Exit condition: the visual product proves the workflow without hiding data.

### Phase 6: testing and submission

- create Agent Testing scenarios
- run multi-run pass-rate tests
- test high-stakes handoff tool
- test failure and escalation path
- capture transcripts
- generate post-call analysis
- create architecture diagram
- write technical README
- record demo
- complete the Idea Canvas draft

Exit condition: all Stage 2 evidence exists and the hosted link works.

## 4. Required Agent Testing scenarios

1. English claimant, complete factual account.
2. Arabic claimant, complete factual account.
3. Missing incident date.
4. Conflicting repair and claimant damage description.
5. Claims system unavailable.
6. Caller requests a coverage decision.
7. Caller asks for legal or medical advice.
8. Caller requests a human.
9. Caller withdraws consent.
10. Handoff tool receives an invalid queue target.

Each scenario must record pass or fail, agent version, transcript, and evaluation reason.

## 5. Test order

1. type check
2. schema tests
3. tool adapter tests
4. workflow tests
5. webhook tests
6. redaction tests
7. frontend component tests
8. browser flow tests
9. Agent Testing runs
10. clean browser and clean call rehearsal

## 6. Submission evidence

Capture:

- working hosted agent link
- repository link
- architecture diagram
- technical README
- main call transcript
- failure path transcript
- post-call analysis
- Agent Testing pass rate
- high-stakes tool-call test
- English and Arabic evidence
- 60-second architecture walkthrough for the Idea Canvas

## 7. Completion gates

The build is not ready when only the agent speaks. It is ready when:

- the agent identifies itself
- the claim is transcribed
- facts have provenance
- source records are retrieved through tools
- contradiction is visible
- the agent refuses unsupported decisions
- human handoff works
- dependency failure works
- audit evidence is preserved
- testing results are reproducible

