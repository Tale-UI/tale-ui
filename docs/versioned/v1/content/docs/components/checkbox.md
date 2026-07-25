# Checkbox

`import { Checkbox } from '@tale-ui/react/checkbox';`

A compound checkbox component with a visual indicator, built on React Aria's Checkbox.

> **Deprecated:** prefer [CheckboxField](checkbox-field.md) for new code. The underlying React Aria `Checkbox` is deprecated upstream (React Aria Components 1.18) in favour of `CheckboxField` + `CheckboxButton`. `Checkbox` remains fully functional and supported for backwards compatibility.

## Migration

Use `CheckboxField` instead — it adds built-in description and error message support:

```tsx
// Before
import { Checkbox } from '@tale-ui/react/checkbox';

<Checkbox.Root>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Accept terms and conditions
</Checkbox.Root>;

// After
import { CheckboxField } from '@tale-ui/react/checkbox-field';

<CheckboxField.Root>
  <CheckboxField.Button>
    <CheckboxField.Indicator>
      <Icon icon={Check} size="sm" />
    </CheckboxField.Indicator>
    Accept terms and conditions
  </CheckboxField.Button>
</CheckboxField.Root>;
```

The label text and `Indicator` move inside `CheckboxField.Button` (the clickable `<label>`); `CheckboxField.Root` is a `<div>` wrapper that also lays out the optional `Description` and `Error` parts. All state props (`isSelected`, `defaultSelected`, `onChange`, `isDisabled`, `isIndeterminate`, `value`, ...) are unchanged.

## Parts

| Part                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| `Checkbox.Root`      | The checkbox label and input wrapper              |
| `Checkbox.Indicator` | The visual box that contains the check/minus icon |

> **Important:** `Checkbox.Indicator` is a plain `<span>` — it does NOT include a built-in checkmark icon. You must provide a child icon using `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` and `lucide-react`.

## Props

Accepts all React Aria `Checkbox` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### Checkbox.Root

| Prop   | Type                   | Default | Description                    |
| ------ | ---------------------- | ------- | ------------------------------ |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the checkbox indicator |

### Visual

| Prop      | Type                   | Default | Description                                 |
| --------- | ---------------------- | ------- | ------------------------------------------- |
| `checked` | `boolean`              | `false` | Whether the checkbox visual appears checked |
| `size`    | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the checkbox indicator              |

`Checkbox.Visual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
import { Checkbox } from '@tale-ui/react/checkbox';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

<Checkbox.Root>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Accept terms and conditions
</Checkbox.Root>;
```

## Examples

### Checked by Default

```tsx
<Checkbox.Root defaultSelected>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Checked by default
</Checkbox.Root>
```

### Disabled

```tsx
<Checkbox.Root isDisabled>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Disabled checkbox
</Checkbox.Root>
```

### Indeterminate

```tsx
import { Minus } from 'lucide-react';

<Checkbox.Root isIndeterminate>
  <Checkbox.Indicator>
    <Icon icon={Minus} size="sm" />
  </Checkbox.Indicator>
  Indeterminate state
</Checkbox.Root>;
```

### Sizes

```tsx
<Checkbox.Root size="sm">
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Small
</Checkbox.Root>

<Checkbox.Root size="md">
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Medium (default)
</Checkbox.Root>

<Checkbox.Root size="lg">
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Large
</Checkbox.Root>
```

### All States

```tsx
import { Check, Minus } from 'lucide-react';

<Checkbox.Root>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Unchecked
</Checkbox.Root>

<Checkbox.Root defaultSelected>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Checked
</Checkbox.Root>

<Checkbox.Root isIndeterminate>
  <Checkbox.Indicator><Icon icon={Minus} size="sm" /></Checkbox.Indicator>
  Indeterminate
</Checkbox.Root>

<Checkbox.Root isDisabled>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Disabled
</Checkbox.Root>

<Checkbox.Root isDisabled defaultSelected>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Disabled + Checked
</Checkbox.Root>
```

## CSS Classes

- `.tale-checkbox` -- Base (root label)
- `.tale-checkbox--sm` -- Small size (0.875rem indicator)
- `.tale-checkbox--lg` -- Large size (1.375rem indicator)
- `.tale-checkbox__indicator` -- The visual indicator box

## Pitfalls

<!-- pitfall: checkbox-always-use-namespace -->

- **Always use the `Checkbox` namespace via `<Checkbox.Root>`, never bare `<Checkbox>` directly** — calling `<Checkbox>` directly causes "cannot be used as a JSX component" errors.
  - anti-pattern: `<Checkbox>Label</Checkbox>`
  - fix: `<Checkbox.Root value="option">Label</Checkbox.Root>`
  - complete example:

    ```tsx
    import { Checkbox } from '@tale-ui/react/checkbox';
    import { Icon } from '@tale-ui/react/icon';
    import { Check } from 'lucide-react';

    export function Example() {
      return (
        <Checkbox.Root>
          <Checkbox.Indicator>
            <Icon icon={Check} size="sm" />
          </Checkbox.Indicator>
          Accept terms and conditions
        </Checkbox.Root>
      );
    }
    ```

<!-- pitfall: checkbox-value-not-id -->

- **Each checkbox item uses `value` prop (not `id`) matching the parent CheckboxGroup's `value` array.**
  - anti-pattern: `<Checkbox.Root id="apple">Apple</Checkbox.Root>`
  - fix: `<Checkbox.Root value="apple">Apple</Checkbox.Root>`

<!-- pitfall: checkbox-indicator-needs-icon -->

- **`Checkbox.Indicator` needs an `<Icon>` child — it does not render a checkmark automatically** — provide `<Icon icon={Check} size="sm" />` as a child.
  - anti-pattern: `<Checkbox.Indicator />`
  - fix: `<Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>`

<!-- cross-pitfall-ref: no-visual-exports-for-interactive-ui -->

## Notes

- You must provide your own icon inside `Checkbox.Indicator` — use `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` with `lucide-react`.
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `isIndeterminate` renders a third visual state (typically a minus icon instead of a checkmark).
- When used inside a `CheckboxGroup`, add a `value` prop to each `Checkbox.Root`.
- Supports `data-readonly` and `data-required` attributes for corresponding states.
- **Size guidance:** The default `md` size is almost always the right choice. The `sm` variant is intended for edge-cases only (e.g. dense data tables or compact toolbars) and should be seldom used — it reduces the touch target and can hurt readability.
