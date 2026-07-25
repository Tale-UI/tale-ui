# DotIcon

`import { DotIcon } from '@tale-ui/react/dot-icon';`

A small colored circle indicator, typically used for status display.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| color | `'neutral' \| 'brand' \| 'error' \| 'warning' \| 'success'` | `'neutral'` | Dot color variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Dot size |

Also accepts all standard `<span>` HTML attributes except `children`.

## Basic Usage

```tsx
<DotIcon color="success" />
```

## Examples

### All Colors

```tsx
<DotIcon color="neutral" />
<DotIcon color="brand" />
<DotIcon color="error" />
<DotIcon color="warning" />
<DotIcon color="success" />
```

### All Sizes

```tsx
<DotIcon size="sm" />
<DotIcon size="md" />
<DotIcon size="lg" />
```

## CSS Classes

- `.tale-dot-icon` -- Base
- `.tale-dot-icon--neutral` / `--brand` / `--error` / `--warning` / `--success` -- Color modifiers
- `.tale-dot-icon--sm` / `--md` / `--lg` -- Size modifiers

## Pitfalls

<!-- pitfall: dot-icon-color-semantic-only -->
- **color accepts semantic tokens only** — valid values are `'neutral'`, `'brand'`, `'error'`, `'warning'`, `'success'`. Raw color names or hex values are not accepted.
  - anti-pattern: `<DotIcon color="green" />`
  - fix: `<DotIcon color="success" />`
  - complete example:
    ```tsx
    import { DotIcon } from '@tale-ui/react/dot-icon';

    export function Example() {
      return (
        <>
          <DotIcon color="success" />
          <DotIcon color="error" size="lg" />
        </>
      );
    }
    ```
<!-- pitfall: use-the-color-prop-not -->
- **Use the color prop, not type, variant, or status** — `DotIcon` has no `type` prop; passing `type="success"` causes a TypeScript error. Use the semantic `color` prop instead.
  - anti-pattern: `<DotIcon type="success" />`
  - fix: `<DotIcon color="success" />`
<!-- pitfall: when-pairing-doticon-with-text -->
- **When pairing DotIcon with Text in a status indicator, use Text's single-letter size tokens — not component-size names** — the canonical status-indicator pattern wraps `<DotIcon>` and `<Text>` in a `<Row>`, but `Text` is the only component whose `size` prop uses spacing-token values (`'xs'`/`'s'`/`'m'`/`'l'`); passing `size="sm"` to `Text` causes `Type '"sm"' is not assignable to type 'Size | undefined'`.
  - anti-pattern: `<Text size="sm">Online</Text>`
  - fix: `<Text size="s">Online</Text>`

## Notes

- Custom component -- not built on a React Aria primitive.
- Renders with `aria-hidden="true"` since it is a decorative indicator.
- Does not accept `children`.
