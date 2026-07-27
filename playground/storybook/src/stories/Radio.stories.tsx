import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@tale-ui/react/radio';

type Args = {
  isDisabled?: boolean;
  size: 'sm' | 'md';
  value: string;
};

const meta: Meta<Args> = {
  title: 'Components/Radio',
  argTypes: {
    isDisabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    value: { control: 'text' },
  },
  args: {
    isDisabled: false,
    size: 'md',
    value: 'red',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Radio.Group label="Favorite color" isDisabled={args.isDisabled} size={args.size}>
      <Radio.Root value={args.value}>
        <Radio.Indicator />
        Red
      </Radio.Root>
      <Radio.Root value="green">
        <Radio.Indicator />
        Green
      </Radio.Root>
      <Radio.Root value="blue">
        <Radio.Indicator />
        Blue
      </Radio.Root>
    </Radio.Group>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <Radio.Group label="Disabled group" isDisabled={args.isDisabled} size={args.size}>
      <Radio.Root value="red">
        <Radio.Indicator />
        Red
      </Radio.Root>
      <Radio.Root value="green">
        <Radio.Indicator />
        Green
      </Radio.Root>
      <Radio.Root value="blue">
        <Radio.Indicator />
        Blue
      </Radio.Root>
    </Radio.Group>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <Radio.Group
      label="Plan"
      orientation="horizontal"
      isDisabled={args.isDisabled}
      size={args.size}
    >
      <Radio.Root value="free">
        <Radio.Indicator />
        Free
      </Radio.Root>
      <Radio.Root value="pro">
        <Radio.Indicator />
        Pro
      </Radio.Root>
      <Radio.Root value="enterprise">
        <Radio.Indicator />
        Enterprise
      </Radio.Root>
    </Radio.Group>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--l">
      <Radio.Group label="Small radios">
        <Radio.Root value="a" size="sm">
          <Radio.Indicator />
          Small option A
        </Radio.Root>
        <Radio.Root value="b" size="sm">
          <Radio.Indicator />
          Small option B
        </Radio.Root>
      </Radio.Group>

      <Radio.Group label="Medium radios">
        <Radio.Root value="a" size="md">
          <Radio.Indicator />
          Medium option A
        </Radio.Root>
        <Radio.Root value="b" size="md">
          <Radio.Indicator />
          Medium option B
        </Radio.Root>
      </Radio.Group>
    </div>
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
              <Radio.Group label="Default" size={size}>
                <Radio.Root value="a">
                  <Radio.Indicator />
                  Option A
                </Radio.Root>
                <Radio.Root value="b">
                  <Radio.Indicator />
                  Option B
                </Radio.Root>
              </Radio.Group>
              <Radio.Group label="Disabled" size={size} isDisabled>
                <Radio.Root value="a">
                  <Radio.Indicator />
                  Option A
                </Radio.Root>
                <Radio.Root value="b">
                  <Radio.Indicator />
                  Option B
                </Radio.Root>
              </Radio.Group>
              <Radio.Group label="Horizontal" size={size} orientation="horizontal">
                <Radio.Root value="a">
                  <Radio.Indicator />
                  Option A
                </Radio.Root>
                <Radio.Root value="b">
                  <Radio.Indicator />
                  Option B
                </Radio.Root>
              </Radio.Group>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
