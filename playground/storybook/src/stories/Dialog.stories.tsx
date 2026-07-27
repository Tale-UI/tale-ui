import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from '@tale-ui/react/dialog';
import { Button } from '@tale-ui/react/button';

type Args = {
  isOpen: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Dialog',
  parameters: { layout: 'centered' },
  argTypes: {
    isOpen: { control: 'boolean' },
  },
  args: {
    isOpen: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

function DialogDemo({
  triggerLabel,
  triggerVariant = 'primary',
  title,
  description,
  children,
  controlledOpen,
}: {
  triggerLabel: string;
  triggerVariant?: 'primary' | 'neutral' | 'danger';
  title: string;
  description: string;
  children?: React.ReactNode;
  controlledOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    }
  }, [controlledOpen]);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`tale-button--${triggerVariant}`}>{triggerLabel}</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children ?? (
            <Dialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onPress={() => setOpen(false)}>
                Confirm
              </Button>
            </Dialog.Actions>
          )}
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

export const Default: Story = {
  render: (args) => (
    <DialogDemo
      controlledOpen={args.isOpen}
      triggerLabel="Open Dialog"
      title="Confirm action"
      description="Are you sure you want to proceed? This action can be undone later."
    />
  ),
};

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog.Root isOpen={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="tale-button--danger">Delete Account</Dialog.Trigger>
        <Dialog.Backdrop>
          <Dialog.Popup>
            <Dialog.Close aria-label="Close" />
            <Dialog.Title>Delete account</Dialog.Title>
            <Dialog.Description>
              This action is permanent and cannot be undone. All your data will be lost.
            </Dialog.Description>
            <Dialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onPress={() => setOpen(false)}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog.Popup>
        </Dialog.Backdrop>
      </Dialog.Root>
    );
  },
};

export const ScrollableContent: Story = {
  name: 'Scrollable Content',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog.Root isOpen={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="tale-button--primary">Terms &amp; Conditions</Dialog.Trigger>
        <Dialog.Backdrop>
          <Dialog.Popup>
            <Dialog.Close aria-label="Close" />
            <Dialog.Title>Terms of Service</Dialog.Title>
            <Dialog.Description>Please read the following terms carefully.</Dialog.Description>
            <div className="story-dialog-scroll">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="story-dialog-scroll-paragraph">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              ))}
            </div>
            <Dialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>
                Decline
              </Button>
              <Button variant="primary" onPress={() => setOpen(false)}>
                Accept
              </Button>
            </Dialog.Actions>
          </Dialog.Popup>
        </Dialog.Backdrop>
      </Dialog.Root>
    );
  },
};

export const Dismissable: Story = {
  name: 'Dismissable',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog.Root isOpen={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="tale-button--neutral">Open Dismissable</Dialog.Trigger>
        <Dialog.Backdrop isDismissable>
          <Dialog.Popup>
            <Dialog.Close aria-label="Close" />
            <Dialog.Title>Dismissable Dialog</Dialog.Title>
            <Dialog.Description>
              Click the backdrop or press Escape to dismiss this dialog.
            </Dialog.Description>
            <Dialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>
                Dismiss
              </Button>
            </Dialog.Actions>
          </Dialog.Popup>
        </Dialog.Backdrop>
      </Dialog.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: 'var(--space-m)', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">Default</span>
          <DialogDemo
            triggerLabel="Open Default"
            triggerVariant="primary"
            title="Confirm action"
            description="Are you sure you want to proceed? This action can be undone later."
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">Scrollable</span>
          <DialogDemo
            triggerLabel="Open Scrollable"
            triggerVariant="neutral"
            title="Terms of Service"
            description="Please read the following terms carefully."
          >
            <div style={{ maxHeight: 200, overflow: 'auto', margin: 'var(--space-s) 0' }}>
              {Array.from({ length: 10 }, (_, i) => (
                <p key={i} style={{ margin: 'var(--space-xs) 0', color: 'var(--neutral-60)' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
          </DialogDemo>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">Alert-style</span>
          <DialogDemo
            triggerLabel="Delete Account"
            triggerVariant="danger"
            title="Delete account"
            description="This action is permanent and cannot be undone. All your data will be lost."
          />
        </div>
      </div>
    );
  },
};
