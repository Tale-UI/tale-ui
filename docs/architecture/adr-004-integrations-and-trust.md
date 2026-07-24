# ADR 004: Figma, extensions, and platform conformance

- Status: Accepted
- Date: 2026-07-25
- Approved by: Repository owner through delegated implementation authority
- Gate: P3
- Review disciplines: Privacy, Security, Governance, and Platform

## Decision

Tale token JSON and the public artifact registry remain the sources of truth.
The Figma integration generates Variables-compatible token interchange,
component/variant mappings, and Code Connect records from those sources. The
initial remote-file allowlist is empty because the repository contains no
approved Figma file identifier; generated contracts and fixture parity are
still required. Adding a file requires a repository-owned allowlist change,
not an implementation redesign.

When an allowlisted file exists, CI uses a read-only Figma access token from
an environment secret. Raw API responses live only in job memory and are
discarded after normalization. Internal reports may contain allowlisted file
and node IDs and are retained as access-controlled workflow artifacts for 30
days. Public reports contain registry IDs, public component/token names,
aggregate counts, and non-reversible mismatch categories only. They never
contain file keys, node IDs, URLs, screenshots, free text, private names,
credentials, or private token values.

Figma writes, library publication, and mutation of design files are outside
this roadmap and continue to require explicit user authorization.

Extension discovery is schema-only and never executes code. Every extension
is namespaced by npm package name and publisher and carries a package version,
contract range, contribution manifest digest, and npm-compatible SHA-512
tarball integrity. Declarative public artifacts may be read after schema and
integrity validation.

Executable validators, codemods, and render adapters additionally require:

- normal local package installation;
- compatible Tale and contribution contract ranges;
- npm provenance verification when the package declares provenance;
- a non-revoked publisher in the first-party trust registry;
- explicit project-local approval scoped to package, publisher, version,
  integrity, and requested capabilities; and
- the normal timeout, confinement, operation, recovery, and audit controls.

Trust is deny-by-default and is never global or inferred from installation.
The signed Tale release artifact distributes publisher trust and revocation
records. Revocation is checked before every executable load; cached data older
than seven days warns, and older than 30 days fails closed. Hosted runtimes do
not execute extensions.

Cross-platform work is limited to deterministic light/dark token parity,
high-contrast guidance, React Native examples, and documented exceptions. The
`@tale-ui/tokens` maintainers own platform exceptions. Every exception names
the unsupported platform behavior, fallback, evidence, owner, review date,
and a maximum 180-day expiry. This work does not create a native component
library.

## Consequences

- Figma contract generation, extension support, and native conformance may
  proceed without another architecture approval.
- The absence of a current Figma file is represented honestly by an empty
  allowlist and `unavailable` live-parity observation, never by fabricated
  remote evidence.
- Custom signature infrastructure is not introduced; npm integrity,
  provenance, repository trust, and revocation are the approved chain.
