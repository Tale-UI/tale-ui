# TextField

`import { TextField } from '@tale-ui/react/text-field';`

A single-line text input with label, description, and error message support.

## Parts

| Part | Description |
|------|-------------|
| `TextField.Root` | Wrapper that manages text field state |
| `TextField.Input` | The text input element |
| `TextField.Label` | Accessible label |
| `TextField.Description` | Helper text below the input |
| `TextField.ErrorMessage` | Validation error message (shown when `isInvalid`) |

## Props

Accepts all React Aria `TextField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<TextField.Root>
  <TextField.Input placeholder="Enter text..." />
</TextField.Root>
```

## Examples

### With Label and Description

```tsx
<TextField.Root>
  <TextField.Label>Name</TextField.Label>
  <TextField.Input />
  <TextField.Description>Helper text</TextField.Description>
</TextField.Root>
```

### With Error

```tsx
<TextField.Root isInvalid>
  <TextField.Label>Email</TextField.Label>
  <TextField.Input />
  <TextField.ErrorMessage>Please enter a valid email address</TextField.ErrorMessage>
</TextField.Root>
```

### Disabled

```tsx
<TextField.Root isDisabled>
  <TextField.Label>Name</TextField.Label>
  <TextField.Input placeholder="Disabled field" />
</TextField.Root>
```

## CSS Classes

- `.tale-text-field` — Root
- `.tale-text-field__input` — Text input
- `.tale-text-field__label` — Label
- `.tale-text-field__description` — Description text
- `.tale-text-field__error` — Error message

## Pitfalls

<!-- pitfall: text-field-input-attrs-on-input -->
- **`TextField.Root` accepts `name` — HTML input attributes (`type`, `minLength`, `maxLength`, `placeholder`) go on `TextField.Input`.**
  - anti-pattern: `<TextField.Root placeholder="Enter name" type="email">`
  - fix: `<TextField.Root name="email"><TextField.Input placeholder="Enter name" type="email" /></TextField.Root>`
  - complete example:
    ```tsx
    import { TextField } from '@tale-ui/react/text-field';

    export function Example() {
      return (
        <TextField.Root>
          <TextField.Label>Name</TextField.Label>
          <TextField.Input placeholder="Enter your name" />
          <TextField.Description>Your full legal name.</TextField.Description>
          // For validation errors, use isInvalid on Root:
          // <TextField.ErrorMessage>Name is required.</TextField.ErrorMessage>
        </TextField.Root>
      );
    }
    ```

<!-- pitfall: no-password-input-component -->
- **There is NO `PasswordInput` component** — for password fields, use `TextField` with `type="password"` on `TextField.Input`.
  - anti-pattern: `<PasswordInput name="password" />`
  - fix: `<TextField.Root><TextField.Label>Password</TextField.Label><TextField.Input name="password" type="password" /></TextField.Root>`
<!-- pitfall: use-textfield-for-any-prompt-that-says-text-field -->
- **Use TextField when the prompt explicitly mentions 'text field' or 'text fields' — do not substitute Input** — When a UI prompt describes form fields using the exact phrase 'text field' or 'text fields', the required component is TextField (TextField.Root > TextField.Label > TextField.Input), not Input. Both components render a labeled text input, but the word 'text field' in a prompt maps directly to the TextField component. Using Input instead will fail the required-component check whenever TextField is in the expected component list.
  - anti-pattern: `import { Input } from '@tale-ui/react/input'; // used when the prompt says 'text fields'`
  - anti-pattern: `<Input.Root><Input.Label>Name</Input.Label><Input.Input placeholder="Jane Doe" /></Input.Root>`
  - fix: `import { TextField } from '@tale-ui/react/text-field';`
  - fix: `<TextField.Root><TextField.Label>Name</TextField.Label><TextField.Input placeholder="Jane Doe" /></TextField.Root>`
  - complete example:
    ```tsx
    import { Button } from '@tale-ui/react/button';
    import { Card } from '@tale-ui/react/card';
    import { Column } from '@tale-ui/react/column';
    import { Row } from '@tale-ui/react/row';
    import { Select } from '@tale-ui/react/select';
    import { Text } from '@tale-ui/react/text';
    import { TextField } from '@tale-ui/react/text-field';

    export function SettingsPage() {
      return (
        <Column gap="l">
          <Text variant="heading" as="h1">Settings</Text>

          <Row gap="m">
            <Card.Root style={{ flex: 1 }}>
              <Card.Header>
                <Text variant="heading">Profile</Text>
              </Card.Header>
              <Card.Body>
                <Column gap="s">
                  <TextField.Root>
                    <TextField.Label>Name</TextField.Label>
                    <TextField.Input placeholder="Jane Doe" />
                  </TextField.Root>
                  <TextField.Root>
                    <TextField.Label>Email</TextField.Label>
                    <TextField.Input placeholder="jane@example.com" />
                  </TextField.Root>
                </Column>
              </Card.Body>
            </Card.Root>

            <Card.Root style={{ flex: 1 }}>
              <Card.Header>
                <Text variant="heading">Preferences</Text>
              </Card.Header>
              <Card.Body>
                <Select.Root>
                  <Select.Label>Theme</Select.Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Popover>
                    <Select.ListBox>
                      <Select.Item id="light" textValue="Light">Light</Select.Item>
                      <Select.Item id="dark" textValue="Dark">Dark</Select.Item>
                      <Select.Item id="system" textValue="System">System</Select.Item>
                    </Select.ListBox>
                  </Select.Popover>
                </Select.Root>
              </Card.Body>
            </Card.Root>
          </Row>

          <Row justify="end" gap="s">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save</Button>
          </Row>
        </Column>
      );
    }
    ```

## Notes

- Supports `isRequired`, `isInvalid`, `isDisabled`, and `isReadOnly` props on the Root.
- `ErrorMessage` only renders when `isInvalid` is true on the Root.
