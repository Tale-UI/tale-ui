import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { NumberField } from '@tale-ui/react/number-field';

type Args = {
  label: string;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

type NumberFieldStyle = React.CSSProperties & {
  '--tale-number-field-width'?: string;
  '--tale-number-field-group-width'?: string;
};

const meta: Meta<Args> = {
  title: 'Components/NumberField',
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    defaultValue: { control: 'number' },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
    step: { control: 'number' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
  args: {
    label: 'Quantity',
    defaultValue: 0,
    isDisabled: false,
    isReadOnly: false,
  },
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <NumberField.Root
      key={`${args.defaultValue}-${args.minValue}-${args.maxValue}-${args.step}`}
      defaultValue={args.defaultValue}
      minValue={args.minValue}
      maxValue={args.maxValue}
      step={args.step}
      isDisabled={args.isDisabled}
      isReadOnly={args.isReadOnly}
    >
      <NumberField.Label>{args.label}</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={1}>
      <NumberField.Label>Quantity</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const MinMax: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={5} minValue={0} maxValue={10}>
      <NumberField.Label>Rating (0–10)</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const Step: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={0} step={5}>
      <NumberField.Label>Step by 5</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={42} isDisabled>
      <NumberField.Label>Disabled</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithFormat: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={99.99} formatOptions={{ style: 'currency', currency: 'USD' }}>
      <NumberField.Label>Price</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const CustomControlWidth: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const fieldStyle: NumberFieldStyle = {
      '--tale-number-field-width': '20rem',
      '--tale-number-field-group-width': '8.75rem',
    };

    return (
      <NumberField.Root defaultValue={920} style={fieldStyle}>
        <NumberField.Label>Default panel width (px)</NumberField.Label>
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
        <NumberField.Description>Width applied to newly opened panels.</NumberField.Description>
      </NumberField.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Default
          </div>
          <NumberField.Root defaultValue={0}>
            <NumberField.Label>Quantity</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Min/Max (0-10)
          </div>
          <NumberField.Root defaultValue={5} minValue={0} maxValue={10}>
            <NumberField.Label>Rating</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Step by 5
          </div>
          <NumberField.Root defaultValue={0} step={5}>
            <NumberField.Label>Amount</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Currency
          </div>
          <NumberField.Root
            defaultValue={99.99}
            formatOptions={{ style: 'currency', currency: 'USD' }}
          >
            <NumberField.Label>Price</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.25rem' }}>
            Disabled
          </div>
          <NumberField.Root defaultValue={42} isDisabled>
            <NumberField.Label>Disabled</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
      </div>
    );
  },
};
