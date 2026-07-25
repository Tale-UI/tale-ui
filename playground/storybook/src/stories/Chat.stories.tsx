import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chat } from '@tale-ui/react/chat';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';
import { Text } from '@tale-ui/react/text';

const meta = {
  title: 'Components/Chat',
  component: Chat.Root,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Chat.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithArtifactPanel: Story = {
  render() {
    return (
      <Chat.Root
        aria-label="Project conversation"
        artifactPanel={
          <Text as="div" variant="mono" size="s">
            {'export const status = "ready";'}
          </Text>
        }
        style={{ minHeight: '32rem' }}
      >
        <Chat.List aria-label="Messages">
          <Chat.Message speaker="user" aria-label="User message">
            <Chat.Bubble>Show the current status.</Chat.Bubble>
            <Chat.Metadata>10:03</Chat.Metadata>
          </Chat.Message>
          <Chat.Message speaker="assistant" aria-label="Assistant message">
            <Chat.Bubble>The project is ready.</Chat.Bubble>
            <Chat.ToolCall state="success" label="Read project" statusLabel="Complete" open>
              Read one status file.
            </Chat.ToolCall>
          </Chat.Message>
          <Chat.Message speaker="system" aria-label="System message">
            <Chat.Bubble>Conversation resumed.</Chat.Bubble>
          </Chat.Message>
        </Chat.List>
        <Chat.Composer aria-label="Message composer" onSubmit={(event) => event.preventDefault()}>
          <TextArea.Root>
            <TextArea.TextArea aria-label="Message" />
          </TextArea.Root>
          <Button type="submit">Send</Button>
        </Chat.Composer>
      </Chat.Root>
    );
  },
};

export const ToolStates: Story = {
  render() {
    const states = ['collapsed', 'running', 'success', 'error'] as const;
    return (
      <div style={{ display: 'grid', gap: 'var(--space-s)', padding: 'var(--space-s)' }}>
        {states.map((state) => (
          <Chat.ToolCall
            key={state}
            state={state}
            label="Search documentation"
            statusLabel={state}
            open={state !== 'collapsed'}
          >
            Tool details remain caller-owned plain content.
          </Chat.ToolCall>
        ))}
      </div>
    );
  },
};
