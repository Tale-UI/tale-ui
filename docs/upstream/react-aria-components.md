# React Aria Components Adoption Log

This document tracks how Tale UI responds to upstream `react-aria-components` releases.
It is a maintainer decision log, not a public package changelog.

Use this file to record:

- Which upstream release was reviewed.
- Which upstream changes Tale UI adopted, wrapped, documented, deferred, or rejected.
- Why each decision was made.
- Which Tale UI artifacts were updated.
- Which follow-ups remain.

Public consumer-facing changes still belong in the relevant Tale UI package changelog.
Current behavioral differences belong in [react-aria-deviations.md](../react-aria-deviations.md).

## Current Target

Tale UI targets the exact `react-aria-components` version `1.20.0`. The exact
pin protects Tale adapters that depend on the runtime and declaration shapes of
`Group`, the unstable Toast primitives, and the resolved `react-aria` stack.

Resolved workspace stack after the 1.20 adoption:

| Package                   | Version |
| ------------------------- | ------- |
| `react-aria-components`   | 1.20.0  |
| `react-aria`              | 3.51.0  |
| `react-stately`           | 3.49.0  |
| `@internationalized/date` | 3.12.3  |
| `@react-types/shared`     | 3.36.1  |

Every RAC upgrade must rerun the `Group`, unstable Toast raw-object/snapshot,
and `useMove` coupling tests before this exact pin changes. A dependency version
change alone cannot promote Toast: promotion still requires stable upstream
primitives or explicit approval to retain the unstable adapter.

## Current Component-Equivalence Decisions

| Decision ID                                       | Area                      | Decision                                                                                                                                                    |
| ------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `component-equivalence:button-group`              | ButtonGroup               | Adopt RAC 1.20.0 `Group` behind a Tale wrapper that owns naming, orientation, attached styling, and restricted render props.                                |
| `component-equivalence:preview-card`              | PreviewCard               | Adopt stable RAC 1.20.0 `PreviewTrigger` behind Tale's existing Root/Trigger/Popup/Content/Arrow namespace and existing delay defaults.                     |
| `component-equivalence:context-menu`              | ContextMenu               | Adopt RAC 1.20.0 `MenuTrigger trigger="contextMenu"` behind Tale's existing compound namespace and size context.                                            |
| `component-equivalence:toast`                     | Toast                     | Adapt `UNSTABLE_Toast` and `UNSTABLE_ToastRegion` privately, expose only Tale's queue and Region API, and retain experimental lifecycle.                    |
| `component-equivalence:resizable`                 | Resizable                 | Use direct exact `react-aria@3.51.0` `useMove` for pointer movement while Tale owns topology, keyboard behavior, projection, state, ARIA, and cancellation. |
| `component-equivalence:resizable-table-container` | `ResizableTableContainer` | Reject it as the general Resizable implementation because its contract is table-column-specific.                                                            |
| `component-equivalence:skeleton`                  | Skeleton                  | Build a Tale-owned decorative primitive; React Spectrum Skeleton is not a React Aria Components primitive and creates no RAC wrapper opportunity.           |

## How To Use This Log

For each upstream release:

1. Add a new release section at the top of [Release Entries](#release-entries).
2. Link the upstream release notes.
3. Record every relevant upstream item in one of the status tables.
4. Link the Tale UI artifacts that changed.
5. Record verification commands and known failures.
6. Move any deferred items forward until they are resolved or explicitly rejected.

## Release Entry Template

```md
## react-aria-components vX.Y.Z

Reviewed: YYYY-MM-DD
Upstream notes: https://react-aria.adobe.com/releases/vX-Y-Z
Tale UI target after review: `react-aria-components X.Y.Z`

### Maintainer Summary

| Area                | Upstream change | Tale UI action                                         |
| ------------------- | --------------- | ------------------------------------------------------ |
| New component       | ...             | Adopted/deferred/not applicable because ...            |
| New/changed feature | ...             | Adopted/documented/deferred/not applicable because ... |
| Deprecated feature  | ...             | Replacement decision and compatibility stance ...      |

### Adopted

| Upstream change | Tale UI response | Artifacts |
| --------------- | ---------------- | --------- |
| ...             | ...              | ...       |

### Documented Only

| Upstream change | Tale UI response | Rationale |
| --------------- | ---------------- | --------- |
| ...             | ...              | ...       |

### Deprecated Upstream

| Upstream deprecation | Tale UI response | Compatibility stance |
| -------------------- | ---------------- | -------------------- |
| ...                  | ...              | ...                  |

### Deferred

| Upstream change | Reason | Follow-up |
| --------------- | ------ | --------- |
| ...             | ...    | ...       |

### Not Applicable

| Upstream change | Reason |
| --------------- | ------ |
| ...             | ...    |

### Verification

- `pnpm typescript`
- `pnpm test:jsdom`
- `pnpm test:chromium`
- `pnpm test:visual`
- `pnpm generate-docs:check`
- `pnpm audit:components`
- `pnpm audit:coverage:check`
```

## Release Entries

## react-aria-components v1.20.0

Reviewed: 2026-08-02
Upstream notes: https://react-aria.adobe.com/releases/v1-20-0
Tale UI target after review: `react-aria-components 1.20.0`

### Maintainer Summary

| Area                | Upstream change                                                                                                                                                          | Tale UI action                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New component       | `PreviewTrigger` is stable, with hover, focus, long-press, safe-area, delayed-open, interactive Popover, and coordinated animation behavior.                             | Adopted behind the existing `PreviewCard` compound API while preserving Tale's 400 ms open and 300 ms close defaults.                                          |
| New component       | `TokenField` is available as an alpha component for inline tokens, autocomplete, and automatic tokenization.                                                             | Deferred until the primitive is stable and its overlap with Tale's InputTags, MultiSelect, and Autocomplete contracts can be reviewed with lifecycle evidence. |
| New/changed feature | Context-menu triggers, tab navigation within interactive Table cells, simpler keyboard shortcuts, Virtualizer item-size observation, and rewritten hook guidance landed. | Adopted context-menu and Table behavior; documented Virtualizer; hook-only changes are not applicable to Tale's component wrappers.                            |
| New/changed feature | The previously documented GridList/Tree `keyboardNavigationBehavior` and Popover `getTargetRect` APIs are now present in the published type surface.                     | Closed the 1.19 deferrals and documented the supported APIs.                                                                                                   |
| Bug fixes           | Focus, form submission, collection, date, overlay, drag-and-drop, sizing, selection, virtualizer, and input fixes landed across the resolved package stack.              | Adopted through the exact dependency update; added regression coverage where Tale computes percentage values or owns a trigger adapter.                        |
| Deprecated feature  | No new upstream deprecations were added in 1.20.0.                                                                                                                       | No deprecation choice checkpoint was required. Existing Tale compatibility decisions remain unchanged.                                                         |

### Adopted

| Upstream change                                                                                                            | Tale UI response                                                                                                                                                                                                  | Artifacts                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `react-aria-components` 1.20.0 package stack                                                                               | Pinned direct workspace dependencies to RAC 1.20.0 and updated Tale's direct dependencies to `react-aria` 3.51.0 and `@internationalized/date` 3.12.3. The lockfile resolves the full stack shown above.          | Workspace package manifests and `pnpm-lock.yaml`                                                             |
| Stable `PreviewTrigger`                                                                                                    | Replaced PreviewCard's custom timer/context implementation with RAC `PreviewTrigger`, preserving Tale's compound API, BEM classes, arrow hoisting, and delay defaults while gaining hover, focus, and long press. | `PreviewCard.styled.tsx`, tests, story, audit, component guide, golden prompt                                |
| `MenuTrigger trigger="contextMenu"`                                                                                        | Replaced ContextMenu's cursor-position virtual trigger with RAC's accessible mouse, keyboard, and touch context-menu trigger while preserving Tale's namespace and size context.                                  | `ContextMenu.styled.tsx`, tests, story, audit, component guide                                               |
| Table `keyboardNavigationBehavior="tab"`                                                                                   | Passed the published RAC prop through and added an interactive-cell example using TextField so Tab enters and moves among controls in the grid.                                                                   | Table story, audit, component guide, golden prompt                                                           |
| Meter and ProgressBar avoid `NaN` when `minValue === maxValue`                                                             | Adopted the upstream zero-percentage behavior in Tale-owned Indicator calculations and in ProgressCircle's custom percentage calculation.                                                                         | Shared `getPercentage` utility, Meter/ProgressBar/ProgressCircle implementations and tests, component guides |
| Breadcrumbs undefined `href`; Checkbox, Radio, and Switch Enter behavior; Select default type; DropZone hidden-input focus | Adopted through RAC 1.20.0 with no Tale adapter change. Checkbox Enter now permits form submission, Radio Enter no longer clears selection, and Switch ignores label keydown activation.                          | Dependency update and this log                                                                               |
| Date and DatePicker fixes                                                                                                  | Adopted millisecond clamping, language-script locale resolution, `DayOfWeek` export, and Firefox `selectionchange` focus correction through the resolved date/React Aria stack.                                   | Dependency update and this log                                                                               |
| Dialog and overlay fixes                                                                                                   | Adopted alert-dialog description behavior, Popover context overlay IDs, no-scroll focus restoration, and shadow-DOM scroll-listener behavior through the dependency update.                                       | Dependency update and this log                                                                               |
| Drag-and-drop fixes                                                                                                        | Adopted ancestor drop-target discovery and Android tap-versus-drag correction through the dependency update.                                                                                                      | Dependency update and this log                                                                               |
| Table, Tree, collection, ID, press, and virtualizer fixes                                                                  | Adopted fractional column widths, resize completion, grid-state loop, Tree checkbox/hidden-grid, React canary/Next 16 collection, FinalizationRegistry, trackpad tap, and related fixes through the stack.        | Dependency update and this log                                                                               |

### Documented Only

| Upstream change                                                  | Tale UI response                                                                                                                               | Rationale                                                                                                                                         |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GridList and Tree `keyboardNavigationBehavior`                   | Documented `"tab"` for collections containing interactive controls.                                                                            | Tale wrappers already pass the typed upstream prop through; no adapter or A2UI catalog change is required.                                        |
| Popover `getTargetRect`                                          | Documented custom target rectangles for anchored and inline-completion overlays.                                                               | Tale's Popover already passes positioning props through; the 1.19 published-package mismatch is resolved in 1.20.                                 |
| Virtualizer `shouldObserveItemSize`                              | Documented opt-in observation for rows whose dimensions can change after render.                                                               | The wrapper already passes Virtualizer props through.                                                                                             |
| ComboBox `defaultFilter` and readonly controlled multiple values | Clarified that the upstream default filter is locale-aware `contains`; the readonly controlled-array type is inherited through the dependency. | Existing Combobox composition and pass-through props need no wrapper change.                                                                      |
| Tree `TreeSectionProps` and `TreeHeaderProps`                    | Recorded that the upstream type exports exist while Tale retains its current Root/Item/ItemContent namespace.                                  | Tale does not expose standalone TreeSection or TreeHeader parts, so adding aliases solely for upstream export parity would expand the public API. |

### Deprecated Upstream

| Upstream deprecation                 | Tale UI response           | Compatibility stance                                                                                               |
| ------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| None in React Aria Components 1.20.0 | No API migration required. | Existing 1.18 deprecations for `Checkbox`, `Radio`, and `Switch` remain documented and exported for compatibility. |

### Deferred

| Upstream change    | Reason                                                                                                                             | Follow-up                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Alpha `TokenField` | Tale does not adopt alpha primitives as stable API by default, and its semantics overlap InputTags, MultiSelect, and Autocomplete. | Reassess when upstream stabilizes TokenField; compare composition, autocomplete, tokenization, accessibility, and Tale lifecycle needs. |

### Not Applicable

| Upstream change                                         | Reason                                                                                                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Simpler `useKeyboard` shortcut definitions              | Tale does not wrap or directly use `useKeyboard`; consumers using the hook receive the change from `react-aria` directly.                          |
| General React Aria hook documentation rewrite           | This changes upstream hook guidance, not Tale's component API or generated consumer guidance.                                                      |
| `useLink` `onPressChange`                               | Tale's Link wraps RAC `Link` rather than `useLink` and already inherits component-level press props.                                               |
| `@react-aria/optimize-locales-plugin` 2.0.1             | Tale does not depend on or configure the locale optimization plugin.                                                                               |
| A2UI catalog changes for the adopted pass-through props | The existing catalog represents Tale's stable serializable component surface; these DOM/navigation policy props remain React composition concerns. |

### Verification

Baseline before the dependency bump:

- `pnpm test:jsdom --no-watch`: passed, 61 files passed and 6 skipped; 696 tests passed and 27 skipped.
- `pnpm typescript`: passed.

Post-upgrade verification:

- `pnpm typescript`: passed.
- `pnpm test:jsdom --no-watch`: passed, 64 files passed and 6 skipped; 703 tests passed and 27 skipped.
- `pnpm test:chromium --no-watch`: passed, 70 files and 724 tests passed; 6 tests skipped.
- `pnpm stylelint` and `pnpm lint:css`: passed.
- `pnpm golden:validate`: passed, 161 prompts.
- `pnpm a2ui:golden:validate`: passed, 42 prompts.
- `pnpm generate-docs`, `pnpm generate-docs:check`, structural/BEM/coverage/doc audits, governance checks, and performance protection checks: passed.
- `pnpm performance:check`: passed all maintained budgets; the full React ESM bundle reports a non-blocking warning at 120,940 gzip bytes (+21.483%), so no baseline was recaptured.
- Changed-component axe scan: passed across 10 stories with one expiring `aria-allowed-attr` exception for React Aria's standards-valid `role="meter progressbar"` fallback token list; no other violations.
- `pnpm test:visual`: 88 stories passed. Four pre-existing stale snapshots fail for Select, Combobox, Autocomplete, and NumberField because their stories gained labels/default args on 2026-07-27 while the snapshots were last updated on 2026-07-06; no snapshots were updated in this upgrade.
- `pnpm eslint`: the changed files pass targeted linting. The repository-wide command remains blocked by eight pre-existing errors in unrelated React Native/foundations files.
- `pnpm audit:golden-patchability`: the new and updated prompts validate, but the full audit retains one pre-existing `ToastRegion` tag-resolution gap outside this upgrade.
- Existing manual accessibility evidence remains explicitly `pending-manual`; automated axe results are not represented as assistive-technology testing.

## react-aria-components v1.19.0

Reviewed: 2026-07-06
Upstream notes: https://react-aria.adobe.com/releases/v1-19-0
Tale UI target after review: `react-aria-components 1.19.0`

### Maintainer Summary

| Area                | Upstream change                                                                                                                                                                                                                                                                                                                                                                                           | Tale UI action                                                                                                                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New component       | No new `react-aria-components` exports or component parts were added in this release.                                                                                                                                                                                                                                                                                                                     | Not applicable.                                                                                                                                                                                                                                               |
| New/changed feature | React Aria Components now resolves with `react-aria` 3.50.0, `react-stately` 3.48.0, and `@react-types/shared` 3.36.0. Menu collection `onAction` now receives key and value. CalendarYearPicker includes the `maxValue` year. Autocomplete has CJK IME virtual-focus and inline-completion documentation updates. `DragTypes.has()` accepts multiple types. General focus/test-environment fixes landed. | Adopted the dependency stack, documented the Menu callback shape and Autocomplete controlled-input guidance, and kept existing Calendar/Autocomplete wrappers passing RAC behavior through.                                                                   |
| New/changed feature | Release notes describe `keyboardNavigationBehavior` for GridList and Tree, and `getTargetRect` for Popover.                                                                                                                                                                                                                                                                                               | Deferred because the installed npm package for `react-aria-components@1.19.0` and its resolved `react-aria@3.50.0` type/dist files do not expose those prop names. Tale UI should not document examples that do not type-check against the published package. |
| Deprecated feature  | No new upstream deprecations were listed for React Aria Components 1.19.0.                                                                                                                                                                                                                                                                                                                                | No deprecation checkpoint was required. Existing Tale UI deprecations from 1.18.0 remain unchanged.                                                                                                                                                           |
| Breaking change     | `@react-aria/optimize-locales-plugin` moved to a new major version for `unplugin@2` and Node 26 compatibility, with a webpack 4 compatibility warning.                                                                                                                                                                                                                                                    | Not applicable: Tale UI does not depend on or configure `@react-aria/optimize-locales-plugin`.                                                                                                                                                                |

### Adopted

| Upstream change                                                     | Tale UI response                                                                                                                                                                                                                                                                                                        | Artifacts                                                                                                                |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `react-aria-components` 1.19.0 package stack                        | Pinned every direct workspace `react-aria-components` dependency to `1.19.0` and added exact direct `react-aria@3.50.0` ownership for Resizable. The lockfile resolves `react-aria-components` 1.19.0, `react-aria` 3.50.0, `react-stately` 3.48.0, `@internationalized/date` 3.12.2, and `@react-types/shared` 3.36.0. | `packages/react/package.json`, `docs/package.json`, `apps/*/package.json`, `playground/*/package.json`, `pnpm-lock.yaml` |
| Menu collection `onAction` receives both key and value              | `Menu.MenuList` already passes React Aria menu props through. Documented the 1.19 callback shape and clarified the difference between collection-level and item-level callbacks.                                                                                                                                        | `docs/components/menu.md`                                                                                                |
| CalendarYearPicker includes `maxValue` year in the selectable range | Existing `Calendar.YearPicker` and `RangeCalendar.YearPicker` wrappers use RAC `CalendarYearPicker`, so the fix is adopted through the dependency update with no Tale UI wrapper change.                                                                                                                                | Dependency update, this log                                                                                              |
| Autocomplete CJK IME virtual focus fix                              | Existing Autocomplete wrapper uses RAC `Autocomplete`, `SearchField`, `Input`, and `ListBox`, so the bug fix is adopted through the dependency update.                                                                                                                                                                  | Dependency update, this log                                                                                              |
| General focus and test-environment crash fixes                      | Adopted through the resolved `react-aria` 3.50.0 dependency; no Tale UI API or CSS change required.                                                                                                                                                                                                                     | Dependency update, this log                                                                                              |

### Documented Only

| Upstream change                              | Tale UI response                                                                                                                                                                                                               | Rationale                                                                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autocomplete inline-completion documentation | Updated Tale UI Autocomplete guidance to state that `inputValue`, `defaultInputValue`, and `onInputChange` are valid controlled input props, and narrowed the old controlled-state pitfall to selection/open-state props only. | The Tale UI wrapper already passes these props through. Full popover-positioned mention completion remains deferred until RAC publishes the `getTargetRect` prop in package types/dist. |

### Deprecated Upstream

| Upstream deprecation                 | Tale UI response           | Compatibility stance                                                                                               |
| ------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| None in React Aria Components 1.19.0 | No API migration required. | Existing 1.18 deprecations for `Checkbox`, `Radio`, and `Switch` remain documented and exported for compatibility. |

### Deferred

| Upstream change                       | Reason                                                                                                                                                                                                          | Follow-up                                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| GridList `keyboardNavigationBehavior` | The 1.19 release notes and docs describe the prop, but the installed `react-aria-components@1.19.0` / `react-aria@3.50.0` package files do not expose `keyboardNavigationBehavior` in type or dist output.      | Re-check on the next RAC patch/minor and document or adopt once the published package exposes the prop.                     |
| Tree `keyboardNavigationBehavior`     | Same published-package mismatch as GridList.                                                                                                                                                                    | Re-check on the next RAC patch/minor and document or adopt once the published package exposes the prop.                     |
| Popover `getTargetRect`               | The release notes and docs describe the prop for inline completions, but the installed `react-aria-components@1.19.0` / `react-aria@3.50.0` package files do not expose `getTargetRect` in type or dist output. | Re-check on the next RAC patch/minor before adding Tale UI inline-completion examples or guidance that relies on this prop. |

### Not Applicable

| Upstream change                                                                                      | Reason                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@react-aria/optimize-locales-plugin` major version, tree-shaking, and Node 26 compatibility changes | Tale UI does not depend on or configure this plugin.                                                                                                          |
| `tailwindcss-react-aria-components` `not-*` variants                                                 | Tale UI does not depend on this Tailwind plugin.                                                                                                              |
| `DragTypes.has()` accepting multiple MIME types and wildcards                                        | Tale UI does not expose drag-and-drop helper APIs directly; existing component props continue to accept React Aria drag-and-drop hooks supplied by consumers. |

### Verification

Baseline before the dependency bump:

- `pnpm test:jsdom --no-watch`: passed, 37 files passed and 7 skipped.
- `pnpm typescript`: passed.

Post-upgrade verification:

- `pnpm typescript`: passed after the dependency update.
- `pnpm test:jsdom --no-watch`: passed, 37 files passed and 7 skipped.
- `pnpm test:chromium --no-watch`: passed, 44 files passed.
- `pnpm eslint`: passed.
- `pnpm stylelint`: passed.
- `pnpm lint:css`: passed.
- `pnpm generate-docs`: passed.
- `pnpm generate-docs:check`: passed.
- `pnpm audit:components`: passed with 32 warning-only findings across 11 components.
- `pnpm audit:bem`: passed.
- `pnpm audit:coverage:check`: passed.
- `pnpm audit:snippet-kinds`: passed.
- `pnpm pitfalls:audit`: passed after correcting pre-existing pitfall-shape metadata in CommandPalette, KeyValuePairs, ListBox, and Virtualizer docs.
- `pnpm golden:validate`: passed, 138 of 138 prompts.
- `pnpm a2ui:golden:validate`: passed, 42 of 42 prompts.
- `pnpm test:visual`: initially reported 11 small field-control snapshot diffs from the RAC dependency update; inspected as intended intrinsic width/text-rendering changes, updated the 11 affected baselines, and reran successfully with 47 of 47 tests passing.

## react-aria-components v1.18.0

Reviewed: 2026-06-13
Upstream notes: https://react-aria.adobe.com/releases/v1-18-0
Tale UI target after review: `react-aria-components ^1.18.0`

### Maintainer Summary

| Area                | Upstream change                                                                                                                                                                                                                                                                                | Tale UI action                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New component       | `CalendarHeading`, `CalendarMonthPicker`, `CalendarYearPicker`, `TableFooter`, `SliderFill`, `CheckboxField`, `CheckboxButton`, `RadioField`, `RadioButton`, `SwitchField`, `SwitchButton`                                                                                                     | Adopted, except button primitives were exposed through Tale UI field namespaces rather than standalone exports.                                                                  |
| New/changed feature | Calendar multiple selection typing, `Calendar.Grid` `weeksInMonth`, `RangeCalendar` `anchorDate`, `Popover` `--trigger-width`, expandable table row state, Slider range output formatting, primitive collection values, and several ComboBox/Select/Menu/NumberField/Tabs/TextField/Tree fixes | Adopted or documented where the change affects Tale UI public APIs, docs, examples, or regression coverage. Bug fixes were validated without wrapper changes unless noted below. |
| Deprecated feature  | RAC deprecated `Checkbox`, `Radio`, and `Switch` in favour of field/button pairs                                                                                                                                                                                                               | Tale UI kept the old exports for backwards compatibility, marked them deprecated, and promoted `CheckboxField`, `RadioField`, and `SwitchField` for new code.                    |

### Adopted

| Upstream change                                              | Tale UI response                                                                                                                                                    | Artifacts                                                                                                                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CalendarHeading`                                            | Wrapped as `Calendar.Heading` and `RangeCalendar.Heading`. Replaced the previous plain heading wrapper so RAC formats visible month/year text and supports offsets. | `packages/react/src/calendar/Calendar.styled.tsx`, `packages/react/src/range-calendar/RangeCalendar.styled.tsx`, component docs, Storybook, ComponentAudit |
| `CalendarMonthPicker`                                        | Wrapped as `Calendar.MonthPicker` with a Tale UI styled native select default and a render-prop escape hatch that receives the BEM class.                           | `Calendar.styled.tsx`, `packages/styles/src/calendar.css`, `docs/components/calendar.md`, `Calendar.stories.tsx`, ComponentAudit                           |
| `CalendarYearPicker`                                         | Wrapped as `Calendar.YearPicker` with a Tale UI styled native select default and a render-prop escape hatch that receives the BEM class.                            | `Calendar.styled.tsx`, `packages/styles/src/calendar.css`, `docs/components/calendar.md`, `Calendar.stories.tsx`, ComponentAudit                           |
| `TableFooter`                                                | Wrapped as `Table.Footer`, rendering a `<tfoot>` for totals and summary rows.                                                                                       | `packages/react/src/table/Table.styled.tsx`, `packages/styles/src/table.css`, `docs/components/table.md`, `Table.stories.tsx`, ComponentAudit              |
| `SliderFill`                                                 | Adopted behind the existing `Slider.Indicator` API. This keeps Tale UI's public part name stable while gaining RAC's RTL-aware fill and range-fill behavior.        | `packages/react/src/slider/Slider.styled.tsx`, `docs/components/slider.md`, `Slider.stories.tsx`, ComponentAudit                                           |
| `CheckboxField` and `CheckboxButton`                         | Added `CheckboxField` as a new Tale UI component namespace with `Root`, `Button`, `Indicator`, `Description`, and `Error` parts.                                    | `packages/react/src/checkbox-field/`, `packages/styles/src/checkbox-field.css`, docs, Storybook, ComponentAudit, golden prompt                             |
| `RadioField` and `RadioButton`                               | Added `RadioField` as a new Tale UI component namespace with `Root`, `Button`, `Indicator`, `Dot`, `Description`, and `Error` parts.                                | `packages/react/src/radio-field/`, `packages/styles/src/radio-field.css`, docs, Storybook, ComponentAudit, golden prompt                                   |
| `SwitchField` and `SwitchButton`                             | Added `SwitchField` as a new Tale UI component namespace with `Root`, `Button`, `Thumb`, `Description`, and `Error` parts.                                          | `packages/react/src/switch-field/`, `packages/styles/src/switch-field.css`, docs, Storybook, ComponentAudit, golden prompt                                 |
| Calendar `selectionMode="multiple"`                          | Made `Calendar.Root` generic so multiple-selection value typing flows through. Documented that `value`, `defaultValue`, and `onChange` use arrays in multiple mode. | `Calendar.styled.tsx`, `docs/components/calendar.md`, `Calendar.test.tsx`                                                                                  |
| `Calendar.Grid` `weeksInMonth`                               | Documented as a pass-through RAC prop.                                                                                                                              | `docs/components/calendar.md`                                                                                                                              |
| `RangeCalendar` `anchorDate`                                 | Documented as a pass-through RAC argument for availability logic.                                                                                                   | `docs/components/range-calendar.md`                                                                                                                        |
| `Popover` `--trigger-width`                                  | Documented the new CSS custom property behavior.                                                                                                                    | `docs/components/popover.md`                                                                                                                               |
| `Table.Row` render-prop `state` and expandable table support | Documented RAC table additions including expandable rows and `treeColumn`.                                                                                          | `docs/components/table.md`                                                                                                                                 |
| `SliderOutput` range formatting                              | Documented through updated Slider examples and notes.                                                                                                               | `docs/components/slider.md`, `Slider.stories.tsx`                                                                                                          |

### Deprecated Upstream

| Upstream deprecation                                    | Tale UI response                                                                                          | Compatibility stance                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `Checkbox` deprecated in `react-aria-components` 1.18.0 | Kept `Checkbox` exported, marked it deprecated, and added `CheckboxField` as the recommended replacement. | Backwards compatible; prefer `CheckboxField` for new code. |
| `Radio` deprecated in `react-aria-components` 1.18.0    | Kept `Radio` exported, marked it deprecated, and added `RadioField` as the recommended replacement.       | Backwards compatible; prefer `RadioField` for new code.    |
| `Switch` deprecated in `react-aria-components` 1.18.0   | Kept `Switch` exported, marked it deprecated, and added `SwitchField` as the recommended replacement.     | Backwards compatible; prefer `SwitchField` for new code.   |

### Documented Only

| Upstream change                                                  | Tale UI response                                                                                                                                               | Rationale                                                                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Collections can accept primitive item values                     | No Tale UI wrapper change required.                                                                                                                            | Existing wrappers already pass collection props through; document only if a component guide needs an example.   |
| ComboBox, Select, Menu, NumberField, Tabs, TextField, Tree fixes | No dedicated wrapper changes unless existing tests or visual baselines exposed a shift.                                                                        | These were upstream bug fixes or internal behavior fixes. Tale UI validated with type, unit, and visual suites. |
| ColorPicker nesting behavior fixed in 1.18.0                     | Updated deviations documentation and added a regression test showing `ColorSlider.Root` can render inside `ColorPicker.Root`.                                  | This removes a former Tale UI caveat rather than adding a new public API.                                       |
| `FieldError` referenced in the 1.18 form-field examples          | No standalone Tale UI `FieldError` component was added. Existing Tale UI components already expose component-specific `Error` parts wrapping RAC `FieldError`. | `FieldError` already existed before 1.18 and Tale UI already wraps it where needed.                             |

### Deferred

| Upstream change                                              | Reason                                                                                                               | Follow-up                                     |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| RAC 1.17 sub-path imports, e.g. `react-aria-components/Menu` | Tree-shaking-only change with broad import churn across wrappers. Not required for correctness of the 1.18 adoption. | Track as a separate import optimization task. |
| React Aria test utils RC                                     | Tale UI does not currently use `@react-aria/test-utils` as the core test harness.                                    | Revisit only if the test strategy changes.    |

### Not Applicable

| Upstream change                                                | Reason                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `mergeRefs` re-export from `react-aria`                        | Tale UI uses its own local utilities and does not need a public API change.                      |
| React Aria documentation-only updates, e.g. Link routing guide | No Tale UI component API or docs change required unless a Tale UI guide adopts the same pattern. |
| Internal optimize-locales and virtualizer fixes                | No Tale UI wrapper action required beyond dependency resolution and regression testing.          |

### Verification

Passed on the final migration tree:

- `pnpm typescript`
- `pnpm lint:css`
- `pnpm generate-docs:check`
- `pnpm registry:check`
- `pnpm audit:components`
- `pnpm audit:docs`
- `pnpm audit:bem`
- `pnpm audit:brand`
- `pnpm audit:coverage:check`
- `pnpm audit:snippet-kinds`
- `pnpm golden:validate`
- `pnpm a2ui:golden:validate`
- `pnpm test:jsdom`
- `pnpm test:chromium`
- `pnpm test:visual`

Known unrelated or pre-existing failures at the time of adoption:

- `pnpm test:regressions` failed because `test/regressions/postcss.config.js` references missing PostCSS plugins not present in the lockfile.
- `pnpm eslint` had a broad pre-existing lint backlog.
- `pnpm stylelint` had a broad pre-existing lint backlog.
