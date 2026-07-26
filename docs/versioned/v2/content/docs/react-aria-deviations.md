# React Aria Deviations

Tale UI wraps React Aria Components (RAC) but adds, changes, or replaces behaviour in several places. This document is the single reference for every deviation a consumer or agent needs to know about.

Tale UI currently targets **react-aria-components ^1.19.0**.

Each deviation below includes the rationale for the Tale UI choice. When a deviation exists because React Aria Components deprecated an upstream primitive, the deprecation version is called out explicitly.

## Quick Reference

| Deviation                                     | Impact                                     | Rationale                                                                 | Details                                                                     |
| --------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Drawer uses `open`, not `isOpen`              | **High** — wrong prop silently fails       | Drawer is a custom bottom-sheet primitive, not a RAC Dialog wrapper       | [Drawer-specific differences](#drawer-specific-differences)                 |
| Drawer.Backdrop is a sibling, not a wrapper   | **High** — wrong nesting breaks close      | Sibling topology keeps swipe/transition layers independent                | [Backdrop/Popup nesting](#backdroppopup-nesting-rules)                      |
| IconButton defaults to `variant="ghost"`      | **Medium** — unexpected appearance         | Icon-only controls are usually secondary chrome, not primary actions      | [variant prop](#variant-prop)                                               |
| Never nest `<Button>` inside a Trigger        | **High** — invalid HTML `<button><button>` | RAC triggers already render interactive elements                          | [Trigger styling](#trigger-button-styling-differences)                      |
| Checkbox.Indicator needs explicit Icon child  | **Medium** — missing checkmark             | Consumers can choose the check/indeterminate glyph to match their context | [Auto-rendered icons](#auto-rendered-icons)                                 |
| Pass `value` to both Meter.Root AND Indicator | **Medium** — bar appears empty             | RAC exposes percentage by render prop, while Tale UI keeps a composable part | [Meter/ProgressBar](#meter-and-progressbar-value-passing)                 |
| 20+ parts auto-render Lucide icons            | **Low** — override by passing children     | Common controls should work with minimal boilerplate                      | [Auto-rendered icons](#auto-rendered-icons)                                 |
| 7 components are NOT built on React Aria      | **Medium** — no RAC keyboard/ARIA          | These are presentational, token, or custom-interaction components         | [Not built on RAC](#components-not-built-on-react-aria)                     |
| AlertDialog should NOT have a Close button    | **Medium** — defeats acknowledgement UX    | Alert dialogs should force an explicit safe/destructive choice            | [AlertDialog vs Dialog](#alertdialog-vs-dialog-semantics)                   |
| Checkbox/Radio/Switch deprecated upstream     | **Low** — still functional                 | Mirrors React Aria Components 1.18.0 deprecations                         | [Deprecated form controls](#deprecated-form-controls-checkbox-radio-switch) |

---

## Components NOT built on React Aria

These components are fully custom — they do not use React Aria and do not inherit its keyboard navigation, ARIA attributes, or focus management. The rationale is that no RAC primitive provides meaningful behaviour for these cases, or Tale UI needs behaviour outside RAC's responsibility.

| Component           | What it uses instead                                                                                                                          | Rationale                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Drawer**          | Custom context + plain HTML `<button>` / `<div>` elements with manual transition state                                                        | Bottom-sheet drag/swipe affordances, backdrop layering, and open-state semantics are custom      |
| **NavigationMenu**  | Plain `<nav>`, `<ul>`, `<li>`, `<button>`, `<a>` HTML elements                                                                                | Header/site navigation should keep native navigation semantics instead of menu/listbox semantics |
| **ScrollArea**      | Plain `<div>` elements with CSS-driven scrollbar styling                                                                                      | It is a styling wrapper for overflow, not an interactive widget                                  |
| **Avatar**          | Plain `<span>` / `<img>` elements                                                                                                             | It is presentational image/fallback rendering with no RAC behaviour to inherit                   |
| **Icon**            | Renders the Lucide SVG component directly with BEM sizing classes                                                                             | It is presentational SVG output; RAC has no icon primitive                                       |
| **Container**       | Plain `<div>` that sets `--color-*` CSS custom properties                                                                                     | It scopes design tokens and layout only                                                         |
| **ColorModeToggle** | Wraps RAC Switch but removes `isSelected`/`onChange` (managed internally) and adds side effects (localStorage, `data-color-mode` on `<html>`) | Theme mode is global application state, so the switch is controlled internally                   |

### Drawer-specific differences

Drawer's API intentionally diverges from Dialog/AlertDialog:

- Uses **`open`** / `onOpenChange`, NOT `isOpen` / `onOpenChange`.
- `Drawer.Backdrop` must be a **self-closing sibling** of `Drawer.Popup`, not a wrapper around it (opposite of `Dialog.Backdrop`).
- There is **no `Drawer.Actions`** part. Wrap action buttons in a plain `<div>`.
- Trigger and Close are plain `<button>` elements, not RAC Button.
- Custom sub-parts with no RAC equivalent: `Drawer.Handle`, `Drawer.SwipeArea`.

Rationale: Drawer is implemented as a custom bottom-sheet/sheet primitive rather than a RAC Dialog wrapper. The API preserves the existing Tale UI controlled-state contract (`open`), keeps backdrop and popup transitions independent, and exposes swipe-specific sub-parts that do not exist in RAC.

### NavigationMenu-specific differences

- No automatic keyboard navigation or ARIA widget behaviour.
- Consumer must manage dropdown open/close state manually.
- `NavigationMenu.Icon` auto-renders a ChevronDown from Lucide.

Rationale: NavigationMenu models site/header navigation, where native links and buttons are more appropriate than forcing menu widget semantics. The built-in icon keeps repeated disclosure affordances consistent while still allowing consumers to override it.

---

## Custom props not in React Aria

### `variant` prop

Added to **Button** and **IconButton**. RAC does not have a variant concept.

Rationale: variants encode Tale UI's visual hierarchy in the component API rather than requiring every consumer to manually compose BEM modifier classes. `IconButton` defaults to `ghost` because icon-only controls are most often toolbar or chrome actions, where a primary default would be visually too strong.

| Component  | Values                                                | Default                         | Rationale for default                                   |
| ---------- | ----------------------------------------------------- | ------------------------------- | ------------------------------------------------------- |
| Button     | `'primary'` \| `'neutral'` \| `'ghost'` \| `'danger'` | `'primary'`                     | Text buttons commonly represent the main form action    |
| IconButton | `'primary'` \| `'neutral'` \| `'ghost'` \| `'danger'` | **`'ghost'`** (not `'primary'`) | Icon-only controls are usually secondary interface chrome |

### `size` prop

Added to multiple components. RAC does not have a size concept — Tale UI maps it to BEM modifier classes.

Rationale: sizing is a Tale UI design-system concern, not a RAC accessibility concern. Exposing `size` keeps spacing, typography, and hit-target variants consistent across unrelated RAC primitives.

| Component          | Values                               | Default | Emits `--md`? | Rationale                                           |
| ------------------ | ------------------------------------ | ------- | ------------- | --------------------------------------------------- |
| Button, IconButton | `'sm'` \| `'md'` \| `'lg'`           | `'md'`  | Yes           | CSS has explicit modifier selectors for all sizes   |
| ToggleButton       | `'sm'` \| `'md'` \| `'lg'`           | `'md'`  | Yes           | Matches Button sizing and modifier conventions      |
| Avatar             | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'`  | Yes           | Avatar has discrete visual sizes, including `xl`    |
| Radio              | `'sm'` \| `'md'` \| `'lg'`           | `'md'`  | No            | Base class is the medium size; modifiers are sparse |
| Input              | `'sm'` \| `'md'` \| `'lg'`           | `'md'`  | No            | Base class is the medium field size                 |
| Icon               | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'`  | No            | Base class is the medium icon size                  |

> **`--md` modifier note:** Button, IconButton, ToggleButton, and Avatar always emit `--md` in the class list (CSS targets it for sizing). Radio, Input, and Icon omit `--md` from the DOM — the base class provides default sizing directly.

### `orientation` prop on CheckboxGroup

RAC's RadioGroup supports `orientation` natively and sets `data-orientation`. RAC's CheckboxGroup does **not**. Tale UI adds this prop to CheckboxGroup and renders `data-orientation` on the DOM so CSS can style horizontal layout.

Rationale: Checkbox groups need the same horizontal/vertical layout API as radio groups in form UIs, even though RAC only exposes it for RadioGroup. Adding the prop keeps form-layout APIs consistent.

### `disabled` alias on Button

Button accepts `disabled` as a convenience alias for RAC's `isDisabled`.

Rationale: consumers often reach for the native HTML `disabled` prop on buttons. Supporting it prevents silent styling/interaction mistakes while preserving RAC's `isDisabled` API.

### `aria-label` enforcement on IconButton

TypeScript requires either `aria-label` or `aria-labelledby`. Omitting both is a compile error.

Rationale: icon-only buttons have no visible text label. Enforcing an accessible name at compile time prevents inaccessible controls before runtime.

---

## Auto-rendered icons

Several components render default icons when no children are provided. Pass children to override.

Rationale: these icons are part of conventional UI affordances. Auto-rendering them keeps common controls usable with minimal boilerplate, while accepting children preserves full override control.

| Component.Part                 | Default icon                     | Lucide import  | Rationale                                              |
| ------------------------------ | -------------------------------- | -------------- | ------------------------------------------------------ |
| `Dialog.Close`                 | X (close)                        | `lucide-react` | Standard close affordance                              |
| `AlertDialog.Close`            | X (close)                        | `lucide-react` | Available for safe/cancel close patterns               |
| `Popover.Close`                | X (close)                        | `lucide-react` | Standard close affordance                              |
| `Combobox.Trigger`             | ChevronDown                      | `lucide-react` | Signals popup/list expansion                           |
| `Combobox.ChipRemove`          | X (close)                        | `lucide-react` | Standard remove-chip affordance                        |
| `Select.Icon`                  | ChevronDown                      | `lucide-react` | Signals popup/list expansion                           |
| `DatePicker.Trigger`           | Calendar                         | `lucide-react` | Signals calendar picker                                |
| `DateRangePicker.Trigger`      | Calendar                         | `lucide-react` | Signals calendar picker                                |
| `NumberField.Increment`        | Plus                             | `lucide-react` | Standard stepper increment                             |
| `NumberField.Decrement`        | Minus                            | `lucide-react` | Standard stepper decrement                             |
| `Calendar.PreviousButton`      | ChevronLeft                      | `lucide-react` | Standard previous-period navigation                    |
| `Calendar.NextButton`          | ChevronRight                     | `lucide-react` | Standard next-period navigation                        |
| `RangeCalendar.PreviousButton` | ChevronLeft                      | `lucide-react` | Standard previous-period navigation                    |
| `RangeCalendar.NextButton`     | ChevronRight                     | `lucide-react` | Standard next-period navigation                        |
| `Accordion.Trigger`            | ChevronDown (appended)           | `lucide-react` | Signals disclosure state                               |
| `NavigationMenu.Icon`          | ChevronDown                      | `lucide-react` | Signals nested navigation disclosure                   |
| `Carousel.PreviousTrigger`     | ChevronLeft                      | `lucide-react` | Standard previous-slide navigation                     |
| `Carousel.NextTrigger`         | ChevronRight                     | `lucide-react` | Standard next-slide navigation                         |
| `PaymentInput.CardIcon`        | CreditCard                       | `lucide-react` | Helps identify card-number entry                       |
| `RatingStars`                  | Star (repeated per rating value) | `lucide-react` | Rating visual language is star-based                   |
| `Popover.Arrow`                | Triangle SVG                     | inline         | Indicates the anchored trigger relationship            |
| `Tooltip.Arrow`                | Triangle SVG                     | inline         | Indicates the anchored trigger relationship            |
| `PreviewCard.Arrow`            | Triangle SVG                     | inline         | Indicates the anchored trigger relationship            |
| `Menu.Arrow`                   | Triangle SVG                     | inline         | Indicates the anchored trigger relationship            |

**Exception — `Checkbox.Indicator`** does NOT auto-render a checkmark. You must provide one:

```tsx
<Checkbox.Indicator>
  <Icon icon={Check} size="sm" />
</Checkbox.Indicator>
```

Rationale: checkbox visuals vary more than disclosure/close icons, especially for indeterminate states and branded checkmarks. Keeping the indicator explicit gives consumers control over the glyph while Tale UI provides the indicator frame.

**Exception — `SearchField.ClearButton`** does NOT auto-render an icon:

```tsx
<SearchField.ClearButton>
  <Icon icon={X} size="sm" />
</SearchField.ClearButton>
```

Rationale: the clear button may be rendered as text, an icon, or a compound label depending on the search context. Tale UI exposes the accessible button without assuming the visible content.

---

## Trigger button styling differences

In RAC, triggers are plain unstyled buttons. Tale UI auto-applies BEM classes, but **inconsistently** across components:

Rationale: triggers must preserve RAC's trigger semantics and avoid nested interactive elements. Some older Tale UI wrappers auto-apply button classes for convenience; others leave styling explicit to support link-like or custom trigger appearances.

| Trigger                           | Auto-applies `tale-button`? | What you add via `className`                                                | Rationale                                                       |
| --------------------------------- | :-------------------------: | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `Dialog.Trigger`                  |             Yes             | Variant only: `"tale-button--primary"`                                      | Historical convenience for the most common modal trigger        |
| `AlertDialog.Trigger`             |             No              | Base + variant: `"tale-button tale-button--danger"`                         | Alert triggers are often destructive and should be explicit     |
| `Drawer.Trigger` / `Drawer.Close` |             No              | Base + variant: `"tale-button tale-button--neutral"`                        | Custom Drawer buttons are plain HTML buttons                    |
| `Menu.Trigger`                    |             No              | Base + variant + size: `"tale-button tale-button--neutral tale-button--md"` | Menus may be icon, text, or custom trigger controls             |
| `Popover.Trigger`                 |             No              | Base + variant + size                                                       | Popovers often use arbitrary anchored elements                  |
| `Tooltip.Trigger`                 |             No              | Base + variant + size                                                       | Tooltips often attach to existing controls or inline content    |
| `PreviewCard.Trigger`             |             No              | Base + variant, or style as link                                            | Preview cards commonly attach to text links or custom previews |

Never nest `<Button>` inside a trigger — triggers render their own `<button>`.

---

## Hardcoded close button styling

`Dialog.Close`, `AlertDialog.Close`, and `Popover.Close` apply fixed BEM classes that cannot be removed, only extended:

```
tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-dialog__close
tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-popover__close
```

These are designed for the corner X icon pattern. For action buttons (Cancel, Confirm), use standalone `<Button>` with `onPress={() => setOpen(false)}` or `slot="close"`.

Rationale: close buttons are repeated in a fixed corner affordance where consistent hit target, icon size, and placement matter more than full visual flexibility. Action buttons remain separate so dialog footers can express the appropriate hierarchy.

---

## Arrow and Indicator hoisting

Three components automatically extract specific children and render them at a different DOM level than where the consumer places them. This is required by RAC's internal structure.

| Component           | Hoisted child       | Why                                                                      |
| ------------------- | ------------------- | ------------------------------------------------------------------------ |
| `Popover.Popup`     | `Popover.Arrow`     | RAC requires `OverlayArrow` as a direct child of `Popover`, not `Dialog` |
| `PreviewCard.Popup` | `PreviewCard.Arrow` | Same reason — arrow must be sibling of dialog content                    |
| `Tabs.List`         | `Tabs.Indicator`    | RAC `TabList` filters out non-collection children                        |

Rationale: Tale UI preserves the component composition that consumers expect while still satisfying RAC's required DOM placement. Hoisting is an adapter layer between Tale UI's ergonomic API and RAC's internal structure.

**Consumer impact:** Place the hoisted child as a direct child of the parent listed above. Deeply nesting it inside wrapper `<div>`s will break hoisting.

---

## Meter and ProgressBar value passing

RAC's Meter and ProgressBar expose `percentage` via render props, not context. Tale UI's custom `Indicator` sub-part computes its width independently.

Rationale: Tale UI exposes `Track` and `Indicator` as stable design-system parts that can be styled and composed consistently. Because RAC does not provide a context value for the current percentage, the Indicator needs the value directly.

**You must pass `value` to both Root and Indicator:**

```tsx
<Meter.Root value={60}>
  <Meter.Track>
    <Meter.Indicator value={60} />
  </Meter.Track>
</Meter.Root>
```

Omitting `value` on `Indicator` defaults to 0 — the bar will appear empty.

`ProgressBar.Indicator` also supports `value={null}` for indeterminate state (sets `data-indeterminate`).

---

## Custom sub-parts (no RAC equivalent)

These parts are Tale UI additions that don't exist in React Aria Components:

| Component   | Custom parts                                                          | Rationale                                                                 |
| ----------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Dialog      | `Actions`                                                             | Standardizes footer action layout across dialogs                          |
| Drawer      | `Handle`, `SwipeArea`                                                 | Supports bottom-sheet drag and swipe affordances                          |
| Slider      | `Header`, `Control` (`Indicator` = RAC `SliderFill`, renamed)         | Provides Tale UI layout parts while preserving the existing Indicator API |
| Meter       | `Header`, `Label`, `Value`, `Indicator`, `Track`                      | Provides visible progress anatomy beyond RAC's root component             |
| ProgressBar | `Header`, `Label`, `Value`, `Indicator`, `Track`                      | Provides visible progress anatomy beyond RAC's root component             |
| Combobox    | `InputGroup`, `Chips`, `Chip`, `ChipRemove`, `ItemIndicator`, `Empty` | Supports multi-select, selected chips, and empty-state composition        |
| Select      | `ItemText`, `ItemIndicator`                                           | Supports consistent item labels and selected-state indicators             |
| Radio       | `Dot`                                                                 | Keeps the selected glyph explicit and themeable                           |
| Field       | `Control`, `Item`                                                     | Bridges generic field layout with arbitrary Tale UI controls              |
| SearchField | `ClearButton`                                                         | Exposes a styled clear affordance with consumer-controlled content        |
| Menu        | `MenuList`, `Arrow`, `CheckboxItem`, `RadioItem`, `LinkItem`          | Covers common menu variants and anchored popup anatomy                    |
| Tabs        | `Indicator`                                                           | Provides a visual active-tab indicator that RAC does not render           |

---

## ColorPicker nesting bug (FIXED in RAC 1.18)

Previous versions of React Aria Components threw `Unknown color channel: hue` when a
`ColorSlider` was nested inside `ColorPicker.Root`. As of react-aria-components 1.18
(Tale UI's current minimum), nesting works and the picker context propagates the shared
colour value correctly:

```tsx
<ColorPicker.Root defaultValue="hsb(200, 100%, 100%)">
  <ColorSlider.Root channel="hue">
    <ColorSlider.Track>
      <ColorSlider.Thumb />
    </ColorSlider.Track>
  </ColorSlider.Root>
</ColorPicker.Root>
```

Standalone components with shared state (`useState` + `parseColor`) remain fully
supported and are still the right choice when the controls live outside a picker.

Rationale: this section remains in the deviations doc because older Tale UI examples and agent memory referenced the former limitation. The limitation is no longer a Tale UI deviation as of react-aria-components 1.18.0.

---

## Deprecated form controls (Checkbox, Radio, Switch)

React Aria Components 1.18.0 deprecates `Checkbox`, `Radio`, and `Switch` in favour of
`CheckboxField`/`CheckboxButton`, `RadioField`/`RadioButton`, and `SwitchField`/`SwitchButton`.
Tale UI mirrors this:

| Deprecated (still works)               | Replacement                                       | Deprecation source                    | Rationale for Tale UI deviation                                                                 |
| -------------------------------------- | ------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Checkbox` (`@tale-ui/react/checkbox`) | `CheckboxField` (`@tale-ui/react/checkbox-field`) | react-aria-components 1.18.0          | Mirrors the upstream deprecation and adds built-in `Description` and `Error` parts               |
| `Radio` (`@tale-ui/react/radio`)       | `RadioField` (`@tale-ui/react/radio-field`)       | react-aria-components 1.18.0          | Mirrors the upstream deprecation and adds built-in `Description` and `Error` parts               |
| `Switch` (`@tale-ui/react/switch`)     | `SwitchField` (`@tale-ui/react/switch-field`)     | react-aria-components 1.18.0          | Mirrors the upstream deprecation and adds `Description`/`Error` plus validation support          |

Key structural difference: in the `*Field` components the clickable label is a dedicated
`Button` part (`<label>`), and `Root` is a `<div>` wrapper that also lays out `Description`
and `Error`. The indicator still requires an explicit `<Icon>` child (same deviation as
the original Checkbox). See each component's Migration section for before/after examples.

Rationale: Tale UI keeps the deprecated components exported for backwards compatibility, but the recommended API follows RAC 1.18.0's new field/button structure so consumers can use descriptions, validation errors, and accessible field layout without custom wiring.

---

## Backdrop/Popup nesting rules

| Component     | Backdrop relationship to Popup                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `Dialog`      | Backdrop **wraps** Popup: `<Dialog.Backdrop><Dialog.Popup>...</Dialog.Popup></Dialog.Backdrop>` |
| `AlertDialog` | Backdrop **wraps** Popup (same as Dialog)                                                       |
| `Drawer`      | Backdrop is a **self-closing sibling**: `<Drawer.Backdrop /><Drawer.Popup>...</Drawer.Popup>`   |

Getting this wrong causes the backdrop to remain visible after close.

Rationale: Dialog and AlertDialog follow the overlay/backdrop composition used by their RAC-backed wrappers. Drawer keeps the backdrop separate so the sheet can animate, drag, and dismiss independently of the backdrop layer.

---

## AlertDialog vs Dialog semantics

`AlertDialog` renders with `role="alertdialog"` and is reserved for actions that **require explicit acknowledgement** — destructive operations, confirmations, or critical warnings. `Dialog` uses the standard `role="dialog"` and is appropriate for general-purpose modals.

**Key difference — close button behaviour:**

- **Dialog**: Include `<Dialog.Close aria-label="Close" />` (corner X icon) — users can freely dismiss.
- **AlertDialog**: **Omit** `AlertDialog.Close` by default. The user should be forced to choose between the explicit actions (e.g. Cancel / Delete). Adding a corner X button allows dismissal without acknowledgement, which defeats the purpose of an alert dialog.

If you do include `AlertDialog.Close`, it **must** behave identically to the safe/non-destructive action (Cancel). Never wire it to the destructive action.

Both components export a `Close` part, but the intended usage differs based on the dialog's semantic role.

Rationale: this deviation is based on ARIA semantics rather than an upstream deprecation. `alertdialog` should require explicit acknowledgement, while ordinary `dialog` can support free dismissal.
