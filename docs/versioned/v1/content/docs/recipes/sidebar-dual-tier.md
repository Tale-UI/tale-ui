# Sidebar — Dual Tier

A two-column sidebar with a slim primary icon rail on the left and a secondary label panel that reveals on hover or keyboard focus. Ideal for applications with many top-level sections.

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Row` from `@tale-ui/react/row`
- `Text` from `@tale-ui/react/text`
- `Home`, `FileText`, `Users`, `BarChart2`, `Settings` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';
import { Home, FileText, Users, BarChart2, Settings } from 'lucide-react';
import { useState } from 'react';

const primaryItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

const secondaryItems = [{ href: '/settings', label: 'Settings', icon: Settings }];

export function DualTierLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const [expanded, setExpanded] = useState(false);

  return (
    <Row align="stretch" style={{ minHeight: '100vh', gap: 0 }}>
      {/* Primary icon rail */}
      <Sidebar.Root
        style={{ width: 72, flexShrink: 0 }}
        onMouseEnter={() => {
          setExpanded(true);
        }}
        onMouseLeave={() => {
          setExpanded(false);
        }}
      >
        <Sidebar.Header>
          <img src="/logo.svg" alt="Acme" width={32} height={32} />
          <Sidebar.MobileTrigger logo={<img src="/logo.svg" alt="Acme" width={32} height={32} />}>
            <Sidebar.NavList>
              {primaryItems.map((item) => (
                <Sidebar.NavItem
                  key={item.id}
                  href={`/${item.id}`}
                  icon={item.icon}
                  current={activeSection === item.id}
                >
                  {item.label}
                </Sidebar.NavItem>
              ))}
            </Sidebar.NavList>
            <Sidebar.Divider />
            <Sidebar.NavList>
              {secondaryItems.map((item) => (
                <Sidebar.NavItem key={item.href} href={item.href} icon={item.icon}>
                  {item.label}
                </Sidebar.NavItem>
              ))}
            </Sidebar.NavList>
          </Sidebar.MobileTrigger>
        </Sidebar.Header>

        <Sidebar.NavList>
          {primaryItems.map((item) => (
            <Sidebar.NavButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              title={item.label}
              current={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id);
              }}
            />
          ))}
        </Sidebar.NavList>

        <Sidebar.NavList>
          {secondaryItems.map((item) => (
            <Sidebar.NavButton
              key={item.href}
              icon={item.icon}
              label={item.label}
              title={item.label}
              href={item.href}
            />
          ))}
        </Sidebar.NavList>

        <Sidebar.AccountCard avatarSrc="/avatars/alex.jpg" name="Alex Chen" email="alex@acme.com" />
      </Sidebar.Root>

      {/* Secondary label panel — shown when expanded */}
      {expanded && activeSection && (
        <Sidebar.Root
          aria-label={`${activeSection} navigation`}
          style={{ width: 240, flexShrink: 0 }}
        >
          <Sidebar.Header>
            <Text variant="label">{activeSection}</Text>
          </Sidebar.Header>
          <Sidebar.NavList>
            {/* Render section-specific items here based on activeSection */}
            <Sidebar.NavItem href={`/${activeSection}`} current>
              Overview
            </Sidebar.NavItem>
            <Sidebar.NavItem href={`/${activeSection}/details`}>Details</Sidebar.NavItem>
          </Sidebar.NavList>
        </Sidebar.Root>
      )}

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>{children}</main>
    </Row>
  );
}
```

## Notes

- The two-tier layout is controlled by CSS or inline `style`: the icon rail constrains `Sidebar.Root` to a narrow width, and the secondary panel uses a wider `Sidebar.Root`.
- `Sidebar.NavButton` is an icon-only link/button; always pass `label`, and use `title` when you want a browser tooltip.
- The expand-on-hover pattern uses local `expanded` state driven by `onMouseEnter`/`onMouseLeave` on the primary rail. For a motion-animated version, wrap the secondary panel in a `<motion.div>` with an `x` transform.
- For persistent expand/collapse (user-controlled), replace hover logic with a toggle button and store the preference in `localStorage`.
- On mobile, `Sidebar.MobileTrigger` renders the drawer content passed as children.
