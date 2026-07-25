# Marketing Header

A marketing site header with a logo, nav links (some with dropdown mega-menus), right-aligned CTA buttons, and a hamburger that opens a full-screen mobile drawer.

## Components Used

- `HeaderNav` from `@tale-ui/react/header-nav`
- `Menu` from `@tale-ui/react/menu`
- `Button` from `@tale-ui/react/button`
- `Icon` from `@tale-ui/react/icon`
- `Column` from `@tale-ui/react/column`
- `ChevronDown` from `lucide-react`

## Code

```tsx
import { HeaderNav } from '@tale-ui/react/header-nav';
import { Menu } from '@tale-ui/react/menu';
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Column } from '@tale-ui/react/column';
import { ChevronDown } from 'lucide-react';

export function MarketingHeader() {
  return (
    <HeaderNav.Root>
      <HeaderNav.Logo href="/">
        <img src="/logo.svg" alt="Acme" height={28} />
      </HeaderNav.Logo>

      <HeaderNav.Secondary>
        {/* Plain link */}
        <HeaderNav.NavButton href="/features">Features</HeaderNav.NavButton>

        {/* Dropdown: Solutions */}
        <Menu.Root>
          <Menu.Trigger className="tale-button tale-button--ghost tale-button--sm">
            Solutions
            <Icon icon={ChevronDown} size="sm" />
          </Menu.Trigger>
          <Menu.Popover placement="bottom" offset={8}>
            <Menu.MenuList>
              <Menu.Group>
                <Menu.Header>By Team</Menu.Header>
                <Menu.LinkItem href="/solutions/engineering">Engineering</Menu.LinkItem>
                <Menu.LinkItem href="/solutions/design">Design</Menu.LinkItem>
                <Menu.LinkItem href="/solutions/marketing">Marketing</Menu.LinkItem>
              </Menu.Group>
              <Menu.Separator />
              <Menu.Group>
                <Menu.Header>By Company Size</Menu.Header>
                <Menu.LinkItem href="/solutions/startup">Startups</Menu.LinkItem>
                <Menu.LinkItem href="/solutions/enterprise">Enterprise</Menu.LinkItem>
              </Menu.Group>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>

        <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/blog">Blog</HeaderNav.NavButton>
      </HeaderNav.Secondary>

      <HeaderNav.Actions>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            window.location.href = '/login';
          }}
        >
          Log in
        </Button>
        <Button
          variant="primary"
          size="sm"
          onPress={() => {
            window.location.href = '/signup';
          }}
        >
          Get started
        </Button>

        <HeaderNav.MobileTrigger>
          <Column gap="2xs">
            <HeaderNav.NavButton href="/features">Features</HeaderNav.NavButton>
            <HeaderNav.NavButton href="/solutions/engineering">Engineering</HeaderNav.NavButton>
            <HeaderNav.NavButton href="/solutions/design">Design</HeaderNav.NavButton>
            <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
            <HeaderNav.NavButton href="/blog">Blog</HeaderNav.NavButton>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => {
                window.location.href = '/login';
              }}
            >
              Log in
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={() => {
                window.location.href = '/signup';
              }}
            >
              Get started
            </Button>
          </Column>
        </HeaderNav.MobileTrigger>
      </HeaderNav.Actions>
    </HeaderNav.Root>
  );
}
```

## Notes

- Marketing headers typically span the full viewport width with a `max-width` container inside. Wrap `HeaderNav.Root` in a `<div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--space-l)' }}>`.
- For a transparent header that becomes opaque on scroll, add a scroll listener and toggle a class on `HeaderNav.Root` via `className`.
- `Menu.LinkItem` renders a proper `<a>` for navigation items inside a dropdown. `Menu.Item` (with `onAction`) is for actions that don't navigate.
- On mobile, `HeaderNav.MobileTrigger` opens a drawer that renders all `HeaderNav.Secondary` links and `HeaderNav.Actions` content as a full-screen overlay. Stack the buttons vertically in the drawer via CSS.
- For a sticky marketing header, combine `position: sticky; top: 0;` with `backdrop-filter: blur(8px); background: color-mix(in srgb, var(--neutral-5) 85%, transparent);`.
