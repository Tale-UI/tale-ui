# ADR 002: Root-confined project operations and recovery

- Status: Accepted
- Date: 2026-07-25
- Approved by: Repository owner through delegated implementation authority
- Gate: P0-B operations
- Review disciplines: Security and Release Engineering

## Decision

Every mutation resolves the canonical real path of the project root, refuses
traversal and escaping symlinks, compares before write, stages on the same
filesystem, atomically replaces files, and verifies committed postimages.
Device and inode identity are included when the host exposes them; the
cross-platform root digest remains authoritative.

Operation state lives under `<project>/.tale/operations/`. The directory is
created with mode `0700` and state files with mode `0600` on POSIX. Windows
inherits the project ACL and still rejects a path that resolves outside the
canonical root. Generated setup guidance ignores transient operation state
without ignoring durable Tale configuration.

There is one root-wide writer lock, acquired by atomically creating
`.tale/operations/.lock/`. Its record contains only the operation ID, root
digest, process/host correlation, and start time. A process never breaks a
lock based only on age or PID reuse. An interrupted or stale lock blocks new
mutation until `doctor` classifies it and an explicit `resume` or `rollback`
recovery reaches a terminal state.

Idempotency uses a privacy-safe key digest separate from the payload digest.
Each operation has one immutable journal and the state machine defined by
`schemas/operation.schema.json`. Recovery has its own identity and permits
exactly one of resume or rollback for a matching pre-recovery digest.

Writes use a temporary file in the destination directory, file flush, atomic
rename, and postimage verification. Directory flush is used where the
platform supports it; lack of directory-flush support is recorded as
`best-effort-directory-fsync` and does not weaken the required atomic rename
or postimage check. A failure before verification remains recoverable and
never reports success.

Completed and rolled-back journals and backups are retained for 30 days.
Privacy-safe tombstones containing only operation, root, idempotency, payload,
and terminal-result digests are retained for 180 days. `manual-intervention`
records are never automatically deleted. Cleanup is itself root-confined,
locked, reported, and unable to remove the active or latest non-terminal
operation.

`doctor` is read-only. It reports the exact blocked operation, verified
postimages, recoverable action, and evidence-export path. There is no
`--force` mutation bypass. When neither resume nor rollback can verify its
preconditions, the state becomes `manual-intervention`, all further mutation
stays blocked, and the user must repair the reported files before retrying
recovery.

## Consequences

- Mutation, recovery, and migration work may proceed without another design
  approval.
- Crash, concurrency, response-loss, replay, retention, permissions, and
  cross-platform fixtures remain mandatory release evidence.
- No journal stores raw idempotency keys, absolute project paths, environment
  values, credentials, or file contents that are not required for rollback.
