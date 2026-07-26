# Migrating to Tale UI React 3

React 3 is a coordinated major for `@tale-ui/tokens`, `@tale-ui/css`,
`@tale-ui/react`, `@tale-ui/react-styles`, `@tale-ui/themes`, and
`@tale-ui/utils`. `@tale-ui/tooling` moves independently to 0.2.0.

## Before upgrading

1. Upgrade the application runtime to Node 18 or newer.
2. Keep React and React DOM on matching 17, 18, or 19 releases.
3. Update all six coordinated Tale UI packages to 3.0.0 together.
4. Update maintained Tale templates to content version 2.0.0.

```bash
pnpm add @tale-ui/react@3.0.0 @tale-ui/react-styles@3.0.0
```

Repository contributors additionally need Node 22 or newer and pnpm 10 or
newer. `@tale-ui/tooling@0.2.0` retains its Node 22 floor.

## Dependency and adapter changes

React 3 pins `react-aria-components` exactly to 1.19.0 and directly pins
`react-aria` to 3.50.0. Consumers should not depend on Tale's transitive React
Aria packages or upstream unstable Toast objects. Tale's public component APIs
remain the supported boundary.

Existing components that need generated IDs now use the React-17-compatible
Tale utility. No React 18-only `useId` hook is required on supported paths.

## Node 14 and Node 16

Do not use React 2 or React 1.3.56 as a Node 14/16 workaround. Their manifests
declared Node 14, but their MCP SDK dependency required Node 18. Upgrade Node
before migrating; no historical Tale line is recommended for Node 14 or 16.

## Rollback

If a React 3 migration must be rolled back, return all six coordinated packages
to the same 2.x version and use the immutable `/docs/v2/` guidance. Do not mix
React 3 packages with the 2.x coordinated line.
