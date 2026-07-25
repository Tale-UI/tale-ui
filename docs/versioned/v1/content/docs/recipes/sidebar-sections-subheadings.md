# Sidebar — Sections with Subheadings

A sidebar with named section subheadings above each group of nav items. Use when sections need a visible label — for example "Workspace", "Projects", and "Account".

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Row` from `@tale-ui/react/row`
- `Text` from `@tale-ui/react/text`
- `Home`, `FolderKanban`, `BarChart2`, `Users`, `Settings`, `HelpCircle`, `CreditCard` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';
import {
  Home,
  FolderKanban,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  CreditCard,
} from 'lucide-react';

export function SectionsSubheadingsLayout({ children }: { children: React.ReactNode }) {
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
            <Sidebar.NavList aria-label="Workspace">
              <Sidebar.NavItem href="/" icon={Home} current>
                Dashboard
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/projects" icon={FolderKanban}>
                Projects
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
              <Sidebar.NavItem href="/billing" icon={CreditCard}>
                Billing
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/help" icon={HelpCircle}>
                Help & Support
              </Sidebar.NavItem>
            </Sidebar.NavList>
          </Sidebar.MobileTrigger>
        </Sidebar.Header>

        {/* Workspace section */}
        <Sidebar.NavList aria-labelledby="sidebar-workspace-heading">
          <li role="presentation">
            <Text id="sidebar-workspace-heading" variant="label" size="xs" color="muted">
              Workspace
            </Text>
          </li>
          <Sidebar.NavItem href="/" icon={Home} current>
            Dashboard
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/projects" icon={FolderKanban}>
            Projects
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/analytics" icon={BarChart2}>
            Analytics
          </Sidebar.NavItem>
        </Sidebar.NavList>

        {/* People section */}
        <Sidebar.NavList
          aria-labelledby="sidebar-people-heading"
          style={{ marginTop: 'var(--space-s)' }}
        >
          <li role="presentation">
            <Text id="sidebar-people-heading" variant="label" size="xs" color="muted">
              People
            </Text>
          </li>
          <Sidebar.NavItem href="/team" icon={Users}>
            Team
          </Sidebar.NavItem>
        </Sidebar.NavList>

        {/* Account section */}
        <Sidebar.NavList
          aria-labelledby="sidebar-account-heading"
          style={{ marginTop: 'var(--space-s)' }}
        >
          <li role="presentation">
            <Text id="sidebar-account-heading" variant="label" size="xs" color="muted">
              Account
            </Text>
          </li>
          <Sidebar.NavItem href="/settings" icon={Settings}>
            Settings
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/billing" icon={CreditCard}>
            Billing
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

- Section headings use `Text variant="label" size="xs" color="muted"` inside a `role="presentation"` `<li>` so screen readers don't announce the label as a list item, but the `aria-labelledby` on the parent `<ul>` still associates the heading with the group.
- `Sidebar.Divider` is intentionally omitted here — the subheading itself provides sufficient visual separation. Add `<Sidebar.Divider />` before each `NavList` if you prefer an explicit rule between sections.
- Keep section headings short (1–2 words). If a heading needs more than 3 words, the taxonomy is probably too granular and sections should be merged.
- This pattern combines well with [Sidebar — Dual Tier](sidebar-dual-tier.md) — use the slim rail for top-level sections and this subheading pattern in the secondary panel.
