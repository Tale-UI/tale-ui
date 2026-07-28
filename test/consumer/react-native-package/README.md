# React Native packed consumers

This fixture verifies the built `@tale-ui/tokens`, `@tale-ui/foundations`, and
`@tale-ui/react-native` tarballs from clean consumer directories. It does not
use workspace aliases or private source imports.

Run both Expo and plain React Native Metro checks:

```bash
pnpm native:test:consumers
```

Run one platform's Hermes bundles:

```bash
pnpm native:test:ios
pnpm native:test:android
```

The runner creates temporary Expo and plain React Native projects, installs
only packed Tale UI artifacts plus declared public peers, type-checks the
public imports, and emits production bundles and source maps. Temporary
projects are removed after a successful or failed run.
