# EmptyState

`import { EmptyState } from '@tale-ui/react/empty-state';`

A placeholder for empty content areas — empty tables, search results, lists, or dashboards.

## Parts

| Part | Description |
|------|-------------|
| `EmptyState.Root` | Container (`<div>`). Accepts `size` prop. |
| `EmptyState.Icon` | Wrapper for an icon or illustration. |
| `EmptyState.Title` | Main heading (`<h3>`). |
| `EmptyState.Description` | Supporting text (`<p>`). |
| `EmptyState.Actions` | Container for action buttons. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant affecting spacing and typography |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<EmptyState.Root>
  <EmptyState.Icon><Icon icon={InboxIcon} size="lg" /></EmptyState.Icon>
  <EmptyState.Title>No messages</EmptyState.Title>
  <EmptyState.Description>Your inbox is empty.</EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary">Compose</Button>
  </EmptyState.Actions>
</EmptyState.Root>
```

## Examples

### Minimal (Title Only)

```tsx
<EmptyState.Root>
  <EmptyState.Title>No items</EmptyState.Title>
</EmptyState.Root>
```

### With Icon and Description

```tsx
<EmptyState.Root>
  <EmptyState.Icon><Icon icon={SearchIcon} size="lg" /></EmptyState.Icon>
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>Try adjusting your search terms or filters.</EmptyState.Description>
</EmptyState.Root>
```

### Sizes

```tsx
<EmptyState.Root size="sm">
  <EmptyState.Title>No items</EmptyState.Title>
  <EmptyState.Description>Nothing here yet.</EmptyState.Description>
</EmptyState.Root>

<EmptyState.Root size="md">
  <EmptyState.Title>No items</EmptyState.Title>
  <EmptyState.Description>Nothing here yet.</EmptyState.Description>
</EmptyState.Root>

<EmptyState.Root size="lg">
  <EmptyState.Title>No items</EmptyState.Title>
  <EmptyState.Description>Nothing here yet.</EmptyState.Description>
</EmptyState.Root>
```

### With Actions

```tsx
<EmptyState.Root>
  <EmptyState.Icon><Icon icon={PlusCircleIcon} size="lg" /></EmptyState.Icon>
  <EmptyState.Title>No projects</EmptyState.Title>
  <EmptyState.Description>Get started by creating your first project.</EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary">Create project</Button>
    <Button variant="ghost">Learn more</Button>
  </EmptyState.Actions>
</EmptyState.Root>
```

## CSS Classes

- `.tale-empty-state` — Root container
- `.tale-empty-state--sm` — Small size variant
- `.tale-empty-state--lg` — Large size variant
- `.tale-empty-state__icon` — Icon container
- `.tale-empty-state__title` — Heading
- `.tale-empty-state__description` — Supporting text
- `.tale-empty-state__actions` — Action buttons container

## Pitfalls

<!-- pitfall: empty-state-no-header-or-content-parts -->
- **No `EmptyState.Header` or `EmptyState.Content`** — the available sub-parts are `Root`, `Icon`, `Title`, `Description`, and `Actions` only.
  - anti-pattern: `<EmptyState.Root><EmptyState.Header><EmptyState.Title>No results</EmptyState.Title></EmptyState.Header></EmptyState.Root>`
  - fix: `<EmptyState.Root><EmptyState.Title>No results</EmptyState.Title></EmptyState.Root>`
  - complete example:
    ```tsx
    import { EmptyState } from '@tale-ui/react/empty-state';
    import { Icon } from '@tale-ui/react/icon';
    import { Button } from '@tale-ui/react/button';
    import { InboxIcon } from 'lucide-react';

    export function Example() {
      return (
        <EmptyState.Root>
          <EmptyState.Icon><Icon icon={InboxIcon} size="lg" /></EmptyState.Icon>
          <EmptyState.Title>No messages</EmptyState.Title>
          <EmptyState.Description>Your inbox is empty.</EmptyState.Description>
          <EmptyState.Actions><Button variant="primary">Compose</Button></EmptyState.Actions>
        </EmptyState.Root>
      );
    }
    ```
<!-- pitfall: use-emptystate-for-any-prompt -->
- **Use EmptyState for any prompt that asks for an empty state, no-results view, or zero-data placeholder** — When the request is to show a heading and optional description for a state where there is no content (e.g. 'No results', 'Nothing here yet', 'Your inbox is empty'), render EmptyState.Root with EmptyState.Title and EmptyState.Description instead of leaving the file empty, returning null, or substituting Column + Text. The available sub-parts are Root, Icon, Title, Description, and Actions — do not invent sub-parts like EmptyState.Header or EmptyState.Content.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function NoResults() {}`
  - anti-pattern: `export function NoResults() { return null; }`
  - anti-pattern: `<Column gap="s"><Text variant="heading">No results</Text><Text color="muted">Try different search terms.</Text></Column>`
  - fix: `import { EmptyState } from '@tale-ui/react/empty-state'; export function NoResults() { return <EmptyState.Root><EmptyState.Title>No results</EmptyState.Title><EmptyState.Description>Try using different search terms to find what you're looking for.</EmptyState.Description></EmptyState.Root>; }`
  - complete example:
    ```tsx
    import { EmptyState } from '@tale-ui/react/empty-state';

    export function NoResults() {
      return (
        <EmptyState.Root>
          <EmptyState.Title>No results</EmptyState.Title>
          <EmptyState.Description>Try using different search terms to find what you're looking for.</EmptyState.Description>
        </EmptyState.Root>
      );
    }
    ```

## Notes

- Custom component — not built on a React Aria primitive.
- All parts are optional. Use only what you need.
- The `size` prop on `Root` affects spacing and typography of all child parts via CSS descendant selectors.
- Default size is `md`.
