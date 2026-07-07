# Decision Log

This document records key Sprint 0 product decisions for MomPopCare.

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
