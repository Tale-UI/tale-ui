# ADR 002: Root-confined project operations and recovery

- Status: Proposed
- Gate: P0-B operations
- Required reviewers: Security and Release Engineering

## Proposed decision

Every mutation resolves a canonical project root, refuses traversal and
escaping symlinks, compares before write, stages on the same filesystem, and
verifies committed postimages.

Idempotency uses a privacy-safe key digest separate from the payload digest.
Each operation has one immutable journal and the state machine defined by
`schemas/operation.schema.json`. Recovery has its own identity and permits
exactly one of resume or rollback for a matching pre-recovery digest.

Storage location, directory permissions, lock implementation, retention,
durability fallback, and manual-intervention procedures remain undecided. No
mutating CLI/API implementation may ship before those choices and crash
fixtures are approved.
