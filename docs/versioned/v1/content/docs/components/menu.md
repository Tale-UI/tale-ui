# Menu

`import { Menu } from '@tale-ui/react/menu';`

A dropdown menu triggered by a button, with items, groups, headers, and separators.

## Parts

| Part | Description |
|------|-------------|
| `Menu.Root` | Manages open/close state. Accepts `isDisabled`. |
| `Menu.Trigger` | Button that opens the menu. Style with `className="tale-button tale-button--{variant} tale-button--{size}"`. |
| `Menu.Popover` | Positioned popover container. Accepts `placement` and `offset`. |
| `Menu.MenuList` | The menu list (`role="menu"`). Accepts collection-level `onAction`. |
| `Menu.Item` | A menu item. Accepts `id`, `isDisabled`, `onAction`. |
| `Menu.Group` | Groups items under a section (MenuSection). |
| `Menu.Header` | Section header label inside a `Group`. |
| `Menu.Separator` | Visual separator between items or groups. |
| `Menu.Arrow` | Arrow pointing to the trigger (place inside `Popover`). |
| `Menu.CheckboxItem` | A menu item with a checkbox toggle. Use with `selectionMode="multiple"`. |
| `Menu.RadioItem` | A menu item with radio selection. Use with `selectionMode="single"`. |
| `Menu.LinkItem` | A menu item that navigates to a URL. Accepts `href` and `target`. |
| `Menu.SubmenuTrigger` | A menu item that opens a nested submenu on hover/click. |

## Props

Accepts all React Aria `MenuTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

`Menu.MenuList` accepts React Aria menu props. In React Aria 1.19, its
collection-level `onAction` callback receives both the item key and the item
value: `onAction={(key, value) => { ... }}`. For static menu items, set `value`
on the item when the callback needs more than the key. Item-level `onAction`
callbacks on `Menu.Item`, `Menu.CheckboxItem`, `Menu.RadioItem`, and `Menu.LinkItem`
remain zero-argument callbacks.

## Basic Usage

```tsx
import { Menu } from '@tale-ui/react/menu';

<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Item id="new">New File</Menu.Item>
      <Menu.Item id="open">Open</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="save">Save</Menu.Item>
      <Menu.Item id="save-as">Save As...</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="close">Close</Menu.Item>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

## Examples

### With Groups

```tsx
<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Actions ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Group>
        <Menu.Header>Edit</Menu.Header>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Group>
        <Menu.Header>View</Menu.Header>
        <Menu.Item id="zoom-in">Zoom In</Menu.Item>
        <Menu.Item id="zoom-out">Zoom Out</Menu.Item>
        <Menu.Item id="reset-zoom">Reset Zoom</Menu.Item>
      </Menu.Group>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### With Disabled Items

```tsx
<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Edit ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Item id="undo">Undo</Menu.Item>
      <Menu.Item id="redo" isDisabled>Redo</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="cut">Cut</Menu.Item>
      <Menu.Item id="copy">Copy</Menu.Item>
      <Menu.Item id="paste" isDisabled>Paste</Menu.Item>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### Disabled Menu

```tsx
<Menu.Root isDisabled>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Disabled Menu ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Item id="a">Item A</Menu.Item>
      <Menu.Item id="b">Item B</Menu.Item>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### Checkbox Items

```tsx
<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList aria-label="View options" selectionMode="multiple">
      <Menu.CheckboxItem id="sidebar" textValue="Show Sidebar">Show Sidebar</Menu.CheckboxItem>
      <Menu.CheckboxItem id="minimap" textValue="Show Minimap">Show Minimap</Menu.CheckboxItem>
      <Menu.CheckboxItem id="wordwrap" textValue="Word Wrap">Word Wrap</Menu.CheckboxItem>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### Radio Items

```tsx
<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Sort ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList aria-label="Sort order" selectionMode="single">
      <Menu.RadioItem id="name" textValue="Name">Name</Menu.RadioItem>
      <Menu.RadioItem id="date" textValue="Date">Date</Menu.RadioItem>
      <Menu.RadioItem id="size" textValue="Size">Size</Menu.RadioItem>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### Link Items

```tsx
<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Links ▾</Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList aria-label="External links">
      <Menu.LinkItem id="docs" href="/docs" textValue="Documentation">Documentation</Menu.LinkItem>
      <Menu.LinkItem id="github" href="https://github.com" target="_blank" textValue="GitHub">GitHub</Menu.LinkItem>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

## CSS Classes

- `.tale-menu__trigger` — Trigger button
- `.tale-menu__popover` — Popover container
- `.tale-menu__popup` — Menu list
- `.tale-menu__item` — Menu item
- `.tale-menu__header` — Group header
- `.tale-menu__separator` — Separator line
- `.tale-menu__arrow` — Arrow element
- `.tale-menu__checkbox-item` — Checkbox menu item
- `.tale-menu__radio-item` — Radio menu item
- `.tale-menu__link-item` — Link menu item
- `.tale-menu__submenu-trigger` — Submenu trigger item
- `.tale-menu__item-indicator` — Checkbox/radio item check indicator
- `.tale-menubar` — Horizontal menu bar container
- `.tale-menubar__item` — Individual menubar item wrapper

## Pitfalls

<!-- pitfall: menu-menulist-required -->
<!-- multi-idea-ok -->
- **`Menu.MenuList` is required between `Menu.Popover` and `Menu.Item`** — placing items directly inside `Popover` causes TypeScript errors.
  - anti-pattern: `<Menu.Popover><Menu.Item id="a">A</Menu.Item></Menu.Popover>`
  - fix: `<Menu.Popover><Menu.MenuList><Menu.Item id="a">A</Menu.Item></Menu.MenuList></Menu.Popover>`
  - complete example:
    ```tsx
    import { Menu } from '@tale-ui/react/menu';

    export function Example() {
      return (
        <Menu.Root>
          <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList>
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

<!-- pitfall: menu-separator-inside-menulist -->
- **`Menu.Separator` goes inside `Menu.MenuList`, not as a sibling** — a separator outside the list renders outside `role="menu"`.
  - anti-pattern: `<Menu.MenuList>...</Menu.MenuList><Menu.Separator /><Menu.MenuList>...</Menu.MenuList>`
  - fix: `<Menu.MenuList>...<Menu.Separator />...</Menu.MenuList>`

<!-- pitfall: menu-root-no-onaction-open -->
<!-- prose-only -->
- **`Menu.Root` does not accept `onAction` or `open`** — pass `onAction` to `Menu.Item`; open state is managed internally.

<!-- cross-pitfall-ref: no-asChild-on-triggers -->
<!-- cross-pitfall-ref: no-button-inside-trigger -->
<!-- pitfall: use-menu-for-any-prompt -->
- **Use `<Menu>` for any prompt that asks for a dropdown menu, action menu, or options menu** — when the request is for a button-triggered list of actions, render the `Menu` component itself instead of a plain `Button`, custom popover markup, or an empty placeholder.
  - anti-pattern: `import { Button } from '@tale-ui/react/button'; export function FileActions() { return <Button>File</Button>; }`
  - anti-pattern: `// empty file`
  - fix: `import { Menu } from '@tale-ui/react/menu'; export function FileActions() { return <Menu.Root><Menu.Trigger className="tale-button tale-button--neutral tale-button--md">File</Menu.Trigger><Menu.Popover><Menu.MenuList><Menu.Item id="new">New</Menu.Item><Menu.Separator /><Menu.Item id="close">Close</Menu.Item></Menu.MenuList></Menu.Popover></Menu.Root>; }`

## Notes

- Each `Menu.Item` requires a unique `id` prop. Add `textValue` for accessibility (screen reader announcements and keyboard type-ahead).
- Use `isDisabled` on individual items or on `Menu.Root` to disable the entire menu.
- Use `onAction` on `Menu.MenuList` to handle all item actions from one place, or use item-level `onAction` for local callbacks.
- **Do not nest `<Button>` inside `<Menu.Trigger>`.** `Menu.Trigger` is a React Aria `Button` — nesting another `<Button>` creates invalid `<button><button>` HTML. Instead, apply button styling via `className="tale-button tale-button--{variant} tale-button--{size}"` directly on `Menu.Trigger`.
- Add `aria-label` to `Menu.MenuList` to describe the menu's purpose to screen readers.
- Menu automatically provides `role="menu"` and each Item gets `role="menuitem"`.
