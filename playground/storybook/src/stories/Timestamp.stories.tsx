import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timestamp } from '@tale-ui/react/timestamp';

type Args = {
  value: string;
  format: 'date' | 'time' | 'datetime' | 'relative';
  locale: string;
  timeZone: string;
  now: string;
  refreshInterval: number;
  invalidFallback: string;
  formatOptions: Intl.DateTimeFormatOptions;
};

const meta: Meta<Args> = {
  title: 'Components/Timestamp',
  args: {
    value: '2026-07-27T04:30:00Z',
    format: 'datetime',
    locale: 'en-AU',
    timeZone: 'Australia/Melbourne',
    now: '2026-07-27T04:00:00Z',
    refreshInterval: 0,
    invalidFallback: 'Date unavailable',
    formatOptions: {},
  },
  argTypes: {
    value: { control: 'text' },
    format: {
      control: 'inline-radio',
      options: ['date', 'time', 'datetime', 'relative'],
    },
    locale: { control: 'text' },
    timeZone: { control: 'text' },
    now: { control: 'text' },
    refreshInterval: { control: { type: 'number', min: 0, step: 1000 } },
    invalidFallback: { control: 'text' },
    formatOptions: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    const common = {
      value: args.value,
      locale: args.locale,
      timeZone: args.timeZone,
      invalidFallback: args.invalidFallback,
    };

    if (args.format === 'relative') {
      return (
        <Timestamp
          {...common}
          format="relative"
          now={args.now}
          refreshInterval={args.refreshInterval}
        />
      );
    }

    return <Timestamp {...common} format={args.format} formatOptions={args.formatOptions} />;
  },
};

export const DateOnly: Story = {
  args: { format: 'date' },
  render: Default.render,
};

export const TimeOnly: Story = {
  args: { format: 'time' },
  render: Default.render,
};

export const Relative: Story = {
  args: {
    format: 'relative',
    now: '2026-07-27T04:00:00Z',
    refreshInterval: 0,
  },
  render: Default.render,
};

export const InvalidFallback: Story = {
  args: {
    value: '27 July 2026',
    invalidFallback: 'Date unavailable',
  },
  render: Default.render,
};
