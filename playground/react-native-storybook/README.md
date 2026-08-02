# Tale UI Native Storybook

The Expo host mounts `@storybook/react-native` when the Storybook scripts set
the entry-swap environment variables.

```bash
pnpm dev:all
pnpm storybook:ios
pnpm storybook:android
pnpm storybook:web:build
```

The root `dev:all` command serves the React Native Web Storybook at
`http://localhost:6007`.

The sidebar groups all 40 experimental native implementations under
`Components / {category} / {component}`. Each component includes:

- a `Playground` story with documented controls for its meaningful Tale UI
  props and action logging for its event callbacks; and
- an `All Variations` story for visual state coverage.

Eligibility comes from
`registry/platforms/react-native-implementations.json`; the control contracts
and story files project that inventory. `pnpm native:storybook:check` rejects
missing component navigation,
properties, actions, descriptions, control types, or stale generated stories.
Toolbar globals cover appearance, deterministic device/light/dark system-scheme
selection, theme, manual text-scale review targets, and reduced motion.

Native project builds are reproducible through Expo prebuild:

```bash
pnpm native:build:ios
pnpm native:build:android
```

The iOS build requires Xcode and CocoaPods. The Android build requires
`ANDROID_HOME` plus a Java 21 runtime, such as Android Studio's bundled JBR.
