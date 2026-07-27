import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxField } from '@tale-ui/react/checkbox-field';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

type Args = {
  isSelected: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  isRequired: boolean;
  size: 'sm' | 'md';
};

const meta: Meta<Args> = {
  title: 'Components/CheckboxField',
  args: {
    isSelected: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
    size: 'md',
  },
  argTypes: {
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <CheckboxField.Root
      key={String(args.isSelected)}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      isRequired={args.isRequired}
      size={args.size}
    >
      <CheckboxField.Button>
        <CheckboxField.Indicator>
          <Icon icon={Check} size="sm" />
        </CheckboxField.Indicator>
        Accept terms and conditions
      </CheckboxField.Button>
      <CheckboxField.Description>You can withdraw consent at any time.</CheckboxField.Description>
    </CheckboxField.Root>
  ),
};

export const WithError: Story = {
  args: { isInvalid: true },
  render: (args) => (
    <CheckboxField.Root isInvalid={args.isInvalid} isRequired>
      <CheckboxField.Button>
        <CheckboxField.Indicator>
          <Icon icon={Check} size="sm" />
        </CheckboxField.Indicator>
        Accept terms and conditions
      </CheckboxField.Button>
      <CheckboxField.Error>You must accept the terms to continue.</CheckboxField.Error>
    </CheckboxField.Root>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <CheckboxField.Root isDisabled={args.isDisabled}>
      <CheckboxField.Button>
        <CheckboxField.Indicator>
          <Icon icon={Check} size="sm" />
        </CheckboxField.Indicator>
        Disabled option
      </CheckboxField.Button>
    </CheckboxField.Root>
  ),
};
