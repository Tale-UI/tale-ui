# CheckboxField

`import { CheckboxField } from '@tale-ui/react/checkbox-field';`

A checkbox with built-in support for a description and validation error message, built on React Aria's CheckboxField. Replaces the deprecated `Checkbox` component.

## Parts

| Part                        | Description                                                              |
| --------------------------- | ------------------------------------------------------------------------ |
| `CheckboxField.Root`        | The field wrapper (div) that lays out the button, description, and error |
| `CheckboxField.Button`      | The clickable label row containing the indicator and label text          |
| `CheckboxField.Indicator`   | The visual box that contains the check/minus icon                        |
| `CheckboxField.Description` | Supporting help text below the checkbox                                  |
| `CheckboxField.Error`       | Validation error message (renders only when invalid)                     |

> **Important:** `CheckboxField.Indicator` is a plain `<span>` — it does NOT include a built-in checkmark icon. You must provide a child icon using `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` and `lucide-react`.

## Props

Accepts all React Aria `CheckboxField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### CheckboxField.Root

| Prop   | Type           | Default | Description                    |
| ------ | -------------- | ------- | ------------------------------ |
| `size` | `'sm' \| 'md'` | `'md'`  | Size of the checkbox indicator |

## Basic Usage

```tsx
import { CheckboxField } from '@tale-ui/react/checkbox-field';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

<CheckboxField.Root>
  <CheckboxField.Button>
    <CheckboxField.Indicator>
      <Icon icon={Check} size="sm" />
    </CheckboxField.Indicator>
    Accept terms and conditions
  </CheckboxField.Button>
</CheckboxField.Root>;
```

## Examples

### With Description

```tsx
<CheckboxField.Root>
  <CheckboxField.Button>
    <CheckboxField.Indicator>
      <Icon icon={Check} size="sm" />
    </CheckboxField.Indicator>
    Email me product updates
  </CheckboxField.Button>
  <CheckboxField.Description>You can unsubscribe at any time.</CheckboxField.Description>
</CheckboxField.Root>
```

### With Validation Error

```tsx
<CheckboxField.Root isRequired isInvalid>
  <CheckboxField.Button>
    <CheckboxField.Indicator>
      <Icon icon={Check} size="sm" />
    </CheckboxField.Indicator>
    Accept terms and conditions
  </CheckboxField.Button>
  <CheckboxField.Error>You must accept the terms to continue.</CheckboxField.Error>
</CheckboxField.Root>
```

### Controlled

```tsx
const [selected, setSelected] = useState(false);

<CheckboxField.Root isSelected={selected} onChange={setSelected}>
  <CheckboxField.Button>
    <CheckboxField.Indicator>
      <Icon icon={Check} size="sm" />
    </CheckboxField.Indicator>
    Enable notifications
  </CheckboxField.Button>
</CheckboxField.Root>;
```

## CSS Classes

- `.tale-checkbox-field` -- Base (root field wrapper)
- `.tale-checkbox-field--sm` -- Small size (0.875rem indicator)
- `.tale-checkbox-field__button` -- The clickable label row
- `.tale-checkbox-field__indicator` -- The visual indicator box
- `.tale-checkbox-field__description` -- Help text below the checkbox
- `.tale-checkbox-field__error` -- Validation error message

## Pitfalls

<!-- pitfall: checkbox-field-always-use-namespace -->

- **Always use the `CheckboxField` namespace via `<CheckboxField.Root>`, never bare `<CheckboxField>` directly** — calling `<CheckboxField>` directly causes "cannot be used as a JSX component" errors.
  - anti-pattern: `<CheckboxField>Label</CheckboxField>`
  - fix: `<CheckboxField.Root>...</CheckboxField.Root>`
  - complete example:

    ```tsx
    import { CheckboxField } from '@tale-ui/react/checkbox-field';
    import { Icon } from '@tale-ui/react/icon';
    import { Check } from 'lucide-react';

    export function Example() {
      return (
        <CheckboxField.Root>
          <CheckboxField.Button>
            <CheckboxField.Indicator>
              <Icon icon={Check} size="sm" />
            </CheckboxField.Indicator>
            Accept terms and conditions
          </CheckboxField.Button>
        </CheckboxField.Root>
      );
    }
    ```

<!-- pitfall: checkbox-field-label-inside-button -->

- **The label text goes inside `CheckboxField.Button`, not directly in `CheckboxField.Root`** — `Root` is a `<div>` layout wrapper; only `Button` (a `<label>`) associates text with the input for clicks and screen readers.
  - anti-pattern: `<CheckboxField.Root>Accept terms</CheckboxField.Root>`
  - fix: `<CheckboxField.Root><CheckboxField.Button>Accept terms</CheckboxField.Button></CheckboxField.Root>`

<!-- pitfall: checkbox-field-indicator-needs-icon -->

- **`CheckboxField.Indicator` needs an `<Icon>` child — it does not render a checkmark automatically** — provide `<Icon icon={Check} size="sm" />` as a child.
  - anti-pattern: `<CheckboxField.Indicator />`
  - fix: `<CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>`

<!-- cross-pitfall-ref: no-visual-exports-for-interactive-ui -->

## Notes

- You must provide your own icon inside `CheckboxField.Indicator` — use `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` with `lucide-react`.
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `CheckboxField.Error` renders only when the field is invalid (`isInvalid` or failed `validate`).
- Prefer `CheckboxField` over the deprecated `Checkbox` for new code; `Checkbox` remains available for backwards compatibility.
- When used inside a `CheckboxGroup`, add a `value` prop to each `CheckboxField.Root`.
- **Size guidance:** The default `md` size is almost always the right choice. The `sm` variant is intended for edge-cases only (e.g. dense data tables or compact toolbars) and should be seldom used — it reduces the touch target and can hurt readability.
