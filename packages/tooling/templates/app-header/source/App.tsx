import { HeaderNav } from '@tale-ui/react/header-nav';
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { SearchField } from '@tale-ui/react/search-field';
import { Column } from '@tale-ui/react/column';
import { Bell, ChevronDown } from 'lucide-react';

export function Example() {
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
