import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Field } from '@tale-ui/react/field';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

type Args = {
  isDisabled?: boolean;
  size?: 'sm' | 'md';
  label: string;
  description: string;
  orientation: 'horizontal' | 'vertical';
};

const meta: Meta<Args> = {
  title: 'Components/CheckboxGroup',
  argTypes: {
    isDisabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    label: { control: 'text' },
    description: { control: 'text' },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    isDisabled: false,
    size: 'md',
    label: 'Favorite fruits',
    description: 'Choose one or more fruits.',
    orientation: 'vertical',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <CheckboxGroup
      label={args.label}
      description={args.description}
      orientation={args.orientation}
      isDisabled={args.isDisabled}
      size={args.size}
    >
      <Checkbox.Root value="apple">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Apple
      </Checkbox.Root>
      <Checkbox.Root value="banana">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Banana
      </Checkbox.Root>
      <Checkbox.Root value="cherry">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Cherry
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <CheckboxGroup label="Disabled group" isDisabled={args.isDisabled} size={args.size}>
      <Checkbox.Root value="apple">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Apple
      </Checkbox.Root>
      <Checkbox.Root value="banana">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Banana
      </Checkbox.Root>
      <Checkbox.Root value="cherry">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Cherry
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <CheckboxGroup label="Notification preferences" isDisabled={args.isDisabled} size={args.size}>
      <Field.Description>Select how you would like to be notified.</Field.Description>
      <Checkbox.Root value="email">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Email
      </Checkbox.Root>
      <Checkbox.Root value="sms">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        SMS
      </Checkbox.Root>
      <Checkbox.Root value="push">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Push notification
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <CheckboxGroup
      label="Pick toppings"
      isDisabled={args.isDisabled}
      size={args.size}
      className="story-checkbox-horizontal"
    >
      <Checkbox.Root value="cheese">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Cheese
      </Checkbox.Root>
      <Checkbox.Root value="pepperoni">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Pepperoni
      </Checkbox.Root>
      <Checkbox.Root value="mushrooms">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Mushrooms
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md'] as const;
    return (
      <div className="story-sections">
        {sizes.map((size) => (
          <div key={size}>
            <div className="story-heading">Size: {size}</div>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <CheckboxGroup label="Default" size={size}>
                <Checkbox.Root value="a">
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  Apple
                </Checkbox.Root>
                <Checkbox.Root value="b">
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  Banana
                </Checkbox.Root>
              </CheckboxGroup>
              <CheckboxGroup label="Disabled" size={size} isDisabled>
                <Checkbox.Root value="a">
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  Apple
                </Checkbox.Root>
                <Checkbox.Root value="b">
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  Banana
                </Checkbox.Root>
              </CheckboxGroup>
              <CheckboxGroup label="With description" size={size}>
                <Field.Description>Pick your favorites.</Field.Description>
                <Checkbox.Root value="a">
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  Apple
                </Checkbox.Root>
                <Checkbox.Root value="b">
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  Banana
                </Checkbox.Root>
              </CheckboxGroup>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
