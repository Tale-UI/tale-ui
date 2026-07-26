import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@tale-ui/react/button';
import { OverflowList } from '@tale-ui/react/overflow-list';

const actions = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive' },
  { id: 'share', label: 'Share' },
] as const;

const meta = {
  title: 'Components/OverflowList',
  component: OverflowList,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Document actions',
    items: actions,
    getKey: (item) => item.id,
    renderItem: (item) => <Button variant="neutral">{item.label}</Button>,
    renderOverflow: (hidden, { overflowControlRef }) => (
      <Button
        ref={overflowControlRef}
        variant="neutral"
        aria-label={`${hidden.length} more actions`}
      >
        More
      </Button>
    ),
  },
} satisfies Meta<typeof OverflowList<(typeof actions)[number]>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return <OverflowList {...args} style={{ width: 520 }} />;
  },
};

export const Measured: Story = {
  render(args) {
    return <OverflowList {...args} style={{ width: 260 }} />;
  },
};
