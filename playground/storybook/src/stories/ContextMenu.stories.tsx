import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu } from '@tale-ui/react/context-menu';

type Args = {
  size?: 'sm' | 'md';
};

const meta: Meta<Args> = {
  title: 'Components/ContextMenu',
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <ContextMenu.Root size={args.size}>
      <ContextMenu.Trigger>
        Right-click or use the keyboard context-menu shortcut
      </ContextMenu.Trigger>
      <ContextMenu.Popup>
        <ContextMenu.MenuList aria-label="Context actions">
          <ContextMenu.Item id="cut" textValue="Cut" onAction={() => console.log('Cut')}>
            Cut
          </ContextMenu.Item>
          <ContextMenu.Item id="copy" textValue="Copy" onAction={() => console.log('Copy')}>
            Copy
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item id="paste" textValue="Paste" onAction={() => console.log('Paste')}>
            Paste
          </ContextMenu.Item>
        </ContextMenu.MenuList>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  ),
};

export const WithGroups: Story = {
  render: (args) => (
    <ContextMenu.Root size={args.size}>
      <ContextMenu.Trigger>
        <div className="story-context-trigger">
          Right-click, long press, or use the keyboard context-menu shortcut
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Popup>
        <ContextMenu.MenuList aria-label="Context actions">
          <ContextMenu.Group>
            <ContextMenu.Item id="cut" textValue="Cut">
              Cut
            </ContextMenu.Item>
            <ContextMenu.Item id="copy" textValue="Copy">
              Copy
            </ContextMenu.Item>
            <ContextMenu.Item id="paste" textValue="Paste">
              Paste
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item id="select-all" textValue="Select All">
              Select All
            </ContextMenu.Item>
            <ContextMenu.Item id="find" textValue="Find...">
              Find...
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item id="inspect" textValue="Inspect Element">
              Inspect Element
            </ContextMenu.Item>
          </ContextMenu.Group>
        </ContextMenu.MenuList>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const areaStyle = {
      padding: 32,
      border: '1px dashed var(--neutral-30)',
      borderRadius: 8,
      textAlign: 'center' as const,
    };
    return (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default</span>
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div style={areaStyle}>Right-click here</div>
            </ContextMenu.Trigger>
            <ContextMenu.Popup>
              <ContextMenu.MenuList aria-label="Context actions">
                <ContextMenu.Item id="av-cut" textValue="Cut">
                  Cut
                </ContextMenu.Item>
                <ContextMenu.Item id="av-copy" textValue="Copy">
                  Copy
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item id="av-paste" textValue="Paste">
                  Paste
                </ContextMenu.Item>
              </ContextMenu.MenuList>
            </ContextMenu.Popup>
          </ContextMenu.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">With Groups</span>
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div style={areaStyle}>Right-click this area</div>
            </ContextMenu.Trigger>
            <ContextMenu.Popup>
              <ContextMenu.MenuList aria-label="Grouped actions">
                <ContextMenu.Group>
                  <ContextMenu.Item id="av-g-cut" textValue="Cut">
                    Cut
                  </ContextMenu.Item>
                  <ContextMenu.Item id="av-g-copy" textValue="Copy">
                    Copy
                  </ContextMenu.Item>
                  <ContextMenu.Item id="av-g-paste" textValue="Paste">
                    Paste
                  </ContextMenu.Item>
                </ContextMenu.Group>
                <ContextMenu.Separator />
                <ContextMenu.Group>
                  <ContextMenu.Item id="av-g-select" textValue="Select All">
                    Select All
                  </ContextMenu.Item>
                  <ContextMenu.Item id="av-g-find" textValue="Find...">
                    Find...
                  </ContextMenu.Item>
                </ContextMenu.Group>
              </ContextMenu.MenuList>
            </ContextMenu.Popup>
          </ContextMenu.Root>
        </div>
      </div>
    );
  },
};
