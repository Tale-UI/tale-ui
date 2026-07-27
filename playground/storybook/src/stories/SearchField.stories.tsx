import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchField } from '@tale-ui/react/search-field';
import { Icon } from '@tale-ui/react/icon';
import { X } from 'lucide-react';

type Args = {
  isDisabled?: boolean;
  placeholder?: string;
  variant: 'default' | 'inline';
  defaultValue: string;
};

const meta: Meta<Args> = {
  title: 'Components/SearchField',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    variant: {
      control: 'inline-radio',
      options: ['default', 'inline'],
    },
    defaultValue: { control: 'text' },
  },
  args: {
    isDisabled: false,
    placeholder: 'Search...',
    variant: 'default',
    defaultValue: '',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <SearchField.Root
      key={args.defaultValue}
      isDisabled={args.isDisabled}
      variant={args.variant}
      defaultValue={args.defaultValue}
    >
      <SearchField.Input placeholder={args.placeholder} />
    </SearchField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <SearchField.Root {...args}>
      <SearchField.Label>Search</SearchField.Label>
      <SearchField.Input placeholder={args.placeholder} />
    </SearchField.Root>
  ),
};

export const WithClearButton: Story = {
  render: (args) => (
    <SearchField.Root defaultValue="React" {...args}>
      <SearchField.Label>Search</SearchField.Label>
      <SearchField.Input placeholder={args.placeholder} />
      <SearchField.ClearButton>
        <Icon icon={X} size="sm" />
      </SearchField.ClearButton>
    </SearchField.Root>
  ),
};

export const Inline: Story = {
  render: (args) => (
    <SearchField.Root variant="inline" {...args}>
      <SearchField.Label>Search documentation</SearchField.Label>
      <SearchField.Input placeholder={args.placeholder} />
    </SearchField.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ width: 240 }}>
          <div className="story-heading">Default</div>
          <SearchField.Root>
            <SearchField.Label>Search</SearchField.Label>
            <SearchField.Input placeholder="Search..." />
          </SearchField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">With clear button</div>
          <SearchField.Root defaultValue="React">
            <SearchField.Label>Search</SearchField.Label>
            <SearchField.Input placeholder="Search..." />
            <SearchField.ClearButton>
              <Icon icon={X} size="sm" />
            </SearchField.ClearButton>
          </SearchField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Inline</div>
          <SearchField.Root variant="inline" defaultValue="Keyboard">
            <SearchField.Label>Search documentation</SearchField.Label>
            <SearchField.Input placeholder="Search..." />
            <SearchField.ClearButton>
              <Icon icon={X} size="sm" />
            </SearchField.ClearButton>
          </SearchField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Disabled</div>
          <SearchField.Root isDisabled>
            <SearchField.Label>Search</SearchField.Label>
            <SearchField.Input placeholder="Disabled" />
          </SearchField.Root>
        </div>
      </div>
    );
  },
};
