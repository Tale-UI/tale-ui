# KeyValuePairs

`import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';`

Displays properties as labels followed by corresponding values using semantic description-list markup. Use it for metadata, resource summaries, settings summaries, and other key-value content. Use [`Table`](table.md) for genuinely tabular data and [`List`](list.md) for plain item lists.

## Parts

| Part | Description |
|------|-------------|
| `KeyValuePairs.Root` | Description list container (`<dl>`). Accepts `columns`, `minColumnWidth`, `variant`, and `density` props. |
| `KeyValuePairs.Item` | Wrapper for one term/details pair (`<div>`). |
| `KeyValuePairs.Term` | Label/key for a pair (`<dt>`). |
| `KeyValuePairs.Details` | Value/details for a pair (`<dd>`). |
| `KeyValuePairs.Info` | Optional inline help, link, or tooltip trigger next to a term (`<span>`). |
| `KeyValuePairs.Group` | Wrapper for a grouped set of key-value pairs (`<div>`). |
| `KeyValuePairs.GroupTitle` | Term/title for a group (`<dt>`). |
| `KeyValuePairs.GroupList` | Details area containing a nested description list (`<dd><dl>...</dl></dd>`). |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `1 \| 2 \| 3 \| 4` | `1` | Maximum number of responsive columns. The rendered column count is capped by available width and `minColumnWidth`. |
| `minColumnWidth` | `number` | `150` | Desired minimum width for each column in pixels. Non-positive or non-finite runtime values fall back to `150`. |
| `variant` | `'plain' \| 'divided'` | `'plain'` | Visual style. `divided` adds separators between visual rows. |
| `density` | `'compact' \| 'default' \| 'spacious'` | `'default'` | Vertical spacing density. |

Also accepts all standard `<dl>` HTML attributes including `aria-label`, `aria-labelledby`, `className`, and `style`.

### Item / Group

| Prop | Type | Default | Description |
|------|------|---------|-------------|

Accept all standard `<div>` HTML attributes including `className`.

### Term / Details / GroupTitle / GroupList

| Prop | Type | Default | Description |
|------|------|---------|-------------|

`Term` and `GroupTitle` accept standard `<dt>` HTML attributes. `Details` and `GroupList` accept standard `<dd>` HTML attributes. All parts accept `className`.

### Info

| Prop | Type | Default | Description |
|------|------|---------|-------------|

Accepts all standard `<span>` HTML attributes including `className`.

## Basic Usage

```tsx
<KeyValuePairs.Root aria-label="Service metadata">
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Status</KeyValuePairs.Term>
    <KeyValuePairs.Details>Active</KeyValuePairs.Details>
  </KeyValuePairs.Item>
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Owner</KeyValuePairs.Term>
    <KeyValuePairs.Details>Platform Team</KeyValuePairs.Details>
  </KeyValuePairs.Item>
</KeyValuePairs.Root>
```

## Examples

### Divided

```tsx
<KeyValuePairs.Root aria-label="Deployment summary" variant="divided">
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Environment</KeyValuePairs.Term>
    <KeyValuePairs.Details>Production</KeyValuePairs.Details>
  </KeyValuePairs.Item>
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Version</KeyValuePairs.Term>
    <KeyValuePairs.Details>2026.06.17</KeyValuePairs.Details>
  </KeyValuePairs.Item>
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Last deployment</KeyValuePairs.Term>
    <KeyValuePairs.Details>June 17, 2026</KeyValuePairs.Details>
  </KeyValuePairs.Item>
</KeyValuePairs.Root>
```

### Responsive Columns

```tsx
<KeyValuePairs.Root
  aria-label="API service summary"
  columns={3}
  minColumnWidth={180}
  variant="divided"
>
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Status</KeyValuePairs.Term>
    <KeyValuePairs.Details><Badge variant="success">Active</Badge></KeyValuePairs.Details>
  </KeyValuePairs.Item>
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Region</KeyValuePairs.Term>
    <KeyValuePairs.Details>us-east-1</KeyValuePairs.Details>
  </KeyValuePairs.Item>
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Owner</KeyValuePairs.Term>
    <KeyValuePairs.Details>Platform Team</KeyValuePairs.Details>
  </KeyValuePairs.Item>
</KeyValuePairs.Root>
```

### Grouped Pairs

```tsx
<KeyValuePairs.Root aria-label="Infrastructure summary" columns={2}>
  <KeyValuePairs.Group>
    <KeyValuePairs.GroupTitle>Network</KeyValuePairs.GroupTitle>
    <KeyValuePairs.GroupList>
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>VPC</KeyValuePairs.Term>
        <KeyValuePairs.Details>vpc-1234</KeyValuePairs.Details>
      </KeyValuePairs.Item>
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>Subnet</KeyValuePairs.Term>
        <KeyValuePairs.Details>subnet-5678</KeyValuePairs.Details>
      </KeyValuePairs.Item>
    </KeyValuePairs.GroupList>
  </KeyValuePairs.Group>
  <KeyValuePairs.Group>
    <KeyValuePairs.GroupTitle>Runtime</KeyValuePairs.GroupTitle>
    <KeyValuePairs.GroupList>
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>Language</KeyValuePairs.Term>
        <KeyValuePairs.Details>Node.js</KeyValuePairs.Details>
      </KeyValuePairs.Item>
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>Instances</KeyValuePairs.Term>
        <KeyValuePairs.Details>4</KeyValuePairs.Details>
      </KeyValuePairs.Item>
    </KeyValuePairs.GroupList>
  </KeyValuePairs.Group>
</KeyValuePairs.Root>
```

### With Info

```tsx
<KeyValuePairs.Root aria-label="Service metadata">
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>
      Region
      <KeyValuePairs.Info>
        <Tooltip.Root>
          <Tooltip.Trigger className="tale-button tale-button--ghost tale-button--sm">?</Tooltip.Trigger>
          <Tooltip.Popup>Primary deployment region.</Tooltip.Popup>
        </Tooltip.Root>
      </KeyValuePairs.Info>
    </KeyValuePairs.Term>
    <KeyValuePairs.Details>us-east-1</KeyValuePairs.Details>
  </KeyValuePairs.Item>
</KeyValuePairs.Root>
```

## Accessibility

- `KeyValuePairs.Root` renders a native `<dl>`.
- `KeyValuePairs.Term` and `KeyValuePairs.GroupTitle` render `<dt>`.
- `KeyValuePairs.Details` and `KeyValuePairs.GroupList` render `<dd>`.
- `KeyValuePairs.Item` and `KeyValuePairs.Group` render `<div>` wrappers, which are valid grouping children inside `<dl>`.
- Provide `aria-label` or `aria-labelledby` on `Root` when the list needs an accessible name. Prefer `aria-labelledby` when a visible heading already labels the summary.
- Keep `Term` before `Details` so the reading order matches the visual relationship.
- Interactive content inside `Info` must have its own accessible name.

## CSS Classes

- `.tale-key-value-pairs` -- Root container
- `.tale-key-value-pairs--divided` -- Divided variant
- `.tale-key-value-pairs--compact` -- Compact density
- `.tale-key-value-pairs--spacious` -- Spacious density
- `.tale-key-value-pairs__item` -- Pair wrapper
- `.tale-key-value-pairs__term` -- Pair term
- `.tale-key-value-pairs__details` -- Pair details
- `.tale-key-value-pairs__info` -- Inline info affordance
- `.tale-key-value-pairs__group` -- Group wrapper
- `.tale-key-value-pairs__group-title` -- Group title
- `.tale-key-value-pairs__group-details` -- Group details wrapper
- `.tale-key-value-pairs__group-list` -- Nested group list

## Pitfalls

<!-- pitfall: key-value-pairs-root-required -->
- **Use `KeyValuePairs.Root`, not `<KeyValuePairs>` directly** — `KeyValuePairs` is a namespace object.
  - anti-pattern: `<KeyValuePairs><KeyValuePairs.Item>...</KeyValuePairs.Item></KeyValuePairs>`
  - fix: `<KeyValuePairs.Root><KeyValuePairs.Item>...</KeyValuePairs.Item></KeyValuePairs.Root>`

<!-- pitfall: key-value-pairs-standard-aria-props -->
<!-- multi-idea-ok -->
- **Use standard React `aria-label` and `aria-labelledby` props** — Cloudscape-style `ariaLabel` and `ariaLabelledby` are not supported.
  - anti-pattern: `<KeyValuePairs.Root ariaLabel="Service metadata">`
  - fix: `<KeyValuePairs.Root aria-label="Service metadata">`

<!-- pitfall: key-value-pairs-column-range -->
- **`columns` accepts only `1`, `2`, `3`, or `4`** — larger values are clamped at runtime for JavaScript consumers but will fail TypeScript.
  - anti-pattern: `<KeyValuePairs.Root columns={6}>`
  - fix: `<KeyValuePairs.Root columns={4}>`

<!-- pitfall: key-value-pairs-term-before-details -->
- **Place `Term` before `Details` inside each `Item`** — this preserves the native description-list relationship and reading order.
  - anti-pattern: `<KeyValuePairs.Item><KeyValuePairs.Details>Active</KeyValuePairs.Details><KeyValuePairs.Term>Status</KeyValuePairs.Term></KeyValuePairs.Item>`
  - fix: `<KeyValuePairs.Item><KeyValuePairs.Term>Status</KeyValuePairs.Term><KeyValuePairs.Details>Active</KeyValuePairs.Details></KeyValuePairs.Item>`

<!-- pitfall: key-value-pairs-group-list-required -->
- **Use `GroupTitle` plus `GroupList` for grouped pairs** — do not put nested `Item` children directly inside `Group`.
  - anti-pattern: `<KeyValuePairs.Group><KeyValuePairs.Item>...</KeyValuePairs.Item></KeyValuePairs.Group>`
  - fix: `<KeyValuePairs.Group><KeyValuePairs.GroupTitle>Network</KeyValuePairs.GroupTitle><KeyValuePairs.GroupList><KeyValuePairs.Item>...</KeyValuePairs.Item></KeyValuePairs.GroupList></KeyValuePairs.Group>`

## Notes

- Custom component -- not built on a React Aria primitive.
- Responsive columns are calculated from the root width, `columns`, and `minColumnWidth`.
- The `divided` variant draws separators between visual rows, not every DOM sibling.
