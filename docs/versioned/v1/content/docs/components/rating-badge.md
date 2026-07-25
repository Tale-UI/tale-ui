# RatingBadge

`import { RatingBadge } from '@tale-ui/react/rating-badge';`

A pill-shaped badge displaying a star icon and numeric rating value.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `number` | (required) | Numeric rating value |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the badge |

Also accepts all standard `<span>` HTML attributes except `children`.

## Basic Usage

```tsx
<RatingBadge value={4.5} />
```

## Examples

### Various Ratings

```tsx
<RatingBadge value={3.8} />
<RatingBadge value={4.5} />
<RatingBadge value={5.0} />
```

### All Sizes

```tsx
<RatingBadge value={4.5} size="sm" />
<RatingBadge value={4.5} size="md" />
<RatingBadge value={4.5} size="lg" />
```

## CSS Classes

- `.tale-rating-badge` -- Base
- `.tale-rating-badge--sm` / `--md` / `--lg` -- Size modifiers

## Pitfalls

<!-- pitfall: rating-badge-requires-value-prop -->
- **The `value` prop is required** — `RatingBadge` does not accept children text; pass the numeric score via the `value` prop.
  - anti-pattern: `<RatingBadge>4.8</RatingBadge>`
  - anti-pattern: `import { RatingBadge } from '@tale-ui/react';`
  - fix: `import { RatingBadge } from '@tale-ui/react/rating-badge'; ... <RatingBadge value={4.8} />`
  - complete example:
    ```tsx
    import { RatingBadge } from '@tale-ui/react/rating-badge';
    export function Example() {
      return <RatingBadge value={4.8} />;
    }
    ```

## Notes

- Custom component -- not built on a React Aria primitive.
- Displays the value formatted to one decimal place (e.g. `4.5`).
- Internally renders a `lucide-react` Star icon via the `<Icon>` component.
- Does not accept `children`.
