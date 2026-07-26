# Field

`import { Field } from '@tale-ui/react/field';`

A generic field wrapper providing label, description, error, and control layout for any input.

## Parts

| Part                | Description                                  |
| ------------------- | -------------------------------------------- |
| `Field.Root`        | Outer container div.                         |
| `Field.Label`       | The field label.                             |
| `Field.Control`     | Wrapper around the input element.            |
| `Field.Description` | Help text below the input.                   |
| `Field.Error`       | Validation error message.                    |
| `Field.Item`        | Optional item container for grouped content. |

## Props

Accepts all React Aria `Label`, `Text`, and `FieldError` props on sub-parts, plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Field.Root>
  <Field.Label>Name</Field.Label>
  <Field.Control>
    <input className="tale-input" placeholder="Enter your name" />
  </Field.Control>
</Field.Root>
```

## Examples

### With Description

```tsx
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Control>
    <input className="tale-input" type="email" placeholder="you@example.com" />
  </Field.Control>
  <Field.Description>We will never share your email with anyone.</Field.Description>
</Field.Root>
```

### With Error

For error messages to render, use a validatable component like `Input.Root` with `isInvalid`:

```tsx
import { Input } from '@tale-ui/react/input';

<Input.Root isInvalid>
  <Input.Label>Password</Input.Label>
  <Input.Input type="password" />
  <Input.Description>Must be at least 8 characters long.</Input.Description>
  <Input.ErrorMessage>This field is required.</Input.ErrorMessage>
</Input.Root>;
```

## CSS Classes

- `.tale-field` — Base
- `.tale-field__label` — Label
- `.tale-field__control` — Input wrapper
- `.tale-field__description` — Help text
- `.tale-field__error` — Error message
- `.tale-field__item` — Item container

## Pitfalls

<!-- pitfall: field-root-no-validation-props -->

- **`Field.Root` does not accept validation state props** — `Field.Root` is a plain layout container. It does not accept `isInvalid`, `isRequired`, `isDisabled`, or `isReadOnly`. For validated fields, use a component like `Input.Root` that has React Aria field context built in.
  - anti-pattern: `<Field.Root isInvalid={hasError}>`
  - fix: `<Field.Root><Input.Root isInvalid={hasError} /></Field.Root>`
  - complete example:

    ```tsx
    import { Field } from '@tale-ui/react/field';

    export function Example() {
      return (
        <>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Field.Control>
              <input className="tale-input" placeholder="you@example.com" />
            </Field.Control>
            <Field.Description>We'll never share your email.</Field.Description>
            // For validation errors: // <Field.Error>Please enter a valid email.</Field.Error>
          </Field.Root>
          // Field.Item wraps multiple controls in a row:
          <Field.Root>
            <Field.Label>Phone</Field.Label>
            <Field.Item>
              <select className="tale-select__trigger">...</select>
              <input className="tale-input" placeholder="555-0000" />
            </Field.Item>
          </Field.Root>
        </>
      );
    }
    ```

<!-- pitfall: field-no-standalone-exports -->

- **No standalone `FieldLabel`, `FieldError`, `FieldControl`, or `FieldDescription` exports** — All sub-parts are accessed through the `Field` namespace: `Field.Label`, `Field.Error`, `Field.Control`, `Field.Description`.
  - anti-pattern: `import { FieldLabel } from '@tale-ui/react/field'`
  - fix: `import { Field } from '@tale-ui/react/field'`

<!-- pitfall: field-control-uses-plain-input -->
- **Inside Field.Control, use a plain `<input className="tale-input">` — never `Input.Root > Input.Field`** — `Input.Field` is not a valid sub-part of the `Input` namespace; using it causes "Property 'Field' does not exist" TypeScript errors. Place a native `<input className="tale-input">` directly inside `Field.Control`.
  - anti-pattern: `<Field.Control><Input.Root><Input.Field placeholder="..." /></Input.Root></Field.Control>`
  - fix: `<Field.Control><input className="tale-input" placeholder="..." /></Field.Control>`

## Notes

- `Field` is a layout component -- it does not include its own input. Place any `<input>`, `<textarea>`, or custom input component inside `Field.Control`.
- Use the `.tale-input` class on native `<input>` elements for consistent styling.
