# Dropdown — Button (Simple)

A basic dropdown menu triggered by a button. Items are plain actions with an `onAction` callback.

## Components Used

- `Menu` from `@tale-ui/react/menu`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';

export function ButtonDropdown() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        Actions ▾
      </Menu.Trigger>
      <Menu.Popover placement="bottom start" offset={4}>
        <Menu.MenuList
          onAction={(key) => {
            console.log('selected', key);
          }}
        >
          <Menu.Item id="duplicate">Duplicate</Menu.Item>
          <Menu.Item id="rename">Rename</Menu.Item>
          <Menu.Item id="move">Move to folder</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="delete">Delete</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `Menu.Trigger` accepts any `className` — use the BEM button classes to style it as a Tale UI button without nesting a `<Button>` inside a trigger (which is not allowed).
- `Menu.MenuList onAction` receives the `id` of the selected item as a string. Use a `switch` statement or object map to dispatch the right handler.
- `Menu.Separator` renders a `<hr>` between groups of related items — use it before destructive actions like "Delete".
- `placement="bottom start"` aligns the popover's left edge with the trigger's left edge. Use `"bottom end"` for right-aligned dropdowns.
