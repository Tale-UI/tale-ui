# Command Palette - Async Results

A command palette that combines local commands with remote search results.

## Components Used

- `CommandPalette` from `@tale-ui/react/command-palette`
- `useCommandPalette` from `@tale-ui/react/command-palette`

## Code

```tsx
import * as React from 'react';
import {
  CommandPalette,
  useCommandPalette,
  type CommandPaletteCommand,
} from '@tale-ui/react/command-palette';

const baseCommands: CommandPaletteCommand[] = [
  { id: 'new-project', title: 'New project', group: 'Actions' },
  { id: 'billing', title: 'Open billing', group: 'Settings', href: '/settings/billing' },
];

export function AsyncCommandPalette() {
  const [query, setQuery] = React.useState('');
  const [remoteCommands, setRemoteCommands] = React.useState<CommandPaletteCommand[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query.trim()) {
      setRemoteCommands([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((results: Array<{ id: string; title: string; url: string }>) => {
        if (!active) return;
        setRemoteCommands(
          results.map((result) => ({
            id: `remote-${result.id}`,
            title: result.title,
            group: 'Results',
            href: result.url,
          })),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  const palette = useCommandPalette({
    commands: [...baseCommands, ...remoteCommands],
    query,
    onQueryChange: setQuery,
  });

  return (
    <CommandPalette.Root>
      <CommandPalette.Trigger>Search</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup aria-label="Search">
          <CommandPalette.Close aria-label="Close search" />
          <CommandPalette.Content inputValue={palette.query} onInputChange={palette.setQuery}>
            <CommandPalette.SearchField>
              <CommandPalette.Input placeholder="Search projects, docs, and settings..." />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>
            <CommandPalette.ListBox aria-label="Search results">
              {palette.groupedCommands.map((group) => (
                <CommandPalette.Section key={group.id}>
                  <CommandPalette.SectionHeader>{group.title}</CommandPalette.SectionHeader>
                  {group.commands.map((command) => (
                    <CommandPalette.Item key={command.id} command={command}>
                      <CommandPalette.ItemContent>
                        <CommandPalette.ItemTitle>{command.title}</CommandPalette.ItemTitle>
                      </CommandPalette.ItemContent>
                    </CommandPalette.Item>
                  ))}
                </CommandPalette.Section>
              ))}
            </CommandPalette.ListBox>
            {loading ? (
              <CommandPalette.LoadMoreItem>Searching...</CommandPalette.LoadMoreItem>
            ) : null}
            {!loading && palette.filteredCommands.length === 0 ? (
              <CommandPalette.Empty>No matching commands.</CommandPalette.Empty>
            ) : null}
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## Customization Points

- Debounce `query` before calling the API for high-traffic search.
- Keep always-available local commands in `baseCommands`.
- Use `LoadMoreItem` for incremental pagination or pending remote results.
