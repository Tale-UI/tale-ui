# RFC: Protocol-neutral Chat

- Status: Approved
- Date: 2026-07-25
- Approval: Repository owner delegated implementation authority
- Evidence: `registry/sources/roadmap/chat/candidate-dispositions.json`

## Decision

Ship an experimental `Chat` namespace for layout and semantics, plus a pure
streaming-text state utility. Approve `ChatLayout`, `MessageList`, `Message`,
`MessageBubble`, `MessageMetadata`, `Composer`, `ToolCall`, and the
streaming-text utility. Reject a separate `SystemMessage`; use
`Chat.Message speaker="system"`.

The public API accepts ordinary React content and serializable IDs, roles,
states, sequence numbers, and text chunks. It does not accept an AI SDK or
transport type. The application owns requests, models, tools, approval,
messages, persistence, retries, draft state, scroll-follow policy, and
artifact-panel visibility.

Separately, approve a standalone, bounded `Markdown` component under the
component-equivalence expansion plan. Its export remains gated on Gate A
selecting and proving a parser that satisfies the frozen source, line, depth,
node, raw-HTML, URL, resource-fetching, packaging, and performance boundaries.
This decision does not change `Chat`: Chat continues to accept React children
and plain text and does not parse Markdown.

## Streaming contract

Streaming state is scoped by `streamId`, `requestId`, and `messageId`.
`applyStreamingTextEvent`:

1. accepts only the next integer sequence for the matching scope;
2. rejects duplicate, stale, skipped, mismatched, and post-terminal events;
3. appends caller-batched plain-text chunks;
4. supports complete, cancelled, and error terminal states; and
5. returns an explicit accepted/rejected result without side effects.

The utility has no network, timer, DOM, or global cache. Callers retain state,
provide an `AbortSignal` to their own transport, and decide how frequently to
render or announce batches.

## Accessibility

`Chat.List` uses log semantics and defaults to polite relevant-additions
announcements; consumers may turn live behavior off when they provide a
separate batched status. Updates never move focus. `Chat.Message` is a stable
article labelled by its role. `Chat.Composer` is a native form.
`Chat.ToolCall` uses native disclosure behavior and exposes collapsed,
running, success, and error state text without relying on color.

The layout reflows to one column on narrow viewports, supports RTL through
logical properties, wraps long content, and has no required animation.

## Security

Chat renders React children and plain text. It has no raw-HTML escape hatch,
Markdown parser or parser dependency, syntax highlighter, tool executor, URL
fetcher, executable-content extension, or A2UI renderer. The separately
approved standalone Markdown component omits raw HTML, prevents resource
fetching, filters executable and credential-bearing URLs, and fails atomically
within fixed limits; Gate A must prove those boundaries before it is exported.
A2UI mapping is a separate adapter and cannot broaden either boundary.

## Templates and promotion

Two independently packed templates are required: mobile chat and chat with an
artifact panel. The family stays experimental until streaming, SSR,
accessibility, long-content, and four-state tool fixtures pass and the
templates remain validation-clean.
