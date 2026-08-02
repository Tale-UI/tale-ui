import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter } from '@tale-ui/react/meter';

type Args = {
  value?: number;
  minValue?: number;
  maxValue?: number;
};

const meta: Meta<Args> = {
  title: 'Components/Meter',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
  },
  args: {
    value: 60,
    minValue: 0,
    maxValue: 100,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-meter">
      <Meter.Root
        value={args.value}
        minValue={args.minValue}
        maxValue={args.maxValue}
        aria-label="Storage usage"
      >
        <Meter.Track>
          <Meter.Indicator value={args.value} />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-meter">
      <Meter.Root value={60} minValue={0} maxValue={100}>
        <Meter.Header>
          <Meter.Label>Storage</Meter.Label>
          <Meter.Value>60%</Meter.Value>
        </Meter.Header>
        <Meter.Track>
          <Meter.Indicator value={60} />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const AllValues: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-meter story-col story-col--m">
      {[10, 40, 70, 90].map((value) => (
        <Meter.Root key={value} value={value} minValue={0} maxValue={100}>
          <Meter.Header>
            <Meter.Label>Usage</Meter.Label>
            <Meter.Value>{value}%</Meter.Value>
          </Meter.Header>
          <Meter.Track>
            <Meter.Indicator value={value} />
          </Meter.Track>
        </Meter.Root>
      ))}
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const zones = [
      { value: 10, label: 'Low (10%)' },
      { value: 40, label: 'Medium (40%)' },
      { value: 70, label: 'High (70%)' },
      { value: 90, label: 'Critical (90%)' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)', width: 360 }}>
        <span className="story-label">Color zones by value</span>
        {zones.map(({ value, label }) => (
          <div
            key={value}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}
          >
            <span className="story-label" style={{ fontSize: 'var(--text-xs-font-size)' }}>
              {label}
            </span>
            <Meter.Root value={value} minValue={0} maxValue={100}>
              <Meter.Header>
                <Meter.Label>Storage</Meter.Label>
                <Meter.Value>{value}%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={value} />
              </Meter.Track>
            </Meter.Root>
          </div>
        ))}
      </div>
    );
  },
};
