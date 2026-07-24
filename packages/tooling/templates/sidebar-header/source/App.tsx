import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { HeaderNav } from '@tale-ui/react/header-nav';
import { Drawer } from '@tale-ui/react/drawer';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Separator } from '@tale-ui/react/separator';
import { Button } from '@tale-ui/react/button';
import { Column } from '@tale-ui/react/column';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';
import { Menu, Home, Settings, Users, FileText, Bell } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function SidebarNav() {
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

export function Example({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Row align="stretch" style={{ minHeight: '100vh', gap: 0 }}>
      <aside style={{ width: 240, flexShrink: 0 }}>
        <Column gap="s" style={{ padding: 'var(--space-s)' }}>
          <Text variant="label" size="l">
            Acme
          </Text>
          <Separator />
          <SidebarNav />
        </Column>
      </aside>

      <Column gap="4xs" style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <HeaderNav.Root>
          {/* Mobile menu trigger */}
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
              <SidebarNav />
            </Drawer.Popup>
          </Drawer.Root>

          <HeaderNav.Actions>
            <IconButton aria-label="Notifications" variant="ghost" size="sm">
              <Icon icon={Bell} size="sm" />
            </IconButton>
            <Button variant="ghost" size="sm">
              Account
            </Button>
          </HeaderNav.Actions>
        </HeaderNav.Root>

        {/* Scrollable content */}
        <main style={{ flex: 1, padding: 'var(--space-l)', overflow: 'auto' }}>{children}</main>
      </Column>
    </Row>
  );
}
