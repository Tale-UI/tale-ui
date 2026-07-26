# Changelog — @tale-ui/react

All notable changes to the React component library are documented in this file.

## v3.0.0 — 2026-07-27

### Added

- Added experimental `AspectRatio`, `Blockquote`, `ButtonGroup`, `Code`, and `Skeleton` public
  subpaths with runtime validation, safe DOM ownership, SSR/hydration coverage, and public type
  contracts.
- Added experimental `Citation`, `Markdown`, `Outline`, and `Timestamp` public subpaths with
  bounded parsing, normalized source identity, deterministic observer/state ownership, explicit
  localization, shared scheduling, and public type contracts.
- Added experimental `OverflowList`, `Resizable`, and `Lightbox` public subpaths with measured
  partitioning, bounded gesture ownership, localized overlay navigation, and public type
  contracts.
- Added experimental `Toast` with a stable Tale queue facade, private React Aria adaptation,
  atomic mirror recovery, Tale-owned timers and announcements, Region leases, and public type
  contracts.

### Changed

- Set the consumer runtime requirement to Node 18+ while retaining React 17, 18, and 19 peers.
- Pinned `react-aria-components` exactly to 1.19.0 and added exact direct
  `react-aria@3.50.0` ownership for the expansion adapters.
- Migrated TextEditor, IPhoneMockup, FileUpload, InputTags, MultiSelect, and TagSelect from direct
  `React.useId` calls to Tale UI's React-17-compatible ID utility.
- Prevented IPhoneMockup's React 17 server render from emitting unresolved `undefined-*` SVG
  references; hydration assigns collision-free instance IDs.
- Added public-type, dependency-coupling, package-export, and packed-consumer release gates.
- Removed FileUpload's optional Motion peer and layout wrapper so every declared
  React 17/18/19 consumer can install and render the subpath under strict peer
  validation.
- Added a React 17 hydration boundary around TagSelect's RAC hidden collection:
  the closed field hydrates deterministically before client-side enhancement.

## v2.0.0 — 2026-07-24

### Changed

- Replaced the `@tale-ui/core` dependency with `@tale-ui/css`.
- Updated package metadata for the renamed `Tale-UI/tale-ui` repository.

### Notes

- No React component APIs changed.

## v1.3.56 — 2026-07-16

### Added

- **Card.Button**: Added an accessible React Aria-backed interactive Card variant with press,
  keyboard, disabled, focus, and selected-state support for composable selection surfaces.

### Changed

- **Menu composition**: Clarified ContextMenu and Menubar composition contracts and synchronized
  their generated component guidance.
- **Docs and evaluation guidance**: Added Card.Button stories, component audit coverage, API docs,
  registry metadata, and a selectable-card golden prompt.
- **Package alignment**: Aligned `@tale-ui/react` with `@tale-ui/core`, `@tale-ui/utils`,
  `@tale-ui/react-styles`, and `@tale-ui/themes` for the coordinated public release.

## v1.3.55 — 2026-07-06

### Changed

- **React Aria Components**: Upgraded the React wrapper dependency stack to `react-aria-components` `^1.19.0`, with matching generated docs and registry metadata.
- **Autocomplete**: Clarified controlled input guidance for `inputValue` and `onInputChange` after the upstream inline-completion documentation update.
- **Tabs**: Added regression coverage for pill tabs with indicators so the indicator owns the selected surface while indicatorless pill tabs keep their fallback selected styling.
- **Package alignment**: Aligned `@tale-ui/react` with `@tale-ui/core`, `@tale-ui/react-styles`, and `@tale-ui/utils` for the coordinated public package release.

### Notes

- No Tale UI React component API changes.

## v1.3.54 — 2026-06-30

### Changed

- **Rem base compatibility**: Updated package guidance, generated docs, and registry metadata for the standard Tale UI rem contract shared with `@tale-ui/core`.
- **Package alignment**: Aligned `@tale-ui/react` with `@tale-ui/core`, `@tale-ui/react-styles`, and `@tale-ui/utils` for the coordinated public package release.

### Notes

- No React component API changes.

## v1.3.53 — 2026-06-26

### Changed

- **Button styling**: Version aligned with `@tale-ui/react-styles` for the neutral button visual update. No React component API changes.

## v1.3.52 — 2026-06-21

### Added

- **CommandPalette**: Added command palette component support and docs for command-driven workflows.
- **ListBox / Virtualizer**: Added exports and documentation for listbox and virtualized collection usage.
- **KeyValuePairs**: Added display component for compact label/value metadata.
- **Link / Tabs**: Added icon slot support for links and tab triggers.

### Changed

- **Link**: Underlines text links by default unless icon-only presentation is used.
- **Recipes / Studio**: Updated recipe context handling, deep links, and theme toggle support across studio demos.

## v1.3.50 — 2026-05-25

### Added

- **Dropdown menus**: Added compact size variants across autocomplete, combobox, context menu, menu, multi-select, and select.

## v1.3.49 — 2026-05-24

### Added

- **ColorSwatch**: Added shape and split-color support for richer color previews.

### Changed

- **ColorSwatchPicker**: Updated swatch picker rendering to support the new swatch presentation options.
- **Docs / Registry**: Refreshed component docs, pitfall content, and generated registries for the updated color swatch behavior.

## v1.3.48 — 2026-05-07

### Changed

- **`EvalReview`**: Regenerated A2UI eval review demo with updated component showcase.
- **Docs**: Updated `section-divider.md` pitfalls.
- **Registry**: Refreshed `components.json` and `pitfalls.json`.

## v1.3.47 — 2026-05-03

### Changed

- **Docs**: Updated component docs across 30+ components with new pitfalls surfaced by golden prompt eval runs (autocomplete, card, drop-zone, field, file-trigger, image-cropper, input-tags, pin-input, popover, progress-circle, radio, section-divider, select, switch, text, text-editor, toggle-group, and more).
- **Registry**: Refreshed `components.json`, `pitfalls.json`, and `a2ui-catalog.json` to reflect doc updates.

## v1.3.46 — 2026-04-26

### Changed

- **MCP server**: Refactored `mcp-server.mjs` into a thin protocol wrapper around new `mcp-core.mjs`. Build script now bundles both files so the consumer-installed `tale-ui-mcp` binary works correctly.
- **Pitfall content**: Expanded pitfall coverage across most components and recipes (sourced from canonicalized docs).

## v1.3.45 — 2026-04-18

### Fixed

- **`CreditCard`**: Round scaled dimensions with `Math.ceil` so the wrapper fully contains the scaled visual at fractional widths.
- **`Calendar` / `RangeCalendar`**: Tightened prev/next button selectors to `.tale-button.tale-button--ghost.tale-calendar__*` to avoid leaking `box-sizing`, `padding`, and `min-height` resets onto unrelated buttons.
- **`FileUpload`**: Layout, sizing, and spacing improvements; added `box-sizing: border-box` and minimum height.
- **`NumberField`**, **`Slider`**, **`PaginationLine`**: Minor CSS corrections.
- **`Banner`**, **`Tabs`**: Token and layout fixes.
- **`_primitives.css`**: Strengthened focus-ring glow opacity; updated field/popup background and border tokens.

### Added

- Unit tests for `Calendar`, `CreditCard`, `FileUpload`, `NumberField`, `PaginationLine`, and `Slider`.

## v1.3.44 — 2026-04-14

### Changed

- **`setup.mjs`**: Added step 0 to the consumer CLAUDE.md snippet — instructs Claude Code to use `ToolSearch` to load deferred MCP tool schemas before invoking `mcp__tale-ui__plan_ui` and `mcp__tale-ui__get_component`.

## v1.3.43 — 2026-04-14

### Added

- **MCP server bundled**: `mcp-server.mjs` is now included in the published package with a `tale-ui-mcp` bin entry. Run `npx tale-ui-mcp` or configure it directly in `.mcp.json`.
- **`setup.mjs` auto-configures `.mcp.json`**: Running `npx tale-ui-setup` now also writes the Tale UI MCP server entry into `.mcp.json` (creating the file if needed).
- **Dependencies**: Added `@modelcontextprotocol/sdk` and `zod` as runtime dependencies for the bundled MCP server.

### Fixed

- **`setup.mjs`**: Fixed early-exit bug — script was exiting without writing when the snippet was already present, rather than skipping the write and continuing to configure `.mcp.json`.
- **`setup.mjs`**: Fixed doc path reference (`docs/components/{name}.md`).

## v1.3.42 — 2026-04-04

### Added

- **Re-exports from react-aria-components**: Color component packages now re-export `parseColor` and `Color` type so consumers no longer need a direct `react-aria-components` import. Affected packages: `@tale-ui/react/color-area`, `/color-slider`, `/color-wheel`, `/color-swatch`, `/color-picker`.
- **`@tale-ui/react/aria` barrel**: New entry point re-exporting all consumer-facing helpers: `parseColor`, `useFilter`, and types `Color`, `Key`, `Selection`, `SortDescriptor`, `DateValue`, `TimeValue`.
- **`useFilter` re-export**: Available from `@tale-ui/react/autocomplete` and `@tale-ui/react/combobox`.
- **Type re-exports**: `Selection`, `Key`, `SortDescriptor` from `@tale-ui/react/table`; `DateValue`/`TimeValue` from date/time packages.

## v1.3.41 — 2026-03-31

### Changed

- **Banner.test.tsx:** Updated tests to reflect current BEM class output (info variant now always applies `tale-banner--info`; color variants use `color-*` theme class).

## v1.3.40 — 2026-03-31

### Added

- **A2UI:** Expanded catalog with new component types, enhanced renderer, validation, and system prompt.
- **A2UI Chat Demo** in Vite playground.
- **MCP Server:** Added A2UI catalog tools (`list_a2ui_types`, `get_a2ui_type`, `get_a2ui_example`).

### Changed

- Consumer CLAUDE.md snippet updated.

## v1.3.39 — 2026-03-30

### Changed

- **Badge:** Simplified to use `.tale-badge--color` + `.color-*` theme classes instead of 20 individual variant CSS classes. Background uses `color-mix(in srgb, var(--color-60) 15%, var(--neutral-5))`.
- **Banner:** Info variant now applies `.tale-banner--info` class and uses neutral tokens (dark background, light text). Action buttons and close button styled for visibility on dark background.

### Fixed

- **NavigationMenu:** Dropdown demo in ComponentAudit now toggles on click instead of being always open.

## v1.3.38 — 2026-03-29

### Added

- **ProgressCircle** component with size, colour, and indeterminate variants.
- **Pagination** Dot and Line sub-parts added to index.
- AllVariations Storybook story for all 78 components.
- Enhanced component docs: Checkbox, Field, PreviewCard, Radio, SelectNative, SocialButton, Switch.

### Changed

- **Storybook** upgraded from 8.6.14 to 10.3.3; onboarding checklist hidden.
- **Banner**, **CheckboxGroup**, **Checkbox**, **PreviewCard**, **Radio**, **ScrollArea**, **SelectNative**, **SocialButton**, **Switch** — refined styled components and JSDoc.
- Updated `_primitives.css`, icon-button, rating-stars, scroll-area, select-native, social-button, switch, tabs, toggle-button CSS.
- Consumer setup guide (`react-setup.md`) updated.
- Color themes CSS updated.

## v1.3.37 — 2026-03-27

### Changed

- **Playground:** Expanded Scale component preview, added Component Audit palette grid, and fixed CSS override scoping.
- Root `package.json`: added `dev:all` and `open:dev-urls` scripts for parallel Storybook/Scale/Playground development.

## v1.3.36 — 2026-03-27

### Added

- **Button:** `inverse` variant for use on dark/coloured backgrounds.
- Comprehensive component audit system in `tools/` with brand-token, docs, and BEM audit scripts.
- Monorepo tools documented in `tools/README.md`.

### Changed

- **Slider** and **Combobox** styles refined.
- Scale playground: border radius curvature control added.
- Dead `ComponentsDemo` route removed from playground.
- 9 new gap-analysis components (AppStoreButton, Badge, DotIcon, FeaturedIcon, PaymentInput, RatingBadge, RatingStars, SelectNative, SocialButton) plus Avatar enhancements.

## v1.3.35 — 2026-03-27

### Added

- **Banner**, **Carousel**, **EmptyState**, **PinInput**, and **Spinner** components with full styled sub-components, CSS, docs, Storybook stories, and ComponentAudit entries.
- **Tabs.test.tsx** and **ColorModeToggle.test.tsx** unit tests.
- `docs/component-index.md` — all 73 components at a glance.
- `docs/recipes/` — copy-paste multi-component patterns.
- `llms-full.txt` — full AI reference including all component docs.
- Pagination triggers updated to use `Icon` component.
- `idx` audit column added to CLAUDE.md component table.

### Changed

- GridList styled sub-components and stories updated.
- Consumer CLAUDE.md snippet: added `IconButton` aria-label pitfall and token size suffix notes.
- CI workflow updated.
- Many component docs updated with additional usage notes and CSS class tables.

## v1.3.34 — 2026-03-26

### Fixed

- **JSDoc examples:** CheckboxGroup now shows Icon+check inside Indicator; DateRangePicker dash marked `aria-hidden`; Fieldset gets `@example` block; ProgressBar and Slider examples wrap Label/Value in Header.
- **Styles:** Accordion header heading margins reset; textarea `box-sizing: border-box`; fieldset legend `border: none` in primitives reset.

## v1.3.33 — 2026-03-26

### Added

- **Icon** and **IconButton** components with lucide-react integration for consistent icon rendering and accessible icon-only buttons.
- **CSPProvider**, **I18nProvider**, and **mergeProps** utility now have dedicated docs and JSDoc.
- **PreviewCard** styled sub-components (Trigger, Popover, Content, Heading, Avatar).
- New component docs for Icon, IconButton, CSPProvider, I18nProvider, mergeProps, RadioGroup, and ToggleGroup.

### Changed

- **IconButton** now requires `aria-label` — enforced via TypeScript prop type.
- **CheckboxGroup** and **RadioGroup** accept top-level `label` and `description` props.
- Accordion, AlertDialog, Calendar, Combobox, DatePicker, DateRangePicker, Dialog, NavigationMenu, NumberField, Popover, RangeCalendar, SearchField, and Select components updated to use `Icon` sub-components internally.
- Docs, JSDoc, Storybook stories, and ComponentAudit aligned across all 67 components.
- Consumer CLAUDE.md snippet expanded with token size suffix, layout utility, and Select.placeholder pitfalls.
- Removed example apps (vite-css, tanstack-start-tailwind-css) in favour of docs.

### Fixed

- Dialog close button and Drawer popup spacing tightened in styles.

## v1.3.32 — 2026-03-25

### Fixed

- **Packaging:** `@tale-ui/react/styles` CSS import was missing from the published tarball. The build script now handles object-form CSS exports (`{ types, default }`) in addition to plain string exports.

## v1.3.31 — 2026-03-25

### Changed

- **Select:** Moved `placeholder` prop from `Select.Value` to `Select.Root` for cleaner API.
- **CheckboxGroup / RadioGroup:** Added `label` and `description` props.
- **Styles export:** Added TypeScript declaration for `@tale-ui/react/styles` CSS import.

### Docs

- Consumer CLAUDE.md snippet: added Select placeholder, token size suffix, and layout utility pitfalls.
- Updated Select component docs and stories to use new placeholder location.

## v1.3.30 — 2026-03-25

### Fixed

- Postinstall setup script (`setup.mjs`) now includes the trigger component pitfall — trigger components render their own `<button>`, never nest a `<Button>` inside them.

## v1.3.29 — 2026-03-25

### Docs

- Updated consumer CLAUDE.md snippet: added pitfall about trigger components rendering their own `<button>` — never nest a `<Button>` inside them.

## v1.3.28 — 2026-03-25

### Fixed

- **Container:** Per-shade foreground token overrides for light-coloured palettes. The `Container` component now computes WCAG contrast ratios for each palette shade and overrides `--color-*-fg` tokens where the non-default endpoint provides better contrast, ensuring readable text on every shade — including `random` and all named colour palettes.
