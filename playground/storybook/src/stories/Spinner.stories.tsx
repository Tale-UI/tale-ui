import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@tale-ui/react/spinner';

type Args = {
  variant: 'circle' | 'line' | 'dots';
  size: 'sm' | 'md' | 'lg';
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/Spinner',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['circle', 'line', 'dots'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
  },
  args: {
    variant: 'circle',
    size: 'md',
    label: 'Loading',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <Spinner variant={args.variant} size={args.size} label={args.label} />;
  },
};

export const Variants: Story = {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Spinner variant="circle" />
        <Spinner variant="dots" />
        <div style={{ width: 200 }}>
          <Spinner variant="line" />
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    );
  },
};

export const DotsSizes: Story = {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Spinner variant="dots" size="sm" />
        <Spinner variant="dots" size="md" />
        <Spinner variant="dots" size="lg" />
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['circle', 'dots', 'line'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto repeat(3, 1fr)',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div />
        {sizes.map((s) => (
          <div key={s} className="story-label">
            {s}
          </div>
        ))}
        {variants.map((v) => (
          <React.Fragment>
            <div key={`label-${v}`} className="story-label">
              {v}
            </div>
            {sizes.map((s) => (
              <div key={`${v}-${s}`} style={{ width: v === 'line' ? 200 : 'auto' }}>
                <Spinner variant={v} size={s} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
