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
- CareCircle simplification evidence documented
- no backend initialized

## Access Scoping Note

- Recipient access checks in this slice are frontend prototype scoping only.
- Real authorization belongs to future backend enforcement.

## CareCircle Evidence

- Value added:
  - No independent responsibility was proven in this slice.
- Indirection added:
  - Home had to resolve Membership to CareCircle to CareRecipient before showing recipient-focused data.
  - Tasks and events are simpler when attached directly to CareRecipient, so adding careCircleId to them was unnecessary for this slice.
  - Recipient-focused routes did not need CareCircle identifiers.
- Whether direct Membership-to-CareRecipient appears simpler:
  - Yes. Direct Membership-to-CareRecipient is simpler for this slice.
- Current recommendation:
  - simplify toward direct recipient membership for the current MVP model
  - Defer CareCircle until future evidence shows a need for an independent collaboration context.

## Architecture Questions Exposed by Implementation

- Does CareCircle provide meaningful value beyond direct Membership-to-CareRecipient?
- Are CareTask and CareEvent still useful abstractions after real UI usage?
- What persistence requirements emerged?
- Is the repository boundary helping or adding ceremony?
- What should remain in-memory-only versus become durable first?
