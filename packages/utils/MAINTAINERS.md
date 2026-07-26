# Package rules

The utils package is shared across multiple codebases, which may cause issues with reference equality
if different versions of the package are used in the same project. To avoid this, we should follow
these rules:

- Avoid global variables as much as possible, in particular `React.Context` instances.
- Avoid the `instanceof` operator for types defined in the utils package.

`@tale-ui/utils` is a public package in the coordinated release set. Treat its
exports and observable behaviour as public API. Before release, run:

```bash
pnpm --filter @tale-ui/utils test
pnpm --filter @tale-ui/utils typescript
pnpm --filter @tale-ui/utils build
```

When an export or behaviour changes, update the package README, changelog, and
any consuming component documentation, then run `pnpm generate-docs:check`.
