import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Button } from '@tale-ui/react/button';

type Args = {
  isOpen: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/AlertDialog',
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

export const Default: Story = {
  render: (args) => (
    <AlertDialog.Root isOpen={args.isOpen} onOpenChange={() => {}}>
      <AlertDialog.Trigger className="tale-button tale-button--neutral">
        Open Alert
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Content>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
            <AlertDialog.Actions>
              <Button slot="close" variant="neutral">
                Cancel
              </Button>
              <Button slot="close" variant="primary">
                Confirm
              </Button>
            </AlertDialog.Actions>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
  ),
};

export const Destructive: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="tale-button tale-button--danger">
        Delete Account
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete Account</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete your account? All of your data will be permanently
              removed. This action cannot be undone.
            </AlertDialog.Description>
            <AlertDialog.Actions>
              <Button slot="close" variant="neutral">
                Cancel
              </Button>
              <Button slot="close" variant="danger">
                Delete
              </Button>
            </AlertDialog.Actions>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
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
          <span className="story-label">Default</span>
          <AlertDialog.Root>
            <AlertDialog.Trigger className="tale-button tale-button--neutral">
              Open Alert
            </AlertDialog.Trigger>
            <AlertDialog.Backdrop>
              <AlertDialog.Popup>
                <AlertDialog.Content>
                  <AlertDialog.Title>Are you sure?</AlertDialog.Title>
                  <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
                  <AlertDialog.Actions>
                    <Button slot="close" variant="neutral">
                      Cancel
                    </Button>
                    <Button slot="close" variant="primary">
                      Confirm
                    </Button>
                  </AlertDialog.Actions>
                </AlertDialog.Content>
              </AlertDialog.Popup>
            </AlertDialog.Backdrop>
          </AlertDialog.Root>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">Destructive</span>
          <AlertDialog.Root>
            <AlertDialog.Trigger className="tale-button tale-button--danger">
              Delete Account
            </AlertDialog.Trigger>
            <AlertDialog.Backdrop>
              <AlertDialog.Popup>
                <AlertDialog.Content>
                  <AlertDialog.Title>Delete Account</AlertDialog.Title>
                  <AlertDialog.Description>
                    Are you sure you want to delete your account? All data will be permanently
                    removed.
                  </AlertDialog.Description>
                  <AlertDialog.Actions>
                    <Button slot="close" variant="neutral">
                      Cancel
                    </Button>
                    <Button slot="close" variant="danger">
                      Delete
                    </Button>
                  </AlertDialog.Actions>
                </AlertDialog.Content>
              </AlertDialog.Popup>
            </AlertDialog.Backdrop>
          </AlertDialog.Root>
        </div>
      </div>
    );
  },
};
