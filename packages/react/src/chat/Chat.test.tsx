import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import {
  Chat,
  applyStreamingTextEvent,
  createStreamingTextState,
  type StreamingTextEvent,
} from './index';

const scope = { streamId: 'stream-1', requestId: 'request-1', messageId: 'message-1' };

function apply(event: StreamingTextEvent) {
  return applyStreamingTextEvent(createStreamingTextState(scope), event);
}

describe('Chat streaming text', () => {
  it('accepts ordered chunks and a terminal state', () => {
    const first = apply({ ...scope, type: 'chunk', sequence: 0, text: 'Hello' });
    expect(first.accepted).toBe(true);
    if (!first.accepted) {
      throw new Error('Expected an accepted chunk');
    }
    const second = applyStreamingTextEvent(first.state, {
      ...scope,
      type: 'chunk',
      sequence: 1,
      text: ' world',
    });
    expect(second.accepted).toBe(true);
    if (!second.accepted) {
      throw new Error('Expected an accepted chunk');
    }
    const complete = applyStreamingTextEvent(second.state, {
      ...scope,
      type: 'complete',
      sequence: 2,
    });
    expect(complete.accepted).toBe(true);
    expect(complete.state.text).toBe('Hello world');
    expect(complete.state.status).toBe('complete');
  });

  it.each([
    [
      'scope-mismatch',
      { ...scope, streamId: 'stale', type: 'chunk', sequence: 0, text: 'x' } as const,
    ],
    ['future-sequence', { ...scope, type: 'chunk', sequence: 1, text: 'x' } as const],
  ])('rejects %s events without changing state', (reason, event) => {
    const state = createStreamingTextState(scope);
    const result = applyStreamingTextEvent(state, event);
    expect(result).toEqual({ accepted: false, reason, state });
  });

  it('rejects duplicate and post-terminal events', () => {
    const first = apply({ ...scope, type: 'chunk', sequence: 0, text: 'one' });
    if (!first.accepted) {
      throw new Error('Expected an accepted chunk');
    }
    const duplicate = applyStreamingTextEvent(first.state, {
      ...scope,
      type: 'chunk',
      sequence: 0,
      text: 'duplicate',
    });
    expect(duplicate.accepted).toBe(false);
    if (duplicate.accepted) {
      throw new Error('Expected a rejected duplicate');
    }
    expect(duplicate.reason).toBe('stale-sequence');

    const cancelled = applyStreamingTextEvent(first.state, {
      ...scope,
      type: 'cancelled',
      sequence: 1,
    });
    if (!cancelled.accepted) {
      throw new Error('Expected cancellation');
    }
    const late = applyStreamingTextEvent(cancelled.state, {
      ...scope,
      type: 'chunk',
      sequence: 2,
      text: 'late',
    });
    expect(late.accepted).toBe(false);
    if (late.accepted) {
      throw new Error('Expected a rejected late chunk');
    }
    expect(late.reason).toBe('already-terminal');
  });
});

describe('Chat components', () => {
  const { render, renderToString } = createRenderer();

  function Example() {
    return (
      <Chat.Root aria-label="Conversation" artifactPanel={<div>Preview</div>}>
        <Chat.List aria-label="Messages">
          <Chat.Message speaker="assistant" aria-label="Assistant message">
            <Chat.Bubble>Hello</Chat.Bubble>
            <Chat.Metadata>Now</Chat.Metadata>
            <Chat.ToolCall state="running" label="Search" statusLabel="Running">
              Searching documentation
            </Chat.ToolCall>
          </Chat.Message>
        </Chat.List>
        <Chat.Composer aria-label="Message composer" isBusy>
          <button type="submit">Send</button>
        </Chat.Composer>
      </Chat.Root>
    );
  }

  it('renders protocol-neutral chat, log, tool, composer, and artifact semantics', async () => {
    await render(<Example />);
    expect(screen.getByRole('log').getAttribute('aria-live')).toBe('polite');
    expect(screen.getByRole('article').getAttribute('data-role')).toBe('assistant');
    expect(screen.getByText('Search').closest('details')?.getAttribute('data-state')).toBe('running');
    expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('region', { name: 'Artifact panel' })).toBeTruthy();
  });

  it('preserves content across SSR and hydration', () => {
    const view = renderToString(<Example />);
    expect(screen.getByRole('log').textContent).toContain('Hello');
    const hydrated = view.hydrate();
    expect(screen.getByRole('log').textContent).toContain('Hello');
    hydrated.unmount();
  });
});
