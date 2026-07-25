# RatingStars

`import { RatingStars } from '@tale-ui/react/rating-stars';`

A read-only star rating display. Supports half-star values.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `number` | (required) | Rating value from 0 to `max`. Supports half values (e.g. 3.5). |
| max | `number` | `5` | Maximum number of stars |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the stars |

Also accepts all standard `<div>` HTML attributes except `children`.

## Basic Usage

```tsx
<RatingStars value={3.5} />
```

## Examples

### Full Stars

```tsx
<RatingStars value={4} />
```

### Half Stars

```tsx
<RatingStars value={2.5} />
<RatingStars value={3.5} />
<RatingStars value={4.5} />
```

### All Sizes

```tsx
<RatingStars value={4} size="sm" />
<RatingStars value={4} size="md" />
<RatingStars value={4} size="lg" />
```

### Custom Max

```tsx
<RatingStars value={7} max={10} />
```

## CSS Classes

- `.tale-rating-stars` -- Root container
- `.tale-rating-stars--sm` / `--md` / `--lg` -- Size modifiers
- `.tale-rating-stars__star` -- Individual star
- `.tale-rating-stars__star--filled` -- Filled star
- `.tale-rating-stars__star--half` -- Half-filled star
- `.tale-rating-stars__star-overlay` -- Overlay element for half-star effect

## Pitfalls

<!-- pitfall: rating-stars-requires-value-prop -->
- **`value` prop is required** — without it ratings are always empty; do NOT pass the rating as children text.
  - anti-pattern: `<RatingStars>4</RatingStars>`
  - anti-pattern: `import { RatingStars } from '@tale-ui/react';`
  - fix: `import { RatingStars } from '@tale-ui/react/rating-stars'; ... <RatingStars value={4} />`
  - complete example:
    ```tsx
    import { RatingStars } from '@tale-ui/react/rating-stars';
    export function MyComponent() {
      return <RatingStars value={4} />;
    }
    ```

## Notes

- Custom component -- not built on a React Aria primitive.
- Uses `role="img"` with an auto-generated `aria-label` (e.g. "3.5 out of 5 stars").
- Internally renders `lucide-react` Star icons via the `<Icon>` component.
- This is a display-only component; it does not handle user input.
