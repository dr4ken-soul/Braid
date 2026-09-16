# Braid Project Instructions

## Project identity

- Name: Braid
- Product: multilingual insurance claims evidence reconciliation agent
- Challenge: Future of Voice AI Challenge
- Track: Banking and Insurance
- Platform: ElevenLabs Agents
- Primary user: claims adjuster and claims operations reviewer
- Primary action: inspect a case and send unresolved evidence to a human adjuster

## Required reading order

Before implementation changes, read:

1. FRONTEND_SPEC.md
2. APP_BLUEPRINT.md
3. BUILD_GUIDE.md
4. PRODUCT.md
5. DEMO_SCRIPT.md

Reference files in the parent Agents and Skill files directories are guidance only. Do not copy their examples, product names, copy, or project structures directly.

## Scope

Braid prepares evidence. It does not decide liability, coverage, settlement value, fraud, payment, or claim closure.

Do not add:

- autonomous claim decisions
- production personal data
- medical or legal advice
- unsupported insurer branding
- a logo or custom brand symbol without approval
- fake metrics or fake customer names
- a generic chatbot mode unrelated to claims intake

## ElevenLabs rules

- The agent identifies itself at the beginning of every call.
- English and Arabic are required for the first demonstration.
- Use approved knowledge sources only.
- Scope tools to the workflow node that requires them.
- Validate every tool response.
- Preserve transcript, timestamps, source references, and post-call analysis.
- Test failure and escalation paths, not only the happy path.
- Require human approval for consequential claims decisions.
- Never request PINs, passwords, or unnecessary secrets.

## Data rules

- A transcript statement is not authoritative evidence by itself.
- Every extracted fact must have a source span and confidence.
- Every external record must have source name and observed time.
- Contradictions remain visible until a qualified human resolves them.
- Webhook payloads require validation and signature checks where supported.
- Redact sensitive data from logs and demo output.
- Do not use real claimant data in the challenge build.

## Frontend rules

- Follow FRONTEND_SPEC.md.
- Use Barlow Condensed and IBM Plex Mono.
- Use CSS colour tokens, never direct hex values in JSX.
- Use inline SVG or approved Google Material Icons only.
- Do not use emoji as interface icons.
- Keep the dual-pill navigation.
- Apply 3D motion only to the evidence frame.
- Keep reduced-motion and touch-device fallbacks.
- Make scroll animations replay when elements re-enter the viewport.
- Keep the handoff action disabled until required evidence and escalation fields exist.
- Do not use a fake waveform as the primary product visual.

## Writing rules

- Use clear professional English.
- Prefer concrete language over marketing filler.
- Use sentence case for interface copy.
- Do not claim that Braid makes decisions it does not make.
- Do not use em dashes in copy, comments, documentation, or code strings.
- Do not use the words seamless, next-gen, elevate, unlock, empower, or revolutionary in headlines.

## Naming rules

Use Braid consistently. Do not create a second product name. Render Braid as text. Ask before adding a logo or sponsor mark.

## Change workflow

Before a change:

1. Identify the affected claim workflow.
2. Identify the trust boundary.
3. Check acceptance criteria.
4. Check whether the change affects redaction, consent, or human approval.

After a change:

1. Run type checks.
2. Run relevant tests.
3. Test the browser state manually.
4. Test English and Arabic.
5. Test failure and escalation paths.
6. Test reduced motion and keyboard navigation.
7. Check logs for sensitive values.
8. Update the blueprint when public behaviour changes.

## Definition of done

A feature is incomplete until normal, loading, stale, unavailable, empty, error, escalation, and handoff states are considered. A claims decision feature is incomplete if it allows the agent to decide coverage, liability, payment, or settlement.

