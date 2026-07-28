# React Native Layer Implementation Progress

## Current phase

Phase 8 package-local implementation, simulator execution, native builds, and
release preparation are complete. Release readiness remains blocked only on
physical-device accessibility/performance evidence and external approval of
the separate artifact-v2 RFC.

## Decisions and ADRs

- `ADR-001-Compatibility-and-Platform-Dispositions.md`
- `React Native Compatibility Matrix.md`
- `Artifact V2 RFC.md` remains a draft; artifact v1 routing is unchanged.

## Implemented

- `@tale-ui/foundations`: immutable deterministic theme resolution, portable
  presets, contracts, state controllers, and shadow recipes.
- Backward-compatible `@tale-ui/themes` adapter using foundations-owned preset
  definitions; generated web CSS remains unchanged.
- Deterministic native registry, parity documentation, shadow recipe
  candidates, evidence gates, stale checks, and two-build identity.
- `@tale-ui/react-native`: provider, foundational primitives, interactive
  controls, forms, collections, navigation, disclosure, overlays, and feedback
  across 40 implemented governed component outcomes.
- Completed native-alternative outcomes for the rest of the 112-component
  live stable React registry; all 21 experimental/deprecated entries remain
  proposed.
- Expo/on-device Storybook host with entry-point swapping, hierarchical
  component navigation, controlled Playground and All Variations stories for
  all 40 implemented outcomes, review globals, and a verified React Native Web
  export.
- Clean production-tarball consumers for Expo and plain React Native with
  TypeScript, Metro, Hermes exports, and source maps on iOS and Android.
- React Native Testing Library adapter tests for activation, pending/disabled
  state, selection, disclosure, tabs, adjustable actions, progress/live
  regions, text input, modal dismissal, and native back handling.
- Setup, authoring, accessibility, parity, compatibility, ADR, RFC, and native
  golden guidance.
- CI checks for foundations, native package, registry, recipes, conformance,
  coverage, accessibility evidence, performance, and Storybook.

## Commands and exact outcomes

- Compatibility spike packed public import, isolated TypeScript, iOS Hermes
  export, Android Hermes export, and simulator launch: passed.
- `pnpm tokens:check`: passed.
- `pnpm foundations:test`: 3 tests passed.
- Foundations TypeScript and packed package: passed; publint and all package
  entrypoints green.
- Existing theme CSS check and 9 theme tests: passed.
- Existing theme packed package: passed.
- Native TypeScript, 2 package contracts, and 9 adapter behavior tests: passed.
- Native packed package: passed; publint and all 46 package entrypoints green.
- Native registry/recipe check and two-build identity: passed.
- Native conformance: 641 portable tokens, 30 matched exceptions, positive
  native-package evidence passed.
- Native coverage: 112 stable outcomes, 40 implemented exports/stories, 40
  accessibility evidence records.
- Pure theme performance: 1,000 light/dark resolutions in 17.78ms against a
  250ms local budget.
- Packed production consumers: clean Expo and plain React Native installs,
  public tarball imports, TypeScript, iOS/Android Metro bundles, Hermes Expo
  exports, and plain React Native source maps passed.
- Storybook type check, generated story index, nine-category navigation, 80
  registry-derived stories, 108 controlled properties, 17 action callbacks,
  and Expo/Metro web export passed; real Storybook output contains a 4MB
  runtime chunk plus a 42KB chunk.
- Storybook launched on an iPhone 17 Pro iOS 26.5 simulator and an Android 16
  API 36 arm64 emulator. Fresh evidence is retained under
  `.artifacts/native-platform-evidence/`.
- Xcode 26.6 Debug simulator build: succeeded with New Architecture and Hermes.
- Gradle 9.3.1 `app:assembleDebug`: 388 tasks succeeded against compile/target
  SDK 36, min SDK 24, NDK 27.1, Java 21, New Architecture, and Hermes.
- Root `pnpm typescript`: passed.
- Root `pnpm build`: all 9 public packages passed.
- Scoped ESLint and root Markdown lint: passed.
- `pnpm generate-docs:check`: passed, including registry, artifacts,
  governance, versioned docs, Tooling, hosted MCP, Figma, accessibility,
  performance protection, compatibility, and roadmap evidence.

## Generated artifacts

- `registry/platforms/react-native.json`
- `registry/platforms/react-native-recipe-candidates.json`
- `docs/react-native-component-parity.md`
- updated unified artifacts, governance reports, versioned-doc provenance,
  metrics, Figma outputs, native conformance, and roadmap evidence.

## Externally blocked verification

No physical iOS or Android device is connected. Therefore none of the
following is claimed:

- manual VoiceOver or TalkBack behavior;
- physical hardware-keyboard and assistive activation;
- physical-device frame-time or memory budgets; or
- physical-device stable-promotion evidence.

Simulator builds and launches cover platform integration but do not satisfy
those physical-device release gates. Artifact v2 also remains a draft and
cannot alter public artifact routing without independent approval.

## Next executable action requiring external capability

Connect supported physical iOS and Android devices, complete and retain the
VoiceOver/TalkBack and device-performance checklist, and obtain independent
artifact-v2 approval if platform-aware public tooling is desired. Publishing,
tagging, pushing, and opening a pull request still require explicit authority.
