# Plan

## Objective

Add 13 experimental, first-class `@tale-ui/react` components:

| Candidate    | Decision                                                     |
| ------------ | ------------------------------------------------------------ |
| AspectRatio  | Tale-owned native/CSS primitive                              |
| Blockquote   | Tale-owned semantic composition                              |
| ButtonGroup  | Restricted wrapper over React Aria Components 1.19.0 `Group` |
| Citation     | Tale-owned normalized citation registry                      |
| Code         | Tale-owned inline semantic primitive                         |
| Lightbox     | Tale composition over Dialog, Button, and swipe utilities    |
| Markdown     | Bounded renderer selected by Gate A                          |
| Outline      | Tale-owned navigation and observer model                     |
| OverflowList | Tale-owned measurement and focus state machine               |
| Resizable    | Tale-owned panels using `react-aria@3.50.0` `useMove`        |
| Skeleton     | Tale-owned decorative primitive                              |
| Timestamp    | Tale-owned `Intl` formatter and shared scheduler             |
| Toast        | Tale adapter over RAC 1.19.0 unstable Toast primitives       |

Raise `@tale-ui/react`’s public Node floor to `>=18`, retaining `tale-ui-mcp` and `@modelcontextprotocol/sdk` in React.

Prepare exact synchronized version `3.0.0` for Tokens, CSS, React, Styles, Themes, and Utils. Migrate all 12 maintained Tooling templates to React 3 and independently prepare `@tale-ui/tooling@0.2.0`. Do not publish, tag, push, deploy, or promote anything without later authorization.

Record all 13 A2UI dispositions as `n/a`. Make no A2UI runtime, catalog, provider, store, build, package, version, publication, or release-channel change. Future A2UI publication requires a separate approved release plan.

Use four bundles:

1. Low-state primitives.
2. Secure document content and navigation.
3. Measured and modal interaction.
4. Unstable Toast adapter.

Shared prerequisites and Gate B precede Bundle 1. Markdown Gate A runs after Bundle 1 and immediately before Bundle 2.

## Evidence Checked

Repository guidance:

- `CLAUDE.md`
- `packages/react/CLAUDE.md`
- `packages/react/README.md`
- `docs/authoring-components.md`
- `docs/documentation-governance.md`
- `docs/governance/lifecycle.md`
- `docs/governance/accessibility-and-performance.md`
- `test/README.md`
- `/Users/admin/.agents/skills/agentic-plan-verify-loop/SKILL.md`

Planning inputs:

- `.agentic-loop/runs/20260726T103806Z/request.md`
- `.agentic-loop/component-equivalence-request-v2.md`
- `.agentic-loop/runs/20260726T110135Z/request.md`
- `.agentic-loop/runs/20260726T110135Z/reviewer-01/round-07/plan.md`
- `.agentic-loop/runs/20260726T110135Z/reviewer-02/round-08/feedback.md`
- `.agentic-loop/runs/20260726T110135Z/reviewer-02/round-09/plan.md`
- `.agentic-loop/runs/20260726T110135Z/reviewer-02/round-09/feedback.md`
- `.agentic-loop/runs/20260726T110135Z/reviewer-02/round-10/plan.md`
- `.agentic-loop/runs/20260726T110135Z/reviewer-02/round-10/feedback.md`
- `.agentic-loop/runs/20260726T141755Z/request.md`
- `.agentic-loop/runs/20260726T141755Z/memory.md`

Component and dependency evidence:

- `packages/react/package.json`
- `packages/react/src/index.ts`
- `packages/react/src/icon-button/IconButton.styled.tsx`
- `packages/react/src/code-block/CodeBlock.styled.tsx`
- `packages/react/src/toggle-group/index.ts`
- `packages/react/src/social-button-group/index.ts`
- `packages/react/src/dialog/Dialog.styled.tsx`
- `packages/react/src/dialog/index.ts`
- `packages/react/src/carousel/Carousel.styled.tsx`
- `packages/react/src/chat/Chat.styled.tsx`
- `packages/react/src/text-editor/TextEditor.styled.tsx`
- `packages/react/src/table/Table.styled.tsx`
- `packages/react/src/link/Link.styled.tsx`
- `packages/react/src/utils/useSwipeDismiss.ts`
- Installed RAC 1.19.0 Group, Table, and Toast declarations/runtime
- Installed React Aria 3.50.0 `useMove`, `useToast`, and `useToastRegion`
- Installed React Stately 3.48.0 Toast declarations and `dist/private/toast/useToastState.mjs`
- Installed React 19.2.4 declarations
- Installed MCP SDK 1.28.0 manifest
- `registry/components.json`

The Toast runtime inspection established:

- `ToastQueue.add` prepends the raw record, replaces `visibleToasts`, invokes subscribers synchronously, and only then returns the raw key.
- `ToastQueue.close` mutates its raw queue and then replaces `visibleToasts` before notifying subscribers.
- `ToastQueue.clear` empties its raw queue and then replaces `visibleToasts` before notifying subscribers.
- `useToastQueue` subscribes to the supplied queue and uses `queue.visibleToasts` as its external-store snapshot.
- Upstream options can create timers and retain `onClose`.
- `useToast` resets an upstream timer.
- RAC’s injected dismiss action calls `state.close(rawKey)`.
- `useToastRegion` invokes `state.pauseAll()` and `state.resumeAll()`.
- A stable private adapter can own the subscriber set and RAC-facing `visibleToasts` while delegating raw mutations to a replaceable, unsubscribed raw queue generation.

Generated, packaging, release, and verification surfaces:

- `packages/styles/package.json`
- `packages/styles/src/index.css`
- `tools/run-changed-a11y.mjs`
- `tools/generate-registry.js`
- `tools/generate-figma-integration.mjs`
- `registry/integrations/figma-public.json`
- `registry/integrations/code-connect.json`
- `registry/integrations/figma-parity-public.json`
- `schemas/figma-record.schema.json`
- `schemas/candidate-inventory.schema.json`
- `schemas/candidate-disposition.schema.json`
- `tools/check-roadmap-contracts.mjs`
- `registry/sources/roadmap/content/candidate-dispositions.json`
- `docs/architecture/rfc-chat.md`
- `docs/upstream/react-aria-components.md`
- `docs/react-aria-deviations.md`
- Existing Table, AppShell, Chat, Content, and Extensions inventories
- Existing AppShell, Chat, and Content disposition artifacts
- Native conformance generator and registries
- `docs/recipes/`
- `tools/validate-recipes.mjs`
- `schemas/template.schema.json`
- `tools/generate-roadmap-templates.mjs`
- `packages/tooling/templates/`
- `packages/tooling/src/materialize.ts`
- `packages/tooling/src/materialize.test.ts`
- `packages/tooling/scripts/build.mjs`
- `packages/tooling/scripts/test-packed.mjs`
- `packages/tooling/package.json`
- `.github/workflows/ci.yml`
- `.github/workflows/publish.yml`
- `scripts/release/sync-package-versions.mjs`
- `tools/generate-versioned-docs.mjs`
- `tools/assemble-pages.mjs`
- `tools/assemble-pages.test.mjs`
- `schemas/docs-provenance.schema.json`
- `docs/versioned/manifest.json`
- `docs/versioned/rollback.json`
- `SECURITY.md`
- `schemas/performance-budget.schema.json`
- `test/baselines/roadmap/performance-budgets.json`
- `tools/benchmark-roadmap-performance.tsx`

Commands and probes:

- Confirmed all 13 candidate source directories and registry records are absent.
- Confirmed RAC 1.19.0 exports `Group`, table-specific `ResizableTableContainer`, and only unstable Toast primitives.
- Confirmed React Aria 3.50.0 exports `useMove`.
- Confirmed current Table does not implement general panel resizing.
- Confirmed React Spectrum Skeleton is not exported by React Aria Components and is not in React’s current dependency topology.
- Confirmed `CodeBlock` is block-oriented and no distinct inline `Code` component exists.
- Confirmed `ToggleButtonGroup` is selection-oriented and `SocialButtonGroup` is provider-specific.
- Confirmed both React Aria documents still state a `^1.19.0` target.
- Confirmed the disposition schema rejects the expansion inventory, top-level `source`, and record-level `a2uiDisposition`.
- Confirmed Timestamp, Blockquote, and Citation currently remain `defer` in Content dispositions.
- Confirmed the Chat RFC currently defers generic Markdown.
- Confirmed `@tale-ui/react-styles` exposes one package export per component CSS file and imports every component stylesheet through `src/index.css`.
- Confirmed `tools/run-changed-a11y.mjs` treats `packages/styles/src/index.css` as `shared-foundation-change`, retains changed paths/slugs, and reports selected story IDs.
- Confirmed the current component-performance fixtures do not exist.
- Confirmed the 12 maintained templates and their current schema/content versions.
- Confirmed historical React tags declared Node `>=14` while depending on MCP SDK 1.28.0, which requires Node `>=18`.
- Confirmed publication before raw Toast `close` or `clear` observes the old upstream `visibleToasts` array and is invalid.
- `pnpm roadmap:contracts:check` passed: 39 schemas, five frozen inventories, 877 artifacts, 58 traceability criteria.
- `pnpm figma:check` passed: 120 components and 276 variants.
- `pnpm templates:check` passed: 12 deterministic templates.
- `pnpm recipes:validate` passed: 45 recipes.
- `pnpm audit:coverage:check` passed.
- `git rev-parse release-v2.0.0` previously resolved to `be1b3be433ddf244f57e252260afda448249169d`.
- `git rev-parse react-v1.3.56` previously resolved to `16e8ae2b3f26fdc2015cc10aa2d689edcbf60ca2`.

## Current Understanding

The registry currently contains 120 component records. Generated Figma output contains 120 component records, 120 code connections, 276 variants, one token record, and 517 public records.

### Candidate inventory

Every candidate directory and registry record is absent. The matrix records the inspected current Tale state, verified upstream or native state, and resulting ownership boundary.

| Candidate    | Current Tale state or nearest credible composition                                                                              | Verified upstream/native state and evidence                                                                                                 | Ownership decision                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| AspectRatio  | No registered primitive. `packages/styles/src/icon-button.css` uses `aspect-ratio: 1`, but IconButton is a specialized control. | No RAC export in `react-aria-components/dist/types/exports/index.d.ts`; CSS `aspect-ratio` is native.                                       | Tale-owned CSS/native primitive.                                                   |
| Blockquote   | No semantic blockquote namespace. TextEditor has editor-only ProseMirror blockquote styling.                                    | No RAC export; `blockquote`, `p`, and `footer` are native HTML semantics.                                                                   | Tale-owned semantic composition.                                                   |
| ButtonGroup  | `ToggleButtonGroup` is selection-oriented and `SocialButtonGroup` is provider-specific.                                         | RAC `Group` and `GroupProps` are declared in `dist/types/src/Group.d.ts`.                                                                   | Restricted Tale wrapper around RAC `Group`; no selection API.                      |
| Citation     | No normalized source registry, ordinal sharing, reference/list identity, or URL policy.                                         | No RAC citation primitive; anchors, `sup`, `ol`, and `time` are browser semantics.                                                          | Tale-owned normalized citation registry.                                           |
| Code         | `CodeBlock` is block content and explicitly excludes Markdown/execution; no distinct inline Code component.                     | No RAC inline-code primitive; native `code` supplies semantics.                                                                             | Tale-owned inline semantic primitive, distinct from CodeBlock.                     |
| Lightbox     | Dialog supplies overlay/focus behavior and Carousel supplies browsing, but neither is an item-keyed lightbox.                   | No RAC Lightbox export; current Tale Dialog, Button, and `useSwipeDismiss` are reusable.                                                    | Tale composition over existing Tale primitives and utilities.                      |
| Markdown     | Chat accepts React children/plain text and explicitly defers generic Markdown; TextEditor is an editor.                         | RAC provides no parser or bounded renderer. HTML parsing is insufficient for the required trust boundary.                                   | Tale-owned bounded renderer behind Gate A.                                         |
| Outline      | No document-outline observer/navigation component. Link can provide anchor behavior only.                                       | No RAC Outline export; `nav`, nested lists, anchors, and `IntersectionObserver` are browser facilities.                                     | Tale-owned links and per-instance observer model.                                  |
| OverflowList | No fit-measured list with overflow control, convergence guard, or focus handoff.                                                | No RAC OverflowList export; `ResizeObserver`, layout measurement, and animation frames are browser facilities.                              | Tale-owned measurement/focus state machine.                                        |
| Resizable    | No general panel component. Tale Table does not export a general resizer.                                                       | RAC `ResizableTableContainer` in `Table.d.ts` is table/column-specific. React Aria 3.50.0 exports `useMove`.                                | Tale-owned general panel model using direct `useMove`; do not wrap table resizing. |
| Skeleton     | No first-class decorative Skeleton component.                                                                                   | React Spectrum has a Skeleton concept, but RAC 1.19.0 exposes none and no Spectrum Skeleton package is part of React’s dependency topology. | Tale-owned decorative primitive; do not represent it as a RAC wrapper.             |
| Timestamp    | No locale/timezone-aware absolute/relative formatter or shared scheduler.                                                       | No RAC Timestamp export; `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, and native `time` are platform APIs.                             | Tale-owned `Intl` formatter and scheduler.                                         |
| Toast        | No public Tale queue or Region API.                                                                                             | RAC exports only `UNSTABLE_Toast*`; its queue comes from React Stately, as shown in `Toast.d.ts` and the RAC index.                         | Tale-owned public queue/Region over a private unstable adapter.                    |

The registry extractor cannot currently flatten the proposed ButtonGroup and Timestamp unions or select `ToastRegionProps`; a scoped local-declaration extension is required to retain all intended enum values.

All 12 Tooling templates currently use:

- `schemaVersion: "1.0.0"`
- Content `version: "1.0.0"`
- React `^2.0.0`
- Tale compatibility `>=2.0.0 <3.0.0`

Tooling is independently versioned at `0.1.0`, packages its templates, and requires Node `>=22`.

Every new component starts `experimental`. Stable promotion requires:

- Maintained browser, visual, accessibility, SSR/hydration, packaging, and performance evidence.
- A public hero page.
- At least one consumer-feedback release cycle.
- No unresolved lifecycle, security, packaging, or accessibility incident.
- For Toast, stable upstream primitives or explicit approval to retain the unstable adapter.

For Toast, subscriber publication must occur only after the current raw generation, Tale mirror, partitions, maps, and RAC-facing `visibleToasts` agree. A raw failure before publication must rebuild or poison-reset the generation; a subscriber failure after publication must not resurrect already observed dismissals.

Excluded components remain AvatarGroup, ClickableCard, Heading, Grid utilities, MobileNav, StatusDot, and VisuallyHidden because existing Tale components or compositions already cover them.

## Assumptions

The following are authorized decisions, not unresolved assumptions:

- The request reopens prior Blockquote, Citation, Timestamp, and Markdown deferrals.
- Repository development remains Node 22+/pnpm 10+.
- Packed React 3 consumers require Node 18+.
- The six synchronized packages are prepared at exact `3.0.0`.
- Tooling is prepared independently at `0.2.0`.
- `tale-ui-mcp` remains in React.
- A2UI publication, native implementations, authenticated live-Figma parity, and new template IDs remain outside scope.
- Gate A resolves the exact Markdown parser or repository-built parser artifact before Bundle 2.
- Performance capture occurs only inside the owning bundle; CI and final checks are read-only.
- This plan recommends no Tale release for Node 14 or Node 16.

There are no unresolved implementation, topology, dependency, release, or sequencing decisions.

## Proposed Changes

### Shared safety, event ownership, state, and identity

Define private helpers:

```ts
type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

type OwnedActionTargetProp =
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onKeyPress'
  | 'onClick'
  | 'onAuxClick'
  | 'onContextMenu'
  | 'onDoubleClick'
  | 'onMouseDown'
  | 'onMouseMove'
  | 'onMouseUp'
  | 'onMouseOver'
  | 'onMouseOut'
  | 'onTouchStart'
  | 'onTouchMove'
  | 'onTouchEnd'
  | 'onTouchCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onPointerOver'
  | 'onPointerOut'
  | 'onGotPointerCapture'
  | 'onLostPointerCapture'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop';

type OwnedActionCaptureProp = `${OwnedActionTargetProp}Capture`;

type OwnedActionDomProp = OwnedActionTargetProp | OwnedActionCaptureProp;
```

Rules:

- Runtime-strip `dangerouslySetInnerHTML` from content-bearing components.
- Apply Tale-owned identity, role, ARIA, focus, sizing, callback, handler, and owned styles after permitted consumer props.
- `Resizable.Root` and `Lightbox.Root` omit and runtime-strip all owned capture handlers.
- Resizable Handles and Lightbox controls omit and runtime-strip all owned target/capture handlers and component-specific press APIs.
- Permitted Root bubble handlers run after the Tale descendant action.
- Runtime-stripped handlers never execute and emit at most one code-only, value-free development diagnostic per invalid generation.

Add `packages/react/src/utils/safeUrl.ts` using WHATWG `URL`. It must not read browser location and must reject malformed input, credentials, control characters, unsupported protocols, and relative input without a valid explicit base.

Outline active state, Resizable sizes, and Lightbox open/selection use mount-stable controlled/uncontrolled modes:

1. A domain is controlled when its controlled value is not `undefined`.
2. Supplying both controlled and default props invalidates that domain.
3. The first valid unambiguous render fixes the mode until remount.
4. Defaults are read only during valid uncontrolled initialization.
5. Omitting an established controlled value or adding one to an established uncontrolled domain invalidates the generation.
6. Invalid generations retain the last valid internal snapshot only for recovery, visibly fail closed, emit no callbacks, and cancel gestures, observers, frames, timers, focus work, or proposals.
7. Returning to the established valid mode recovers synchronously.
8. A colliding first render remains inert until valid.
9. Mode changes require remounting.

OverflowList and Lightbox keys accept only strings, finite numbers, and bigints at runtime. Numbers use SameValueZero, so `0` and `-0` collide. `"1"`, `1`, and `1n` remain distinct. Callbacks receive original keys; internal maps and DOM IDs use type-tagged tokens and generation-local indices.

### Public TypeScript and behavioral contracts

#### AspectRatio

```ts
export interface AspectRatioProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
> {
  ratio?: number | `${number}/${number}` | `${number} / ${number}`;
  objectFit?: 'cover' | 'contain';
  children: React.ReactNode;
}
```

Export `AspectRatio` and `AspectRatioProps` from `@tale-ui/react/aspect-ratio`; forward `HTMLDivElement`.

The default ratio is `1`. Numbers must be finite and positive. Strings must contain exactly two finite positive decimals separated by `/`. Invalid ratios use `1`; invalid `objectFit` is omitted. Tale owns `style.aspectRatio`; other style fields remain. `objectFit` affects documented direct-child `img` and `video` selectors only. Children are not cloned.

#### Blockquote

```ts
export interface BlockquoteRootProps extends SafeDomProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
> {
  children: React.ReactNode;
}

export interface BlockquoteContentProps extends SafeDomProps<
  React.HTMLAttributes<HTMLParagraphElement>
> {
  children: React.ReactNode;
}

export interface BlockquoteAttributionProps extends SafeDomProps<
  React.HTMLAttributes<HTMLElement>
> {
  children: React.ReactNode;
}
```

Export namespace `Blockquote` and all part-prop types from `@tale-ui/react/blockquote`.

Refs:

- Root: `HTMLQuoteElement`
- Content: `HTMLParagraphElement`
- Attribution: `HTMLElement`, rendered as `footer`

`Root.cite` accepts credential-free absolute HTTP(S) only. Invalid values are omitted with a value-free diagnostic.

#### ButtonGroup

```ts
type ButtonGroupAccessibleName =
  | {
      role?: 'group' | 'region';
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      role?: 'group' | 'region';
      'aria-label'?: never;
      'aria-labelledby': string;
    }
  | {
      role: 'presentation';
      'aria-label'?: never;
      'aria-labelledby'?: never;
    };

type AriaGroupProps = import('react-aria-components').GroupProps;

export type ButtonGroupProps = Omit<
  AriaGroupProps,
  | 'children'
  | 'className'
  | 'style'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
> &
  ButtonGroupAccessibleName & {
    orientation?: 'horizontal' | 'vertical';
    isAttached?: boolean;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  };
```

Export `ButtonGroup` and `ButtonGroupProps` from `@tale-ui/react/button-group`; forward `HTMLDivElement`.

Defaults are horizontal, detached, and `role="group"`. Preserve supported RAC slot, hover, focus-within, disabled, invalid, and read-only behavior. Do not expose render-function children/class/style or selection semantics.

Invalid orientation uses horizontal. Invalid `isAttached` uses false. An invalid role/name combination becomes presentation and removes both naming attributes.

#### Citation

```ts
export interface CitationSource {
  id: string;
  title: string;
  href?: string;
  author?: string;
  publisher?: string;
  publishedAt?: string;
}

export interface CitationRootProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'id'>
> {
  id: string;
  sources: readonly CitationSource[];
  baseUrl?: string;
  children: React.ReactNode;
}

export interface CitationReferenceProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLElement>, 'children'>
> {
  sourceId: string;
  children?: React.ReactNode;
}

export interface CitationListProps extends SafeDomProps<
  Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children' | 'reversed' | 'start' | 'type'>
> {
  emptyFallback?: React.ReactNode;
}
```

Export namespace `Citation`, `CitationSource`, and every part-prop type from `@tale-ui/react/citation`.

Refs are `HTMLDivElement`, `HTMLElement` rendered as `sup`, and `HTMLOListElement`.

Normalization is atomic:

- `sources` must be an array.
- Entries must be non-null, non-array objects with non-throwing property access.
- Root IDs, source IDs, and titles must be non-whitespace strings.
- Root/source IDs match `[A-Za-z][A-Za-z0-9_-]*`.
- Source IDs must be unique.
- Invalid optional fields are omitted.
- Accepted records are copied into immutable internal data.
- Any invalid required record invalidates the registry; no partial registry remains active.

Ordinals follow normalized source order. Repeated References share an ordinal. Entry IDs are `${rootId}-source-${ordinal}`.

Known References default to `[n]`; explicit children, including `null`, replace visible content but not the owned target or accessible name. Unknown References render explicit children or `[?]`, have no anchor, and own `aria-label="Unavailable citation"`.

Absolute credential-free HTTP(S) URLs remain links. Relative, fragment, and protocol-relative URLs require a valid absolute credential-free HTTP(S) base. Invalid URLs preserve escaped metadata without an anchor.

`publishedAt` accepts complete offset-bearing timestamps. Valid values render UTC-normalized `dateTime`; invalid non-empty strings remain escaped text; empty or wrong-type values are omitted.

List renders normalized sources in ordinal order. Tale runtime-strips `reversed`, `start`, and `type`, then applies owned `start={1}` and `type="1"`. Empty/invalid registries render `emptyFallback` or an empty `ol`.

#### Code

```ts
export interface CodeProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLElement>, 'children'>
> {
  children: string;
}
```

Export `Code` and `CodeProps` from `@tale-ui/react/code`; render `code` and forward `HTMLElement`.

Escape content and never parse, highlight, fetch, or execute it. Invalid runtime children render empty content.

#### Markdown

```ts
export interface MarkdownProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
> {
  children: string;
  baseUrl?: string;
  invalidFallback?: React.ReactNode;
}
```

Export `Markdown` and `MarkdownProps` from `@tale-ui/react/markdown`; forward `HTMLDivElement`.

Expose no plugin, raw-HTML, AST, renderer, URL-transformer, highlighter, or executable-extension API.

Support paragraphs, headings, emphasis, strong text, lists, thematic breaks, blockquotes, links, inline code, and fenced code. Map inline code to Code, fenced code to CodeBlock, blockquotes to Blockquote, and links to Tale Link.

Limits:

- 100,000 UTF-16 source units.
- 10,000 units per line.
- Nesting depth 32.
- 10,000 parsed nodes before filtering.

Raw HTML is omitted. Images and resources become non-fetching text fallbacks. Links allow fragments, HTTP(S), and `mailto:`; relative links require a valid base. Credentials, malformed URLs, and unsupported protocols become plain text.

Wrong-type input, any limit violation, parser failure, or filtering failure discards the result and renders only `invalidFallback`, defaulting to `Content unavailable`. Diagnostics use stable code-only reasons. Chat remains unchanged.

#### Timestamp

```ts
export type TimestampValue = Date | number | string;

export type TimestampFormatOptions = Omit<Intl.DateTimeFormatOptions, 'timeZone'>;

interface TimestampBaseProps extends SafeDomProps<
  Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'children' | 'dateTime'>
> {
  value: TimestampValue;
  locale: string;
  timeZone: string;
  invalidFallback?: React.ReactNode;
}

export interface AbsoluteTimestampProps extends TimestampBaseProps {
  format?: 'date' | 'time' | 'datetime';
  formatOptions?: TimestampFormatOptions;
  now?: never;
  refreshInterval?: never;
}

export interface RelativeTimestampProps extends TimestampBaseProps {
  format: 'relative';
  formatOptions?: never;
  now: TimestampValue;
  refreshInterval?: number;
}

export type TimestampProps = AbsoluteTimestampProps | RelativeTimestampProps;
```

Export `Timestamp`, `TimestampValue`, `TimestampFormatOptions`, `AbsoluteTimestampProps`, `RelativeTimestampProps`, and `TimestampProps` from `@tale-ui/react/timestamp`; forward `HTMLTimeElement`.

Default format is `datetime`. Freeze these presets:

```ts
const presets = {
  date: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  time: {
    hour: 'numeric',
    minute: '2-digit',
  },
  datetime: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  },
} satisfies Record<string, Intl.DateTimeFormatOptions>;
```

Consumer options override preset fields; Tale applies `timeZone` last.

Dates are copied. Numbers are finite epoch milliseconds. Strings require complete offset-bearing timestamps. Valid values own a UTC-normalized `dateTime`.

Invalid values, locale, timezone, formatter options, formatter construction/execution, `now`, or interval render the fallback, defaulting to an em dash. Preserve a valid normalized `dateTime` when only formatting fails.

Relative delta is target minus effective now. Use fixed seconds, minutes, hours, days, seven-day weeks, 30-day months, and 365-day years. Exact halves round away from zero. Use `Intl.RelativeTimeFormat(locale, {numeric: 'auto', style: 'long'})`.

Refresh defaults to 60,000 ms. Zero disables it. Enabled values must be finite and at least 1,000 ms. A shared scheduler groups subscribers by interval through Tale timer utilities. SSR and first hydration use supplied `now`. Mount anchors elapsed time without replacing hydration output. Changing `now` resets the anchor; changing interval resubscribes; final unsubscribe clears the interval.

#### Outline

```ts
export interface OutlineItem {
  id: string;
  targetId: string;
  label: string;
  level: number;
}

type OutlineAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type OutlineActiveState =
  | {
      activeId: string | null;
      defaultActiveId?: never;
      onActiveChange?: (id: string | null) => void;
    }
  | {
      activeId?: never;
      defaultActiveId?: string | null;
      onActiveChange?: (id: string | null) => void;
    };

interface OutlineBaseProps extends SafeDomProps<
  Omit<
    React.HTMLAttributes<HTMLElement>,
    'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'onChange'
  >
> {
  items: readonly OutlineItem[];
  onAction?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  observeTargets?: boolean;
  getObserverRoot?: (nav: HTMLElement) => Element | Document | null;
  observerRootMargin?: string;
  observerThreshold?: number | readonly number[];
}

export type OutlineProps = OutlineBaseProps & OutlineAccessibleName & OutlineActiveState;
```

Export `Outline`, `OutlineItem`, and `OutlineProps` from `@tale-ui/react/outline`; forward `HTMLElement`.

Validation:

- Items are valid non-null objects with unique valid logical and target IDs, non-whitespace labels, and valid levels.
- First level is 1; levels are positive integers, increase by at most one, and may decrease only to a prior ancestor.
- Controlled active IDs are null or present.
- Invalid initial defaults become null.
- Invalid naming renders a non-landmark `div` and disables observation/actions.
- Invalid item data renders safely derived links only and disables active behavior.

Invalid runtime observer/callback props fail locally: invalid observation settings disable observation, while valid click behavior remains. Thrown `getObserverRoot` disables observation with a code-only diagnostic.

Render a named `nav` containing nested `ol`/`li`. Links use `href="#${targetId}"`; resolve targets only through `nav.ownerDocument`.

Defaults are observation enabled, viewport root, margin `0px 0px -70% 0px`, and thresholds `[0, .25, .5, .75, 1]`.

Valid primary unmodified activation calls `onAction` first. `preventDefault()` suppresses the active proposal. Uncontrolled state updates before `onActiveChange`; controlled mode proposes only. Unchanged values produce no callback.

Observation uses one observer and one pending frame per instance, complete generation identities, stale-work rejection, deterministic geometric selection, and independent cleanup for instances observing the same targets.

Reconfiguration:

- A committed item/root/observer change invalidates and cleans the prior generation before installing the next.
- Controlled mode never projects. Reorder preserves a present active ID. If a valid new collection omits a non-null controlled ID, render with no active marker and disable actions/observation/callbacks until null or a present ID is supplied.
- Uncontrolled reorder preserves the current logical ID without callback.
- Removing the uncontrolled active ID clears the marker immediately, then commits `null` and calls `onActiveChange(null)` once in an isomorphic layout effect before observation resumes.
- Stale or superseded reconciliation effects emit nothing.
- Post-mount `defaultActiveId` changes are ignored.

#### OverflowList

```ts
export interface OverflowRenderContext {
  overflowControlRef: React.RefCallback<HTMLElement>;
}

export interface OverflowListProps<T> extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'tabIndex'>
> {
  items: readonly T[];
  getKey: (item: T) => React.Key;
  renderItem: (item: T) => React.ReactNode;
  renderOverflow: (hiddenItems: readonly T[], context: OverflowRenderContext) => React.ReactNode;
  collapseFrom?: 'start' | 'end';
  minVisibleItems?: number;
  measurementKey?: React.Key;
  onVisibilityChange?: (visibleItems: readonly T[], hiddenItems: readonly T[]) => void;
}
```

Export the generic component and every named type from `@tale-ui/react/overflow-list`; forward `HTMLDivElement`.

Defaults are end collapse and minimum zero.

Invalid-runtime outcomes:

- Non-array `items`: empty Root; no accessor, renderer, or callback.
- Non-function `renderItem`: empty Root.
- Non-function `getKey`, thrown access, unsupported/duplicate keys, invalid minimum/measurement key, or non-function `renderOverflow`: call valid `renderItem` once per item and render all items without control, measurement, focus movement, or visibility callback.
- Invalid `collapseFrom` falls back to `end`.
- Non-function `onVisibilityChange` is absent; valid measurement continues.
- Render callback exceptions retain normal React error-boundary behavior.

Invoke `getKey` once per item per collection generation and `renderItem` once per item per React render. Invoke `renderOverflow` exactly once only for a committed hidden vector. Never create duplicate or speculative control trees.

SSR and first hydration render all items. Measure Root content-box inline size, item/control border boxes, and gaps. Search from all items down to the minimum within 0.5 CSS px. End collapse uses visible prefix/hidden suffix; start collapse uses hidden prefix/visible suffix. If the minimum cannot fit, retain the minimum and control despite overflow.

Disconnected or zero-width Roots render all items and retry later. Cycle identity is `(ordered visible keys, rounded control width)`. Stop on repetition or after more than `2 × (items.length + 1)` passes. Permit at most one partition update per frame.

Generation changes cancel observer, frames, cycle history, focus proposals, and the published partition. First measurable settlement publishes once; later settlements publish only when ordered partitions change.

Before hiding focused content, record the exact descendant/key/token. Handoff order is enabled overflow control, nearest visible item focusable descendant, then Root with owned `tabIndex={-1}`. Restore only if the exact descendant returns and no user movement invalidated the token.

#### Resizable

```ts
export type ResizablePanelId = string;

export type ResizableSizes = Readonly<Record<ResizablePanelId, number>>;

export interface ResizableChangeMeta {
  handleId: string;
  source: 'pointer' | 'keyboard';
}

type ResizableSizeState =
  | { sizes: ResizableSizes; defaultSizes?: never }
  | { sizes?: never; defaultSizes?: ResizableSizes };

interface ResizableRootBaseProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | OwnedActionCaptureProp>
> {
  orientation?: 'horizontal' | 'vertical';
  onSizesChange?: (sizes: ResizableSizes, meta: ResizableChangeMeta) => void;
  onSizesCommit?: (sizes: ResizableSizes, meta: ResizableChangeMeta) => void;
  keyboardStep?: number;
  keyboardLargeStep?: number;
  precision?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  children: React.ReactNode;
}

export type ResizableRootProps = ResizableRootBaseProps & ResizableSizeState;

export interface ResizablePanelProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'id'>
> {
  id: ResizablePanelId;
  minSize?: number;
  maxSize?: number;
  children?: React.ReactNode;
}

type ResizableHandleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type ResizableOwnedHandleProp =
  | OwnedActionDomProp
  | 'role'
  | 'tabIndex'
  | 'draggable'
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-orientation'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext';

export type ResizableHandleProps = SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, ResizableOwnedHandleProp>
> &
  ResizableHandleName & {
    id: string;
    before: ResizablePanelId;
    after: ResizablePanelId;
    isDisabled?: boolean;
  };
```

Export namespace `Resizable` and every named public type from `@tale-ui/react/resizable`. All parts forward `HTMLDivElement`.

Topology grammar is `Panel (Handle Panel)+`. Flatten fragments/arrays, ignore nullish/boolean children, and accept direct Tale Panels/Handles only. IDs are valid, unique by kind, cross-kind-disjoint, and Root-local. Handles name exact adjacent Panels. Invalid topology renders content without Tale flex bases and with inert Handles.

Defaults are horizontal, keyboard step 1, large step 10, precision 4, min 0, max 100, enabled, and read/write.

Bounds satisfy `0 <= min <= max <= 100` and global feasibility. Records contain exactly current Panel IDs, finite values within bounds, and sum to 100 within `10^-precision`. Normalize residual to the first DOM-order Panel with capacity.

When no size prop is supplied, initialize every Panel at minimum and distribute the remainder equally across available capacity, iterating in DOM order; round and place residual.

Uncontrolled topology or bound reconfiguration:

1. Cancel an active gesture.
2. Seed retained IDs from last committed sizes.
3. Seed added IDs at new minima; discard removed IDs.
4. Clamp seeds to new bounds.
5. Water-fill deficits or excess equally among Panels with capacity, removing saturated Panels each round.
6. Use DOM order only for rounding ties and residual placement.
7. Commit without callbacks because callback metadata represents user gestures only.
8. Reorder preserves values by logical ID.
9. Bound tightening uses the same projection.
10. Recovery from invalid input projects once from the last valid snapshot.
11. Post-mount `defaultSizes` changes are ignored.

Controlled mode never projects. Missing/extra IDs, invalid bounds, or invalid sums cancel gestures, remove Tale flex/ARIA values, emit no callbacks, and retain the prior snapshot only for recovery. A later valid exact record recovers synchronously.

Handle bounds use the adjacent pair total. Horizontal pointer deltas use Root size and RTL direction; vertical uses height. Keyboard supports arrows, Shift+Arrow, PageUp/PageDown, Home, and End. Accepted no-op mutations emit no callback. Uncontrolled mutations commit before callbacks; controlled mode proposes only. Keyboard mutations emit change then commit. Pointer movement emits changes and successful completion emits one commit.

Only one pointer gesture may own a Root. Second acquisition and keyboard mutation from another Handle are rejected while owned. Duplicate acquisition/completion is idempotent. Controlled continuation requires acknowledgement equal to the last proposal at configured precision. Topology/bounds changes, divergent acknowledgement, resize, invalidation, disabled/read-only changes, capture loss, cancellation, or unmount cancel without commit.

#### Lightbox

```ts
export interface LightboxRenderContext {
  key: React.Key;
  index: number;
  count: number;
}

type LightboxOpenState =
  | {
      isOpen: boolean;
      defaultOpen?: never;
      onOpenChange?: (open: boolean) => void;
    }
  | {
      isOpen?: never;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
    };

type LightboxSelectionState<T> =
  | {
      selectedKey: React.Key | null;
      defaultSelectedKey?: never;
      onSelectionChange?: (key: React.Key | null, item: T | null) => void;
    }
  | {
      selectedKey?: never;
      defaultSelectedKey?: React.Key | null;
      onSelectionChange?: (key: React.Key | null, item: T | null) => void;
    };

interface LightboxRootBaseProps<T> extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | OwnedActionCaptureProp>
> {
  items: readonly T[];
  getKey: (item: T) => React.Key;
  getLabel: (item: T) => string;
  renderContent: (item: T, context: LightboxRenderContext) => React.ReactNode;
  loop?: boolean;
  swipeNavigation?: boolean;
  children: React.ReactNode;
}

export type LightboxRootProps<T> = LightboxRootBaseProps<T> &
  LightboxOpenState &
  LightboxSelectionState<T>;

type LightboxOwnedActivation =
  | 'onPress'
  | 'onPressStart'
  | 'onPressEnd'
  | 'onPressChange'
  | 'onPressUp'
  | 'onClick';

type LightboxOwnedControlProp = LightboxOwnedActivation | OwnedActionDomProp;

type LightboxOwnedOpenStateProp = 'isOpen' | 'defaultOpen' | 'onOpenChange';

type LightboxControlName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string }
  | { 'aria-label'?: never; 'aria-labelledby'?: never };

export type LightboxTriggerProps = Omit<
  ButtonProps,
  LightboxOwnedControlProp | 'children' | 'className' | 'style' | 'dangerouslySetInnerHTML'
> & {
  itemKey: React.Key;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type LightboxBackdropProps = Omit<
  DialogBackdropProps,
  LightboxOwnedOpenStateProp | 'className' | 'dangerouslySetInnerHTML'
> & {
  className?: string;
};

export type LightboxPopupModalProps = Omit<
  NonNullable<DialogPopupProps['modalProps']>,
  LightboxOwnedOpenStateProp
>;

export type LightboxPopupProps = Omit<
  DialogPopupProps,
  'className' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'modalProps'
> & {
  className?: string;
  modalProps?: LightboxPopupModalProps;
};

export type LightboxContentProps = SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
>;

export interface LightboxCaptionProps extends SafeDomProps<
  React.HTMLAttributes<HTMLParagraphElement>
> {
  children?: React.ReactNode;
}

export type LightboxPreviousProps = Omit<
  ButtonProps,
  | LightboxOwnedControlProp
  | 'children'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
> &
  LightboxControlName & {
    children?: React.ReactNode;
  };

export type LightboxNextProps = LightboxPreviousProps;

export type LightboxCloseProps = Omit<
  DialogCloseProps,
  | LightboxOwnedControlProp
  | 'slot'
  | 'children'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
> &
  LightboxControlName & {
    children?: React.ReactNode;
  };
```

Export namespace `Lightbox` and every named public type from `@tale-ui/react/lightbox`.

Refs:

- Root, Content, Backdrop: `HTMLDivElement`
- Trigger, Previous, Next, Close: `HTMLButtonElement`
- Popup: `HTMLElement`
- Caption: `HTMLParagraphElement`

Collection validation:

- `items` must be an array.
- `getKey`, `getLabel`, and `renderContent` must be functions.
- Invoke `getKey`, then `getLabel`, once per item per collection generation.
- Unsupported/duplicate keys, invalid labels, accessor throws, or invalid callback shapes invalidate the entire collection atomically.
- Invalid collections render Root children, force the overlay closed, make controls inert, invoke no content/state callback, and cancel swipe, focus, and navigation work.
- Valid render callback exceptions retain normal React error-boundary behavior.

Trigger keys must be valid and present. Invalid/stale keys make only that Trigger inert. Multiple Triggers may refer to one item while preserving distinct focus-restoration identity.

Defaults are closed, first valid item selected, `loop=false`, and `swipeNavigation=true`. Invalid uncontrolled defaults normalize to first item/null; wrong-type controlled values, branch collisions, and mode switches use the shared fail-closed contract.

A controlled selection absent from a valid collection proposes `null` once and then close once. An uncontrolled removed selection normalizes to the first item/null and emits selection before close in an isomorphic layout effect.

Trigger proposes selection before open. Root is the sole open authority. Backdrop and Popup/modal props cannot receive open-state authority. Dismissal applies/proposes close exactly once.

Navigation stops at boundaries unless looping. One item is a no-op. Only the topmost focused open Lightbox handles arrows/swipes. Duplicate native/RAC/Tale dispatch is correlated per user action.

Swipe uses current `useSwipeDismiss`, its 40 CSS-pixel threshold, interactive-target exclusion, scroll-conflict protection, and reduced-motion behavior. Lightbox derives writing direction from the Popup owner document and reverses the previous/next mapping in RTL; `useSwipeDismiss` continues to report physical left/right directions. RAC retains focus containment, Escape/backdrop dismissal, and stacking.

Popup owns the current item label. Caption defaults to the item label only when `children === undefined`; explicit `null` remains empty. Close owns `slot="close"`.

Previous, Next, and Close use localized names unless one valid explicit name is supplied. Invalid simultaneous/wrong-type/whitespace names fall back to localized labels.

Focus restoration waits one frame after RAC and tries the initiating Trigger, last-selected Trigger, first Trigger, focusable Root, then no imperative focus.

#### Skeleton

```ts
export interface SkeletonProps extends SafeDomProps<
  Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    | 'children'
    | 'aria-hidden'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
    | 'role'
    | 'tabIndex'
    | 'contentEditable'
  >
> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  animation?: 'pulse' | 'none';
}
```

Export `Skeleton` and `SkeletonProps` from `@tale-ui/react/skeleton`; forward `HTMLSpanElement`.

Render an empty span with owned `aria-hidden="true"`. Defaults are text and pulse. Dimensions override matching style fields. Non-finite numeric dimensions are omitted. Invalid variants/animations use defaults. Reduced motion disables animation. Consumers own loading announcements.

#### Toast

```ts
export interface ToastMessage {
  title: string;
  description?: string;
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
}

export interface CreateToastQueueOptions {
  maxVisibleToasts?: number;
  defaultTimeout?: number;
}

export interface ToastAddOptions {
  timeout?: number;
  onClose?: () => void;
}

export interface ToastQueue {
  add(message: ToastMessage, options?: ToastAddOptions): string;
  close(key: string): void;
  clear(): void;
  pauseAll(): void;
  resumeAll(): void;
}

export function createToastQueue(options?: CreateToastQueueOptions): ToastQueue;

export interface ToastRegionProps {
  queue: ToastQueue;
  'aria-label'?: string;
  className?: string;
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  dismissLabel?: string;
}
```

Export `createToastQueue`, `ToastRegion`, and every named public type from `@tale-ui/react/toast`. Region forwards `HTMLDivElement`. No unstable RAC, raw queue, record, timer, key-map, adapter, or lease type escapes.

Runtime domains and errors are frozen:

- Queue/add/message options must be `undefined` or non-null, non-array objects; otherwise throw `TypeError` prefixed `Tale UI: ` and identify Toast as the failing subsystem.
- Every Toast validation and recovery error follows the public-error convention: state what happened, why the queue cannot continue, and the corrective action without exposing message values.
- `maxVisibleToasts` must be a number; wrong type throws `TypeError`; non-finite, non-integer, or `<= 0` throws `RangeError`.
- Default/per-toast timeout must be a number; wrong type throws `TypeError`; non-finite or negative throws `RangeError`; zero is persistent.
- Message title must be a string; wrong type throws `TypeError`; empty/whitespace-only throws `RangeError`.
- Description must be a string when supplied; otherwise `TypeError`.
- Variant must be one of the four declared strings; otherwise `TypeError`.
- `onClose` must be callable when supplied; otherwise `TypeError`.
- All queue/add/message validation completes before opaque-key allocation or Tale/upstream mutation.
- Invalid Region queue renders nothing.
- Invalid Region labels fall back to localization.
- Invalid Region placement falls back to `bottom-end`.
- Invalid Region render props never mutate the queue.

Defaults are one visible Toast, 5,000 ms, neutral, and bottom-end. Keys are queue-local opaque monotonic strings.

##### Stable adapter, raw generations, and atomic publication

Each public queue owns:

- A stable public Tale facade.
- A stable RAC-facing adapter identity and Tale-owned subscriber set.
- A RAC-facing `visibleToasts` snapshot owned by that stable adapter.
- A replaceable inner `UNSTABLE_ToastQueue<RawToastRecord>` generation.
- Tale-owned immutable records, visible/hidden partitions, timers, announcements, pause reasons, callbacks, and opaque↔raw maps.

The stable RAC-facing adapter extends or otherwise type-checks against the exact pinned upstream queue contract, but inherited raw storage is not the source of truth. It delegates mutations to the replaceable inner raw generation. `useToastQueue` therefore always subscribes to the stable adapter and reads the adapter-owned `visibleToasts`, even when the inner raw generation is rebuilt.

Neither the stable adapter nor any inner generation calls `super.subscribe`. Inner generation subscriber sets remain empty. Raw add, close, and clear may replace the inner generation’s own `visibleToasts`, but cannot publish until Tale has committed matching mirror state and assigned the aligned array to the stable adapter.

The adapter exposes only routed behavior:

- Internal `mutateAdd` calls the current inner raw generation’s `add(rawRecord)` with exactly one argument.
- Internal cleanup calls the current inner raw generation’s `close` or `clear`.
- Adapter `close(rawKey)` translates through the current reverse map and invokes Tale `close(opaqueKey)`.
- Adapter `pauseAll`/`resumeAll`, as called by `useToastRegion`, update only the current Region lease’s interaction-pause reason.
- Structurally reachable adapter `add` and `clear` route to Tale validation and transactions.
- Unknown raw or opaque keys are no-ops.
- Raw records have no upstream timer, timeout, or callback.
- Swapping an inner generation never changes the stable adapter identity or loses its subscriber set.

Before every publication, assert:

1. Every raw record has exactly one forward and reverse mapping.
2. Every mapping targets a current Tale record.
3. Raw order matches Tale newest-first order.
4. Raw and Tale visible partitions agree.
5. The stable adapter’s `visibleToasts` is the current raw generation’s aligned visible vector.
6. No removed record retains a timer, map entry, announcement lease, or callback ownership.

`add` transaction:

1. Validate and allocate the opaque key and immutable Tale record.
2. Call `mutateAdd` while raw and stable adapter subscribers remain silent.
3. After the raw key returns, install opaque→raw and raw→opaque mappings.
4. Commit the Tale mirror partition and announcement identity.
5. Assign the aligned raw visible vector to the stable adapter.
6. Verify all raw/Tale/map/partition invariants.
7. Publish adapter subscribers from that stable snapshot.
8. Only after successful visibility publication, start eligible Tale timers.
9. Return the opaque key.

Add failure handling:

- If raw add throws before returning a key, discard the damaged inner generation and rebuild a fresh inner generation from the previously committed Tale records, replayed oldest to newest.
- Rebuild raw keys and both maps in temporary structures. Swap them only after order, visibility, and mapping invariants pass.
- If raw-key acquisition succeeded but later add staging fails, remove that raw record. If removal fails, rebuild the previously committed generation.
- A successful rebuild assigns the rebuilt aligned snapshot to the stable adapter and publishes recovery before rethrowing the original raw error, because rebuilt raw keys invalidate previously rendered raw records.
- If rebuild fails, poison-reset as defined below.
- If an adapter subscriber throws during add publication, invoke every remaining subscriber, collect errors, roll back the new Tale record/maps/timer, remove it from raw state or rebuild the prior generation, publish the corrected committed snapshot, drain staged operations, and throw the original error or an ordered `AggregateError`.
- Tests inject failure before and after raw-key acquisition. No failed record, timer, callback, or raw orphan survives.

All dismissal paths—public close, RAC dismiss, timer expiry, clear, Region owner cleanup, and poison cleanup—enter the same Tale-owned transaction coordinator. Raw mutation must complete before Tale cleanup is published.

`close` transaction:

1. Unknown opaque keys are no-ops.
2. Snapshot the committed Tale/raw/map/partition/timer/callback state.
3. Stage, without publishing or consuming the callback:
   - removal of the Tale record;
   - visible promotion;
   - removal of both mappings;
   - timer cancellation;
   - callback consumption;
   - announcement cleanup.
4. Call the current raw generation’s `close(rawKey)` while all raw subscribers remain empty.
5. If raw close succeeds:
   - Commit the staged Tale partition, maps, timer cancellation, announcement cleanup, and callback-consumed marker.
   - Assign the raw generation’s new visible vector to the stable adapter.
   - Verify raw/Tale/map/partition agreement.
   - Publish every stable-adapter subscriber, invoking all subscribers even if one throws.
   - Invoke the consumer callback exactly once after publication, even when a subscriber threw.
   - Drain staged re-entrant operations.
   - Throw one collected error unchanged or an ordered `AggregateError`.
6. If raw close throws:
   - Discard the possibly mutated generation.
   - Rebuild the complete pre-close snapshot in a fresh raw generation, oldest to newest, with temporary raw keys/maps.
   - If rebuild succeeds, atomically restore the raw generation/maps, retain the pre-close Tale record, timer, callback, partitions, and announcement state, assign the rebuilt visible vector, verify invariants, publish recovery, drain staged operations, and rethrow the raw error together with any recovery-publication errors.
   - A timer-triggered close that rolls back re-arms its still-eligible zero-remaining timer on the next scheduler turn; its caught failure emits one code-only diagnostic.
   - If rebuild fails, perform poison-reset.

A subscriber exception after successful close publication does not resurrect the Toast: other subscribers still run, the committed aligned snapshot remains authoritative, callbacks still run once, and later publications continue from that state. This avoids exposing a close followed by an unintended reappearance.

`clear` transaction:

1. Snapshot all committed records and callbacks oldest first.
2. Stage an empty Tale partition, timer cancellation, map removal, callback consumption, and announcement cleanup without publishing.
3. Call the current raw generation’s `clear()` while raw subscribers remain empty.
4. On success:
   - Commit the empty Tale state.
   - Clear maps and timers.
   - Assign the raw empty vector to the stable adapter.
   - Verify all partitions and maps are empty.
   - Publish the empty snapshot to every subscriber, collecting rather than short-circuiting errors.
   - Invoke every callback oldest first despite callback or subscriber failures.
   - Preserve manual pause state.
   - Drain staged re-entrant operations.
   - Throw one error unchanged or an ordered aggregate.
5. On raw failure:
   - Rebuild and atomically restore the full pre-clear generation.
   - Preserve records, callbacks, timers, partitions, and manual pause state.
   - Publish the rebuilt aligned snapshot before rethrowing because raw keys changed.
   - If rebuild fails, perform poison-reset.

Poison-reset is the last-resort recovery when a damaged raw generation and its pre-transaction rebuild both fail:

1. Mark the public queue poisoned.
2. Cancel all Tale timers.
3. Clear Tale records, partitions, maps, announcements, and the stable adapter snapshot.
4. Discard every damaged raw generation.
5. Publish one consistent empty stable-adapter snapshot, invoking all subscribers despite errors.
6. Invoke callbacks for records discarded by the reset exactly once, oldest first.
7. Reject later public mutations with deterministic `Tale UI: Toast queue poisoned` errors; consumers must create a new public queue.
8. Throw an ordered aggregate containing the original raw error, rebuild error, publication errors, and callback errors.
9. Never leave a visible Toast whose reverse mapping has been removed.

Error aggregation order is deterministic:

1. Original raw-operation error.
2. Rebuild/poison errors.
3. Subscriber errors in registration order.
4. Consumer callback errors in callback order.
5. FIFO staged-operation errors.

Publication is single-threaded. Re-entrant mutations requested during mutation, recovery publication, normal publication, or callbacks enter a FIFO staging queue. Re-entrant `add` reserves an opaque key; a staged close may cancel it. Drain only after the current transaction has reached a verified committed, restored, or poison-reset snapshot. Each resulting mutation publishes its own stable snapshot.

Visible records are newest first. Hidden records remain descending by recency. Adding while full demotes the least-recent visible record. Removing a visible record promotes the newest hidden record at the visible tail. Removing hidden records leaves visible order unchanged.

Only visible records consume Tale timeout. Visibility publication precedes timer start/resume. Pause, demotion, or owner loss subtracts elapsed monotonic time once. Stale timer generations are ignored.

Manual pause, Region-interaction pause, and owner-loss pause are independent reasons. Pause operations never reorder, promote, announce, or invoke callbacks. A zero-remaining timer closes on the next scheduler turn after all reasons clear.

Neutral/success announcements are polite; warning/danger are assertive. Hidden records announce only on first committed visibility. Demotion, promotion, rerender, failover, timers, and pause do not reset identity.

Region registration is Strict-Mode-idempotent. SSR and first hydration are empty. One lease renders; production retains ordered non-rendering standbys and development diagnoses distinct simultaneous owners. Owner unmount promotes the oldest standby without changing partitions, timers, callbacks, maps, or announcement identity. Owner cleanup that dismisses records uses the same raw-first close/clear transaction and snapshot-order rules.

### Localization

Add exactly:

```json
{
  "lightbox.close": "Close lightbox",
  "lightbox.next": "Next item",
  "lightbox.previous": "Previous item",
  "toast.dismiss": "Dismiss notification",
  "toast.region": "Notifications"
}
```

Update the English source/catalog and i18n inventory. Verify provider overrides, catalog overrides, pseudo-localization, RTL, explicit labels, invalid-label fallback, and inventory equality.

### Node 18, versions, and compatibility documentation

Set `packages/react/package.json` to:

```json
{
  "engines": {
    "node": ">=18"
  }
}
```

Retain `tale-ui-setup`, `tale-ui-mcp`, and the MCP SDK in React. Do not migrate them to Tooling.

Compatibility guidance must state:

- React 3 supports React 17/18/19 and requires Node 18+.
- Repository development requires Node 22+ and pnpm 10+.
- React 2 remains the previous product major, but its manifest’s Node 14 declaration conflicted with its MCP SDK dependency’s Node 18 floor.
- React 1.3.56 contains the same mismatch.
- Neither historical manifest proves supported Node 14/16 operation.
- Node 14/16 users must upgrade Node; this plan recommends no historical Tale line for those runtimes.
- Maintained 2.x guidance is limited to Node 18+.

Prepare synchronized `3.0.0`, Tooling `0.2.0`, lockfile, changelogs, release notes, compatibility/migration docs, and the security support table.

Before claiming React 17 support, replace every direct `React.useId` call in the existing React package with the repository's React-17-compatible `@tale-ui/utils/useId` fallback and correct the fallback utility's inaccurate availability comment. Cover TextEditor, IPhoneMockup, FileUpload, InputTags, MultiSelect, and TagSelect in the React 17 packed-consumer matrix so importing, client rendering, SSR, and hydration prove that no React-18-only hook remains on a supported path. Exercise multiple IPhoneMockup instances and assert collision-free SVG IDs.

Pin v2 history to `release-v2.0.0` at `be1b3be433ddf244f57e252260afda448249169d`. Generate current v3, immutable v2, retained v1, rollback-to-v2, and provenance manifests. Do not create tags.

### Gate B

Complete before Bundle 1:

- Apply Node/version/documentation migrations.
- Pin RAC exactly to 1.19.0.
- Add exact direct `react-aria@3.50.0`; do not add direct `react-stately`.
- Add coupling tests for Group, unstable Toast, stable adapter snapshot ownership, replaceable raw generations, and `useMove`.
- Add public-type, package-export, CSS-export, and packed-consumer harnesses.
- Build tarballs on Node 22.
- Test Node 18/20/22/24 crossed with React 17/18/19.
- Verify CJS/ESM root and current subpaths, declarations, aggregate/per-component styles, SSR/hydration, postinstall, both binaries, and dependency engines.
- Verify Node 18 engine-strict installation succeeds and Node 16 rejects React 3.
- Audit pinned historical manifests/engines and freeze the no-Node-14/16 guidance.
- Preserve the legacy performance schema, eight-record baseline, and runner byte-for-byte.
- Add disposition, registry/Figma, template, changed-a11y, multi-document, multi-instance, duplicate-dispatch, and package-export infrastructure.

### React Aria adoption and deviation records

Update:

- `docs/upstream/react-aria-components.md`
- `docs/react-aria-deviations.md`

Required target changes:

- Replace public target text `^1.19.0` with exact `1.19.0`.
- Explain that the exact pin protects Tale adapters relying on Group, unstable Toast declarations/runtime shape, and the resolved `react-aria` stack.
- Keep the resolved dependency-stack table aligned with the manifest and lockfile.

Record these decisions explicitly:

| Area                      | Decision                                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ButtonGroup               | Adopt RAC 1.19.0 `Group` behind a Tale wrapper that owns naming, orientation, attached styling, and restricted render props.                                |
| Toast                     | Adapt `UNSTABLE_Toast`/`UNSTABLE_ToastRegion` privately; expose only Tale’s queue/Region API and retain experimental lifecycle.                             |
| Resizable                 | Use direct exact `react-aria@3.50.0` `useMove` for pointer movement while Tale owns topology, keyboard behavior, projection, state, ARIA, and cancellation. |
| `ResizableTableContainer` | Reject as the general Resizable implementation because its contract is table-column-specific.                                                               |
| Skeleton                  | Build a Tale-owned decorative primitive; React Spectrum Skeleton is not a React Aria Components primitive and creates no RAC wrapper opportunity.           |

`docs/upstream/react-aria-components.md` must state that every RAC upgrade reruns the Group, unstable Toast raw-object/snapshot, and `useMove` coupling tests before the exact pin changes. A dependency version change alone cannot promote Toast; promotion still requires stable upstream primitives or explicit approval to retain the unstable adapter.

`docs/react-aria-deviations.md` must describe these consumer-visible boundaries:

- ButtonGroup excludes RAC render-function children/class/style and owns accessible-name recovery.
- Resizable is a Tale state model using `useMove`, not a wrapper around `ResizableTableContainer`.
- Toast’s public queue is intentionally not structurally compatible with the upstream queue class.
- Skeleton is decorative, and consumers remain responsible for loading announcements.

Add `tools/react-aria-adoption-contract.test.mjs` and root script:

```json
{
  "scripts": {
    "react-aria:contracts:check": "node --test tools/react-aria-adoption-contract.test.mjs"
  }
}
```

The test parses the React manifest and both maintained documents and asserts:

- Exact RAC dependency `1.19.0`.
- Exact direct `react-aria` dependency `3.50.0` while Resizable exists.
- No direct `react-stately` dependency.
- Both documents declare exact target `1.19.0`.
- Each of the five decisions above has exactly one current structured record.
- Upgrade-review expectations name Group, Toast, and `useMove`.
- Neither document claims `ResizableTableContainer` is general panel resizing.
- Neither document claims React Spectrum Skeleton is a RAC primitive.
- ButtonGroup’s wrapper boundary, Toast’s unstable isolation, and Skeleton’s consumer-owned announcement boundary remain documented.

### Gate A

Run after Bundle 1 and immediately before Bundle 2:

1. Evaluate parser candidates for bounded synchronous parsing, Node 18, CJS/ESM, declarations, raw HTML handling, dependencies, maintenance, licence, advisories, and bundle cost.
2. Test raw/nested HTML, unsafe URLs, credentials, malformed links, images, autolinks, every limit, and parser exceptions.
3. Select one exact dependency or repository-built parser artifact.
4. Record version, licence, advisories, bundle delta, build topology, limits, and rollback in an ADR.
5. For a build-only artifact, name the bundler/copy hook and prove the tarball has no undeclared runtime import.
6. Require the malicious corpus and exact performance vector before Markdown export.
7. Seek new authority only if no candidate satisfies the frozen contract.

### Canonical inventory and disposition storage

Create:

- `registry/sources/roadmap/component-equivalence/inventory.json`
- `registry/sources/roadmap/component-equivalence/candidate-dispositions.json`

Both use source:

```text
docs/plans/component-equivalence-expansion-implementation-plan.md
```

The frozen candidate order is exactly:

1. AspectRatio
2. Blockquote
3. ButtonGroup
4. Citation
5. Code
6. Lightbox
7. Markdown
8. Outline
9. OverflowList
10. Resizable
11. Skeleton
12. Timestamp
13. Toast

`inventory.json` contains:

- `schemaVersion: "1.0.0"`
- `inventory: "component-equivalence-expansion"`
- The exact source above
- `status: "frozen"`
- The exact ordered candidate array above

Every disposition record uses `disposition: "approve"` and `a2uiDisposition: "n/a"`.

The 13 exact A2UI rationales are:

| Candidate    | A2UI `n/a` rationale                                                       |
| ------------ | -------------------------------------------------------------------------- |
| AspectRatio  | No A2UI publication is authorized.                                         |
| Blockquote   | No A2UI publication is authorized.                                         |
| ButtonGroup  | No A2UI publication is authorized.                                         |
| Citation     | Trust and document identity are outside the current catalog.               |
| Code         | No A2UI publication is authorized.                                         |
| Lightbox     | Overlay, focus, and selection state are outside the current catalog.       |
| Markdown     | Untrusted parsing is outside the current catalog.                          |
| Outline      | Document identity and observers are outside the current catalog.           |
| OverflowList | Layout measurement and focus routing are outside the current catalog.      |
| Resizable    | Gesture and state callbacks are outside the current catalog.               |
| Skeleton     | No A2UI publication is authorized.                                         |
| Timestamp    | Locale, timezone, and clock ownership are outside the current catalog.     |
| Toast        | Queues, timers, announcements, and leases are outside the current catalog. |

Extend `schemas/candidate-inventory.schema.json` with a closed `component-equivalence-expansion` branch:

- Add the inventory name to the enum.
- Require the exact source constant for this branch.
- Require exactly 13 unique candidates.
- Encode the exact candidate order with `prefixItems`, `minItems: 13`, `maxItems: 13`, and per-position constants.
- Preserve all existing inventory documents unchanged.

Extend `schemas/candidate-disposition.schema.json`:

- Add optional top-level `source` to the common object so existing artifacts remain valid.
- Add optional record-level `a2uiDisposition` with `const: "n/a"` to the base record.
- Add `component-equivalence-expansion` to the inventory enum and `oneOf`.
- Add a specialized closed branch requiring:
  - `inventory: "component-equivalence-expansion"`;
  - the exact top-level source;
  - exactly 13 ordered and unique records;
  - the exact candidate at each record position;
  - `disposition: "approve"` on every record;
  - `a2uiDisposition: "n/a"` on every record;
  - non-empty rationale;
  - evidence containing sources, accessibility, state, localization, security, SSR, performance, ownership, and migration;
  - a valid `sha256:` evidence digest.
- Preserve existing Table, AppShell, Chat, and Content documents without requiring `source` or `a2uiDisposition`.

Extend `tools/check-roadmap-contracts.mjs` to:

- Load both canonical expansion files.
- Validate both against their schemas.
- Assert the inventory and disposition candidate arrays are exactly equal in order.
- Assert exact equality with the frozen 13-candidate order.
- Assert uniqueness and reject missing, additional, duplicate, reordered, or unknown candidates.
- Assert the exact source on both files and equality between them.
- Assert all implementation dispositions are `approve`.
- Assert every `a2uiDisposition` is exactly `"n/a"`.
- Assert each A2UI rationale equals its frozen candidate-specific rationale.
- Recompute each evidence digest as SHA-256 of the canonical JSON record preimage excluding only `evidenceDigest`, matching the checker’s existing ranking-digest convention.
- Reject stale evidence digests, changed evidence, or changed disposition/A2UI fields without a regenerated digest.
- Verify every evidence source exists or is an explicitly supported package-declaration reference.
- Preserve existing artifact checks.

Required positive fixtures:

- Existing Table, AppShell, Chat, and Content dispositions remain valid without `source` or `a2uiDisposition`.
- A complete expansion inventory with exact source/order passes.
- A complete expansion disposition with exact source/order, 13 `approve` records, 13 `n/a` values, exact rationales, and fresh digests passes.
- Repository canonical files pass schema and checker validation.

Required negative fixtures:

- Missing or wrong expansion source.
- Source mismatch between inventory and dispositions.
- Missing, additional, duplicate, reordered, or unknown candidate.
- Missing, wrong, or non-`n/a` A2UI disposition.
- Wrong candidate-specific A2UI rationale.
- Non-`approve` implementation disposition.
- Missing or malformed evidence digest.
- Schema-valid but stale evidence digest after changing evidence, disposition, or A2UI disposition.
- Undeclared top-level field.
- Undeclared record or evidence field.
- Existing inventory incorrectly made subject to expansion-only requirements.

Supersede prior decisions exactly:

- In `registry/sources/roadmap/content/candidate-dispositions.json`, change Timestamp, Blockquote, and Citation from `defer` to `approve`.
- Replace each affected rationale and security/state/SSR/performance/ownership/migration evidence with the approved contract in this plan.
- Regenerate their evidence revision and digests.
- Leave Kbd, CodeBlock, and MetadataList dispositions unchanged except mechanically necessary revision metadata.
- Update `docs/architecture/rfc-chat.md` to approve a standalone, bounded Markdown component subject to Gate A and this plan’s trust boundary.
- Keep Chat’s runtime and public API unchanged: Chat continues to accept React children/plain text and does not gain Markdown parsing, a parser dependency, raw HTML, URL fetching, or executable content.

Do not duplicate `a2uiDisposition` in unified component artifact metadata.

Do not change:

- `packages/a2ui/**`
- `packages/a2ui/package.json`
- A2UI providers/stores
- `tools/a2ui-catalog-metadata.js`
- `registry/a2ui-catalog.json`
- A2UI examples/goldens
- A2UI build/publication workflows
- A2UI version/release topology

A2UI generation/check commands must produce no A2UI diff. Future mapping or publication requires a separate approved release plan.

### Dispositions, registry, Figma, recipes, and generated surfaces

Add exactly five recipes:

- `document-sources`
- `responsive-actions`
- `media-viewing`
- `resizable-workspaces`
- `async-feedback`

Extend `tools/generate-registry.js` only for configured local declarations:

- ButtonGroup `role`
- Timestamp `format`
- Toast Region `placement`

Resolve only local interfaces, aliases, unions, intersections, and object members. Do not traverse imported DOM/RAC types. Conflicting declarations fail. Preserve all existing registry records apart from intentional version/digest fields.

Final generated targets:

- 133 React component records.
- 133 code connections/mappings.
- 300 variants.
- One token record.
- 567 total public Figma records.
- Registry-metadata parity only; no authenticated live-node claim.
- 13 native `unsupported` dispositions.
- No native runtime components.
- No new template IDs.

Migrate all 12 Tooling templates:

- Preserve `schemaVersion: "1.0.0"`.
- Change content `version` to `"2.0.0"`.
- Use React `^3.0.0`.
- Use compatibility `>=3.0.0 <4.0.0`.
- Regenerate digests.
- Compile/materialize Vite and Next source/skeleton variants against packed React 3.
- Verify source and packed-template fields.
- Retain Tooling Node `>=22`.

### React Styles package contract

For each slug:

```text
aspect-ratio
blockquote
button-group
citation
code
lightbox
markdown
outline
overflow-list
resizable
skeleton
timestamp
toast
```

- Add `packages/styles/src/<slug>.css`.
- Import it from `packages/styles/src/index.css`.
- Add `"./<slug>": "./src/<slug>.css"` to `packages/styles/package.json`.
- Ensure the packed Styles tarball contains the CSS file.
- In clean packed-consumer fixtures, import both the aggregate stylesheet and each `@tale-ui/react-styles/<slug>` subpath.
- Assert every subpath resolves on Node 18/20/22/24, includes the expected `.tale-*` selector, uses valid tokens, and has no undeclared dependency.
- Add a package-export parity test so every component CSS file intended for consumers has a matching manifest export and aggregate import.

### Deterministic component performance contract

Preserve byte-for-byte:

- `schemas/performance-budget.schema.json`
- `test/baselines/roadmap/performance-budgets.json`
- `tools/benchmark-roadmap-performance.tsx`

Bundle 2 atomically adds:

- `schemas/component-performance-budget.schema.json`
- `test/baselines/roadmap/component-performance-budgets.json`
- `tools/benchmark-component-performance.tsx`
- `tools/performance-fixtures/component-expansion/*.tsx`
- `performance:roadmap:check`
- `performance:components:capture`
- `performance:components:check`
- Runner tests
- Combined read-only `performance:check`

Through Bundle 1, `performance:check` remains the unchanged legacy runner and no component-performance bootstrap file exists.

Pinned environment:

- Ubuntu 24.04
- Node 22.18.0
- React/ReactDOM 19.2.4
- JSDOM 27.4.0 for non-layout fixtures
- Playwright 1.58.2 and lockfile-pinned Chromium for layout
- Stored Chromium and lockfile identity
- Five unmeasured warm-ups
- Fifteen fresh-state samples
- No outlier removal
- `performance.now()`
- Median milliseconds rounded to three decimals
- Warning: `max(baseline × 2, baseline + 5 ms)`
- Blocking: `max(baseline × 3, baseline + 10 ms)`
- Warnings are report-only
- Blocking exceedance fails without a schema-valid unexpired exception
- Owner: `Design Systems`

Each record stores revision/date, environment, fixture/vector/postcondition SHA-256 digests, setup, operation count, samples, statistic, clock, unit, baseline, evaluated thresholds, owner, evidence, and exceptions. Record threshold-policy provenance in an ADR; formula changes require an ADR/schema migration.

Setup/teardown and vector construction are untimed unless explicitly stated. Every named React mutation uses synchronous `act`; work caused by that mutation remains inside timing. Reject samples with any vector, operation-count, flush-boundary, callback-count, render-count, order, or state mismatch.

Exact fixtures:

1. `markdown-100k-adversarial`

   ```ts
   const source =
     Array.from({ length: 6 }, () => `---${' '.repeat(9997)}\n`).join('') +
     `---${' '.repeat(88)}\n` +
     Array.from({ length: 9959 }, () => '---\n').join('') +
     `${'> '.repeat(32)}x\n`;
   ```

   Require exactly 100,000 UTF-16 units, maximum line 10,000, depth 32, and 10,000 normalized nodes excluding root. Measure exactly one validate → parse → filter → `renderToStaticMarkup` operation with `node:perf_hooks.performance`. Assert source SHA, normalized preorder-vector SHA, markup SHA, semantic counts, and absence of raw HTML, fetching elements, executable URLs, credentials, or fallback.

2. `timestamp-1000-tick`

   ```ts
   const T0 = 1767225600000;
   const values = Array.from({ length: 1000 }, (_, index) => T0 + ((index % 121) - 60) * 1000);
   ```

   Mount keys `timestamp-0000`–`timestamp-0999` with `locale="en-US"`, `timeZone="UTC"`, `format="relative"`, `now={T0}`, and `refreshInterval={1000}`. Initial render/effects settle and counters reset outside timing. One timed synchronous `act` advances only the injected scheduler to `T0 + 1000`. Assert one scheduler callback, 1,000 recomputations, one Profiler update commit, unchanged normalized `dateTime`, no extra interval, exact Node-22.18/full-ICU text digest, and no pending work.

3. `overflow-list-100-recompute`
   - Chromium
   - 100 buttons, each 36 px border-box
   - 4 px gap
   - 44 px control border-box
   - Keys `item-000`–`item-099`
   - `collapseFrom="end"`
   - Minimum zero
   - `measurementKey="benchmark-v1"`

   ```ts
   const widths = Array.from({ length: 100 }, (_, index) => 84 + 40 * index);
   ```

   Store and hash the expanded width vector. Each width performs one synchronous `act`, one ResizeObserver delivery, and one settling frame plus resulting commit. All 100 deliveries form one sample measured with page `window.performance`. Assert every prefix/suffix partition, callback order, no cycle fallback, one item render per item per render, at most one control invocation/tree, final 100-visible/0-hidden state, and no pending work.

4. `resizable-1000-updates`
   - Chromium Root `(left: 0, top: 0, width: 900, height: 240)`
   - Horizontal LTR
   - Uncontrolled `defaultSizes={{A: 40, B: 30, C: 30}}`
   - Bounds A 20–60, B 20–50, C 10–50
   - Handle `h-ab`
   - Keyboard steps 1/10
   - Precision 4
   - Pointer ID 1, primary button 0
   - Origin `(360, 20)`

   ```ts
   const positions = Array.from({ length: 1000 }, (_, index) => ({
     clientX: 360 + 0.09 * (index + 1),
     clientY: 20,
   }));
   ```

   Store and hash the expanded position vector. Pointer-down is untimed. Measure 1,000 move deliveries, each in its own synchronous `act`. Pointer-up at `(450, 20)` and final settlement are untimed. Assert 1,000 changes, one commit, exact metadata, monotonic A/B proposals, final `{A: 50, B: 20, C: 30}`, unchanged C, matching flex/ARIA values, capture release, and no pending work. Unit is median milliseconds for the 1,000 measured moves.

5. `toast-100-operations`

   Create one fresh JSDOM queue/Region with maximum visibility 5, default timeout zero, bottom-end placement, localized defaults, and one indexed close callback per record.
   - Operations 1–50 add indexes 0–49.
   - Title: `Toast ${index.toString().padStart(2, '0')}`.
   - Even descriptions: `Description ${index}`; odd descriptions absent.
   - Variants cycle neutral, success, warning, danger.
   - Timeout zero.
   - Operations 51–74 are 12 pause/resume pairs.
   - Operations 75–99 close keys 0, 2, …, 48.
   - Operation 100 calls `clear`.

   Each call uses a separate synchronous `act`; all 100 calls form one sample measured with `node:perf_hooks.performance`.

   Assert:
   - After add `j`, visibility is `[k[j], k[j-1], …, k[max(0, j-4)]]`.
   - After each close, visibility is the five greatest remaining indices descending.
   - Immediately before clear: `[k[49], k[47], k[45], k[43], k[41]]`.
   - Close callbacks are the 25 even keys.
   - Clear callbacks are `[k[1], k[3], …, k[49]]`.
   - Announcement order is `[k[0], …, k[49]]`; promotions do not reannounce.
   - Raw add/close/clear counts are 50/25/1.
   - Every close/clear subscriber snapshot follows the corresponding raw mutation and precedes its callback.
   - Raw records have no timer/callback.
   - Final Region, stable adapter snapshot, raw generation, maps, collections, pause depth, and pending work are empty.

Runner tests freeze every constant and canonical JSON digest before capture/check.

Permitted ordered baseline states:

1. `[Markdown, Timestamp]`
2. `[Timestamp]`
3. `[Markdown, Timestamp, OverflowList, Resizable]`
4. `[Timestamp, OverflowList, Resizable]`
5. `[Markdown, Timestamp, OverflowList]`
6. `[Timestamp, OverflowList]`
7. `[Markdown, Timestamp, OverflowList, Resizable, Toast]`
8. `[Timestamp, OverflowList, Resizable, Toast]`
9. `[Markdown, Timestamp, OverflowList, Toast]`
10. `[Timestamp, OverflowList, Toast]`

Normal release mode requires all five records. Other states require explicit rollback mode and exact equality with installed fixtures. Empty or arbitrary subsets fail.

Capture occurs only in owning bundles:

- Bundle 2 captures/reviews Markdown and Timestamp.
- Bundle 3 adds/reviews OverflowList and Resizable.
- Bundle 4 adds/reviews Toast.

Capture writes a temporary complete document, validates it, and atomically replaces the baseline. Check mode opens the baseline read-only, hashes before/after, cannot select capture code, and fails on mutation. CI workflow tests reject any capture command under `.github/workflows/`.

### Accessibility coverage

Keep both layers:

- `pnpm a11y:smoke` validates the axe runner.
- Built-Storybook reports validate real candidate and shared-foundation stories.

Refactor selection/path normalization into `tools/accessibility-selection.mjs`, imported by `tools/run-changed-a11y.mjs`. Add `packages/styles/src/_primitives.css` to shared-foundation paths.

Add unit fixtures for:

- Component paths plus `packages/styles/src/index.css` → `shared-foundation-change`, broad primary stories, retained candidate slugs/paths.
- Shared token/primitive/Storybook paths → broad shared-foundation coverage.
- Component-only paths → `changed-components`.
- Explicit `--components` → `explicit-components`.
- Base-unavailable, explicit-full, and scheduled-full → distinct fallback modes that cannot satisfy bundle assertions.

Add `tools/assert-accessibility-report.mjs` with:

```text
--report <path>
--mode <mode>
--components <component-list>
--stories <default-story-list>
--storybook-index <path>
```

Every assertion requires:

- `totals.newViolations === 0`
- Required normalized component slugs represented
- Required default story IDs present
- Internally consistent story count/metadata
- No candidate relying on an unrelated fallback title

Shared report additionally requires:

- `selection.mode === "shared-foundation-change"`
- Non-empty `changedPaths`
- `packages/styles/src/index.css` retained
- Current-bundle slugs re-derived from component source/CSS/docs/story paths
- Selected stories exactly equal deterministic primary-story selection using `all-variations` → `default` → `basic` → first
- No base-unavailable/full fallback mode

Explicit cumulative report additionally requires:

- `selection.mode === "explicit-components"`
- Empty `changedPaths`
- Exact normalized sorted cumulative slug set
- Every cumulative default story selected

Reports:

| Bundle | Current candidates                                   | Cumulative candidates | Shared report                                                           | Cumulative report                                                           |
| ------ | ---------------------------------------------------- | --------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1      | AspectRatio, Blockquote, ButtonGroup, Code, Skeleton | Same five             | `test/accessibility/reports/component-equivalence/bundle-1-shared.json` | `test/accessibility/reports/component-equivalence/bundle-1-cumulative.json` |
| 2      | Citation, Markdown, Timestamp, Outline               | Bundles 1–2           | `test/accessibility/reports/component-equivalence/bundle-2-shared.json` | `test/accessibility/reports/component-equivalence/bundle-2-cumulative.json` |
| 3      | OverflowList, Resizable, Lightbox                    | Bundles 1–3           | `test/accessibility/reports/component-equivalence/bundle-3-shared.json` | `test/accessibility/reports/component-equivalence/bundle-3-cumulative.json` |
| 4      | Toast                                                | All 13                | `test/accessibility/reports/component-equivalence/bundle-4-shared.json` | `test/accessibility/reports/component-equivalence/bundle-4-cumulative.json` |

Retain all eight reports as tracked bundle evidence, and add a deterministic check requiring the exact eight paths. The final shared report is authoritative for broad shared-foundation coverage; the final cumulative report is authoritative for all 13 candidates.

### Complete component workflow

Each candidate receives:

- Source and styled wrapper
- BEM/token CSS
- Aggregate and per-component Styles exports
- React root and subpath exports
- JSDoc and reference docs
- README/component-index entries
- Root `CLAUDE.md` Component Artifact Audit rows and cumulative totals
- Storybook and ComponentAudit
- Unit/browser/SSR/hydration tests as applicable
- Registry and Figma metadata
- At least one golden prompt
- Candidate-specific pitfall
- Experimental lifecycle and ownership record
- Capability, metric, roadmap, evidence, and traceability records
- Native and A2UI dispositions
- Generated artifacts

Add 13 default visual stories plus open Lightbox, visible Toast, measured OverflowList, and representative Resizable. Use deterministic clocks/content/dimensions, disable animations, await fonts, and mark readiness only after state settles.

The root Component Artifact Audit totals progress with the atomic bundles: 125 after Bundle 1, 129 after Bundle 2, 132 after Bundle 3, and 133 after Bundle 4. Every new row records `experimental` lifecycle and A2UI `n/a`.

### Rollback

- Markdown rollback removes its parser dependency/artifact, security corpus, fixture/baseline record, component, docs, recipes, lifecycle, and generated artifacts.
- Resizable rollback removes the component and direct `react-aria` only if no approved importer remains.
- Toast rollback removes the component, unstable coupling, localization, raw-generation and snapshot-order tests, fixture/baseline record, and dependent artifacts.
- Timestamp or OverflowList rollback requires a permitted baseline state or approved schema migration.
- Whole Bundle 2 rollback after Bundles 3/4 cascades unless separately approved.
- Rollback tests use temporary worktrees/directories and verify dependency resolution, permitted baseline states, immutable legacy files, React/Styles packed subpaths, and clean consumers.

## Implementation Steps

### 1. Shared prerequisites and Gate B

Apply Node/version/template/docs/security migrations; pin dependencies; add coupling, public-type, packed-consumer, React/Styles export, disposition, registry/Figma, accessibility, multi-document, multi-instance, duplicate-dispatch, and performance-protection infrastructure.

Create the canonical expansion inventory/disposition files and specialized schema/checker fixtures. Update the exact Content records and Chat RFC decision. Update both React Aria documents, add `tools/react-aria-adoption-contract.test.mjs`, and add the root `react-aria:contracts:check` script.

Verify A2UI and legacy-performance files remain unchanged.

Safe merge boundary: Gate B merges atomically before component work.

### 2. Bundle 1

Implement AspectRatio, Blockquote, ButtonGroup, Code, and Skeleton with complete artifacts, Styles exports, visuals, shared/cumulative accessibility reports, registry/Figma metadata, and packed coverage.

Verify the ButtonGroup/Group and non-RAC Skeleton decisions remain consistent with both React Aria documents and contract tests.

Safe merge boundary: all five components and dependent artifacts merge atomically.

### 3. Gate A

Run immediately before Bundle 2. Commit the parser ADR, exact dependency/artifact, malicious corpus, tarball proof, benchmark vector, and rollback instructions with Bundle 2.

### 4. Bundle 2

Implement Citation, Markdown, Timestamp, Outline, parser adapter, scheduler, localization, and `document-sources`.

Prove Citation normalization/numbering, Markdown trust boundaries, Timestamp hydration/scheduler behavior, and Outline invalid-prop/reconfiguration/owner-document/stale-work behavior.

Verify Content now approves Citation and Timestamp, the Chat RFC approves only standalone bounded Markdown, and Chat behavior remains unchanged.

Atomically introduce the component-performance system, capture/review the exact two-record baseline, and run read-only acceptance.

Retain Bundle 2 shared/cumulative accessibility reports.

### 5. Bundle 3

Implement OverflowList, Resizable, Lightbox, and their recipes.

Prove:

- Every OverflowList invalid-runtime outcome, partition, cycle, callback, and one-control-tree rule.
- Resizable add/remove/reorder/bound projection, controlled rejection/recovery, Root-local identity, and gesture ownership.
- Complete Lightbox collection/accessor/key/label/default/controlled validation, navigation, focus restoration, and fail-closed output.
- Resizable continues to use direct `useMove` and never substitutes table-only `ResizableTableContainer`.

Capture/review the exact four-record component baseline and run read-only acceptance.

Retain Bundle 3 shared/cumulative accessibility reports.

### 6. Bundle 4

Implement Toast factory, Region, stable RAC-facing adapter, replaceable unsubscribed raw generations, Tale-owned snapshot publication, mirror transactions, timers, pause reasons, announcements, leases, localization, and benchmark.

Prove:

- Raw add receives one argument.
- Raw generation subscribers remain unused.
- Raw timers/callbacks are absent.
- Add publishes only after raw keys, Tale records, partitions, maps, and the stable adapter snapshot align.
- Public close, RAC dismiss, timer expiry, clear, and owner cleanup mutate raw state before committing and publishing Tale cleanup.
- Raw close/clear failure rebuilds and republishes the pre-operation snapshot, or poison-resets consistently if rebuild fails.
- Subscriber exceptions never short-circuit remaining subscribers, resurrect a committed dismissal, suppress callbacks, or prevent FIFO draining.
- Re-entrant subscriber and callback mutations observe only verified snapshots.
- A removed reverse mapping can never coexist with a rendered stale Toast.
- No unstable upstream type escapes the Tale public API.

Capture/review the exact five-record baseline and run read-only acceptance.

Retain Bundle 4 shared/cumulative accessibility reports.

Safe merge boundary: Toast remains independently revertible.

### 7. Final release readiness

Regenerate and inspect canonical/generated outputs. Verify component, disposition, Figma, template, baseline, versioned-doc, React export, and Styles export totals.

Verify the final plan path exists before canonical disposition validation, both canonical expansion artifacts name it exactly, and all evidence digests are current.

Run dry-run package/release checks only.

Do not publish, tag, push, deploy, or promote.

## Verification

### Public contracts and behavior

```bash
pnpm --filter @tale-ui/react test:public-types
pnpm --filter @tale-ui/react test:dependency-coupling
pnpm react-aria:contracts:check

pnpm test:jsdom AspectRatio --no-watch
pnpm test:jsdom Blockquote --no-watch
pnpm test:jsdom ButtonGroup --no-watch
pnpm test:jsdom Citation --no-watch
pnpm test:jsdom Code --no-watch
pnpm test:jsdom Markdown --no-watch
pnpm test:jsdom Timestamp --no-watch
pnpm test:chromium Outline --no-watch
pnpm test:chromium OverflowList --no-watch
pnpm test:chromium Resizable --no-watch
pnpm test:chromium Lightbox --no-watch
pnpm test:jsdom Skeleton --no-watch
pnpm test:jsdom Toast --no-watch
pnpm test:chromium Toast --no-watch
```

Outline, OverflowList, Resizable, Lightbox, and Toast also run in Firefox and WebKit.

Focused fixtures cover:

- Every public export, ref, callback, union, owned DOM field, default, invalid value, error type, diagnostic, and recovery path.
- Exact `Tale UI: ` Toast validation/recovery prefixes, error types, problem statements, and corrective actions.
- Compile-time omission of every owned action/capture prop.
- Citation ordinal/list-attribute ownership.
- Outline controlled/uncontrolled removal/reorder and observer cleanup.
- OverflowList invalid props, exact callback counts, and one control tree.
- Resizable projection/rejection, cancellation, ARIA/flex values, and exact benchmark mode.
- Complete Lightbox public declarations and state/event routing.
- Lightbox LTR/RTL swipe navigation, loop/boundary behavior, and direction derived from a non-global Popup owner document.
- Toast malformed input before mutation.
- Raw Toast add with one argument and no raw timer/callback.
- Stable adapter identity and subscriber retention across raw-generation rebuild.
- RAC dismiss through Tale cleanup exactly once.
- Raw-close-before-publication and raw-clear-before-publication order.
- Public close, RAC dismiss, timer expiry, clear, and owner cleanup snapshot order.
- At each subscriber observation, equality of raw visible order, Tale visible order, stable adapter snapshot, partitions, and maps.
- Synchronous, re-entrant, and throwing subscribers for add, close, and clear.
- Throwing consumer callbacks for close, clear, and poison-reset.
- Raw close and clear failures injected both before and after upstream raw mutation.
- Successful pre-operation rebuild, aligned recovery publication, preserved callbacks/timers, and deterministic rethrow.
- Rebuild failure followed by consistent empty poison-reset and deterministic rejection of later mutation.
- No stale rendered Toast after reverse-map removal.
- No callback double invocation or lost FIFO mutation.
- Programmatic close, timer expiry, RAC dismiss, clear, and lease failover.

React Aria contract fixtures additionally assert:

- Exact RAC and React Aria pins.
- Absence of direct React Stately.
- Exact target text in both maintained documents.
- One current record for each frozen adoption/deviation decision.
- Group/Toast/`useMove` upgrade-review coupling.
- Table-only `ResizableTableContainer`.
- Non-RAC React Spectrum Skeleton.
- Private unstable Toast isolation.

### Registry and Figma

```bash
pnpm registry:generate
pnpm registry:check
pnpm figma:generate
pnpm figma:check
```

Assert 133 components/connections, 300 variants, one token, 567 public records, exact configured enum values, byte-preservation of prior records except intentional metadata, registry-only parity, and no authenticated-node claim.

### Performance

Owning-bundle capture only:

```bash
pnpm performance:components:capture
git diff -- test/baselines/roadmap/component-performance-budgets.json
```

Acceptance and CI:

```bash
pnpm performance:roadmap:check
pnpm performance:components:check
pnpm performance:check
git diff --exit-code -- test/baselines/roadmap/component-performance-budgets.json
```

Legacy protection:

```bash
shasum -a 256 \
  schemas/performance-budget.schema.json \
  test/baselines/roadmap/performance-budgets.json \
  tools/benchmark-roadmap-performance.tsx

git diff --exit-code \
  761c2ddbfe44e05a8b203fc856a5456b31b0d3ef \
  -- \
  schemas/performance-budget.schema.json \
  test/baselines/roadmap/performance-budgets.json \
  tools/benchmark-roadmap-performance.tsx
```

Runner tests assert fixture constants, expanded vectors, digests, timed boundaries, `act` boundaries, permitted baseline states, atomic capture, read-only checks, and absence of capture commands in CI.

### Accessibility

```bash
node --test \
  tools/accessibility-selection.test.mjs \
  tools/assert-accessibility-report.test.mjs
pnpm a11y:smoke

pnpm -C playground/storybook build \
  --output-dir ../../.artifacts/storybook-a11y
pnpm exec serve .artifacts/storybook-a11y \
  --listen 6007 \
  --no-request-logging \
  --no-clipboard
```

For each bundle:

```bash
pnpm a11y:changed -- \
  --url http://127.0.0.1:6007 \
  --base <bundle-merge-base-sha> \
  --output test/accessibility/reports/component-equivalence/bundle-<n>-shared.json

pnpm a11y:changed -- \
  --url http://127.0.0.1:6007 \
  --components <cumulative-component-list> \
  --output test/accessibility/reports/component-equivalence/bundle-<n>-cumulative.json

node tools/assert-accessibility-report.mjs \
  --report test/accessibility/reports/component-equivalence/bundle-<n>-shared.json \
  --mode shared-foundation-change \
  --components <current-bundle-components> \
  --stories <current-bundle-default-story-ids> \
  --storybook-index .artifacts/storybook-a11y/index.json

node tools/assert-accessibility-report.mjs \
  --report test/accessibility/reports/component-equivalence/bundle-<n>-cumulative.json \
  --mode explicit-components \
  --components <cumulative-component-list> \
  --stories <cumulative-default-story-ids> \
  --storybook-index .artifacts/storybook-a11y/index.json
```

The final cumulative list is:

```text
AspectRatio,Blockquote,ButtonGroup,Citation,Code,Lightbox,Markdown,Outline,OverflowList,Resizable,Skeleton,Timestamp,Toast
```

Assert all eight report paths are retained, every shared report selects broad deterministic primary stories, every cumulative report selects the exact cumulative slugs/default stories, and every report has zero new violations.

Manual evidence covers screen readers, keyboard, zoom/reflow, touch, RTL, reduced motion, OverflowList focus handoff, Lightbox focus/naming, and Toast ordering/failover/announcements. Missing manual evidence blocks stable promotion, not experimental merge.

### Packaging, Styles, versions, docs, and templates

```bash
git rev-parse release-v2.0.0
git rev-parse react-v1.3.56
pnpm docs:versions:generate
pnpm docs:versions:check
pnpm pages:test
pnpm pages:assemble
pnpm audit:docs:semantics

pnpm react:test:package
pnpm --filter @tale-ui/react test:packed-consumers
pnpm --filter @tale-ui/react-styles test:package
pnpm --filter @tale-ui/react-styles test:packed-consumers
pnpm --filter @tale-ui/tooling test
pnpm --filter @tale-ui/tooling test:package
pnpm templates:check
```

Packed consumers import all 13 React subpaths and all 13 Styles subpaths individually, plus both aggregate entry points.

Assert:

- Historical revisions match the pinned SHAs.
- Six synchronized packages are `3.0.0`; Tooling is `0.2.0`.
- Node 18/20/22/24 × React 17/18/19 passes.
- Node 16 engine-strict installation rejects React 3.
- Both binaries work under every supported Node matrix entry.
- Historical manifests do not produce a Node 14/16 support recommendation.
- Every React component subpath and every Styles CSS subpath resolves from packed tarballs.
- Exactly 12 templates remain with correct schema/content/compatibility fields.
- The root Component Artifact Audit contains all 13 experimental, A2UI-`n/a` rows and final totals of 133/133 with zero missing artifacts.
- No publish or tag occurs.

### Dispositions and A2UI no-change proof

```bash
node --test tools/react-aria-adoption-contract.test.mjs
pnpm react-aria:contracts:check
pnpm roadmap:contracts:check
pnpm roadmap:evidence:check
pnpm native:conformance:check
pnpm templates:check
pnpm recipes:validate
pnpm artifacts:check

pnpm a2ui:check-docs
pnpm a2ui:check-catalog
pnpm a2ui:audit-docs
pnpm a2ui:validate-examples
pnpm a2ui:check-registry-sync

git diff --exit-code \
  5e539e19287b9f5469d8f13e0ebe44f43d4dda62 \
  -- \
  packages/a2ui \
  tools/a2ui-catalog-metadata.js \
  registry/a2ui-catalog.json \
  docs/a2ui-integration.md
```

Assert:

- Exact canonical expansion inventory and disposition paths exist.
- Both canonical files name the exact finalized-plan source.
- Exact ordered candidate equality and uniqueness hold.
- All 13 implementation dispositions are `approve`.
- All 13 A2UI dispositions are `n/a` with exact candidate-specific rationales.
- Every evidence digest matches its canonical record preimage.
- Positive and negative schema/checker fixtures pass.
- Content approves Timestamp, Blockquote, and Citation with current evidence.
- The Chat RFC approves standalone bounded Markdown while Chat behavior remains unchanged.
- No A2UI runtime, package, catalog, provider, store, build, version, or publication change exists.

### Full verification

```bash
pnpm typescript
pnpm eslint:ci
pnpm stylelint
pnpm lint:css
pnpm markdownlint
pnpm audit:bem
pnpm audit:brand
pnpm audit:docs
pnpm audit:docs:semantics
pnpm audit:components
pnpm audit:coverage:check
pnpm pitfalls:audit
pnpm golden:validate
pnpm validate:generated
pnpm generate-docs:check
pnpm artifacts:check
pnpm governance:check
pnpm roadmap:contracts:check
pnpm roadmap:gates:check
pnpm metrics:check
pnpm registry:check
pnpm figma:check
pnpm native:conformance:check
pnpm templates:check
pnpm recipes:validate
pnpm roadmap:evidence:check
pnpm react-aria:contracts:check

pnpm test:jsdom --no-watch
pnpm test:chromium --no-watch
pnpm test:firefox --no-watch
pnpm test:webkit --no-watch
pnpm test:e2e
pnpm test:regressions
pnpm test:visual
pnpm storybook:build
pnpm playground:build
pnpm build
pnpm a11y:smoke
pnpm performance:check

git diff --check
git status --short
```

Before release readiness, reassert all bundle accessibility reports, React/Styles packed subpaths, component-performance baseline immutability, legacy-performance hashes, exact canonical inventory/disposition contracts, React Aria documentation contracts, and protected A2UI paths.

## Risks And Mitigations

- Toast stale close/clear snapshots: raw mutation precedes Tale commit and stable-adapter publication; subscriber tests assert exact raw/Tale/map alignment.
- Toast raw mutation failure: discard the damaged generation, rebuild the pre-operation snapshot, republish rebuilt raw keys, or poison-reset consistently.
- Toast subscriber failure: invoke all subscribers, retain an already published dismissal, run callbacks and FIFO operations, and aggregate errors deterministically.
- Toast stale rendered records: mappings are removed only as part of a verified post-raw commit; poison-reset publishes empty state before leaving the transaction.
- Toast re-entrancy: FIFO staged mutations, reserved opaque keys, verified transaction boundaries, and injected re-entrant subscriber/callback tests.
- Toast upstream instability: exact pins, no raw options/timers/callbacks, coupling tests, replaceable raw generations, maintained adoption records, and independent rollback.
- Stateful reconfiguration divergence: explicit Outline removal/reorder rules and deterministic Resizable projection/rejection.
- Invalid-input ambiguity: exact field domains, fallbacks, and exception classes.
- Citation numbering divergence: omit/runtime-strip list numbering props and apply Tale-owned decimal numbering.
- Node compatibility overstatement: document the historical engine mismatch and recommend no Node-below-18 Tale line.
- Event interception: omit and runtime-strip complete owned handler sets.
- CSS packaging omission: manifest/aggregate parity tests and packed imports for all 13 Styles subpaths.
- Accessibility false confidence: retain broad shared-foundation reports and separate explicit cumulative reports.
- Registry/Figma mismatch: scoped local declaration resolver and prior-record identity tests.
- Markdown security: Gate A, bounded contract, malicious corpus, atomic fallback, and dependency rollback.
- Baseline laundering: owning-bundle capture only; read-only CI/final checks; digest-locked vectors.
- Observer/gesture leakage: generation cancellation, Root-local identity, stale-work rejection, and multi-instance tests.
- Canonical-artifact drift: closed specialized schemas, exact source/order/equality checks, record-preimage digests, and negative fixtures.
- Legacy-decision contradiction: executable assertions for the three Content approvals and standalone-Markdown Chat RFC update.
- React Aria documentation drift: exact dependency/document targets and five frozen decisions enforced by `react-aria:contracts:check`.
- A2UI scope drift: required `n/a` dispositions and protected no-diff checks.

## Reviewer Feedback Decisions

### F-001

- Decision: ACCEPTED
- Rationale: Repository and installed-package inspection supports a distinct ownership decision for every candidate. The round-ten objective table did not preserve the required current Tale state and verified upstream/native evidence, including the critical Code/CodeBlock, general/table resizing, Spectrum/RAC Skeleton, and unstable Toast distinctions.
- Plan change: Restored a self-contained 13-row matrix with candidate, current Tale state or nearest composition, verified upstream/native state and evidence, and ownership decision.

### F-002

- Decision: ACCEPTED
- Rationale: The current schemas reject the required expansion inventory, top-level disposition source, and record-level A2UI disposition. The round-ten prose did not define enough storage, schema, checker, fixture, or legacy-decision behavior to make the promised 13-record assertion executable.
- Plan change: Restored exact canonical paths and source, frozen candidate order, 13 explicit A2UI rationales, specialized schema branches, required `source` and `a2uiDisposition`, exact order/equality/uniqueness/source/digest checks, positive and negative fixtures, the three Content approvals, and the standalone-Markdown Chat RFC update without changing Chat behavior.

### F-003

- Decision: ACCEPTED
- Rationale: Both maintained React Aria documents still declare `^1.19.0`, while the plan requires an exact pin and invokes an undefined contract command. The adoption and deviation decisions therefore require maintained documentation and executable enforcement.
- Plan change: Restored updates for both React Aria documents, defined `tools/react-aria-adoption-contract.test.mjs` and the root `react-aria:contracts:check` script, and froze the Group, unstable Toast, `useMove`, table-only `ResizableTableContainer`, and non-RAC Skeleton decisions.

### Prior reviewer-02 round-09 F-001

- Decision: ACCEPTED
- Rationale: React Stately’s `useToastQueue` snapshots `queue.visibleToasts`, while upstream `close` and `clear` replace that snapshot only during their raw mutation. Publishing Tale cleanup first would allow subscribers to reread stale raw state after Tale mappings were removed.
- Plan change: Preserved the corrected raw-first staged transactions, stable RAC-facing adapter, replaceable unsubscribed raw generations, aligned publication, rebuild/recovery, poison reset, subscriber/callback behavior, deterministic error ordering, FIFO re-entrancy, owner cleanup, and stale-render prevention tests without modification.

## Changes Since Previous Plan

- Restored the complete 13-candidate current-state/upstream/ownership evidence matrix.
- Restored exact canonical inventory/disposition paths, source, ordered candidates, 13 A2UI rationales, schema branches, checker rules, fixtures, and legacy Content/Chat decision updates.
- Restored the React Aria adoption/deviation documentation contract, executable test, root script, and five frozen decisions.
- Added the restored contracts to implementation sequencing, verification, risks, and evidence.
- Preserved the corrected raw-first Toast transaction and all existing APIs, defaults, invalid-input behavior, state routing, multi-instance behavior, accessibility, fixtures, versions, templates, recipes, Figma totals, performance vectors, packaging, rollback, and clean-consumer contracts.
- Made no new product, dependency, release, A2UI, or bundle decision.

## Open Questions

None.

## Status

`READY_FOR_IMPLEMENTATION`

## Clarifying Questions

None.
