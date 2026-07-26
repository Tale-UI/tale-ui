# Changelog — @tale-ui/react-styles

All notable changes to the component styles package are documented in this file.

## v3.0.0 — 2026-07-27

### Added

- Added standalone styles and package exports for AspectRatio, Blockquote, ButtonGroup, Code, and
  Skeleton.

### Changed

- Prepared the component stylesheet package for the coordinated Tale UI 3 release.
- Added package/export parity and clean packed-consumer validation infrastructure.

## v2.0.0 — 2026-07-24

### Changed

- Replaced the `@tale-ui/core` dependency and stylesheet import with `@tale-ui/css`.
- Updated package metadata for the renamed `Tale-UI/tale-ui` repository.

### Notes

- No component selectors or CSS custom-property names changed.

## v1.3.56 — 2026-07-16

### Added

- **Card.Button**: Added interactive, hover, pressed, focus-visible, selected, and disabled styles
  for button-backed cards.

### Changed

- **Disclosure and Accordion**: Refined disclosure panel layout and aligned accordion trigger
  presentation with the updated disclosure foundation.
- **Popover and Menu**: Refined shared popup/item tokens and menu composition styles.
- **Button**: Simplified neutral-button overrides so shared variant tokens remain authoritative.
- **Release alignment**: Aligned `@tale-ui/react-styles` with `@tale-ui/core`, `@tale-ui/utils`,
  `@tale-ui/react`, and `@tale-ui/themes`.

## v1.3.55 — 2026-07-06

### Fixed

- **Tabs**: Let pill tab indicators draw the selected surface while preserving selected fallback styling when no indicator is rendered.
- **Field controls**: Aligned CheckboxField, RadioField, and SwitchField description and error text with their control labels.

### Changed

- **Release alignment**: Aligned `@tale-ui/react-styles` with `@tale-ui/core`, `@tale-ui/react`, and `@tale-ui/utils`.

## v1.3.54 — 2026-06-30

### Changed

- **Rem base**: Recalibrated component styles for the browser-standard `1rem = 16px` root while preserving existing rendered sizes.
- **Fixed layout sizing**: Converted suspicious fixed control and icon dimensions in HeaderNav, Sidebar, TextEditor, FileUpload, SocialButton, and VideoPlayer toward scalable rem-based geometry.
- **Release alignment**: Aligned `@tale-ui/react-styles` with `@tale-ui/core`, `@tale-ui/react`, and `@tale-ui/utils`.

## v1.3.53 — 2026-06-26

### Changed

- **Button**: Updated the neutral button variant to use translucent `--neutral-90` color mixes for base, hover, and active background and border states, making neutral buttons and overlay triggers visually distinct from ghost buttons while preserving dark-mode inversion.

## v1.3.52 — 2026-06-21

### Added

- **CommandPalette**: Added styles for the command palette component.
- **KeyValuePairs**: Added styles for compact key/value metadata displays.
- **Tabs / Link**: Added icon-aware styles for tab triggers and links.

### Changed

- **Link**: Updated default link decoration rules so text links are underlined while icon-only links remain visually clean.
- **Popover / Button**: Refined component styling used by studio and recipe workflows.

## v1.3.50 — 2026-05-25

### Added

- **Dropdown menus**: Added compact menu sizing styles and shared primitives for compact density.

## v1.3.49 — 2026-05-24

### Added

- **ColorSwatch**: Added styles for shape variants and split-color swatches.
- **ColorSwatchPicker**: Added styles for the updated swatch picker presentation.

### Fixed

- **NumberField**: Adjusted styles for the current component showcase output.

## v1.3.48 — 2026-05-07

No changes — version bump for coordinated release.

## v1.3.47 — 2026-05-03

No changes — version bump for coordinated release.

## v1.3.46 — 2026-04-26

No changes — version bump for coordinated release.

## v1.3.45 — 2026-04-18

### Fixed

- **Calendar / RangeCalendar**: Scoped prev/next button overrides to full `.tale-button.tale-button--ghost.tale-calendar__*` selector chain to prevent unintended resets. Updated hover/active token values.
- **FileUpload**: Layout, min-height, and spacing corrections; `box-sizing: border-box` added to key elements.
- **NumberField**, **Slider**, **PaginationLine**: Minor token and layout fixes.
- **Banner**, **Tabs**: Token corrections.
- **`_primitives.css`**: Increased focus-ring glow opacity (20% → 30%); updated `--field-*` and `--popup-*` background/border tokens for dark-mode correctness.

## v1.3.44 — 2026-04-14

No changes — version bump for coordinated release.

## v1.3.43 — 2026-04-14

No changes — version bump for coordinated release.

## v1.3.42 — 2026-04-04

No changes — version bump for coordinated release.

## v1.3.41 — 2026-03-31

### Changed

- **button.css:** Added `width: fit-content` so buttons no longer stretch to fill their container by default.
- **number-field.css:** Added `width: fit-content` to root; changed input from `flex: 1` to `flex: 0 0 6rem` for consistent sizing.

## v1.3.40 — 2026-03-31

### Changed

- **Card:** Tightened padding for all sizes (sm: `xs`, md: `s`, lg: `m`).
- **SelectNative:** Changed width from `100%` to `fit-content` with `max-width: 100%` for intrinsic sizing.

## v1.3.39 — 2026-03-30

### Changed

- **badge.css:** Replaced 20 individual named-color variant classes with single `.tale-badge--color` using `--color-*` tokens. Background uses `color-mix(in srgb, var(--color-60) 15%, var(--neutral-5))`.
- **banner.css:** Info variant (`.tale-banner--info`) uses neutral tokens (neutral-90 bg, neutral-5 text). Added custom action button and close button styles for info variant visibility. Color variants use `--color-*` tokens via `.color-*` theme classes.

## v1.3.38 — 2026-03-29

### Changed

- Updated `_primitives.css`, banner, icon-button, rating-stars, scroll-area, select-native, social-button, switch, tabs, and toggle-button CSS.

## v1.3.37 — 2026-03-27

### Fixed

- CSS override scoping fixes in playground.

## v1.3.36 — 2026-03-27

### Added

- **button.css:** `inverse` variant styles.
- CSS for 9 new components: AppStoreButton, Badge, DotIcon, FeaturedIcon, PaymentInput, RatingBadge, RatingStars, SelectNative, SocialButton.
- `_dark-overrides.css` for explicit dark mode overrides.

### Fixed

- **NumberField:** Remove spurious `background-color` from group wrapper; move correct shade to stepper buttons.
- **Slider** and **Combobox** style refinements.

## v1.3.35 — 2026-03-27

### Added

- **banner.css**, **carousel.css**, **empty-state.css**, **pin-input.css**, **spinner.css** — styles for five new components.
- New selectors in `index.css` for the above components.
- Additional `_primitives.css` grouped selectors for new component patterns.

### Changed

- Minor fixes to breadcrumbs, calendar, color-field, drop-zone, grid-list, link, number-field, popover, table, tabs, text-area, and tree CSS.

## v1.3.34 — 2026-03-26

### Fixed

- **Accordion:** Reset heading margins (`h1`–`h6`) inside `.tale-accordion__header` to prevent external stylesheet interference.
- **TextArea:** Add `box-sizing: border-box` to `.tale-text-area__textarea` to prevent width overflow.
- **Primitives:** Add `border: none` to fieldset legend reset.

## v1.3.33 — 2026-03-26

### Added

- **icon.css** and **icon-button.css** — styles for new Icon and IconButton components.
- PreviewCard expanded styles (trigger, avatar, heading, content).

### Changed

- Simplified `_primitives.css` grouped selectors after Icon component refactor.
- Dialog close button position tightened.
- Drawer popup spacing and actions alignment adjusted.

### Fixed

- Toolbar missing declaration restored.
- Combobox, calendar, navigation-menu, number-field, and popover CSS updated for Icon sub-component usage.
