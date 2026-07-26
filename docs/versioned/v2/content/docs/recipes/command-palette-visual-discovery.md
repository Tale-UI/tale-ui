# Command Palette - Visual Discovery

A command palette layout with vertical tabs for switching between trending apps, categories, screens, UI elements, and flows.

## Components Used

- `Badge` from `@tale-ui/react/badge`
- `Button` from `@tale-ui/react/button`
- `Card` from `@tale-ui/react/card`
- `CommandPalette` from `@tale-ui/react/command-palette`
- `Column` from `@tale-ui/react/column`
- `FeaturedIcon` from `@tale-ui/react/featured-icon`
- `Icon` from `@tale-ui/react/icon`
- `Row` from `@tale-ui/react/row`
- `Tabs` from `@tale-ui/react/tabs`
- `Text` from `@tale-ui/react/text`

## Code

```tsx
import * as React from 'react';
import { Badge } from '@tale-ui/react/badge';
import { Button } from '@tale-ui/react/button';
import { Card } from '@tale-ui/react/card';
import { CommandPalette } from '@tale-ui/react/command-palette';
import { Column } from '@tale-ui/react/column';
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { Icon } from '@tale-ui/react/icon';
import { Row } from '@tale-ui/react/row';
import { Tabs } from '@tale-ui/react/tabs';
import { Text } from '@tale-ui/react/text';
import {
  BoxesIcon,
  CompassIcon,
  CopyIcon,
  RouteIcon,
  SearchIcon,
  TrendingUpIcon,
} from 'lucide-react';

const sections = [
  { id: 'trending', label: 'Trending', icon: TrendingUpIcon },
  { id: 'categories', label: 'Categories', icon: BoxesIcon },
  { id: 'screens', label: 'Screens', icon: CopyIcon },
  { id: 'elements', label: 'UI Elements', icon: CompassIcon },
  { id: 'flows', label: 'Flows', icon: RouteIcon },
];

const apps = [
  { id: 'tempo', label: 'Tempo', icon: TrendingUpIcon, variant: 'brand' },
  { id: 'orbit', label: 'Orbit', icon: RouteIcon, variant: 'neutral' },
  { id: 'shop', label: 'Shop', icon: BoxesIcon, variant: 'success' },
  { id: 'wise', label: 'Wise', icon: CompassIcon, variant: 'brand' },
  { id: 'atlas', label: 'Atlas', icon: CopyIcon, variant: 'neutral' },
  { id: 'rooms', label: 'Rooms', icon: SearchIcon, variant: 'error' },
] as const;

const categories = [
  { id: 'ai', label: 'AI', count: 104 },
  { id: 'business', label: 'Business', count: 138 },
  { id: 'collaboration', label: 'Collaboration', count: 40 },
  { id: 'communication', label: 'Communication', count: 11 },
  { id: 'crm', label: 'CRM', count: 21 },
  { id: 'crypto', label: 'Crypto and Web3', count: 14 },
  { id: 'developer-tools', label: 'Developer Tools', count: 43 },
  { id: 'education', label: 'Education', count: 16 },
  { id: 'entertainment', label: 'Entertainment', count: 14 },
  { id: 'finance', label: 'Finance', count: 30 },
  { id: 'food', label: 'Food and Drink', count: 10 },
  { id: 'graphics', label: 'Graphics and Design', count: 17 },
  { id: 'health', label: 'Health and Fitness', count: 7 },
  { id: 'jobs', label: 'Jobs and Recruitment', count: 22 },
  { id: 'lifestyle', label: 'Lifestyle', count: 20 },
];

const screens = [
  { id: 'signup', label: 'Signup' },
  { id: 'login', label: 'Login' },
  { id: 'home', label: 'Home' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'error', label: 'Error' },
  { id: 'search', label: 'Search' },
  { id: 'filters', label: 'Filter and Sort' },
];

const elements = [
  { id: 'table', label: 'Table', count: 42 },
  { id: 'card', label: 'Card', count: 36 },
  { id: 'dialog', label: 'Dialog', count: 27 },
  { id: 'stepper', label: 'Stepper', count: 12 },
  { id: 'button', label: 'Button', count: 58 },
  { id: 'side-navigation', label: 'Side Navigation', count: 19 },
  { id: 'banner', label: 'Banner', count: 15 },
];

const flows = [
  {
    id: 'onboarding',
    label: 'Onboarding',
    description: 'Signup, verification, and first-run setup.',
  },
  {
    id: 'billing',
    label: 'Billing',
    description: 'Plans, invoices, checkout, and payment recovery.',
  },
  {
    id: 'upgrade',
    label: 'Upgrade',
    description: 'Conversion paths from free to paid experiences.',
  },
  {
    id: 'invite-team',
    label: 'Invite team',
    description: 'Member invites, roles, and approval states.',
  },
  {
    id: 'export-report',
    label: 'Export report',
    description: 'Filtering, queueing, and download confirmation.',
  },
];

const quickLinks = [
  {
    id: 'command-palette',
    label: 'Command palette',
    href: '/patterns/command-palette',
    icon: CopyIcon,
  },
  {
    id: 'liquid-glass',
    label: 'Liquid glass',
    href: '/search/liquid-glass',
    icon: SearchIcon,
  },
  {
    id: 'link-groups',
    label: 'Link groups',
    href: '/search/link-groups',
    icon: SearchIcon,
  },
];

function PromoCard() {
  return (
    <Card.Root variant="filled" padding="sm">
      <Card.Body>
        <Column gap="xs" align="center">
          <Badge variant="neutral" size="sm">
            NEW
          </Badge>
          <Text variant="title" size="s">
            AI Search is now Deep Search
          </Text>
          <Text color="muted" size="s">
            Deep Search is selected automatically for longer, more complex queries.
          </Text>
        </Column>
      </Card.Body>
    </Card.Root>
  );
}

function AppLogo({ app }: { app: (typeof apps)[number] }) {
  return (
    <CommandPalette.Item
      id={`app-${app.id}`}
      textValue={app.label}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        maxWidth: '4rem',
        minHeight: '3.5rem',
        justifySelf: 'center',
        padding: 0,
      }}
    >
      <FeaturedIcon shape="square" variant={app.variant}>
        <Icon icon={app.icon} size="sm" />
      </FeaturedIcon>
    </CommandPalette.Item>
  );
}

function CategoryRow({ category }: { category: (typeof categories)[number] }) {
  return (
    <CommandPalette.Item
      id={`category-${category.id}`}
      textValue={category.label}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        minHeight: '2.375rem',
      }}
    >
      <CommandPalette.ItemTitle>{category.label}</CommandPalette.ItemTitle>
      <CommandPalette.ItemMeta>{category.count}</CommandPalette.ItemMeta>
    </CommandPalette.Item>
  );
}

function ScreenCard({ screen }: { screen: (typeof screens)[number] }) {
  return (
    <CommandPalette.Item
      id={`screen-${screen.id}`}
      textValue={screen.label}
      style={{
        display: 'grid',
        alignContent: 'start',
        minWidth: 0,
        minHeight: '6.25rem',
        padding: 'var(--space-2xs)',
      }}
    >
      <Column gap="xs">
        <CommandPalette.ItemTitle
          style={{ overflow: 'visible', textOverflow: 'clip', whiteSpace: 'normal' }}
        >
          {screen.label}
        </CommandPalette.ItemTitle>
        <Card.Root variant="filled" padding="sm">
          <Card.Body>
            <Column gap="4xs">
              <Badge variant="neutral" size="sm">
                Screen
              </Badge>
              <Text color="muted" size="s">
                {screen.label} pattern
              </Text>
            </Column>
          </Card.Body>
        </Card.Root>
      </Column>
    </CommandPalette.Item>
  );
}

function ElementPills() {
  return (
    <CommandPalette.ListBox
      aria-label="UI elements"
      style={{
        display: 'grid',
        width: '100%',
        boxSizing: 'border-box',
        gridTemplateColumns: 'repeat(auto-fit, minmax(6.25rem, 1fr))',
        gap: '0.5rem',
      }}
    >
      {elements.map((element) => (
        <CommandPalette.Item
          key={element.id}
          id={`element-${element.id}`}
          textValue={element.label}
          style={{ minHeight: '2.25rem', paddingInline: 'var(--space-s)' }}
        >
          <CommandPalette.ItemTitle
            style={{ overflow: 'visible', textOverflow: 'clip', whiteSpace: 'normal' }}
          >
            {element.label}
          </CommandPalette.ItemTitle>
          <CommandPalette.ItemMeta>{element.count}</CommandPalette.ItemMeta>
        </CommandPalette.Item>
      ))}
    </CommandPalette.ListBox>
  );
}

function FlowRows() {
  return (
    <CommandPalette.ListBox
      aria-label="Flows"
      style={{ display: 'grid', width: '100%', boxSizing: 'border-box', gap: '0.375rem' }}
    >
      {flows.map((flow) => (
        <CommandPalette.Item key={flow.id} id={`flow-${flow.id}`} textValue={flow.label}>
          <CommandPalette.ItemContent>
            <CommandPalette.ItemTitle>{flow.label}</CommandPalette.ItemTitle>
            <CommandPalette.ItemDescription>{flow.description}</CommandPalette.ItemDescription>
          </CommandPalette.ItemContent>
        </CommandPalette.Item>
      ))}
    </CommandPalette.ListBox>
  );
}

export function VisualDiscoveryCommandPalette() {
  const [section, setSection] = React.useState('trending');
  const activeSection = sections.find((item) => item.id === section);
  const navigate = (href: string) => {
    console.log(`Navigate to ${href}`);
  };

  return (
    <CommandPalette.Root defaultOpen closeOnSelect={false} size="lg">
      <CommandPalette.Trigger>Open discovery palette</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup aria-label="Visual discovery palette">
          <CommandPalette.Close aria-label="Close discovery palette" />
          <CommandPalette.Content>
            <CommandPalette.SearchField style={{ borderBlockEnd: '0' }}>
              <CommandPalette.Input placeholder="Web apps, screens, UI elements, flows, or keywords..." />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>

            <Row
              role="navigation"
              aria-label="Suggested navigation"
              gap="3xs"
              wrap
              style={{ padding: '0 var(--space-s) var(--space-xs)' }}
            >
              {quickLinks.map((link) => (
                <Button
                  key={link.id}
                  variant="neutral"
                  size="sm"
                  onPress={() => navigate(link.href)}
                >
                  <Icon icon={link.icon} size="sm" />
                  {link.label}
                </Button>
              ))}
            </Row>

            <Tabs.Root
              orientation="vertical"
              selectedKey={section}
              onSelectionChange={(key) => setSection(String(key))}
              style={{ minHeight: 0, width: '100%' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(8.75rem, 11.25rem) minmax(0, 1fr)',
                  gap: 'var(--space-s)',
                  minHeight: 0,
                  width: '100%',
                }}
              >
                <aside
                  style={{
                    display: 'grid',
                    alignContent: 'start',
                    gap: 'var(--space-s)',
                    minWidth: 0,
                  }}
                >
                  <Tabs.List variant="pills" size="sm" aria-label="Discovery sections">
                    {sections.map((item) => (
                      <Tabs.Tab
                        key={item.id}
                        id={item.id}
                        icon={<Icon icon={item.icon} size="sm" />}
                      >
                        {item.label}
                      </Tabs.Tab>
                    ))}
                    <Tabs.Indicator />
                  </Tabs.List>
                  <PromoCard />
                </aside>

                <div style={{ minWidth: 0, minHeight: 0, width: '100%' }}>
                  <Tabs.Panel id="trending" style={{ width: '100%', padding: 0 }}>
                    <div style={{ display: 'grid', width: '100%', gap: 'var(--space-m)' }}>
                      <CommandPalette.ListBox
                        aria-label="Trending apps"
                        style={{
                          display: 'grid',
                          width: '100%',
                          boxSizing: 'border-box',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(3.5rem, 1fr))',
                          gap: 'var(--space-xs)',
                        }}
                      >
                        {apps.map((app) => (
                          <AppLogo key={app.id} app={app} />
                        ))}
                      </CommandPalette.ListBox>

                      <section style={{ width: '100%' }}>
                        <CommandPalette.SectionHeader>Popular screens</CommandPalette.SectionHeader>
                        <CommandPalette.ListBox
                          aria-label="Popular screens"
                          style={{
                            display: 'grid',
                            width: '100%',
                            boxSizing: 'border-box',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(6.25rem, 1fr))',
                            gap: 'var(--space-xs)',
                          }}
                        >
                          {screens.slice(0, 4).map((screen) => (
                            <ScreenCard key={screen.id} screen={screen} />
                          ))}
                        </CommandPalette.ListBox>
                      </section>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel id="categories" style={{ width: '100%', padding: 0 }}>
                    <CommandPalette.SectionHeader>Categories</CommandPalette.SectionHeader>
                    <CommandPalette.ListBox
                      aria-label="Categories"
                      style={{
                        display: 'grid',
                        width: '100%',
                        boxSizing: 'border-box',
                        gap: '0.125rem',
                        maxHeight: '30rem',
                        overflowY: 'auto',
                      }}
                    >
                      {categories.map((category) => (
                        <CategoryRow key={category.id} category={category} />
                      ))}
                    </CommandPalette.ListBox>
                  </Tabs.Panel>

                  <Tabs.Panel id="screens" style={{ width: '100%', padding: 0 }}>
                    <CommandPalette.SectionHeader>Screens</CommandPalette.SectionHeader>
                    <CommandPalette.ListBox
                      aria-label="Screen templates"
                      style={{
                        display: 'grid',
                        width: '100%',
                        boxSizing: 'border-box',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(6.25rem, 1fr))',
                        gap: 'var(--space-xs)',
                      }}
                    >
                      {screens.map((screen) => (
                        <ScreenCard key={screen.id} screen={screen} />
                      ))}
                    </CommandPalette.ListBox>
                  </Tabs.Panel>

                  <Tabs.Panel id="elements" style={{ width: '100%', padding: 0 }}>
                    <CommandPalette.SectionHeader>UI Elements</CommandPalette.SectionHeader>
                    <ElementPills />
                  </Tabs.Panel>

                  <Tabs.Panel id="flows" style={{ width: '100%', padding: 0 }}>
                    <CommandPalette.SectionHeader>Flows</CommandPalette.SectionHeader>
                    <FlowRows />
                  </Tabs.Panel>
                </div>
              </div>
            </Tabs.Root>

            <CommandPalette.Footer>
              Showing {activeSection?.label ?? 'Discovery'} content. Select a tab to change the
              right-side result area.
            </CommandPalette.Footer>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## Customization Points

- Use vertical `Tabs.List variant="pills"` for palettes where the left rail changes the content type rather than filtering one list.
- Use small neutral `Button` controls inside a `Row gap="3xs"` for quick navigation links near the search field, and remove the search field container's bottom border.
- Remove inherited tab panel padding and set panel list boxes to `width: '100%'` with `auto-fit` grid columns so right-side result lists fit the available column without horizontal clipping.
- Keep every result card, row, or pill inside `CommandPalette.Item` so keyboard selection still reaches it.
- Put counts, badges, timestamps, or shortcuts in `CommandPalette.ItemMeta`.
- Use `closeOnSelect={false}` when the palette behaves like a browsing surface instead of a one-shot command runner.
