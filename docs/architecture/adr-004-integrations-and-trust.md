# ADR 004: Figma, extensions, and platform conformance

- Status: Proposed
- Gate: P3
- Required reviewers: Privacy, Security, Governance, Platform

## Proposed decision

Figma records are classified before normalization or caching. Only approved
public fields and non-reversible aggregates may enter public artifacts.
Internal and private caches are isolated, and writes require separate
approval.

Extension discovery is schema-only and never executes code. Executable
validators, codemods, and render adapters require local installation,
compatible contracts, integrity verification, explicit permissions, and a
trusted non-revoked publisher.

Cross-platform work is limited to deterministic token parity, guidance,
examples, and approved exceptions. It does not create a native component
library.

Authentication, approved Figma files, disclosure thresholds, signature format,
revocation distribution, retention, and platform exception owners remain
undecided.
