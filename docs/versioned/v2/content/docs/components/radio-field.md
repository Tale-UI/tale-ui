# RadioField

`import { RadioField } from '@tale-ui/react/radio-field';`

A radio button with built-in support for a description and validation error message, built on React Aria's RadioField. Replaces the deprecated `Radio` component. Must be used inside a `RadioGroup` (from `@tale-ui/react/radio-group`).

## Parts

| Part                     | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `RadioField.Root`        | The field wrapper (div) that lays out the button, description, and error |
| `RadioField.Button`      | The clickable label row containing the indicator and label text          |
| `RadioField.Indicator`   | The visual round circle that contains the dot                            |
| `RadioField.Dot`         | The inner filled dot shown when the radio is selected                    |
| `RadioField.Description` | Supporting help text below the radio                                     |
| `RadioField.Error`       | Validation error message (renders only when the group is invalid)        |

> **Important:** `RadioField.Indicator` is a plain `<span>` — it does NOT render the dot automatically. You must provide `<RadioField.Dot />` as its child.

## Props

Accepts all React Aria `RadioField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### RadioField.Root

| Prop   | Type           | Default | Description                 |
| ------ | -------------- | ------- | --------------------------- |
| `size` | `'sm' \| 'md'` | `'md'`  | Size of the radio indicator |

## Basic Usage

```tsx
import { RadioGroup } from '@tale-ui/react/radio-group';
import { RadioField } from '@tale-ui/react/radio-field';

<RadioGroup label="Favorite color">
  <RadioField.Root value="red">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Red
    </RadioField.Button>
  </RadioField.Root>
  <RadioField.Root value="blue">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Blue
    </RadioField.Button>
  </RadioField.Root>
</RadioGroup>;
```

## Examples

### With Description

```tsx
<RadioGroup label="Subscription plan">
  <RadioField.Root value="pro">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Pro
    </RadioField.Button>
    <RadioField.Description>Unlimited projects and priority support.</RadioField.Description>
  </RadioField.Root>
</RadioGroup>
```

### With Validation Error

Validation lives on the group — set `isRequired`/`isInvalid` on `RadioGroup` and the `RadioField.Error` renders the group's error.

```tsx
<RadioGroup label="Subscription plan" isRequired isInvalid>
  <RadioField.Root value="free">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Free
    </RadioField.Button>
    <RadioField.Error>Please choose a plan to continue.</RadioField.Error>
  </RadioField.Root>
</RadioGroup>
```

### Group of Options

```tsx
<RadioGroup label="Delivery speed" defaultValue="standard">
  <RadioField.Root value="standard">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Standard (3–5 days)
    </RadioField.Button>
  </RadioField.Root>
  <RadioField.Root value="express">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Express (1–2 days)
    </RadioField.Button>
  </RadioField.Root>
  <RadioField.Root value="overnight">
    <RadioField.Button>
      <RadioField.Indicator>
        <RadioField.Dot />
      </RadioField.Indicator>
      Overnight
    </RadioField.Button>
  </RadioField.Root>
</RadioGroup>
```

## CSS Classes

- `.tale-radio-field` -- Base (root field wrapper)
- `.tale-radio-field--sm` -- Small size indicator
- `.tale-radio-field__button` -- The clickable label row
- `.tale-radio-field__indicator` -- The visual round indicator circle
- `.tale-radio-field__dot` -- The inner filled dot (visible when selected)
- `.tale-radio-field__description` -- Help text below the radio
- `.tale-radio-field__error` -- Validation error message

## Pitfalls

<!-- pitfall: radio-field-always-use-namespace -->

- **Always use the `RadioField` namespace via `<RadioField.Root>`, never bare `<RadioField>` directly** — calling `<RadioField>` directly causes "cannot be used as a JSX component" errors.
  - anti-pattern: `<RadioField value="red">Red</RadioField>`
  - fix: `<RadioField.Root value="red">...</RadioField.Root>`
  - complete example:

    ```tsx
    import { RadioGroup } from '@tale-ui/react/radio-group';
    import { RadioField } from '@tale-ui/react/radio-field';

    export function Example() {
      return (
        <RadioGroup label="Favorite color">
          <RadioField.Root value="red">
            <RadioField.Button>
              <RadioField.Indicator>
                <RadioField.Dot />
              </RadioField.Indicator>
              Red
            </RadioField.Button>
          </RadioField.Root>
        </RadioGroup>
      );
    }
    ```

<!-- pitfall: radio-field-label-inside-button -->

- **The label text goes inside `RadioField.Button`, not directly in `RadioField.Root`** — `Root` is a `<div>` layout wrapper; only `Button` (a `<label>`) associates text with the input for clicks and screen readers.
  - anti-pattern: `<RadioField.Root value="red">Red</RadioField.Root>`
  - fix: `<RadioField.Root value="red"><RadioField.Button>Red</RadioField.Button></RadioField.Root>`

<!-- pitfall: radio-field-needs-radio-group -->

- **RadioField options need a `RadioGroup` wrapper** — a radio outside a group has no selection state and throws at runtime. Import `RadioGroup` from `@tale-ui/react/radio-group`.
  - anti-pattern: `<RadioField.Root value="red">...</RadioField.Root>`
  - fix: `<RadioGroup label="Favorite color"><RadioField.Root value="red">...</RadioField.Root></RadioGroup>`

<!-- pitfall: radio-field-dot-not-auto -->

- **`RadioField.Indicator` needs a `<RadioField.Dot />` child — it does not render the selected dot automatically** — both parts are required children of `Button`.
  - anti-pattern: `<RadioField.Indicator />`
  - fix: `<RadioField.Indicator><RadioField.Dot /></RadioField.Indicator>`

<!-- cross-pitfall-ref: no-visual-exports-for-interactive-ui -->

## Notes

- You must provide `<RadioField.Dot />` inside `RadioField.Indicator` — the dot is not rendered automatically.
- Selection state is controlled on the group: use `defaultValue` for uncontrolled or `value`/`onChange` for controlled state on `RadioGroup`.
- `RadioField.Error` renders only when the group is invalid (`isInvalid` or failed `validate` on `RadioGroup`) — validation for radios is group-level, not per-option.
- Prefer `RadioField` over the deprecated `Radio` for new code; `Radio` remains available for backwards compatibility.
- Every `RadioField.Root` requires a `value` prop identifying the option within the group.
- **Size guidance:** The default `md` size is almost always the right choice. The `sm` variant is intended for edge-cases only (e.g. dense data tables or compact toolbars) and should be seldom used — it reduces the touch target and can hurt readability.
