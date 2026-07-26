import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timestamp } from '@tale-ui/react/timestamp';

const meta = {
  title: 'Components/Timestamp',
  component: Timestamp,
  args: {
    value: '2026-07-27T04:30:00Z',
    locale: 'en-AU',
    timeZone: 'Australia/Melbourne',
  },
} satisfies Meta<typeof Timestamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DateOnly: Story = {
  args: { format: 'date' },
};

export const TimeOnly: Story = {
  args: { format: 'time' },
};

export const Relative: Story = {
  args: {
    format: 'relative',
    now: '2026-07-27T04:00:00Z',
    refreshInterval: 0,
  },
};

export const InvalidFallback: Story = {
  args: {
    value: '27 July 2026',
    invalidFallback: 'Date unavailable',
  },
};
