import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@tale-ui/react/button';
import { ButtonGroup } from '@tale-ui/react/button-group';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    isAttached: {
      control: 'boolean',
    },
  },
  args: {
    'aria-label': 'Document actions',
    orientation: 'horizontal',
    isAttached: false,
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return (
      <ButtonGroup {...args}>
        <Button>Save</Button>
        <Button variant="neutral">Share</Button>
        <Button variant="neutral">Export</Button>
      </ButtonGroup>
    );
  },
};
