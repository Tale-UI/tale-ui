import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chat } from '@tale-ui/react/chat';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';
import { Text } from '@tale-ui/react/text';

type Args = {
  label: string;
  artifactPanelLabel: string;
  isBusy: boolean;
  showArtifactPanel: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Chat',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    label: { control: 'text' },
    artifactPanelLabel: { control: 'text' },
    isBusy: { control: 'boolean' },
    showArtifactPanel: { control: 'boolean' },
    artifactPanel: { control: false },
  },
  args: {
    label: 'Project conversation',
    artifactPanelLabel: 'Generated artifact',
    isBusy: false,
    showArtifactPanel: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithArtifactPanel: Story = {
  render(args) {
    return (
      <Chat.Root
        aria-label={args.label}
        artifactPanelLabel={args.artifactPanelLabel}
        artifactPanel={
          args.showArtifactPanel ? (
            <Text as="div" variant="mono" size="s">
              {'export const status = "ready";'}
            </Text>
          ) : undefined
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
            <Chat.ToolCall state="success" label={args.label} statusLabel="Complete" open>
              Read one status file.
            </Chat.ToolCall>
          </Chat.Message>
          <Chat.Message speaker="system" aria-label="System message">
            <Chat.Bubble>Conversation resumed.</Chat.Bubble>
          </Chat.Message>
        </Chat.List>
        <Chat.Composer
          aria-label="Message composer"
          isBusy={args.isBusy}
          onSubmit={(event) => event.preventDefault()}
        >
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
