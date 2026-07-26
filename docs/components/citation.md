# Citation

`import { Citation } from '@tale-ui/react/citation';`

Experimental semantic composition for normalized source references and an
ordered source list.

## Parts

- `Citation.Root` — normalizes and provides a source registry
- `Citation.Reference` — renders a superscript reference to a known source
- `Citation.List` — renders the normalized sources in owned decimal order

## Props

### Citation.Root

| Prop       | Type                        | Default | Description                                             |
| ---------- | --------------------------- | ------- | ------------------------------------------------------- |
| `id`       | `string`                    | —       | Valid DOM-safe identity used to create entry targets    |
| `sources`  | `readonly CitationSource[]` | —       | Ordered source records normalized atomically            |
| `baseUrl`  | `string`                    | —       | Credential-free absolute HTTP(S) base for relative URLs |
| `children` | `React.ReactNode`           | —       | References, prose, and a source list                    |

Also accepts native `div` attributes except `id`, `children`, and
`dangerouslySetInnerHTML`.

`CitationSource` has required `id` and `title` strings, plus optional `href`,
`author`, `publisher`, and `publishedAt` strings. Root and source IDs must
match `[A-Za-z][A-Za-z0-9_-]*`; source IDs must be unique. If any required
record is invalid or throws during property access, the entire registry is
invalid. Accepted records are copied into immutable internal data.

### Citation.Reference

| Prop       | Type              | Default | Description                                 |
| ---------- | ----------------- | ------- | ------------------------------------------- |
| `sourceId` | `string`          | —       | ID of a source in the nearest Root registry |
| `children` | `React.ReactNode` | `[n]`   | Optional visible reference content          |

Also accepts native `sup` attributes except `children` and
`dangerouslySetInnerHTML`. The component owns its target and accessible name.
Unknown references have no anchor, render `[?]` by default, and are announced
as unavailable. Explicit children, including `null`, replace only the visible
content.

### Citation.List

| Prop            | Type              | Default | Description                              |
| --------------- | ----------------- | ------- | ---------------------------------------- |
| `emptyFallback` | `React.ReactNode` | —       | Content for an empty or invalid registry |

Also accepts native `ol` attributes except `children`,
`dangerouslySetInnerHTML`, `reversed`, `start`, and `type`. Decimal numbering
always starts at one; runtime values for the omitted numbering props are
stripped.

## Basic Usage

```tsx
import { Citation } from '@tale-ui/react/citation';

const sources = [
  {
    id: 'wai-aria',
    title: 'WAI-ARIA Authoring Practices Guide',
    href: '/WAI/ARIA/apg/',
    publisher: 'W3C',
    publishedAt: '2025-12-16T09:30:00+00:00',
  },
] as const;

export function AccessibleResearchNote() {
  return (
    <Citation.Root id="accessibility-note" sources={sources} baseUrl="https://www.w3.org/">
      Follow established interaction patterns
      <Citation.Reference sourceId="wai-aria" />.
      <Citation.List />
    </Citation.Root>
  );
}
```

Ordinals follow source order, and repeated references to the same source share
an ordinal. Entry IDs use `{rootId}-source-{ordinal}`.

Absolute credential-free HTTP(S) URLs remain links. Relative, fragment, and
protocol-relative URLs become links only when `baseUrl` is a valid,
credential-free absolute HTTP(S) URL. Unsafe or malformed URLs leave the
escaped citation metadata as non-interactive text.

`publishedAt` becomes a semantic `time` only when it is a complete,
offset-bearing timestamp. Its `dateTime` is normalized to UTC. Invalid
non-empty timestamp strings remain escaped visible text; empty and wrong-type
runtime values are omitted.

All parts runtime-strip `dangerouslySetInnerHTML`. Citation source strings are
rendered as escaped React text and are never parsed as markup.

## CSS Classes

- `.tale-citation`
- `.tale-citation__reference`
- `.tale-citation__reference-link`
- `.tale-citation__list`
- `.tale-citation__source`
- `.tale-citation__title`
- `.tale-citation__metadata`

## Pitfalls

<!-- pitfall: citation-numbering-is-owned -->

- **Let Citation own reference and list numbering** — ordinals come from normalized source order, repeated references share the same target, and `Citation.List` always uses decimal numbering from one.
  - anti-pattern: `<Citation.List start={0} type="a" />`
  - fix: `<Citation.List />`
