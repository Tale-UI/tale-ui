# App Header Navigation

A horizontal application header built with `HeaderNav` primitives. Includes a logo, primary nav links, a search field, notification bell, and a user account menu.

## Components Used

- `HeaderNav` from `@tale-ui/react/header-nav`
- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `SearchField` from `@tale-ui/react/search-field`
- `Column` from `@tale-ui/react/column`
- `Bell`, `ChevronDown` from `lucide-react`

## Code

```tsx
import { HeaderNav } from '@tale-ui/react/header-nav';
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { SearchField } from '@tale-ui/react/search-field';
import { Column } from '@tale-ui/react/column';
import { Bell, ChevronDown } from 'lucide-react';

export function AppHeader() {
  return (
    <HeaderNav.Root>
      <HeaderNav.Logo href="/">
        <img src="/logo.svg" alt="Acme" height={28} />
      </HeaderNav.Logo>

      <HeaderNav.Secondary>
        <HeaderNav.NavButton href="/" current>
          Dashboard
        </HeaderNav.NavButton>
        <HeaderNav.NavButton href="/projects">Projects</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/analytics">Analytics</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/team">Team</HeaderNav.NavButton>
      </HeaderNav.Secondary>

      <HeaderNav.Actions>
        <SearchField.Root variant="inline" style={{ width: 220 }}>
          <SearchField.Label>Search</SearchField.Label>
          <SearchField.Input placeholder="Search…" />
        </SearchField.Root>

        <IconButton aria-label="Notifications" variant="ghost" size="sm">
          <Icon icon={Bell} size="sm" />
        </IconButton>

        {/* Account dropdown */}
        <Menu.Root>
          <Menu.Trigger
            aria-label="Account menu"
            className="tale-button tale-button--ghost tale-button--sm"
          >
            <Avatar.Root size="sm">
              <Avatar.Image src="/avatars/alex.jpg" alt="Alex Chen" />
              <Avatar.Fallback>AC</Avatar.Fallback>
            </Avatar.Root>
            <Icon icon={ChevronDown} size="sm" />
          </Menu.Trigger>
          <Menu.Popover placement="bottom end" offset={8}>
            <Menu.MenuList>
              <Menu.Item id="profile">My Profile</Menu.Item>
              <Menu.Item id="settings">Settings</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="sign-out">Sign out</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>

        <HeaderNav.MobileTrigger>
          <Column gap="2xs">
            <HeaderNav.NavButton href="/" current>
              Dashboard
            </HeaderNav.NavButton>
            <HeaderNav.NavButton href="/projects">Projects</HeaderNav.NavButton>
            <HeaderNav.NavButton href="/analytics">Analytics</HeaderNav.NavButton>
            <HeaderNav.NavButton href="/team">Team</HeaderNav.NavButton>
          </Column>
        </HeaderNav.MobileTrigger>
      </HeaderNav.Actions>
    </HeaderNav.Root>
  );
}
```

## Notes

- `HeaderNav.Root` renders a `<header>` with `role="banner"` and a flex row layout. It has a bottom border by default.
- `HeaderNav.NavButton href="…" current` applies `aria-current="page"` and the `--current` BEM modifier.
- `HeaderNav.Secondary` is a `<nav>` landmark. Keep it focused on primary section links; use `Menu` for any item that needs a dropdown.
- `HeaderNav.Actions` is a flex row that auto-aligns to the right via `margin-inline-start: auto`.
- `HeaderNav.MobileTrigger` is hidden on desktop (≥ 768 px) and opens a drawer containing all nav links on mobile.
- For a sticky header, add `position: sticky; top: 0; z-index: var(--z-sticky);` to `HeaderNav.Root` via `className` or wrapping `<div>`.
