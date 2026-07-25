# Command Palette - Basic

A global command palette for common application navigation and actions.

## Components Used

- `CommandPalette` from `@tale-ui/react/command-palette`

## Code

```tsx
import { CommandPalette } from '@tale-ui/react/command-palette';

export function BasicCommandPalette() {
  return (
    <CommandPalette.Root>
      <CommandPalette.Trigger>Open command palette</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup aria-label="Command palette">
          <CommandPalette.Close aria-label="Close command palette" />
          <CommandPalette.Content>
            <CommandPalette.SearchField>
              <CommandPalette.Input placeholder="Search commands..." />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>
            <CommandPalette.ListBox aria-label="Commands">
              <CommandPalette.Section>
                <CommandPalette.SectionHeader>Navigation</CommandPalette.SectionHeader>
                <CommandPalette.Item id="dashboard" textValue="Dashboard" href="/dashboard">
                  <CommandPalette.ItemContent>
                    <CommandPalette.ItemTitle>Dashboard</CommandPalette.ItemTitle>
                    <CommandPalette.ItemDescription>
                      Open the workspace overview.
                    </CommandPalette.ItemDescription>
                  </CommandPalette.ItemContent>
                  <CommandPalette.ItemMeta>
                    <CommandPalette.Shortcut keys={['Mod', 'D']} />
                  </CommandPalette.ItemMeta>
                </CommandPalette.Item>
                <CommandPalette.Item id="settings" textValue="Settings" href="/settings">
                  <CommandPalette.ItemContent>
                    <CommandPalette.ItemTitle>Settings</CommandPalette.ItemTitle>
                    <CommandPalette.ItemDescription>
                      Manage account and workspace settings.
                    </CommandPalette.ItemDescription>
                  </CommandPalette.ItemContent>
                </CommandPalette.Item>
              </CommandPalette.Section>
            </CommandPalette.ListBox>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## Customization Points

- Add `size="sm"` or `size="lg"` to `CommandPalette.Root`.
- Use `CommandPalette.ItemIcon` for leading icons.
- Add `CommandPalette.Footer` for scope or account context.
