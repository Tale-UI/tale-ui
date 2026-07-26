import type { HTMLProps } from '@tale-ui/react/types';
import { AspectRatio, type AspectRatioProps } from '@tale-ui/react/aspect-ratio';
import {
  Blockquote,
  type BlockquoteAttributionProps,
  type BlockquoteContentProps,
  type BlockquoteRootProps,
} from '@tale-ui/react/blockquote';
import { Button, type ButtonProps } from '@tale-ui/react/button';
import { ButtonGroup, type ButtonGroupProps } from '@tale-ui/react/button-group';
import {
  Citation,
  type CitationListProps,
  type CitationReferenceProps,
  type CitationRootProps,
  type CitationSource,
} from '@tale-ui/react/citation';
import { Code, type CodeProps } from '@tale-ui/react/code';
import type { DialogRootProps } from '@tale-ui/react/dialog';
import { Markdown, type MarkdownProps } from '@tale-ui/react/markdown';
import { Outline, type OutlineItem, type OutlineProps } from '@tale-ui/react/outline';
import {
  OverflowList,
  type OverflowListProps,
  type OverflowRenderContext,
} from '@tale-ui/react/overflow-list';
import { Skeleton, type SkeletonProps } from '@tale-ui/react/skeleton';
import type { TableControllerQuery } from '@tale-ui/react/table';
import {
  Timestamp,
  type AbsoluteTimestampProps,
  type RelativeTimestampProps,
  type TimestampFormatOptions,
  type TimestampProps,
  type TimestampValue,
} from '@tale-ui/react/timestamp';

const buttonProps = {
  children: 'Save',
  size: 'md',
  variant: 'primary',
} satisfies ButtonProps;

export const buttonContract = <Button {...buttonProps} />;

export const aspectRatioContract = (
  <AspectRatio ratio="16 / 9" objectFit="cover">
    <img src="/landscape.jpg" alt="Landscape" />
  </AspectRatio>
);

export const aspectRatioPropsContract = {
  ratio: 4 / 3,
  objectFit: 'contain',
  children: 'Media',
} satisfies AspectRatioProps;

export const blockquoteRootContract = {
  cite: 'https://example.com/interview',
  children: null,
} satisfies BlockquoteRootProps;

export const blockquoteContentContract = {
  children: 'Clarity is kindness.',
} satisfies BlockquoteContentProps;

export const blockquoteAttributionContract = {
  children: 'Brené Brown',
} satisfies BlockquoteAttributionProps;

export const blockquoteContract = (
  <Blockquote.Root {...blockquoteRootContract}>
    <Blockquote.Content {...blockquoteContentContract} />
    <Blockquote.Attribution {...blockquoteAttributionContract} />
  </Blockquote.Root>
);

export const labelledButtonGroupContract = (
  <ButtonGroup aria-label="Document actions">
    <Button>Save</Button>
  </ButtonGroup>
);

export const referencedButtonGroupContract = (
  <ButtonGroup role="region" aria-labelledby="document-actions-heading">
    <Button>Share</Button>
  </ButtonGroup>
);

export const presentationalButtonGroupContract = (
  <ButtonGroup role="presentation">
    <Button>Dismiss</Button>
  </ButtonGroup>
);

export const buttonGroupPropsContract = {
  'aria-label': 'Alignment actions',
  orientation: 'vertical',
  isAttached: true,
  children: null,
} satisfies ButtonGroupProps;

export const codePropsContract = {
  children: 'pnpm test',
} satisfies CodeProps;

export const codeContract = <Code>pnpm test</Code>;

export const skeletonPropsContract = {
  variant: 'rectangular',
  animation: 'none',
  width: '12rem',
  height: 80,
} satisfies SkeletonProps;

export const skeletonContract = <Skeleton {...skeletonPropsContract} />;

const citationSources = [
  {
    id: 'aria-apg',
    title: 'WAI-ARIA Authoring Practices Guide',
    href: '/WAI/ARIA/apg/',
  },
] satisfies readonly CitationSource[];

export const citationRootPropsContract = {
  id: 'research-note',
  sources: citationSources,
  baseUrl: 'https://www.w3.org/',
  children: null,
} satisfies CitationRootProps;

export const citationReferencePropsContract = {
  sourceId: 'aria-apg',
} satisfies CitationReferenceProps;

export const citationListPropsContract = {
  emptyFallback: 'No sources',
} satisfies CitationListProps;

export const citationContract = (
  <Citation.Root {...citationRootPropsContract}>
    <Citation.Reference {...citationReferencePropsContract} />
    <Citation.List {...citationListPropsContract} />
  </Citation.Root>
);

export const markdownPropsContract = {
  children: 'Read the [guide](./guide).',
  baseUrl: 'https://docs.example.com/',
  invalidFallback: 'Document unavailable',
} satisfies MarkdownProps;

export const markdownContract = <Markdown {...markdownPropsContract} />;

const outlineItems = [
  { id: 'overview', targetId: 'overview', label: 'Overview', level: 1 },
  { id: 'setup', targetId: 'setup', label: 'Setup', level: 2 },
] satisfies readonly OutlineItem[];

export const outlinePropsContract = {
  'aria-label': 'On this page',
  items: outlineItems,
  defaultActiveId: 'overview',
} satisfies OutlineProps;

export const outlineContract = <Outline {...outlinePropsContract} />;

const overflowActions = [
  { id: 'edit', label: 'Edit' },
  { id: 'share', label: 'Share' },
] as const;

export const overflowRenderContextContract: OverflowRenderContext = {
  overflowControlRef: () => undefined,
};

export const overflowListPropsContract = {
  items: overflowActions,
  getKey: (action) => action.id,
  renderItem: (action) => <Button>{action.label}</Button>,
  renderOverflow: (hidden, context) => (
    <Button ref={context.overflowControlRef}>More ({hidden.length})</Button>
  ),
  collapseFrom: 'end',
  minVisibleItems: 1,
  measurementKey: 'actions-v1',
} satisfies OverflowListProps<(typeof overflowActions)[number]>;

export const overflowListContract = <OverflowList {...overflowListPropsContract} />;

export const timestampValueContract: TimestampValue = '2026-07-27T12:05:00Z';

export const timestampFormatOptionsContract = {
  month: 'long',
  day: 'numeric',
} satisfies TimestampFormatOptions;

export const absoluteTimestampPropsContract = {
  value: timestampValueContract,
  locale: 'en-AU',
  timeZone: 'Australia/Melbourne',
  format: 'date',
  formatOptions: timestampFormatOptionsContract,
} satisfies AbsoluteTimestampProps;

export const relativeTimestampPropsContract = {
  value: timestampValueContract,
  locale: 'en-AU',
  timeZone: 'Australia/Melbourne',
  format: 'relative',
  now: '2026-07-27T12:00:00Z',
  refreshInterval: 0,
} satisfies RelativeTimestampProps;

export const timestampPropsContract: TimestampProps = relativeTimestampPropsContract;
export const absoluteTimestampContract = <Timestamp {...absoluteTimestampPropsContract} />;
export const relativeTimestampContract = <Timestamp {...relativeTimestampPropsContract} />;

export const dialogContract = {
  defaultOpen: false,
  children: null,
} satisfies DialogRootProps;

export const tableQueryContract = {
  selectedKeys: new Set(),
  page: 1,
  pageSize: 25,
  filter: {
    schemaVersion: '1.0.0',
    value: '',
  },
} satisfies TableControllerQuery;

export type DivContract = HTMLProps<HTMLDivElement>;

// @ts-expect-error AspectRatio accepts only positive-number-shaped ratio strings.
export const invalidAspectRatioContract = <AspectRatio ratio="16:9">Media</AspectRatio>;

export const unsafeAspectRatioHtmlContract = {
  children: 'Media',
  // @ts-expect-error AspectRatio does not expose raw HTML injection.
  dangerouslySetInnerHTML: { __html: '<img src=x>' },
} satisfies AspectRatioProps;

export const unsafeBlockquoteHtmlContract = {
  children: 'Safe quotation',
  // @ts-expect-error Blockquote parts do not expose raw HTML injection.
  dangerouslySetInnerHTML: { __html: '<img src=x>' },
} satisfies BlockquoteRootProps;

export const unnamedButtonGroupContract = (
  // @ts-expect-error Named ButtonGroup roles require exactly one accessible-name branch.
  <ButtonGroup>
    <Button>Save</Button>
  </ButtonGroup>
);

export const conflictingButtonGroupContract = (
  // @ts-expect-error ButtonGroup cannot receive both accessible-name properties.
  <ButtonGroup aria-label="Actions" aria-labelledby="actions-heading">
    <Button>Save</Button>
  </ButtonGroup>
);

export const namedPresentationButtonGroupContract = (
  // @ts-expect-error Presentational ButtonGroup cannot expose an accessible name.
  <ButtonGroup role="presentation" aria-label="Actions">
    <Button>Save</Button>
  </ButtonGroup>
);

export const renderFunctionButtonGroupContract = (
  <ButtonGroup aria-label="Actions">
    {
      // @ts-expect-error ButtonGroup accepts only static React children.
      () => <Button>Save</Button>
    }
  </ButtonGroup>
);

export const functionClassButtonGroupContract = (
  <ButtonGroup
    aria-label="Actions"
    // @ts-expect-error ButtonGroup does not expose RAC function-valued className.
    className={() => 'actions'}
  >
    <Button>Save</Button>
  </ButtonGroup>
);

export const invalidCodeChildContract = (
  // @ts-expect-error Code accepts plain string children only.
  <Code>
    <strong>pnpm test</strong>
  </Code>
);

export const unsafeCodeHtmlContract = {
  children: 'pnpm test',
  // @ts-expect-error Code does not expose raw HTML injection.
  dangerouslySetInnerHTML: { __html: '<img src=x>' },
} satisfies CodeProps;

export const namedSkeletonContract = {
  // @ts-expect-error Skeleton is decorative and omits accessible-name properties.
  'aria-label': 'Loading',
} satisfies SkeletonProps;

export const semanticSkeletonContract = {
  // @ts-expect-error Skeleton is decorative and cannot expose a semantic role.
  role: 'status',
} satisfies SkeletonProps;

export const childSkeletonContract = (
  // @ts-expect-error Skeleton always renders an empty span.
  <Skeleton>Loading</Skeleton>
);

export const unsafeCitationHtmlContract = {
  id: 'research-note',
  sources: citationSources,
  children: null,
  // @ts-expect-error Citation does not expose raw HTML injection.
  dangerouslySetInnerHTML: { __html: '<img src=x>' },
} satisfies CitationRootProps;

export const numberedCitationListContract = {
  // @ts-expect-error Citation owns decimal list numbering from one.
  start: 2,
} satisfies CitationListProps;

export const unsafeMarkdownHtmlContract = {
  children: '# Safe content',
  // @ts-expect-error Markdown never exposes raw HTML injection.
  dangerouslySetInnerHTML: { __html: '<img src=x>' },
} satisfies MarkdownProps;

export const invalidMarkdownChildrenContract = (
  // @ts-expect-error Markdown accepts string source only.
  <Markdown>{['# Heading']}</Markdown>
);

export const unnamedOutlineContract = (
  // @ts-expect-error Outline requires exactly one accessible-name branch.
  <Outline items={outlineItems} />
);

export const conflictingOutlineNameContract = (
  // @ts-expect-error Outline cannot receive both accessible-name properties.
  <Outline aria-label="On this page" aria-labelledby="outline-heading" items={outlineItems} />
);

export const conflictingOutlineStateContract = (
  // @ts-expect-error Outline cannot be controlled and uncontrolled simultaneously.
  <Outline
    aria-label="On this page"
    items={outlineItems}
    activeId="overview"
    defaultActiveId="overview"
  />
);

export const unsafeOverflowListHtmlContract = {
  items: overflowActions,
  getKey: (action: (typeof overflowActions)[number]) => action.id,
  renderItem: (action: (typeof overflowActions)[number]) => action.label,
  renderOverflow: () => 'More',
  // @ts-expect-error OverflowList does not expose raw HTML injection.
  dangerouslySetInnerHTML: { __html: '<img src=x>' },
} satisfies OverflowListProps<(typeof overflowActions)[number]>;

export const overflowListChildrenContract = (
  // @ts-expect-error OverflowList owns item rendering through renderItem.
  <OverflowList {...overflowListPropsContract}>Child</OverflowList>
);

// @ts-expect-error Absolute Timestamp does not accept a relative clock.
export const absoluteTimestampNowContract: TimestampProps = {
  value: timestampValueContract,
  locale: 'en-AU',
  timeZone: 'Australia/Melbourne',
  format: 'date',
  now: '2026-07-27T12:00:00Z',
};

export const relativeTimestampOptionsContract = {
  value: timestampValueContract,
  locale: 'en-AU',
  timeZone: 'Australia/Melbourne',
  format: 'relative',
  now: '2026-07-27T12:00:00Z',
  // @ts-expect-error Relative Timestamp does not accept absolute format options.
  formatOptions: { year: 'numeric' },
} satisfies TimestampProps;
