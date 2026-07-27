import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@tale-ui/react/select';

type Args = {
  label: string;
  isDisabled?: boolean;
  size: 'sm' | 'md' | 'lg';
  placeholder: string;
  defaultSelectedKey: string | null;
};

const meta: Meta<Args> = {
  title: 'Components/Select',
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    isDisabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    placeholder: { control: 'text' },
    defaultSelectedKey: {
      control: 'select',
      options: [null, 'apple', 'banana', 'cherry', 'grape', 'orange'],
    },
  },
  args: {
    label: 'Favorite fruit',
    isDisabled: false,
    size: 'md',
    placeholder: 'Select a fruit…',
    defaultSelectedKey: 'apple',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Select.Root
      key={String(args.defaultSelectedKey)}
      isDisabled={args.isDisabled}
      size={args.size}
      placeholder={args.placeholder}
      defaultSelectedKey={args.defaultSelectedKey}
    >
      <Select.Label>{args.label}</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">
            Apple
          </Select.Item>
          <Select.Item id="banana" textValue="Banana">
            Banana
          </Select.Item>
          <Select.Item id="cherry" textValue="Cherry">
            Cherry
          </Select.Item>
          <Select.Item id="grape" textValue="Grape">
            Grape
          </Select.Item>
          <Select.Item id="orange" textValue="Orange">
            Orange
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} size={args.size} placeholder="Choose one…">
      <Select.Label>Favorite fruit</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">
            Apple
          </Select.Item>
          <Select.Item id="banana" textValue="Banana">
            Banana
          </Select.Item>
          <Select.Item id="cherry" textValue="Cherry">
            Cherry
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const WithGroups: Story = {
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} size={args.size} placeholder="Select a food…">
      <Select.Label>Food</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Section>
            <Select.Header>Fruits</Select.Header>
            <Select.Item id="apple" textValue="Apple">
              Apple
            </Select.Item>
            <Select.Item id="banana" textValue="Banana">
              Banana
            </Select.Item>
            <Select.Item id="cherry" textValue="Cherry">
              Cherry
            </Select.Item>
          </Select.Section>
          <Select.Section>
            <Select.Header>Vegetables</Select.Header>
            <Select.Item id="carrot" textValue="Carrot">
              Carrot
            </Select.Item>
            <Select.Item id="broccoli" textValue="Broccoli">
              Broccoli
            </Select.Item>
            <Select.Item id="spinach" textValue="Spinach">
              Spinach
            </Select.Item>
          </Select.Section>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} size={args.size} placeholder="Select…">
      <Select.Label>Available options</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">
            Apple
          </Select.Item>
          <Select.Item id="banana" textValue="Banana" isDisabled>
            Banana (sold out)
          </Select.Item>
          <Select.Item id="cherry" textValue="Cherry">
            Cherry
          </Select.Item>
          <Select.Item id="grape" textValue="Grape" isDisabled>
            Grape (sold out)
          </Select.Item>
          <Select.Item id="orange" textValue="Orange">
            Orange
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} size={args.size} placeholder="Cannot select…">
      <Select.Label>Disabled select</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">
            Apple
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select.Root
          key={size}
          size={size}
          isDisabled={args.isDisabled}
          placeholder={`Size: ${size}`}
        >
          <Select.Label>{size.toUpperCase()}</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id={`${size}-apple`} textValue="Apple">
                Apple
              </Select.Item>
              <Select.Item id={`${size}-banana`} textValue="Banana">
                Banana
              </Select.Item>
              <Select.Item id={`${size}-cherry`} textValue="Cherry">
                Cherry
              </Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      ))}
    </div>
  ),
};

export const LongSelectedValue: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '13.75rem' }}>
      <Select.Root defaultSelectedKey="enterprise" placeholder="Select a plan…">
        <Select.Label>Plan</Select.Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox>
            <Select.Item id="basic" textValue="Basic">
              Basic
            </Select.Item>
            <Select.Item
              id="enterprise"
              textValue="Enterprise compliance plan with dedicated support"
            >
              Enterprise compliance plan with dedicated support
            </Select.Item>
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div className="story-sections">
        <div>
          <div className="story-heading">Sizes</div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {sizes.map((size) => (
              <Select.Root key={size} size={size} placeholder={`Size: ${size}`}>
                <Select.Label>{size}</Select.Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popover>
                  <Select.ListBox>
                    <Select.Item id={`${size}-a`} textValue="Apple">
                      Apple
                    </Select.Item>
                    <Select.Item id={`${size}-b`} textValue="Banana">
                      Banana
                    </Select.Item>
                  </Select.ListBox>
                </Select.Popover>
              </Select.Root>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">Disabled</div>
          <Select.Root isDisabled placeholder="Disabled">
            <Select.Label>Disabled</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popover>
              <Select.ListBox>
                <Select.Item id="dis-a" textValue="Apple">
                  Apple
                </Select.Item>
              </Select.ListBox>
            </Select.Popover>
          </Select.Root>
        </div>
        <div>
          <div className="story-heading">With sections</div>
          <Select.Root placeholder="Select food…">
            <Select.Label>Food</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popover>
              <Select.ListBox>
                <Select.Section>
                  <Select.Header>Fruits</Select.Header>
                  <Select.Item id="sec-apple" textValue="Apple">
                    Apple
                  </Select.Item>
                  <Select.Item id="sec-banana" textValue="Banana">
                    Banana
                  </Select.Item>
                </Select.Section>
                <Select.Section>
                  <Select.Header>Vegetables</Select.Header>
                  <Select.Item id="sec-carrot" textValue="Carrot">
                    Carrot
                  </Select.Item>
                  <Select.Item id="sec-broccoli" textValue="Broccoli">
                    Broccoli
                  </Select.Item>
                </Select.Section>
              </Select.ListBox>
            </Select.Popover>
          </Select.Root>
        </div>
      </div>
    );
  },
};
