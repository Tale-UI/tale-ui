import type { Meta, StoryObj } from '@storybook/react-vite';
import { Blockquote } from '@tale-ui/react/blockquote';

const meta = {
  title: 'Components/Blockquote',
  component: Blockquote.Root,
  parameters: { layout: 'centered' },
  argTypes: {
    cite: { control: 'text' },
  },
  args: {
    cite: 'https://example.com/interview',
  },
} satisfies Meta<typeof Blockquote.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return (
      <Blockquote.Root {...args} style={{ maxWidth: '32rem' }}>
        <Blockquote.Content>
          The details are not the details. They make the design.
        </Blockquote.Content>
        <Blockquote.Attribution>Charles Eames</Blockquote.Attribution>
      </Blockquote.Root>
    );
  },
};
