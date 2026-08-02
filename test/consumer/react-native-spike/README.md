# React Native compatibility spike

This retained fixture proves the selected host/package boundary without
introducing production packages. It has an Expo host and a plain React Native
Metro configuration that consume a packed fixture only through public exports.

## Reproduce package-local checks

```bash
pnpm install
pnpm -C test/consumer/react-native-spike check
pnpm -C test/consumer/react-native-spike typecheck
```

## Reproduce native hosts on a provisioned machine

```bash
pnpm -C test/consumer/react-native-spike expo:ios
pnpm -C test/consumer/react-native-spike expo:android
```

For the plain host, create the platform projects with React Native 0.86.2,
copy `plain/App.tsx` and `plain/metro.config.cjs` into the generated host, and
install the fixture tarball produced by `scripts/check.mjs`. Do not add a
workspace alias.

Verify on both platforms:

1. Hermes and New Architecture are enabled.
2. The packed fixture resolves its root and `button` public exports.
3. Editing the fixture-facing application triggers Fast Refresh.
4. A thrown fixture error maps to `src/button.ts` in source maps.
5. Storybook launches through an entry-point-swapped Expo bundle.

The 2026-07-28 verification passed Expo Hermes exports for iOS and Android,
launched the Storybook host on iOS 26.5 and Android 16 simulators, and passed
direct Xcode 26.6 and Gradle 9.3.1 native builds with Hermes and the New
Architecture. Physical-device VoiceOver, TalkBack, and performance evidence
remains an external release gate.
