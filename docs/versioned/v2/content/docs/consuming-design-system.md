# Consuming the Design System

> **Using Tale UI with React?** See [react-setup.md](react-setup.md) for the full guide covering `@tale-ui/react` + `@tale-ui/react-styles`.

## Method 1: npm install (recommended)

```bash
npm install @tale-ui/css
```

**Import (bundler — Next.js, Vite, webpack):**

```css
@import '@tale-ui/css'; /* → dist/style.css */
```

**Import (plain HTML):**

```html
<link rel="stylesheet" href="node_modules/@tale-ui/css/dist/style.css" />
```

---

## Method 2: Local live-sync with `pnpm link --global` (development only)

Use this when you want changes to the design system source to reflect immediately in a consumer project without republishing.

**Prerequisites:** Run `pnpm setup` once and open a new terminal so `PNPM_HOME` is in PATH.

**One-time setup — run from inside `packages/css/`:**

```bash
cd packages/css
pnpm link --global
```

**In each consumer project:**

```bash
pnpm link --global @tale-ui/css
```

To remove: `pnpm unlink --global @tale-ui/css`

> **Windows/Turbopack note:** pnpm symlinks may fail with Turbopack on Windows. Workaround: copy `dist/style.css` to a local path in your project and import from there instead.

---

## Method 3: Direct path reference (for HTML-only projects, no npm)

```html
<link rel="stylesheet" href="../core/packages/css/src/index.css" />
```

Adjust the relative path to match the actual directory relationship.

---

## Consumer Project `CLAUDE.md` Snippet

Add this to the consumer project's `CLAUDE.md`. Documentation links use GitHub raw URLs so Claude Code can fetch them with WebFetch from any machine.

````markdown
## Design System

This project uses `@tale-ui/css`. <!-- Update version when upgrading -->

**Install:**

```bash
npm install @tale-ui/css
```

**Import (bundler — Next.js, Vite, webpack):**

```css
@import '@tale-ui/css'; /* → dist/style.css */
```

**Import (plain HTML):**

```html
<link rel="stylesheet" href="node_modules/@tale-ui/css/dist/style.css" />
```

**Framework note:** The design system uses the browser-standard rem base (`html { font-size: 100%; }`, normally `1rem = 16px`).
Do not add a Tale-specific root font-size override after importing the styles.
Full guide: https://raw.githubusercontent.com/Tale-UI/tale-ui/main/packages/css/docs/framework-integration.md

**Quick reference — do not guess these values:**

- **`--brand-*` is for palette definitions ONLY** (`:root` overrides and `.color-{name}` classes) — **NEVER use `--brand-*` in component or UI CSS**. Always use `--color-*` for component styling; it inverts automatically in dark mode. `--brand-*` never inverts.
- Neutral shades: `5 10 12 14 16 18 20 22 24 26 28 30 40 50 60 70 80 82 84 86 88 90 92 94 96 98 100`
- Color/brand shades: `5 10 20 30 40 50 60 70 80 90 100`
- Utility classes use **double-dash**: `.gap--m` `.grid--3` `.display--none` `.radius--m`
- Theme classes use **single-dash**: `.color-red` `.neutral-cool` (NOT `.color--red`)
- NO responsive variants for: `opacity--` `aspect--` `line-clamp--` `radius--` `shadow--` `border` `padding--` `width--` `height--`
- Only `.gap--*` and `.center--*` use double-selector (`.class.class`) in CSS source — write once in HTML

**Custom palettes — extension points, do not guess:**

- **Global primary colour** — override `--brand-5` through `--brand-100` at `:root` in your app CSS (imported after the design system). Dark-mode inversion works automatically. Do NOT override `--color-*` directly.
  ```css
  :root {
    --brand-5: #fbf5f9;
    --brand-60: #7e4271;
    --brand-100: #36162f;
  }
  ```
- **Scoped named colour** — create a `.color-{name}` class that maps `--brand-5` through `--brand-100` (11 shades: 5 10 20 30 40 50 60 70 80 90 100) to raw values. Apply the class to any container.
- **Custom neutral family** — create a `.neutral-{name}` class that maps `--neutral-default-5` through `--neutral-default-100` (25 shades: 5 10 12 14 16 18 20 22 24 26 28 30 40 50 60 70 80 82 84 86 88 90 92 94 96 98 100) to raw values, then add `--display-color`, `--text-color`, and `--mono-color` each set to `var(--neutral-default-90)`. Apply the class to any container.
- Raw values go directly inside the class — do not create intermediate `--myColor-*` variables.

**Full reference:** https://raw.githubusercontent.com/Tale-UI/tale-ui/main/packages/css/docs/ai-reference.md
**Contributor guide:** https://raw.githubusercontent.com/Tale-UI/tale-ui/main/packages/css/CLAUDE.md
````
