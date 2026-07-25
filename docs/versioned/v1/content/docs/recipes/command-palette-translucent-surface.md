# Command Palette - Translucent Surface

A neutral command palette surface with transparency and background blur so the workspace behind it remains visible.

## Components Used

- `Badge` from `@tale-ui/react/badge`
- `Card` from `@tale-ui/react/card`
- `Column` from `@tale-ui/react/column`
- `CommandPalette` from `@tale-ui/react/command-palette`
- `Icon` from `@tale-ui/react/icon`
- `Row` from `@tale-ui/react/row`
- `Text` from `@tale-ui/react/text`

## Code

```tsx
import { Badge } from '@tale-ui/react/badge';
import { Card } from '@tale-ui/react/card';
import { Column } from '@tale-ui/react/column';
import { CommandPalette } from '@tale-ui/react/command-palette';
import { Icon } from '@tale-ui/react/icon';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';
import {
  ActivityIcon,
  BarChart3Icon,
  CommandIcon,
  FileTextIcon,
  SettingsIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';

const metrics = [
  { id: 'activation', label: 'Activation', value: '74%', trend: '+8.2%' },
  { id: 'pipeline', label: 'Pipeline', value: '$428k', trend: '+12.4%' },
  { id: 'handoffs', label: 'Handoffs', value: '31', trend: '+4' },
];

const commands = [
  {
    id: 'metrics',
    title: 'Inspect launch metrics',
    description: 'Open activation, pipeline, and handoff dashboards.',
    icon: BarChart3Icon,
    badge: 'Dashboard',
    shortcut: ['Mod', '1'],
  },
  {
    id: 'brief',
    title: 'Open campaign brief',
    description: 'Review positioning, channels, and launch risks.',
    icon: FileTextIcon,
    badge: 'Brief',
    shortcut: ['Mod', '2'],
  },
  {
    id: 'reviewers',
    title: 'Invite launch reviewers',
    description: 'Add product, design, and customer success stakeholders.',
    icon: UsersIcon,
    badge: 'People',
    shortcut: ['Mod', '3'],
  },
  {
    id: 'sentiment',
    title: 'Run sentiment scan',
    description: 'Summarize customer feedback from the last seven days.',
    icon: SparklesIcon,
    badge: 'AI',
    shortcut: ['Mod', '4'],
  },
  {
    id: 'settings',
    title: 'Review release settings',
    description: 'Check rollout percentage, regions, and notification rules.',
    icon: SettingsIcon,
    badge: 'Admin',
    shortcut: ['Mod', ','],
  },
];

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  return (
    <Card.Root variant="filled" padding="md">
      <Card.Body>
        <Column gap="3xs">
          <Text color="muted" size="s">
            {metric.label}
          </Text>
          <Row align="center" justify="between">
            <Text variant="heading" size="m">
              {metric.value}
            </Text>
            <Badge variant="success" size="sm">
              {metric.trend}
            </Badge>
          </Row>
        </Column>
      </Card.Body>
    </Card.Root>
  );
}

function LaunchCommand({ command }: { command: (typeof commands)[number] }) {
  return (
    <CommandPalette.Item id={command.id} textValue={`${command.title} ${command.description}`}>
      <CommandPalette.ItemIcon>
        <Icon icon={command.icon} size="sm" />
      </CommandPalette.ItemIcon>
      <CommandPalette.ItemContent>
        <CommandPalette.ItemTitle>{command.title}</CommandPalette.ItemTitle>
        <CommandPalette.ItemDescription>{command.description}</CommandPalette.ItemDescription>
      </CommandPalette.ItemContent>
      <CommandPalette.ItemMeta>
        <Badge variant="neutral" size="sm">
          {command.badge}
        </Badge>
        <CommandPalette.Shortcut keys={command.shortcut} />
      </CommandPalette.ItemMeta>
    </CommandPalette.Item>
  );
}

export function TranslucentSurfaceCommandPalette() {
  return (
    <CommandPalette.Root defaultOpen size="lg">
      <div style={{ minHeight: '35rem', padding: 'var(--space-l)' }}>
        <Column gap="m">
          <Row align="center" justify="between" wrap>
            <Column gap="3xs">
              <Text variant="heading" size="m" as="h1">
                Launch workspace
              </Text>
              <Text color="muted" size="s">
                Campaign status, audience health, and release controls.
              </Text>
            </Column>
            <CommandPalette.Trigger className="tale-button tale-button--neutral tale-button--md">
              <Icon icon={CommandIcon} size="sm" />
              Open palette
            </CommandPalette.Trigger>
          </Row>

          <div
            style={{
              display: 'grid',
              gap: 'var(--space-s)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
            }}
          >
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gap: 'var(--space-s)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
            }}
          >
            <Card.Root variant="outlined" padding="lg">
              <Card.Header>
                <Row align="center" justify="between">
                  <Text variant="title" size="m">
                    Release timeline
                  </Text>
                  <Badge variant="brand" size="sm">
                    Live
                  </Badge>
                </Row>
              </Card.Header>
              <Card.Body>
                <Column gap="s">
                  <Row align="center" gap="xs">
                    <Icon icon={ActivityIcon} size="sm" />
                    <Text>Beta cohort reached launch readiness.</Text>
                  </Row>
                  <Row align="center" gap="xs">
                    <Icon icon={TrendingUpIcon} size="sm" />
                    <Text>Conversion lift is above the target threshold.</Text>
                  </Row>
                  <Row align="center" gap="xs">
                    <Icon icon={UsersIcon} size="sm" />
                    <Text>Three reviewers are waiting on final copy.</Text>
                  </Row>
                </Column>
              </Card.Body>
            </Card.Root>

            <Card.Root variant="filled" padding="lg">
              <Card.Body>
                <Column gap="xs">
                  <Badge variant="neutral" size="sm">
                    Next
                  </Badge>
                  <Text variant="title" size="s">
                    Approve rollout schedule
                  </Text>
                  <Text color="muted" size="s">
                    Confirm launch timing before customer notifications are sent.
                  </Text>
                </Column>
              </Card.Body>
            </Card.Root>
          </div>
        </Column>
      </div>

      <CommandPalette.Backdrop className="tale-command-palette__backdrop--transparent">
        <CommandPalette.Popup
          aria-label="Search launch workspace"
          modalProps={{ className: 'tale-command-palette__popup--translucent' }}
        >
          <CommandPalette.Content>
            <CommandPalette.SearchField>
              <CommandPalette.Input placeholder="Search launch actions, reports, or reviewers..." />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>
            <CommandPalette.ListBox aria-label="Launch workspace commands">
              <CommandPalette.Section>
                <CommandPalette.SectionHeader>Launch</CommandPalette.SectionHeader>
                {commands.map((command) => (
                  <LaunchCommand key={command.id} command={command} />
                ))}
              </CommandPalette.Section>
            </CommandPalette.ListBox>
            <CommandPalette.Footer>
              <span>Launch workspace</span>
              <Badge variant="neutral" size="sm">
                Synced
              </Badge>
            </CommandPalette.Footer>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## Customization Points

- Use `CommandPalette.Backdrop className="tale-command-palette__backdrop--transparent"` when the page behind the palette should remain visible.
- Use `CommandPalette.Popup modalProps={{ className: 'tale-command-palette__popup--translucent' }}` to apply the neutral translucent surface and popup-local background blur.
- Keep result rows, chips, shortcuts, and selected states on CommandPalette parts so their translucent states stay token-driven across light and dark mode.
