# Roadmap architecture decisions

This index records the preflight decisions for the Astryx gap-analysis
roadmap. A decision marked **Proposed** is a hard implementation gate: its
dependent public runtime, data plane, or externally visible API must not ship
until the named review roles approve it.

| Decision area                                                            | Record                                          | Status   | Gate      |
| ------------------------------------------------------------------------ | ----------------------------------------------- | -------- | --------- |
| Artifact and capability contracts                                        | [ADR 000](adr-000-unified-artifact-registry.md) | Accepted | P0-A      |
| Tooling package, release, Node/OS, validation runtime and runtime assets | [ADR 001](adr-001-tooling-package.md)           | Accepted | P-01      |
| Root identity, mutation, recovery and durability                         | [ADR 002](adr-002-safe-project-operations.md)   | Proposed | P0-B      |
| Historical docs, public origin, hosted MCP and metrics                   | [ADR 003](adr-003-hosting-and-metrics.md)       | Proposed | P-03/P1-B |
| Figma privacy, extension trust and cross-platform conformance            | [ADR 004](adr-004-integrations-and-trust.md)    | Proposed | P3        |

The records intentionally do not invent vendors, credentials, historical
sources, evidence thresholds, retention periods, or performance limits.
