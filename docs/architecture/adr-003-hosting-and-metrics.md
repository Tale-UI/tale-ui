# ADR 003: Documentation, hosted MCP, and metrics boundaries

- Status: Accepted
- Date: 2026-07-25
- Approved by: Repository owner through delegated implementation authority
- Gates: P-03 and P1-B
- Review disciplines: Docs Platform, Security, Privacy, and Product Analytics

## Decision

The authoritative previous-major source is the repository tag
`react-v1.3.56`, whose `@tale-ui/react` manifest reports version `1.3.56`.
Historical documentation is imported from that immutable Git object through
an explicit public-path allowlist and stored as a content-addressed generated
snapshot. `docs/archive/` is not a source.

GitHub Pages remains the static documentation host at
`https://tale-ui.github.io/tale-ui/`. Versioned documentation is published at
`/docs/v2/` and `/docs/v1/`; `/docs/` and `/docs/current/` resolve to the
current major. Root `llms.txt`, version manifests, and rollback metadata are
assembled into the same Pages artifact.

Hosted MCP is an independent Cloudflare Worker at
`https://mcp.tale-ui.dev/mcp` using MCP Streamable HTTP. It exposes bounded
retrieval and `plan_ui` only. Validation, mutation, recovery, codemod
execution, extension execution, and Figma access are absent by contract and
capability test. Version-keyed immutable assets may be cached globally;
request bodies, prompts, results, IP addresses, and private identifiers are
not written to application logs.

Rate limiting uses a Cloudflare Durable Object with a daily rotated HMAC of
the network identifier. Buckets expire after 24 hours and are not exported.
Operational logs retain only request ID, capability, status class, duration
bucket, response-size bucket, and correlated public versions for seven days.
Secrets are environment bindings and never enter build artifacts.

Roadmap metrics use public aggregate and repository-owned evidence only:

- npm download and published-version data;
- GitHub releases, issues, pull requests, and release cadence;
- GitHub Actions build, accessibility, performance, and package-health
  results; and
- generated documentation, template, migration, and golden-evaluation
  coverage.

No project-event telemetry or user-level analytics data plane is implemented
in this roadmap. Documentation search, template use, codemod use, and
consumer-version adoption remain `unavailable` unless a later separately
approved opt-in proposal supplies them. This is the approved exception for
the corresponding unavailable R08/SM07/SM08 inputs; dashboards must display
the gap and may not substitute zero.

Each metric declares its source, consent class, definition version, coverage,
freshness target, last successful observation, and collection error.
`complete` means every declared source is present and within its freshness
target; `partial` means at least one declared source is missing or stale;
`unavailable` means no valid observation exists. Normalized daily snapshots
are retained for 400 days, weekly public rollups and release evidence
indefinitely, and raw provider responses only for the duration of a collection
job. Failed collection retains the last-known-good snapshot and marks it
stale.

## Consequences

- Historical docs, static hosting, hosted MCP, and aggregate metrics may
  proceed without another architecture approval.
- Cloudflare credentials, DNS, and production deployment remain operational
  inputs; their absence must not weaken local builds, fixtures, or deploy
  artifacts.
- Any future project telemetry, hosted validation, hosted mutation, or hosted
  extension execution requires a new decision record.
