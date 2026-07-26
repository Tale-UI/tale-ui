# Resizable

Resizable provides a Tale-owned state model for adjacent, user-resizable panels. It uses React
Aria's `useMove` for normalized pointer movement while Tale owns topology, bounds, keyboard
behavior, ARIA, controlled and uncontrolled state, and cancellation.

## Import

```tsx
import { Resizable } from '@tale-ui/react/resizable';
```

Import the aggregate stylesheet once, or import the component stylesheet directly:

```tsx
import '@tale-ui/css';
import '@tale-ui/react-styles/resizable';
```

## Anatomy

```tsx
<Resizable.Root defaultSizes={{ navigation: 30, content: 70 }}>
  <Resizable.Panel id="navigation">Navigation</Resizable.Panel>
  <Resizable.Handle
    id="navigation-content"
    before="navigation"
    after="content"
    aria-label="Resize navigation"
  />
  <Resizable.Panel id="content">Content</Resizable.Panel>
</Resizable.Root>
```

The direct-child grammar is `Panel (Handle Panel)+`. Fragments and arrays are flattened, and
nullish or boolean children are ignored. Each Handle must name its exact adjacent Panels.

## Controlled sizes

Use `sizes` when the application owns the committed record. A controlled Root proposes changes
without projecting them internally. During pointer movement, acknowledge each proposal at the
configured precision before the next movement event.

```tsx
import * as React from 'react';
import { Resizable, type ResizableSizes } from '@tale-ui/react/resizable';

export function ControlledWorkspace() {
  const [sizes, setSizes] = React.useState<ResizableSizes>({ list: 35, detail: 65 });

  return (
    <Resizable.Root sizes={sizes} onSizesChange={setSizes}>
      <Resizable.Panel id="list" minSize={20} maxSize={60}>
        List
      </Resizable.Panel>
      <Resizable.Handle
        id="list-detail"
        before="list"
        after="detail"
        aria-label="Resize list and detail"
      />
      <Resizable.Panel id="detail" minSize={40}>
        Detail
      </Resizable.Panel>
    </Resizable.Root>
  );
}
```

Records contain exactly the current Panel IDs, stay within every bound, and total 100 within the
configured precision. Controlled records are never projected. Uncontrolled records are
deterministically projected when Panels are added, removed, reordered, or receive tighter bounds.
`defaultSizes` is read only during the first valid uncontrolled initialization.

## Keyboard interaction

Focus a Handle and use:

- Arrow keys to move by `keyboardStep`.
- Shift+Arrow, Page Up, or Page Down to move by `keyboardLargeStep`.
- Home or End to move to the adjacent pair's minimum or maximum.

Horizontal panel flow uses a vertical separator and responds to left/right movement with RTL
direction accounted for. Vertical flow uses a horizontal separator and responds to up/down
movement.

## Root props

| Prop                | Type                         | Default            | Description                                                                 |
| ------------------- | ---------------------------- | ------------------ | --------------------------------------------------------------------------- |
| `sizes`             | `ResizableSizes`             | —                  | Controlled exact Panel-size record. Mutually exclusive with `defaultSizes`. |
| `defaultSizes`      | `ResizableSizes`             | evenly distributed | Initial uncontrolled size record.                                           |
| `orientation`       | `'horizontal' \| 'vertical'` | `'horizontal'`     | Panel flow and movement axis.                                               |
| `onSizesChange`     | `(sizes, meta) => void`      | —                  | Runs for each accepted user mutation.                                       |
| `onSizesCommit`     | `(sizes, meta) => void`      | —                  | Runs after a keyboard mutation or successful pointer completion.            |
| `keyboardStep`      | `number`                     | `1`                | Percentage-point arrow-key step. Must be finite and positive.               |
| `keyboardLargeStep` | `number`                     | `10`               | Percentage-point Shift+Arrow and page-key step.                             |
| `precision`         | `number`                     | `4`                | Integer decimal precision used for records, equality, and residuals.        |
| `isDisabled`        | `boolean`                    | `false`            | Disables every Handle.                                                      |
| `isReadOnly`        | `boolean`                    | `false`            | Preserves semantics while preventing size mutations.                        |
| `children`          | `React.ReactNode`            | required           | Direct Panels and Handles in the required alternating grammar.              |

## Panel props

| Prop       | Type              | Default  | Description                  |
| ---------- | ----------------- | -------- | ---------------------------- |
| `id`       | `string`          | required | Root-local logical Panel ID. |
| `minSize`  | `number`          | `0`      | Minimum percentage size.     |
| `maxSize`  | `number`          | `100`    | Maximum percentage size.     |
| `children` | `React.ReactNode` | —        | Panel content.               |

## Handle props

| Prop              | Type      | Default  | Description                                                           |
| ----------------- | --------- | -------- | --------------------------------------------------------------------- |
| `id`              | `string`  | required | Root-local logical Handle ID returned in callback metadata.           |
| `before`          | `string`  | required | Exact preceding Panel ID.                                             |
| `after`           | `string`  | required | Exact following Panel ID.                                             |
| `aria-label`      | `string`  | —        | Accessible name; supply exactly one naming prop.                      |
| `aria-labelledby` | `string`  | —        | ID reference for the accessible name; supply exactly one naming prop. |
| `isDisabled`      | `boolean` | `false`  | Disables this Handle only.                                            |

## Invalid input and recovery

Invalid topology, bounds, configuration, or controlled records visibly fail closed. Panels keep
their content but lose Tale flex bases, Handles become inert, and no size callbacks run. The last
valid snapshot is retained only for recovery. Return to the Root's mount-stable controlled or
uncontrolled mode with a valid exact record to recover synchronously.

An active pointer gesture is cancelled without a commit when topology or bounds change, controlled
acknowledgement diverges, the Root resizes, input becomes invalid, disabled/read-only state changes,
pointer capture is lost, the browser cancels the pointer, or the Root unmounts.

## CSS classes

| Class                         | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `.tale-resizable`             | Root flex container.                     |
| `.tale-resizable--horizontal` | Horizontal panel-flow modifier.          |
| `.tale-resizable--vertical`   | Vertical panel-flow modifier.            |
| `.tale-resizable__panel`      | Flex-sized Panel.                        |
| `.tale-resizable__handle`     | Focusable separator and movement target. |

## Pitfalls

- Do not use `ResizableTableContainer` for general application panels; it is table-column-specific.
- Keep logical IDs stable across reorder so uncontrolled values can follow their Panels.
- Do not mix `sizes` and `defaultSizes`, or switch ownership mode after mount.
- Provide usable container width or height; zero-size Roots cannot acquire a pointer gesture.
<!-- pitfall: resizable-controlled-proposal-acknowledgement -->
- **Apply each controlled Resizable proposal before the next move** — A controlled pointer gesture cancels when the parent does not acknowledge the latest proposed sizes.
  - anti-pattern: `<Resizable.Root sizes={sizes} onSizesChange={() => {}}>`
  - fix: `<Resizable.Root sizes={sizes} onSizesChange={setSizes}>`
