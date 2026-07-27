import type { Meta, StoryObj } from '@storybook/react-vite';
import { Markdown } from '@tale-ui/react/markdown';

const meta = {
  title: 'Components/Markdown',
  component: Markdown,
  parameters: { layout: 'centered' },
  argTypes: {
    baseUrl: { control: 'text' },
    invalidFallback: { control: 'text' },
    children: { control: 'text' },
    style: { control: 'object' },
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    baseUrl: 'https://example.com/docs/',
    children: `## Secure document content

Tale renders **bounded Markdown** with [safe links](./security), \`inline code\`,
and plain-text resource fallbacks.

> Raw HTML, executable extensions, and remote images are never mounted.

- Deterministic parsing
- Fixed syntax
- Atomic fallback`,
    style: { maxWidth: '38rem' },
  },
};
