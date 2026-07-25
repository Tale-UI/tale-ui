export type StreamingTextStatus = 'streaming' | 'complete' | 'cancelled' | 'error';

export interface StreamingTextScope {
  streamId: string;
  requestId: string;
  messageId: string;
}

export interface StreamingTextState extends StreamingTextScope {
  nextSequence: number;
  text: string;
  status: StreamingTextStatus;
  error?: string | undefined;
}

export type StreamingTextEvent =
  | (StreamingTextScope & {
      type: 'chunk';
      sequence: number;
      text: string;
    })
  | (StreamingTextScope & {
      type: 'complete' | 'cancelled';
      sequence: number;
    })
  | (StreamingTextScope & {
      type: 'error';
      sequence: number;
      error: string;
    });

export type StreamingTextRejection =
  | 'scope-mismatch'
  | 'already-terminal'
  | 'stale-sequence'
  | 'future-sequence';

export type StreamingTextResult =
  | { accepted: true; state: StreamingTextState }
  | {
      accepted: false;
      reason: StreamingTextRejection;
      state: StreamingTextState;
    };

/**
 * Creates serializable state for one request/message stream.
 *
 * @status experimental
 */
export function createStreamingTextState(
  scope: StreamingTextScope,
  initialText = '',
): StreamingTextState {
  return {
    ...scope,
    nextSequence: 0,
    text: initialText,
    status: 'streaming',
  };
}

/**
 * Applies one ordered plain-text stream event without transport side effects.
 *
 * @status experimental
 */
export function applyStreamingTextEvent(
  state: StreamingTextState,
  event: StreamingTextEvent,
): StreamingTextResult {
  if (
    event.streamId !== state.streamId ||
    event.requestId !== state.requestId ||
    event.messageId !== state.messageId
  ) {
    return { accepted: false, reason: 'scope-mismatch', state };
  }
  if (state.status !== 'streaming') {
    return { accepted: false, reason: 'already-terminal', state };
  }
  if (event.sequence < state.nextSequence) {
    return { accepted: false, reason: 'stale-sequence', state };
  }
  if (event.sequence > state.nextSequence) {
    return { accepted: false, reason: 'future-sequence', state };
  }

  if (event.type === 'chunk') {
    return {
      accepted: true,
      state: {
        ...state,
        nextSequence: state.nextSequence + 1,
        text: `${state.text}${event.text}`,
      },
    };
  }

  return {
    accepted: true,
    state: {
      ...state,
      nextSequence: state.nextSequence + 1,
      status: event.type,
      error: event.type === 'error' ? event.error : undefined,
    },
  };
}
