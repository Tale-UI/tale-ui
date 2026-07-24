# ADR 001: Tooling package and validation runtime

- Status: Accepted
- Date: 2026-07-24
- Approved by: Repository owner
- Gate: P-01
- Required reviewers: Developer Experience, Security, Release Engineering

## Decision

Use the boundary `packages/tooling/` and package name
`@tale-ui/tooling`. It would own the programmatic API, contracts, registry
loaders, local validator, CLI, and local MCP adapter. The existing React MCP
binary would become a compatibility shim.

The baseline is ESM-only Node 22 on macOS, Linux, and Windows, with an explicit
TypeScript compiler runtime dependency. Validation would use the compiler API
in a bounded worker and never run a package manager, `npx`, or arbitrary
subprocess.

The package versions independently from the synchronized design-system
packages and reports its package, registry, capability, and contract versions
in every machine envelope. Runtime registry and schema assets resolve relative
to the installed package, never from the consumer's working directory.

The first release channel remains internal. The package and `tale` binary may
be built and tested, but npm publication and publish-workflow integration wait
for the packed Vite/Next, validator, CLI/API/MCP parity, and compatibility
gates. The existing React MCP binary remains supported until a separately
reviewed deprecation record defines its removal window.

Exact validation timeout, memory, and diagnostic limits are established from
the Phase 0 baselines before `code.validate` becomes available. Until then the
capability manifest keeps validation gated. Mutation remains gated by ADR-002.

## Gate

P-01 is satisfied. `pnpm roadmap:gates:check` continues to reject package,
binary, or release-workflow integration if this record returns to Proposed.
Capability-specific gates continue to block validation, mutation, and public
publication until their acceptance evidence exists.
