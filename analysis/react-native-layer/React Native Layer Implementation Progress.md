# React Native Layer Implementation Progress

## Current phase

The bounded package-local correction is implemented. Merge readiness depends
on the committed-clean repository gates, not physical-device evidence.
All 40 native implementations remain experimental. Physical-device evidence is
a separate, manual post-merge promotion input.

## Decisions and ADRs

- `ADR-001-Compatibility-and-Platform-Dispositions.md`
- `React Native Compatibility Matrix.md`
- `Artifact V2 RFC.md` remains a standalone draft; it is not a merge or
  promotion requirement, and artifact v1 routing is unchanged.

## Implemented

- Workspace-supported experimental `@tale-ui/foundations`: immutable
  deterministic theme resolution, portable presets, contracts, state
  controllers, and ten exact shadow-recipe references.
- Backward-compatible `@tale-ui/themes` adapter using foundations-owned preset
  definitions; generated web CSS remains unchanged.
- Deterministic native registry, parity documentation, shadow recipe
  candidates, evidence gates, stale checks, and two-build identity.
- Workspace-supported experimental `@tale-ui/react-native`: reactive
  appearance provider, foundational primitives, interactive controls, forms,
  collections, navigation, disclosure, overlays, and feedback across 40
  canonical implementation records.
- 133 native dispositions: 114 completed and 19 proposed. The separate web
  lifecycle count remains 112 stable records.
- `RadioField` is a completed native-alternative disposition without a native
  implementation. The removed alias only renamed `RadioGroup` and did not
  implement the web compound contract.
- Expo/on-device Storybook host with entry-point swapping, hierarchical
  component navigation, 40 controlled Playground stories, 40 All Variations
  stories, supported review globals, and a verified React Native Web export.
- Clean production-tarball consumers for Expo and plain React Native with
  all 40 component subpaths, provider APIs, Expo exports, and plain React
  Native Metro bundles/source maps on iOS and Android.
- React Native Testing Library adapter tests for activation, pending/disabled
  state, selection, disclosure, tabs, adjustable actions, progress/live
  regions, text input, reactive appearance, separately queryable overlay
  descendants, modal dismissal, and native back handling.
- Setup, authoring, accessibility, parity, compatibility, ADR, RFC, and native
  golden guidance.
- Non-mutating CI checks for foundations, native inventory, package, registry,
  conformance, coverage, Storybook, packed consumers, and documentation.
- The current publication workflow omits both foundations and React Native.

## Commands and exact outcomes

- The PR #19 compatibility helper validated the exact base and a package-level
  registry 404, authorizing removal of the false RadioField subpath.
- Foundation recipe integrity, TypeScript, theme CSS drift, and package checks
  pass.
- Native focused provider/overlay tests, full tests, TypeScript, package
  contracts, and package checks pass.
- Native inventory, registry, and two-build identity checks pass.
- Native conformance: 641 portable tokens, 30 matched exceptions, positive
  native-package evidence passed.
- Native coverage: 112 web-stable records, 114 completed dispositions, 19
  proposed dispositions, 40 experimental implementations, 40 control
  contracts, and 80 component stories.
- Packed production consumers: clean Expo and plain React Native installs,
  public tarball imports, TypeScript, Expo iOS/Android exports, plain React
  Native Metro bundles, and normalized source-map owner coverage passed.
- Storybook source, controls, isolated loader identity, type, and web-build
  checks are merge gates.
- Repository TypeScript, Markdown, documentation provenance, and generated
  checks are merge gates.

## Generated artifacts

- `registry/platforms/react-native.json`
- `registry/platforms/react-native-recipe-candidates.json`
- `docs/react-native-component-parity.md`
- updated unified artifacts, governance reports, versioned-doc provenance,
  metrics, Figma outputs, native conformance, and roadmap evidence.

## Externally blocked verification

No physical iOS or Android outcome is claimed by the PR gates. Manual
post-merge review must record:

- manual VoiceOver or TalkBack behavior;
- physical hardware-keyboard and assistive activation;
- physical-device frame-time or memory budgets; or
- physical-device stable-promotion evidence.

Simulator, source, Expo export, and Metro results do not satisfy physical-device
promotion gates.

## Next executable action requiring external capability

After merge, humans may execute the checklist in
`docs/react-native-accessibility.md` on supported physical iOS and Android
hardware. Every failed, unavailable, or untested item keeps affected
components experimental and release-blocked. Artifact v2 is considered only
if separately requested.
