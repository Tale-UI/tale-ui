# Dropdown — Account Button

A button trigger that shows the signed-in user's name and opens an account menu. Designed for sidebar footers or compact app headers.

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

type User = {
  name: string;
  email: string;
  avatarSrc?: string;
};

export function AccountButton({ user }: { user: User }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Account menu"
        className="tale-button tale-button--neutral tale-button--md"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Avatar.Root size="sm">
          {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
        {user.name}
        <Icon icon={ChevronsUpDown} size="sm" />
      </Menu.Trigger>
      <Menu.Popover placement="top start" offset={4}>
        <Menu.MenuList
          onAction={(key) => {
            console.log('account:', key);
          }}
        >
          <Menu.Header>{user.email}</Menu.Header>
          <Menu.Item id="profile">My profile</Menu.Item>
          <Menu.Item id="settings">Account settings</Menu.Item>
          <Menu.Item id="plan">Upgrade plan</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="sign-out">Sign out</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `placement="top start"` opens the menu upward — when this component is at the bottom of a sidebar, an upward popover stays within the viewport.
- `width: 100%` on `Menu.Trigger` allows `AccountButton` to span the full sidebar width; the parent layout controls the outer width.
- Use `Menu.Header` for supporting account context instead of custom text wrappers.
- This component pairs directly with `Sidebar.AccountCard` — swap one for the other when you need the built-in sidebar account card.

## Preview

```tsx
const demoUser = { name: 'Alex Chen', email: 'alex@acme.com' };

export function Example() {
  return (
    <div style={{ width: 240, padding: 'var(--space-m)' }}>
      <AccountButton user={demoUser} />
    </div>
  );
}
```
