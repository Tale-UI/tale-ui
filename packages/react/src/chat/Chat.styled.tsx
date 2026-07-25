import * as React from 'react';
import { cx } from '../_cx';

export interface ChatRootProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'className'> {
  /** Optional application-owned artifact panel. */
  artifactPanel?: React.ReactNode;
  /** Accessible label for the artifact panel. @default 'Artifact panel' */
  artifactPanelLabel?: string | undefined;
  className?: string | undefined;
}

/**
 * Protocol-neutral chat layout and semantic parts.
 *
 * @example
 * ```tsx
 * import { Chat } from '@tale-ui/react/chat';
 *
 * <Chat.Root aria-label="Support conversation">
 *   <Chat.List>
 *     <Chat.Message speaker="assistant" aria-label="Assistant message">
 *       <Chat.Bubble>Hello. How can I help?</Chat.Bubble>
 *     </Chat.Message>
 *   </Chat.List>
 * </Chat.Root>
 * ```
 *
 * @status experimental
 */
export const Root = React.forwardRef<HTMLElement, ChatRootProps>(
  ({ artifactPanel, artifactPanelLabel = 'Artifact panel', className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cx(
        `tale-chat ${artifactPanel ? 'tale-chat--with-artifact-panel' : ''}`,
        className,
      )}
      {...props}
    >
      <div className="tale-chat__conversation">{children}</div>
      {artifactPanel ? (
        <aside className="tale-chat__artifact-panel" aria-label={artifactPanelLabel}>
          {artifactPanel}
        </aside>
      ) : null}
    </section>
  ),
);
Root.displayName = 'Chat.Root';

export interface ChatListProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Live-region behavior for batched message updates. @default 'polite' */
  live?: 'off' | 'polite' | undefined;
  className?: string | undefined;
}

/** Message log. The caller owns ordering, scroll-follow, and windowing. @status experimental */
export const List = React.forwardRef<HTMLDivElement, ChatListProps>(
  ({ live = 'polite', className, ...props }, ref) => (
    <div
      ref={ref}
      role="log"
      aria-live={live}
      aria-relevant="additions"
      className={cx('tale-chat__message-list', className)}
      {...props}
    />
  ),
);
List.displayName = 'Chat.List';

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessageProps
  extends Omit<React.ComponentPropsWithoutRef<'article'>, 'className'> {
  /** Speaker role used for visual alignment. */
  speaker: ChatMessageRole;
  className?: string | undefined;
}

/** Stable message article. Use `speaker="system"` instead of a separate component. @status experimental */
export const Message = React.forwardRef<HTMLElement, ChatMessageProps>(
  ({ speaker, className, ...props }, ref) => (
    <article
      ref={ref}
      data-role={speaker}
      className={cx(`tale-chat__message tale-chat__message--${speaker}`, className)}
      {...props}
    />
  ),
);
Message.displayName = 'Chat.Message';

export interface ChatBubbleProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/** Plain React-content message surface. @status experimental */
export const Bubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-chat__bubble', className)} {...props} />
  ),
);
Bubble.displayName = 'Chat.Bubble';

export interface ChatMetadataProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/** Caller-formatted message metadata. @status experimental */
export const Metadata = React.forwardRef<HTMLDivElement, ChatMetadataProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-chat__metadata', className)} {...props} />
  ),
);
Metadata.displayName = 'Chat.Metadata';

export interface ChatComposerProps
  extends Omit<React.ComponentPropsWithoutRef<'form'>, 'className'> {
  /** Describes a caller-owned in-flight request without changing controls. */
  isBusy?: boolean | undefined;
  className?: string | undefined;
}

/** Native form wrapper for caller-controlled composition controls. @status experimental */
export const Composer = React.forwardRef<HTMLFormElement, ChatComposerProps>(
  ({ isBusy, className, ...props }, ref) => (
    <form
      ref={ref}
      aria-busy={isBusy || undefined}
      data-busy={isBusy || undefined}
      className={cx('tale-chat__composer', className)}
      {...props}
    />
  ),
);
Composer.displayName = 'Chat.Composer';

export type ChatToolCallState = 'collapsed' | 'running' | 'success' | 'error';

export interface ChatToolCallProps
  extends Omit<React.ComponentPropsWithoutRef<'details'>, 'className'> {
  /** Display-only tool state. */
  state: ChatToolCallState;
  /** Tool label rendered in the disclosure summary. */
  label: React.ReactNode;
  /** Localized visible state text. */
  statusLabel: React.ReactNode;
  className?: string | undefined;
}

/**
 * Native disclosure for tool-call summaries and details. It never executes a
 * tool or interprets its payload.
 *
 * @status experimental
 */
export const ToolCall = React.forwardRef<HTMLDetailsElement, ChatToolCallProps>(
  ({ state, label, statusLabel, className, children, ...props }, ref) => (
    <details
      ref={ref}
      data-state={state}
      className={cx(`tale-chat__tool-call tale-chat__tool-call--${state}`, className)}
      {...props}
    >
      <summary className="tale-chat__tool-call-summary">
        <span>{label}</span>
        <span className="tale-chat__tool-call-status">{statusLabel}</span>
      </summary>
      <div className="tale-chat__tool-call-details">{children}</div>
    </details>
  ),
);
ToolCall.displayName = 'Chat.ToolCall';
