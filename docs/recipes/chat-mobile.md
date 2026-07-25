# Mobile Chat

A single-column protocol-neutral conversation that fills a mobile viewport.

## Components Used

- `Chat` from `@tale-ui/react/chat`
- `Button` from `@tale-ui/react/button`
- `TextArea` from `@tale-ui/react/text-area`

## Code

```tsx
import { Chat } from '@tale-ui/react/chat';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';

function MobileChat() {
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
```

## Customization Points

- Keep message, draft, request, cancellation, and scroll state in the application.
- Batch streaming text before rendering or announcing it.
- Provide translated message and composer labels.
- Do not pass raw HTML or an SDK message object to Chat.
