# Sidebar — Section Dividers

A sidebar with multiple groups of navigation items separated by visual `Sidebar.Divider` lines. Suitable for apps with distinct navigation domains (e.g., main nav, tools, account).

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Row` from `@tale-ui/react/row`
- `Text` from `@tale-ui/react/text`
- `Home`, `FileText`, `Users`, `BarChart2`, `Wrench`, `Settings`, `HelpCircle` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';
import { Home, FileText, Users, BarChart2, Wrench, Settings, HelpCircle } from 'lucide-react';

export function SectionDividerLayout({ children }: { children: React.ReactNode }) {
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
            <Sidebar.NavList aria-label="Main">
              <Sidebar.NavItem href="/" icon={Home} current>
                Home
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/documents" icon={FileText}>
                Documents
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/team" icon={Users}>
                Team
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/analytics" icon={BarChart2}>
                Analytics
              </Sidebar.NavItem>
            </Sidebar.NavList>
            <Sidebar.Divider />
            <Sidebar.NavList aria-label="Account">
              <Sidebar.NavItem href="/settings" icon={Settings}>
                Settings
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/help" icon={HelpCircle}>
                Help & Support
              </Sidebar.NavItem>
            </Sidebar.NavList>
          </Sidebar.MobileTrigger>
        </Sidebar.Header>

        {/* Main navigation */}
        <Sidebar.NavList aria-label="Main">
          <Sidebar.NavItem href="/" icon={Home} current>
            Home
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/documents" icon={FileText}>
            Documents
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/team" icon={Users}>
            Team
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/analytics" icon={BarChart2}>
            Analytics
          </Sidebar.NavItem>
        </Sidebar.NavList>

        <Sidebar.Divider />

        {/* Tools */}
        <Sidebar.NavList aria-label="Tools">
          <Sidebar.NavItem href="/tools" icon={Wrench}>
            Tools
          </Sidebar.NavItem>
        </Sidebar.NavList>

        <Sidebar.Divider />

        {/* Account & support */}
        <Sidebar.NavList aria-label="Account">
          <Sidebar.NavItem href="/settings" icon={Settings}>
            Settings
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/help" icon={HelpCircle}>
            Help & Support
          </Sidebar.NavItem>
        </Sidebar.NavList>

        <Sidebar.AccountCard name="Alex Chen" email="alex@acme.com" avatarSrc="/avatars/alex.jpg" />
      </Sidebar.Root>

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>{children}</main>
    </Row>
  );
}
```

## Notes

- `Sidebar.Divider` renders a styled `<hr>` with `role="separator"` and automatic margin to visually separate groups.
- Adding `aria-label` to each `Sidebar.NavList` creates distinct landmark regions, improving screen reader navigation. The browser renders each labelled `<ul>` as an accessible list that can be jumped to directly.
- Place the account card (`Sidebar.AccountCard`) at the very bottom outside all `NavList` groups so it sticks to the bottom of the sidebar.
- This pattern works best with 2–4 groups. For more complex groupings with subheadings, use the [Sidebar — Sections with Subheadings](sidebar-sections-subheadings.md) recipe instead.
