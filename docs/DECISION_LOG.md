# Decision Log

This document records project-wide product and domain decisions for MomPopCare across sprints.

## Entry 001

- Decision: MomPopCare is a family care coordination platform, not a health tracker.
- Status: Accepted
- Date: 2026-07-07
- Context: The repository foundation needs a clear product boundary before architecture or implementation begins.
- Decision: Position the product around care coordination rather than generic health tracking.
- Consequences: Product scope, language, and future decisions should reinforce coordination, shared context, and caregiving clarity.

## Entry 002

- Decision: Core value is caregiver confidence.
- Status: Accepted
- Date: 2026-07-07
- Context: The product needs a simple value anchor that guides prioritization and messaging.
- Decision: Define caregiver confidence as the primary value outcome.
- Consequences: Features and workflows should reduce confusion, uncertainty, and mental overhead for families.

## Entry 003

- Decision: AI assists with organization, extraction, summarization, and explanation; it does not diagnose or prescribe.
- Status: Accepted
- Date: 2026-07-07
- Context: The platform may use AI, but the role of AI must be tightly bounded from the beginning.
- Decision: Limit AI responsibilities to supportive coordination functions and exclude diagnosis or prescribing behavior.
- Consequences: Product language, system design, and trust boundaries must clearly prevent clinical overreach.

## Entry 004

- Decision: Care State is the core product abstraction.
- Status: Accepted
- Date: 2026-07-07
- Context: The product needs a central organizing concept for understanding what is complete, pending, and in need of attention.
- Decision: Use Care State as the core abstraction for the product foundation.
- Consequences: Domain modeling, information architecture, and future workflows should be evaluated against this abstraction.

## Entry 005

- Decision: One Care Circle centers on exactly one Care Recipient.
- Status: Working
- Date: 2026-07-08
- Context: Sprint 1 domain discovery needs a clear collaboration boundary around a single recipient.
- Decision: Treat one Care Circle as centered on exactly one Care Recipient.
- Consequences: Circle boundaries stay recipient-specific and should not merge multiple recipients into one operational context.

## Entry 006

- Decision: A User may belong to multiple Care Circles.
- Status: Working
- Date: 2026-07-08
- Context: Caregivers may coordinate care for more than one loved one.
- Decision: Allow one User to participate in multiple Care Circles while keeping each circle isolated.
- Consequences: User-scoped experiences may span multiple authorized circles, but authorization must remain separate per circle.

## Entry 007

- Decision: Home is a user-scoped attention projection across authorized circles.
- Status: Working
- Date: 2026-07-08
- Context: Multi-circle caregivers need a useful cross-circle view without collapsing underlying privacy boundaries.
- Decision: Treat Home as an attention-based projection across only the Care Circles the authenticated user is authorized to access.
- Consequences: Home should highlight attention, assignments, time sensitivity, and actionable unknown or stale information when freshness was expected, without becoming a merged source-of-truth boundary.

## Entry 008

- Decision: User and CareRecipient are separate concepts.
- Status: Working
- Date: 2026-07-08
- Context: A care recipient may not use the app at first and may later become an active participant.
- Decision: Keep CareRecipient and User conceptually separate, with an optional link between them.
- Consequences: A recipient can later become an active User without recreating the care profile or migrating to a new Care Circle.

## Entry 009

- Decision: Participation does not imply standing sensitive-data access.
- Status: Working
- Date: 2026-07-08
- Context: People may help with care coordination without needing broad visibility into private care information.
- Decision: Separate involvement in care work from standing access to sensitive care data.
- Consequences: Future domain and access decisions must support collaboration without assuming universal browsing rights.

## Entry 010

- Decision: Core Care Team and Support Network are distinct concepts.
- Status: Working
- Date: 2026-07-08
- Context: The product needs to distinguish ongoing coordinators from selectively involved helpers.
- Decision: Model a conceptual distinction between Core Care Team and Support Network without finalizing role names or a full permission matrix.
- Consequences: Support participation can stay operationally useful without automatically opening access to the full private care history.

## Entry 011

- Decision: Invitation authority is bounded.
- Status: Working
- Date: 2026-07-08
- Context: The product should avoid a single-admin bottleneck without allowing uncontrolled privilege escalation.
- Decision: Require delegation to be explicitly authorized and to avoid unintended privilege escalation, without assuming that access authority and delegation authority are always the same thing.
- Consequences: The future access model must distinguish access from delegation and support bounded circle growth without casual escalation to maximum privilege.

## Entry 012

- Decision: Timeline and Daily Brief are derived experiences.
- Status: Working
- Date: 2026-07-08
- Context: Sprint 1 needs to separate source concepts from user-facing projections.
- Decision: Treat Timeline and Daily Brief as derived experiences rather than source-of-truth entities.
- Consequences: Future implementation should derive these experiences from underlying care concepts rather than elevating them to primary domain records prematurely.

## Entry 013

- Decision: Care State persistence strategy remains unresolved.
- Status: Working
- Date: 2026-07-08
- Context: Care State is important to the product, but its storage and derivation model has not been validated yet.
- Decision: Keep the persistence strategy for Care State explicitly unresolved during Sprint 1.
- Consequences: The team should avoid premature commitments to stored, computed, materialized, or event-sourced approaches before deeper architecture work.
