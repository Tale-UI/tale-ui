import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputTags } from '@tale-ui/react/input-tags';

const meta: Meta<typeof InputTags.Root> = {
  title: 'Form Controls/InputTags',
  component: InputTags.Root,
  parameters: { layout: 'padded' },
  argTypes: {
    tagPlacement: { control: 'radio', options: ['inline', 'below'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    allowDuplicates: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    defaultValue: { control: 'object' },
    maxTags: { control: { type: 'number', min: 1, step: 1 } },
    value: { control: false },
    validate: { control: false },
    onChange: { control: false },
    onTagAdded: { control: false },
    onTagRemoved: { control: false },
  },
  args: {
    tagPlacement: 'inline',
    size: 'md',
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
    allowDuplicates: false,
  },
};
export default meta;

type Story = StoryObj<typeof InputTags.Root>;

export const Default: Story = {
  args: {
    label: 'Skills',
    placeholder: 'Add a skill…',
    description: 'Press Enter to add each skill.',
    tagPlacement: 'inline',
    size: 'md',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Technologies',
    placeholder: 'Add a technology…',
    defaultValue: ['React', 'TypeScript', 'Tailwind CSS'],
    tagPlacement: 'inline',
  },
};

export const BelowPlacement: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag…',
    tagPlacement: 'below',
    defaultValue: ['design', 'ui', 'ux'],
    description: 'Tags appear below the input field.',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '22.5rem' }}>
      <InputTags.Root size="sm" label="Small" placeholder="Add tag…" />
      <InputTags.Root size="md" label="Medium" placeholder="Add tag…" />
      <InputTags.Root size="lg" label="Large" placeholder="Add tag…" />
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    label: 'Required skills',
    isInvalid: true,
    isRequired: true,
    errorMessage: 'At least one skill is required.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Skills',
    isDisabled: true,
    defaultValue: ['React', 'TypeScript'],
  },
};

export const WithValidation: Story = {
  args: {
    label: 'Hashtags',
    placeholder: '#tag',
    validate: (value: string) => value.startsWith('#') && value.length > 1,
    description: 'Each tag must start with #',
  },
};

export const MaxTags: Story = {
  args: {
    label: 'Up to 3 tags',
    maxTags: 3,
    description: 'Maximum 3 tags allowed.',
  },
};
