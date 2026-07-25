# Setting Up a React App with Tale UI

## Quick Start

```bash
pnpm add @tale-ui/react @tale-ui/react-styles
```

```tsx
// App entry — import styles once
import '@tale-ui/react-styles';

// Import components per-file
import { Button } from '@tale-ui/react/button';

export default function App() {
  return <Button variant="primary">Click me</Button>;
}
```

That's it. Components automatically apply their BEM base class (`tale-button`). `@tale-ui/react-styles` pulls in `@tale-ui/core` (the design-token layer) automatically.

---

## Package Architecture

```
@tale-ui/core            CSS design tokens, foundations, layout utilities, themes
      ↑
@tale-ui/react-styles    Component CSS (.tale-button, .tale-select__popup, …)
      ↑
@tale-ui/react           Styled React components (BEM class names applied automatically)
      ↑
@tale-ui/utils           Shared hooks & helpers (pulled automatically)

@tale-ui/themes          Optional standard and monochrome theme presets
```

| Package                 | What it provides                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tale-ui/core`         | Design tokens (`--color-*`, `--neutral-*`, `--space-*`, `--text-*`), utility classes (`.gap--m`, `.grid--3`), dark mode, typography foundations      |
| `@tale-ui/react-styles` | Opinionated CSS for every `@tale-ui/react` component — built entirely on `@tale-ui/core` tokens                                                      |
| `@tale-ui/react`        | Accessible React components that automatically apply BEM class names. Accepts `variant` and `size` props where applicable. Override via `className`. |
| `@tale-ui/themes`       | Optional standard and monochrome theme CSS, data attributes, and typed metadata                                                                      |
| `@tale-ui/utils`        | Internal utilities (colour generation, React hooks, DOM helpers)                                                                                     |

---

## CSS Import Strategies

Components render with the correct BEM class names automatically. You still need to import the stylesheet so those classes have rules applied.

### All-in-one (recommended)

```ts
import '@tale-ui/react-styles'; // tokens + all component CSS
```

This single import loads `@tale-ui/core` (tokens, foundations, themes) followed by every component stylesheet.

### Per-component

```ts
import '@tale-ui/core'; // tokens — must import separately
import '@tale-ui/react-styles/button'; // just the button CSS
import '@tale-ui/react-styles/dialog'; // just the dialog CSS
```

When importing individual components you **must** also import `@tale-ui/core` yourself, because per-component exports do not re-import it.

---

## Colour System

### 17 named colour families

`red` · `orange` · `amber` · `yellow` · `lime` · `green` · `emerald` · `teal` · `cyan` · `sky` · `indigo` · `violet` · `purple` · `fuchsia` · `pink` · `rose` + semantic: `error` · `warning` · `success`

Each family spans 11 shades: **5 · 10 · 20 · 30 · 40 · 50 · 60 · 70 · 80 · 90 · 100**.

### Token rules

| Token layer   | Purpose                                                               | Dark-mode behaviour |
| ------------- | --------------------------------------------------------------------- | ------------------- |
| `--color-*`   | All UI styling (buttons, borders, focus rings, etc.)                  | **Auto-inverts**    |
| `--brand-*`   | Palette definitions only (`:root` overrides, `.color-{name}` classes) | **Never inverts**   |
| `--neutral-*` | Backgrounds, text, borders                                            | **Auto-inverts**    |

**Critical rule:** Never use `--brand-*` in component or UI CSS. Always use `--color-*` — it inverts automatically in dark mode.

### Setting a custom primary colour

Override `--brand-5` through `--brand-100` at `:root` in your app CSS (imported **after** the design system):

```css
:root {
  --brand-5: #fbf5f9;
  --brand-60: #7e4271;
  --brand-100: #36162f;
}
```

Dark-mode inversion works automatically — you only need to define the light-mode palette.

### Scoped colour

Add a `.color-{name}` class to any container. All `--color-*` tokens inside that subtree resolve to the named palette:

```html
<div class="color-red">
  <button class="tale-button tale-button--primary">Red primary</button>
</div>
```

### 6 neutral families

`neutral-cool` · `neutral-slate` · `neutral-gray` · `neutral-onyx` · `neutral-mono` · `neutral-warm` (default)

Neutral shades use an irregular scale: **5 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 28 · 30 · 40 · 50 · 60 · 70 · 80 · 82 · 84 · 86 · 88 · 90 · 92 · 94 · 96 · 98 · 100**.

Full token reference: [packages/css/docs/design-tokens.md](../packages/css/docs/design-tokens.md)

---

## Spacing

Use spacing by relationship and hierarchy:

| Token range                   | Typical use                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| `--space-4xs` / `--space-3xs` | Micro gaps inside compact controls, badges, metadata rows, icon/text pairs, and very small inline padding |
| `--space-2xs`                 | Tight label/value, chip, and compact inline-control gaps                                                  |
| `--space-xs`                  | Action rows, heading-to-content gaps inside dense panels, code-block padding, compact card content        |
| `--space-s`                   | Standard card/panel padding, related item groups, form field stacks, medium-density grids                 |
| `--space-m`                   | Larger component groups, relaxed content stacks, mobile page gutters, roomy panels                        |
| `--space-l` / `--space-xl`    | Page-level rhythm, desktop page gutters, major grids, section separation                                  |
| `--space-2xl`                 | Large editorial or marketing gaps; largest gap utility size                                               |
| `--space-3xl` / `--space-4xl` | Extra-large custom CSS only; no gap utility class exists                                                  |

Use `--section-space-*` only for vertical padding on full-width page sections or bands. Do not use section spacing for card padding, form stacks, or compact dashboards.

---

## Typography

### 6 type roles

| Role        | Font family | Weights | Sizes                                                                              | Use                                           |
| ----------- | ----------- | ------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| **Display** | Inter       | 600     | `--display-l-font-size` (2.5625rem) · `m` (2.375rem) · `s` (2.125rem)              | Marketing heroes, highly prominent page leads |
| **Heading** | Inter       | 600     | `--heading-l-font-size` (1.875rem) · `m` (1.70625rem) · `s` (1.5375rem)            | Page titles, prominent section headings       |
| **Title**   | Inter       | 600     | `--title-l-font-size` (1.50625rem) · `m` (1.36875rem) · `s` (1.31875rem)           | Section, panel, card, and grouped-list titles |
| **Label**   | Inter       | 500     | `--label-l-font-size` (1.2rem) · `m` (1rem) · `s` (0.83125rem) · `xs` (0.76875rem) | UI labels, item names, navigation             |
| **Body**    | Inter       | 400     | `--text-l-font-size` (1.2rem) · `m` (1rem) · `s` (0.83125rem) · `xs` (0.76875rem)  | Body copy, descriptions, helper text          |
| **Mono**    | Roboto Mono | 400     | `--mono-l-font-size` (1.2rem) · `m` (1rem) · `s` (0.83125rem) · `xs` (0.76875rem)  | Code, commands, paths, IDs, route values      |

Additional font: **Playfair Display** (serif) is available via `--expressive-font-family`.

### Hierarchy guidance

Type size should usually get smaller as content becomes more nested. Keep semantic HTML separate from visual style: for example, a dense dashboard can render `<Text as="h2" variant="title" size="l">` instead of using a visually oversized `h2` default.

For dashboards and operational tools, a practical hierarchy is:

- Page title: `heading-l`
- Top-level section title: `title-l`
- Panel or card title: `title-m` / `title-s`
- Nested item names: `label-m` / `label-s`
- Supporting copy: `text-s` / `text-xs`
- Commands, paths, IDs, and route values: `mono-s` / `mono-xs`

Reserve `display-*` for heroes, editorial pages, or intentionally prominent first-screen content. Avoid it inside cards, tables, sidebars, popovers, and dense repeated layouts.

### CSS classes

```html
<h1 class="text--heading-l">Application title</h1>
<h2 class="text--title-l">Section title</h2>
<h3 class="text--title-s">Card title</h3>
<p class="text--body-m">Body text</p>
<code class="text--mono-s">code</code>
```

### Rem base

The design system uses the browser-standard root size, `html { font-size: 100%; }`, so in a default browser **1rem = 16px**. Do not add a Tale-specific root font-size override after importing the styles. See [framework-integration.md](../packages/css/docs/framework-integration.md) for framework import-order guidance.

---

## Dark Mode / Light Mode

### Three-layer system

| Priority    | Trigger            | Selector                                                                                                                        |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| 1 (lowest)  | Default            | `html:not([data-color-mode="dark"])` — light mode when no attribute is set                                                      |
| 2           | OS preference      | `@media (prefers-color-scheme: dark)` + `html:not([data-color-mode="light"])` — auto-dark unless explicitly overridden to light |
| 3 (highest) | Explicit attribute | `html[data-color-mode="dark"]` — always dark regardless of OS                                                                   |

> **Common mistake:** Do not toggle dark mode by _removing_ the `data-color-mode` attribute. Removing the attribute does not mean "light mode" — it means "no explicit preference", which falls back to OS preference via `prefers-color-scheme`. If the user's OS is set to dark mode, removing the attribute keeps the page dark. Always set the attribute to either `"dark"` or `"light"` explicitly.

### What happens in dark mode

- All `--neutral-*` shades **invert** (light ↔ dark)
- All `--color-*` shades **invert** (5 ↔ 100, 10 ↔ 90, etc.)
- `--brand-*` does **NOT** invert — it is palette-only
- `--text-color`, `--display-color`, `--mono-color` automatically adjust

### Setting it up

**Inline `<head>` script (required)**

Add this script in `<head>` before any CSS to avoid a flash of wrong theme. It reads from `localStorage` first (for `ColorModeToggle` persistence), then falls back to OS preference:

```html
<script>
  (function () {
    var mode =
      localStorage.getItem('color-mode') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-color-mode', mode);
  })();
</script>
```

**Optional: custom toggle hook**

If you need a custom toggle instead of `ColorModeToggle`, use this hook:

```tsx
function useDarkMode() {
  const [dark, setDark] = React.useState(() => {
    const stored = localStorage.getItem('color-mode');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const mode = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-mode', mode);
    localStorage.setItem('color-mode', mode);
  }, [dark]);

  return [dark, setDark] as const;
}
```

**Option C — scoped dark section**

```html
<div class="dark">
  <!-- everything inside uses dark-mode tokens -->
</div>
```

---

## Component Catalogue

All components are imported from `@tale-ui/react/{name}`. BEM base classes are applied automatically — you only need extra `className` when overriding specific modifiers not exposed as props.

Components that accept variant/size props apply the BEM modifier class for you:

```tsx
<Button variant="primary" size="sm">Save</Button>  // → class="tale-button tale-button--primary tale-button--sm"
<Input size="lg" />                                 // → class="tale-input tale-input--lg"
<Radio size="sm" />                                 // → class="tale-radio tale-radio--sm"
```

### Form Controls

| Component           | Import path                     | Key classes                                                                             |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| Button              | `@tale-ui/react/button`         | `.tale-button`, `--primary`, `--neutral`, `--ghost`, `--danger`, `--sm`, `--md`, `--lg` |
| IconButton          | `@tale-ui/react/icon-button`    | `.tale-icon-button`, `--sm`, `--md`, `--lg`                                             |
| Input               | `@tale-ui/react/input`          | `.tale-input`, `--sm`, `--lg`                                                           |
| TextField           | `@tale-ui/react/text-field`     | `.tale-text-field`                                                                      |
| TextArea            | `@tale-ui/react/text-area`      | `.tale-text-area`                                                                       |
| Checkbox            | `@tale-ui/react/checkbox`       | `.tale-checkbox`                                                                        |
| Checkbox Group      | `@tale-ui/react/checkbox-group` | —                                                                                       |
| Radio               | `@tale-ui/react/radio`          | `.tale-radio`                                                                           |
| Radio Group         | `@tale-ui/react/radio-group`    | —                                                                                       |
| Switch              | `@tale-ui/react/switch`         | `.tale-switch`                                                                          |
| Toggle Button       | `@tale-ui/react/toggle-button`  | `.tale-toggle-button`, `--sm`, `--md`, `--lg`                                           |
| Toggle Button Group | `@tale-ui/react/toggle-button`  | `.tale-toggle-button-group`                                                             |
| Select              | `@tale-ui/react/select`         | `.tale-select__trigger`, `__popup`, `__item`                                            |
| Combobox            | `@tale-ui/react/combobox`       | `.tale-combobox__input`, `__popup`, `__item`                                            |
| Autocomplete        | `@tale-ui/react/autocomplete`   | `.tale-autocomplete__input`, `__popup`, `__item`                                        |
| Number Field        | `@tale-ui/react/number-field`   | `.tale-number-field`                                                                    |
| Slider              | `@tale-ui/react/slider`         | `.tale-slider`                                                                          |
| Search Field        | `@tale-ui/react/search-field`   | `.tale-search-field`                                                                    |

### Date & Time

| Component         | Import path                        | Key classes               |
| ----------------- | ---------------------------------- | ------------------------- |
| Calendar          | `@tale-ui/react/calendar`          | `.tale-calendar`          |
| Range Calendar    | `@tale-ui/react/range-calendar`    | `.tale-range-calendar`    |
| Date Field        | `@tale-ui/react/date-field`        | `.tale-date-field`        |
| Date Picker       | `@tale-ui/react/date-picker`       | `.tale-date-picker`       |
| Date Range Picker | `@tale-ui/react/date-range-picker` | `.tale-date-range-picker` |
| Time Field        | `@tale-ui/react/time-field`        | `.tale-time-field`        |

### Color

| Component           | Import path                          | Key classes                 |
| ------------------- | ------------------------------------ | --------------------------- |
| Color Area          | `@tale-ui/react/color-area`          | `.tale-color-area`          |
| Color Slider        | `@tale-ui/react/color-slider`        | `.tale-color-slider`        |
| Color Wheel         | `@tale-ui/react/color-wheel`         | `.tale-color-wheel`         |
| Color Swatch        | `@tale-ui/react/color-swatch`        | `.tale-color-swatch`        |
| Color Swatch Picker | `@tale-ui/react/color-swatch-picker` | `.tale-color-swatch-picker` |
| Color Field         | `@tale-ui/react/color-field`         | `.tale-color-field`         |
| Color Picker        | `@tale-ui/react/color-picker`        | — (headless state provider) |

### Layout

| Component   | Import path                  |
| ----------- | ---------------------------- |
| Accordion   | `@tale-ui/react/accordion`   |
| Disclosure  | `@tale-ui/react/disclosure`  |
| Tabs        | `@tale-ui/react/tabs`        |
| Scroll Area | `@tale-ui/react/scroll-area` |
| Separator   | `@tale-ui/react/separator`   |

### Overlay

| Component    | Import path                   |
| ------------ | ----------------------------- |
| Dialog       | `@tale-ui/react/dialog`       |
| Alert Dialog | `@tale-ui/react/alert-dialog` |
| Popover      | `@tale-ui/react/popover`      |
| Drawer       | `@tale-ui/react/drawer`       |
| Tooltip      | `@tale-ui/react/tooltip`      |
| Preview Card | `@tale-ui/react/preview-card` |

### Navigation

| Component       | Import path                      |
| --------------- | -------------------------------- |
| Menu            | `@tale-ui/react/menu`            |
| Context Menu    | `@tale-ui/react/context-menu`    |
| Menubar         | `@tale-ui/react/menubar`         |
| Navigation Menu | `@tale-ui/react/navigation-menu` |
| Toolbar         | `@tale-ui/react/toolbar`         |
| Breadcrumbs     | `@tale-ui/react/breadcrumbs`     |
| Link            | `@tale-ui/react/link`            |

### Feedback & Display

| Component   | Import path                   |
| ----------- | ----------------------------- |
| ProgressBar | `@tale-ui/react/progress-bar` |
| Meter       | `@tale-ui/react/meter`        |
| Avatar      | `@tale-ui/react/avatar`       |
| GridList    | `@tale-ui/react/grid-list`    |
| Table       | `@tale-ui/react/table`        |
| Tree        | `@tale-ui/react/tree`         |
| TagGroup    | `@tale-ui/react/tag-group`    |

### Interaction

| Component   | Import path                   |
| ----------- | ----------------------------- |
| DropZone    | `@tale-ui/react/drop-zone`    |
| FileTrigger | `@tale-ui/react/file-trigger` |

### Form Structure

| Component | Import path               |
| --------- | ------------------------- |
| Field     | `@tale-ui/react/field`    |
| Fieldset  | `@tale-ui/react/fieldset` |
| Form      | `@tale-ui/react/form`     |

### Utilities

| Export       | Import path                    | Purpose                                                     |
| ------------ | ------------------------------ | ----------------------------------------------------------- |
| Container    | `@tale-ui/react/container`     | Sets `--color-*` vars for a named/random palette            |
| CSP Provider | `@tale-ui/react/csp-provider`  | Content Security Policy nonce injection                     |
| I18nProvider | `@tale-ui/react/i18n-provider` | Locale and text direction (wraps React Aria's I18nProvider) |
| `mergeProps` | `@tale-ui/react/merge-props`   | Merge multiple prop objects                                 |

| Icon | `@tale-ui/react/icon` | Renders a Lucide icon with Tale UI sizing |
| ColorModeToggle | `@tale-ui/react/color-mode-toggle` | Light/dark mode toggle with persistence |

---

## Data Attributes for Styling

Components expose state via data attributes. Use these in CSS selectors:

| Attribute                              | Meaning                                 |
| -------------------------------------- | --------------------------------------- |
| `data-disabled`                        | Component is disabled                   |
| `data-open`                            | Popup / disclosure is open              |
| `data-closed`                          | Popup / disclosure is closed            |
| `data-checked`                         | Checkbox, radio, or switch is checked   |
| `data-unchecked`                       | Checkbox, radio, or switch is unchecked |
| `data-selected`                        | Item is selected (select, combobox)     |
| `data-highlighted`                     | Item has keyboard/pointer highlight     |
| `data-focus-visible`                   | Keyboard focus is visible               |
| `data-side="top\|bottom\|left\|right"` | Popup placement side                    |
| `data-starting-style`                  | Enter animation start                   |
| `data-ending-style`                    | Exit animation start                    |
| `data-popup-open`                      | Trigger element while its popup is open |

---

## Component Composition Patterns

Tale UI components use two composition patterns. Choose based on whether the component has built-in label/description parts.

### Pattern A: Compound components with built-in parts

Most form controls (Input, TextField, Select, Combobox) have their own Label, Description, and ErrorMessage parts:

```tsx
import { Input } from '@tale-ui/react/input';

<Input.Root>
  <Input.Label>Email address</Input.Label>
  <Input.Input placeholder="you@example.com" />
  <Input.Description>We'll never share your email.</Input.Description>
</Input.Root>;
```

React Aria automatically links the label to the input via `aria-labelledby` and the description via `aria-describedby`.

### Pattern B: Field wrapper for custom or plain controls

When using a plain `<input>` or a component that doesn't have built-in label parts, wrap it with Field:

```tsx
import { Field } from '@tale-ui/react/field';

<Field.Root>
  <Field.Label>Password</Field.Label>
  <Field.Control>
    <input className="tale-input" type="password" />
  </Field.Control>
  <Field.Description>Must be at least 8 characters.</Field.Description>
</Field.Root>;
```

> **Note:** `Field.Error` requires a React Aria validation context to render. For error messages, use a validatable component like `Input.Root` with `isInvalid` (see Pattern A) instead of `Field.Root`.

### When to use which

| Situation                                                   | Use                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| Using a Tale UI form control (Input, Select, etc.)          | Pattern A — use the component's built-in `.Label`, `.Description` parts |
| Wrapping a plain `<input>`, `<textarea>`, or custom control | Pattern B — wrap with `Field.Root`                                      |
| Grouping related controls (checkboxes, radios)              | Use CheckboxGroup/RadioGroup with a `label` prop                        |

### Example: Login form

```tsx
import { Input } from '@tale-ui/react/input';
import { Button } from '@tale-ui/react/button';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Form } from '@tale-ui/react/form';

function LoginForm() {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault(); /* handle login */
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
        <Input.Root>
          <Input.Label>Email</Input.Label>
          <Input.Input type="email" name="email" isRequired />
        </Input.Root>

        <Input.Root>
          <Input.Label>Password</Input.Label>
          <Input.Input type="password" name="password" isRequired />
        </Input.Root>

        <Checkbox.Root>
          <Checkbox.Indicator />
          Remember me
        </Checkbox.Root>

        <Button type="submit" variant="primary">
          Sign in
        </Button>
      </div>
    </Form>
  );
}
```

---

## Form Patterns

### Form with native validation

```tsx
import { Form } from '@tale-ui/react/form';

<Form
  validationBehavior="native"
  onSubmit={(e) => {
    e.preventDefault();
  }}
>
  <input className="tale-input" name="fullName" required />
  <Button type="submit">Submit</Button>
</Form>;
```

Tale UI integrates with native HTML validation. React Aria handles displaying validation messages and setting `aria-invalid`.

### Fieldset for grouped controls

```tsx
import { Fieldset } from '@tale-ui/react/fieldset';
import { Input } from '@tale-ui/react/input';

<Fieldset.Root>
  <Fieldset.Legend>Shipping Address</Fieldset.Legend>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
    <Input.Root>
      <Input.Label>Street</Input.Label>
      <Input.Input name="street" />
    </Input.Root>
    <Input.Root>
      <Input.Label>City</Input.Label>
      <Input.Input name="city" />
    </Input.Root>
  </div>
</Fieldset.Root>;
```

Fieldset automatically links its legend to the fieldset via `aria-labelledby`. The `disabled` prop propagates to all children.

### CheckboxGroup / RadioGroup

```tsx
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Field } from '@tale-ui/react/field';

<CheckboxGroup label="Notifications">
  <Field.Description>Choose how you'd like to be notified.</Field.Description>
  <Checkbox.Root value="email">
    <Checkbox.Indicator />
    Email
  </Checkbox.Root>
  <Checkbox.Root value="sms">
    <Checkbox.Indicator />
    SMS
  </Checkbox.Root>
</CheckboxGroup>;
```

---

## Accessibility

### What's built-in (no action needed)

Tale UI components are built on React Aria Components, which handle most accessibility automatically. However, Tale UI adds custom props, auto-rendered icons, and some components that are not RAC-based at all. See [react-aria-deviations.md](react-aria-deviations.md) for the full list.

React Aria Components handle:

- **ARIA relationships** — Labels are linked to inputs via `aria-labelledby`, descriptions via `aria-describedby`, errors announced in live regions
- **Keyboard navigation** — Arrow keys in menus/selects/tabs, Enter/Space for activation, Escape to close overlays, Tab for focus order
- **Focus management** — Focus moves to first focusable element in dialogs, returns to trigger on close, focus trapping in modals
- **Screen reader announcements** — Selection changes, validation errors, and state changes are announced automatically

### What consumers must ensure

1. **Every input needs a label** — Use the component's built-in `.Label` part or wrap with `Field.Label`. Inputs without visible labels should use `aria-label`.

2. **Show validation errors** — Use `.ErrorMessage` (component-level) or `Field.Error` to display errors. React Aria sets `aria-invalid` and announces errors automatically.

3. **Use semantic grouping** — Wrap related form controls in `Fieldset` with a `Legend`, or use `CheckboxGroup`/`RadioGroup` with a `label` prop.

4. **Test both colour modes** — Verify your app is readable in both light and dark mode. Components using `--color-*` and `--neutral-*` tokens adapt automatically, but custom CSS may need attention.

5. **Don't suppress focus styles** — The `data-focus-visible` attribute only appears on keyboard focus (not mouse clicks). The default focus ring is designed for WCAG compliance.

### Reduced motion

The design system respects `@media (prefers-reduced-motion: reduce)`. Animations on overlays and transitions are automatically reduced when the user's OS preference is set.

---

## Providers

### I18nProvider — Locale and text direction

```tsx
import { I18nProvider } from '@tale-ui/react/i18n-provider';

<I18nProvider locale="ar-AE">
  <App />
</I18nProvider>;
```

Sets locale for RTL/LTR text direction and number/date formatting. Wraps React Aria's I18nProvider. Use the `useLocale()` hook to read the current locale.

### CSPProvider — Content Security Policy

```tsx
import { CSPProvider } from '@tale-ui/react/csp-provider';

<CSPProvider nonce="server-generated-nonce">
  <App />
</CSPProvider>;
```

Injects a nonce into inline `<style>` elements for Content Security Policy compliance. Only needed if your CSP forbids inline styles.

### Container — Scoped colour themes

```tsx
import { Container } from '@tale-ui/react/container';

<Container color="red">
  {/* All --color-* tokens inside resolve to the red palette */}
  <Button variant="primary">Red Button</Button>
</Container>;
```

Equivalent to adding a `.color-red` class. Pass `color="random"` for a random palette.

---

## Framework Notes

- **Vite:** Works out of the box. See `playground/vite-app/` for a working example.
- **Next.js (App Router):** See [framework-integration.md](../packages/css/docs/framework-integration.md#nextjs-app-router).
- **Tailwind coexistence:** See [framework-integration.md](../packages/css/docs/framework-integration.md) — note the `html { font-size }` conflict and workaround.

## Component Reference

The Storybook at `playground/storybook/` contains interactive examples for every component. Run it locally:

```bash
pnpm --filter tale-ui-storybook storybook
```

Each story shows real usage with `variant`, `size`, and state props. Use the **Foundations** section to explore design tokens, colour families, and typography utilities.

---

## Troubleshooting

**"Components render but look unstyled"**
Components apply BEM class names automatically, but the CSS rules live in `@tale-ui/react-styles`. Add `import '@tale-ui/react-styles'` to your app entry file.

**"CSS variables are undefined"**
You imported a per-component style (e.g. `@tale-ui/react-styles/button`) without importing `@tale-ui/core` first. Either switch to the all-in-one import or add `import '@tale-ui/core'` before component imports.

**"Dark mode doesn't work"**
Ensure `data-color-mode` is set on the `<html>` element (not `<body>`). The CSS selectors target `html[data-color-mode="dark"]`.

**Windows symlink issues with Turbopack**
pnpm symlinks may fail with Turbopack on Windows. Copy `dist/style.css` to a local path and import from there. See [framework-integration.md](../packages/css/docs/framework-integration.md) for details.
