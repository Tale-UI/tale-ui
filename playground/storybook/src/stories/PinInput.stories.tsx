import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PinInput } from '@tale-ui/react/pin-input';

type Args = {
  'aria-label': string;
  maxLength: number;
  disabled: boolean;
  value: string;
};

const meta: Meta<Args> = {
  title: 'Components/PinInput',
  parameters: { layout: 'centered' },
  argTypes: {
    'aria-label': { control: 'text' },
    maxLength: { control: 'number' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
  },
  args: {
    'aria-label': 'Verification code',
    maxLength: 6,
    disabled: false,
    value: '',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <PinInput.Root
        maxLength={args.maxLength}
        disabled={args.disabled}
        value={args.value}
        onChange={() => {}}
        aria-label={args['aria-label']}
      >
        <PinInput.Group>
          {Array.from({ length: args.maxLength }, (_, i) => (
            <PinInput.Slot key={i} index={i} />
          ))}
        </PinInput.Group>
      </PinInput.Root>
    );
  },
};

export const WithSeparator: Story = {
  render() {
    return (
      <PinInput.Root maxLength={6}>
        <PinInput.Group>
          <PinInput.Slot index={0} />
          <PinInput.Slot index={1} />
          <PinInput.Slot index={2} />
        </PinInput.Group>
        <PinInput.Separator />
        <PinInput.Group>
          <PinInput.Slot index={3} />
          <PinInput.Slot index={4} />
          <PinInput.Slot index={5} />
        </PinInput.Group>
      </PinInput.Root>
    );
  },
};

export const FourDigit: Story = {
  render() {
    return (
      <PinInput.Root maxLength={4}>
        <PinInput.Group>
          <PinInput.Slot index={0} />
          <PinInput.Slot index={1} />
          <PinInput.Slot index={2} />
          <PinInput.Slot index={3} />
        </PinInput.Group>
      </PinInput.Root>
    );
  },
};

export const Disabled: Story = {
  render() {
    return (
      <PinInput.Root maxLength={4} disabled>
        <PinInput.Group>
          <PinInput.Slot index={0} />
          <PinInput.Slot index={1} />
          <PinInput.Slot index={2} />
          <PinInput.Slot index={3} />
        </PinInput.Group>
      </PinInput.Root>
    );
  },
};

export const Controlled: Story = {
  render() {
    const [value, setValue] = React.useState('');
    return (
      <div>
        <PinInput.Root maxLength={6} value={value} onChange={setValue}>
          <PinInput.Group>
            <PinInput.Slot index={0} />
            <PinInput.Slot index={1} />
            <PinInput.Slot index={2} />
            <PinInput.Slot index={3} />
            <PinInput.Slot index={4} />
            <PinInput.Slot index={5} />
          </PinInput.Group>
        </PinInput.Root>
        <p style={{ marginTop: 'var(--space-xs)', color: 'var(--neutral-60)' }}>
          Value: {value || '(empty)'}
        </p>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div className="story-heading">4-digit</div>
          <PinInput.Root maxLength={4}>
            <PinInput.Group>
              {[0, 1, 2, 3].map((i) => (
                <PinInput.Slot key={i} index={i} />
              ))}
            </PinInput.Group>
          </PinInput.Root>
        </div>
        <div>
          <div className="story-heading">6-digit</div>
          <PinInput.Root maxLength={6}>
            <PinInput.Group>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <PinInput.Slot key={i} index={i} />
              ))}
            </PinInput.Group>
          </PinInput.Root>
        </div>
        <div>
          <div className="story-heading">6-digit with separator</div>
          <PinInput.Root maxLength={6}>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
            </PinInput.Group>
            <PinInput.Separator />
            <PinInput.Group>
              <PinInput.Slot index={3} />
              <PinInput.Slot index={4} />
              <PinInput.Slot index={5} />
            </PinInput.Group>
          </PinInput.Root>
        </div>
        <div>
          <div className="story-heading">Disabled</div>
          <PinInput.Root maxLength={4} disabled>
            <PinInput.Group>
              {[0, 1, 2, 3].map((i) => (
                <PinInput.Slot key={i} index={i} />
              ))}
            </PinInput.Group>
          </PinInput.Root>
        </div>
      </div>
    );
  },
};
