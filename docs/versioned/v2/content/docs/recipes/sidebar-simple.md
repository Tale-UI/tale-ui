# Sidebar — Simple

A single-tier sidebar with logo, navigation items, and an account card at the bottom. Collapses into a modal drawer on mobile via `Sidebar.MobileTrigger`.

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Row` from `@tale-ui/react/row`
- `Text` from `@tale-ui/react/text`
- `Home`, `FileText`, `Users`, `Settings` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';
import { Home, FileText, Users, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home, current: true },
  { href: '/documents', label: 'Documents', icon: FileText, current: false },
  { href: '/team', label: 'Team', icon: Users, current: false },
  { href: '/settings', label: 'Settings', icon: Settings, current: false },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Row align="stretch" style={{ minHeight: '100vh', gap: 0 }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <Text variant="label" size="l">
            Acme
          </Text>
          <Sidebar.MobileTrigger
            logo={
              <Text variant="label" size="l">
                Acme
              </Text>
            }
          >
            <Sidebar.NavList>
              {navItems.map((item) => (
                <Sidebar.NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  current={item.current}
                >
                  {item.label}
                </Sidebar.NavItem>
              ))}
            </Sidebar.NavList>
          </Sidebar.MobileTrigger>
        </Sidebar.Header>

        <Sidebar.NavList>
          {navItems.map((item) => (
            <Sidebar.NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              current={item.current}
            >
              {item.label}
            </Sidebar.NavItem>
          ))}
        </Sidebar.NavList>

        <Sidebar.AccountCard name="Alex Chen" email="alex@acme.com" avatarSrc="/avatars/alex.jpg" />
      </Sidebar.Root>

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>{children}</main>
    </Row>
  );
}
```

## Notes

- `Sidebar.Root` renders a `<aside>` with `role="navigation"` and the `tale-sidebar` BEM class.
- `Sidebar.NavItem` applies `aria-current="page"` when `current` is `true` and renders the icon + label automatically.
- `Sidebar.MobileTrigger` renders a hamburger button that opens a modal drawer containing the children you pass to it.
- `Sidebar.AccountCard` renders the user's avatar (image → initials → placeholder fallback), name, email, and a chevron trigger for an account menu.
- To highlight the active item, pass `current={pathname === item.href}` using your router's current path.
