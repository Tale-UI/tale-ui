# Code

`import { Code } from '@tale-ui/react/code';`

Experimental semantic inline code primitive. Code escapes its string content and
never parses, highlights, fetches, or executes it. Use
[CodeBlock](./code-block.md) for block-oriented snippets.

## Props

| Prop       | Type     | Default | Description            |
| ---------- | -------- | ------- | ---------------------- |
| `children` | `string` | —       | Plain-text inline code |

Code also accepts native `<code>` attributes except
`dangerouslySetInnerHTML`. Invalid runtime child values render empty content.

## Basic Usage

```tsx
import { Code } from '@tale-ui/react/code';
import { Text } from '@tale-ui/react/text';

export function TestCommand() {
  return (
    <Text>
      Run <Code>pnpm test</Code> before opening a pull request.
    </Text>
  );
}
```

## Security

Content is rendered through React text escaping. There is no raw-HTML,
highlighter, parser, resource loader, or executable callback API.

## CSS Classes

- `.tale-code`

## Pitfalls

<!-- pitfall: code-inline-plain-text -->

- **Pass plain text to inline `Code`** — raw HTML and executable renderers are intentionally unsupported.
  - anti-pattern: `<Code dangerouslySetInnerHTML={{ __html: generatedCode }} />`
  - fix: `<Code>{generatedCode}</Code>`
