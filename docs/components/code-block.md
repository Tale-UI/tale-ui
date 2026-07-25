# CodeBlock

`import { CodeBlock } from '@tale-ui/react/code-block';`

Experimental plain-text code surface with safe overflow behavior. It does not
parse Markdown, render raw HTML, highlight syntax, fetch resources, or execute
code.

## Props

| Prop       | Type      | Default | Description                                      |
| ---------- | --------- | ------- | ------------------------------------------------ |
| `children` | `string`  | —       | Plain-text code                                  |
| `language` | `string`  | —       | Informational `data-language` value              |
| `wrap`     | `boolean` | `false` | Wrap long lines instead of horizontal scrolling |

CodeBlock also accepts native `<pre>` attributes.

## Basic Usage

```tsx
import { CodeBlock } from '@tale-ui/react/code-block';

export function ExampleCode() {
  return (
    <CodeBlock language="tsx">{`export function App() {
  return <main>Hello</main>;
}`}</CodeBlock>
  );
}
```

Use `wrap` for prose-like logs or snippets where line wrapping is preferable.
The default preserves whitespace and provides horizontal scrolling.

## Security

Untrusted strings are rendered through React text escaping inside native
`pre`/`code` elements. There is no `dangerouslySetInnerHTML`, renderer plugin,
language loader, syntax-highlighting dependency, or executable callback.

## CSS Classes

- `.tale-code-block`
- `.tale-code-block--wrap`

## Pitfalls

<!-- pitfall: code-block-plain-text -->

- **Pass plain text to `CodeBlock`** — the component intentionally excludes raw HTML, Markdown, syntax highlighting, and executable renderers.
  - anti-pattern: `<CodeBlock dangerouslySetInnerHTML={{ __html: generatedCode }} />`
  - fix: `<CodeBlock>{generatedCode}</CodeBlock>`
