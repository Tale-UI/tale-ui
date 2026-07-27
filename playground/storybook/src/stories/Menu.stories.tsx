import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from '@tale-ui/react/menu';
import { Icon } from '@tale-ui/react/icon';
import { ChevronDown } from 'lucide-react';

type Args = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  size?: 'sm' | 'md';
  isDisabled: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Menu',
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: { control: 'number' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    placement: 'bottom',
    offset: 4,
    size: 'md',
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size} isDisabled={args.isDisabled}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          Options <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="File actions">
            <Menu.Item id="new" textValue="New File">
              New File
            </Menu.Item>
            <Menu.Item id="open" textValue="Open">
              Open
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item id="save" textValue="Save">
              Save
            </Menu.Item>
            <Menu.Item id="save-as" textValue="Save As…">
              Save As…
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item id="close" textValue="Close">
              Close
            </Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const WithGroups: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          Actions <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Actions">
            <Menu.Group>
              <Menu.Header>Edit</Menu.Header>
              <Menu.Item id="cut" textValue="Cut">
                Cut
              </Menu.Item>
              <Menu.Item id="copy" textValue="Copy">
                Copy
              </Menu.Item>
              <Menu.Item id="paste" textValue="Paste">
                Paste
              </Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Header>View</Menu.Header>
              <Menu.Item id="zoom-in" textValue="Zoom In">
                Zoom In
              </Menu.Item>
              <Menu.Item id="zoom-out" textValue="Zoom Out">
                Zoom Out
              </Menu.Item>
              <Menu.Item id="reset-zoom" textValue="Reset Zoom">
                Reset Zoom
              </Menu.Item>
            </Menu.Group>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          Edit <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Edit actions">
            <Menu.Item id="undo" textValue="Undo">
              Undo
            </Menu.Item>
            <Menu.Item id="redo" textValue="Redo" isDisabled>
              Redo
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item id="cut" textValue="Cut">
              Cut
            </Menu.Item>
            <Menu.Item id="copy" textValue="Copy">
              Copy
            </Menu.Item>
            <Menu.Item id="paste" textValue="Paste" isDisabled>
              Paste
            </Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md" isDisabled>
          Disabled Menu <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Menu">
            <Menu.Item id="a" textValue="Item A">
              Item A
            </Menu.Item>
            <Menu.Item id="b" textValue="Item B">
              Item B
            </Menu.Item>
            <Menu.Item id="c" textValue="Item C">
              Item C
            </Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const CheckboxItems: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          Format <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Format" selectionMode="multiple">
            <Menu.CheckboxItem id="bold" textValue="Bold">
              Bold
            </Menu.CheckboxItem>
            <Menu.CheckboxItem id="italic" textValue="Italic">
              Italic
            </Menu.CheckboxItem>
            <Menu.CheckboxItem id="underline" textValue="Underline">
              Underline
            </Menu.CheckboxItem>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const RadioItems: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          View <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="View" selectionMode="single">
            <Menu.RadioItem id="list" textValue="List">
              List
            </Menu.RadioItem>
            <Menu.RadioItem id="grid" textValue="Grid">
              Grid
            </Menu.RadioItem>
            <Menu.RadioItem id="board" textValue="Board">
              Board
            </Menu.RadioItem>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const LinkItems: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          Links <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Links">
            <Menu.LinkItem id="docs" textValue="Documentation" href="#">
              Documentation
            </Menu.LinkItem>
            <Menu.LinkItem id="github" textValue="GitHub" href="#">
              GitHub
            </Menu.LinkItem>
            <Menu.Separator />
            <Menu.LinkItem id="report" textValue="Report Issue" href="#">
              Report Issue
            </Menu.LinkItem>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const AllItemTypes: Story = {
  render: (args) => (
    <div className="story-padded">
      <Menu.Root size={args.size}>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
          All Types <Icon icon={ChevronDown} size="sm" />
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="All item types">
            <Menu.Group>
              <Menu.Header>Actions</Menu.Header>
              <Menu.Item id="new" textValue="New File">
                New File
              </Menu.Item>
              <Menu.Item id="open" textValue="Open">
                Open
              </Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Header>Format</Menu.Header>
              <Menu.CheckboxItem id="bold" textValue="Bold">
                Bold
              </Menu.CheckboxItem>
              <Menu.CheckboxItem id="italic" textValue="Italic">
                Italic
              </Menu.CheckboxItem>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Header>View</Menu.Header>
              <Menu.RadioItem id="list" textValue="List">
                List
              </Menu.RadioItem>
              <Menu.RadioItem id="grid" textValue="Grid">
                Grid
              </Menu.RadioItem>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Header>Links</Menu.Header>
              <Menu.LinkItem id="docs" textValue="Documentation" href="#">
                Documentation
              </Menu.LinkItem>
              <Menu.LinkItem id="github" textValue="GitHub" href="#">
                GitHub
              </Menu.LinkItem>
            </Menu.Group>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default</span>
          <Menu.Root>
            <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
              Options <Icon icon={ChevronDown} size="sm" />
            </Menu.Trigger>
            <Menu.Popover>
              <Menu.MenuList aria-label="File actions">
                <Menu.Item id="av-new" textValue="New File">
                  New File
                </Menu.Item>
                <Menu.Item id="av-open" textValue="Open">
                  Open
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item id="av-save" textValue="Save">
                  Save
                </Menu.Item>
              </Menu.MenuList>
            </Menu.Popover>
          </Menu.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">With Groups</span>
          <Menu.Root>
            <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
              Actions <Icon icon={ChevronDown} size="sm" />
            </Menu.Trigger>
            <Menu.Popover>
              <Menu.MenuList aria-label="Actions">
                <Menu.Group>
                  <Menu.Header>Edit</Menu.Header>
                  <Menu.Item id="av-cut" textValue="Cut">
                    Cut
                  </Menu.Item>
                  <Menu.Item id="av-copy" textValue="Copy">
                    Copy
                  </Menu.Item>
                </Menu.Group>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.Header>View</Menu.Header>
                  <Menu.Item id="av-zoom-in" textValue="Zoom In">
                    Zoom In
                  </Menu.Item>
                  <Menu.Item id="av-zoom-out" textValue="Zoom Out">
                    Zoom Out
                  </Menu.Item>
                </Menu.Group>
              </Menu.MenuList>
            </Menu.Popover>
          </Menu.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Checkbox Items</span>
          <Menu.Root>
            <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
              Format <Icon icon={ChevronDown} size="sm" />
            </Menu.Trigger>
            <Menu.Popover>
              <Menu.MenuList aria-label="Format" selectionMode="multiple">
                <Menu.CheckboxItem id="av-bold" textValue="Bold">
                  Bold
                </Menu.CheckboxItem>
                <Menu.CheckboxItem id="av-italic" textValue="Italic">
                  Italic
                </Menu.CheckboxItem>
                <Menu.CheckboxItem id="av-underline" textValue="Underline">
                  Underline
                </Menu.CheckboxItem>
              </Menu.MenuList>
            </Menu.Popover>
          </Menu.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Radio Items</span>
          <Menu.Root>
            <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
              View <Icon icon={ChevronDown} size="sm" />
            </Menu.Trigger>
            <Menu.Popover>
              <Menu.MenuList aria-label="View" selectionMode="single">
                <Menu.RadioItem id="av-list" textValue="List">
                  List
                </Menu.RadioItem>
                <Menu.RadioItem id="av-grid" textValue="Grid">
                  Grid
                </Menu.RadioItem>
                <Menu.RadioItem id="av-board" textValue="Board">
                  Board
                </Menu.RadioItem>
              </Menu.MenuList>
            </Menu.Popover>
          </Menu.Root>
        </div>
      </div>
    );
  },
};
