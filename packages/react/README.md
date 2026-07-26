# @tale-ui/react

An accessible React component library built on React Aria Components, with BEM class names applied automatically. Styles and design tokens are included — one package, one style import.

## Installation

```bash
npm install @tale-ui/react
```

This single install pulls in `@tale-ui/react-styles` (component CSS) and `@tale-ui/css` (design tokens) automatically.

Peer dependencies: `react` and `react-dom` (^17, ^18, or ^19).

Runtime requirement: Node 18 or newer. Repository development and the
independently versioned `@tale-ui/tooling` package require Node 22 or newer.
See the repository's [compatibility policy](../../docs/compatibility.md) and
[React 3 migration guide](../../docs/migrating-to-v3.md).

### AI agent setup (optional)

If you use Claude Code or other AI coding agents, run this once to add component documentation instructions to your project:

```bash
npx tale-ui-setup
```

This creates or updates your `CLAUDE.md` with instructions that tell the agent how to use Tale UI components correctly.

## Quick Start

```css
/* app root CSS */
body {
  background-color: var(--neutral-5); /* Required — base page background */
}
```

```tsx
import '@tale-ui/react/styles'; // tokens + all component CSS — import once
import { Button } from '@tale-ui/react/button';

export default function App() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
// Renders: <button class="tale-button tale-button--primary tale-button--md">Click me</button>
```

## Critical Setup Details

**Rem base** — The design system uses the browser-standard root size (`html { font-size: 100%; }`, normally `1rem = 16px`). Do not add a Tale-specific root font-size override.

**Page background** — Set `body { background-color: var(--neutral-5); }`. This is the standard base surface colour and inverts automatically in dark mode.

**Dark mode** — Set `data-color-mode="dark"` on `<html>`. All `--neutral-*` and `--color-*` tokens invert automatically. Always toggle between `"dark"` and `"light"` — never remove the attribute. Removing it falls back to OS preference via `prefers-color-scheme`, which may not be what the user chose.

```html
<html class="tale-ui" data-color-mode="dark"></html>
```

**Token rule** — Always use `--color-*` (not `--brand-*`) in component and app CSS. `--brand-*` is palette-only and does NOT invert in dark mode.

```css
/* Correct */
.my-card {
  background: var(--color-60);
  color: var(--color-60-fg);
}

/* Wrong — will break in dark mode */
.my-card {
  background: var(--brand-60);
}
```

## Components

All components are imported from `@tale-ui/react/{name}`:

```ts
import { Button } from '@tale-ui/react/button';
import { Input } from '@tale-ui/react/input';
import { Dialog } from '@tale-ui/react/dialog';
import { Select } from '@tale-ui/react/select';
import { CheckboxField } from '@tale-ui/react/checkbox-field';
```

### Form Controls

Autocomplete · Button · Checkbox Field · Checkbox Group · Combobox · Input · Input Group · Input Tags · Multi Select · Number Field · Payment Input · Pin Input · Radio Field · Radio Group · Search Field · Select · Select Native · Slider · Switch Field · Tag Select · Text Area · Text Field · Toggle Button · Toggle Button Group

`Checkbox`, `Radio`, and `Switch` remain available for backwards compatibility, but new code should use `CheckboxField`, `RadioField`, and `SwitchField`.

### Date & Time

Calendar · Date Field · Date Picker · Date Range Picker · Range Calendar · Time Field

### Color

Color Area · Color Field · Color Picker · Color Slider · Color Swatch · Color Swatch Picker · Color Wheel

### Overlay

Alert Dialog · Dialog · Drawer · Popover · Preview Card · Tooltip

### Navigation

Breadcrumbs · Command Palette · Context Menu · Header Nav · Link · Menu · Menubar · Navigation Menu · Pagination · Pagination Dot · Pagination Line · Sidebar

### Layout

Accordion · App Shell · Card · Carousel · Chat · Column · Disclosure · Row · Scroll Area · Separator · Tabs · Toolbar

### Feedback

Banner · Meter · Progress Bar · Progress Circle · Spinner

### Display

Avatar (with Group, Count, Indicator, and LabelGroup) · Badge · Dot Icon · Empty State · Featured Icon · Grid List · Image · Key Value Pairs · List · List Box · QR Code · Rating Badge · Rating Stars · Table · Tag Group · Tree · Video Player

### Form Structure

Field · Fieldset · Form

### Interaction

Drop Zone · File Trigger · File Upload · Image Cropper · Text Editor

### Marketing

App Store Button · Social Button · Social Button Group · Badge Group · Section Divider · Background Pattern · Illustration · Iphone Mockup · Credit Card

### Typography

Code Block · Kbd · Text

### Utilities

Color Mode Toggle · Container · CSP Provider · I18n Provider · Icon · IconButton · `mergeProps` · Virtualizer

## Styling

Components apply BEM base class names automatically. Variant and size props map to BEM modifiers:

```tsx
<Button variant="primary" size="sm">
  Save
</Button>
// → class="tale-button tale-button--primary tale-button--sm"
```

State is exposed via data attributes (`data-disabled`, `data-open`, `data-selected`, `data-pressed`, `data-focus-visible`, `data-focused`, `data-hovered`, `data-entering`, `data-exiting`, `data-placement`) for CSS selectors.

## Custom Theme

Create a `tale-ui-overrides.css` file in your project (next to your app entry):

```css
/* tale-ui-overrides.css
 *
 * Paste your generated theme from https://tale-ui.github.io/tale-ui/scale/
 * This file overrides the default --brand-* palette tokens.
 * Import AFTER @tale-ui/react/styles so overrides take effect.
 */
```

Import it after the Tale UI styles:

```tsx
import '@tale-ui/react/styles';
import './tale-ui-overrides.css'; // your custom theme — must come after
```

To generate a theme, visit https://tale-ui.github.io/tale-ui/scale/, configure
your colour scale, and paste the generated CSS into `tale-ui-overrides.css`.
Dark mode inversion works automatically—you only define the light-mode palette.

If the generated CSS includes foreground pivot overrides (`.tale-ui` selectors), add `class="tale-ui"` to your `<html>` element:

```html
<html class="tale-ui" data-color-mode="light"></html>
```

## Per-component CSS Imports

For smaller bundles, import individual component styles instead of the all-in-one:

```ts
import '@tale-ui/css'; // tokens — required when using per-component imports
import '@tale-ui/react-styles/button';
import '@tale-ui/react-styles/dialog';
```

## Documentation

For the complete guides on typography, colour system, dark mode, component composition patterns, accessibility, and framework integration:

- [React setup guide](https://raw.githubusercontent.com/Tale-UI/tale-ui/main/docs/react-setup.md) — full consumer walkthrough
- [Design tokens reference](https://raw.githubusercontent.com/Tale-UI/tale-ui/main/packages/css/docs/ai-reference.md) — every CSS class, token, and valid value
- [Design philosophy](https://raw.githubusercontent.com/Tale-UI/tale-ui/main/docs/design-philosophy.md) — architectural decisions
- [Component authoring](https://raw.githubusercontent.com/Tale-UI/tale-ui/main/docs/authoring-components.md) — contributor guide

### Per-component documentation

Each component has a detailed usage guide with imports, sub-parts, props, and examples. Fetch the doc for any component by name:

```
https://raw.githubusercontent.com/Tale-UI/tale-ui/main/docs/components/{name}.md
```

For example: `app-shell.md`, `chat.md`, `code-block.md`, `kbd.md`, `button.md`,
`dialog.md`, `select.md`,
`checkbox.md`, `tabs.md`, `table.md`, `date-picker.md`.

## License

MIT
