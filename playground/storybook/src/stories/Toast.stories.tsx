import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@tale-ui/react/button';
import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Toast',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<Args>;

function DefaultToast() {
  const [queue] = React.useState(() => createToastQueue());

  return (
    <React.Fragment>
      <Button
        onPress={() => {
          queue.add({
            title: 'Changes saved',
            description: 'Your preferences are up to date.',
            variant: 'success',
          });
        }}
      >
        Show Toast
      </Button>
      <ToastRegion queue={queue} />
    </React.Fragment>
  );
}

function VisibleToast() {
  const [queue] = React.useState(() => {
    const nextQueue = createToastQueue({ defaultTimeout: 0 });
    nextQueue.add({
      title: 'Changes saved',
      description: 'Your preferences are up to date.',
      variant: 'success',
    });
    return nextQueue;
  });

  return <ToastRegion queue={queue} />;
}

export const Default: Story = {
  render: () => <DefaultToast />,
};

export const Visible: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VisibleToast />,
};
