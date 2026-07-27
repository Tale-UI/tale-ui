import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Resizable } from '@tale-ui/react/resizable';

const meta = {
  title: 'Components/Resizable',
  component: Resizable.Root,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    defaultSizes: { control: 'object' },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    children: { control: false },
    style: { control: 'object' },
  },
} satisfies Meta<typeof Resizable.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle = {
  padding: 'var(--space-s)',
  background: 'var(--neutral-10)',
  color: 'var(--neutral-90)',
} as const;

export const Default: Story = {
  args: {
    defaultSizes: { navigation: 30, content: 70 },
    children: (
      <React.Fragment>
        <Resizable.Panel id="navigation" minSize={20} maxSize={50} style={panelStyle}>
          Navigation
        </Resizable.Panel>
        <Resizable.Handle
          id="navigation-content"
          before="navigation"
          after="content"
          aria-label="Resize navigation and content"
        />
        <Resizable.Panel id="content" minSize={40} style={panelStyle}>
          Content
        </Resizable.Panel>
      </React.Fragment>
    ),
    style: { height: 240 },
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultSizes: { preview: 60, console: 40 },
    children: (
      <React.Fragment>
        <Resizable.Panel id="preview" minSize={30} style={panelStyle}>
          Preview
        </Resizable.Panel>
        <Resizable.Handle
          id="preview-console"
          before="preview"
          after="console"
          aria-label="Resize preview and console"
        />
        <Resizable.Panel id="console" minSize={20} style={panelStyle}>
          Console
        </Resizable.Panel>
      </React.Fragment>
    ),
    style: { height: 320 },
  },
};
