# React Native Compatibility Matrix

Verified against official documentation and npm metadata on 2026-07-28.

| Concern           | Supported baseline      | Evidence and policy                                             |
| ----------------- | ----------------------- | --------------------------------------------------------------- |
| Node.js           | 22.13+ or 24.3+         | React Native 0.86 and Metro 0.87 engine ranges                  |
| React             | 19.2.3                  | Expo SDK 57 tested dependency                                   |
| React Native      | 0.86.0                  | Expo SDK 57 tested dependency                                   |
| Expo              | 57.x                    | Current stable SDK                                              |
| Metro             | Expo-managed / 0.84.x   | React Native 0.86 clean-consumer bundle                         |
| TypeScript        | 5.9.x / Expo host 6.0.x | Repository compiler plus Expo SDK 57 tested host compiler       |
| React Native Web  | 0.21.x                  | Expo SDK 57 compatibility table                                 |
| Storybook         | 10.x                    | Matches the repository major; React Native uses entry swapping  |
| Gesture Handler   | 2.32.x                  | Expo SDK 57 tested dependency                                   |
| Architecture      | New Architecture        | Mandatory in React Native 0.82+                                 |
| JavaScript engine | Hermes                  | Expo host output; plain-RN gate is Metro bundle/source-map only |
| iOS               | 16.4+                   | Xcode simulator build and iOS 26.5 launch                       |
| Android           | Android 7/API 24+       | API 36 compile/target and Android 16 emulator launch            |

## Release policy

iOS and Android package checks are merge-gating. Manual physical-device
accessibility and performance observations are required only for later
promotion from experimental status. React Native Web is supported only where a
component's native disposition declares it and never substitutes for physical
device evidence.

The component package has React and React Native peers and no Expo runtime
dependency. Expo is restricted to the Storybook and Expo consumer hosts.

## Reproduction

See `test/consumer/react-native-spike/README.md` for the bounded compatibility
fixture and `test/consumer/react-native-package/README.md` for production
tarball verification. Current packed verification performs Expo iOS/Android
exports plus plain React Native Metro bundles and source maps; it does not
claim plain React Native Hermes execution. Remaining physical-device checks
are recorded in the accessibility guide.

## Primary sources

- <https://docs.expo.dev/versions/latest/>
- <https://docs.expo.dev/guides/new-architecture/>
- <https://reactnative.dev/architecture/landing-page>
- <https://reactnative.dev/docs/accessibility>
- <https://storybookjs.github.io/react-native/docs/intro/getting-started/>
- <https://metrobundler.dev/docs/package-exports/>
