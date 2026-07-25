import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '@tale-ui/react/kbd';
import { Text } from '@tale-ui/react/text';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  args: { size: 'md', children: 'K' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shortcut: Story = {
  render() {
    return (
      <Text>
        Open search with <Kbd>⌘</Kbd> <Kbd>K</Kbd>
      </Text>
    );
  },
};
