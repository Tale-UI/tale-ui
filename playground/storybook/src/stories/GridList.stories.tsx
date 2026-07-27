import type { Meta, StoryObj } from '@storybook/react-vite';
import { GridList } from '@tale-ui/react/grid-list';
import { Icon } from '@tale-ui/react/icon';
import { Star, Heart, Bell, Settings, Mail } from 'lucide-react';

type Args = {
  selectionMode?: 'none' | 'single' | 'multiple';
  label: string;
  orientation: 'horizontal' | 'vertical';
};

const items = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
  { id: '4', name: 'Item 4' },
  { id: '5', name: 'Item 5' },
];

const meta: Meta<Args> = {
  title: 'Components/GridList',
  parameters: { layout: 'centered' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    label: { control: 'text' },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    selectionMode: 'none',
    label: 'Items',
    orientation: 'vertical',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <GridList.Root
        aria-label={args.label}
        selectionMode={args.selectionMode}
        orientation={args.orientation}
      >
        {items.map((item) => (
          <GridList.Item key={item.id} id={item.id} textValue={item.name}>
            {item.name}
          </GridList.Item>
        ))}
      </GridList.Root>
    );
  },
};

export const WithSelection: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render(args) {
    return (
      <GridList.Root aria-label="Items" selectionMode={args.selectionMode}>
        {items.map((item) => (
          <GridList.Item key={item.id} id={item.id} textValue={item.name}>
            {item.name}
          </GridList.Item>
        ))}
      </GridList.Root>
    );
  },
};

const iconItems = [
  { id: '1', name: 'Favorites', icon: Star },
  { id: '2', name: 'Liked', icon: Heart },
  { id: '3', name: 'Alerts', icon: Bell },
  { id: '4', name: 'Settings', icon: Settings },
  { id: '5', name: 'Messages', icon: Mail },
];

export const WithIcons: Story = {
  render(args) {
    return (
      <GridList.Root aria-label="Items" selectionMode={args.selectionMode}>
        {iconItems.map((item) => (
          <GridList.Item key={item.id} id={item.id} textValue={item.name}>
            <Icon icon={item.icon} size="sm" />
            {item.name}
          </GridList.Item>
        ))}
      </GridList.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Single select</p>
          <GridList.Root aria-label="Items — single" selectionMode="single">
            {items.map((item) => (
              <GridList.Item key={item.id} id={item.id} textValue={item.name}>
                {item.name}
              </GridList.Item>
            ))}
          </GridList.Root>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Multiple select</p>
          <GridList.Root aria-label="Items — multi" selectionMode="multiple">
            {items.map((item) => (
              <GridList.Item key={item.id} id={item.id} textValue={item.name}>
                {item.name}
              </GridList.Item>
            ))}
          </GridList.Root>
        </div>
      </div>
    );
  },
};
