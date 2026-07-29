# ADR 001: Compatibility and platform dispositions

## Status

Accepted for package-local implementation on 2026-07-28. All native
implementations remain experimental; post-merge physical-device promotion
verification remains manual.

## Decisions

- Align the first prerelease with Expo SDK 57, React Native 0.86, React 19.2,
  React Native Web 0.21, and Storybook 10.
- Require the New Architecture and Hermes.
- Keep iOS and Android release-gating; React Native Web is opt-in per
  disposition.
- Use one `@tale-ui/react-native` package and platform files when behavior
  diverges.
- Treat `delivery: "stable"` as a completed disposition, not a stable native
  implementation. Responsible native alternatives may therefore be completed
  without a package implementation.
- Keep artifact v1 unchanged. Package-local native registry and documentation
  do not imply public MCP/Tooling platform routing.

## Evidence

The compatibility preflight, official documentation links, generated native
registry, packed-package checks, and exact environment constraints support this
ADR. The current publication workflow omits foundations and React Native.
