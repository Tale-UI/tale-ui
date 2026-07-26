# Compatibility

## Supported runtime matrix

| Surface                         | Supported React                | Minimum Node | Notes                               |
| ------------------------------- | ------------------------------ | ------------ | ----------------------------------- |
| `@tale-ui/react` 3.x            | 17, 18, or 19                  | 18           | Current coordinated product major   |
| Maintained Tale UI 2.x guidance | As declared by the 2.x package | 18           | Previous product major              |
| Repository development          | Workspace versions             | 22           | Requires pnpm 10 or newer           |
| `@tale-ui/tooling` 0.2.x        | Template-dependent             | 22           | Independently versioned public beta |

React 3's React 17 support includes import, client rendering, server rendering,
hydration, and multi-instance coverage. Existing components use Tale UI's
React-17-compatible ID fallback rather than calling `React.useId` directly.

## Historical Node declarations

The React 2 manifest at `release-v2.0.0` and the React 1.3.56 manifest both
declared Node 14 while depending on `@modelcontextprotocol/sdk` 1.28.0, whose
runtime floor is Node 18. Neither historical manifest demonstrates supported
Node 14 or Node 16 operation.

Node 14 and Node 16 users must upgrade Node. Tale UI does not recommend a
historical release line for those runtimes. Maintained 2.x guidance is limited
to Node 18 or newer.

## Versioned documentation

- `/docs/` and `/docs/v3/` are the current React 3 documentation.
- `/docs/v2/` is generated from immutable tag `release-v2.0.0` at
  `be1b3be433ddf244f57e252260afda448249169d`.
- `/docs/v1/` retains the immutable React 1.3.56 archive at
  `16e8ae2b3f26fdc2015cc10aa2d689edcbf60ca2`.
- Rollback metadata points to the previous supported major, v2.

Historical snapshots are evidence, not a recommendation to use an unsupported
runtime.
