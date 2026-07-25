# Chat with Artifact Panel

A responsive conversation with an adjacent application-owned artifact preview.

## Components Used

- `Chat` from `@tale-ui/react/chat`
- `Button` from `@tale-ui/react/button`
- `TextArea` from `@tale-ui/react/text-area`
- `Text` from `@tale-ui/react/text`

## Code

```tsx
import { Chat } from '@tale-ui/react/chat';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';
import { Text } from '@tale-ui/react/text';

function ChatWithArtifact() {
  return (
    <Chat.Root
      aria-label="Project conversation"
      artifactPanel={
        <Text as="div" variant="mono" size="s">
          {'export const status = "ready";'}
        </Text>
      }
      artifactPanelLabel="Generated code preview"
      style={{ minHeight: '36rem' }}
    >
      <Chat.List aria-label="Messages">
        <Chat.Message speaker="user" aria-label="User message">
          <Chat.Bubble>Show the current project status.</Chat.Bubble>
        </Chat.Message>
        <Chat.Message speaker="assistant" aria-label="Assistant message">
          <Chat.Bubble>The project is ready.</Chat.Bubble>
          <Chat.ToolCall state="success" label="Read project" statusLabel="Complete" open>
            Read one status file.
          </Chat.ToolCall>
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
}
```

## Customization Points

- Supply the artifact as ordinary application-owned React content.
- Keep artifact selection and visibility controlled by the application.
- The panel stacks below the conversation on narrow viewports.
- Use `CodeBlock` for plain code after adding `@tale-ui/react/code-block`.
