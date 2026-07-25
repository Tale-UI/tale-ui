# A2UI Chat adapter

The experimental Chat A2UI catalog is deliberately separate from the general
catalog:

```tsx
import { createCatalog } from '@tale-ui/a2ui/catalog';
import { taleChatA2UICatalog } from '@tale-ui/a2ui/chat';

const catalog = createCatalog(taleChatA2UICatalog);
```

It exposes `ChatLayout`, `ChatMessageList`, `ChatMessage`,
`ChatMessageBubble`, `ChatMessageMetadata`, `ChatComposer`, and
`ChatToolCall`. These adapters render declarative ordinary data only. They do
not start model requests, accept transport objects, execute tools, parse
Markdown or HTML, or map streaming events.

`ChatMessageList` defaults live behavior to `off` in agent-authored surfaces
unless `live: "polite"` is explicit. Tool state is display-only. Applications
retain action dispatch, approval, transport, persistence, and streaming state.
