# Roadmap architecture decisions

This index records the preflight decisions for the Astryx gap-analysis
roadmap. The repository owner delegated implementation decision authority on
2026-07-25. All roadmap architecture gates are accepted; their automated
evidence and consolidated delivery reviews remain mandatory.

| Decision area                                                            | Record                                          | Status   | Gate      |
| ------------------------------------------------------------------------ | ----------------------------------------------- | -------- | --------- |
| Artifact and capability contracts                                        | [ADR 000](adr-000-unified-artifact-registry.md) | Accepted | P0-A      |
| Tooling package, release, Node/OS, validation runtime and runtime assets | [ADR 001](adr-001-tooling-package.md)           | Accepted | P-01      |
| Root identity, mutation, recovery and durability                         | [ADR 002](adr-002-safe-project-operations.md)   | Accepted | P0-B      |
| Historical docs, public origin, hosted MCP and metrics                   | [ADR 003](adr-003-hosting-and-metrics.md)       | Accepted | P-03/P1-B |
| Figma privacy, extension trust and cross-platform conformance            | [ADR 004](adr-004-integrations-and-trust.md)    | Accepted | P3        |

Credentials and external resource identifiers remain environment inputs.
Their absence is reported explicitly and never replaced with fabricated
evidence.
