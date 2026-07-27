import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CommandPalette,
  useCommandPalette,
  type CommandPaletteCommand,
} from '@tale-ui/react/command-palette';
import { Icon } from '@tale-ui/react/icon';
import { FileText, LayoutDashboard, LifeBuoy, Moon, Settings, UserPlus } from 'lucide-react';

type Args = {
  defaultOpen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  open: boolean;
  closeOnSelect: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/CommandPalette',
  argTypes: {
    defaultOpen: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    open: { control: 'boolean' },
    closeOnSelect: { control: 'boolean' },
  },
  args: {
    defaultOpen: true,
    size: 'md',
    open: false,
    closeOnSelect: true,
  },
};

export default meta;

type Story = StoryObj<Args>;

const commands: CommandPaletteCommand[] = [
  {
    id: 'dashboard',
    title: 'Open dashboard',
    subtitle: 'View workspace performance.',
    group: 'Navigation',
    icon: <Icon icon={LayoutDashboard} size="sm" />,
    shortcut: ['Mod', '1'],
  },
  {
    id: 'docs',
    title: 'Open docs',
    subtitle: 'Browse developer documentation.',
    group: 'Navigation',
    icon: <Icon icon={FileText} size="sm" />,
    shortcut: ['Mod', '2'],
  },
  {
    id: 'invite',
    title: 'Invite teammate',
    subtitle: 'Add a member to this workspace.',
    group: 'Actions',
    icon: <Icon icon={UserPlus} size="sm" />,
    keywords: ['member', 'user'],
  },
  {
    id: 'theme',
    title: 'Toggle theme',
    subtitle: 'Switch between light and dark modes.',
    group: 'Preferences',
    icon: <Icon icon={Moon} size="sm" />,
    shortcut: ['Mod', 'Shift', 'T'],
  },
  {
    id: 'settings',
    title: 'Open settings',
    subtitle: 'Manage account and workspace settings.',
    group: 'Preferences',
    icon: <Icon icon={Settings} size="sm" />,
  },
  {
    id: 'support',
    title: 'Contact support',
    subtitle: 'Start a support request.',
    group: 'Help',
    icon: <Icon icon={LifeBuoy} size="sm" />,
  },
];

function CommandRows({
  palette,
}: {
  palette: ReturnType<typeof useCommandPalette<CommandPaletteCommand>>;
}) {
  return (
    <React.Fragment>
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
              {command.icon ? (
                <CommandPalette.ItemIcon>{command.icon}</CommandPalette.ItemIcon>
              ) : null}
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
    </React.Fragment>
  );
}

export const Default: Story = {
  render(args) {
    return (
      <div className="story-padded">
        <CommandPalette.Root
          key={String(args.defaultOpen)}
          open={args.open || undefined}
          defaultOpen={args.defaultOpen}
          closeOnSelect={args.closeOnSelect}
          size={args.size}
        >
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
                    <CommandPalette.Item id="dashboard" textValue="Dashboard">
                      <CommandPalette.ItemIcon>
                        <Icon icon={LayoutDashboard} size="sm" />
                      </CommandPalette.ItemIcon>
                      <CommandPalette.ItemContent>
                        <CommandPalette.ItemTitle>Dashboard</CommandPalette.ItemTitle>
                        <CommandPalette.ItemDescription>
                          Open the workspace overview.
                        </CommandPalette.ItemDescription>
                      </CommandPalette.ItemContent>
                      <CommandPalette.ItemMeta>
                        <CommandPalette.Shortcut keys={['Mod', '1']} />
                      </CommandPalette.ItemMeta>
                    </CommandPalette.Item>
                    <CommandPalette.Item id="docs" textValue="Docs">
                      <CommandPalette.ItemIcon>
                        <Icon icon={FileText} size="sm" />
                      </CommandPalette.ItemIcon>
                      <CommandPalette.ItemContent>
                        <CommandPalette.ItemTitle>Docs</CommandPalette.ItemTitle>
                        <CommandPalette.ItemDescription>
                          Open developer documentation.
                        </CommandPalette.ItemDescription>
                      </CommandPalette.ItemContent>
                    </CommandPalette.Item>
                  </CommandPalette.Section>
                </CommandPalette.ListBox>
                <CommandPalette.Footer>Press Esc to close.</CommandPalette.Footer>
              </CommandPalette.Content>
            </CommandPalette.Popup>
          </CommandPalette.Backdrop>
        </CommandPalette.Root>
      </div>
    );
  },
};

export const WithHookFiltering: Story = {
  render(args) {
    function Demo() {
      const palette = useCommandPalette({ commands });

      return (
        <CommandPalette.Root defaultOpen={args.defaultOpen} size={args.size}>
          <CommandPalette.Trigger>Search workspace</CommandPalette.Trigger>
          <CommandPalette.Backdrop>
            <CommandPalette.Popup aria-label="Search workspace">
              <CommandPalette.Close aria-label="Close command palette" />
              <CommandPalette.Content inputValue={palette.query} onInputChange={palette.setQuery}>
                <CommandPalette.SearchField>
                  <CommandPalette.Input placeholder="Search workspace..." />
                  <CommandPalette.ClearButton aria-label="Clear search" />
                </CommandPalette.SearchField>
                <CommandPalette.Chips aria-label="Active filters">
                  <CommandPalette.Chip>
                    Workspace
                    <CommandPalette.ChipRemove aria-label="Remove workspace filter" />
                  </CommandPalette.Chip>
                </CommandPalette.Chips>
                <CommandPalette.ListBox aria-label="Workspace commands">
                  <CommandRows palette={palette} />
                </CommandPalette.ListBox>
                <CommandPalette.Footer>
                  {palette.filteredCommands.length} results
                </CommandPalette.Footer>
              </CommandPalette.Content>
            </CommandPalette.Popup>
          </CommandPalette.Backdrop>
        </CommandPalette.Root>
      );
    }

    return (
      <div className="story-padded">
        <Demo />
      </div>
    );
  },
};

export const LoadingAndEmpty: Story = {
  render(args) {
    return (
      <div className="story-padded">
        <CommandPalette.Root defaultOpen={args.defaultOpen} size={args.size}>
          <CommandPalette.Trigger>Search</CommandPalette.Trigger>
          <CommandPalette.Backdrop>
            <CommandPalette.Popup aria-label="Search">
              <CommandPalette.Close aria-label="Close search" />
              <CommandPalette.Content inputValue="billing">
                <CommandPalette.SearchField>
                  <CommandPalette.Input placeholder="Search everything..." />
                  <CommandPalette.ClearButton aria-label="Clear search" />
                </CommandPalette.SearchField>
                <CommandPalette.ListBox aria-label="Search results">
                  <CommandPalette.Empty>No local commands match.</CommandPalette.Empty>
                </CommandPalette.ListBox>
                <CommandPalette.LoadMoreItem>
                  Searching remote results...
                </CommandPalette.LoadMoreItem>
              </CommandPalette.Content>
            </CommandPalette.Popup>
          </CommandPalette.Backdrop>
        </CommandPalette.Root>
      </div>
    );
  },
};
