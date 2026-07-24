# ADR 003: Documentation, hosted MCP, and metrics boundaries

- Status: Proposed
- Gates: P-03 and P1-B
- Required reviewers: Docs Platform, Security, Privacy, Product Analytics

## Proposed decision

Historical documentation must come from an approved release source, use an
explicit public allowlist, and be stored as immutable content-addressed
snapshots. `docs/archive/` is not an eligible source.

Hosted MCP is an independent bounded retrieval and `plan_ui` runtime. It must
not expose validation, mutation, recovery, codemod execution, or extension
execution.

Metrics default to public aggregate sources with explicit provenance,
coverage, freshness, and definition versions. Missing data is `unavailable`
or `partial`, never zero. Project events require a separately approved,
authenticated, opt-in data plane with deletion and a kill switch.

The previous-major source, public origin, hosting vendor, transport, rate-limit
store, metric sources, coverage semantics, and retention remain undecided.
