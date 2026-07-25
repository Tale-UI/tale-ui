# Form

`import { Form } from '@tale-ui/react/form';`

A styled form element with built-in React Aria validation support.

## Props

Accepts all React Aria `Form` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Form onSubmit={(e) => { e.preventDefault(); }}>
  <TextField.Root name="username" isRequired>
    <TextField.Label>Username</TextField.Label>
    <TextField.Input placeholder="Enter username" />
  </TextField.Root>
  <Button type="submit">Submit</Button>
</Form>
```

## Examples

### With Native Validation

```tsx
<Form
  validationBehavior="native"
  onSubmit={(e) => {
    e.preventDefault();
    alert('Validation passed!');
  }}
>
  <TextField.Root name="fullName" isRequired>
    <TextField.Label>Full Name</TextField.Label>
    <TextField.Input placeholder="Enter your full name" />
  </TextField.Root>
  <TextField.Root name="password" type="password" isRequired minLength={8}>
    <TextField.Label>Password</TextField.Label>
    <TextField.Input placeholder="At least 8 characters" />
  </TextField.Root>
  <NumberField.Root name="age" minValue={18} maxValue={120}>
    <NumberField.Label>Age</NumberField.Label>
    <NumberField.Input placeholder="Must be 18+" />
  </NumberField.Root>
  <Button type="submit">Submit</Button>
</Form>
```

## CSS Classes

- `.tale-form` — Base

## Pitfalls

<!-- pitfall: form-no-sub-parts -->
- **`Form` is a simple component with no sub-parts** — There is no `Form.Submit`, `Form.Field`, or `Form.Label`. Use `<Form>` directly and compose `Button`, `Field`, and other components as children.
  - anti-pattern: `<Form.Root onSubmit={handleSubmit}>`
  - fix: `<Form onSubmit={handleSubmit}>`
  - complete example:
    ```tsx
    import { Form } from '@tale-ui/react/form';
    import { TextField } from '@tale-ui/react/text-field';
    import { Button } from '@tale-ui/react/button';

    export function Example() {
      return (
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <TextField.Root isRequired>
            <TextField.Label>Username</TextField.Label>
            <TextField.Input />
          </TextField.Root>
          <Button type="submit" variant="primary">Submit</Button>
        </Form>
      );
    }
    ```

<!-- pitfall: form-method-lowercase -->
- **method prop requires lowercase values** — Valid values are `"get"`, `"post"`, and `"dialog"`. Uppercase values like `"GET"` or `"POST"` are not valid.
  - anti-pattern: `<Form method="POST">`
  - fix: `<Form method="post">`
<!-- pitfall: when-wrapping-form-fields-in -->
- **When wrapping form fields in Column, use spacing-token gap values, not component-size names** — `gap="md"` is not a valid `Gap` value and causes `Type '"md"' is not assignable to type 'Gap | undefined'`; use `gap="s"` for tight field stacks (recommended for forms) or `gap="m"` for looser spacing.
  - anti-pattern: `<Column gap="md">`
  - fix: `<Column gap="s">`
<!-- pitfall: form-onsubmit-formdata-cast -->
- **Cast e.currentTarget to HTMLFormElement inside the FormData call in onSubmit** — React types e.currentTarget as EventTarget & HTMLFormElement — an intersection TypeScript rejects when passed to new FormData(), producing 'No overload matches this call'. The cast must appear directly inside the FormData call. Placing it in a separate typed variable first does not resolve the overload mismatch. Always write: new FormData(e.currentTarget as HTMLFormElement).
  - anti-pattern: `const data = Object.fromEntries(new FormData(e.currentTarget));`
  - anti-pattern: `const formEl = e.currentTarget as HTMLFormElement; const data = Object.fromEntries(new FormData(formEl));`
  - fix: `const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));`
  - complete example:
    ```tsx
    import { Button } from '@tale-ui/react/button';
    import { Column } from '@tale-ui/react/column';
    import { Form } from '@tale-ui/react/form';
    import { Text } from '@tale-ui/react/text';
    import { TextField } from '@tale-ui/react/text-field';

    export function LoginForm() {
      return (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
            console.log('Login submitted:', data);
          }}
          style={{ maxWidth: 400 }}
        >
          <Column gap="m">
            <Text variant="heading" as="h1">Sign in</Text>

            <Column gap="s">
              <TextField.Root name="email" isRequired>
                <TextField.Label>Email</TextField.Label>
                <TextField.Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <TextField.ErrorMessage>Enter a valid email address.</TextField.ErrorMessage>
              </TextField.Root>

              <TextField.Root name="password" isRequired>
                <TextField.Label>Password</TextField.Label>
                <TextField.Input
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <TextField.ErrorMessage>Password is required.</TextField.ErrorMessage>
              </TextField.Root>
            </Column>

            <Button type="submit" variant="primary">Sign in</Button>
          </Column>
        </Form>
      );
    }
    ```

## Notes

- This is a simple (non-compound) component -- use `<Form>` directly.
- Set `validationBehavior="native"` to use the browser's built-in constraint validation.
- Built on React Aria `Form`.
