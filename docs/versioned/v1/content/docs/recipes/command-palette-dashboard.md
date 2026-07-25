# Command Palette - Dashboard

A controlled command palette that filters grouped dashboard actions from application data.

## Components Used

- `CommandPalette` from `@tale-ui/react/command-palette`
- `useCommandPalette` from `@tale-ui/react/command-palette`
- `useCommandPaletteShortcut` from `@tale-ui/react/command-palette`

## Code

```tsx
import * as React from 'react';
import {
  CommandPalette,
  useCommandPalette,
  useCommandPaletteShortcut,
  type CommandPaletteCommand,
} from '@tale-ui/react/command-palette';

const commands: CommandPaletteCommand[] = [
  {
    id: 'revenue',
    title: 'Open revenue dashboard',
    subtitle: 'View ARR, pipeline, and expansion.',
    group: 'Dashboards',
    href: '/dashboards/revenue',
    shortcut: ['Mod', '1'],
  },
  {
    id: 'customers',
    title: 'Open customer health',
    subtitle: 'Review renewals and account risk.',
    group: 'Dashboards',
    href: '/dashboards/customers',
    shortcut: ['Mod', '2'],
  },
  {
    id: 'invite',
    title: 'Invite teammate',
    subtitle: 'Add a user to this workspace.',
    group: 'Actions',
    keywords: ['member', 'user'],
  },
];

export function DashboardCommandPalette() {
  const [open, setOpen] = React.useState(false);
  const palette = useCommandPalette({
    commands,
    close: () => setOpen(false),
    onAction(command) {
      console.log('Run command:', command.id);
    },
  });

  useCommandPaletteShortcut({ open, setOpen, shortcut: 'mod+k' });

  return (
    <CommandPalette.Root open={open} onOpenChange={setOpen} size="lg">
      <CommandPalette.Trigger>Search workspace</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup aria-label="Search workspace">
          <CommandPalette.Close aria-label="Close command palette" />
          <CommandPalette.Content inputValue={palette.query} onInputChange={palette.setQuery}>
            <CommandPalette.SearchField>
              <CommandPalette.Input placeholder="Search dashboards, actions, and people..." />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>
            <CommandPalette.ListBox aria-label="Workspace commands">
              {palette.groupedCommands.map((group) => (
                <CommandPalette.Section key={group.id}>
                  <CommandPalette.SectionHeader>{group.title}</CommandPalette.SectionHeader>
                  {group.commands.map((command) => (
                    <CommandPalette.Item
                      key={command.id}
                      command={command}
                      onAction={() => void palette.runCommand(command)}
                    >
                      <CommandPalette.ItemContent>
                        <CommandPalette.ItemTitle>{command.title}</CommandPalette.ItemTitle>
                        <CommandPalette.ItemDescription>
                          {command.subtitle}
                        </CommandPalette.ItemDescription>
                      </CommandPalette.ItemContent>
                      {command.shortcut ? (
                        <CommandPalette.ItemMeta>
                          <CommandPalette.Shortcut keys={command.shortcut} />
                        </CommandPalette.ItemMeta>
                      ) : null}
                    </CommandPalette.Item>
                  ))}
                </CommandPalette.Section>
              ))}
            </CommandPalette.ListBox>
            <CommandPalette.Footer>{palette.filteredCommands.length} results</CommandPalette.Footer>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## Customization Points

- Replace `commands` with router, feature flag, or permissions-aware data.
- Use `groupBy` and `getGroupTitle` when groups come from IDs.
- Use `filter` for fuzzy search or server-provided scoring.
