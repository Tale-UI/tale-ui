import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@tale-ui/react/skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'rectangular', 'circular'],
    },
    animation: {
      control: 'inline-radio',
      options: ['pulse', 'none'],
    },
  },
  args: {
    variant: 'text',
    animation: 'pulse',
    width: '16rem',
    height: '2rem',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
