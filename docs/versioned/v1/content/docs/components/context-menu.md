# ContextMenu

`import { ContextMenu } from '@tale-ui/react/context-menu';`

A right-click context menu that appears at the cursor position.

`ContextMenu` is intentionally separate from `Menu.Root` because it opens from
a cursor-positioned virtual trigger instead of a button trigger. It still uses
React Aria `Menu`, `MenuItem`, `MenuSection`, and `Popover` primitives directly,
and its popup/item styles are grouped with `Menu` in the shared CSS primitives.

## Parts

| Part                    | Description                                   |
| ----------------------- | --------------------------------------------- |
| `ContextMenu.Root`      | Manages open/close state and cursor position. |
| `ContextMenu.Trigger`   | The right-click target area.                  |
| `ContextMenu.Popup`     | Positioned popover at cursor location.        |
| `ContextMenu.MenuList`  | The menu list. Auto-closes on item action.    |
| `ContextMenu.Item`      | A menu item. Accepts `id` and `onAction`.     |
| `ContextMenu.Group`     | Groups items into a section.                  |
| `ContextMenu.Separator` | Visual separator between items or groups.     |

## Props

Accepts all React Aria `Menu` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ContextMenu } from '@tale-ui/react/context-menu';

<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
  <ContextMenu.Popup>
    <ContextMenu.MenuList>
      <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
      <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
    </ContextMenu.MenuList>
  </ContextMenu.Popup>
</ContextMenu.Root>;
```

## Examples

### With Groups

```tsx
<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div
      style={{
        padding: 'var(--space-xl)',
        border: '2px dashed var(--neutral-30)',
        borderRadius: 'var(--space-2xs)',
        textAlign: 'center',
      }}
    >
      Right-click this area
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Popup>
    <ContextMenu.MenuList>
      <ContextMenu.Group>
        <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
        <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
        <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.Group>
        <ContextMenu.Item id="select-all">Select All</ContextMenu.Item>
        <ContextMenu.Item id="find">Find...</ContextMenu.Item>
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.Group>
        <ContextMenu.Item id="inspect">Inspect Element</ContextMenu.Item>
      </ContextMenu.Group>
    </ContextMenu.MenuList>
  </ContextMenu.Popup>
</ContextMenu.Root>
```

## CSS Classes

- `.tale-context-menu__trigger` — Right-click target area
- `.tale-context-menu` — Popover container
- `.tale-context-menu__list` — Menu list
- `.tale-context-menu__item` — Menu item
- `.tale-context-menu__group` — Item group section
- `.tale-context-menu__separator` — Separator line

## Pitfalls

<!-- pitfall: context-menu-no-controlled-state -->

- **No controlled state props on `ContextMenu.Root`** — open/close is managed internally by right-click interaction.
  - anti-pattern: `<ContextMenu.Root isOpen={open}>`
  - fix: `<ContextMenu.Root>`
  - complete example:

    ```tsx
    import { ContextMenu } from '@tale-ui/react/context-menu';

    export function Example() {
      return (
        <ContextMenu.Root>
          <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
          <ContextMenu.Popup>
            <ContextMenu.MenuList>
              <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
              <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
            </ContextMenu.MenuList>
          </ContextMenu.Popup>
        </ContextMenu.Root>
      );
    }
    ```

<!-- pitfall: context-menu-no-right-click-prop -->
<!-- prose-only -->

- **No `rightClick` prop on `ContextMenu.Trigger`** — right-click behavior is built-in.

<!-- pitfall: context-menu-uses-popup-not-popover -->

- **Use `ContextMenu.Popup`, not `ContextMenu.Popover`** — there is no `Popover` part in ContextMenu.
  - anti-pattern: `<ContextMenu.Popover>...</ContextMenu.Popover>`
  - fix: `<ContextMenu.Popup>...</ContextMenu.Popup>`

<!-- pitfall: context-menu-menulist-required -->
<!-- multi-idea-ok -->

- **`ContextMenu.MenuList` is required between `ContextMenu.Popup` and `ContextMenu.Item`** — placing items directly inside `Popup` causes TypeScript errors.
  - anti-pattern: `<ContextMenu.Popup><ContextMenu.Item id="a">A</ContextMenu.Item></ContextMenu.Popup>`
  - fix: `<ContextMenu.Popup><ContextMenu.MenuList><ContextMenu.Item id="a">A</ContextMenu.Item></ContextMenu.MenuList></ContextMenu.Popup>`

<!-- pitfall: context-menu-item-no-tone -->
<!-- prose-only -->

- **`ContextMenu.Item` has no `tone`, `color`, `intent`, or `variant` props** — use `isDisabled` for visual feedback.

<!-- cross-pitfall-ref: no-asChild-on-triggers -->

## Notes

- The menu appears at the cursor position using a virtual trigger element.
- `ContextMenu` shares popup, item, separator, and motion styling with `Menu`, but keeps its own public parts for right-click interaction.
- `ContextMenu.MenuList` automatically closes the menu when any item action fires.
- The `Trigger` renders a `<div>` (not a button), so any content can be a right-click target.
- Clicking outside the menu closes it.
