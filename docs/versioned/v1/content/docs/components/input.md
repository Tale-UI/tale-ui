# Input

`import { Input } from '@tale-ui/react/input';`

A compound text input component with label, description, and error message parts, built on React Aria's TextField.

## Parts

| Part                 | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `Input.Root`         | Wraps the entire text field (React Aria `TextField`) |
| `Input.Input`        | The `<input>` element itself                         |
| `Input.Label`        | Accessible label                                     |
| `Input.Description`  | Helper text below the input                          |
| `Input.ErrorMessage` | Validation error message (shown when `isInvalid`)    |

## Props

Accepts all React Aria `TextField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Input.Root>
  <Input.Input size="md" placeholder="Type here..." />
</Input.Root>
```

## Examples

### With Label

```tsx
<Input.Root>
  <Input.Label>Email address</Input.Label>
  <Input.Input size="md" placeholder="Type here..." />
</Input.Root>
```

### With Description

```tsx
<Input.Root>
  <Input.Label>Username</Input.Label>
  <Input.Input size="md" placeholder="Type here..." />
  <Input.Description>Must be 3-20 characters long.</Input.Description>
</Input.Root>
```

### With Error

```tsx
<Input.Root isInvalid>
  <Input.Label>Email</Input.Label>
  <Input.Input size="md" placeholder="Type here..." />
  <Input.ErrorMessage>Please enter a valid email address.</Input.ErrorMessage>
</Input.Root>
```

### Disabled

```tsx
<Input.Root isDisabled>
  <Input.Label>Disabled input</Input.Label>
  <Input.Input size="md" placeholder="Cannot edit" />
</Input.Root>
```

### Read Only

```tsx
<Input.Root isReadOnly>
  <Input.Label>Read-only input</Input.Label>
  <Input.Input size="md" value="This value cannot be changed" />
</Input.Root>
```

### All Sizes

```tsx
<Input.Root>
  <Input.Label>Small</Input.Label>
  <Input.Input size="sm" placeholder="Small input" />
</Input.Root>

<Input.Root>
  <Input.Label>Medium</Input.Label>
  <Input.Input size="md" placeholder="Medium input" />
</Input.Root>

<Input.Root>
  <Input.Label>Large</Input.Label>
  <Input.Input size="lg" placeholder="Large input" />
</Input.Root>
```

## CSS Classes

- `.tale-input__root` -- Root wrapper
- `.tale-input` -- The input element (base)
- `.tale-input--sm` -- Small size modifier
- `.tale-input--lg` -- Large size modifier
- `.tale-input__label` -- Label
- `.tale-input__description` -- Description text
- `.tale-input__error` -- Error message text

## Notes

- `size` defaults to `"md"`. The `--md` modifier class is omitted from the DOM (it is the default).
- Set `isInvalid` on `Input.Root` to display error styling and reveal `Input.ErrorMessage`.
- `isDisabled` and `isReadOnly` are set on `Input.Root` and propagate to the inner input.

## Pitfalls

<!-- pitfall: use-input-for-text-input-prompts -->

- **Use Input for any prompt that asks for a text input field with a label or description** — When a prompt asks for a labeled text input field (optionally with a description or error message), render Input.Root with Input.Label, Input.Input, and optionally Input.Description instead of leaving the file empty, returning null, or substituting TextField or a bare <input> element.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function FullNameField() {}`
  - anti-pattern: `export function FullNameField() { return null; }`
  - anti-pattern: `<input type="text" placeholder="Full Name" />`
  - fix: `import { Input } from '@tale-ui/react/input'; export function FullNameField() { return <Input.Root><Input.Label>Full Name</Input.Label><Input.Input placeholder="Full Name" /><Input.Description>Enter your first and last name as they appear on your ID.</Input.Description></Input.Root>; }`
  - complete example:

    ```tsx
    import { Input } from '@tale-ui/react/input';

    export function FullNameField() {
      return (
        <Input.Root>
          <Input.Label>Full Name</Input.Label>
          <Input.Input placeholder="Full Name" />
          <Input.Description>
            Enter your first and last name as they appear on your ID.
          </Input.Description>
        </Input.Root>
      );
    }
    ```
