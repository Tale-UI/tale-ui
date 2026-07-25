# CheckboxGroup

`import { CheckboxGroup } from '@tale-ui/react/checkbox-group';`

Groups a set of checkboxes with form validation and accessibility support, built on React Aria's CheckboxGroup.

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | — | Accessible group label |
| `orientation` | `'horizontal' \| 'vertical'` | — | Layout orientation. Sets `data-orientation` for CSS styling |
| `isDisabled` | `boolean` | `false` | Disables all child checkboxes |
| `size` | `'sm' \| 'md' \| 'lg'` | — | Propagates size to all child CheckboxField.Root components |

## Basic Usage

```tsx
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { CheckboxField } from '@tale-ui/react/checkbox-field';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

<CheckboxGroup label="Favorite fruits">
  <CheckboxField.Root value="apple">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Apple
    </CheckboxField.Button>
  </CheckboxField.Root>
  <CheckboxField.Root value="banana">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Banana
    </CheckboxField.Button>
  </CheckboxField.Root>
  <CheckboxField.Root value="cherry">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Cherry
    </CheckboxField.Button>
  </CheckboxField.Root>
</CheckboxGroup>
```

## Examples

### Disabled

```tsx
<CheckboxGroup label="Disabled group" isDisabled>
  <CheckboxField.Root value="apple">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Apple
    </CheckboxField.Button>
  </CheckboxField.Root>
  <CheckboxField.Root value="banana">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Banana
    </CheckboxField.Button>
  </CheckboxField.Root>
</CheckboxGroup>
```

### With Description

```tsx
import { Field } from '@tale-ui/react/field';

<CheckboxGroup label="Notification preferences">
  <Field.Description>Select how you would like to be notified.</Field.Description>
  <CheckboxField.Root value="email">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Email
    </CheckboxField.Button>
  </CheckboxField.Root>
  <CheckboxField.Root value="sms">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      SMS
    </CheckboxField.Button>
  </CheckboxField.Root>
  <CheckboxField.Root value="push">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Push notification
    </CheckboxField.Button>
  </CheckboxField.Root>
</CheckboxGroup>
```

### Horizontal Layout

```tsx
<CheckboxGroup label="Pick toppings" orientation="horizontal">
  <CheckboxField.Root value="cheese">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Cheese
    </CheckboxField.Button>
  </CheckboxField.Root>
  <CheckboxField.Root value="pepperoni">
    <CheckboxField.Button>
      <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
      Pepperoni
    </CheckboxField.Button>
  </CheckboxField.Root>
</CheckboxGroup>
```

## CSS Classes

- `.tale-checkbox-group` -- Base wrapper

## Pitfalls

<!-- pitfall: checkbox-group-string-array-not-set -->
- **`CheckboxGroup` controlled-state uses `string[]` (plain array), NOT `Set<string>`.**
  - anti-pattern: `<CheckboxGroup value={new Set(['apple'])} onChange={(v) => setSelected(v)} />`
  - fix: `<CheckboxGroup value={['apple']} onChange={(v) => setSelected(v)} />`
  - complete example:
    ```tsx
    import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
    import { CheckboxField } from '@tale-ui/react/checkbox-field';
    import { Icon } from '@tale-ui/react/icon';
    import { Check } from 'lucide-react';

    export function Example() {
      return (
        <CheckboxGroup label="Favorite fruits">
          <CheckboxField.Root value="apple">
            <CheckboxField.Button>
              <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
              Apple
            </CheckboxField.Button>
          </CheckboxField.Root>
          <CheckboxField.Root value="banana">
            <CheckboxField.Button>
              <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
              Banana
            </CheckboxField.Button>
          </CheckboxField.Root>
        </CheckboxGroup>
      );
    }
    ```

<!-- cross-pitfall-ref: no-cross-import-checkbox-group -->

## Notes

- The `label` prop sets the accessible group label.
- `isDisabled` on the group disables all child checkboxes.
- Each `CheckboxField.Root` inside a group must have a `value` prop.
- Use `Field.Description` from `@tale-ui/react/field` to add helper text.
- The `orientation` prop sets `data-orientation` on the DOM element, enabling CSS-based horizontal/vertical layout.
