import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '@tale-ui/react/progress-bar';

type Args = {
  'aria-label': string;
  value?: number;
  minValue?: number;
  maxValue?: number;
  isIndeterminate?: boolean;
  labelPosition?: 'top' | 'right' | 'bottom' | 'top-floating' | 'bottom-floating';
};

const meta: Meta<Args> = {
  title: 'Components/ProgressBar',
  parameters: { layout: 'centered' },
  argTypes: {
    'aria-label': { control: 'text' },
    value: { control: { type: 'number', min: 0, max: 100 } },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
    isIndeterminate: { control: 'boolean' },
    labelPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'top-floating', 'bottom-floating'],
    },
  },
  args: {
    'aria-label': 'Upload progress',
    value: 60,
    minValue: 0,
    maxValue: 100,
    isIndeterminate: false,
    labelPosition: 'top',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-progress">
      <ProgressBar.Root
        {...(args.isIndeterminate ? { isIndeterminate: true } : { value: args.value })}
        minValue={args.minValue}
        maxValue={args.maxValue}
        labelPosition={args.labelPosition}
        aria-label={args['aria-label']}
      >
        <ProgressBar.Track>
          <ProgressBar.Indicator {...(args.isIndeterminate ? {} : { value: args.value })} />
        </ProgressBar.Track>
      </ProgressBar.Root>
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress">
      <ProgressBar.Root isIndeterminate minValue={0} maxValue={100}>
        <ProgressBar.Label>Loading...</ProgressBar.Label>
        <ProgressBar.Track>
          <ProgressBar.Indicator />
        </ProgressBar.Track>
      </ProgressBar.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress">
      <ProgressBar.Root value={60} minValue={0} maxValue={100}>
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading...</ProgressBar.Label>
          <ProgressBar.Value>60%</ProgressBar.Value>
        </ProgressBar.Header>
        <ProgressBar.Track>
          <ProgressBar.Indicator value={60} />
        </ProgressBar.Track>
      </ProgressBar.Root>
    </div>
  ),
};

export const AllValues: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      {[0, 25, 50, 75, 100].map((value) => (
        <ProgressBar.Root key={value} value={value} minValue={0} maxValue={100}>
          <ProgressBar.Header>
            <ProgressBar.Label>Progress</ProgressBar.Label>
            <ProgressBar.Value>{value}%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track>
            <ProgressBar.Indicator value={value} />
          </ProgressBar.Track>
        </ProgressBar.Root>
      ))}
    </div>
  ),
};

export const LabelRight: Story = {
  name: 'Label: Right',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      {[20, 60, 100].map((value) => (
        <ProgressBar.Root
          key={value}
          value={value}
          minValue={0}
          maxValue={100}
          labelPosition="right"
          aria-label="Upload progress"
        >
          <ProgressBar.Header>
            <ProgressBar.Value>{value}%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track>
            <ProgressBar.Indicator value={value} />
          </ProgressBar.Track>
        </ProgressBar.Root>
      ))}
    </div>
  ),
};

export const LabelBottom: Story = {
  name: 'Label: Bottom',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      {[20, 60, 100].map((value) => (
        <ProgressBar.Root
          key={value}
          value={value}
          minValue={0}
          maxValue={100}
          labelPosition="bottom"
        >
          <ProgressBar.Header>
            <ProgressBar.Label>Uploading</ProgressBar.Label>
            <ProgressBar.Value>{value}%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track>
            <ProgressBar.Indicator value={value} />
          </ProgressBar.Track>
        </ProgressBar.Root>
      ))}
    </div>
  ),
};

export const LabelTopFloating: Story = {
  name: 'Label: Top Floating',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      {[20, 60, 100].map((value) => (
        <ProgressBar.Root
          key={value}
          value={value}
          minValue={0}
          maxValue={100}
          labelPosition="top-floating"
          aria-label="Upload progress"
        >
          <ProgressBar.Header>
            <ProgressBar.Value>{value}%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track>
            <ProgressBar.Indicator value={value} />
          </ProgressBar.Track>
        </ProgressBar.Root>
      ))}
    </div>
  ),
};

export const LabelBottomFloating: Story = {
  name: 'Label: Bottom Floating',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      {[20, 60, 100].map((value) => (
        <ProgressBar.Root
          key={value}
          value={value}
          minValue={0}
          maxValue={100}
          labelPosition="bottom-floating"
          aria-label="Upload progress"
        >
          <ProgressBar.Header>
            <ProgressBar.Value>{value}%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track>
            <ProgressBar.Indicator value={value} />
          </ProgressBar.Track>
        </ProgressBar.Root>
      ))}
    </div>
  ),
};

function AnimatedFloatingBar({
  labelPosition,
}: {
  labelPosition: 'top-floating' | 'bottom-floating';
}) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    setValue(0);
    const interval = setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          clearInterval(interval);
          return 100;
        }
        return v + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [labelPosition]);

  return (
    <ProgressBar.Root
      value={value}
      minValue={0}
      maxValue={100}
      labelPosition={labelPosition}
      aria-label="Upload progress"
    >
      <ProgressBar.Header>
        <ProgressBar.Value>{value}%</ProgressBar.Value>
      </ProgressBar.Header>
      <ProgressBar.Track>
        <ProgressBar.Indicator value={value} />
      </ProgressBar.Track>
    </ProgressBar.Root>
  );
}

export const AnimatedTopFloating: Story = {
  name: 'Animated: Top Floating',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      <AnimatedFloatingBar labelPosition="top-floating" />
    </div>
  ),
};

export const AnimatedBottomFloating: Story = {
  name: 'Animated: Bottom Floating',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      <AnimatedFloatingBar labelPosition="bottom-floating" />
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const positions = ['top', 'right', 'bottom', 'top-floating', 'bottom-floating'] as const;
    const values = [0, 50, 100];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', width: 400 }}>
        {positions.map((pos) => (
          <div
            key={pos}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}
          >
            <span className="story-label">labelPosition="{pos}"</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
              {values.map((v) => (
                <ProgressBar.Root key={v} value={v} minValue={0} maxValue={100} labelPosition={pos}>
                  <ProgressBar.Header>
                    <ProgressBar.Label>Progress</ProgressBar.Label>
                    <ProgressBar.Value>{v}%</ProgressBar.Value>
                  </ProgressBar.Header>
                  <ProgressBar.Track>
                    <ProgressBar.Indicator value={v} />
                  </ProgressBar.Track>
                </ProgressBar.Root>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>
          <span className="story-label">Indeterminate</span>
          <ProgressBar.Root isIndeterminate minValue={0} maxValue={100}>
            <ProgressBar.Label>Loading...</ProgressBar.Label>
            <ProgressBar.Track>
              <ProgressBar.Indicator />
            </ProgressBar.Track>
          </ProgressBar.Root>
        </div>
      </div>
    );
  },
};
