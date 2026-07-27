import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@tale-ui/react/button';
import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';

type Args = {
  variant: 'neutral' | 'success' | 'warning' | 'danger';
  placement: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
};

const meta: Meta<Args> = {
  title: 'Components/Toast',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'success', 'warning', 'danger'],
    },
    placement: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
  },
  args: {
    variant: 'success',
    placement: 'bottom-end',
  },
};

export default meta;
type Story = StoryObj<Args>;

function DefaultToast({ variant, placement }: Args) {
  const [queue] = React.useState(() => createToastQueue());

  return (
    <React.Fragment>
      <Button
        onPress={() => {
          queue.add({
            title: 'Changes saved',
            description: 'Your preferences are up to date.',
            variant,
          });
        }}
      >
        Show Toast
      </Button>
      <ToastRegion queue={queue} placement={placement} />
    </React.Fragment>
  );
}

function VisibleToast({ variant, placement }: Args) {
  const [queue] = React.useState(() => {
    const nextQueue = createToastQueue({ defaultTimeout: 0 });
    nextQueue.add({
      title: 'Changes saved',
      description: 'Your preferences are up to date.',
      variant,
    });
    return nextQueue;
  });

  return <ToastRegion queue={queue} placement={placement} />;
}

export const Default: Story = {
  render: (args) => <DefaultToast key={`${args.variant}-${args.placement}`} {...args} />,
};

export const Visible: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VisibleToast variant="success" placement="bottom-end" />,
};
