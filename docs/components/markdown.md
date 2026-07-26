# Markdown

`Markdown` renders a fixed, bounded subset of Markdown as semantic React
elements. It is experimental.

## Import

```tsx
import { Markdown } from '@tale-ui/react/markdown';
import '@tale-ui/react-styles/markdown';
```

## Example

```tsx
<Markdown baseUrl="https://docs.example.com/">
  {'## Security\n\nRead the [trust guide](/trust-guide).'}
</Markdown>
```

The supported syntax is paragraphs, headings, emphasis, strong text, lists,
thematic breaks, blockquotes, links, inline code, and fenced code. Inline code,
fenced code, blockquotes, and links use Tale's `Code`, `CodeBlock`,
`Blockquote`, and `Link` components.

## Trust boundary

`Markdown` has no plugin, raw-HTML, AST, renderer, URL-transformer,
highlighter, or executable-extension API. It never uses
`dangerouslySetInnerHTML`.

- Raw HTML is omitted.
- Images and other resources become plain, non-fetching text.
- Links may use fragments, absolute credential-free HTTP(S), or `mailto:`.
- Relative and protocol-relative links require a valid absolute,
  credential-free HTTP(S) `baseUrl`.
- Malformed URLs, credentials, and unsupported protocols render as plain text.

Parsing is synchronous and limited to 100,000 UTF-16 source units, 10,000
units per line, 32 levels of nesting, and 10,000 parsed nodes. Wrong-type
input, a limit violation, or a parser/filter failure discards the entire
result and renders `invalidFallback`, which defaults to `Content unavailable`.

## Props

| Prop              | Type              | Default                 | Description                                      |
| ----------------- | ----------------- | ----------------------- | ------------------------------------------------ |
| `children`        | `string`          | Required                | Bounded Markdown source.                         |
| `baseUrl`         | `string`          | —                       | Safe absolute base for relative links.           |
| `invalidFallback` | `React.ReactNode` | `Content unavailable`   | Atomic fallback for invalid input or processing. |
| `className`       | `string`          | —                       | Additional class on the root `div`.               |

The ref targets the root `HTMLDivElement`. DOM props are forwarded except
`dangerouslySetInnerHTML`, which is omitted from the public type and
runtime-stripped.

## CSS Classes

- `.tale-markdown`

## Pitfalls

<!-- pitfall: markdown-fixed-trust-boundary -->

- **Keep Markdown inside its fixed trust boundary** — Markdown exposes no plugin, raw HTML, AST, renderer, URL transformer, highlighter, or executable extension API.
  - anti-pattern: `<Markdown plugins={[unsafeHtmlPlugin]}>{source}</Markdown>`
  - fix: `<Markdown baseUrl="https://docs.example.com/" invalidFallback="Document unavailable">{source}</Markdown>`
