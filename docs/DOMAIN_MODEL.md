# MomPopCare Domain Model

## Status

Working Draft — Sprint 1

## Purpose

- Define the minimal working domain vocabulary for MomPopCare before database, API, or UI implementation.
- Keep the model focused on the core caregiving coordination loop.
- Preserve essential product and privacy invariants while deferring premature authorization and collaboration complexity.

## Product Boundary

- MomPopCare is a family care coordination platform.
- It helps families understand what has been done, what is pending, what needs attention, and what is unknown.
- It is not a health tracker.
- It is not an AI doctor.
- It is not a diagnosis app.
- It is not merely document storage.
- The system must not claim medical health or safety based on incomplete data.

## Core Concepts

### User

- Definition: An account holder.
- Responsibility: Participate in authorized care coordination and receive user-scoped experiences such as Home.
- What it is not: Not automatically a CareRecipient and not automatically entitled to every circle’s information.
- Important relationships:
  - May belong to multiple CareCircles through Membership.
  - May optionally link to a CareRecipient.
- Unresolved questions:
  - What is the final membership model?
  - How should an account behave when one person is both caregiver and linked recipient?

### CareRecipient

- Definition: The loved one receiving care.
- Responsibility: Anchor the care context that tasks, events, and state are about.
- What it is not: Not required to have an app account and not equivalent to a User.
- Important relationships:
  - Is centered by a CareCircle.
  - May optionally link to a User later.
- Unresolved questions:
  - May one CareRecipient be associated with more than one CareCircle, or is the intended relationship one-to-one?
  - How should recipient authority work once linked to a User?

### CareCircle

- Definition: A working internal collaboration and isolation boundary around exactly one CareRecipient.
- Responsibility: Keep one recipient-centered care context separate from another.
- What it is not: Not necessarily a prominent user-facing concept and not a merged family workspace across recipients.
- Important relationships:
  - Centers on exactly one CareRecipient.
  - Has Membership connections to Users.
  - Contains CareTasks, CareEvents, and CareState for that recipient context.
- Unresolved questions:
  - Is CareCircle the final internal term?
  - Is CareCircle user-facing or purely internal?
  - Does CareCircle provide unique domain value as a collaboration/isolation boundary?
  - Could Membership attach directly to CareRecipient without losing an important concept?
  - May one CareRecipient be associated with more than one CareCircle, or is the intended relationship one-to-one?
- Note: CareCircle must justify its existence through implementation evidence. It should not survive merely because it is already documented.

### Membership

- Definition: Connects a User to a CareCircle.
- Responsibility: Represent that a User belongs to a specific recipient-centered care context.
- What it is not: Not a full role hierarchy and not a granular permission matrix.
- Important relationships:
  - Connects a User to one CareCircle.
  - Enables a User to belong to multiple CareCircles while keeping each circle isolated.
- Unresolved questions:
  - What is the final membership model?
  - What invitation and revocation rules should apply before production authorization implementation?

### CareTask

- Definition: Something that should happen.
- Responsibility: Represent pending or expected care coordination work.
- What it is not: Not proof that something already happened and not the same as a CareEvent.
- Important relationships:
  - Exists within a CareCircle.
  - Contributes to understanding what is pending and what needs attention.
- Unresolved questions:
  - What is the minimum task context needed to support coordination well?
  - How should tasks relate to actionable stale or unknown information?

### CareEvent

- Definition: Something that happened.
- Responsibility: Represent completed or observed care activity.
- What it is not: Not a future obligation and not the same as a CareTask.
- Important relationships:
  - Exists within a CareCircle.
  - Contributes to understanding what has been done.
  - Can inform Timeline and related derived experiences.
- Unresolved questions:
  - What level of event detail is necessary for coordination?
  - How should incomplete or uncertain event knowledge be reflected without creating false certainty?

### CareState

- Definition: A key product abstraction representing the current coordination state of care.
- Responsibility: Help answer what is complete, what is pending, what needs attention, and what is unknown.
- What it is not: Not a finalized storage strategy and not yet a finalized implementation model.
- Important relationships:
  - Exists within a CareCircle context.
  - Is informed by underlying care activity such as tasks and events.
  - Supports derived experiences such as Home and briefs.
- Unresolved questions:
  - Should CareState be stored, computed, materialized, or event-sourced?
  - What is the exact meaning of actionable stale or unknown information?

## Core Relationships

```text
User
  |
  +-- Membership --> CareCircle --> exactly one CareRecipient
  |
  +-- optional link -----------> CareRecipient

CareCircle
  |
  +-- CareTask
  +-- CareEvent
  +-- CareState
```

- A User may belong to multiple CareCircles.

## Core Invariants

- One CareCircle centers on exactly one CareRecipient.
- A User may belong to multiple CareCircles.
- Membership in one CareCircle grants no access to another.
- CareRecipient and User are separate concepts.
- A CareRecipient may optionally link to a User.
- Home may aggregate attention across only the circles the authenticated User is authorized to access.
- Unknown care information must remain unknown.
- The system must not claim medical health or safety based on incomplete data.

## Home Projection

- Home is user-scoped.
- Home may aggregate attention across authorized circles.
- Home is not a merged data boundary.
- Revoked access must remove that circle from future Home projections.
- Home should prioritize:
  - actionable items needing attention
  - actions assigned to the user
  - time-sensitive upcoming items
  - actionable stale or unknown information where freshness was expected and the gap matters to care coordination
- Home should suppress routine noise where possible.

## Source Concepts vs Derived Experiences

- Working source/domain concepts:
  - CareTask
  - CareEvent
- Key product abstraction:
  - CareState, with persistence unresolved
- Derived experiences:
  - Timeline
  - Recipient Brief
  - Caregiver Brief
  - Home attention view
  - Daily Brief

## Deferred / Unresolved Abstractions

- CareRecord
- It is currently too generic.
- No implementation should depend on it yet.
- More specific concepts may emerge later.

## Deferred / Unresolved Access Concepts

- AccessGrant
- granular permissions
- role hierarchy
- invitation/delegation rules
- emergency access
- Participation and access are still distinct concerns.
- The exact authorization mechanism is unresolved.
- Do not assume explicit grants, RBAC, capabilities, ACLs, or another mechanism yet.
- Trusted members may be able to invite another trusted member.
- Exact invitation authority and revocation rules remain unresolved and must be designed before production authorization implementation.

## Deferred Collaboration Concepts

- Support Network
- task-specific external participation
- selective sharing to extended family
- Some people may help without needing full care-record access.
- This is a valid future problem.
- It is intentionally deferred from the V1 domain model.

## Scenario Validation

### 1. Family-coordinated care

- Participants:
  - adult children
  - CareRecipient who may not use the app initially
- Circle boundaries:
  - one CareCircle centers on the recipient
  - participating Users belong to that circle only
- What the simplified model supports:
  - multiple trusted family caregivers in one recipient-centered context
  - tasks, events, and care state for coordination
  - a recipient profile that exists before any recipient app account
- Unresolved questions:
  - whether selective sharing to extended family belongs in V1 or later
  - what invitation and revocation rules are required before production authorization

### 2. Independent active parent

- Participants:
  - active CareRecipient who uses the app
  - family caregivers who also participate
- Circle boundaries:
  - one CareCircle still centers on the recipient
  - the recipient may optionally link to a User without recreating the care context
- What the simplified model supports:
  - recipient participation conceptually
  - continued caregiver coordination around the same recipient
  - separation between CareRecipient and User while still allowing an optional link
- Unresolved questions:
  - exact recipient authority when linked to a User
  - final control and authorization model

### 3. One caregiver across multiple recipients

- Participants:
  - one User coordinating care for Mom, Dad, and Grandmother
- Circle boundaries:
  - each recipient has a separate CareCircle
  - membership in one circle does not grant access to another
- What the simplified model supports:
  - one User belonging to multiple CareCircles
  - Home aggregating attention only across authorized circles
  - removal of revoked circles from future Home projections
- Unresolved questions:
  - how to define actionable stale or unknown information across multiple circles
  - how authorization revocation should be implemented before production

## Open Questions

- final naming: CareCircle vs another internal term
- whether CareCircle is user-facing
- whether one CareRecipient may have multiple CareCircles
- final membership model
- final authorization model
- invitation/revocation rules
- recipient authority when linked to User
- CareState persistence strategy
- exact meaning of actionable stale/unknown information
- whether support participation belongs in V1 or later
