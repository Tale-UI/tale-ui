# Architecture

## Project Structure

```
src/
├── index.css              # Entry point — imports all modules in order
├── tokens/                # CSS custom properties (design tokens)
│   ├── _base.css          # HTML reset (100%), screen constraints, --background
│   ├── _spacing.css       # --space-4xs..4xl, --section-space-xs..xl (fluid clamp)
│   ├── _typography.css    # --text-xs..8xl, font system tokens
│   ├── _colors.css        # Brand, 16 color families × 11 shades, semantic (error/warning/success)
│   ├── _neutrals.css      # 6 neutral families × 25+ shades, --neutral-default-* mappings
│   └── _effects.css       # --radius-*, --shadow-* tokens
├── foundations/           # Typography classes and base elements
│   ├── _typography.css    # .text--display/heading/title/label/body/mono, .h1-.h6, h1-h6 elements
│   ├── _text-utilities.css # Alignment, transform, weight, style, decoration, wrapping
│   └── _base-elements.css # Focus, paragraph, body defaults
├── layout/                # Structural layout systems (each includes responsive variants)
│   ├── _gap.css           # .gap--, .col-gap--, .row-gap-- (double-selector specificity)
│   ├── _grid.css          # .grid--1..12, ratio grids, auto-fit, col/row span, alternates
│   ├── _flex.css          # .flex--row/col/reverse, .flex--wrap, .flex--grow
│   └── _centering.css     # .center--all/x/y/left/right/top/bottom (double-selector)
├── utilities/             # Visual and behavioral utilities
│   ├── _display.css       # .display--, .visibility--, .sr-only + responsive variants
│   ├── _visual.css        # .radius--, .shadow--, .aspect--, .object-fit--, .line-clamp--, .opacity--
│   ├── _position.css      # .z--, .relative, .sticky
│   ├── _sizing.css        # .width--10..100/auto, .height--25..100/auto
│   ├── _border.css        # .border, .border-top/right/bottom/left, .divider-top/bottom
│   └── _spacing.css       # .padding--xs..xl (section padding)
└── themes/                # Color theming and dark mode
    ├── _neutral-themes.css # .neutral-cool/slate/gray/onyx/mono/warm
    ├── _color-themes.css   # .color-red/orange/amber/.../rose (overrides --brand-*)
    └── _color-modes.css    # data-color-mode dark/light, reduced-motion
```

## Import Order (Critical)

In `src/index.css`, modules are imported in this exact order:

1. **Tokens** — Variables must be defined before use
2. **Foundations** — Typography classes and base elements
3. **Layout** — Gap, grid, flex, centering
4. **Utilities** — Display, visual, position, sizing, border, spacing
5. **Themes** — Last, so color overrides cascade correctly

When adding a new module, place its `@import` in the correct layer.

> **Build constraint:** The build script resolves `@import` statements one level deep only — it reads `src/index.css` and concatenates the imported files. Nested `@import` within module files is not supported. All CSS modules must be flat files imported directly from `src/index.css`.

## Specificity Patterns

### Double-Selector: `.class.class`

Used for **gap** and **centering** utilities to reliably override other layout properties:

```css
.gap--m.gap--m { gap: var(--space-m); }
.center--all.center--all { display: flex; align-items: center; justify-content: center; }
```

**When to use:** Layout utilities that must override conflicting properties from grid/flex containers.

### Single Selector

Used for everything else (display, visual, text, etc.):

```css
.display--none { display: none; }
.radius--m { border-radius: var(--radius-m); }
```

### `!important`

Used sparingly:

- `.sr-only` (must override everything for accessibility)
- `.grid--N` uses `display: grid !important` (intentional override)

## How to Add New Utilities

1. **Choose the correct module** based on what it does (layout → `src/layout/`, visual → `src/utilities/`, etc.)

2. **Follow naming conventions:** `.{block}--{modifier}` — see [naming-conventions.md](naming-conventions.md)

3. **Use design tokens** instead of hardcoded values:
   ```css
   /* Good */
   .card { border-radius: var(--radius-m); box-shadow: var(--shadow-s); }
   /* Bad */
   .card { border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
   ```

4. **Add responsive variants** if the utility should respond to screen size — append `@media` blocks at the bottom of the module file:
   ```css
   /* Base */
   .gap--m.gap--m {
       gap: var(--space-m);
       --row-gap: var(--space-m);
       --col-gap: var(--space-m);
       --grid-gap: var(--space-m);
   }

   /* Responsive */
   @media (max-width: 1600px) {
       .gap--xl-m.gap--xl-m {
           gap: var(--space-m);
           --row-gap: var(--space-m);
           --col-gap: var(--space-m);
           --grid-gap: var(--space-m);
       }
   }
   @media (max-width: 992px) {
       .gap--l-m.gap--l-m { /* ... */ }
   }
   @media (max-width: 768px) {
       .gap--m-m.gap--m-m { /* ... */ }
   }
   @media (max-width: 480px) {
       .gap--s-m.gap--s-m { /* ... */ }
   }
   ```

5. **Use double-selector** only for layout utilities that need to override flex/grid properties

6. **Do not add** utilities to `src/index.css` — it only contains `@import` statements. Add utilities to the appropriate module file.
