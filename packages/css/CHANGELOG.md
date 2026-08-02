# Changelog — @tale-ui/css

All notable changes to the CSS design system are documented in this file.

## v2.1.0 — 2026-08-03

### Changed

- **Coordinated release**: Aligned `@tale-ui/css` with the `2.1.0` release of the Tokens,
  Utils, React, React Styles, and Themes packages.
- **Compatibility**: Retained the existing token, utility, theme, and dark-mode contracts;
  no CSS selector or custom-property APIs changed.

## v3.0.0 — 2026-07-27

### Changed

- Prepared the CSS design system for the coordinated Tale UI 3 release.
- Retained the existing token, utility, theme, and dark-mode contracts at the Gate B boundary.

## v2.0.0 - 2026-07-24

### Changed

- **Package rename**: Renamed the CSS design-system package from `@tale-ui/core` to
  `@tale-ui/css`.
- **Canonical tokens**: CSS token modules are now generated from `@tale-ui/tokens`.
- **Repository**: Updated package metadata for the renamed `Tale-UI/tale-ui` repository.

### Migration

- Replace `@tale-ui/core` dependencies and CSS imports with `@tale-ui/css`.
- No CSS class or custom-property names changed in this release.

## v1.3.57 - 2026-07-24

### Changed

- **Final release**: Published the final `@tale-ui/core` package before the CSS design system
  moves to `@tale-ui/css`.
- **Migration guidance**: Consumers should replace `@tale-ui/core` dependencies and imports with
  `@tale-ui/css`.

### Notes

- This release contains no design-token or CSS API changes.
- `@tale-ui/core` is deprecated after this release and receives no compatibility wrapper.

## v1.3.56 - 2026-07-16

### Changed

- **Package alignment**: Aligned `@tale-ui/core` with `@tale-ui/utils`, `@tale-ui/react`,
  `@tale-ui/react-styles`, and the new `@tale-ui/themes` package.
- **Token guidance**: Updated AI reference guidance for the shared popover and menu token
  refinements used by component styles.
- **Registry refresh**: Refreshed generated registry metadata for the `1.3.56` public release.

### Notes

- No design-token API changes.

## v1.3.55 - 2026-07-06

### Changed

- **Package alignment**: Aligned `@tale-ui/core` with the coordinated public package version shared by `@tale-ui/react`, `@tale-ui/react-styles`, and `@tale-ui/utils`.
- **Registry refresh**: Refreshed generated registry metadata for the `1.3.55` public release.

### Notes

- No design-token API changes.

## v1.3.54 - 2026-06-30

### Changed

- **Rem base**: Standardized `@tale-ui/core` on the browser-default root (`html { font-size: 100%; }`, normally `1rem = 16px`) while recalibrating tokens to preserve existing rendered Tale UI dimensions.
- **Package alignment**: Aligned `@tale-ui/core` with the coordinated public package version shared by `@tale-ui/react`, `@tale-ui/react-styles`, and `@tale-ui/utils`.

### Migration

- Remove any old Tale-specific 10px-root workaround from consuming apps. Tale UI now shares the standard rem contract used by Tailwind, shadcn/ui, Bootstrap, and browser-default CSS.

## v1.1.20 — 2026-06-21

### Changed

- Version aligned with the coordinated workspace release and regenerated package metadata. No design-token API changes.

## v1.1.17 — 2026-04-08

### Added

- **System colour themes:** Added `.color-error`, `.color-warning`, and `.color-success` theme classes, mapping `--brand-*` tokens to the corresponding semantic colour scale for Banner and Badge variants.

### Changed

- **Typography:** Commented out default `color` overrides on `:where(p, span)` and `:where(pre)` to prevent global element colour rules from leaking into component layouts.

## v1.1.16 — 2026-03-25

### Docs

- Updated consumer CLAUDE.md snippet: added pitfall about trigger components rendering their own `<button>` — never nest a `<Button>` inside them.

## v1.1.15 — 2026-03-25

### Fixed

- Reset default margins on heading elements (`h1`–`h6`) to `0` in the typography foundation, preventing browser-default margins from leaking into component layouts.

## v1.1.11 — 2026-03-17

### Fixed

- Foreground override specificity: use `html` selector to beat design system light-mode rule for `--color-*-fg` pivot overrides.
- Include fg pivot overrides in `:root` block for standalone CSS use.

## v1.1.10 — 2026-03-16

### Fixed

- Dark-mode neutral-5: tint with accent colour (`color-mix`) instead of plain neutral for better visual cohesion.
- Fixed dark-mode neutral-5 mix ratio; replaced `--bodyBg` with `--neutral-5` token.

## v1.1.9 — 2026-03-15

### Changed

- Refined dark-mode neutral-5 shading.
- Bumped mono font sizes for better readability.
- Enhanced scale playground with palette preview and contrast tools.

## v1.1.8 — 2026-03-14

### Fixed

- Fixed `--color-*-fg` tokens not re-evaluating correctly in dark mode on `.color-{name}` scoped elements. Explicitly declaring the full `--color-*` and `--color-*-fg` chains in all three mode blocks (light, OS dark, explicit dark) ensures the var() chain resolves reliably across all browsers.
- Moved per-family foreground pivot overrides (orange/sky at shade-60; amber/yellow/lime/green/emerald/teal/cyan at shade-60 and shade-70) from `_color-themes.css` into light-mode-only rules in `_color-modes.css`. This fixes those families showing light text on light backgrounds in dark mode.

## v1.1.6 — 2026-02-26

### Changed

- Updated typography and spacing guidance across the core styles and package documentation.
- Updated release automation to create descriptive GitHub release titles and body content from `CHANGELOG.md`.

## v1.1.5 — 2026-02-26

### Changed

- Bumped `@tale-ui/core` package version to `1.1.5`.
- Updated documentation version references to `v1.1.5` for consumer setup snippets.

## v1.1.4 — 2026-02-25

### Changed

- Bumped `@tale-ui/core` package version to `1.1.4`.
- Updated documentation version references to `v1.1.4` for consumer setup snippets.

## v1.1.3 — 2026-02-25

### Changed

- Renamed npm package identity to `@tale-ui/core` across package metadata, release tooling, CI workflow filters, and documentation.

## v1.1.2 — 2026-02-22

### Fixed

- Bumped `@tale-ui/core` package version to `1.1.2` so the pushed tag and package version match for the publish workflow.

## v1.1.1 — 2026-02-22

### Changed

- Replaced custom palette variable references in docs from `--brand-*` to `--color-*` for consistency.
- Improved docs navigation by adding sidebar synchronization behavior in the documentation page.
- Updated design system guidance docs and AI reference with corrected palette/theming extension instructions.
