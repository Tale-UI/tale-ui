# Sidebar — Slim (Icon Only)

A permanent icon-only sidebar with tooltips. Use when screen real estate is tight and users are already familiar with the navigation icons.

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Row` from `@tale-ui/react/row`
- `Home`, `FileText`, `Users`, `Settings`, `HelpCircle` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Row } from '@tale-ui/react/row';
import { Home, FileText, Users, Settings, HelpCircle } from 'lucide-react';

const topItems = [
  { href: '/', label: 'Home', icon: Home, current: true },
  { href: '/documents', label: 'Documents', icon: FileText, current: false },
  { href: '/team', label: 'Team', icon: Users, current: false },
];

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings, current: false },
  { href: '/help', label: 'Help', icon: HelpCircle, current: false },
];

function NavButton({
  href,
  label,
  icon,
  current,
}: {
  href: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  current: boolean;
}) {
  return (
    <Sidebar.NavButton href={href} icon={icon} label={label} current={current} title={label} />
  );
}

export function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <Row align="stretch" style={{ minHeight: '100vh', gap: 0 }}>
      <Sidebar.Root style={{ width: 72, flexShrink: 0 }}>
        <Sidebar.Header>
          <img src="/logo-mark.svg" alt="Acme" width={28} height={28} />
          <Sidebar.MobileTrigger
            logo={<img src="/logo-mark.svg" alt="Acme" width={28} height={28} />}
          >
            <Sidebar.NavList>
              {[...topItems, ...bottomItems].map((item) => (
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

        <Sidebar.NavList style={{ flex: 1 }}>
          {topItems.map((item) => (
            <NavButton key={item.href} {...item} />
          ))}
        </Sidebar.NavList>

        <Sidebar.Divider />

        <Sidebar.NavList>
          {bottomItems.map((item) => (
            <NavButton key={item.href} {...item} />
          ))}
        </Sidebar.NavList>

        <Sidebar.AccountCard avatarSrc="/avatars/alex.jpg" name="Alex Chen" email="alex@acme.com" />
      </Sidebar.Root>

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>{children}</main>
    </Row>
  );
}
```

## Notes

- A slim rail is just layout: constrain `Sidebar.Root` with CSS or inline `style`, then use `Sidebar.NavButton` for icon-only links.
- Every `Sidebar.NavButton` must have an accessible `label`; add `title` when you also want a browser tooltip.
- `Sidebar.Divider` renders a `<hr>` that visually separates the top navigation from the bottom utility links.
- Use CSS to adapt `Sidebar.AccountCard` at slim widths; the component still requires `name` and `email` for accessible account context.
- On mobile (≤ 768 px) `Sidebar.MobileTrigger` opens a full-width drawer that renders the items with labels.
