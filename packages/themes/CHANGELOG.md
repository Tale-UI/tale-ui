# Changelog — @tale-ui/themes

## v2.2.0 — 2026-08-03

### Changed

- **Release continuity**: Advanced `@tale-ui/themes` to the coordinated immutable version
  `2.2.0` after `2.1.0` was published.
- **Theme stability**: Preserved all theme identifiers, palettes, selectors, and application APIs
  from `2.1.0`.

## v2.1.0 — 2026-08-03

### Changed

- **Coordinated release**: Aligned `@tale-ui/themes` with the `2.1.0` release of the Tokens,
  CSS, Utils, React, and React Styles packages.
- **Theme stability**: Preserved all published theme identifiers, palettes, selectors, and
  application APIs.

## v3.0.0 — 2026-07-27

### Changed

- Prepared the theme package for the coordinated Tale UI 3 release.
- No theme identifiers, palettes, selectors, or application APIs changed at the Gate B boundary.

## v2.0.0 — 2026-07-24

### Changed

- Replaced the `@tale-ui/core` dependency with `@tale-ui/css`.
- Updated generated import guidance and repository metadata.

### Notes

- No theme identifiers, palettes, or application APIs changed.

## v1.3.56 — 2026-07-16

### Added

- Added the initial framework-neutral theme package surface with typed metadata, application
  helpers, and generated production CSS.
- Added eight standard themes with distinct brand and neutral colour anchors.
- Added seven monochrome themes—Antique, Forest, Mauve, Mountain Meadow, Rosewater, Teal, and
  Terracotta—whose generated palettes match Bento Browser's shipped presets.
- Added class and data-attribute selectors with light, dark, and forced-mode foreground contrast
  support.

### Changed

- Aligned `@tale-ui/themes` with the coordinated Tale UI public package version and integrated it
  into the lockstep bump and `react-v*` publish workflow.

## v0.1.0 — 2026-07-16

- Added eight algorithm-generated standard themes with distinct brand and neutral palettes.
- Established monochrome theme terminology for themes that derive both palettes from one colour.
- Added Bento Browser's seven non-default presets as the Antique, Forest, Mauve, Mountain Meadow,
  Rosewater, Teal, and Terracotta monochrome themes.
- Added generated static CSS supporting classes, data attributes, light mode, and dark mode.
- Added typed theme metadata and helpers for applying themes in browser applications.
