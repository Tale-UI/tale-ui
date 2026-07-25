# CommandPalette

`import { CommandPalette, useCommandPalette, useCommandPaletteShortcut } from '@tale-ui/react/command-palette';`

A keyboard-friendly command surface for application actions, navigation shortcuts, searchable resources, and grouped workflows.

## Parts

| Part                             | Description                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `CommandPalette.Root`            | Manages open state. Accepts `open`, `defaultOpen`, `onOpenChange`, `size`, and `closeOnSelect`.              |
| `CommandPalette.Trigger`         | Button that opens the palette.                                                                               |
| `CommandPalette.Backdrop`        | Modal backdrop. Wrap `CommandPalette.Popup` inside it. Dismisses on outside press by default.                |
| `CommandPalette.Popup`           | Modal and dialog container. Must be rendered inside `CommandPalette.Backdrop`.                               |
| `CommandPalette.Title`           | Accessible dialog heading.                                                                                   |
| `CommandPalette.Description`     | Optional dialog description.                                                                                 |
| `CommandPalette.Close`           | Icon button that closes the palette.                                                                         |
| `CommandPalette.Content`         | Autocomplete provider around search and results.                                                             |
| `CommandPalette.SearchField`     | Search field wrapper. Defaults to the `inline` variant.                                                      |
| `CommandPalette.Input`           | Search input. Defaults to `autoFocus`.                                                                       |
| `CommandPalette.ClearButton`     | Small ghost button that clears the search field.                                                             |
| `CommandPalette.Chips`           | Optional active filter chip container.                                                                       |
| `CommandPalette.Chip`            | Filter chip.                                                                                                 |
| `CommandPalette.ChipRemove`      | Removes a filter chip.                                                                                       |
| `CommandPalette.ListBox`         | Results list.                                                                                                |
| `CommandPalette.Section`         | Groups commands.                                                                                             |
| `CommandPalette.SectionHeader`   | Group label.                                                                                                 |
| `CommandPalette.Item`            | Selectable command. Accepts `id`, `textValue`, `href`, `target`, `command`, `onAction`, and `closeOnSelect`. |
| `CommandPalette.ItemIcon`        | Leading visual slot.                                                                                         |
| `CommandPalette.ItemContent`     | Text content slot.                                                                                           |
| `CommandPalette.ItemTitle`       | Command title.                                                                                               |
| `CommandPalette.ItemDescription` | Supporting text.                                                                                             |
| `CommandPalette.ItemMeta`        | Trailing metadata slot.                                                                                      |
| `CommandPalette.Shortcut`        | Keyboard shortcut tokens.                                                                                    |
| `CommandPalette.Separator`       | Visual separator.                                                                                            |
| `CommandPalette.LoadMoreItem`    | Non-selected loading or pagination row.                                                                      |
| `CommandPalette.Empty`           | Empty results state.                                                                                         |
| `CommandPalette.Footer`          | Footer hints or scope metadata.                                                                              |
| `CommandPalette.Collection`      | React Aria collection escape hatch for advanced dynamic rendering.                                           |

## Props

### `CommandPalette.Root`

| Prop            | Type                      | Default | Description                                |
| --------------- | ------------------------- | ------- | ------------------------------------------ |
| `open`          | `boolean`                 | —       | Controlled open state.                     |
| `defaultOpen`   | `boolean`                 | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange`  | `(open: boolean) => void` | —       | Called when the palette opens or closes.   |
| `size`          | `'sm' \| 'md' \| 'lg'`    | `'md'`  | Popup and row density.                     |
| `closeOnSelect` | `boolean`                 | `true`  | Closes the palette after item selection.   |

Also accepts standard `<div>` attributes.

### `CommandPalette.Backdrop`

| Prop            | Type      | Default | Description                                            |
| --------------- | --------- | ------- | ------------------------------------------------------ |
| `isDismissable` | `boolean` | `true`  | Closes the palette when users press outside the popup. |

Also accepts React Aria `ModalOverlay` props except `isOpen`, `onOpenChange`, and `className`.

### `CommandPalette.Popup`

| Prop         | Type   | Default | Description                                                                          |
| ------------ | ------ | ------- | ------------------------------------------------------------------------------------ |
| `modalProps` | object | —       | Props for the modal surface. Use `modalProps.className` for popup surface modifiers. |
| `className`  | string | —       | Additional class name for the inner dialog element, not the outer popup surface.     |

Also accepts React Aria `Dialog` props except `className`.

## Basic Usage

```tsx
import { CommandPalette } from '@tale-ui/react/command-palette';

export function AppCommandPalette() {
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
                <CommandPalette.SectionHeader>Workspace</CommandPalette.SectionHeader>
                <CommandPalette.Item id="new-file" textValue="New file">
                  <CommandPalette.ItemContent>
                    <CommandPalette.ItemTitle>New file</CommandPalette.ItemTitle>
                    <CommandPalette.ItemDescription>
                      Create a workspace file.
                    </CommandPalette.ItemDescription>
                  </CommandPalette.ItemContent>
                  <CommandPalette.ItemMeta>
                    <CommandPalette.Shortcut keys={['Mod', 'N']} />
                  </CommandPalette.ItemMeta>
                </CommandPalette.Item>
                <CommandPalette.Item id="open-settings" textValue="Open settings">
                  <CommandPalette.ItemContent>
                    <CommandPalette.ItemTitle>Open settings</CommandPalette.ItemTitle>
                    <CommandPalette.ItemDescription>
                      Change account and workspace settings.
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

## With useCommandPalette

Use `useCommandPalette` when the consumer project owns command data and wants shared filtering, stable sorting, grouping, disabled handling, and action dispatch.

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
    id: 'dashboard',
    title: 'Open dashboard',
    subtitle: 'Go to the main overview',
    group: 'Navigation',
    keywords: ['home', 'overview'],
    shortcut: ['Mod', 'D'],
  },
  {
    id: 'invite',
    title: 'Invite member',
    subtitle: 'Add a teammate to this workspace',
    group: 'People',
    shortcut: ['Mod', 'I'],
  },
];

export function WorkspaceCommandPalette() {
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
    <CommandPalette.Root open={open} onOpenChange={setOpen}>
      <CommandPalette.Trigger>Open command palette</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup aria-label="Command palette">
          <CommandPalette.Close aria-label="Close command palette" />
          <CommandPalette.Content inputValue={palette.query} onInputChange={palette.setQuery}>
            <CommandPalette.SearchField>
              <CommandPalette.Input placeholder="Search workspace..." />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>
            <CommandPalette.ListBox aria-label="Workspace commands">
              {palette.groupedCommands.map((group) => (
                <CommandPalette.Section key={group.id}>
                  {group.title ? (
                    <CommandPalette.SectionHeader>{group.title}</CommandPalette.SectionHeader>
                  ) : null}
                  {group.commands.map((command) => (
                    <CommandPalette.Item
                      key={command.id}
                      command={command}
                      onAction={() => void palette.runCommand(command)}
                    >
                      <CommandPalette.ItemContent>
                        <CommandPalette.ItemTitle>{command.title}</CommandPalette.ItemTitle>
                        {command.subtitle ? (
                          <CommandPalette.ItemDescription>
                            {command.subtitle}
                          </CommandPalette.ItemDescription>
                        ) : null}
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
            <CommandPalette.Footer>Press Esc to close.</CommandPalette.Footer>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}
```

## CSS Classes

- `.tale-command-palette` - Root wrapper
- `.tale-command-palette__trigger` - Trigger button
- `.tale-command-palette__backdrop` - Modal backdrop
- `.tale-command-palette__backdrop--transparent` - Transparent backdrop modifier for visible page content
- `.tale-command-palette__popup` - Modal container
- `.tale-command-palette__popup--translucent` - Neutral translucent popup with local backdrop blur
- `.tale-command-palette__dialog` - Dialog element
- `.tale-command-palette__title` - Dialog title
- `.tale-command-palette__description` - Dialog description
- `.tale-command-palette__close` - Close button
- `.tale-command-palette__content` - Content and autocomplete context
- `.tale-command-palette__search-field` - Search field wrapper
- `.tale-command-palette__search-field--inline` - Inline search field variant
- `.tale-command-palette__search-field--default` - Default search field variant
- `.tale-command-palette__input` - Search input
- `.tale-command-palette__clear` - Clear button
- `.tale-command-palette__chips` - Filter chip list
- `.tale-command-palette__chip` - Filter chip
- `.tale-command-palette__chip-remove` - Chip remove button
- `.tale-command-palette__listbox` - Results listbox
- `.tale-command-palette__section` - Results section
- `.tale-command-palette__section-header` - Section label
- `.tale-command-palette__item` - Command item
- `.tale-command-palette__item-icon` - Leading icon slot
- `.tale-command-palette__item-content` - Item text container
- `.tale-command-palette__item-title` - Item title
- `.tale-command-palette__item-description` - Item description
- `.tale-command-palette__item-meta` - Trailing metadata
- `.tale-command-palette__shortcut` - Shortcut token group
- `.tale-command-palette__shortcut-key` - Shortcut key token
- `.tale-command-palette__separator` - Separator
- `.tale-command-palette__load-more-item` - Loading or pagination row
- `.tale-command-palette__empty` - Empty state
- `.tale-command-palette__footer` - Footer

## Pitfalls

<!-- pitfall: command-palette-content-required -->

- **Wrap popup content correctly** - `Backdrop` wraps `Popup`, and `Content` wraps `SearchField` and `ListBox`.
  - anti-pattern: `<CommandPalette.Backdrop /><CommandPalette.Popup><CommandPalette.SearchField /><CommandPalette.ListBox /></CommandPalette.Popup>`
  - fix: `<CommandPalette.Backdrop><CommandPalette.Popup><CommandPalette.Content><CommandPalette.SearchField /><CommandPalette.ListBox /></CommandPalette.Content></CommandPalette.Popup></CommandPalette.Backdrop>`

<!-- pitfall: command-palette-accessible-labels -->
<!-- prose-only -->
<!-- multi-idea-ok -->

- **Keep dialog, search, and listbox labels accessible** - use `Title`, visible text, or explicit `aria-label` values when labels are not visible.

<!-- pitfall: command-palette-shortcut-listener -->
<!-- prose-only -->

- **Use `useCommandPaletteShortcut` with controlled open state** - pass the same `open` and `setOpen` values used by `CommandPalette.Root`.

<!-- pitfall: command-palette-command-action -->
<!-- prose-only -->

- **Use one command action handler** - when using `command`, either let `CommandPalette.Item` call the command action or pass `onAction={() => void palette.runCommand(command)}`; do not also call it from a nested button.

## Notes

- Use `href` on `CommandPalette.Item` or on a command object for navigational commands.
- Use neutral `Button` controls in a `Row` with `gap="3xs"` for quick navigation links near the search field, and remove the search field container's bottom border; reserve `CommandPalette.Chip` for active filters or removable query refinements.
- Use a scoped `.dark` wrapper for palettes that must keep dark-mode colors on a light page; add it to `CommandPalette.Backdrop` as well so the modal surface inherits dark tokens.
- Use `modalProps={{ className: 'tale-command-palette__popup--translucent' }}` with `CommandPalette.Backdrop className="tale-command-palette__backdrop--transparent"` for palettes that should blur visible page content behind the popup.
- `CommandPalette.Backdrop` closes the palette when users press outside the popup; pass `isDismissable={false}` to require an explicit item or close-button action.
- Use `closeOnSelect={false}` on `Root`, `Item`, or command objects for persistent filter or toggle commands.
- `useCommandPalette` preserves source order when sort scores tie.
- `useCommandPaletteShortcut` ignores input, textarea, select, and contenteditable targets by default.
- Put long-running fetch states in `LoadMoreItem` or `Empty` instead of disabling the whole palette.
