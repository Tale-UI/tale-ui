import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from '@tale-ui/react/drawer';

type Args = {
  defaultOpen: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Drawer',
  parameters: { layout: 'centered' },
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    defaultOpen: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Drawer.Root key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Popup>
        <p>Drawer content goes here.</p>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Popup>
        <Drawer.Title>Drawer Title</Drawer.Title>
        <Drawer.Description>This is a description of the drawer content.</Drawer.Description>
        <p className="story-drawer-content">Additional content can go here.</p>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithBackdrop: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Title>Drawer with Backdrop</Drawer.Title>
        <Drawer.Description>Click the backdrop to close.</Drawer.Description>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Handle />
        <Drawer.Title>Drawer with Handle</Drawer.Title>
        <Drawer.Description>The handle bar indicates this drawer is draggable.</Drawer.Description>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Handle />
        <Drawer.Title>Confirm Action</Drawer.Title>
        <Drawer.Description>Are you sure you want to proceed?</Drawer.Description>
        <div className="story-row story-row--s" style={{ marginTop: 'var(--space-m)' }}>
          <Drawer.Close className="tale-button tale-button--neutral">Cancel</Drawer.Close>
          <Drawer.Close className="tale-button tale-button--primary">Confirm</Drawer.Close>
        </div>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: 'var(--space-l)', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">Basic</span>
          <Drawer.Root>
            <Drawer.Trigger className="tale-button tale-button--neutral">Basic</Drawer.Trigger>
            <Drawer.Popup>
              <p>Simple drawer content.</p>
              <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
            </Drawer.Popup>
          </Drawer.Root>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">With title</span>
          <Drawer.Root>
            <Drawer.Trigger className="tale-button tale-button--neutral">Title</Drawer.Trigger>
            <Drawer.Popup>
              <Drawer.Title>Drawer Title</Drawer.Title>
              <Drawer.Description>Description text goes here.</Drawer.Description>
              <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
            </Drawer.Popup>
          </Drawer.Root>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">With backdrop</span>
          <Drawer.Root>
            <Drawer.Trigger className="tale-button tale-button--neutral">Backdrop</Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Popup>
              <Drawer.Title>Backdrop Drawer</Drawer.Title>
              <Drawer.Description>Click backdrop to close.</Drawer.Description>
              <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
            </Drawer.Popup>
          </Drawer.Root>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">With handle</span>
          <Drawer.Root>
            <Drawer.Trigger className="tale-button tale-button--neutral">Handle</Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Popup>
              <Drawer.Handle />
              <Drawer.Title>Draggable Drawer</Drawer.Title>
              <Drawer.Description>This drawer has a drag handle.</Drawer.Description>
              <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
            </Drawer.Popup>
          </Drawer.Root>
        </div>
      </div>
    );
  },
};
