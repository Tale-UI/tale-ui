# RadioGroup

`import { RadioGroup } from '@tale-ui/react/radio-group';`

A group wrapper for mutually exclusive options. It is equivalent to `Radio.Group` for compatibility, but new code should render `RadioField.Root` children.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | — | Propagates size to child `RadioField.Root` components |

Also accepts all React Aria `RadioGroup` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { RadioGroup } from '@tale-ui/react/radio-group';
import { RadioField } from '@tale-ui/react/radio-field';

<RadioGroup label="Favorite color">
  <RadioField.Root value="red">
    <RadioField.Button>
      <RadioField.Indicator><RadioField.Dot /></RadioField.Indicator>
      Red
    </RadioField.Button>
  </RadioField.Root>
  <RadioField.Root value="blue">
    <RadioField.Button>
      <RadioField.Indicator><RadioField.Dot /></RadioField.Indicator>
      Blue
    </RadioField.Button>
  </RadioField.Root>
</RadioGroup>
```

## Pitfalls

<!-- pitfall: radio-group-no-sub-parts -->
- **`RadioGroup` (from `@tale-ui/react/radio-group`) has NO sub-parts** — using `<RadioGroup.Radios>`, `<RadioGroup.Item>`, or `<RadioGroup.Indicator>` causes 'Property does not exist' TypeScript errors. For grouping radios, render `RadioField.Root` children inside `RadioGroup`.
  - anti-pattern: `<RadioGroup.Item value="a">...</RadioGroup.Item>`
  - fix: `<RadioGroup label="..."><RadioField.Root value="a"><RadioField.Button>Option</RadioField.Button></RadioField.Root></RadioGroup>`
  - complete example:
    ```tsx
    import { RadioGroup } from '@tale-ui/react/radio-group';
    import { RadioField } from '@tale-ui/react/radio-field';

    export function Example() {
      return (
        <RadioGroup label="Favorite color">
          <RadioField.Root value="red">
            <RadioField.Button>
              <RadioField.Indicator><RadioField.Dot /></RadioField.Indicator>
              Red
            </RadioField.Button>
          </RadioField.Root>
          <RadioField.Root value="blue">
            <RadioField.Button>
              <RadioField.Indicator><RadioField.Dot /></RadioField.Indicator>
              Blue
            </RadioField.Button>
          </RadioField.Root>
        </RadioGroup>
      );
    }
    ```

<!-- cross-pitfall-ref: no-cross-import-checkbox-group -->

## Notes

- This is the same group component as `Radio.Group`, but new code should use `RadioField.Root` children because `Radio` is deprecated upstream.
- Prefer `import { RadioGroup } from '@tale-ui/react/radio-group'` for the group and `import { RadioField } from '@tale-ui/react/radio-field'` for options.
