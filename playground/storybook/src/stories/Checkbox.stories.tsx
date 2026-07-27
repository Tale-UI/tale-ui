import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Icon } from '@tale-ui/react/icon';
import { Check, Minus } from 'lucide-react';

type Args = {
  defaultSelected: boolean;
  isDisabled: boolean;
  isIndeterminate: boolean;
  size: 'sm' | 'md';
};

const meta: Meta<Args> = {
  title: 'Components/Checkbox',
  args: {
    defaultSelected: false,
    isDisabled: false,
    isIndeterminate: false,
    size: 'md',
  },
  argTypes: {
    defaultSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Checkbox.Root
      key={`${args.defaultSelected}-${args.isIndeterminate}`}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Accept terms and conditions
    </Checkbox.Root>
  ),
};

export const Checked: Story = {
  args: {
    defaultSelected: true,
    isDisabled: false,
    isIndeterminate: false,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.defaultSelected}-${args.isIndeterminate}`}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Checked by default
    </Checkbox.Root>
  ),
};

export const Disabled: Story = {
  args: {
    defaultSelected: false,
    isDisabled: true,
    isIndeterminate: false,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.defaultSelected}-${args.isIndeterminate}`}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Disabled checkbox
    </Checkbox.Root>
  ),
};

export const DisabledChecked: Story = {
  args: {
    defaultSelected: true,
    isDisabled: true,
    isIndeterminate: false,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.defaultSelected}-${args.isIndeterminate}`}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Disabled and checked
    </Checkbox.Root>
  ),
};

export const Indeterminate: Story = {
  args: {
    defaultSelected: false,
    isDisabled: false,
    isIndeterminate: true,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.defaultSelected}-${args.isIndeterminate}`}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Minus} size="sm" />
      </Checkbox.Indicator>
      Indeterminate state
    </Checkbox.Root>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-checkbox-grid">
      <Checkbox.Root size="sm" defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Small
      </Checkbox.Root>

      <Checkbox.Root size="md" defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Medium (default)
      </Checkbox.Root>
    </div>
  ),
};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-checkbox-grid">
      <Checkbox.Root>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Unchecked
      </Checkbox.Root>

      <Checkbox.Root defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Checked
      </Checkbox.Root>

      <Checkbox.Root isIndeterminate>
        <Checkbox.Indicator>
          <Icon icon={Minus} size="sm" />
        </Checkbox.Indicator>
        Indeterminate
      </Checkbox.Root>

      <Checkbox.Root isDisabled>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Disabled
      </Checkbox.Root>

      <Checkbox.Root isDisabled defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Disabled + Checked
      </Checkbox.Root>

      <Checkbox.Root isDisabled isIndeterminate>
        <Checkbox.Indicator>
          <Icon icon={Minus} size="sm" />
        </Checkbox.Indicator>
        Disabled + Indeterminate
      </Checkbox.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md'] as const;
    const states = [
      { label: 'Unchecked', props: {} },
      { label: 'Checked', props: { defaultSelected: true } },
      { label: 'Indeterminate', props: { isIndeterminate: true } },
      { label: 'Disabled', props: { isDisabled: true } },
      { label: 'Disabled + Checked', props: { isDisabled: true, defaultSelected: true } },
      { label: 'Disabled + Indeterminate', props: { isDisabled: true, isIndeterminate: true } },
    ] as const;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${sizes.length}, auto)`,
          gap: '0.5rem 1rem',
          alignItems: 'center',
        }}
      >
        <div />
        {sizes.map((s) => (
          <div key={s} className="story-label">
            {s}
          </div>
        ))}
        {states.map((state) => (
          <React.Fragment>
            <div key={`label-${state.label}`} className="story-label">
              {state.label}
            </div>
            {sizes.map((s) => (
              <Checkbox.Root key={`${state.label}-${s}`} size={s} {...state.props}>
                <Checkbox.Indicator>
                  <Icon icon={state.label.includes('Indeterminate') ? Minus : Check} size="sm" />
                </Checkbox.Indicator>
                {state.label}
              </Checkbox.Root>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
