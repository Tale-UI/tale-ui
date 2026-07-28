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

The sidebar groups every implemented native component under
`Components / {category} / {component}`. Each component includes:

- a `Playground` story with documented controls for its meaningful Tale UI
  props and action logging for its event callbacks; and
- an `All Variations` story for visual state coverage.

The control contracts and story files are generated from the governed native
registry. `pnpm native:storybook:check` rejects missing component navigation,
properties, actions, descriptions, control types, or stale generated stories.
Toolbar globals cover appearance, theme, text scale review targets, locale,
direction, reduced motion, and density.

Native project builds are reproducible through Expo prebuild:

```bash
pnpm native:build:ios
pnpm native:build:android
```

The iOS build requires Xcode and CocoaPods. The Android build requires
`ANDROID_HOME` plus a Java 21 runtime, such as Android Studio's bundled JBR.
