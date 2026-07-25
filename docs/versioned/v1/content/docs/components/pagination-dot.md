# PaginationDot

`import { PaginationDot } from '@tale-ui/react/pagination-dot';`

Auto-rendering dot indicators for carousel and slide pagination. Accepts `page` (current, 1-indexed) and `total` props and renders that many clickable dot buttons, with the current one highlighted. Internally uses `Pagination.Root` and `Pagination.Dot` from `@tale-ui/react/pagination`.

## Parts

`PaginationDot` is a simple (non-namespace) component used directly.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| page | `number` | required | Current active page number (1-indexed) |
| total | `number` | required | Total number of slides / pages |
| size | `'md' \| 'lg'` | `'md'` | Size of each dot indicator |
| framed | `boolean` | `false` | Render a frosted-glass background frame around the indicators |
| onPageChange | `(page: number) => void` | -- | Callback fired when a dot is clicked with the 1-indexed page number |

Also accepts all standard `<nav>` HTML attributes (`className`, `aria-label`, etc.).

## Basic Usage

```tsx
import { PaginationDot } from '@tale-ui/react/pagination-dot';

function Carousel() {
  const [page, setPage] = React.useState(1);

  return (
    <>
      {/* ...slide content... */}
      <PaginationDot page={page} total={5} onPageChange={setPage} />
    </>
  );
}
```

## Examples

### Default (md dots)

```tsx
<PaginationDot page={2} total={5} onPageChange={setPage} />
```

### Large dots

```tsx
<PaginationDot page={1} total={4} size="lg" onPageChange={setPage} />
```

### Framed (overlay on images)

```tsx
<div style={{ position: 'relative' }}>
  <img src="/hero.jpg" alt="Hero" />
  <div style={{ position: 'absolute', bottom: '0.625rem', left: '50%', transform: 'translateX(-50%)' }}>
    <PaginationDot page={page} total={5} onPageChange={setPage} framed />
  </div>
</div>
```

### Static display (no callback)

```tsx
<PaginationDot page={3} total={6} />
```

## CSS Classes

| Class | Applied to | Description |
|-------|-----------|-------------|
| `tale-pagination-dot` | Root `<nav>` | Flex row wrapper for dot indicators |
| `tale-pagination-dot--lg` | Root when `size="lg"` | Enlarges each dot to 0.625rem × 0.625rem |
| `tale-pagination-dot--framed` | Root when `framed` | Adds frosted-glass background frame |
| `tale-pagination__dot` | Each dot `<button>` | Dot indicator button (from `pagination.css`) |
| `tale-pagination__dot--current` | Current dot | Highlights the active indicator with brand color |

## Notes

- Inactive dots fire `onPageChange` on click; the current dot has `pointer-events: none` and cannot be re-clicked.
- For standalone dot/line sub-parts (manually controlled per-slide), see `Pagination.Dot` in `@tale-ui/react/pagination`.
- The `framed` variant uses `backdrop-filter: blur(8px)` — ensure a modern browser target or add a fallback.

## Pitfalls
