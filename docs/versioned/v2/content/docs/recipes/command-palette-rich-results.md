# Command Palette - Rich Results

A command palette that mixes people, documents, and actions while keeping each result as a selectable item.

## Components Used

- `Avatar` from `@tale-ui/react/avatar`
- `Badge` from `@tale-ui/react/badge`
- `Button` from `@tale-ui/react/button`
- `CommandPalette` from `@tale-ui/react/command-palette`
- `Icon` from `@tale-ui/react/icon`
- `Row` from `@tale-ui/react/row`

## Code

```tsx
import { Avatar } from '@tale-ui/react/avatar';
import { Badge } from '@tale-ui/react/badge';
import { Button } from '@tale-ui/react/button';
import { CommandPalette } from '@tale-ui/react/command-palette';
import { Icon } from '@tale-ui/react/icon';
import { Row } from '@tale-ui/react/row';
import {
  BellIcon,
  FileTextIcon,
  GitBranchIcon,
  LifeBuoyIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  UserPlusIcon,
} from 'lucide-react';

const people = [
  {
    id: 'maya',
    name: 'Maya Chen',
    role: 'Design systems lead',
    initials: 'MC',
    status: 'Online',
  },
  {
    id: 'jon',
    name: 'Jon Bell',
    role: 'Frontend platform',
    initials: 'JB',
    status: 'Away',
  },
  {
    id: 'liam',
    name: 'Liam Shah',
    role: 'Product operations',
    initials: 'LS',
    status: 'New',
  },
];

const documents = [
  {
    id: 'roadmap',
    title: 'Command palette roadmap',
    description: 'Open the roadmap for quick action discovery.',
    icon: FileTextIcon,
    meta: 'Updated 2h ago',
  },
  {
    id: 'release',
    title: 'Release checklist',
    description: 'Review design QA, docs, and package checks.',
    icon: GitBranchIcon,
    meta: 'Pinned',
  },
];

const actions = [
  {
    id: 'invite',
    title: 'Invite teammate',
    description: 'Send a workspace invitation.',
    icon: UserPlusIcon,
    shortcut: ['Mod', 'I'],
  },
  {
    id: 'notifications',
    title: 'Notification settings',
    description: 'Tune email, product, and changelog notifications.',
    icon: BellIcon,
    shortcut: ['Mod', ','],
  },
  {
    id: 'support',
    title: 'Open support',
    description: 'Start a support conversation with context attached.',
    icon: LifeBuoyIcon,
    shortcut: ['?'],
  },
];

const quickLinks = [
  {
    id: 'recent',
    label: 'Recent',
    href: '/search/recent',
    icon: SparklesIcon,
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    href: '/search/onboarding',
    icon: SearchIcon,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
];

function PersonResult({ person }: { person: (typeof people)[number] }) {
  return (
    <CommandPalette.Item id={`person-${person.id}`} textValue={`${person.name} ${person.role}`}>
      <CommandPalette.ItemIcon>
        <Avatar.Root size="sm">
          <Avatar.Fallback>{person.initials}</Avatar.Fallback>
        </Avatar.Root>
      </CommandPalette.ItemIcon>
      <CommandPalette.ItemContent>
        <CommandPalette.ItemTitle>{person.name}</CommandPalette.ItemTitle>
        <CommandPalette.ItemDescription>{person.role}</CommandPalette.ItemDescription>
      </CommandPalette.ItemContent>
      <CommandPalette.ItemMeta>
        <Badge variant={person.status === 'Online' ? 'success' : 'neutral'} size="sm">
          {person.status}
        </Badge>
      </CommandPalette.ItemMeta>
    </CommandPalette.Item>
  );
}

function DocumentResult({ document }: { document: (typeof documents)[number] }) {
  return (
    <CommandPalette.Item
      id={`document-${document.id}`}
      textValue={`${document.title} ${document.description}`}
    >
      <CommandPalette.ItemIcon>
        <Icon icon={document.icon} size="sm" />
      </CommandPalette.ItemIcon>
      <CommandPalette.ItemContent>
        <CommandPalette.ItemTitle>{document.title}</CommandPalette.ItemTitle>
        <CommandPalette.ItemDescription>{document.description}</CommandPalette.ItemDescription>
      </CommandPalette.ItemContent>
      <CommandPalette.ItemMeta>{document.meta}</CommandPalette.ItemMeta>
    </CommandPalette.Item>
  );
}

function ActionResult({ action }: { action: (typeof actions)[number] }) {
  return (
    <CommandPalette.Item
      id={`action-${action.id}`}
      textValue={`${action.title} ${action.description}`}
    >
      <CommandPalette.ItemIcon>
        <Icon icon={action.icon} size="sm" />
      </CommandPalette.ItemIcon>
      <CommandPalette.ItemContent>
        <CommandPalette.ItemTitle>{action.title}</CommandPalette.ItemTitle>
        <CommandPalette.ItemDescription>{action.description}</CommandPalette.ItemDescription>
      </CommandPalette.ItemContent>
      <CommandPalette.ItemMeta>
        <CommandPalette.Shortcut keys={action.shortcut} />
      </CommandPalette.ItemMeta>
    </CommandPalette.Item>
  );
}

export function RichResultsCommandPalette() {
  const navigate = (href: string) => {
    console.log(`Navigate to ${href}`);
  };

  return (
    <CommandPalette.Root defaultOpen size="lg">
      <CommandPalette.Trigger>Search workspace</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup aria-label="Search workspace">
          <CommandPalette.Close aria-label="Close search" />
          <CommandPalette.Content>
            <CommandPalette.SearchField style={{ borderBlockEnd: '0' }}>
              <CommandPalette.Input placeholder="Search teammates, docs, automations, or actions..." />
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

            <CommandPalette.ListBox aria-label="Rich workspace results">
              <CommandPalette.Section>
                <CommandPalette.SectionHeader>People</CommandPalette.SectionHeader>
                {people.map((person) => (
                  <PersonResult key={person.id} person={person} />
                ))}
              </CommandPalette.Section>

              <CommandPalette.Section>
                <CommandPalette.SectionHeader>Documents</CommandPalette.SectionHeader>
                {documents.map((document) => (
                  <DocumentResult key={document.id} document={document} />
                ))}
              </CommandPalette.Section>

              <CommandPalette.Section>
                <CommandPalette.SectionHeader>Actions</CommandPalette.SectionHeader>
                {actions.map((action) => (
                  <ActionResult key={action.id} action={action} />
                ))}
              </CommandPalette.Section>
            </CommandPalette.ListBox>

            <CommandPalette.Footer>
              Use rich rows for mixed entity search surfaces.
            </CommandPalette.Footer>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## Customization Points

- Use leading `ItemIcon` content for avatars, entity icons, integration marks, or thumbnails.
- Use `ItemMeta` for counts, badges, timestamps, shortcuts, or ownership context.
- Use small neutral `Button` controls for quick navigation links; wire their `onPress` handlers to your router.
- Keep each entity row selectable as a `CommandPalette.Item`; avoid nested buttons inside results.
