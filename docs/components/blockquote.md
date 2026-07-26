# Blockquote

`import { Blockquote } from '@tale-ui/react/blockquote';`

Experimental semantic composition for a quotation, its prose, and its visible
attribution.

## Parts

- `Blockquote.Root` — native `blockquote` container
- `Blockquote.Content` — quoted prose rendered as a `p`
- `Blockquote.Attribution` — visible source attribution rendered as a `footer`

## Props

### Blockquote.Root

| Prop       | Type              | Default | Description                                      |
| ---------- | ----------------- | ------- | ------------------------------------------------ |
| `children` | `React.ReactNode` | —       | Content and attribution parts                    |
| `cite`     | `string`          | —       | Credential-free absolute HTTP(S) source metadata |

Also accepts native `blockquote` attributes except
`dangerouslySetInnerHTML`.

### Blockquote.Content

| Prop       | Type              | Default | Description  |
| ---------- | ----------------- | ------- | ------------ |
| `children` | `React.ReactNode` | —       | Quoted prose |

Also accepts native `p` attributes except `dangerouslySetInnerHTML`.

### Blockquote.Attribution

| Prop       | Type              | Default | Description                |
| ---------- | ----------------- | ------- | -------------------------- |
| `children` | `React.ReactNode` | —       | Visible source attribution |

Also accepts native `footer` attributes except
`dangerouslySetInnerHTML`.

## Basic Usage

```tsx
import { Blockquote } from '@tale-ui/react/blockquote';

export function ProductPrinciple() {
  return (
    <Blockquote.Root cite="https://example.com/interview">
      <Blockquote.Content>
        The details are not the details. They make the design.
      </Blockquote.Content>
      <Blockquote.Attribution>Charles Eames</Blockquote.Attribution>
    </Blockquote.Root>
  );
}
```

The `cite` attribute is machine-readable metadata and does not render a
visible source. It is omitted when it is relative, malformed, contains
credentials, or uses a protocol other than HTTP(S). Put the human-readable
source in `Blockquote.Attribution`.

All parts runtime-strip `dangerouslySetInnerHTML`. React children remain
ordinary escaped content unless a consumer deliberately supplies React
elements.

## CSS Classes

- `.tale-blockquote`
- `.tale-blockquote__content`
- `.tale-blockquote__attribution`

## Pitfalls

<!-- pitfall: blockquote-cite-is-not-attribution -->

- **Render a visible attribution as well as source metadata** — the root `cite` attribute is not shown to readers and only accepts credential-free absolute HTTP(S) URLs.
  - anti-pattern: `<Blockquote.Root cite={sourceUrl}><Blockquote.Content>{quote}</Blockquote.Content></Blockquote.Root>`
  - fix: `<Blockquote.Root cite={sourceUrl}><Blockquote.Content>{quote}</Blockquote.Content><Blockquote.Attribution>{sourceName}</Blockquote.Attribution></Blockquote.Root>`
