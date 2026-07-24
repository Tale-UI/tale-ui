# ADR 000: Unified artifact registry

- Status: Accepted
- Date: 2026-07-24
- Owners: Design Systems and Developer Experience

## Context

Components, recipes, A2UI types, pitfalls, hooks, and foundation guidance are
currently discoverable through separate generated or source artifacts.
Consumers need stable mixed-kind identifiers without duplicating those
canonical payloads.

## Decision

Generate `registry/artifacts.json` and `registry/capabilities.json` from
explicit first-party sources. Artifact IDs use
`<namespace>:<kind>:<slug>`. Existing registries remain canonical for their
payloads; unified records contain retrieval pointers.

Canonical output omits wall-clock metadata, sorts records and set-like values,
uses content-derived source revisions, and includes a digest computed from the
canonical preimage. The initial release channel is `internal`.

## Consequences

CI validates source-set equality, schemas, relations, unique IDs, capability
references, and byte-identical regeneration. Promotion beyond `internal`
requires the package/runtime and governance gates.
