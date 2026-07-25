# Dropdown — Button (Advanced)

A rich dropdown with grouped items, icons, badges, and a disabled item. Demonstrates the full composition range of the `Menu` namespace.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Badge` from `@tale-ui/react/badge`
- `Icon` from `@tale-ui/react/icon`
- `Copy`, `Pencil`, `FolderOpen`, `Trash2`, `Share2`, `ExternalLink`, `Star` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Badge } from '@tale-ui/react/badge';
import { Icon } from '@tale-ui/react/icon';
import { Copy, Pencil, FolderOpen, Trash2, Share2, ExternalLink, Star } from 'lucide-react';

export function AdvancedButtonDropdown() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        More options ▾
      </Menu.Trigger>
      <Menu.Popover placement="bottom start" offset={4}>
        <Menu.MenuList
          onAction={(key) => {
            console.log('action:', key);
          }}
        >
          <Menu.Group>
            <Menu.Header>Edit</Menu.Header>
            <Menu.Item id="rename">
              <Icon icon={Pencil} size="sm" />
              Rename
            </Menu.Item>
            <Menu.Item id="duplicate">
              <Icon icon={Copy} size="sm" />
              Duplicate
            </Menu.Item>
            <Menu.Item id="move">
              <Icon icon={FolderOpen} size="sm" />
              Move to folder
            </Menu.Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Menu.Header>Share</Menu.Header>
            <Menu.Item id="share-link">
              <Icon icon={Share2} size="sm" />
              Copy share link
            </Menu.Item>
            <Menu.Item id="open-external">
              <Icon icon={ExternalLink} size="sm" />
              Open in new tab
            </Menu.Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Item id="favorite">
            <Icon icon={Star} size="sm" />
            Add to favourites
            <Badge variant="neutral" size="sm" style={{ marginInlineStart: 'auto' }}>
              New
            </Badge>
          </Menu.Item>

          <Menu.Separator />

          <Menu.Item id="delete" isDisabled>
            <Icon icon={Trash2} size="sm" />
            Delete
          </Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `Menu.Item` children can be any React nodes — put an `<Icon>` before the label and a `<Badge>` after it using `margin-inline-start: auto` to push it to the right edge.
- `Menu.Header` is purely visual; it does not add ARIA semantics on its own. The `Menu.Group` wrapper renders a `<section>` with `aria-label` automatically.
- `isDisabled` on a `Menu.Item` prevents selection but keeps the item visible; screen readers announce it as dimmed/unavailable.
- For a "danger" delete item, add `className="tale-menu__item--danger"` to give it a red color token treatment.
