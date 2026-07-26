# Virtualizer

`import { Virtualizer, GridLayout, ListLayout, Size } from '@tale-ui/react/virtualizer';`

First-class Tale UI exports for React Aria virtualization utilities. This is not a styled component, but it is registry-visible because generated-code validation requires every public `@tale-ui/react/*` import to exist in `registry/components.json`.

## Props

Tale UI adds no custom props. `Virtualizer` and the layout classes use the upstream React Aria and React Stately types re-exported from `@tale-ui/react/virtualizer`.

## Basic Usage

```tsx
import { ListBox } from '@tale-ui/react/list-box';
import { ListLayout, Size, Virtualizer } from '@tale-ui/react/virtualizer';

const options = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
];

export function VirtualizedOptions() {
  return (
    <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 36, padding: 4 }}>
      <ListBox.Root aria-label="Options" items={options} selectionMode="single">
        {(item) => (
          <ListBox.Item id={item.id} textValue={item.label}>
            {item.label}
          </ListBox.Item>
        )}
      </ListBox.Root>
    </Virtualizer>
  );
}
```

## Examples

### Grid Layout

```tsx
import { ListBox } from '@tale-ui/react/list-box';
import { GridLayout, Size, Virtualizer } from '@tale-ui/react/virtualizer';

const swatches = [
  { id: 'red', label: 'Red' },
  { id: 'green', label: 'Green' },
  { id: 'blue', label: 'Blue' },
  { id: 'purple', label: 'Purple' },
];

export function VirtualizedGridOptions() {
  return (
    <Virtualizer
      layout={GridLayout}
      layoutOptions={{
        minItemSize: new Size(44, 44),
        maxItemSize: new Size(44, 44),
        minSpace: new Size(4, 4),
        preserveAspectRatio: true,
      }}
    >
      <ListBox.Root aria-label="Swatches" items={swatches} layout="grid" selectionMode="single">
        {(item) => (
          <ListBox.Item id={item.id} textValue={item.label}>
            {item.label}
          </ListBox.Item>
        )}
      </ListBox.Root>
    </Virtualizer>
  );
}
```

## Pitfalls

<!-- pitfall: virtualizer-import-path -->

- **Import virtualizer utilities from Tale UI** -- use `@tale-ui/react/virtualizer` so generated code validates against the Tale UI registry.
  - anti-pattern: `import { Virtualizer, GridLayout } from 'react-aria-components';`
  - fix: `import { Virtualizer, GridLayout } from '@tale-ui/react/virtualizer';`

<!-- pitfall: virtualizer-stable-item-size -->
<!-- prose-only -->

- **Keep item dimensions stable** -- virtualized layouts depend on predictable item measurement. For grid collections, set compatible `minItemSize`, `maxItemSize`, and `minSpace` values.

<!-- pitfall: virtualizer-long-collections -->
<!-- prose-only -->

- **Use virtualization for long collections** -- small static lists are simpler with `ListBox.Root` alone.
