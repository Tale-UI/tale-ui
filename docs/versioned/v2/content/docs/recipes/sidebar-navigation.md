# Sidebar Navigation

A responsive sidebar that collapses into a mobile drawer on small screens.

## Components Used

- `NavigationMenu` from `@tale-ui/react/navigation-menu`
- `Drawer` from `@tale-ui/react/drawer`
- `Icon` from `@tale-ui/react/icon`
- `Row` from `@tale-ui/react/row`
- `Separator` from `@tale-ui/react/separator`
- `Menu`, `Home`, `Settings`, `Users`, `FileText` from `lucide-react`

## Code

```tsx
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Drawer } from '@tale-ui/react/drawer';
import { Icon } from '@tale-ui/react/icon';
import { Row } from '@tale-ui/react/row';
import { Separator } from '@tale-ui/react/separator';
import { Menu, Home, Settings, Users, FileText } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NavContent() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        {navItems.map((item) => (
          <NavigationMenu.Item key={item.href}>
            <NavigationMenu.Link href={item.href}>
              <NavigationMenu.Icon>
                <Icon icon={item.icon} size="sm" />
              </NavigationMenu.Icon>
              {item.label}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Row align="stretch" style={{ minHeight: '100vh', gap: 0 }}>
      <aside style={{ width: 240, padding: 'var(--space-s)' }}>
        <NavContent />
      </aside>

      <Separator orientation="vertical" />

      {/* Mobile drawer */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Trigger
          aria-label="Open menu"
          className="tale-icon-button tale-button tale-button--ghost tale-icon-button--md"
        >
          <Icon icon={Menu} />
        </Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Popup style={{ width: 280, minHeight: '100vh', padding: 'var(--space-s)' }}>
          <Drawer.Title>Navigation</Drawer.Title>
          <NavContent />
        </Drawer.Popup>
      </Drawer.Root>

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>{children}</main>
    </Row>
  );
}
```

## Customization Points

- Replace `navItems` with your app's route structure.
- Add nested navigation by using `NavigationMenu.Trigger` and `NavigationMenu.Popup` for dropdowns.
- Use `aria-current="page"` on the active link (React Aria handles this automatically when `href` matches).
- Hide or move the `Drawer.Trigger` with your app shell if you need breakpoint-specific behavior.
- `Drawer.Root` uses `open`/`onOpenChange` (not `isOpen`) — it's a custom component.
- `NavigationMenu.Root` has no `orientation` prop; use this pattern for compact route lists and switch to `Sidebar` for richer app sidebars.
