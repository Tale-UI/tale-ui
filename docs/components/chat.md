# Chat

`import { Chat, createStreamingTextState, applyStreamingTextEvent } from '@tale-ui/react/chat';`

Experimental, protocol-neutral chat layout and semantics. Chat accepts
ordinary application data and React content; it does not depend on an AI SDK,
render Markdown/HTML, execute tools, or own transport state.

## Parts

| Part            | Candidate mapping | Description                                 |
| --------------- | ----------------- | ------------------------------------------- |
| `Chat.Root`     | ChatLayout        | Responsive conversation and artifact layout |
| `Chat.List`     | MessageList       | Message log with configurable live behavior |
| `Chat.Message`  | Message           | Stable role-aware message article           |
| `Chat.Bubble`   | MessageBubble     | Plain-content message surface               |
| `Chat.Metadata` | MessageMetadata   | Caller-formatted metadata slot              |
| `Chat.Composer` | Composer          | Native form composition wrapper             |
| `Chat.ToolCall` | ToolCall          | Display-only native tool disclosure         |

Use `Chat.Message speaker="system"` for system output. A separate
`SystemMessage` component was rejected because it would duplicate Message.

## Props

### Root

| Prop                 | Type        | Default            | Description                              |
| -------------------- | ----------- | ------------------ | ---------------------------------------- |
| `artifactPanel`      | `ReactNode` | —                  | Application-owned adjacent artifact view |
| `artifactPanelLabel` | `string`    | `"Artifact panel"` | Accessible label for the panel landmark  |

### List

| Prop   | Type                | Default    | Description                       |
| ------ | ------------------- | ---------- | --------------------------------- |
| `live` | `"off" \| "polite"` | `"polite"` | Batched message announcement mode |

### Message

| Prop      | Type                                | Default | Description                      |
| --------- | ----------------------------------- | ------- | -------------------------------- |
| `speaker` | `"user" \| "assistant" \| "system"` | —       | Speaker alignment and data state |

### Composer

| Prop     | Type      | Default | Description                               |
| -------- | --------- | ------- | ----------------------------------------- |
| `isBusy` | `boolean` | —       | Sets busy semantics for caller-owned work |

### ToolCall

| Prop          | Type                                               | Default | Description                   |
| ------------- | -------------------------------------------------- | ------- | ----------------------------- |
| `state`       | `"collapsed" \| "running" \| "success" \| "error"` | —       | Display-only tool state       |
| `label`       | `ReactNode`                                        | —       | Tool name in the summary      |
| `statusLabel` | `ReactNode`                                        | —       | Localized visible status text |

`Bubble` and `Metadata` accept native `<div>` props. Other parts accept the
native props for their element.

## Basic Usage

```tsx
import { Chat } from '@tale-ui/react/chat';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';

export function Conversation() {
  return (
    <Chat.Root aria-label="Support conversation">
      <Chat.List aria-label="Messages">
        <Chat.Message speaker="assistant" aria-label="Assistant message">
          <Chat.Bubble>Hello. How can I help?</Chat.Bubble>
          <Chat.Metadata>Just now</Chat.Metadata>
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

## Ordered streaming text

The pure utility scopes state by `streamId`, `requestId`, and `messageId`.
Every event supplies the next integer `sequence`. Mismatched, stale, duplicate,
skipped, and post-terminal events return `accepted: false` without changing
state.

```tsx
const scope = {
  streamId: 'stream-7',
  requestId: 'request-7',
  messageId: 'message-7',
};

let result = applyStreamingTextEvent(createStreamingTextState(scope), {
  ...scope,
  type: 'chunk',
  sequence: 0,
  text: 'Hello',
});

if (result.accepted) {
  result = applyStreamingTextEvent(result.state, {
    ...scope,
    type: 'complete',
    sequence: 1,
  });
}
```

Callers own `AbortSignal`, transport, persistence, batching, and the decision
to announce terminal or batched text. The utility has no timers, network,
DOM, or global cache.

## Tool states

`Chat.ToolCall` uses native `details`/`summary`. The caller owns tool
execution, approval, and results. Provide localized status text and use
`open`/`defaultOpen` for disclosure state.

```tsx
<Chat.ToolCall state="success" label="Search documentation" statusLabel="Complete">
  Three results
</Chat.ToolCall>
```

## CSS Classes

- `.tale-chat`
- `.tale-chat--with-artifact-panel`
- `.tale-chat__conversation`
- `.tale-chat__artifact-panel`
- `.tale-chat__message-list`
- `.tale-chat__message`
- `.tale-chat__bubble`
- `.tale-chat__metadata`
- `.tale-chat__composer`
- `.tale-chat__tool-call`
- `.tale-chat__tool-call-summary`
- `.tale-chat__tool-call-status`
- `.tale-chat__tool-call-details`

## Security

Chat renders React children and plain text. Generic Markdown remains deferred
until sanitization, URL, syntax-highlighting, and Content Security Policy
rules are approved. The core package has no `dangerouslySetInnerHTML`, raw
HTML prop, URL fetcher, tool executor, or A2UI renderer.

## Pitfalls

<!-- pitfall: chat-no-raw-html -->

- **Keep untrusted HTML out of `Chat`** — render plain text or an independently reviewed content component because Chat intentionally has no HTML or Markdown escape hatch.
  - anti-pattern: `<Chat.Bubble dangerouslySetInnerHTML={{ __html: modelText }} />`
  - fix: `<Chat.Bubble>{modelText}</Chat.Bubble>`
