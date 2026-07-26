# Changelog

All notable changes to the Tale UI monorepo are documented in this file.

## v3.0.0 — 2026-07-27

### Added

- **Component-equivalence Bundle 1**: Added experimental AspectRatio, Blockquote, ButtonGroup,
  Code, and Skeleton components with complete package, documentation, accessibility, visual,
  registry, Figma, and golden-guidance coverage.
- **Component-equivalence Bundle 2**: Added experimental Citation, Markdown, Outline, and
  Timestamp components, the bounded Markdown parser contract, shared timestamp scheduling, the
  `document-sources` recipe, and maintained component-performance evidence.
- **Component-equivalence Bundle 3**: Added experimental OverflowList, Resizable, and Lightbox
  components with responsive action, split-workspace, and media-viewing recipes plus maintained
  Chromium performance evidence.
- **Component-equivalence Bundle 4**: Added experimental Toast with a Tale-owned stable queue
  adapter, deterministic recovery, timers, announcements, Region leases, async-feedback guidance,
  and maintained component-performance evidence.

### Changed

- **Runtime contract**: Set the React consumer runtime floor to Node 18 while retaining React
  17/18/19 support; repository development and Tooling continue to require Node 22.
- **React Aria ownership**: Pinned React Aria Components to 1.19.0 and added an exact direct
  `react-aria` 3.50.0 dependency with executable adoption/deviation contracts.
- **Release preparation**: Prepared the six public design-system packages at 3.0.0 and Tooling at
  0.2.0 without publishing or creating tags.
- **Historical documentation**: Added current v3, immutable v2, retained v1, provenance, and
  rollback-to-v2 documentation contracts.

### Migration

- Upgrade Node 14/16 applications to Node 18 or newer before adopting React 3.
- Upgrade all six coordinated Tale UI packages together.

## v2.0.0 — 2026-07-24

### Added

- **Shared tokens**: Added `@tale-ui/tokens` as the canonical source for generated CSS custom
  properties and typed light/dark native token objects.

### Changed

- **Breaking package rename**: Replaced `@tale-ui/core` with `@tale-ui/css`.
- **Repository rename**: Renamed the GitHub repository from `Tale-UI/core` to `Tale-UI/tale-ui`.
- **Release automation**: Added coordinated publishing for Tokens, CSS, React, Styles, Themes, and
  Utils, followed by npm deprecation of `@tale-ui/core`.

### Migration

- Replace `@tale-ui/core` dependencies and imports with `@tale-ui/css`.
- No CSS custom-property names, utilities, or component APIs changed.

## v1.3.56 — 2026-07-16

### Added

- **Themes package**: Added the publishable `@tale-ui/themes` package with eight standard themes,
  seven Bento-derived monochrome themes, typed metadata, generated CSS, and browser application
  helpers.
- **Card.Button**: Added an accessible interactive Card variant for composable selection tiles,
  including tests, stories, documentation, registry metadata, and golden guidance.

### Changed

- **Theme playgrounds**: Replaced custom theme tiles with `Card.Button`, added standard and
  monochrome theme collections, and exposed them through the Tale UI Playground Drawer.
- **Menus and component styles**: Clarified menu composition and refined Disclosure, Accordion,
  Popover, Menu, Button, and Card styling.
- **Public packages**: Aligned `@tale-ui/core`, `@tale-ui/utils`, `@tale-ui/react`,
  `@tale-ui/react-styles`, and `@tale-ui/themes` at version `1.3.56`.
- **Release automation**: Added Themes to the lockstep version helper, coordinated React publish
  track, package validation, and version-bump skill.

## v1.3.55 — 2026-07-06

### Changed

- **Public packages**: Aligned `@tale-ui/core`, `@tale-ui/utils`, `@tale-ui/react`, and `@tale-ui/react-styles` at version `1.3.55`.
- **React Aria Components**: Upgraded the React package stack to `react-aria-components` `^1.19.0` and refreshed upstream adoption notes, generated docs, and registry metadata.
- **Tabs**: Updated pill tab styling so indicators own the selected surface, with fallback selected styling preserved when no indicator is rendered.
- **Field controls**: Aligned CheckboxField, RadioField, and SwitchField description/error text with their labels and refreshed visual baselines.

## v1.3.54 — 2026-06-30

### Changed

- **Public packages**: Aligned `@tale-ui/core`, `@tale-ui/utils`, `@tale-ui/react`, and `@tale-ui/react-styles` at version `1.3.54`.
- **Rem base**: Standardized Tale UI on the browser-default root (`html { font-size: 100%; }`, normally `1rem = 16px`) while preserving rendered component dimensions.
- **Component styles**: Tightened scalable control, icon, and fixed layout sizing across HeaderNav, Sidebar, TextEditor, FileUpload, SocialButton, and VideoPlayer.

### Migration

- Consumers should remove any old Tale-specific 10px-root override. Tale UI now shares the standard rem contract used by common rem-based frameworks.

## react-v1.3.53 — 2026-06-26

### Changed

- **Button / React styles**: Updated neutral button styling to use translucent `--neutral-90` color mixes for base, hover, and active background and border states, improving separation from ghost buttons across light and dark modes.
- `@tale-ui/react`, `@tale-ui/react-styles`, and `@tale-ui/utils` package metadata were aligned for the coordinated release.

## react-v1.3.52 — 2026-06-21

### Added

- **CommandPalette**, **KeyValuePairs**, ListBox exports, and virtualizer exports for React consumers.
- Icon slot support for `Link` and `Tabs`.

### Changed

- Link styling now underlines text links by default while preserving icon-only presentation.
- Recipe studio and MCP studio workflows gained recipe context, deep links, shared package wiring, and theme toggle support.
- `@tale-ui/a2ui`, `@tale-ui/charts`, `@tale-ui/utils`, docs, and playground package metadata were aligned for the coordinated release.

## react-v1.3.15 — 2026-03-19

### Added

- **Dev-mode misuse warnings**: `Drawer.Backdrop` warns when children are passed (wrapping Popup inside Backdrop causes a hooks-order crash). `Meter.Value` and `ProgressBar.Value` warn when rendered without children (self-closing renders an empty span).
- **Drawer.Backdrop**: typed as `Omit<..., 'children'>` for compile-time safety. Exported `BackdropProps` type.
- **TROUBLESHOOTING.MD**: new guide documenting 8 real-world errors and fixes encountered during Tale UI app development.

### Improved

- **Consumer guide**: added common pitfalls checklist to `consumer-claude-md-snippet.md` (namespace objects, Drawer.Backdrop pattern, Value children, dark mode toggle).
- **Dark mode docs**: documented the `data-color-mode` removal gotcha in `react-setup.md` — removing the attribute falls back to OS preference, not light mode.
- **Component docs**: added pitfall notes for Drawer, Meter, ProgressBar, NumberField, Table, and ToggleButton.

## react-v1.3.6 — 2026-03-18

### Added

- **Tree ItemContent wrapper**: `Tree.ItemContent` now wraps children in `div.tale-tree__item-content` for styling hooks. CSS selectors updated from child (`>`) to descendant combinator to match the new DOM structure.

### Fixed

- **Popover.Trigger**: fixed nested `<Button>` creating invalid `<button><button>` HTML (same pattern as Menu.Trigger). Apply button styling via `className` directly.
- **Dialog stories**: fixed controlled prop from `open` to `isOpen` (correct React Aria API).
- **Drawer stories**: added `tale-button` classes to Trigger and Close elements.

### Improved

- **Accessibility**: added `aria-label` to all `MenuList` elements and `textValue` to all `Menu.Item`, `ContextMenu.Item`, `Combobox.Item`, and `Select.Item` across stories and playground for screen reader and type-ahead support.
- **Component docs**: added accessibility notes (ARIA labelling, data attributes), API clarifications, and missing CSS class references across 26 component guides.

## react-v1.3.5 — 2026-03-18

### Fixed

- **SearchField**: fix clear button positioning — overlay inside input field instead of stacking below it. Adds `padding-inline-end` to prevent text overlapping the button.

## react-v1.3.4 — 2026-03-18

### Fixed

- **Focus rings**: standardized all components to the consistent double-ring pattern (`2px neutral-100` + `4px focus-ring-color`). Replaces ad-hoc `outline`, `inset box-shadow`, and hardcoded `--color-60` variants across ~20 component stylesheets and `_primitives.css`.
- **Accordion**: switched `overflow: hidden` to `overflow: clip` with `4px` clip-margin so focus rings on triggers are not clipped.
- **Menu.Trigger**: use React Aria `Button` instead of raw `<button>` to prevent invalid nested `<button>` HTML. Apply button styling via `className` directly.
- **Color field**: focus border and glow now use `--focus-ring-color` / `--focus-ring-glow` tokens.

### Changed

- **Link** color updated to `--color-70`; hover to `--color-100`; pressed to `--color-90`.
- **Breadcrumbs** hover color to `--color-80`; pressed to `--color-100`.
- **Radio** dot color to `--color-80`.
- **Toolbar** link color to `--color-80`; hover background to `--neutral-18`.
- **Progress bar / Meter** track to `--neutral-24`; indicator to `--neutral-24-fg`.
- Updated `menu.md` docs (no nested `<Button>` in `Menu.Trigger`) and `meter.md` (`Indicator` requires its own `value` prop).

## react-v1.3.3 — 2026-03-18

### Added

- **Tabs indicator**: animated bar that tracks the selected tab using `MutationObserver` + `ResizeObserver`. The `List` component now splits `Indicator` children as siblings inside a positioned wrapper (`__list-inner`).
- **Close button primitive**: extracted shared close-button base styles from `dialog.css` and `popover.css` into `_primitives.css` (group 16).
- **Component docs**: 59 per-component usage guides under `docs/components/` covering imports, compound parts, examples, and CSS classes.
- **Color thumb styles**: shared styles for `ColorArea`, `ColorSlider`, and `ColorWheel` thumbs in `_primitives.css`.

### Changed

- Selected tab and indicator colour changed from `--color-60` to `--neutral-90`.
- Modal/popover titles now include `padding-right` to prevent text overlapping close buttons.
- `CLAUDE.md` documentation table updated with `docs/components/` link.

### Fixed

- **ColorWheel**: docs and playground corrected — `Thumb` is a sibling of `Track`, not a child.
- **Dialog/AlertDialog** stories: `Popup` now correctly nested inside `Backdrop`.
- **ComponentAudit**: fixed TOC order, TypeScript errors, Dialog `isOpen` prop, and ColorWheel required props.
- Fixed `globalThis` strict-mode type error in `useAnimationsFinished`.

## react-v1.3.2 — 2026-03-16

### Changed

- Removed 18 unused utilities and the store subsystem from `@tale-ui/utils`.
- Removed all inherited MUI/Base UI artifacts, `@mui/internal-*` dependencies, code-infra label references, and `MuiRenderResult` comment.
- Updated LICENSE copyright.
- Added `eslint-import-resolver-typescript` as a direct dependency.
- Removed `pkg-pr-new` publish step from CI (app not installed).

## react-v1.3.1 — 2026-03-18

### Changed

- **Fieldset**: tightened spacing — gap from `--space-m` to `--space-s`, padding from `--space-m --space-l` to `--space-s`, removed legend horizontal padding.
- Fieldset and Form stories now use `TextField` / `NumberField` components instead of raw HTML inputs.

## react-v1.3.0 — 2026-03-14

### Added

- **React Aria Components migration**: complete rewrite of `@tale-ui/react` from custom Base UI internals to React Aria Components. All components now use BEM class names applied automatically via styled wrappers.
- **New components**: Calendar, RangeCalendar, ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, ColorWheel, ContextMenu, DateField, DatePicker, DateRangePicker, Drawer, DropZone, FileTrigger, GridList, Menubar, NavigationMenu, PreviewCard, ScrollArea, Table, TimeField, Toolbar, Tree.
- **Storybook**: migrated all stories to new React Aria API; added MDX-based introduction and foundation stories.
- Component CSS in `@tale-ui/react-styles` for all components using `@tale-ui/core` design tokens.

### Changed

- Docs site migrated demos and experiments to React Aria Components API.
- Button box-shadow and progress-bar indeterminate state fixes.

### Fixed

- Vite playground build — added `react-aria-components` dependency and fixed TS errors.
- Removed leftover floating-ui utility files breaking the build.
- Fixed `release:build` by adding missing `error-codes.json`.

---

## css-v1.1.11 — 2026-03-17

### Fixed

- **Foreground override specificity**: use `html` selector to beat design system light-mode rule for `--color-*-fg` pivot overrides.
- Include fg pivot overrides in `:root` block for standalone CSS use.

## css-v1.1.10 — 2026-03-16

### Fixed

- **Dark-mode neutral-5**: tint with accent colour (`color-mix`) instead of plain neutral for better visual cohesion.
- Fixed dark-mode `neutral-5` mix ratio; replaced `--bodyBg` with `--neutral-5` token.

## css-v1.1.9 — 2026-03-15

### Changed

- Refined dark-mode `neutral-5` shading.
- Bumped mono font sizes for better readability.
- Enhanced scale playground with palette preview and contrast tools.

## css-v1.1.8 — 2026-03-14

### Fixed

- Fixed `--color-*-fg` tokens not re-evaluating correctly in dark mode on `.color-{name}` scoped elements.
- Moved per-family foreground pivot overrides from `_color-themes.css` into light-mode-only rules in `_color-modes.css`.

## css-v1.1.6 — 2026-02-26

### Changed

- Updated typography and spacing guidance across core styles and documentation.
- Updated release automation to create descriptive GitHub release titles from `CHANGELOG.md`.

## css-v1.1.5 — 2026-02-26

### Changed

- Bumped `@tale-ui/core` to `1.1.5` with updated documentation version references.

## css-v1.1.4 — 2026-02-25

### Changed

- Bumped `@tale-ui/core` to `1.1.4` with updated documentation version references.

## css-v1.1.3 — 2026-02-25

### Changed

- Renamed npm package identity to `@tale-ui/core` across package metadata, release tooling, CI, and documentation.

## css-v1.1.2 — 2026-02-22

### Fixed

- Bumped version to match pushed tag (resolved failed publish for `v1.1.1`).

## css-v1.1.1 — 2026-02-22

### Changed

- Replaced `--brand-*` references in docs with `--color-*` for consistency.
- Improved docs navigation with sidebar synchronization.
- Updated design system guidance and AI reference.
