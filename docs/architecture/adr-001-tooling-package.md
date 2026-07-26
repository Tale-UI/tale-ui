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

The first implementation release channel was internal. The package and `tale`
binary could be built and tested, while npm publication and publish-workflow
integration waited for the packed Vite/Next, validator, CLI/API/MCP parity, and
compatibility gates. The existing React MCP binary remains supported until a
separately reviewed deprecation record defines its removal window.

Exact validation timeout, memory, and diagnostic limits are established from
the Phase 0 baselines before `code.validate` becomes available. Until then the
capability manifest keeps validation gated. Mutation remains gated by ADR-002.

## Gate

P-01 is satisfied. `pnpm roadmap:gates:check` continues to reject package,
binary, or release-workflow integration if this record returns to Proposed.
Capability-specific gates continue to block validation, mutation, and public
publication until their acceptance evidence exists.

## Public beta readiness amendment

On 2026-07-25 the packed Vite and Next fixtures, installed validator,
CLI/API/local-MCP parity, package lint, type-surface, mutation, and recovery
gates passed. `@tale-ui/tooling@0.1.0` was therefore the initial public-beta
candidate; the v3 compatibility and template migration prepares the independent
Tooling line at `0.2.0`.

The repository exposes an independent `tooling-v*` release scope whose default
npm distribution tag is `next`. Merging code never publishes it: publication
still requires an explicit tag or manually dispatched workflow and the npm
credentials owned by Release Engineering. The evidence is recorded in
`test/baselines/roadmap/tooling-package-release.json`.
