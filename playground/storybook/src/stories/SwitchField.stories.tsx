import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchField } from '@tale-ui/react/switch-field';

type Args = {
  isSelected: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  isRequired: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/SwitchField',
  args: {
    isSelected: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
  argTypes: {
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <SwitchField.Root
      key={String(args.isSelected)}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      isRequired={args.isRequired}
    >
      <SwitchField.Button>
        <SwitchField.Thumb />
        Enable notifications
      </SwitchField.Button>
      <SwitchField.Description>We'll send you updates about your account.</SwitchField.Description>
    </SwitchField.Root>
  ),
};

export const WithError: Story = {
  args: { isInvalid: true },
  render: (args) => (
    <SwitchField.Root isInvalid={args.isInvalid} isRequired>
      <SwitchField.Button>
        <SwitchField.Thumb />
        Accept usage analytics
      </SwitchField.Button>
      <SwitchField.Error>You must enable analytics to continue.</SwitchField.Error>
    </SwitchField.Root>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <SwitchField.Root isDisabled={args.isDisabled}>
      <SwitchField.Button>
        <SwitchField.Thumb />
        Disabled option
      </SwitchField.Button>
    </SwitchField.Root>
  ),
};
