# Framework Integration Guide

Guide for using `@tale-ui/core` alongside popular CSS frameworks and build tools.

---

## Which CSS file to import

| Environment | Import |
|-------------|--------|
| Plain HTML (browser native `@import`) | `src/index.css` |
| Next.js, Vite, webpack, Turbopack | `dist/style.css` ← **recommended** |
| PostCSS with `postcss-import` | `src/index.css` |

**Build `dist/style.css`:**
```bash
pnpm build         # from monorepo root
# or:
pnpm --filter @tale-ui/core build
```

---

## Rem Base

`@tale-ui/core` uses the browser-standard root size:

```css
html { font-size: 100%; }
```

In a default browser this means `1rem = 16px`. Tale UI token values are calibrated for that root, so spacing, typography, component sizing, Tailwind CSS, shadcn/ui, Bootstrap, and other rem-based frameworks can share one root contract.

Do not add a Tale-specific `html` font-size override after importing the design system. If your app changes the root size for accessibility or product reasons, Tale UI will scale with the rest of the page.

---

## Tailwind CSS v4

### Import order

```css
/* globals.css */
@import '@tale-ui/core';   /* resolves to dist/style.css */
@import 'tailwindcss';
```

Tailwind must come **after** the design system so its resets don't undo the design system's base styles.

### Specificity conflicts

Both systems use low-specificity utility classes. In case of conflict:

- Design system classes use `.class { }` (single selector, except `.gap--*` and `.center--*` which use `.class.class`)
- Tailwind uses the same specificity level

If Tailwind overrides a design system class unintentionally, increase specificity with a wrapper or use `!important` sparingly.

### Class name conflicts

Known overlaps to avoid using together:

- `.flex`, `.grid`, `.hidden`, `.block`, `.relative`, `.sticky` — both systems define these. Tailwind's versions will typically win if imported after.
- Prefer design system layout classes (`.flex--col`, `.grid--3`) over raw Tailwind equivalents when using the design system.

---

## shadcn/ui

shadcn/ui uses its own CSS custom property naming. Map design system tokens to shadcn variables in your global CSS:

```css
/* After importing the design system, before shadcn: */
:root {
  /* shadcn → design system token mapping */
  --background:   var(--neutral-12);
  --foreground:   var(--neutral-90);
  --primary:      var(--brand-50);
  --primary-foreground: var(--neutral-5);
  --secondary:    var(--neutral-20);
  --secondary-foreground: var(--neutral-80);
  --muted:        var(--neutral-16);
  --muted-foreground: var(--neutral-60);
  --border:       var(--neutral-30);
  --ring:         var(--brand-50);
  --card:         var(--neutral-14);
  --card-foreground: var(--neutral-90);
  --destructive:  var(--error-50);
  --destructive-foreground: var(--neutral-5);
  --popover:      var(--neutral-14);
  --popover-foreground: var(--neutral-90);
  --accent:       var(--neutral-18);
  --accent-foreground: var(--neutral-80);
  --input:        var(--neutral-30);
}
```

These are approximate mappings — adjust shade values to match your design intent.

---

## Next.js (App Router)

**`app/globals.css`:**
```css
@import '@tale-ui/core';
```

**`app/layout.tsx`:**
```tsx
import './globals.css'
```

> **Turbopack note:** The `file:` dependency path and pnpm symlinks (`pnpm link --global`) may fail with Turbopack on Windows. If `@tale-ui/core` fails to resolve, copy `dist/style.css` directly into your project and import from the local path.

**Workaround for Turbopack on Windows:**
```bash
# Copy the built file into your project
cp node_modules/@tale-ui/core/dist/style.css src/styles/core.css
```
Then import: `@import './core.css'` — and re-copy whenever the design system updates.

---

## Vite

Works out of the box with either `src/index.css` or `dist/style.css`:

```js
// main.js / main.ts
import '@tale-ui/core'           // → dist/style.css via exports field
// or:
import '@tale-ui/core/src'       // → src/index.css (Vite resolves @import natively)
```

---

## PostCSS

If your pipeline uses PostCSS with `postcss-import`, `src/index.css` works directly:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),   // resolves @import statements
    require('autoprefixer'),
  ]
}
```

Import in your CSS entry point:
```css
@import '@tale-ui/core/src';
```

Without `postcss-import`, use `dist/style.css` which has all `@import` statements already resolved.

---

## Windows symlink issues

The `file:` protocol in `package.json` creates a junction/symlink that some build tools (Turbopack, older webpack) don't follow on Windows.

**Recommended alternatives:**

1. Use `pnpm link --global` (see root `CLAUDE.md`) — more reliable than `file:`
2. Use `dist/style.css` copied directly into the consuming project
3. Publish to a private npm registry if distributing to a team
