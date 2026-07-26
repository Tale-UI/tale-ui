# Document Sources

Compose bounded Markdown, a navigable document outline, explicit publication
time, and normalized citations without moving trust or identity into the
document source.

## Components Used

- `Markdown` from `@tale-ui/react/markdown`
- `Outline` from `@tale-ui/react/outline`
- `Timestamp` from `@tale-ui/react/timestamp`
- `Citation` from `@tale-ui/react/citation`
- `Column` from `@tale-ui/react/column`
- `Text` from `@tale-ui/react/text`

## Code

```tsx
import { Citation } from '@tale-ui/react/citation';
import { Column } from '@tale-ui/react/column';
import { Markdown } from '@tale-ui/react/markdown';
import { Outline } from '@tale-ui/react/outline';
import { Text } from '@tale-ui/react/text';
import { Timestamp } from '@tale-ui/react/timestamp';

const outlineItems = [
  { id: 'summary', targetId: 'summary-heading', label: 'Summary', level: 1 },
  { id: 'sources', targetId: 'sources-heading', label: 'Sources', level: 1 },
] as const;

const sources = [
  {
    id: 'aria-apg',
    title: 'WAI-ARIA Authoring Practices Guide',
    href: '/WAI/ARIA/apg/',
    publisher: 'W3C',
    publishedAt: '2025-12-16T09:30:00Z',
  },
] as const;

export function DocumentSources() {
  return (
    <Column gap="l">
      <Outline aria-label="On this page" items={outlineItems} />

      <Citation.Root id="accessibility-note" sources={sources} baseUrl="https://www.w3.org/">
        <Column gap="m">
          <Text id="summary-heading" as="h2" variant="heading" size="m">
            Research summary
          </Text>

          <Markdown baseUrl="https://docs.example.com/">
            {
              'Use the **document model** to keep [trusted navigation](/navigation) separate from authored prose.'
            }
          </Markdown>

          <Text>
            Follow established interaction patterns
            <Citation.Reference sourceId="aria-apg" />.
          </Text>

          <Text>
            Published{' '}
            <Timestamp
              value="2026-07-27T04:30:00Z"
              locale="en-AU"
              timeZone="Australia/Melbourne"
              format="date"
            />
          </Text>

          <Text id="sources-heading" as="h2" variant="heading" size="m">
            Sources
          </Text>
          <Citation.List emptyFallback="No sources available." />
        </Column>
      </Citation.Root>
    </Column>
  );
}
```

## Key points

- Keep citation records in application data; Markdown has no extension point
  that can manufacture trusted references.
- Give Outline stable logical IDs and target IDs that match real document
  headings.
- Pass complete offset-bearing timestamps and explicit locale/timezone values
  to Timestamp.
- Use a credential-free HTTP(S) `baseUrl` when either Markdown links or
  citation source links are relative.
