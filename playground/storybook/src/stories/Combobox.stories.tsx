import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from '@tale-ui/react/combobox';

type Args = {
  label: string;
  isDisabled?: boolean;
  size?: 'sm' | 'md';
  selectionMode: 'single' | 'multiple';
  inputValue: string;
  selectedKey: string | null;
};

const meta: Meta<Args> = {
  title: 'Components/Combobox',
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
      options: ['sm', 'md'],
    },
    selectionMode: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
    },
    inputValue: { control: 'text' },
    selectedKey: {
      control: 'select',
      options: [null, 'apple', 'banana', 'cherry', 'grape', 'orange'],
    },
  },
  args: {
    label: 'Favorite fruit',
    isDisabled: false,
    size: 'md',
    selectionMode: 'single',
    inputValue: '',
    selectedKey: null,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Combobox.Root
      isDisabled={args.isDisabled}
      size={args.size}
      selectionMode={args.selectionMode}
      inputValue={args.inputValue}
      onInputChange={() => {}}
      selectedKey={args.selectedKey}
      onSelectionChange={() => {}}
    >
      <Combobox.Label>{args.label}</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover offset={4}>
        <Combobox.ListBox>
          <Combobox.Item id="apple" textValue="Apple">
            Apple
          </Combobox.Item>
          <Combobox.Item id="banana" textValue="Banana">
            Banana
          </Combobox.Item>
          <Combobox.Item id="cherry" textValue="Cherry">
            Cherry
          </Combobox.Item>
          <Combobox.Item id="grape" textValue="Grape">
            Grape
          </Combobox.Item>
          <Combobox.Item id="orange" textValue="Orange">
            Orange
          </Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled} size={args.size}>
      <Combobox.Label>Favorite fruit</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover offset={4}>
        <Combobox.ListBox>
          <Combobox.Item id="apple" textValue="Apple">
            Apple
          </Combobox.Item>
          <Combobox.Item id="banana" textValue="Banana">
            Banana
          </Combobox.Item>
          <Combobox.Item id="cherry" textValue="Cherry">
            Cherry
          </Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const WithInputGroup: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled} size={args.size}>
      <Combobox.Label>Search countries</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to search…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover offset={4}>
        <Combobox.ListBox>
          <Combobox.Item id="us" textValue="United States">
            United States
          </Combobox.Item>
          <Combobox.Item id="ca" textValue="Canada">
            Canada
          </Combobox.Item>
          <Combobox.Item id="mx" textValue="Mexico">
            Mexico
          </Combobox.Item>
          <Combobox.Item id="br" textValue="Brazil">
            Brazil
          </Combobox.Item>
          <Combobox.Item id="uk" textValue="United Kingdom">
            United Kingdom
          </Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled} size={args.size}>
      <Combobox.Label>Food</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Search food…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover offset={4}>
        <Combobox.ListBox>
          <Combobox.Section>
            <Combobox.Header>Fruits</Combobox.Header>
            <Combobox.Item id="apple" textValue="Apple">
              Apple
            </Combobox.Item>
            <Combobox.Item id="banana" textValue="Banana">
              Banana
            </Combobox.Item>
            <Combobox.Item id="cherry" textValue="Cherry">
              Cherry
            </Combobox.Item>
          </Combobox.Section>
          <Combobox.Section>
            <Combobox.Header>Vegetables</Combobox.Header>
            <Combobox.Item id="carrot" textValue="Carrot">
              Carrot
            </Combobox.Item>
            <Combobox.Item id="broccoli" textValue="Broccoli">
              Broccoli
            </Combobox.Item>
            <Combobox.Item id="spinach" textValue="Spinach">
              Spinach
            </Combobox.Item>
          </Combobox.Section>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled} size={args.size}>
      <Combobox.Label>Search (try typing something not in list)</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to filter…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover offset={4}>
        <Combobox.ListBox>
          <Combobox.Empty>No results found.</Combobox.Empty>
          <Combobox.Item id="apple" textValue="Apple">
            Apple
          </Combobox.Item>
          <Combobox.Item id="banana" textValue="Banana">
            Banana
          </Combobox.Item>
          <Combobox.Item id="cherry" textValue="Cherry">
            Cherry
          </Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const MultiSelectChips: Story = {
  render: () => (
    <Combobox.Root>
      <Combobox.Label>Frameworks</Combobox.Label>
      <Combobox.Chips>
        <Combobox.Chip>
          React <Combobox.ChipRemove aria-label="Remove React" />
        </Combobox.Chip>
        <Combobox.Chip>
          Vue <Combobox.ChipRemove aria-label="Remove Vue" />
        </Combobox.Chip>
      </Combobox.Chips>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Add framework…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover offset={4}>
        <Combobox.ListBox>
          <Combobox.Item id="react" textValue="React">
            React
          </Combobox.Item>
          <Combobox.Item id="vue" textValue="Vue">
            Vue
          </Combobox.Item>
          <Combobox.Item id="angular" textValue="Angular">
            Angular
          </Combobox.Item>
          <Combobox.Item id="svelte" textValue="Svelte">
            Svelte
          </Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ width: 260 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Default
          </div>
          <Combobox.Root>
            <Combobox.Label>Fruit</Combobox.Label>
            <Combobox.InputGroup>
              <Combobox.Input placeholder="Select…" />
              <Combobox.Trigger />
            </Combobox.InputGroup>
            <Combobox.Popover offset={4}>
              <Combobox.ListBox>
                <Combobox.Item id="av-apple" textValue="Apple">
                  Apple
                </Combobox.Item>
                <Combobox.Item id="av-banana" textValue="Banana">
                  Banana
                </Combobox.Item>
              </Combobox.ListBox>
            </Combobox.Popover>
          </Combobox.Root>
        </div>
        <div style={{ width: 260 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Disabled
          </div>
          <Combobox.Root isDisabled>
            <Combobox.Label>Fruit</Combobox.Label>
            <Combobox.InputGroup>
              <Combobox.Input placeholder="Disabled" />
              <Combobox.Trigger />
            </Combobox.InputGroup>
            <Combobox.Popover offset={4}>
              <Combobox.ListBox>
                <Combobox.Item id="av-dis-apple" textValue="Apple">
                  Apple
                </Combobox.Item>
              </Combobox.ListBox>
            </Combobox.Popover>
          </Combobox.Root>
        </div>
        <div style={{ width: 260 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            With sections
          </div>
          <Combobox.Root>
            <Combobox.Label>Food</Combobox.Label>
            <Combobox.InputGroup>
              <Combobox.Input placeholder="Search…" />
              <Combobox.Trigger />
            </Combobox.InputGroup>
            <Combobox.Popover offset={4}>
              <Combobox.ListBox>
                <Combobox.Section>
                  <Combobox.Header>Fruits</Combobox.Header>
                  <Combobox.Item id="av-s-apple" textValue="Apple">
                    Apple
                  </Combobox.Item>
                </Combobox.Section>
                <Combobox.Section>
                  <Combobox.Header>Vegetables</Combobox.Header>
                  <Combobox.Item id="av-s-carrot" textValue="Carrot">
                    Carrot
                  </Combobox.Item>
                </Combobox.Section>
              </Combobox.ListBox>
            </Combobox.Popover>
          </Combobox.Root>
        </div>
        <div style={{ width: 260 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            With chips
          </div>
          <Combobox.Root>
            <Combobox.Label>Frameworks</Combobox.Label>
            <Combobox.Chips>
              <Combobox.Chip>
                React <Combobox.ChipRemove aria-label="Remove" />
              </Combobox.Chip>
            </Combobox.Chips>
            <Combobox.InputGroup>
              <Combobox.Input placeholder="Add…" />
              <Combobox.Trigger />
            </Combobox.InputGroup>
            <Combobox.Popover offset={4}>
              <Combobox.ListBox>
                <Combobox.Item id="av-m-react" textValue="React">
                  React
                </Combobox.Item>
                <Combobox.Item id="av-m-vue" textValue="Vue">
                  Vue
                </Combobox.Item>
              </Combobox.ListBox>
            </Combobox.Popover>
          </Combobox.Root>
        </div>
      </div>
    );
  },
};
