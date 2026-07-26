# Resizable Workspaces

Create a bounded split workspace with a keyboard-accessible separator and
stable logical panel sizes.

## Components Used

- `Resizable` from `@tale-ui/react/resizable`

## Code

```tsx
import { Resizable } from '@tale-ui/react/resizable';

export function ResizableWorkspace() {
  return (
    <Resizable.Root defaultSizes={{ navigation: 30, editor: 70 }}>
      <Resizable.Panel id="navigation" minSize={20} maxSize={45}>
        Navigation
      </Resizable.Panel>
      <Resizable.Handle
        id="navigation-editor"
        before="navigation"
        after="editor"
        aria-label="Resize navigation and editor"
      />
      <Resizable.Panel id="editor" minSize={55} maxSize={80}>
        Editor
      </Resizable.Panel>
    </Resizable.Root>
  );
}
```

## Key points

- Preserve the `Panel (Handle Panel)+` topology; every handle names its exact
  adjacent panels.
- Size records must contain every current panel ID, respect all bounds, and sum
  to 100 at the configured precision.
- Use `defaultSizes` for Tale-owned state. When using controlled `sizes`, apply
  each proposal before continuing a pointer gesture.
- Give every handle one valid accessible name. Arrow keys, Shift+Arrow,
  PageUp/PageDown, Home, and End remain available without a pointer.
