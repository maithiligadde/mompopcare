# MomPopCare Domain Model

## Status

Working Draft — Sprint 1

## Purpose

- Establish a shared working domain vocabulary before database, API, or UI implementation.
- Clarify collaboration boundaries, access boundaries, and the distinction between source concepts and derived experiences.
- Capture working invariants and unresolved questions without turning them into premature technical decisions.

## Domain Principles

- Reduce caregiver cognitive load.
- Trust over cleverness.
- Unknown must remain unknown; the system must not fabricate certainty.
- The care recipient is a person with privacy, autonomy, and dignity.
- Participation may be broad when useful; sensitive access must remain narrow and intentional.
- AI may assist with extraction, organization, summarization, explanation, and preparation.
- AI must not diagnose, prescribe, or replace clinicians.
- Care coordination and health status are different concepts.

## Core Concepts

### User

- Definition: A person with an app account who can participate in one or more Care Circles.
- Responsibility: Act within authorized circles, coordinate care work, and view user-scoped experiences such as Home.
- What it is not: Not automatically a Care Recipient; not automatically entitled to all care data for every circle they participate in.
- Important relationships:
  - May belong to multiple Care Circles through CircleMembership.
  - May optionally link to a CareRecipient.
  - May receive access through membership and/or explicit grants, subject to unresolved policy details.
- Unresolved questions:
  - How much access should derive from membership versus explicit sharing?
  - How should linked-recipient and caregiver contexts interact in the same account?

### CareRecipient

- Definition: The person whose care is being coordinated within a Care Circle.
- Responsibility: Anchor the circle, the care context, and the interpretation of tasks, events, and records.
- What it is not: Not required to have an app account; not merely a managed object or passive record container.
- Important relationships:
  - Exactly one Care Circle centers on one CareRecipient.
  - May optionally link to a User if the recipient later becomes an active app participant.
  - Is the reference point for care tasks, care events, care records, and access decisions.
- Unresolved questions:
  - How should recipient participation change access behavior once linked to a User?
  - How should recipient preferences and dignity be represented without overcommitting to a permission model?

### CareCircle

- Definition: The collaboration and isolation boundary around exactly one CareRecipient.
- Responsibility: Separate one recipient’s coordination context, participation, and sensitive data from another’s.
- What it is not: Not a cross-family dashboard section; not a shared bucket that implies access to other circles.
- Important relationships:
  - Centers on exactly one CareRecipient.
  - Has many CircleMemberships.
  - Contains the working care context for tasks, events, records, and access decisions.
- Unresolved questions:
  - Which capabilities belong to circle-level participation by default versus explicit access grants?
  - What minimum structure is needed for safe collaboration without a full RBAC matrix?

### CircleMembership

- Definition: A User’s participation relationship to a CareCircle.
- Responsibility: Represent that a user is involved in a specific circle and is subject to that circle’s access boundary.
- What it is not: Not automatic standing access to the full private care record; not transferable authority across circles.
- Important relationships:
  - Connects a User to one CareCircle.
  - Supports the working distinction between Core Care Team and Support Network participation.
  - Constrains invitation authority so no member can grant more authority than they possess.
- Unresolved questions:
  - Do support participants always require circle membership, or can some task-specific involvement happen without it?
  - What is the minimum working role structure before a final permission system is defined?

### CareTask

- Definition: Something that should happen for a CareRecipient.
- Responsibility: Represent pending or expected care work that supports coordination and follow-through.
- What it is not: Not evidence that something already happened; not the same as a CareEvent.
- Important relationships:
  - Exists within the context of one CareCircle and its CareRecipient.
  - May be relevant to Home, Recipient Brief, and Caregiver Brief as a source concept.
  - May involve participants whose operational involvement does not imply full sensitive-data access.
- Unresolved questions:
  - How should task assignment interact with support-only participation?
  - What level of task context is necessary without overexposing sensitive care information?

### CareEvent

- Definition: Something that happened in relation to the CareRecipient’s care.
- Responsibility: Represent completed or observed care activity that contributes to shared understanding.
- What it is not: Not a future obligation; not the same as a CareTask; not the timeline itself.
- Important relationships:
  - Exists within the context of one CareCircle and its CareRecipient.
  - Serves as an input to derived experiences such as Timeline and briefs.
  - May be related to care records and tasks without collapsing them into a single concept.
- Unresolved questions:
  - What level of event detail should be broadly shareable versus narrowly restricted?
  - How should uncertainty or incomplete event knowledge be represented without overstating certainty?

### CareRecord

- Definition: A working concept for sensitive care information that may need structured or intentional access handling.
- Responsibility: Hold the place in the model for care information that should not be equated with general participation.
- What it is not: Not finalized as a specific storage model; not merely document storage; not yet proven to be the right abstraction.
- Important relationships:
  - Associated with a CareRecipient and CareCircle context.
  - Relevant to access distinctions between Core Care Team and Support Network.
  - May be referenced by events or tasks without making those concepts identical.
- Unresolved questions:
  - Is CareRecord a useful domain abstraction or too generic to guide implementation well?
  - Which information truly belongs in this concept versus adjacent concepts?

### AccessGrant

- Definition: A working concept for explicitly bounded access that is narrower or more intentional than broad participation.
- Responsibility: Express that participation and sensitive-data access are different concepts.
- What it is not: Not a finalized permissions engine; not proof that role-derived access is unnecessary.
- Important relationships:
  - Applies within a CareCircle boundary.
  - May complement CircleMembership where explicit sharing is needed.
  - Helps model support participation that should not imply browsing the full private care timeline or record.
- Unresolved questions:
  - How much access should be role-derived versus grant-based?
  - What grant shapes are needed without creating a complex granular permission matrix too early?

## Core Relationships

```text
User
  |
  +-- CircleMembership --> CareCircle --> exactly one CareRecipient
  |
  +-- optional link ------------------> CareRecipient
```

- A User may have memberships in multiple Care Circles.
- Each Care Circle remains isolated from every other Care Circle.
- The optional User-to-CareRecipient link does not collapse the two concepts into one.

## Participation vs Access

- Participation answers who is involved in helping with care coordination.
- Access answers who may view or act on sensitive care information.
- Core Care Team refers to people actively coordinating ongoing care.
- Support Network refers to people who may help with selected actions or receive explicitly shared information.
- Support participation may include taking the recipient to an appointment, picking up a prescription, receiving a shared update, or helping with an assigned task.
- Support participation must not automatically allow broad browsing of reports, full medication history, diagnoses, complete observations, or the full private care timeline.
- The current role labels are working concepts, not finalized names or a final permission model.

## Care Circle Isolation

- A Care Circle is the collaboration and isolation boundary around one CareRecipient.
- Membership in one Care Circle grants no access to another.
- A multi-recipient caregiver may participate in several circles, but authorization remains separate in each one.
- Home may aggregate attention across authorized circles for a user, but the underlying circle boundaries remain intact.

## Home Projection

- Home is a user-scoped, attention-based projection across only the Care Circles the authenticated user is authorized to access.
- Home is not one dashboard section per Care Circle.
- Home should prioritize:
  - needs attention
  - actions assigned to the user
  - time-sensitive upcoming items
  - unknown or stale care information
- Home should suppress routine noise where possible.
- Home is a derived experience, not a merged data boundary and not a new source-of-truth entity.

## Source Concepts vs Derived Experiences

- Working source concepts currently under consideration include:
  - User
  - CareRecipient
  - CareCircle
  - CircleMembership
  - CareTask
  - CareEvent
  - CareRecord
  - AccessGrant
- Derived experiences currently include:
  - Timeline
  - Recipient Brief
  - Caregiver Brief
  - Home attention view
- Timeline is currently considered a derived view over events, not a source-of-truth entity.
- Recipient Brief is currently considered a derived experience focused on one CareRecipient.
- Caregiver Brief is currently considered a derived experience focused on one User across authorized circles.
- Daily Brief is currently considered a derived experience or projection, not a source-of-truth entity.
- Care State is a key product abstraction, but its exact persistence or derivation strategy remains unresolved.
- It is intentionally not yet decided whether Care State is stored, computed, materialized, or event-sourced.

## Invariants

- One Care Circle centers on exactly one Care Recipient.
- A User may belong to multiple Care Circles.
- Membership in one Care Circle grants no access to another.
- CareRecipient and User are separate concepts.
- A CareRecipient may optionally link to a User.
- Participation does not automatically imply access to sensitive care data.
- Support participation does not automatically grant full care-record visibility.
- No member may grant authority exceeding their own.
- Unknown care information must remain unknown.

## Scenario Validation

### Scenario 1: Family-coordinated care

- Participants:
  - Adult children coordinate care.
  - The CareRecipient may not use the app initially.
  - Extended family may help with selected actions.
- Circle boundaries:
  - One Care Circle centers on the recipient.
  - Adult children may belong to the Core Care Team for that circle.
  - Extended family involvement does not imply broad access beyond that circle or within it.
- Access implications:
  - The recipient may exist without a linked User.
  - Support participants may help with assigned work or shared updates without full care-record visibility.
  - Sensitive care access remains intentionally narrower than general participation.
- Unresolved questions:
  - Do extended family helpers require full circle membership or only task-specific involvement?
  - What minimum information is needed for helpers to act effectively without oversharing?

### Scenario 2: Independent active parent

- Participants:
  - The CareRecipient actively uses the app.
  - Family members may also participate in coordination.
- Circle boundaries:
  - One Care Circle still centers on the recipient.
  - The recipient may optionally link to a User without recreating the care profile or moving to a new circle.
- Access implications:
  - The recipient can understand who participates.
  - The recipient can participate in access decisions.
  - Family members may still coordinate operational work without assuming the recipient controls everything or that caregivers control everything.
- Unresolved questions:
  - How should recipient participation interact with existing caregiver authority in difficult edge cases?
  - What should happen when recipient preferences and caregiver expectations conflict?

### Scenario 3: One caregiver across multiple recipients

- Participants:
  - One User belongs to Mom’s Care Circle, Dad’s Care Circle, and Grandmother’s Care Circle.
- Circle boundaries:
  - Each recipient has a separate Care Circle.
  - Membership in one circle does not grant access to the other two.
- Access implications:
  - The caregiver’s authorization is evaluated separately in each circle.
  - Home provides attention-based aggregation only across the circles the caregiver is authorized to access.
  - Home does not collapse the underlying data boundaries between recipients.
- Unresolved questions:
  - How should stale or unknown information be surfaced fairly across multiple circles without creating noise?
  - What cross-circle summaries are useful without implying shared access where none exists?

## Open Questions

- What should the final role names be?
- What is the exact permission model?
- How should AccessGrant interact with role-derived access?
- Is CareRecord a useful abstraction or too generic?
- What is the right persistence or derivation strategy for Care State?
- What invitation and revocation edge cases must be supported first?
- How should recipient control work when a CareRecipient is linked to a User?
- Is there any emergency access concept in scope later, and if so, how bounded should it be?
- Who owns export and deletion decisions for shared care data?
- Do support participants require circle membership, or can some involvement be task-specific?
- What exactly counts as stale or unknown care information?
