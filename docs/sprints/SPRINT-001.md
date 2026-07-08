# Sprint 1 — Domain Discovery

## Goal

Create and validate the first explicit domain model for MomPopCare before database, API, or UI implementation.

## Sprint Outcomes

- minimal working domain vocabulary
- core relationships
- essential invariants
- three scenarios tested
- deferred complexity explicitly documented
- explicit open questions
- no premature authorization architecture
- no database schema

## In Scope

- domain modeling
- care-circle boundary
- user vs care-recipient distinction
- participation vs access
- multi-circle caregiver experience
- scenario validation

## Out of Scope

- UI implementation
- backend implementation
- database schema
- Supabase setup
- authentication implementation
- full RBAC
- legal guardianship
- AI implementation
- notifications implementation

## Definition of Done

- DOMAIN_MODEL.md exists
- minimal working domain vocabulary
- essential invariants
- three scenarios are tested
- deferred complexity explicitly documented
- CareCircle remains provisional
- implementation questions are carried into Sprint 2
- no premature authorization architecture
- no database schema
- no unresolved assumption is disguised as a final decision

## Key Learning — Simplicity Before Authorization Complexity

- Sprint 1 initially drifted toward premature collaboration and authorization complexity.
- The team intentionally simplified the model.
- Sophisticated access management is not the core product problem.
- The core product problem remains helping caregivers understand what has been done, what is pending, what needs attention, and what is unknown.
- Complexity should be introduced only when product evidence or safety requirements justify it.

## CareCircle Working Decision

- CareCircle remains a working internal recipient-centered boundary.
- CareCircle is not assumed to be user-facing.
- CareCircle necessity is not proven.
- Direct Membership-to-CareRecipient remains a viable simpler alternative.
- Sprint 2 vertical-slice implementation will test whether CareCircle provides unique domain value.

## Sprint Review Checklist

- product alignment
- privacy boundary
- cognitive-load impact
- scalability to multiple recipients
- recipient dignity/autonomy
- implementation readiness
- legacy reuse opportunities
