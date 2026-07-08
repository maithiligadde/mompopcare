# Sprint 2 — First Vertical Slice

## Status

Implementation / Review

## Goal

Give MomPopCare its first working product shape through one end-to-end caregiver workflow.

## User Journey

- add loved one
- add task
- see attention on Home
- complete task
- see updated state
- see recent activity

## In Scope

- Expo mobile app initialization
- prototype user: Maithili
- in-memory care repository
- add loved one flow
- add care task flow
- Home attention projection
- task completion
- completion activity event
- derived care coordination state
- focused domain tests

## Out of Scope

- backend
- authentication
- production persistence
- Supabase
- AI
- notifications
- medication-specific workflows
- health tracking
- granular permissions
- invitation system

## Definition of Done

- mobile app initialized
- loved one can be added
- care task can be added
- overdue/today attention can appear on Home
- task can be completed
- completion creates recent activity
- derived state updates
- multiple recipient contexts remain separated
- focused domain tests exist
- CareCircle implementation evidence documented
- no backend initialized

## CareCircle Evidence

- Value added:
  - CareCircle provides a minimal internal membership boundary for determining which recipients the prototype user can see.
  - It gives Home a way to project only authorized recipient contexts without exposing CareCircle as UI language.
- Indirection added:
  - Home must resolve Membership to CareCircle to CareRecipient before showing recipient-focused data.
  - Tasks and events are simpler when attached directly to CareRecipient, so adding careCircleId to them was unnecessary for this slice.
  - Recipient-focused routes did not need CareCircle identifiers.
- Whether direct Membership-to-CareRecipient appears simpler:
  - Yes, for this slice direct Membership-to-CareRecipient appears simpler because CareCircle only mediates authorization context and does not yet own independent behavior.
- Current recommendation:
  - insufficient evidence
  - Keep CareCircle provisional until Sprint 2 review decides whether the membership boundary is enough value to retain.

## Architecture Questions Exposed by Implementation

- Does CareCircle provide meaningful value beyond direct Membership-to-CareRecipient?
- Are CareTask and CareEvent still useful abstractions after real UI usage?
- What persistence requirements emerged?
- Is the repository boundary helping or adding ceremony?
- What should remain in-memory-only versus become durable first?
