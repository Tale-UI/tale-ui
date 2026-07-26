import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from '@tale-ui/react/code';

const meta = {
  title: 'Components/Code',
  component: Code,
  args: { children: 'pnpm test' },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
