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
import { Code, type CodeProps } from '@tale-ui/react/code';
import type { DialogRootProps } from '@tale-ui/react/dialog';
import { Skeleton, type SkeletonProps } from '@tale-ui/react/skeleton';
import type { TableControllerQuery } from '@tale-ui/react/table';

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
