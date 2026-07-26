# Dropdown — Avatar Trigger

A user account dropdown triggered by clicking an avatar. Common in top navigation bars for accessing profile, settings, and sign-out.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';

type User = {
  name: string;
  email: string;
  avatarSrc?: string;
};

export function AvatarDropdown({ user }: { user: User }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Account menu for ${user.name}`}
        className="tale-icon-button tale-button tale-button--ghost tale-icon-button--md"
      >
        <Avatar.Root size="md">
          {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
      </Menu.Trigger>
      <Menu.Popover placement="bottom end" offset={8}>
        <Menu.MenuList
          onAction={(key) => {
            console.log('account action:', key);
          }}
        >
          <Menu.Header>{user.name}</Menu.Header>
          <Menu.Item id="account-email" isDisabled>
            {user.email}
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item id="profile">My profile</Menu.Item>
          <Menu.Item id="settings">Settings</Menu.Item>
          <Menu.Item id="notifications">Notifications</Menu.Item>
          <Menu.Separator />
          <Menu.LinkItem href="https://help.acme.com" target="_blank">
            Help ↗
          </Menu.LinkItem>
          <Menu.Separator />
          <Menu.Item id="sign-out">Sign out</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `Menu.Trigger` renders the button; apply Tale UI icon-button classes directly instead of nesting another button.
- `aria-label` on the trigger must name the control for screen readers; include the user's name so it reads "Account menu for Alex Chen".
- The non-interactive user info at the top of the popover uses `Menu.Header` and a disabled item so it inherits menu styling.
- `placement="bottom end"` aligns the popover's right edge with the trigger's right edge — keeps the menu within the viewport when the avatar is near the right edge.
- `Menu.Indicator` (from `Avatar.Indicator`) can be composed over the avatar to show online/offline status independently of this menu.

## Preview

```tsx
const demoUser = { name: 'Alex Chen', email: 'alex@acme.com' };

export function Example() {
  return <AvatarDropdown user={demoUser} />;
}
```
