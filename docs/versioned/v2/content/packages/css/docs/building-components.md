# Building Components

Components live in the consuming project, not in this design system. Build them by composing utility classes with custom CSS that references design tokens.

## Principles

- Use **BEM** for component internals (`.block__element--modifier`)
- Reference **design tokens** for all spacing, colors, and effects
- Compose with **utility classes** for layout (grid, flex, gap, radius, shadow)
- Use `--color-*` (not `--brand-*`) for all accent/primary colour — it inverts automatically in dark mode
- Use `--neutral-*` (not `--neutral-warm-*` etc.) so components adapt to the active neutral family
- Keep component CSS minimal — leverage the utility layer

## Using foreground tokens

Pair any shade background with its `-fg` token for automatic contrast:

```css
.badge {
    background: var(--color-60);
    color: var(--color-60-fg);           /* auto-contrasting text */
}
.badge:hover {
    background: var(--color-70);
    color: var(--color-70-fg);
}
.tag {
    background: var(--color-20);
    color: var(--color-20-fg);           /* resolves to --color-100 */
}
```

The `-fg` tokens work with any `.color-{name}` theme class and invert automatically in dark mode.

## Example: Card

```html
<div class="card radius--m shadow--s">
    <img class="card__image aspect--16-9 object-fit--cover" src="..." alt="..." />
    <div class="card__body">
        <h3 class="card__title text--title-l">Title</h3>
        <p class="card__description text--body-m">Description text...</p>
    </div>
</div>
```

```css
.card {
    background: var(--neutral-14);
    border: 1px solid var(--neutral-24);
    overflow: hidden;
}
.card__body {
    padding: var(--space-m);
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
}
.card__title { color: var(--neutral-90); margin: 0; }
.card__description { color: var(--neutral-70); margin: 0; }
```

## Framework Integration Notes

The core styles are framework-agnostic and apply directly without framework-specific selectors.

## Usage & Import

### Direct import (development)

```html
<link rel="stylesheet" href="path/to/core/packages/css/src/index.css" />
```

Modern browsers resolve `@import` natively. No build step needed.

### Bundled (production)

Bundle with any CSS tool (PostCSS, Lightning CSS, or simple concatenation) to resolve `@import` statements and output a single file to `dist/style.css`.

### Required fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
```
