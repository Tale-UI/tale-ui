import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressCircle } from '@tale-ui/react/progress-circle';

type Args = {
  value?: number;
  size: 'sm' | 'md' | 'lg';
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/ProgressCircle',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: {
    value: 60,
    size: 'md',
    label: 'Upload progress',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <ProgressCircle.Root value={args.value} size={args.size} aria-label={args.label}>
        <ProgressCircle.Track />
      </ProgressCircle.Root>
    );
  },
};

export const WithLabelAndValue: Story = {
  render(args) {
    return (
      <ProgressCircle.Root value={args.value} size={args.size}>
        <ProgressCircle.Track />
        <ProgressCircle.Label>Upload</ProgressCircle.Label>
        <ProgressCircle.Value />
      </ProgressCircle.Root>
    );
  },
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
        <ProgressCircle.Root value={60} size="sm">
          <ProgressCircle.Track />
        </ProgressCircle.Root>
        <ProgressCircle.Root value={60} size="md">
          <ProgressCircle.Track />
        </ProgressCircle.Root>
        <ProgressCircle.Root value={60} size="lg">
          <ProgressCircle.Track />
        </ProgressCircle.Root>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  argTypes: { value: { control: false } },
  render(args) {
    return (
      <ProgressCircle.Root size={args.size}>
        <ProgressCircle.Track />
      </ProgressCircle.Root>
    );
  },
};

export const Complete: Story = {
  args: { value: 100 },
  render(args) {
    return (
      <ProgressCircle.Root value={100} size={args.size}>
        <ProgressCircle.Track />
        <ProgressCircle.Value />
      </ProgressCircle.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    const values = [0, 25, 50, 75, 100, undefined] as const;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${values.length}, auto)`,
          gap: '1rem',
          alignItems: 'end',
        }}
      >
        <div />
        {values.map((v) => (
          <div key={String(v)} className="story-label" style={{ textAlign: 'center' }}>
            {v == null ? 'indeterminate' : `${v}%`}
          </div>
        ))}
        {sizes.map((s) => (
          <React.Fragment key={`row-${s}`}>
            <div className="story-label">{s}</div>
            {values.map((v) => (
              <ProgressCircle.Root key={`${s}-${String(v)}`} value={v} size={s}>
                <ProgressCircle.Track />
                {v != null && <ProgressCircle.Value />}
              </ProgressCircle.Root>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
