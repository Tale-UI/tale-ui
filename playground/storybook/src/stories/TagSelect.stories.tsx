import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Key } from 'react-aria-components';
import { TagSelect } from '@tale-ui/react/tag-select';

const people = [
  { id: 'alice', name: 'Alice Johnson' },
  { id: 'bob', name: 'Bob Smith' },
  { id: 'carol', name: 'Carol Davis' },
  { id: 'dave', name: 'Dave Wilson' },
  { id: 'eve', name: 'Eve Martinez' },
  { id: 'frank', name: 'Frank Lee' },
  { id: 'grace', name: 'Grace Kim' },
  { id: 'henry', name: 'Henry Brown' },
];

const meta: Meta<typeof TagSelect.Root> = {
  title: 'Form Controls/TagSelect',
  component: TagSelect.Root,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    items: { control: false },
    selectedKeys: { control: false },
    defaultSelectedKeys: { control: false },
    getItemLabel: { control: false },
    onSelectionChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof TagSelect.Root>;

function TagSelectDemo(args: Partial<React.ComponentProps<typeof TagSelect.Root>>) {
  const [selected, setSelected] = React.useState<Set<Key>>(new Set(['alice', 'bob']));
  return (
    <div style={{ width: '20rem' }}>
      <TagSelect.Root
        label="Team members"
        placeholder="Search members…"
        items={people}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        {...args}
      >
        {(person) => (
          <TagSelect.Item id={person.id} textValue={person.name}>
            {person.name}
          </TagSelect.Item>
        )}
      </TagSelect.Root>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <TagSelectDemo {...args} />,
  args: {
    size: 'md',
    label: 'Team members',
    placeholder: 'Search members…',
    description: 'Select everyone who should have access.',
    errorMessage: 'Select at least one team member.',
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export const Empty: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<Set<Key>>(new Set());
    return (
      <div style={{ width: '20rem' }}>
        <TagSelect.Root
          label="Team members"
          placeholder="Search members…"
          description="Select everyone who should have access."
          items={people}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          {...args}
        >
          {(person) => (
            <TagSelect.Item id={person.id} textValue={person.name}>
              {person.name}
            </TagSelect.Item>
          )}
        </TagSelect.Root>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '20rem' }}>
      <TagSelectDemo size="sm" label="Small" />
      <TagSelectDemo size="md" label="Medium" />
      <TagSelectDemo size="lg" label="Large" />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => <TagSelectDemo {...args} />,
  args: {
    isInvalid: true,
    isRequired: true,
    errorMessage: 'Please select at least one team member.',
  },
};

export const Disabled: Story = {
  render: (args) => <TagSelectDemo {...args} />,
  args: { isDisabled: true },
};
