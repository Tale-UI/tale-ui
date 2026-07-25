# SwitchField

`import { SwitchField } from '@tale-ui/react/switch-field';`

A toggle switch with built-in support for a description and validation error message, built on React Aria's SwitchField. Replaces the deprecated `Switch` component.

## Parts

| Part                      | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `SwitchField.Root`        | The field wrapper (div) that lays out the button, description, and error |
| `SwitchField.Button`      | The clickable label row containing the track, thumb, and label text      |
| `SwitchField.Thumb`       | The sliding circle inside the track                                      |
| `SwitchField.Description` | Supporting help text below the switch                                    |
| `SwitchField.Error`       | Validation error message (renders only when invalid)                     |

> **Important:** `SwitchField.Button` does NOT render the thumb automatically. You must provide an explicit `<SwitchField.Thumb />` as its first child.

## Props

Accepts all React Aria `SwitchField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { SwitchField } from '@tale-ui/react/switch-field';

<SwitchField.Root>
  <SwitchField.Button>
    <SwitchField.Thumb />
    Enable notifications
  </SwitchField.Button>
</SwitchField.Root>;
```

## Examples

### With Description

```tsx
<SwitchField.Root>
  <SwitchField.Button>
    <SwitchField.Thumb />
    Enable notifications
  </SwitchField.Button>
  <SwitchField.Description>We'll send you updates about your account.</SwitchField.Description>
</SwitchField.Root>
```

### With Validation Error

```tsx
<SwitchField.Root isRequired isInvalid>
  <SwitchField.Button>
    <SwitchField.Thumb />
    Accept usage analytics
  </SwitchField.Button>
  <SwitchField.Error>You must enable analytics to continue.</SwitchField.Error>
</SwitchField.Root>
```

### Controlled

```tsx
const [selected, setSelected] = useState(false);

<SwitchField.Root isSelected={selected} onChange={setSelected}>
  <SwitchField.Button>
    <SwitchField.Thumb />
    Enable notifications
  </SwitchField.Button>
</SwitchField.Root>;
```

## CSS Classes

- `.tale-switch-field` -- Base (root field wrapper)
- `.tale-switch-field__button` -- The clickable label row carrying the track
- `.tale-switch-field__thumb` -- The sliding thumb circle
- `.tale-switch-field__description` -- Help text below the switch
- `.tale-switch-field__error` -- Validation error message

## Pitfalls

<!-- pitfall: switch-field-always-use-namespace -->

- **Always use the `SwitchField` namespace via `<SwitchField.Root>`, never bare `<SwitchField>` directly** — calling `<SwitchField>` directly causes "cannot be used as a JSX component" errors.
  - anti-pattern: `<SwitchField>Label</SwitchField>`
  - fix: `<SwitchField.Root>...</SwitchField.Root>`
  - complete example:

    ```tsx
    import { SwitchField } from '@tale-ui/react/switch-field';

    export function Example() {
      return (
        <SwitchField.Root>
          <SwitchField.Button>
            <SwitchField.Thumb />
            Enable notifications
          </SwitchField.Button>
        </SwitchField.Root>
      );
    }
    ```

<!-- pitfall: switch-field-label-inside-button -->

- **The label text goes inside `SwitchField.Button`, not directly in `SwitchField.Root`** — `Root` is a `<div>` layout wrapper; only `Button` (a `<label>`) associates text with the input for clicks and screen readers.
  - anti-pattern: `<SwitchField.Root>Enable notifications</SwitchField.Root>`
  - fix: `<SwitchField.Root><SwitchField.Button>Enable notifications</SwitchField.Button></SwitchField.Root>`

<!-- pitfall: switch-field-thumb-required -->

- **`SwitchField.Button` needs an explicit `<SwitchField.Thumb />` child — the thumb is not rendered automatically** — without it the track renders empty with no sliding circle.
  - anti-pattern: `<SwitchField.Button>Enable notifications</SwitchField.Button>`
  - fix: `<SwitchField.Button><SwitchField.Thumb />Enable notifications</SwitchField.Button>`

<!-- cross-pitfall-ref: no-visual-exports-for-interactive-ui -->

## Notes

- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `SwitchField.Error` renders only when the field is invalid (`isInvalid` or failed `validate`).
- Prefer `SwitchField` over the deprecated `Switch` for new code; `Switch` remains available for backwards compatibility.
- Unlike the deprecated `Switch`, `SwitchField` supports validation: `isRequired`, `isInvalid`, and `validate` flow through to the field, and `SwitchField.Error` displays the message.
