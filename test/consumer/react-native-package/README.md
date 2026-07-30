# React Native packed consumers

This fixture verifies the built `@tale-ui/tokens`, `@tale-ui/foundations`, and
`@tale-ui/react-native` tarballs from clean consumer directories. It does not
use workspace aliases or private source imports.

Run both Expo and plain React Native Metro checks:

```bash
pnpm native:test:consumers
```

Run one platform's Expo export and plain React Native Metro bundle/source-map
verification:

```bash
pnpm native:test:ios
pnpm native:test:android
```

The runner creates temporary Expo and plain React Native projects, installs
only packed Tale UI artifacts plus declared public peers, type-checks the
public imports for all 40 implementation subpaths and retained provider APIs,
and emits production bundles and source maps. This is Metro bundle/source-map
verification, not Hermes execution. Temporary projects are removed after a
successful or failed run.
