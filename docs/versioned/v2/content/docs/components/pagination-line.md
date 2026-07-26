# PaginationLine

`import { PaginationLine } from '@tale-ui/react/pagination-line';`

Auto-rendering horizontal line/progress-bar indicators for carousel and slide pagination. Accepts `page` (current, 1-indexed) and `total` props and renders that many clickable line buttons, with the current one highlighted. Internally uses `Pagination.Root` and `Pagination.Line` from `@tale-ui/react/pagination`.

## Parts

`PaginationLine` is a simple (non-namespace) component used directly.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| page | `number` | required | Current active page number (1-indexed) |
| total | `number` | required | Total number of slides / pages |
| size | `'md' \| 'lg'` | `'md'` | Height of each line indicator |
| framed | `boolean` | `false` | Render a frosted-glass background frame around the indicators |
| onPageChange | `(page: number) => void` | -- | Callback fired when a line is clicked with the 1-indexed page number |

Also accepts all standard `<nav>` HTML attributes (`className`, `aria-label`, etc.).

## Basic Usage

```tsx
import { PaginationLine } from '@tale-ui/react/pagination-line';

function Carousel() {
  const [page, setPage] = React.useState(1);

  return (
    <>
      {/* ...slide content... */}
      <PaginationLine page={page} total={5} onPageChange={setPage} />
    </>
  );
}
```

## Examples

### Default (md lines)

```tsx
<PaginationLine page={2} total={5} onPageChange={setPage} />
```

### Large lines

```tsx
<PaginationLine page={1} total={4} size="lg" onPageChange={setPage} />
```

### Framed (overlay on images)

```tsx
<div style={{ position: 'relative', width: '100%' }}>
  <img src="/hero.jpg" alt="Hero" style={{ width: '100%' }} />
  <div style={{ position: 'absolute', bottom: '0.625rem', left: '50%', transform: 'translateX(-50%)', width: '80%' }}>
    <PaginationLine page={page} total={5} onPageChange={setPage} framed style={{ width: '100%' }} />
  </div>
</div>
```

### Static display (no callback)

```tsx
<PaginationLine page={3} total={6} />
```

## CSS Classes

| Class | Applied to | Description |
|-------|-----------|-------------|
| `tale-pagination-line` | Root `<nav>` | Flex row wrapper for line indicators |
| `tale-pagination-line--lg` | Root when `size="lg"` | Increases line height to 0.25rem |
| `tale-pagination-line--framed` | Root when `framed` | Adds frosted-glass background frame |
| `tale-pagination__line` | Each line `<button>` | Line indicator button (from `pagination.css`) |
| `tale-pagination__line--current` | Current line | Highlights the active indicator with brand color |

## Notes

- Lines use `flex: 1` so they each expand equally to fill the available width. Set a `style={{ width: '...px' }}` on the `PaginationLine` root to control the total width.
- Inactive lines fire `onPageChange` on click; the current line has `pointer-events: none` and cannot be re-clicked.
- For standalone line sub-parts (manually controlled per-slide), see `Pagination.Line` in `@tale-ui/react/pagination`.
- The `framed` variant uses `backdrop-filter: blur(8px)` — ensure a modern browser target or add a fallback.

## Pitfalls
