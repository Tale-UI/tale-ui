import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Selection } from 'react-aria-components';
import { MultiSelect } from '@tale-ui/react/multi-select';

const frameworks = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'solid', name: 'SolidJS' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'nuxt', name: 'Nuxt' },
  { id: 'remix', name: 'Remix' },
];

const meta: Meta<typeof MultiSelect.Root> = {
  title: 'Form Controls/MultiSelect',
  component: MultiSelect.Root,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    showSearch: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    supportingText: { control: 'text' },
    emptyStateTitle: { control: 'text' },
    emptyStateDescription: { control: 'text' },
    items: { control: false },
    selectedKeys: { control: false },
    defaultSelectedKeys: { control: false },
    selectedCountFormatter: { control: false },
    onSelectionChange: { control: false },
    onReset: { control: false },
    onSelectAll: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof MultiSelect.Root>;

function MultiSelectDemo(args: Partial<React.ComponentProps<typeof MultiSelect.Root>>) {
  const [selected, setSelected] = React.useState<Selection>(new Set(['react', 'vue']));
  return (
    <div style={{ width: '20rem' }}>
      <MultiSelect.Root
        label="Frameworks"
        placeholder="Select frameworks"
        items={frameworks}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        onReset={() => setSelected(new Set())}
        onSelectAll={() => setSelected(new Set(frameworks.map((f) => f.id)))}
        {...args}
      >
        {(item) => (
          <MultiSelect.Item id={item.id} textValue={item.name}>
            {item.name}
          </MultiSelect.Item>
        )}
      </MultiSelect.Root>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <MultiSelectDemo {...args} />,
  args: {
    size: 'md',
    label: 'Frameworks',
    placeholder: 'Select frameworks',
    description: 'Choose the frameworks used by this project.',
    errorMessage: 'Select at least one framework.',
    supportingText: 'frameworks',
    emptyStateTitle: 'No frameworks found',
    emptyStateDescription: 'Try a different search.',
    showSearch: true,
    showFooter: true,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export const NoSearch: Story = {
  render: (args) => <MultiSelectDemo {...args} />,
  args: { showSearch: false },
};

export const NoFooter: Story = {
  render: (args) => <MultiSelectDemo {...args} />,
  args: { showFooter: false },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '20rem' }}>
      <MultiSelectDemo size="sm" label="Small" />
      <MultiSelectDemo size="md" label="Medium" />
      <MultiSelectDemo size="lg" label="Large" />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => <MultiSelectDemo {...args} />,
  args: {
    isInvalid: true,
    isRequired: true,
    errorMessage: 'Please select at least one option.',
  },
};

export const Disabled: Story = {
  render: (args) => <MultiSelectDemo {...args} />,
  args: { isDisabled: true },
};
