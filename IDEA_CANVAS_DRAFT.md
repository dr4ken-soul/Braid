# Braid Idea Canvas Draft

Status: structured draft, not submission-ready

This document follows the supplied Idea Canvas structure. It does not invent interview evidence, baseline metrics, team details, or links. Replace every owner-input field before submission.

## 01. The Opportunity

### A. Submission details

- Team name: OWNER INPUT REQUIRED
- Contact email: OWNER INPUT REQUIRED
- Track: Track 1, Banking and Insurance
- Use case: Braid, insurance claims evidence reconciliation
- Stage: Stage 1
- Languages covered: English and Arabic
- Prior ElevenLabs use: OWNER INPUT REQUIRED
- Team size and location: OWNER INPUT REQUIRED
- Website or repository: OWNER INPUT REQUIRED

### B. The idea in one line

Draft, within 25 words:

An agent that reconciles spoken insurance claims with policy and repair records for adjusters, so that contradictions reach human review before decisions are made.

### C. What breaks today

Owner input required. Describe the current workflow only. Include:

- call channel
- handoffs
- delay
- who waits
- where missing or conflicting evidence is discovered
- what the adjuster receives

Do not describe Braid in this box.

### D. Today's baseline

Owner input required. Use measured values only.

| What was measured | Value today | Source |
| --- | --- | --- |
| Time to adjuster-ready packet | OWNER INPUT REQUIRED | Interview or pilot |
| Returned cases with missing or conflicting information | OWNER INPUT REQUIRED | Claims operations |
| Manual re-entry rate | OWNER INPUT REQUIRED | Contact-centre data |

### E. Who buys this

Draft:

The buyer is the Chief Claims Officer or Head of Claims Operations at a UAE insurer. Budget may come from claims operations, contact-centre transformation, or digital customer experience. Confirm the title and budget line through interviews.

## 02. The Evidence

### F. Who you spoke to

Owner input required. Desk research does not replace institutional conversations.

| Name and role | Organisation type | Date | Assumption changed |
| --- | --- | --- | --- |
| OWNER INPUT REQUIRED | OWNER INPUT REQUIRED | OWNER INPUT REQUIRED | OWNER INPUT REQUIRED |

### G. What you got wrong

Owner input required. State one assumption that changed after interviews, within 50 words.

### H. The workflow today

Create a diagram with these lanes:

- claimant
- contact-centre agent
- claims system
- repair provider
- adjuster
- systems touched
- elapsed time

The diagram must show every handoff, wait, chase point, common failure, and total duration.

## 03. The Agent

### I. The call flow

Draft, maximum 15 words per step:

1. The AI agent identifies itself, confirms language, and explains the purpose of the call.
2. The caller gives consent and describes the incident using factual details.
3. The agent asks only for missing claim fields and records transcript evidence.
4. Scoped tools retrieve policy, claim, and repair records for comparison.
5. The agent explains unresolved contradictions and offers human adjuster handoff.

### J. ElevenLabs components

Select only what is required:

- Agents Platform
- Agent Workflows
- Eleven v3 or approved conversational voice model
- Scribe v2 Realtime
- Knowledge Base and RAG
- Server tools or webhooks
- Agent Testing
- Post-call webhooks
- Web or mobile SDK

Justification:

Agent Workflows enforce the complete, missing-evidence, contradiction, and human-handoff branches. Agent Testing proves that a high-stakes handoff tool is correctly gated. Scribe v2 Realtime supports multilingual, low-latency transcription for structured evidence.

### K. Guardrails

| Requirement | Mechanism |
| --- | --- |
| Opening disclosure | First workflow node requires an AI identity message before intake |
| Consent to be called | Consent field must be true before claim details are stored |
| Verification without secrets | Approved challenge tool, with no PIN or password collection |
| Human approval point | Coverage, liability, settlement, payment, and closure tools do not exist for the agent |
| Opt-out path | Caller intent routes to end-call or human transfer node |
| Escalation trigger | Contradiction, missing critical field, dependency failure, advice request, or caller request creates handoff |

## 04. The Architecture

### L. Technical architecture

Diagram zones:

1. Caller and channel
2. ElevenLabs platform
3. Institution sandbox and human queue

Required arrows:

- caller audio to ElevenLabs agent
- transcript to evidence service
- agent to knowledge base
- agent to claims tool
- agent to repair tool
- evidence service to case store
- contradiction service to adjuster queue
- post-call webhook to audit store

Mark every personal-data boundary and show what happens when a dependency is down.

## 05. The Case

### M. Success metrics

Use no more than three KPIs. Baselines must match box D exactly.

| KPI | Baseline | Target | Measurement |
| --- | --- | --- | --- |
| Time to adjuster-ready packet | OWNER INPUT REQUIRED | OWNER INPUT REQUIRED | Case timestamps |
| Returned cases | OWNER INPUT REQUIRED | OWNER INPUT REQUIRED | Case status history |
| Manual re-entry rate | OWNER INPUT REQUIRED | OWNER INPUT REQUIRED | Contact-centre audit |

### N. Risks

| Risk | Mechanism |
| --- | --- |
| Agent makes an unsupported claim decision | Decision tools are absent and escalation is required |
| Source records conflict | Contradictions are displayed and routed to an adjuster |
| Claims or repair dependency is unavailable | Agent states that verification failed and creates human follow-up |
| Sensitive data appears in logs | Redaction layer and synthetic challenge data |

### O. What will be working by October 14

Draft:

A hosted English and Arabic agent will identify itself, capture consent, record a synthetic claim, retrieve mock policy, claim, and repair records, show a contradiction, and send a structured packet to a mock adjuster queue. A failure path, transcripts, Agent Testing results, post-call analysis, architecture diagram, and technical README will be included.

### P. Team

Owner input required.

| Name | Role | Previously shipped |
| --- | --- | --- |
| OWNER INPUT REQUIRED | OWNER INPUT REQUIRED | OWNER INPUT REQUIRED |

### Q. Proof of build

- Working product, repository, or deployed demo: OWNER INPUT REQUIRED
- 60-second architecture walkthrough: OWNER INPUT REQUIRED

## Submission warning

This draft is not ready to submit until owner-input fields are replaced with factual information and the final word limits are checked against the official canvas.

