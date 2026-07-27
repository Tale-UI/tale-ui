import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListBox } from '@tale-ui/react/list-box';
import { GridLayout, Size, Virtualizer } from '@tale-ui/react/virtualizer';

type Args = {
  selectionMode?: 'none' | 'single' | 'multiple';
  label: string;
  layout: 'stack' | 'grid';
};

const items = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'review', label: 'In review' },
  { id: 'done', label: 'Done' },
];

const meta: Meta<Args> = {
  title: 'Components/ListBox',
  parameters: { layout: 'centered' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    label: { control: 'text' },
    layout: {
      control: 'inline-radio',
      options: ['stack', 'grid'],
    },
  },
  args: {
    selectionMode: 'single',
    label: 'Project status',
    layout: 'stack',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <ListBox.Root aria-label={args.label} selectionMode={args.selectionMode} layout={args.layout}>
        {items.map((item) => (
          <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
            {item.label}
          </ListBox.Item>
        ))}
      </ListBox.Root>
    );
  },
};

export const WithSections: Story = {
  render(args) {
    return (
      <ListBox.Root aria-label="Foods" selectionMode={args.selectionMode}>
        <ListBox.Section id="fruit">
          <ListBox.Header>Fruit</ListBox.Header>
          <ListBox.Item id="apple" textValue="Apple">
            Apple
          </ListBox.Item>
          <ListBox.Item id="banana" textValue="Banana">
            Banana
          </ListBox.Item>
        </ListBox.Section>
        <ListBox.Section id="vegetables">
          <ListBox.Header>Vegetables</ListBox.Header>
          <ListBox.Item id="carrot" textValue="Carrot">
            Carrot
          </ListBox.Item>
          <ListBox.Item id="broccoli" textValue="Broccoli">
            Broccoli
          </ListBox.Item>
        </ListBox.Section>
      </ListBox.Root>
    );
  },
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render(args) {
    return (
      <ListBox.Root aria-label="Notification channels" selectionMode={args.selectionMode}>
        {['Email', 'SMS', 'Push'].map((item) => (
          <ListBox.Item key={item} id={item.toLowerCase()} textValue={item}>
            {item}
            <ListBox.SelectionIndicator />
          </ListBox.Item>
        ))}
      </ListBox.Root>
    );
  },
};

const emojis = [
  { id: 'grinning', emoji: '😀', label: 'Grinning face' },
  { id: 'laughing', emoji: '😄', label: 'Laughing face' },
  { id: 'heart-eyes', emoji: '😍', label: 'Heart eyes' },
  { id: 'party', emoji: '🥳', label: 'Party face' },
  { id: 'thumbs-up', emoji: '👍', label: 'Thumbs up' },
  { id: 'clap', emoji: '👏', label: 'Clapping hands' },
];

export const VirtualizedGrid: Story = {
  render() {
    return (
      <Virtualizer
        layout={GridLayout}
        layoutOptions={{
          minItemSize: new Size(44, 44),
          maxItemSize: new Size(44, 44),
          minSpace: new Size(4, 4),
          preserveAspectRatio: true,
        }}
      >
        <ListBox.Root aria-label="Emoji" items={emojis} layout="grid" selectionMode="single">
          {(item) => (
            <ListBox.Item id={item.id} textValue={item.label}>
              {item.emoji}
            </ListBox.Item>
          )}
        </ListBox.Root>
      </Virtualizer>
    );
  },
};
