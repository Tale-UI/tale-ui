# Dropdown — Icon Button (Simple)

A compact dropdown triggered by a three-dot (ellipsis) icon button. Common for row-level actions in tables and list cards.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Icon` from `@tale-ui/react/icon`
- `MoreHorizontal` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Icon } from '@tale-ui/react/icon';
import { MoreHorizontal } from 'lucide-react';

export function IconDropdown({ itemId }: { itemId: string }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Row actions"
        className="tale-icon-button tale-button tale-button--ghost tale-icon-button--sm"
      >
        <Icon icon={MoreHorizontal} size="sm" />
      </Menu.Trigger>
      <Menu.Popover placement="bottom end" offset={4}>
        <Menu.MenuList
          onAction={(key) => {
            console.log(itemId, key);
          }}
        >
          <Menu.Item id="edit">Edit</Menu.Item>
          <Menu.Item id="duplicate">Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="delete">Delete</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- **Do not nest `<IconButton>` inside `Menu.Trigger` as JSX** — `Menu.Trigger` renders its own button. Apply the Tale UI icon-button classes directly to the trigger.
- `aria-label="Row actions"` is required on the `Menu.Trigger` — icon-only controls must have an accessible name.
- `placement="bottom end"` aligns the popover's right edge with the trigger's right edge — ideal for table row actions near the right side of the viewport.
- `MoreVertical` (vertical dots) is an alternative icon; use whichever is consistent with your design language.

## Preview

```tsx
export function Example() {
  return <IconDropdown itemId="demo-1" />;
}
```
