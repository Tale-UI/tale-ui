# ADR 001: Compatibility and platform dispositions

## Status

Accepted for package-local implementation on 2026-07-28. Device verification
remains pending on a provisioned host.

## Decisions

- Align the first prerelease with Expo SDK 57, React Native 0.86, React 19.2,
  React Native Web 0.21, and Storybook 10.
- Require the New Architecture and Hermes.
- Keep iOS and Android release-gating; React Native Web is opt-in per
  disposition.
- Use one `@tale-ui/react-native` package and platform files when behavior
  diverges.
- Treat responsible platform-native alternatives as completed stable
  dispositions for web components whose DOM semantics should not be imitated.
- Keep artifact v1 unchanged. Package-local native registry and documentation
  do not imply public MCP/Tooling platform routing.

## Evidence

The compatibility spike, npm metadata, official documentation links, generated
native registry, packed-package checks, and exact environment constraints are
retained beside this ADR.
