# Design Philosophy

This document explains the architectural decisions behind Tale UI. Understanding these principles helps contributors and AI assistants make consistent choices when extending the system.

---

## Core Principles

1. **Platform-native rendering** — Web styling is pure CSS with no runtime style computation.
   Native packages consume generated JavaScript token objects and use React Native's styling model.

2. **Token-driven** — Every colour, spacing value, radius, shadow, and font size starts in the
   platform-neutral `@tale-ui/tokens` source. Web components consume generated CSS custom
   properties; native components consume generated typed objects.

3. **Zero runtime overhead** — Variant selection, dark mode, theming, and responsive layout all happen in CSS. React components are thin wrappers that apply class names — they add no styling logic at render time.

4. **Accessibility by default** — Components are built on React Aria Components, which implement WAI-ARIA patterns, keyboard navigation, focus management, and screen reader support out of the box.

---

## Why React Aria Components

Tale UI wraps [React Aria Components](https://react-spectrum.adobe.com/react-aria/) (by Adobe) rather than Radix UI, Headless UI, or building from scratch.

**Reasons:**

- **WAI-ARIA compliance** — React Aria implements the full WAI-ARIA spec for every widget pattern. Keyboard handling, focus trapping, screen reader announcements, and ARIA attributes are all handled automatically.

- **State via data attributes** — React Aria exposes component state as DOM data attributes (`data-disabled`, `data-open`, `data-focus-visible`, `data-pressed`, etc.). This maps directly to CSS selectors, keeping styling in CSS where it belongs.

- **Minimal wrapper overhead** — Tale UI components are thin wrappers that apply BEM class names and forward props. The accessibility logic lives in React Aria; Tale UI adds only the styling layer.

- **Production-ready** — React Aria is maintained by Adobe, powers Adobe's design system, and is used in production across thousands of applications.

**What Tale UI adds on top:**

- BEM class names applied automatically (consumers don't write class names)
- `variant` and `size` props that map to BEM modifiers
- Design token-based CSS in `@tale-ui/react-styles`

---

## Why the Package Split

```
@tale-ui/tokens         ← Canonical platform-neutral token source
      ↓
@tale-ui/css            ← Generated CSS tokens and web foundations
      ↑
@tale-ui/react-styles    ← Component CSS (BEM rules)
      ↑
@tale-ui/react           ← React components (thin wrappers)
      ↑
@tale-ui/utils           ← Shared hooks & helpers

@tale-ui/themes          ← Optional standard and monochrome themes

@tale-ui/react-native    ← Native components (planned)
```

### `@tale-ui/tokens` — Shared design decisions

The canonical JSON source generates the browser token modules and typed light/dark native token
objects. Platform-specific expressions remain explicit instead of pretending CSS and native
styling are identical.

### `@tale-ui/css` — Web foundations

The generated token layer and web utilities are pure CSS with no framework dependency. They work
with React, Vue, Angular, or plain HTML. This means:

- Design decisions (colours, spacing, typography) are defined once and shared everywhere
- Teams using different frameworks can share the same visual language
- The CSS build is trivial concatenation — no bundler required

### `@tale-ui/react-styles` — Component CSS (separate from components)

CSS rules live in their own package, not inside React components. This means:

- CSS can be imported per-component for tree-shaking (`import '@tale-ui/react-styles/button'`)
- Styling is inspectable and overridable — consumers can see and extend the CSS directly
- No React dependency for CSS — the styles package only depends on `@tale-ui/css`

### `@tale-ui/react` — Styled components (thin React wrappers)

Components live in a separate package from both tokens and styles. This means:

- Component logic (React Aria wrapping, prop handling) is decoupled from visual styling
- Consumers control CSS loading — they choose all-in-one or per-component imports
- Components can be versioned independently from the token system

### `@tale-ui/utils` — Shared utilities

Internal helpers (colour generation, React hooks, DOM utilities) are isolated so they can be reused across packages without circular dependencies.

### `@tale-ui/themes` — Optional themes

Standard themes pair distinct brand and neutral colours. Monochrome themes derive both palettes from
one named colour. Both are distributed separately from the foundational token layer so consumers can
opt into stable generated CSS without adding presets to every Tale UI build.

**Why not a single package?** Separation enables:

- Independent versioning (token updates don't force component releases)
- Framework flexibility (tokens work without React)
- Tree-shaking (import only what you use)
- Build simplicity (CSS build is concatenation, not bundling)

---

## Why BEM + Data Attributes

Tale UI uses [BEM](https://getbem.com/) (Block Element Modifier) for component class naming and data attributes for state.

```css
.tale-button                          /* Block */
.tale-button--primary                 /* Modifier (variant) */
.tale-button--sm                      /* Modifier (size) */
.tale-button__icon                    /* Element */
.tale-button[data-disabled]           /* State (data attribute) */
.tale-button[data-focus-visible]      /* State (data attribute) */
```

### Why BEM over CSS Modules?

- **Framework-agnostic** — BEM class names work in any template language. CSS Modules require bundler integration.
- **Inspectable** — Class names like `tale-button--primary` are readable in DevTools. Hashed class names (`_button_a1b2c`) are not.
- **Overridable** — Consumers can target `.tale-button--primary` in their own CSS. Hashed names make this impossible without escape hatches.

### Why BEM over CSS-in-JS (styled-components, Emotion)?

- **Zero runtime** — CSS-in-JS injects styles at render time, adding overhead to every component render. BEM classes are static strings.
- **No JavaScript coupling** — Styling decisions live in CSS files, not in JavaScript. This keeps the separation of concerns clean.
- **Predictable output** — The DOM always contains the same class names for the same props. There's no generated hash that changes between builds.

### Why BEM over Tailwind for components?

- **Semantic** — `.tale-button--primary` communicates intent. A string of utility classes (`bg-blue-600 text-white px-4 py-2 rounded-md`) does not.
- **Encapsulated** — Component styling is defined once in CSS, not repeated in every template that uses the component.
- **Already solved** — The design token system (`@tale-ui/css`) provides utility classes (`.gap--m`, `.grid--3`) for layout. BEM handles component-specific styling.

### Why data attributes for state?

React Aria Components expose ephemeral state (disabled, pressed, focused, open) as data attributes on DOM elements. Tale UI styles these with CSS attribute selectors:

```css
.tale-button[data-disabled] {
  opacity: 0.45;
  pointer-events: none;
}
.tale-button[data-focus-visible] {
  box-shadow: 0 0 0 4px var(--color-60);
}
```

**Benefits:**

- State and styling are both handled in CSS — no JavaScript needed to toggle class names
- Data attributes are semantic — `data-disabled` is self-documenting
- React Aria sets these automatically — Tale UI doesn't need custom state management

---

## The Colour Token System: `--brand-*` vs `--color-*` vs `--neutral-*`

The colour system has three token layers. Understanding this hierarchy is critical for dark mode support.

### Layer 1: `--brand-*` (palette source — NEVER use in component CSS)

`--brand-5` through `--brand-100` define the raw colour palette. These tokens:

- Are set at `:root` (the default palette) or by `.color-{name}` theme classes
- **Never invert in dark mode** — they are the stable source of truth
- **Must NEVER be used in component or UI CSS** — if you reference `--brand-60` in a button style, it won't change in dark mode

### Layer 2: `--color-*` (UI tokens — always use these)

`--color-5` through `--color-100` are aliases that point to `--brand-*` in light mode and to the inverted palette in dark mode:

```
Light mode: --color-60 → --brand-60 (dark shade)
Dark mode:  --color-60 → --brand-40 (lighter shade, inverted)
```

**Always use `--color-*` in component CSS.** It auto-inverts, so your component works in both modes without any dark-mode-specific CSS.

### Layer 3: `--neutral-*` (backgrounds, text, borders)

`--neutral-5` through `--neutral-100` work the same way — they auto-invert in dark mode:

```
Light mode: --neutral-90 → dark text on light background
Dark mode:  --neutral-90 → light text on dark background
```

Always use `--neutral-*` (not `--neutral-warm-*` or `--neutral-cool-*`) so components adapt to whichever neutral family is active.

### Foreground tokens (`*-fg`)

Every shade has a paired foreground token for automatic contrast:

```css
.badge {
  background: var(--color-60);
  color: var(--color-60-fg); /* resolves to the correct contrasting colour */
}
```

These tokens also auto-invert in dark mode. No separate dark-mode overrides needed.

### Why this separation?

The three layers serve different purposes:

- `--brand-*` is the raw palette — stable, never inverts, used only for defining colours
- `--color-*` is the UI-facing alias — inverts in dark mode, used everywhere in component CSS
- `--neutral-*` is the greyscale — inverts in dark mode, used for backgrounds, text, and borders

This design means **dark mode is automatic**. Any component using `--color-*` and `--neutral-*` tokens works correctly in both light and dark mode with zero extra CSS.

---

## Light Mode & Dark Mode

### Three-layer priority system

| Priority    | Trigger            | CSS Selector                                                                  |
| ----------- | ------------------ | ----------------------------------------------------------------------------- |
| 1 (lowest)  | Default            | `html:not([data-color-mode="dark"])` — light mode when no attribute set       |
| 2           | OS preference      | `@media (prefers-color-scheme: dark)` + `html:not([data-color-mode="light"])` |
| 3 (highest) | Explicit attribute | `html[data-color-mode="dark"]` — always dark regardless of OS                 |

### What happens in dark mode

- All `--neutral-*` shades **invert** (light ↔ dark). `--neutral-10` (lightest) becomes dark; `--neutral-90` (darkest) becomes light.
- All `--color-*` shades **invert** (5 ↔ 100, 10 ↔ 90, etc.)
- `--brand-*` does **NOT invert** — it is palette-only. This is why you must never use `--brand-*` in component CSS.
- Foreground tokens (`*-fg`) also auto-invert — both background and text flip together.

### Setting it up

**Option A — OS preference only:**

```html
<script>
  document.documentElement.setAttribute(
    'data-color-mode',
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
</script>
```

**Option B — with a toggle:**

```js
const saved = localStorage.getItem('color-mode');
const mode = saved ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-color-mode', mode);

function toggleColorMode() {
  const next =
    document.documentElement.getAttribute('data-color-mode') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-color-mode', next);
  localStorage.setItem('color-mode', next);
}
```

**Option C — scoped dark section:**

```html
<div class="dark">
  <!-- everything inside uses dark-mode tokens -->
</div>
```

> **Never use `removeAttribute('data-color-mode')`** to "reset to light" — removing the attribute causes the OS `prefers-color-scheme: dark` media query to take effect again. Always set `"light"` explicitly.

---

## Token-Driven Theming

Theming is CSS custom property aliasing — no JavaScript required.

### Custom primary colour

Override `--brand-*` at `:root` in your app CSS (after the design system import):

```css
:root {
  --brand-5: #fbf5f9;
  --brand-60: #7e4271;
  --brand-100: #36162f;
}
```

Dark mode inversion works automatically — you only define the light-mode palette.

### Scoped colour themes

Add a `.color-{name}` class to any container. All `--color-*` tokens inside that subtree resolve to the named palette:

```html
<div class="color-red">
  <button class="tale-button tale-button--primary">Red primary</button>
</div>
```

17 named families: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` + semantic: `error`, `warning`, `success`.

### Neutral families

6 families: `neutral-cool`, `neutral-slate`, `neutral-gray`, `neutral-onyx`, `neutral-mono`, `neutral-warm` (default).

Apply with a class: `<body class="neutral-cool">`.

---

## Standard Rem Base

`@tale-ui/css` uses `html { font-size: 100% }`, matching the browser-standard root size. In a default browser this means `1rem = 16px`, so Tale UI can coexist with Tailwind, shadcn/ui, Bootstrap, and other rem-based frameworks without a root-size workaround.

If an application changes the root font size for accessibility or product reasons, Tale UI scales with the rest of the page. See [framework-integration.md](packages/css/docs/framework-integration.md).

---

## Fluid Spacing

Spacing tokens use CSS `clamp()` for fluid responsive scaling between 480px and 1600px viewport widths:

```css
--space-m: clamp(1rem, calc(1.07vw + 0.68125rem), 1.75rem);
```

This provides smooth scaling without media queries in component CSS. Components use spacing tokens and get responsive behaviour automatically.

---

## Build Simplicity

The CSS build is a simple Node script (`tools/build-css.js`) that reads `src/index.css` and concatenates all `@import`ed files into a single `dist/style.css`. No PostCSS, no webpack, no complex pipeline.

**Constraint:** `@import` resolution is one level deep — all CSS modules must be flat files imported directly from `src/index.css`. Nested `@import` within module files is not supported.

This keeps the build fast, predictable, and debuggable.
