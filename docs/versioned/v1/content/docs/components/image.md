# Image

`import { Image } from '@tale-ui/react/image';`

A styled image component with border-radius and object-fit options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'none'` | Border radius |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none'` | `'cover'` | Object-fit behavior |
| `alt` | `string` | -- | **Required.** Accessible alt text for the image |

Also accepts all standard `<img>` HTML attributes (`src`, `width`, `height`, `loading`, etc.).

## Basic Usage

```tsx
<Image src="/photo.jpg" alt="A mountain landscape" />
```

## Examples

### Border Radius

```tsx
<Image src="/photo.jpg" alt="Photo" radius="none" width={200} height={150} />
<Image src="/photo.jpg" alt="Photo" radius="sm" width={200} height={150} />
<Image src="/photo.jpg" alt="Photo" radius="md" width={200} height={150} />
<Image src="/photo.jpg" alt="Photo" radius="lg" width={200} height={150} />
<Image src="/photo.jpg" alt="Photo" radius="full" width={200} height={200} />
```

### Object Fit

```tsx
<Image
  src="/photo.jpg"
  alt="Cover (default)"
  fit="cover"
  width={300}
  height={200}
/>
<Image
  src="/photo.jpg"
  alt="Contain"
  fit="contain"
  width={300}
  height={200}
/>
<Image
  src="/photo.jpg"
  alt="Fill"
  fit="fill"
  width={300}
  height={200}
/>
<Image
  src="/photo.jpg"
  alt="None (natural size)"
  fit="none"
  width={300}
  height={200}
/>
```

### Combined

```tsx
<Image
  src="/avatar.jpg"
  alt="User avatar"
  radius="full"
  fit="cover"
  width={80}
  height={80}
/>
```

### With Lazy Loading

```tsx
<Image
  src="/hero.jpg"
  alt="Hero banner"
  radius="lg"
  width={800}
  height={400}
  loading="lazy"
/>
```

## CSS Classes

- `.tale-image` -- Base
- `.tale-image--sm` -- Small border radius
- `.tale-image--md` -- Medium border radius
- `.tale-image--lg` -- Large border radius
- `.tale-image--full` -- Fully circular / pill border radius
- `.tale-image--contain` -- `object-fit: contain`
- `.tale-image--fill` -- `object-fit: fill`
- `.tale-image--none` -- `object-fit: none`

## Pitfalls

<!-- pitfall: image-radius-not-border-radius -->
- **Use `radius` for rounded corners, NOT `borderRadius`** — `borderRadius` is not a valid prop on `Image`.
  - anti-pattern: `<Image src="…" borderRadius="lg" />`
  - fix: `<Image src="…" radius="lg" />`
  - complete example:
    ```tsx
    import { Image } from '@tale-ui/react/image';

    export function Example() {
      return (
        <Image src="/photo.jpg" alt="A landscape" radius="md" fit="cover" />
      );
    }
    ```

<!-- pitfall: image-no-size-prop -->
- **No `size` prop** — use the standard `width` and `height` HTML attributes instead.
  - anti-pattern: `<Image src="…" size={200} />`
  - fix: `<Image src="…" width={200} height={150} />`

<!-- pitfall: image-radius-valid-values -->
- **`radius` accepts `'none'`, `'sm'`, `'md'`, `'lg'`, `'full'`** — NOT short forms `'s'`, `'m'`, or `'l'`.
  - anti-pattern: `<Image src="…" radius="m" />`
  - fix: `<Image src="…" radius="md" />`

## Notes

- Custom component -- not built on a React Aria primitive.
- Default radius is `none`, default fit is `cover`.
- Renders an `<img>` element. The `alt` prop is required for accessibility.
- When `radius="none"` is used, no radius modifier class is added (the image has no border-radius).
- When `fit="cover"` is used, no fit modifier class is added (cover is the default object-fit).
