# Custom Style Design System

This directory contains `style.css`, a comprehensive CSS design system with fluid typography, spacing tokens, color palettes, layout utilities, and dark/light mode support.

## Setup

Import `style.css` **before** your application styles:

```html
<link rel="stylesheet" href="style.css" />
<link rel="stylesheet" href="app.css" />
```

Or in a bundler (Vite, Webpack, etc.):

```js
import './styles/style.css';
import './styles/app.css';
```

### Font

The design system uses **Inter** (body/display), **Playfair Display** (expressive), and **Roboto Mono** (monospace). Add this to your `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
```

### Form element resets

`button`, `input`, `select`, and `textarea` elements are reset at zero specificity (via `:where()`), so any class or element rule overrides them without specificity tricks:

```css
/* No extra specificity needed — this just works */
.my-button {
  background: var(--color-60);
  padding: var(--space-xs) var(--space-m);
}
```

---

## Dark / Light Mode

The design system uses a three-way logic that matches the behaviour of Bootstrap 5.3, Radix, and other modern systems:

| State | Result |
|---|---|
| No `data-color-mode` attribute | Follows OS `prefers-color-scheme` |
| `data-color-mode="light"` | Forced light, regardless of OS |
| `data-color-mode="dark"` | Forced dark, regardless of OS |

If your app manages mode programmatically, set `data-color-mode` on `<html>`. If you omit it, the page automatically follows the user's OS preference.

### Implementing the toggle

Read the OS preference as the default, then let the user override it:

```js
function getInitialMode() {
  const saved = localStorage.getItem('color-mode');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setColorMode(mode) {
  document.documentElement.setAttribute('data-color-mode', mode);
  localStorage.setItem('color-mode', mode);
}

function toggleColorMode() {
  const current = document.documentElement.getAttribute('data-color-mode') || 'light';
  setColorMode(current === 'dark' ? 'light' : 'dark');
}

// Restore on page load
setColorMode(getInitialMode());
```

### React example

```tsx
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('color-mode');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});

useEffect(() => {
  const theme = darkMode ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-mode', theme);
  localStorage.setItem('color-mode', theme);
}, [darkMode]);

// In JSX:
<button onClick={() => setDarkMode(prev => !prev)}>
  {darkMode ? 'Light mode' : 'Dark mode'}
</button>
```

### Scoped theming with `.dark` and `.light`

Apply `.dark` or `.light` to any element to scope the token inversion within that subtree, regardless of the page-level mode:

```html
<!-- Force a section dark on an otherwise light page -->
<div class="dark">
  <!-- --neutral-* and --color-* tokens are inverted here -->
  <!-- Child elements with color-* or neutral-* classes are also correctly inverted -->
</div>
```

### How it works

When dark mode is active (via OS preference, `data-color-mode`, or `.dark`), the design system **inverts the neutral scale**. The `--neutral-10` token (normally the lightest shade) maps to the darkest value, and `--neutral-90` (normally darkest) maps to the lightest. This means you write your CSS once using neutral tokens and both modes work automatically:

```css
body {
  background: var(--neutral-10); /* light bg in light mode, dark bg in dark mode */
  color: var(--text-color);      /* dark text in light mode, light text in dark mode */
}

.card {
  background: var(--neutral-14); /* slightly off-background in both modes */
  border: 1px solid var(--neutral-28);
}
```

The brand/accent colors also invert their scale in dark mode (`--color-60` swaps direction), so accent colors remain visually appropriate in both modes.

---

## Neutral Tone Families

Apply a neutral tone class to a container to set the gray palette for everything inside it:

| Class | Character |
|---|---|
| `neutral-onyx` | Slightly warm-neutral, minimal color cast |
| `neutral-cool` | Blue-tinted grays |
| `neutral-slate` | Subtle blue-gray undertone |
| `neutral-gray` | Balanced neutral |
| `neutral-mono` | Pure grays, no color cast |
| `neutral-warm` | Warm-toned grays (default) |

```html
<div class="neutral-onyx">
  <!-- All --neutral-* tokens inside resolve to onyx shades -->
</div>
```

---

## Design Tokens

### Spacing (`--space-*`)

Fluid values using `clamp()` that scale between `--min-screen-width` (480px) and `--max-screen-width` (1600px):

| Token | Approximate range |
|---|---|
| `--space-4xs` | ~5px |
| `--space-3xs` | ~7px |
| `--space-2xs` | ~8-10px |
| `--space-xs` | ~10-14px |
| `--space-s` | ~13-20px |
| `--space-m` | ~16-28px |
| `--space-l` | ~20-40px |
| `--space-xl` | ~25-56px |
| `--space-2xl` | ~31-79px |
| `--space-3xl` | ~39-112px |
| `--space-4xl` | ~49-158px |

### Typography (`--text-*`)

Fluid font sizes:

| Token | Approximate range |
|---|---|
| `--text-xs` | ~12-11px |
| `--text-s` | ~13px |
| `--text-m` | ~14-16px |
| `--text-l` | ~15-19px |
| `--text-xl` | ~16-23px |
| `--text-2xl` | ~17-28px |
| `--text-3xl` | ~18-33px |
| `--text-4xl` | ~19-40px |
| `--text-5xl` | ~21-48px |
| `--text-6xl` | ~22-57px |
| `--text-7xl` | ~24-69px |
| `--text-8xl` | ~25-83px |

### Border Radius (`--radius-*`)

| Token | Value |
|---|---|
| `--radius-none` | 0 |
| `--radius-xs` | 0.3125rem |
| `--radius-s` | 0.46875rem |
| `--radius-m` | 0.625rem |
| `--radius-l` | 0.9375rem |
| `--radius-xl` | 1.25rem |
| `--radius-2xl` | 1.875rem |
| `--radius-full` | 9999px |

### Shadows (`--shadow-*`)

`--shadow-xs`, `--shadow-s`, `--shadow-m`, `--shadow-l`, `--shadow-xl` (increasing depth).

### Colors

**Brand/primary:** `--brand-5` through `--brand-100` are the single customisation point. Set them at `:root` to theme the entire system — the dark-mode inversion continues to work correctly:

```css
:root {
  --brand-5:   #fef2f2;
  --brand-60:  #dc2626; /* replaces the default teal primary */
  --brand-100: #450a0a;
}
```

**Color aliases:** `--color-5` through `--color-100` reference `--brand-*` by default and are available at `:root` specificity. Apply color theme classes (`color-red`, `color-purple`, etc.) to containers to remap the brand palette.

**Semantic:** `--success-60`, `--error-60`, `--warning-60` plus their full 5-100 scales.

**Named colors:** `--red-60`, `--green-60`, `--blue-60`, `--violet-60`, etc. (each with 5-100 scale).

### Extending with custom palettes

Add custom colours in your app CSS, imported **after** the design system. Hook into the two indirection layers — do not override `--color-*` or `--neutral-*` directly.

#### Global primary colour override

Set `--brand-*` at `:root`. All 11 shades can be set; dark-mode inversion uses them automatically:

```css
/* app.css */
:root {
  --brand-5  : #fbf5f9;
  --brand-10 : #f0e4ec;
  --brand-20 : #d9c2d3;
  --brand-30 : #c3a1ba;
  --brand-40 : #ac81a1;
  --brand-50 : #956189;
  --brand-60 : #7e4271;
  --brand-70 : #6b3660;
  --brand-80 : #592b4f;
  --brand-90 : #47203f;
  --brand-100: #36162f;
}
```

#### Scoped named colour class

Create a `.color-{name}` class that remaps `--brand-5` through `--brand-100`. Apply it to any container to scope that colour as the active brand/accent:

```css
.color-mauve {
  --brand-5  : #fbf5f9;
  --brand-10 : #f0e4ec;
  --brand-20 : #d9c2d3;
  --brand-30 : #c3a1ba;
  --brand-40 : #ac81a1;
  --brand-50 : #956189;
  --brand-60 : #7e4271;
  --brand-70 : #6b3660;
  --brand-80 : #592b4f;
  --brand-90 : #47203f;
  --brand-100: #36162f;
}
```

```html
<div class="color-mauve">
  <!-- --color-* tokens resolve to mauve shades here, dark-mode inversion included -->
</div>
```

#### Custom neutral family class

Create a `.neutral-{name}` class that remaps all 25 `--neutral-default-*` shades, plus the three text token aliases:

```css
.neutral-sand {
  --neutral-default    : var(--neutral-default-60);
  --neutral-default-5  : #f8f7f4;
  --neutral-default-10 : #eceae7;
  --neutral-default-12 : #e7e5e2;
  --neutral-default-14 : #e2e0dc;
  --neutral-default-16 : #dcdbd7;
  --neutral-default-18 : #d7d6d2;
  --neutral-default-20 : #d2d1cc;
  --neutral-default-22 : #ceccc7;
  --neutral-default-24 : #c9c7c2;
  --neutral-default-26 : #c4c2bd;
  --neutral-default-28 : #bfbdb8;
  --neutral-default-30 : #bab8b2;
  --neutral-default-40 : #a2a099;
  --neutral-default-50 : #8b8881;
  --neutral-default-60 : #747169;
  --neutral-default-70 : #5e5c55;
  --neutral-default-80 : #494741;
  --neutral-default-82 : #45433e;
  --neutral-default-84 : #413f3a;
  --neutral-default-86 : #3d3b36;
  --neutral-default-88 : #393733;
  --neutral-default-90 : #35332f;
  --neutral-default-92 : #31302b;
  --neutral-default-94 : #2d2c28;
  --neutral-default-96 : #292824;
  --neutral-default-98 : #262421;
  --neutral-default-100: #22211e;
  --display-color: var(--neutral-default-90);
  --text-color   : var(--neutral-default-90);
  --mono-color   : var(--neutral-default-90);
}
```

```html
<div class="neutral-sand">
  <!-- All --neutral-* tokens inside resolve to sand shades, dark-mode inversion included -->
</div>
```

---

## Utility Classes

### Typography

| Class | Purpose |
|---|---|
| `text--display-l/m/s` | Large display headings |
| `text--heading-l/m/s` | Section headings |
| `text--title-l/m/s` | Titles |
| `text--label-l/m/s/xs` | Labels and UI text |
| `text--body-l/m/s/xs` | Body text |
| `text--mono-l/m/s/xs` | Monospace text |

### Layout

| Class | Purpose |
|---|---|
| `flex--row` | `display: flex; flex-direction: row` |
| `flex--col` | `display: flex; flex-direction: column` |
| `flex--wrap` | `flex-wrap: wrap` |
| `center--all` | Center content both axes |
| `center--x` / `center--y` | Center on one axis |
| `gap--xs` through `gap--2xl` | Gap utilities |
| `col-gap--*` / `row-gap--*` | Column/row gap |

### Grid

| Class | Purpose |
|---|---|
| `grid--1` through `grid--12` | Fixed column grids |
| `grid--auto-2` through `grid--auto-12` | Responsive auto-fit grids |
| `grid--1-2`, `grid--2-1`, etc. | Ratio-based two-column grids |
| `col-span--*` / `row-span--*` | Span utilities |

### Visual

| Class | Purpose |
|---|---|
| `radius--xs` through `radius--full` | Border radius |
| `shadow--xs` through `shadow--xl` | Box shadows |

### Responsive Breakpoints

Grid, gap, flex, and center utilities have responsive variants:

- **`xl`** suffix: applies at `max-width: 1600px` (e.g., `grid--xl-2`, `gap--xl-s`, `flex--col-xl`)
- **`l`** suffix: applies at `max-width: 992px` (e.g., `grid--l-1`, `gap--l-xs`, `flex--col-l`)
- **`m`** suffix: applies at `max-width: 768px`
- **`s`** suffix: applies at `max-width: 480px`
