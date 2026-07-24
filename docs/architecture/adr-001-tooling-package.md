# ADR 001: Tooling package and validation runtime

- Status: Proposed
- Gate: P-01
- Required reviewers: Developer Experience, Security, Release Engineering

## Proposed decision

Use the working boundary `packages/tooling/` and package name
`@tale-ui/tooling`. It would own the programmatic API, contracts, registry
loaders, local validator, CLI, and local MCP adapter. The existing React MCP
binary would become a compatibility shim.

The proposed baseline is Node 22 on macOS, Linux, and Windows, with an explicit
TypeScript compiler runtime dependency. Validation would use the compiler API
in a bounded worker and never run a package manager, `npx`, or arbitrary
subprocess.

Release policy, timeout and memory limits, package-version coupling, installed
asset paths, publish ordering, and compatibility windows remain undecided.

## Gate

No `packages/tooling/package.json`, `tale` binary, public export, installed
loader, or release-workflow integration may merge while this record is
Proposed. `pnpm roadmap:gates:check` enforces that boundary.
