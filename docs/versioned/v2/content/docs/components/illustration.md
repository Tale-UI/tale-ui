# Illustration

`import { Illustration } from '@tale-ui/react/illustration';`

Decorative marketing illustration SVG rendered at three fixed sizes. An optional `children` slot allows overlaying a centred icon or content on top of the illustration.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'box' \| 'cloud' \| 'documents' \| 'credit-card'` | required | Which illustration to render |
| size | `'sm' \| 'md' \| 'lg'` | `'lg'` | Canvas size |
| svgClassName | `string` | -- | Extra class applied to the inner `<svg>` element |
| childrenClassName | `string` | -- | Extra class applied to the children overlay container |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
import { Illustration } from '@tale-ui/react/illustration';

<Illustration type="box" size="lg" />
```

## Examples

### All illustration types

```tsx
<Illustration type="box" />
<Illustration type="cloud" />
<Illustration type="documents" />
<Illustration type="credit-card" />
```

### Sizes

```tsx
<Illustration type="box" size="sm" />
<Illustration type="box" size="md" />
<Illustration type="box" size="lg" />
```

### With children overlay

```tsx
import { UploadCloud } from 'lucide-react';

<Illustration type="box" size="lg">
  <UploadCloud className="w-8 h-8 text-color-60" />
</Illustration>
```

### Custom children overlay class

```tsx
<Illustration type="cloud" size="md" childrenClassName="gap-2 flex-col">
  <span className="text-sm font-medium">Drag files here</span>
</Illustration>
```

## CSS Classes

- `.tale-illustration` — Outer block container (`position: relative; display: block; flex-shrink: 0`)
- `.tale-illustration__svg` — The inner SVG (`width: 100%; height: 100%`)
- `.tale-illustration__overlay` — Centred overlay container for children (`position: absolute; inset: 0; display: flex; align-items: center; justify-content: center`)

## Pitfalls

<!-- pitfall: illustration-size-sm-md-lg -->
- **Size is `'sm' | 'md' | 'lg'`** — there is no `'xs'` or `'xl'` size.
  - anti-pattern: `<Illustration type="box" size="xl" />`
  - fix: `<Illustration type="box" size="lg" />`

<!-- pitfall: illustration-children-overlay -->
<!-- prose-only -->
- **Children are displayed as a centred overlay** — they float above the SVG via `position: absolute`. If you need children to stack below the illustration, do not use the `children` prop; compose manually.

## Notes

- Custom component — not built on a React Aria primitive.
- The `credit-card` type in `Illustration` is a decorative illustration SVG, distinct from the interactive `CreditCard` display component.
