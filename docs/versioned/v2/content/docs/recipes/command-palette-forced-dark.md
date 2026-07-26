# Command Palette - Forced Dark

A command palette that keeps the dark color scheme inside the palette even when the surrounding page is light.

## Components Used

- `Badge` from `@tale-ui/react/badge`
- `CommandPalette` from `@tale-ui/react/command-palette`
- `Icon` from `@tale-ui/react/icon`

## Code

```tsx
import { Badge } from '@tale-ui/react/badge';
import { CommandPalette } from '@tale-ui/react/command-palette';
import { Icon } from '@tale-ui/react/icon';
import {
  BarChart3Icon,
  BellIcon,
  FileTextIcon,
  MoonIcon,
  SettingsIcon,
  UserPlusIcon,
} from 'lucide-react';

const commands = [
  {
    id: 'overview',
    title: 'Open workspace overview',
    description: 'Jump to the dashboard for this workspace.',
    icon: BarChart3Icon,
    meta: 'Workspace',
    shortcut: ['Mod', 'O'],
  },
  {
    id: 'invite',
    title: 'Invite teammate',
    description: 'Send an invitation to a collaborator.',
    icon: UserPlusIcon,
    meta: 'People',
    shortcut: ['Mod', 'I'],
  },
  {
    id: 'reports',
    title: 'Review reports',
    description: 'Open the latest saved performance report.',
    icon: FileTextIcon,
    meta: 'Docs',
    shortcut: ['Mod', 'R'],
  },
  {
    id: 'notifications',
    title: 'Notification settings',
    description: 'Adjust email, product, and release alerts.',
    icon: BellIcon,
    meta: 'Settings',
    shortcut: ['Mod', ','],
  },
  {
    id: 'preferences',
    title: 'Open preferences',
    description: 'Manage workspace defaults and appearance.',
    icon: SettingsIcon,
    meta: 'Account',
    shortcut: ['Mod', 'P'],
  },
];

function DarkCommandItem({ command }: { command: (typeof commands)[number] }) {
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
          {command.meta}
        </Badge>
        <CommandPalette.Shortcut keys={command.shortcut} />
      </CommandPalette.ItemMeta>
    </CommandPalette.Item>
  );
}

export function ForcedDarkCommandPalette() {
  return (
    <div className="dark" style={{ minHeight: '35rem', padding: 'var(--space-m)' }}>
      <CommandPalette.Root defaultOpen size="lg">
        <CommandPalette.Trigger className="tale-button tale-button--neutral tale-button--md">
          <Icon icon={MoonIcon} size="sm" />
          Open dark command palette
        </CommandPalette.Trigger>
        <CommandPalette.Backdrop className="dark">
          <CommandPalette.Popup aria-label="Dark command palette">
            <CommandPalette.Close aria-label="Close command palette" />
            <CommandPalette.Content>
              <CommandPalette.SearchField>
                <CommandPalette.Input placeholder="Search actions, reports, or teammates..." />
                <CommandPalette.ClearButton aria-label="Clear search" />
              </CommandPalette.SearchField>
              <CommandPalette.ListBox aria-label="Dark mode commands">
                <CommandPalette.Section>
                  <CommandPalette.SectionHeader>Workspace</CommandPalette.SectionHeader>
                  {commands.map((command) => (
                    <DarkCommandItem key={command.id} command={command} />
                  ))}
                </CommandPalette.Section>
              </CommandPalette.ListBox>
              <CommandPalette.Footer>
                <span>Scoped dark color mode</span>
                <Badge variant="neutral" size="sm">
                  .dark
                </Badge>
              </CommandPalette.Footer>
            </CommandPalette.Content>
          </CommandPalette.Popup>
        </CommandPalette.Backdrop>
      </CommandPalette.Root>
    </div>
  );
}
```

## Customization Points

- Use `className="dark"` on the nearest stable wrapper when the trigger and inline content should both stay dark.
- Add `className="dark"` to `CommandPalette.Backdrop` so the modal overlay and popup keep dark tokens even if they are rendered outside the local page surface.
- Use page-level `data-color-mode="dark"` on `<html>` for app-wide dark mode; use scoped `.dark` only when a palette needs its own forced scheme.
