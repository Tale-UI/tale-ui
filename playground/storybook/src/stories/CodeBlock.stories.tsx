import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@tale-ui/react/code-block';

const source = `export function Greeting({ name }: { name: string }) {
  return <p>Hello {name}</p>;
}`;

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  args: { children: source, language: 'tsx', wrap: false },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wrapped: Story = {
  args: {
    wrap: true,
    children:
      'This intentionally long plain-text line wraps without loading a parser or syntax highlighter.',
  },
};
