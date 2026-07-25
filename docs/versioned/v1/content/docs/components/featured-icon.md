# FeaturedIcon

`import { FeaturedIcon } from '@tale-ui/react/featured-icon';`

A themed background wrapper for an Icon child. Used to highlight icons in empty states, banners, and feature lists.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'brand' \| 'error' \| 'warning' \| 'success' \| 'neutral'` | `'brand'` | Color variant |
| shape | `'circle' \| 'square'` | `'circle'` | Shape of the container |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the container |
| theme | `'light' \| 'gradient' \| 'dark' \| 'outline' \| 'modern' \| 'modern-neue'` | `'light'` | Visual theme |

Also accepts all standard `<span>` HTML attributes.

## Basic Usage

```tsx
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { Icon } from '@tale-ui/react/icon';
import { Bell } from 'lucide-react';

export function Example() {
  return (
    <FeaturedIcon variant="brand">
      <Icon icon={Bell} />
    </FeaturedIcon>
  );
}
```

## Examples

### All Variants

```tsx
import { Icon } from '@tale-ui/react/icon';
import { Star, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

<FeaturedIcon variant="brand"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="error"><Icon icon={AlertCircle} /></FeaturedIcon>
<FeaturedIcon variant="warning"><Icon icon={AlertTriangle} /></FeaturedIcon>
<FeaturedIcon variant="success"><Icon icon={CheckCircle} /></FeaturedIcon>
<FeaturedIcon variant="neutral"><Icon icon={Info} /></FeaturedIcon>
```

### Shapes

```tsx
<FeaturedIcon variant="brand" shape="circle"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" shape="square"><Icon icon={Star} /></FeaturedIcon>
```

### All Sizes

```tsx
<FeaturedIcon size="sm"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon size="md"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon size="lg"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon size="xl"><Icon icon={Star} /></FeaturedIcon>
```

### Themes

```tsx
<FeaturedIcon variant="brand" theme="light"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" theme="gradient"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" theme="dark"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" theme="outline"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" theme="modern"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" theme="modern-neue"><Icon icon={Star} /></FeaturedIcon>
```

## CSS Classes

- `.tale-featured-icon` -- Base (circle by default)
- `.tale-featured-icon--brand` / `--error` / `--warning` / `--success` / `--neutral` -- Variant modifiers
- `.tale-featured-icon--square` -- Square shape modifier
- `.tale-featured-icon--sm` / `--md` / `--lg` / `--xl` -- Size modifiers
- `.tale-featured-icon--gradient` -- Gradient theme (outer ring + inner filled circle)
- `.tale-featured-icon--dark` -- Dark theme (solid bg + white icon)
- `.tale-featured-icon--outline` -- Outline theme (concentric rings, no fill)
- `.tale-featured-icon--modern` -- Modern theme (white bg + coloured icon + border)
- `.tale-featured-icon--modern-neue` -- Modern-neue theme (soft bg + inner shadow)

## Pitfalls

<!-- pitfall: featured-icon-no-icon-prop -->
- **Does NOT accept an `icon` prop — takes an `<Icon>` child, with no `.Root` variant** — pass an `<Icon>` component as children; import both `FeaturedIcon` from `@tale-ui/react/featured-icon` and the lucide icon from `lucide-react`.
  - anti-pattern: `<FeaturedIcon icon={Bell} />`
  - anti-pattern: `<FeaturedIcon />`
  - fix: `<FeaturedIcon size="lg"><Icon icon={Bell} /></FeaturedIcon>`
  - complete example:

    ```tsx
    import { FeaturedIcon } from '@tale-ui/react/featured-icon';
    import { Icon } from '@tale-ui/react/icon';
    import { Bell } from 'lucide-react';
    export function MyComponent() {
      return <FeaturedIcon size="lg"><Icon icon={Bell} /></FeaturedIcon>;
    }
    ```

<!-- pitfall: featured-icon-generic-prompts-use-default-visual-props -->
- **Use default `FeaturedIcon` visual props for generic prompts** — adding non-default `theme`, `size`, `shape`, or decorative styling when the prompt only asks for a generic featured icon makes generations non-deterministic and drifts from the canonical design.
  - anti-pattern: `<FeaturedIcon variant="brand" theme="gradient" size="lg"><Icon icon={Bell} /></FeaturedIcon>`
  - fix: `<FeaturedIcon variant="brand"><Icon icon={Bell} /></FeaturedIcon>`

## Notes

- Custom component -- not built on a React Aria primitive.
- Pass an `<Icon>` component as children.
- Default shape is `circle`, default variant is `brand`, default size is `md`.
