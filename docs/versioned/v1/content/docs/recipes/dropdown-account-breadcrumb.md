# Dropdown — Account in Breadcrumb

A workspace/account switcher embedded in a breadcrumb trail. Clicking the account name opens a dropdown to switch between workspaces or organizations.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Breadcrumbs` from `@tale-ui/react/breadcrumbs`
- `Avatar` from `@tale-ui/react/avatar`
- `Icon` from `@tale-ui/react/icon`
- `ChevronDown`, `Check` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';
import { Avatar } from '@tale-ui/react/avatar';
import { Icon } from '@tale-ui/react/icon';
import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

type Workspace = { id: string; name: string; avatarSrc?: string };

const workspaces: Workspace[] = [
  { id: 'acme', name: 'Acme Inc.', avatarSrc: '/logos/acme.png' },
  { id: 'personal', name: 'Personal', avatarSrc: undefined },
  { id: 'demo', name: 'Demo Workspace', avatarSrc: undefined },
];

export function BreadcrumbAccountDropdown({ page }: { page: string }) {
  const [activeWorkspace, setActiveWorkspace] = useState<string>('acme');
  const active = workspaces.find((w) => w.id === activeWorkspace)!;

  return (
    <Breadcrumbs.Root>
      <Breadcrumbs.Item>
        {/* Workspace switcher as first breadcrumb item */}
        <Menu.Root>
          <Menu.Trigger
            aria-label="Switch workspace"
            className="tale-button tale-button--ghost tale-button--sm"
          >
            <Avatar.Root size="xs">
              {active.avatarSrc ? <Avatar.Image src={active.avatarSrc} alt={active.name} /> : null}
              <Avatar.Fallback>{active.name[0]}</Avatar.Fallback>
            </Avatar.Root>
            {active.name}
            <Icon icon={ChevronDown} size="sm" />
          </Menu.Trigger>
          <Menu.Popover placement="bottom start" offset={8} style={{ minWidth: 220 }}>
            <Menu.MenuList
              onAction={(key) => {
                setActiveWorkspace(String(key));
              }}
            >
              <Menu.Header>Workspaces</Menu.Header>
              {workspaces.map((workspace) => (
                <Menu.Item key={workspace.id} id={workspace.id}>
                  <Avatar.Root size="xs">
                    {workspace.avatarSrc ? (
                      <Avatar.Image src={workspace.avatarSrc} alt={workspace.name} />
                    ) : null}
                    <Avatar.Fallback>{workspace.name[0]}</Avatar.Fallback>
                  </Avatar.Root>
                  {workspace.name}
                  {workspace.id === activeWorkspace ? (
                    <Icon icon={Check} size="sm" style={{ marginInlineStart: 'auto' }} />
                  ) : null}
                </Menu.Item>
              ))}
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Breadcrumbs.Item>

      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Item>
        <Breadcrumbs.Link aria-current="page">{page}</Breadcrumbs.Link>
      </Breadcrumbs.Item>
    </Breadcrumbs.Root>
  );
}
```

## Notes

- The workspace switcher replaces `Breadcrumbs.Link` in the first item — `Breadcrumbs.Item` can hold any child, not just a link.
- `aria-current="page"` goes on the last (current) breadcrumb item, not on the workspace switcher.
- Keep the workspace list short (under 8 items). For teams with many workspaces, add a `SearchField` above the `Menu.MenuList`.
- The `Check` icon with `marginInlineStart: 'auto'` is a right-aligned selection indicator — it shows which workspace is currently active without relying solely on color.

## Preview

```tsx
export function Example() {
  return <BreadcrumbAccountDropdown page="Overview" />;
}
```
