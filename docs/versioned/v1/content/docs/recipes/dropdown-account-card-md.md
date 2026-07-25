# Dropdown — Account Card (MD)

A medium account card with a larger avatar and role/team info below the user's name. Best for apps where the user's identity and role are prominent — e.g., admin panels or team dashboards.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`
- `Badge` from `@tale-ui/react/badge`
- `Icon` from `@tale-ui/react/icon`
- `ChevronsUpDown`, `LogOut`, `Settings`, `User` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';
import { Badge } from '@tale-ui/react/badge';
import { Icon } from '@tale-ui/react/icon';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';

type UserProfile = {
  name: string;
  email: string;
  role: string;
  plan: 'free' | 'pro' | 'enterprise';
  avatarSrc?: string;
};

const planVariant: Record<string, 'neutral' | 'brand' | 'success'> = {
  free: 'neutral',
  pro: 'brand',
  enterprise: 'success',
};

export function AccountCardMD({ user }: { user: UserProfile }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Account: ${user.name}`}
        className="tale-button tale-button--neutral tale-button--lg"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Avatar.Root size="md">
          {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
        {user.name}
        <Badge variant={planVariant[user.plan]} size="sm">
          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
        </Badge>
        <Icon icon={ChevronsUpDown} size="sm" />
      </Menu.Trigger>
      <Menu.Popover placement="top start" offset={4} style={{ minWidth: 260 }}>
        <Menu.MenuList
          onAction={(key) => {
            console.log('account:', key);
          }}
        >
          <Menu.Header>{user.name}</Menu.Header>
          <Menu.Item id="account-role" isDisabled>
            {user.role}
          </Menu.Item>
          <Menu.Item id="account-email" isDisabled>
            {user.email}
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item id="profile">
            <Icon icon={User} size="sm" />
            My profile
          </Menu.Item>
          <Menu.Item id="settings">
            <Icon icon={Settings} size="sm" />
            Account settings
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item id="sign-out">
            <Icon icon={LogOut} size="sm" />
            Sign out
          </Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- The `Badge` inside the trigger label shows the user's plan level. Use `variant="brand"` for paid tiers and `variant="neutral"` for the free tier to create a clear visual hierarchy.
- The popover repeats role and email as disabled menu items so the identity context inherits menu spacing and typography.
- Use this size when user identity is a primary app concept — e.g., multi-account apps, admin panels, or dashboards where the active user's role affects what they see.

## Preview

```tsx
const demoUser = {
  name: 'Alex Chen',
  email: 'alex@acme.com',
  role: 'Admin',
  plan: 'pro' as const,
};

export function Example() {
  return (
    <div style={{ width: 280, padding: 'var(--space-m)' }}>
      <AccountCardMD user={demoUser} />
    </div>
  );
}
```
