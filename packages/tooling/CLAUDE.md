# @tale-ui/tooling

Node 22 tooling for Tale UI registry discovery, contracts, validation, and
safe project operations.

## Boundaries

- Keep registry search and lookup logic pure and shared with repository
  adapters.
- Resolve runtime assets relative to the installed package. Never depend on a
  consumer's current working directory or monorepo-only paths.
- Machine output uses the versioned success/error envelope and writes exactly
  one JSON value to stdout. Diagnostics and progress belong on stderr.
- Do not enable a capability until its manifest gate and packed-project tests
  pass.
- Validation is read-only and compiler-API based. It must not invoke package
  managers, `npx`, or arbitrary subprocesses.
- Mutation work remains blocked by ADR-002 and must be root-confined,
  journaled, idempotent, and recoverable.

## Commands

```bash
pnpm --filter @tale-ui/tooling test
pnpm --filter @tale-ui/tooling typescript
pnpm --filter @tale-ui/tooling test:package
```
