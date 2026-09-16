# Braid Product Brief

## What Braid does

Braid is a multilingual insurance claims evidence reconciliation agent.

It listens to a claimant's factual account, extracts claim fields, checks approved policy requirements, compares external records, identifies contradictions, and prepares a human adjuster handoff.

## What Braid does not do

Braid does not decide:

- liability
- coverage
- fraud
- settlement value
- payment
- claim closure
- legal or medical questions

## User experience

A claimant can speak in English or Arabic. The agent identifies itself, explains the purpose of the call, collects consent, asks bounded factual questions, and explains when human review is required.

A claims reviewer sees:

- the original transcript
- extracted facts
- source spans
- policy requirements
- repair or system records
- contradictions
- tool calls
- handoff state

## Product advantage

Most voice agents are judged by whether they sound natural. Braid is judged by whether the evidence packet is trustworthy.

Its core distinction is a visible chain:

spoken fact -> source span -> structured field -> external comparison -> contradiction or handoff

## Version 1 success

- English and Arabic intake
- recorded and timestamped transcript
- structured evidence
- at least two source records
- contradiction detection
- human handoff
- audit explorer
- Agent Testing evidence

## Intended pilot

A single motor insurance first-notice-of-loss workflow using test records and a mock adjuster queue.

## Trust boundary

The voice agent gathers facts. The claims institution decides the claim.

