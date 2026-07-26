# Responsive Actions

Keep primary actions visible while moving only the actions that no longer fit
into a single overflow menu.

## Components Used

- `OverflowList` from `@tale-ui/react/overflow-list`
- `Button` from `@tale-ui/react/button`
- `Menu` from `@tale-ui/react/menu`

## Code

```tsx
import { Button } from '@tale-ui/react/button';
import { Menu } from '@tale-ui/react/menu';
import { OverflowList } from '@tale-ui/react/overflow-list';

const actions = [
  { id: 'edit', label: 'Edit' },
  { id: 'share', label: 'Share' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete' },
] as const;

export function ResponsiveActions() {
  return (
    <OverflowList
      aria-label="Document actions"
      items={actions}
      getKey={(action) => action.id}
      renderItem={(action) => <Button>{action.label}</Button>}
      renderOverflow={(hiddenActions, { overflowControlRef }) => (
        <Menu.Root>
          <Menu.Trigger ref={overflowControlRef}>More</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList aria-label="More document actions">
              {hiddenActions.map((action) => (
                <Menu.Item key={action.id} id={action.id} textValue={action.label}>
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      )}
    />
  );
}
```

## Key points

- Keep item keys stable; measurement, focus restoration, and visibility
  callbacks use logical key identity.
- Attach `overflowControlRef` to the actual enabled menu trigger so keyboard
  focus can move safely before an active item becomes hidden.
- Let OverflowList own the partition. Do not hide rendered items with a second
  CSS breakpoint or create a speculative second overflow control.
- Use `measurementKey` when a font, density, or label change should invalidate
  otherwise stable measurements.
