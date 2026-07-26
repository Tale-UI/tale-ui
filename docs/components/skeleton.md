# Skeleton

`import { Skeleton } from '@tale-ui/react/skeleton';`

Experimental decorative placeholder for content that is still loading.
Skeleton is always an empty, `aria-hidden` span. The application owns any
loading announcement or visible loading message.

## Props

| Prop        | Type                                    | Default   | Description                                     |
| ----------- | --------------------------------------- | --------- | ----------------------------------------------- |
| `variant`   | `'text' \| 'rectangular' \| 'circular'` | `'text'`  | Placeholder shape                               |
| `width`     | `React.CSSProperties['width']`          | —         | Width applied after the matching `style` field  |
| `height`    | `React.CSSProperties['height']`         | —         | Height applied after the matching `style` field |
| `animation` | `'pulse' \| 'none'`                     | `'pulse'` | Animation treatment                             |
| `className` | `string`                                | —         | Additional class name                           |
| `style`     | `React.CSSProperties`                   | —         | Additional inline styles                        |

Skeleton accepts safe native `<span>` attributes. It excludes children, raw
HTML injection, roles, accessible names and descriptions, `tabIndex`, and
`contentEditable`.

## Basic Usage

```tsx
import { Skeleton } from '@tale-ui/react/skeleton';

export function ArticlePlaceholder() {
  return (
    <div>
      <Skeleton width="45%" />
      <Skeleton variant="rectangular" height="10rem" />
    </div>
  );
}
```

## Variants and Dimensions

```tsx
<Skeleton width="12rem" />
<Skeleton variant="rectangular" width="20rem" height="10rem" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton animation="none" width="8rem" />
```

Finite numeric dimensions are converted by React to pixels. String dimensions
may use CSS units. Explicit `width` and `height` props override their matching
fields in `style`; non-finite numeric values are omitted.

## Accessible Loading State

Skeletons are decorative and cannot carry an accessible loading label. Put the
announcement on an application-owned container and keep it meaningful when the
placeholder is replaced.

```tsx
<section aria-busy="true" aria-live="polite">
  <span className="visually-hidden">Loading account details</span>
  <Skeleton width="8rem" />
  <Skeleton variant="rectangular" height="6rem" />
</section>
```

## CSS Classes

- `.tale-skeleton`
- `.tale-skeleton--text`
- `.tale-skeleton--rectangular`
- `.tale-skeleton--circular`
- `.tale-skeleton--pulse`
- `.tale-skeleton--none`

## Pitfalls

<!-- pitfall: skeleton-is-decorative -->

- **Keep `Skeleton` decorative** — the component is permanently `aria-hidden`; put loading announcements outside it because it cannot accept a role or accessible name.
  - anti-pattern: `<Skeleton role="status" aria-label="Loading account details" />`
  - fix: `<section aria-busy="true" aria-live="polite"><span className="visually-hidden">Loading account details</span><Skeleton /></section>`

<!-- pitfall: skeleton-has-no-content -->

- **Do not put content inside `Skeleton`** — it is an empty placeholder, and runtime children and raw HTML are discarded.
  - anti-pattern: `<Skeleton>Loading…</Skeleton>`
  - fix: `<><span className="visually-hidden">Loading…</span><Skeleton /></>`

<!-- pitfall: skeleton-circular-dimensions -->

- **Give custom circular skeletons equal finite dimensions** — matching width and height preserve the intended circle when overriding its default size.
  - anti-pattern: `<Skeleton variant="circular" width={80} height={32} />`
  - fix: `<Skeleton variant="circular" width={40} height={40} />`

## Notes

- Custom component; it does not use a React Aria primitive.
- Invalid runtime variant and animation values fall back to `text` and `pulse`.
- Pulse animation only runs when `prefers-reduced-motion` allows motion.
- Consumers own `aria-busy`, live-region announcements, and visible loading
  text.
