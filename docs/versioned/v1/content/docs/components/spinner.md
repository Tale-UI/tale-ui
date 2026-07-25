# Spinner

`import { Spinner } from '@tale-ui/react/spinner';`

An indeterminate loading indicator with animated variants.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'circle' \| 'line' \| 'dots'` | `'circle'` | Visual style of the animation |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the spinner |
| label | `string` | `'Loading'` | Accessible label (`aria-label`) |

Also accepts all standard `<div>` HTML attributes except `children`.

## Basic Usage

```tsx
<Spinner />
```

## Examples

### Variants

```tsx
<Spinner variant="circle" />
<Spinner variant="line" />
<Spinner variant="dots" />
```

### Sizes

```tsx
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

### Custom Label

```tsx
<Spinner label="Saving…" />
```

### Line Variant (Full Width)

```tsx
<div style={{ width: 300 }}>
  <Spinner variant="line" />
</div>
```

## CSS Classes

- `.tale-spinner` — Root container
- `.tale-spinner--line` — Line variant
- `.tale-spinner--dots` — Dots variant
- `.tale-spinner--sm` — Small size
- `.tale-spinner--lg` — Large size
- `.tale-spinner__svg` — Circle variant SVG element
- `.tale-spinner__track` — Circle track (background ring)
- `.tale-spinner__arc` — Circle animated arc
- `.tale-spinner__line-track` — Line variant track
- `.tale-spinner__line-indicator` — Line variant animated bar
- `.tale-spinner__dot` — Individual dot in dots variant

## Pitfalls

<!-- pitfall: spinner-label-is-aria-not-visible -->
- **`label` prop sets `aria-label` — it does NOT render visible text** — for a visible loading message alongside the spinner, wrap `<Spinner>` and `<Text>` together in a `<Row>`. When using `<Row>` for this layout, use token-scale gap values (`'s'`, `'m'`, etc.) — NOT component-size values like `'sm'`.
  - anti-pattern: `<Row gap="sm" alignItems="center"><Spinner label="Loading data..." /><Text>Loading data...</Text></Row>`
  - anti-pattern: `<Row gap="s" alignItems="center"><Spinner label="Loading data..." /><Text>Loading data...</Text></Row>`
  - fix: `<Row gap="s" style={{ alignItems: 'center' }}><Spinner label="Loading data..." /><Text>Loading data...</Text></Row>`
  - complete example:
    ```tsx
    import { Spinner } from '@tale-ui/react/spinner';

    export function Example() {
      return (
        <>
          <Spinner />
          <Spinner variant="dots" size="lg" />
          <Spinner variant="line" label="Saving…" />
        </>
      );
    }
    ```
<!-- pitfall: use-spinner-for-any-prompt -->
- **Use `Spinner` for any prompt that asks for a loading spinner, loading indicator, or loading state** — when the request is specifically for a spinner, render the Spinner component itself instead of leaving the file empty, returning `null`, or substituting another progress component. If the prompt includes visible label text, compose `Spinner` with `Text` in a `Row` and pass the same string to the `label` prop for accessibility.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function LoadingState() { return null; }`
  - fix: `import { Row } from '@tale-ui/react/row'; import { Spinner } from '@tale-ui/react/spinner'; import { Text } from '@tale-ui/react/text'; export function LoadingState() { return <Row gap="s" style={{ alignItems: 'center' }}><Spinner label="Loading data..." /><Text>Loading data...</Text></Row>; }`

## Notes

- Custom component — not built on a React Aria primitive.
- Uses `role="status"` with `aria-label` for accessibility.
- The circle variant renders an inline SVG with CSS animations.
- The line variant stretches to fill its container width (max 12.5rem).
- The dots variant renders three pulsing dots with staggered animation.
- All animations are pure CSS — no JavaScript animation runtime.
