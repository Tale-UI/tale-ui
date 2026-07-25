import type * as React from 'react';
import { Chat } from '@tale-ui/react/chat';
import type { Catalog, CatalogEntry } from './types.ts';

function normalizeSpeaker(value: unknown): 'user' | 'assistant' | 'system' {
  return value === 'user' || value === 'system' ? value : 'assistant';
}

function normalizeToolState(
  value: unknown,
): 'collapsed' | 'running' | 'success' | 'error' {
  return value === 'running' || value === 'success' || value === 'error'
    ? value
    : 'collapsed';
}

function preventSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

/**
 * Opt-in Chat catalog kept separate from the general Tale UI A2UI catalog.
 *
 * The adapters map declarative display data only. They do not start requests,
 * execute tools, parse Markdown/HTML, or bridge transport events.
 */
export const taleChatA2UICatalog: Catalog = {
  ChatLayout: {
    component: Chat.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string | undefined) ?? 'Conversation',
      children: ctx.children,
    }),
  } as CatalogEntry,
  ChatMessageList: {
    component: Chat.List,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string | undefined) ?? 'Messages',
      live: props.live === 'polite' ? 'polite' : 'off',
      children: ctx.children,
    }),
  } as CatalogEntry,
  ChatMessage: {
    component: Chat.Message,
    adapter: (props, ctx) => ({
      speaker: normalizeSpeaker(props.speaker),
      'aria-label': props.label as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,
  ChatMessageBubble: {
    component: Chat.Bubble,
    adapter: (props, ctx) => ({
      children: props.text ?? ctx.children,
    }),
  } as CatalogEntry,
  ChatMessageMetadata: {
    component: Chat.Metadata,
    adapter: (props, ctx) => ({
      children: props.text ?? ctx.children,
    }),
  } as CatalogEntry,
  ChatComposer: {
    component: Chat.Composer,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string | undefined) ?? 'Message composer',
      isBusy: props.isBusy === true,
      onSubmit: preventSubmit,
      children: ctx.children,
    }),
  } as CatalogEntry,
  ChatToolCall: {
    component: Chat.ToolCall,
    adapter: (props, ctx) => ({
      state: normalizeToolState(props.state),
      label: (props.label as string | undefined) ?? 'Tool call',
      statusLabel: (props.statusLabel as string | undefined) ?? normalizeToolState(props.state),
      open: props.open === true,
      children: ctx.children,
    }),
  } as CatalogEntry,
};
