# Icon

`import { Icon } from '@tale-ui/react/icon';`

A wrapper component for lucide-react icons with BEM sizing and accessibility defaults.

## Basic Usage

```tsx
import { Icon } from '@tale-ui/react/icon';
import { Heart } from 'lucide-react';

<Icon icon={Heart} />
```

## Examples

### Sizes

```tsx
import { Star } from 'lucide-react';

<Icon icon={Star} size="sm" />
<Icon icon={Star} />              {/* md — default */}
<Icon icon={Star} size="lg" />
<Icon icon={Star} size="xl" />
```

### Accessible Icon (with label)

```tsx
import { AlertCircle } from 'lucide-react';

<Icon icon={AlertCircle} label="Warning" />
```

When `label` is provided, the icon gets `role="img"` and `aria-label` instead of `aria-hidden`.

### Inside a Button

```tsx
import { Button } from '@tale-ui/react/button';
import { Plus } from 'lucide-react';

<Button variant="primary">
  <Icon icon={Plus} size="sm" />
  Add Item
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ComponentType<SVGAttributes>` | — | A lucide-react icon component |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `label` | `string` | — | Accessible label. If omitted, icon is decorative (`aria-hidden`) |
| `className` | `string` | — | Additional class name merged with BEM base |

All other SVG attributes are forwarded to the underlying `<svg>` element.

## CSS Classes

- `.tale-icon` — Base (24px)
- `.tale-icon--sm` — 16px
- `.tale-icon--lg` — 32px
- `.tale-icon--xl` — 48px

## Pitfalls

<!-- pitfall: icon-prop-is-component-not-instance -->
- **icon prop takes a component reference, not an instance** — pass the icon class itself, not `<Bell />`. The prop is named `icon`, not `svg`, `component`, or any other alias; using `svg={...}` causes a TypeScript 'not assignable to type IconProps' error.
  - anti-pattern: `<Icon icon={<Bell />} />`
  - anti-pattern: `<Icon svg={Bell} />`
  - anti-pattern: `<Icon><svg>...</svg></Icon>`
  - fix: `<Icon icon={Bell} />`
  - complete example:
    ```tsx
    import { Icon } from '@tale-ui/react/icon';
    import { Heart } from 'lucide-react';

    export function Example() {
      return (
        <>
          <Icon icon={Heart} size="md" />
          <Icon icon={Heart} size="lg" label="Favorite" />
        </>
      );
    }
    ```

<!-- pitfall: icon-import-from-root -->
- **Import lucide icons from `lucide-react` root, not deep subpaths** — deep imports like `lucide-react/dist/esm/icons/bell` are not part of the public API and break on package updates.
  - anti-pattern: `import Bell from 'lucide-react/dist/esm/icons/bell';`
  - fix: `import { Bell } from 'lucide-react';`

<!-- pitfall: icon-image-name-collision -->
- **Avoid Icon Image name collisions** — `Icon` expects an SVG icon component, not the `Image` component from `@tale-ui/react/image`. When a file-tree or favicon row needs an image glyph, import a lucide icon with a non-conflicting name such as `ImageIcon` or `FileImage`.
  - anti-pattern: `import { Image } from '@tale-ui/react/image'; <Icon icon={Image} />`
  - anti-pattern: `import { Image } from 'lucide-react'; import { Image } from '@tale-ui/react/image';`
  - fix: `import { ImageIcon } from 'lucide-react'; <Icon icon={ImageIcon} />`

<!-- pitfall: icon-size-values -->
- **`size` accepts `'sm'`, `'md'`, `'lg'`, `'xl'` only** — NOT the token-style `'s'`/`'m'`/`'l'` suffixes used in CSS tokens.
  - anti-pattern: `<Icon icon={Bell} size="m" />`
  - fix: `<Icon icon={Bell} size="md" />`

## Notes

- Icons inherit `currentColor` by default — they match the parent text color.
- `@tale-ui/react` lists `lucide-react` as an optional peer dependency. Install it in your project: `pnpm add lucide-react`.
- The `Icon` component works with any SVG component that accepts standard SVG attributes, not just lucide-react.
