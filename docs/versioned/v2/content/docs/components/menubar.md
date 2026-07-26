# Menubar

`import { Menubar } from '@tale-ui/react/menubar';`

A horizontal composition wrapper for multiple `Menu.Root` instances (e.g., File, Edit, View).

`Menubar` does not implement menu popup behavior itself. Each `Menubar.Item`
is expected to contain one full `Menu.Root` composition from
`@tale-ui/react/menu`.

## Parts

| Part           | Description                                 |
| -------------- | ------------------------------------------- |
| `Menubar.Root` | The `<div role="menubar">` container.       |
| `Menubar.Item` | Wrapper for one `Menu.Root` inside the bar. |

## Props

Accepts all native `<div>` element props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { Menubar } from '@tale-ui/react/menubar';
import { Menu } from '@tale-ui/react/menu';

<Menubar.Root>
  <Menubar.Item>
    <Menu.Root>
      <Menu.Trigger>File</Menu.Trigger>
      <Menu.Popover>
        <Menu.MenuList>
          <Menu.Item id="new">New</Menu.Item>
          <Menu.Item id="open">Open</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="save-as">Save As...</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  </Menubar.Item>
  <Menubar.Item>
    <Menu.Root>
      <Menu.Trigger>Edit</Menu.Trigger>
      <Menu.Popover>
        <Menu.MenuList>
          <Menu.Item id="undo">Undo</Menu.Item>
          <Menu.Item id="redo">Redo</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  </Menubar.Item>
  <Menubar.Item>
    <Menu.Root>
      <Menu.Trigger>View</Menu.Trigger>
      <Menu.Popover>
        <Menu.MenuList>
          <Menu.Item id="zoom-in">Zoom In</Menu.Item>
          <Menu.Item id="zoom-out">Zoom Out</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="fullscreen">Fullscreen</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  </Menubar.Item>
</Menubar.Root>;
```

## CSS Classes

- `.tale-menubar` — Root container (`role="menubar"`)
- `.tale-menubar__item` — Individual menu wrapper

## Notes

- **Each `Menu.Root` must be wrapped in `<Menubar.Item>`.** The trigger styling (`padding`, `hover`, `focus`) comes from `.tale-menubar__item .tale-menu__trigger` — without the wrapper, triggers will be unstyled.
- Menubar itself has only two parts (`Root` and `Item`). Each `Item` wraps a full `Menu.Root` compound component.
- See the [Menu documentation](./menu.md) for details on `Menu.Root`, `Menu.Trigger`, `Menu.Popover`, `Menu.MenuList`, etc.
- The root renders with `role="menubar"` for accessibility.

## Pitfalls
