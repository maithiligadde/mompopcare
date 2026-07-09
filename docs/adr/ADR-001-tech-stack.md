# ADR-001: Tech Stack

This document tracks the Sprint 0 architectural discussion and its current interpretation through Sprint 2.

## Status

Draft

## Context

- Sprint 0 established the repository foundation before application code.
- Sprint 2 uses Expo, React Native, and TypeScript for the current mobile prototype.
- The prototype uses an in-memory repository and does not include backend services, production persistence, or production authentication.
- Technology choices should follow product, domain, and architecture clarity.

## Options

- Long-term product stack: Undecided
- Current mobile prototype: Expo, React Native, and TypeScript
- Backend stack: Undecided

## Decision

- Expo, React Native, and TypeScript are implemented for the Sprint 2 mobile prototype.
- This prototype implementation does not finalize the long-term product stack or select a backend stack.

## Consequences

- Mobile prototype initialization is no longer deferred.
- Backend implementation and backend technology selection remain deferred.
- The current mobile choices do not imply production readiness or a final long-term stack decision.
- Future ADRs should refine the stack once domain model and architecture constraints are clearer.
