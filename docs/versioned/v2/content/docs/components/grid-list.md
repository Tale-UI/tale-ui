# GridList

`import { GridList } from '@tale-ui/react/grid-list';`

An accessible grid-based list supporting keyboard navigation and selection.

## Parts

| Part            | Description                                          |
| --------------- | ---------------------------------------------------- |
| `GridList.Root` | Container. Accepts `aria-label` and `selectionMode`. |
| `GridList.Item` | A single list item. Requires `id` and `textValue`.   |

## Props

Accepts all React Aria `GridList` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### New in React Aria 1.17/1.18

| Prop          | Type                         | Default      | Description                                                                                                                                                                                                                                               |
| ------------- | ---------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction of the list. `'horizontal'` enables horizontal lists with matching arrow-key navigation. The rendered list exposes a `[data-orientation]` attribute for styling. Lives on the React Aria layer; flows through `GridList.Root` untouched. |

## Basic Usage

```tsx
<GridList.Root aria-label="Items">
  <GridList.Item id="1" textValue="Item 1">
    Item 1
  </GridList.Item>
  <GridList.Item id="2" textValue="Item 2">
    Item 2
  </GridList.Item>
  <GridList.Item id="3" textValue="Item 3">
    Item 3
  </GridList.Item>
</GridList.Root>
```

## Examples

### With Selection

```tsx
<GridList.Root aria-label="Items" selectionMode="multiple">
  <GridList.Item id="1" textValue="Item 1">
    Item 1
  </GridList.Item>
  <GridList.Item id="2" textValue="Item 2">
    Item 2
  </GridList.Item>
  <GridList.Item id="3" textValue="Item 3">
    Item 3
  </GridList.Item>
</GridList.Root>
```

### With Icons

```tsx
import { GridList } from '@tale-ui/react/grid-list';
import { Icon } from '@tale-ui/react/icon';
import { Star, Heart, Bell } from 'lucide-react';

<GridList.Root aria-label="Items" selectionMode="single">
  <GridList.Item id="1" textValue="Favorites">
    <Icon icon={Star} size="sm" />
    Favorites
  </GridList.Item>
  <GridList.Item id="2" textValue="Liked">
    <Icon icon={Heart} size="sm" />
    Liked
  </GridList.Item>
  <GridList.Item id="3" textValue="Alerts">
    <Icon icon={Bell} size="sm" />
    Alerts
  </GridList.Item>
</GridList.Root>;
```

## CSS Classes

- `.tale-grid-list` — Base
- `.tale-grid-list__item` — List item

## Pitfalls

<!-- pitfall: grid-list-no-is-selected-on-item -->

- **`GridList.Item` does NOT accept `isSelected`** — use `selectedKeys` and `onSelectionChange` on `GridList.Root` instead.
  - anti-pattern: `<GridList.Item isSelected={selectedIds.includes(item.id)}>`
  - fix: `<GridList.Root selectedKeys={selectedIds} onSelectionChange={setSelectedIds}>`
  - complete example:

    ```tsx
    import { GridList } from '@tale-ui/react/grid-list';
    import { Icon } from '@tale-ui/react/icon';
    import { Star, Heart, Bell } from 'lucide-react';

    export function Example() {
      return (
        <GridList.Root aria-label="Items" selectionMode="multiple">
          <GridList.Item id="1" textValue="Favorites">
            <Icon icon={Star} size="sm" />
            Favorites
          </GridList.Item>
          <GridList.Item id="2" textValue="Liked">
            <Icon icon={Heart} size="sm" />
            Liked
          </GridList.Item>
          <GridList.Item id="3" textValue="Alerts">
            <Icon icon={Bell} size="sm" />
            Alerts
          </GridList.Item>
        </GridList.Root>
      );
    }
    ```

<!-- pitfall: grid-list-on-selection-change-set -->

- **Do NOT annotate `onSelectionChange` parameter as `Set<string>` or import `Selection` from `react-aria-components`** — consumers do not depend on `react-aria-components` directly, so that import causes "Cannot find module" errors. Derive the selection type from `GridList.Root` props with `React.ComponentProps`, or omit the callback parameter annotation.
  - anti-pattern: `onSelectionChange={(keys: Set<string>) => setSelected(keys)}`
  - anti-pattern: `import type { Selection } from 'react-aria-components';`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof GridList.Root>['onSelectionChange']>>[0];`
  - fix: `onSelectionChange={(keys) => setSelected(keys)}`
  - complete example:

    ```tsx
    import * as React from 'react';
    import { useState } from 'react';
    import { GridList } from '@tale-ui/react/grid-list';

    type SelectionValue = Parameters<
      NonNullable<React.ComponentProps<typeof GridList.Root>['onSelectionChange']>
    >[0];

    export function Example() {
      const [selectedKeys, setSelectedKeys] = useState<SelectionValue>(new Set());

      return (
        <GridList.Root
          aria-label="Items"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <GridList.Item id="1" textValue="Item 1">
            Item 1
          </GridList.Item>
          <GridList.Item id="2" textValue="Item 2">
            Item 2
          </GridList.Item>
        </GridList.Root>
      );
    }
    ```

<!-- pitfall: grid-list-column-gap-token -->

- **When wrapping GridList in a Column or Row layout container, use spacing-token gap values — never component-size names** — `gap="md"` on an outer `<Column>` or `<Row>` causes `Type '"md"' is not assignable to type 'Gap | undefined'`; always map: `sm`→`s`, `md`→`m`, `lg`→`l`. This applies to the outermost page-level Column wrapper and to any Column used inside `GridList.Item` children.
  - anti-pattern: `<Column gap="md"><GridList.Root aria-label="Items" selectionMode="multiple">...</GridList.Root></Column>`
  - fix: `<Column gap="m"><GridList.Root aria-label="Items" selectionMode="multiple">...</GridList.Root></Column>`

<!-- pitfall: grid-list-root-layout-only-style -->

- **Never apply non-layout inline styles (listStyle, padding, margin) to GridList.Root** — `GridList.Root` resets list chrome (listStyle, padding, margin) internally; passing them via `style` is redundant and triggers a validation error. Only layout properties (`display`, `gridTemplateColumns`, `gap`) belong on the `style` prop.
  - anti-pattern: `<GridList.Root style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-m)', listStyle: 'none', padding: 0, margin: 0 }}>`
  - fix: `<GridList.Root style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-m)' }}>`
<!-- pitfall: use-grid-list-for-selectable-grid-prompts -->
- **Use GridList for any prompt that asks for a selectable grid list, image card grid, or multi-select card grid** — When the prompt asks to display a grid of cards where the user can select one or more items, render GridList.Root with selectionMode='multiple' (or 'single') and place card content inside GridList.Item children. Use the style prop on GridList.Root with display: 'grid' and gridTemplateColumns to achieve the grid layout. Derive the selection state type from GridList.Root's onSelectionChange prop via React.ComponentProps. Never leave the file empty or substitute a plain div grid with manual selection state.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function SelectableImageGrid() {}`
  - anti-pattern: `export function SelectableImageGrid() { return null; }`
  - fix: `import { GridList } from '@tale-ui/react/grid-list'; // always use GridList for selectable grid list prompts`
  - fix: `<GridList.Root aria-label="Image gallery" selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-m)' }}>`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof GridList.Root>['onSelectionChange']>>[0];`
  - complete example:

    ```tsx
    import * as React from 'react';
    import { GridList } from '@tale-ui/react/grid-list';
    import { Image } from '@tale-ui/react/image';
    import { Text } from '@tale-ui/react/text';
    import { Column } from '@tale-ui/react/column';

    type SelectionValue = Parameters<
      NonNullable<React.ComponentProps<typeof GridList.Root>['onSelectionChange']>
    >[0];

    const images = [
      { id: '1', src: '/image1.jpg', title: 'Mountain Sunrise' },
      { id: '2', src: '/image2.jpg', title: 'Ocean Sunset' },
      { id: '3', src: '/image3.jpg', title: 'Forest Path' },
      { id: '4', src: '/image4.jpg', title: 'City Lights' },
    ];

    export function SelectableImageGrid() {
      const [selectedKeys, setSelectedKeys] = React.useState<SelectionValue>(new Set());

      return (
        <GridList.Root
          aria-label="Image gallery"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-m)' }}
        >
          {images.map((image) => (
            <GridList.Item key={image.id} id={image.id} textValue={image.title}>
              <Column gap="s">
                <Image src={image.src} alt={image.title} width={200} height={150} radius="md" />
                <Text variant="label">{image.title}</Text>
              </Column>
            </GridList.Item>
          ))}
        </GridList.Root>
      );
    }
    ```

## Notes

- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Each `GridList.Item` needs a `textValue` for accessibility (screen reader label).
- Built on React Aria `GridList` and `GridListItem`.
- Items support `data-dragging` and `data-drop-target` attributes when drag-and-drop is enabled.
