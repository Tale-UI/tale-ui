# Cross-Package Dependencies

To use one workspace package from another (e.g., an app consuming the CSS package):

```json
// apps/my-app/package.json
{
  "dependencies": {
    "@tale-ui/css": "workspace:*"
  }
}
```

Then run `pnpm install` from the root. pnpm will symlink the local package instead of fetching from npm.

The native dependency direction is:

```text
@tale-ui/tokens
      ↓
@tale-ui/foundations
      ↓
@tale-ui/react-native
```

`@tale-ui/react-native` must not depend on the DOM-oriented
`@tale-ui/themes`, React DOM, Expo, or Storybook. Expo and Storybook are host
dependencies of `playground/react-native-storybook`.

From the CLI:

```bash
pnpm --filter @tale-ui/my-app add @tale-ui/css --workspace
```
