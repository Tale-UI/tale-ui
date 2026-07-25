# Cross-Package Dependencies

To use one workspace package from another (e.g., an app consuming the CSS package):

```json
// apps/my-app/package.json
{
  "dependencies": {
    "@tale-ui/core": "workspace:*"
  }
}
```

Then run `pnpm install` from the root. pnpm will symlink the local package instead of fetching from npm.

From the CLI:
```bash
pnpm --filter @tale-ui/my-app add @tale-ui/core --workspace
```
