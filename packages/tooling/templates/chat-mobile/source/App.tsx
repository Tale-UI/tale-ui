import { Chat } from '@tale-ui/react/chat';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';

export function Example() {
  return (
    <Chat.Root
      aria-label="Support conversation"
      style={{ minHeight: '100dvh', maxWidth: '30rem', marginInline: 'auto' }}
    >
      <Chat.List aria-label="Messages">
        <Chat.Message speaker="assistant" aria-label="Assistant message">
          <Chat.Bubble>Hello. How can I help?</Chat.Bubble>
          <Chat.Metadata>Just now</Chat.Metadata>
        </Chat.Message>
        <Chat.Message speaker="user" aria-label="User message">
          <Chat.Bubble>Show my latest project.</Chat.Bubble>
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
