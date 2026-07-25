# TextArea

`import { TextArea } from '@tale-ui/react/text-area';`

A multi-line text input with label, description, and error message support.

## Parts

| Part | Description |
|------|-------------|
| `TextArea.Root` | Wrapper that manages text area state |
| `TextArea.TextArea` | The textarea element |
| `TextArea.Label` | Accessible label |
| `TextArea.Description` | Helper text below the textarea |
| `TextArea.ErrorMessage` | Validation error message (shown when `isInvalid`) |

## Props

Accepts all React Aria `TextField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<TextArea.Root>
  <TextArea.TextArea placeholder="Enter text..." />
</TextArea.Root>
```

## Examples

### With Label and Description

```tsx
<TextArea.Root>
  <TextArea.Label>Bio</TextArea.Label>
  <TextArea.TextArea />
  <TextArea.Description>Max 500 chars</TextArea.Description>
</TextArea.Root>
```

### With Error

```tsx
<TextArea.Root isInvalid>
  <TextArea.Label>Bio</TextArea.Label>
  <TextArea.TextArea />
  <TextArea.ErrorMessage>This field is required</TextArea.ErrorMessage>
</TextArea.Root>
```

### Disabled

```tsx
<TextArea.Root isDisabled>
  <TextArea.Label>Bio</TextArea.Label>
  <TextArea.TextArea placeholder="Disabled field" />
</TextArea.Root>
```

## CSS Classes

- `.tale-text-area` — Root
- `.tale-text-area__textarea` — Textarea element
- `.tale-text-area__label` — Label
- `.tale-text-area__description` — Description text
- `.tale-text-area__error` — Error message

## Pitfalls

<!-- cross-pitfall-ref: textarea-hyphenated-path -->

<!-- pitfall: text-area-pascal-case-sub-part -->
- **`TextArea.TextArea` sub-part is PascalCase, NOT `TextArea.Textarea`** — the lowercase 'a' variant causes 'Property does not exist' TypeScript errors.
  - anti-pattern: `<TextArea.Textarea placeholder="..." />`
  - fix: `<TextArea.TextArea placeholder="..." />`
  - complete example:
    ```tsx
    import { TextArea } from '@tale-ui/react/text-area';

    export function Example() {
      return (
        <TextArea.Root>
          <TextArea.Label>Bio</TextArea.Label>
          <TextArea.TextArea placeholder="Tell us about yourself..." />
          <TextArea.Description>Max 500 characters.</TextArea.Description>
          // For validation errors, use isInvalid on Root:
          // <TextArea.ErrorMessage>Bio is required.</TextArea.ErrorMessage>
        </TextArea.Root>
      );
    }
    ```

## Notes

- Supports `isRequired`, `isInvalid`, `isDisabled`, and `isReadOnly` props on the Root.
- `ErrorMessage` only renders when `isInvalid` is true on the Root.
