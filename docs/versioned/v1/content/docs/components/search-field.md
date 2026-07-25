# SearchField

`import { SearchField } from '@tale-ui/react/search-field';`

A search input field with built-in clear button support.

## Parts

| Part | Description |
|------|-------------|
| `SearchField.Root` | Wrapper that manages search field state |
| `SearchField.Input` | The search text input |
| `SearchField.Label` | Accessible label |
| `SearchField.Description` | Helper text |
| `SearchField.ErrorMessage` | Validation error message |
| `SearchField.ClearButton` | Button to clear the input value |

## Props

Accepts all React Aria `SearchField` props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional class name for the root element. |
| `variant` | `'default' \| 'inline'` | `'default'` | Use `inline` for a borderless search field with a visually hidden label. |

## Basic Usage

```tsx
<SearchField.Root>
  <SearchField.Input placeholder="Search..." />
</SearchField.Root>
```

## Examples

### With Label

```tsx
<SearchField.Root>
  <SearchField.Label>Search</SearchField.Label>
  <SearchField.Input placeholder="Search..." />
</SearchField.Root>
```

### With Clear Button

```tsx
import { Icon } from '@tale-ui/react/icon';
import { X } from 'lucide-react';

<SearchField.Root defaultValue="React">
  <SearchField.Label>Search</SearchField.Label>
  <SearchField.Input placeholder="Search..." />
  <SearchField.ClearButton><Icon icon={X} size="sm" /></SearchField.ClearButton>
</SearchField.Root>
```

### Inline

```tsx
<SearchField.Root variant="inline">
  <SearchField.Label>Search documentation</SearchField.Label>
  <SearchField.Input placeholder="Search..." />
</SearchField.Root>
```

## CSS Classes

- `.tale-search-field` — Root
- `.tale-search-field--inline` — Inline variant
- `.tale-search-field__input` — Text input
- `.tale-search-field__label` — Label
- `.tale-search-field__description` — Description text
- `.tale-search-field__error` — Error message
- `.tale-search-field__clear` — Clear button

## Pitfalls

<!-- pitfall: search-field-clear-button-needs-icon -->
- **`SearchField.ClearButton` does NOT auto-render an icon** — pass `<Icon icon={X}>` as a child.
  - anti-pattern: `<SearchField.ClearButton />`
  - fix: `<SearchField.ClearButton><Icon icon={X} size="sm" /></SearchField.ClearButton>`
  - complete example:
    ```tsx
    import { SearchField } from '@tale-ui/react/search-field';
    import { Icon } from '@tale-ui/react/icon';
    import { X } from 'lucide-react';

    export function Example() {
      return (
        <SearchField.Root>
          <SearchField.Label>Search</SearchField.Label>
          <SearchField.Input placeholder="Search..." />
          <SearchField.ClearButton><Icon icon={X} size="sm" /></SearchField.ClearButton>
          <SearchField.Description>Search by name or keyword.</SearchField.Description>
          // For validation errors, use isInvalid on Root:
          // <SearchField.ErrorMessage>No results found.</SearchField.ErrorMessage>
        </SearchField.Root>
      );
    }
    ```

<!-- pitfall: search-field-no-input-group -->
- **No `SearchField.InputGroup` sub-part** — place `SearchField.Input` and `SearchField.ClearButton` directly inside `SearchField.Root`.
  - anti-pattern: `<SearchField.InputGroup><SearchField.Input /></SearchField.InputGroup>`
  - fix: `<SearchField.Root><SearchField.Input /><SearchField.ClearButton>...</SearchField.ClearButton></SearchField.Root>`

<!-- pitfall: search-field-default-value-on-root -->
- **`SearchField.Root` owns `defaultValue`** — do not put it on `SearchField.Input`.
  - anti-pattern: `<SearchField.Input defaultValue="React" />`
  - fix: `<SearchField.Root defaultValue="React"><SearchField.Input /></SearchField.Root>`

## Notes

- `ClearButton` clears the field value on press; pass custom children for the button content.
- The clear button is absolutely positioned inside the input (overlays the right side). The default input has `padding-inline-end` reserved for it; the `inline` variant removes horizontal input padding.
- The clear button automatically hides when the field is empty (via `data-empty` on the Root: `.tale-search-field[data-empty] .tale-search-field__clear { display: none }`).
- Use `variant="inline"` when a search field is embedded in container surfaces such as menus, popovers, headers, and picker panels.
- Supports `isDisabled` prop on the Root.
