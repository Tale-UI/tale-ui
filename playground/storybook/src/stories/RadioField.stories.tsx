import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioField } from '@tale-ui/react/radio-field';
import { RadioGroup } from '@tale-ui/react/radio-group';

type Args = {
  isDisabled: boolean;
  isInvalid: boolean;
  size: 'sm' | 'md';
  value: string;
};

const meta: Meta<Args> = {
  title: 'Components/RadioField',
  args: {
    isDisabled: false,
    isInvalid: false,
    size: 'md',
    value: 'free',
  },
  argTypes: {
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    value: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup
      label="Subscription plan"
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      size={args.size}
    >
      <RadioField.Root value={args.value}>
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Free
        </RadioField.Button>
      </RadioField.Root>
      <RadioField.Root value="pro">
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Pro
        </RadioField.Button>
        <RadioField.Description>Unlimited projects and priority support.</RadioField.Description>
      </RadioField.Root>
      <RadioField.Root value="enterprise">
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Enterprise
        </RadioField.Button>
      </RadioField.Root>
    </RadioGroup>
  ),
};

export const WithError: Story = {
  args: { isInvalid: true },
  render: (args) => (
    <RadioGroup label="Subscription plan" isInvalid={args.isInvalid} isRequired>
      <RadioField.Root value="free">
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Free
        </RadioField.Button>
      </RadioField.Root>
      <RadioField.Root value="pro">
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Pro
        </RadioField.Button>
        <RadioField.Error>Please choose a plan to continue.</RadioField.Error>
      </RadioField.Root>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <RadioGroup label="Disabled group" isDisabled={args.isDisabled}>
      <RadioField.Root value="free">
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Free
        </RadioField.Button>
      </RadioField.Root>
      <RadioField.Root value="pro">
        <RadioField.Button>
          <RadioField.Indicator>
            <RadioField.Dot />
          </RadioField.Indicator>
          Pro
        </RadioField.Button>
      </RadioField.Root>
    </RadioGroup>
  ),
};
