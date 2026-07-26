# OverflowList

`import { OverflowList } from '@tale-ui/react/overflow-list';`

Experimental fit-measured inline collection that keeps a deterministic subset
visible and renders one consumer-defined overflow control.

## Props

| Prop                 | Type                                                                             | Default | Description                                                       |
| -------------------- | -------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------- |
| `items`              | `readonly T[]`                                                                   | —       | Ordered collection                                                |
| `getKey`             | `(item: T) => React.Key`                                                         | —       | Returns a stable string, finite number, or bigint key             |
| `renderItem`         | `(item: T) => React.ReactNode`                                                   | —       | Renders an item once per item per React render                    |
| `renderOverflow`     | `(hiddenItems: readonly T[], context: OverflowRenderContext) => React.ReactNode` | —       | Renders the one overflow control for a committed hidden partition |
| `collapseFrom`       | `'start' \| 'end'`                                                               | `'end'` | Edge from which items collapse                                    |
| `minVisibleItems`    | `number`                                                                         | `0`     | Minimum retained item count, even if the result still overflows   |
| `measurementKey`     | `React.Key`                                                                      | —       | Invalidates cached item and control measurements                  |
| `onVisibilityChange` | `(visibleItems: readonly T[], hiddenItems: readonly T[]) => void`                | —       | Runs after the first measurable settlement and partition changes  |

OverflowList also accepts native `<div>` attributes except `children`,
`tabIndex`, and `dangerouslySetInnerHTML`. Its forwarded ref targets the root
`HTMLDivElement`.

```ts
interface OverflowRenderContext {
  overflowControlRef: React.RefCallback<HTMLElement>;
}
```

## Basic Usage

```tsx
import { Button } from '@tale-ui/react/button';
import { OverflowList } from '@tale-ui/react/overflow-list';

const actions = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive' },
  { id: 'share', label: 'Share' },
] as const;

export function ResponsiveActions() {
  return (
    <OverflowList
      aria-label="Document actions"
      items={actions}
      getKey={(action) => action.id}
      renderItem={(action) => <Button variant="neutral">{action.label}</Button>}
      renderOverflow={(hidden, { overflowControlRef }) => (
        <Button
          ref={overflowControlRef}
          variant="neutral"
          aria-label={`${hidden.length} more actions`}
        >
          More
        </Button>
      )}
    />
  );
}
```

Attach `overflowControlRef` to the enabled control that should receive focus
when its appearance hides the currently focused item. Overflow List otherwise
hands focus to the nearest visible item descendant and finally to its root.

Server rendering and the first hydration render show every item. A connected,
non-zero-width root then measures its content box, item/control border boxes,
and CSS gap before settling at most one partition per animation frame.

## CSS Classes

- `.tale-overflow-list`
- `.tale-overflow-list__item`
- `.tale-overflow-list__overflow`

## Pitfalls

- Keep item keys stable and primitive. `0` and `-0` collide, while `"1"`, `1`,
  and `1n` are distinct.
- Change `measurementKey` when hidden item content changes size without
  replacing the collection.
- Attach `overflowControlRef` to the actual enabled focusable control, not its
  decorative wrapper.
