# Braid Demo Script

Target duration: 2 minutes 30 seconds
Audience: Future of Voice AI Challenge judges
Data: synthetic claimant, policy, and repair records only

## 0:00 to 0:15, the problem

Screen: Braid split-screen hero.

Narration:

"A claim can sound complete and still arrive at an adjuster with missing or conflicting facts. Braid turns a multilingual claimant conversation into an evidence-ready packet without letting the agent make the claim decision."

## 0:15 to 0:35, opening disclosure

Screen: live conversation view.

Actions:

1. Start the agent.
2. Show the AI disclosure.
3. Select English or Arabic.
4. Show consent state.

Narration:

"The agent identifies itself, confirms language, and captures consent before collecting the account. It does not ask for passwords or unnecessary secrets."

## 0:35 to 1:00, factual intake

Screen: transcript and case intake.

Actions:

1. Describe a synthetic accident.
2. Show transcript segments arriving.
3. Show extracted date, location, damage, and parties.
4. Open a source span.

Narration:

"Spoken facts are not silently promoted into truth. Each extracted field links back to the transcript and carries confidence and source information."

## 1:00 to 1:25, evidence reconciliation

Screen: evidence braid.

Actions:

1. Call the claims record tool.
2. Call the repair record tool.
3. Show policy requirements.
4. Show the evidence layers connecting.

Narration:

"Braid compares the claimant account with the claims system and repair record. The reviewer can see where each value came from and when it was observed."

## 1:25 to 1:50, contradiction path

Screen: contradiction desk.

Actions:

1. Show a deliberately conflicting damage location.
2. Highlight the two values.
3. Show source labels.
4. Ask the agent for a coverage decision.

Narration:

"When the records disagree, Braid does not guess. It identifies the contradiction, explains why it cannot resolve it, and keeps the decision with the adjuster."

## 1:50 to 2:10, human handoff

Screen: handoff panel.

Actions:

1. Show escalation reason.
2. Show required fields.
3. Send the packet to the mock adjuster queue.
4. Show accepted state.

Narration:

"The handoff contains the transcript, evidence, source records, contradiction, and escalation reason. The agent prepares the decision. It never makes the decision."

## 2:10 to 2:30, audit and failure

Screen: audit explorer and failed tool state.

Actions:

1. Open tool calls.
2. Show request, response, timestamp, and result.
3. Simulate the claims system being unavailable.
4. Show human follow-up path.
5. End on the Braid closing action.

Narration:

"Every call is reviewable. When a dependency fails, Braid says what could not be verified and routes the case to a human path. This is voice AI designed for institutional accountability."

## Recording checklist

- use synthetic data only
- test English and Arabic before recording
- preload a complete case and a contradiction case
- prepare one dependency failure
- show the AI disclosure
- show the handoff tool call
- show the Agent Testing result
- keep secrets and real personal data out of frame
- do not claim production deployment

