# Dropdown — Account Card (XS)

A compact XS-size account card that opens a menu on click. Suitable for dense sidebars or toolbars where vertical space is limited.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`
- `Icon` from `@tale-ui/react/icon`
- `ChevronsUpDown` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';
import { Icon } from '@tale-ui/react/icon';
import { ChevronsUpDown } from 'lucide-react';

type User = { name: string; email: string; avatarSrc?: string };

export function AccountCardXS({ user }: { user: User }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Account: ${user.name}`}
        className="tale-button tale-button--neutral tale-button--sm"
      >
        <Avatar.Root size="xs">
          {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
        {user.name}
        <Icon icon={ChevronsUpDown} size="sm" />
      </Menu.Trigger>
      <Menu.Popover placement="top start" offset={4} style={{ minWidth: 200 }}>
        <Menu.MenuList
          onAction={(key) => {
            console.log('account:', key);
          }}
        >
          <Menu.Item id="profile">Profile</Menu.Item>
          <Menu.Item id="settings">Settings</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="sign-out">Sign out</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- XS cards show only the user's name (no email) because the 24 px avatar leaves very little horizontal space.
- `Avatar.Root size="xs"` renders a 24 × 24 px circle. Use `size="sm"` (32 px) if you have space — it improves legibility on high-DPI screens.
- `Menu.Trigger` uses the Tale UI small button size to stay compact while preserving the built-in focus and interaction styling.
- Compare with [Account Card SM](dropdown-account-card-sm.md) and [Account Card MD](dropdown-account-card-md.md) for progressively larger variants.

## Preview

```tsx
const demoUser = { name: 'Alex Chen', email: 'alex@acme.com' };

export function Example() {
  return (
    <div style={{ width: 200, padding: 'var(--space-m)' }}>
      <AccountCardXS user={demoUser} />
    </div>
  );
}
```
