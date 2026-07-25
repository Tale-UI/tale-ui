# Radio

`import { Radio } from '@tale-ui/react/radio';`

A compound radio button component with group support, built on React Aria's Radio and RadioGroup.

> **Deprecated:** prefer [RadioField](radio-field.md) for new code. The underlying React Aria `Radio` is deprecated upstream (React Aria Components 1.18) in favour of `RadioField` + `RadioButton`. `Radio` remains fully functional and supported for backwards compatibility.

## Migration

Use `RadioField` instead — it adds built-in description and error message support. The group wrapper is unchanged:

```tsx
// Before
import { Radio } from '@tale-ui/react/radio';

<Radio.Group label="Favorite color">
  <Radio.Root value="red">
    <Radio.Indicator>
      <Radio.Dot />
    </Radio.Indicator>{' '}
    Red
  </Radio.Root>
</Radio.Group>;

// After
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
</RadioGroup>;
```

The label text and `Indicator` move inside `RadioField.Button` (the clickable `<label>`); `RadioField.Root` is a `<div>` wrapper that also lays out the optional `Description` and `Error` parts. The `value` prop stays on `Root`.

## Parts

| Part              | Description                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Radio.Group`     | Groups radio buttons with a label and manages selection                                                                                                |
| `Radio.Root`      | An individual radio option                                                                                                                             |
| `Radio.Indicator` | The visual circle indicator                                                                                                                            |
| `Radio.Dot`       | Standalone inner dot for custom compositions only. **Do not nest inside `Radio.Indicator`** — Indicator already renders its own dot via CSS `::after`. |

## Props

### Root

| Prop   | Type                   | Default | Description  |
| ------ | ---------------------- | ------- | ------------ |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size variant |

Also accepts all React Aria `Radio` props.

### Group

| Prop          | Type     | Default | Description                             |
| ------------- | -------- | ------- | --------------------------------------- |
| `label`       | `string` | —       | An accessible label for the radio group |
| `description` | `string` | —       | A description displayed below the group |

Also accepts all React Aria `RadioGroup` props.

### Visual

| Prop      | Type      | Default | Description                               |
| --------- | --------- | ------- | ----------------------------------------- |
| `checked` | `boolean` | `false` | Whether the radio visual appears selected |

`Radio.Visual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
<Radio.Group label="Favorite color">
  <Radio.Root value="red">
    <Radio.Indicator />
    Red
  </Radio.Root>
  <Radio.Root value="green">
    <Radio.Indicator />
    Green
  </Radio.Root>
  <Radio.Root value="blue">
    <Radio.Indicator />
    Blue
  </Radio.Root>
</Radio.Group>
```

## Examples

### Disabled

```tsx
<Radio.Group label="Disabled group" isDisabled>
  <Radio.Root value="red">
    <Radio.Indicator />
    Red
  </Radio.Root>
  <Radio.Root value="green">
    <Radio.Indicator />
    Green
  </Radio.Root>
</Radio.Group>
```

### Horizontal

```tsx
<Radio.Group label="Plan" orientation="horizontal">
  <Radio.Root value="free">
    <Radio.Indicator />
    Free
  </Radio.Root>
  <Radio.Root value="pro">
    <Radio.Indicator />
    Pro
  </Radio.Root>
  <Radio.Root value="enterprise">
    <Radio.Indicator />
    Enterprise
  </Radio.Root>
</Radio.Group>
```

### All Sizes

```tsx
<Radio.Group label="Small radios">
  <Radio.Root value="a" size="sm">
    <Radio.Indicator />
    Small option A
  </Radio.Root>
</Radio.Group>

<Radio.Group label="Medium radios">
  <Radio.Root value="a" size="md">
    <Radio.Indicator />
    Medium option A
  </Radio.Root>
</Radio.Group>

<Radio.Group label="Large radios">
  <Radio.Root value="a" size="lg">
    <Radio.Indicator />
    Large option A
  </Radio.Root>
</Radio.Group>
```

## CSS Classes

- `.tale-radio` -- Base radio option
- `.tale-radio--sm` -- Small size modifier
- `.tale-radio--lg` -- Large size modifier
- `.tale-radio__indicator` -- The visual circle indicator
- `.tale-radio__dot` -- Inner dot inside the indicator
- `.tale-radio-group` -- The group wrapper

## Pitfalls

<!-- pitfall: radio-separate-imports -->
<!-- multi-idea-ok -->

- **`Radio` and `RadioGroup` are separate components with separate imports** — `RadioGroup` from `@tale-ui/react/radio-group` has NO sub-parts (no `.Radios`, `.Item`, `.Indicator`). `Radio.Group` is the primary grouping sub-part of the `Radio` namespace.
  - anti-pattern: `<RadioGroup><RadioGroup.Item value="a">Option</RadioGroup.Item></RadioGroup>`
  - fix: `<Radio.Group label="Choose"><Radio.Root value="a"><Radio.Indicator /><Radio.Label>Option</Radio.Label></Radio.Root></Radio.Group>`
  - complete example:

    ```tsx
    import { Radio } from '@tale-ui/react/radio';

    export function Example() {
      return (
        <Radio.Group label="Favorite color">
          <Radio.Root value="red">
            <Radio.Indicator /> Red
          </Radio.Root>
          <Radio.Root value="green">
            <Radio.Indicator /> Green
          </Radio.Root>
          <Radio.Root value="blue">
            <Radio.Indicator /> Blue
          </Radio.Root>
        </Radio.Group>
      );
    }
    ```

<!-- pitfall: radio-no-native-input-props -->

- **Radio.Root does NOT accept checked, onChange, or native HTML input props** — selection state is managed by `Radio.Group` via `value`/`onChange` props. Passing `checked` causes TypeScript errors.
  - anti-pattern: `<Radio.Root value="a" checked={isSelected} onChange={setSelected} />`
  - fix: `<Radio.Group value={selected} onChange={setSelected}><Radio.Root value="a">...</Radio.Root></Radio.Group>`
<!-- pitfall: for-any-radio-group-prompt -->
- **For any radio group prompt, wrap Radio items in RadioGroup from @tale-ui/react/radio-group — do not use only Radio.Group** — For any radio group prompt, both Radio (from @tale-ui/react/radio) and RadioGroup (from @tale-ui/react/radio-group) must appear in the code. Radio.Group is a sub-part of the Radio namespace and is NOT a substitute for RadioGroup; using only Radio.Group omits the required RadioGroup component and will be flagged as a missing-component error. Always import RadioGroup separately and use it as the outer wrapper in place of Radio.Group. When radio items contain rich content with nested Column and Text, use spacing-token gap values (xs, s, m, l) on every Column — never component-size names (sm, md, lg) — and use Text variant='label' instead of the invalid weight='medium' prop for label-weight option names.
  - anti-pattern: `import { Radio } from '@tale-ui/react/radio'; ... <Radio.Group label="Plan"><Radio.Root value="free"><Radio.Indicator />Free</Radio.Root></Radio.Group>`
  - anti-pattern: `<Column gap="sm">`
  - anti-pattern: `<Text weight="medium">Free</Text>`
  - fix: `import { RadioGroup } from '@tale-ui/react/radio-group'; import { Radio } from '@tale-ui/react/radio'; ... <RadioGroup label="Plan"><Radio.Root value="free"><Radio.Indicator />Free</Radio.Root></RadioGroup>`
  - fix: `<Column gap="s"> or <Column gap="xs">`
  - fix: `<Text variant="label">Free</Text>`
  - complete example:

    ```tsx
    import { RadioGroup } from '@tale-ui/react/radio-group';
    import { Radio } from '@tale-ui/react/radio';
    import { Column } from '@tale-ui/react/column';
    import { Text } from '@tale-ui/react/text';

    export function PlanSelector() {
      return (
        <Column gap="s">
          <RadioGroup label="Select a plan">
            <Radio.Root value="free">
              <Radio.Indicator />
              <Column gap="xs">
                <Text variant="label">Free</Text>
                <Text size="s" color="muted">
                  Get started at no cost
                </Text>
              </Column>
            </Radio.Root>
            <Radio.Root value="pro">
              <Radio.Indicator />
              <Column gap="xs">
                <Text variant="label">Pro</Text>
                <Text size="s" color="muted">
                  For individuals and small teams
                </Text>
              </Column>
            </Radio.Root>
            <Radio.Root value="enterprise">
              <Radio.Indicator />
              <Column gap="xs">
                <Text variant="label">Enterprise</Text>
                <Text size="s" color="muted">
                  Advanced features for large organizations
                </Text>
              </Column>
            </Radio.Root>
          </RadioGroup>
        </Column>
      );
    }
    ```

## Notes

- `size` defaults to `"md"`. The `--md` modifier class is omitted from the DOM.
- The `label` prop on `Radio.Group` sets the accessible group label.
- Use `orientation="horizontal"` on `Radio.Group` for inline layout.
- `isDisabled` on the group disables all child radios.
- Supports `data-readonly` and `data-required` attributes for corresponding states.
- **Standalone import:** `Radio.Group` is also available as `import { RadioGroup } from '@tale-ui/react/radio-group';`. This is functionally identical to `Radio.Group`.
- **Size guidance:** The default `md` size is almost always the right choice. The `sm` variant is intended for edge-cases only (e.g. dense data tables or compact toolbars) and should be seldom used — it reduces the touch target and can hurt readability.
