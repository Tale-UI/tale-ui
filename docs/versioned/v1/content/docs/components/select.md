# Select

`import { Select } from '@tale-ui/react/select';`

A compound dropdown select component with popover listbox, built on React Aria's Select.

## Parts

| Part                   | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `Select.Root`          | Top-level select wrapper                                          |
| `Select.Label`         | Accessible label for the select                                   |
| `Select.Trigger`       | The button that opens the dropdown                                |
| `Select.Value`         | Displays the selected value (or placeholder)                      |
| `Select.Icon`          | Decorative dropdown arrow icon                                    |
| `Select.Popover`       | The floating popover container. Accepts `placement` and `offset`. |
| `Select.ListBox`       | The scrollable list of options                                    |
| `Select.Item`          | An individual option                                              |
| `Select.Section`       | A group of related items                                          |
| `Select.Header`        | A header label for a section                                      |
| `Select.ItemText`      | Text label inside an item (for custom item layouts)               |
| `Select.ItemIndicator` | Selection indicator inside an item (e.g. checkmark)               |
| `Select.Separator`     | A visual divider between items or sections                        |

## Props

### Select.Root

| Prop                  | Type                   | Default | Description                                                                                                                               |
| --------------------- | ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `size`                | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the trigger button, propagated via context                                                                                        |
| `shouldCloseOnSelect` | `boolean`              | `true`  | Whether the popover closes after selecting an item. Set `false` to keep it open (new in React Aria 1.17/1.18; inherited from React Aria). |

Accepts all React Aria `Select` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Select.Root placeholder="Select a fruit...">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">
        Apple
      </Select.Item>
      <Select.Item id="banana" textValue="Banana">
        Banana
      </Select.Item>
      <Select.Item id="cherry" textValue="Cherry">
        Cherry
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

## Examples

### With Label

```tsx
<Select.Root placeholder="Choose one...">
  <Select.Label>Favorite fruit</Select.Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">
        Apple
      </Select.Item>
      <Select.Item id="banana" textValue="Banana">
        Banana
      </Select.Item>
      <Select.Item id="cherry" textValue="Cherry">
        Cherry
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### With Sections

```tsx
<Select.Root placeholder="Select a food...">
  <Select.Label>Food</Select.Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Section>
        <Select.Header>Fruits</Select.Header>
        <Select.Item id="apple" textValue="Apple">
          Apple
        </Select.Item>
        <Select.Item id="banana" textValue="Banana">
          Banana
        </Select.Item>
      </Select.Section>
      <Select.Section>
        <Select.Header>Vegetables</Select.Header>
        <Select.Item id="carrot" textValue="Carrot">
          Carrot
        </Select.Item>
        <Select.Item id="broccoli" textValue="Broccoli">
          Broccoli
        </Select.Item>
      </Select.Section>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### With Disabled Items

```tsx
<Select.Root placeholder="Select...">
  <Select.Label>Available options</Select.Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">
        Apple
      </Select.Item>
      <Select.Item id="banana" textValue="Banana" isDisabled>
        Banana (sold out)
      </Select.Item>
      <Select.Item id="cherry" textValue="Cherry">
        Cherry
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### Sizes

```tsx
<Select.Root size="sm" placeholder="Small select">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
      <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>

<Select.Root size="md" placeholder="Medium select (default)">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
      <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>

<Select.Root size="lg" placeholder="Large select">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
      <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### Disabled

```tsx
<Select.Root isDisabled placeholder="Cannot select...">
  <Select.Label>Disabled select</Select.Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">
        Apple
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### Long Selected Values

The closed trigger keeps a fixed height. Long selected values are truncated with an ellipsis instead of wrapping and resizing the field.

```tsx
<Select.Root defaultSelectedKey="enterprise" placeholder="Select a plan...">
  <Select.Label>Plan</Select.Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="basic" textValue="Basic">Basic</Select.Item>
      <Select.Item id="enterprise" textValue="Enterprise compliance plan with dedicated support">
        Enterprise compliance plan with dedicated support
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

## CSS Classes

- `.tale-select` -- Base (root)
- `.tale-select__trigger` -- Trigger button
- `.tale-select__trigger--sm` -- Small trigger variant
- `.tale-select__trigger--lg` -- Large trigger variant
- `.tale-select__value` -- Selected value display
- `.tale-select__icon` -- Dropdown arrow icon
- `.tale-select__popover` -- Floating popover
- `.tale-select__listbox` -- List of options
- `.tale-select__item` -- Individual option
- `.tale-select__header` -- Section header
- `.tale-select__label` -- Label element
- `.tale-select__item-text` -- Text label inside an item
- `.tale-select__item-indicator` -- Selection indicator inside an item
- `.tale-select__separator` -- Divider

## Pitfalls

<!-- pitfall: select-placeholder-on-root -->

- **`Select.Root` owns the `placeholder` prop** — do NOT put `placeholder` on `Select.Value`.
  - anti-pattern: `<Select.Value placeholder="Pick one..." />`
  - fix: `<Select.Root placeholder="Pick one..."><Select.Trigger><Select.Value /><Select.Icon /></Select.Trigger>...</Select.Root>`
  - complete example:

    ```tsx
    import { Select } from '@tale-ui/react/select';

    export function Example() {
      return (
        <Select.Root placeholder="Select...">
          <Select.Label>Fruit</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id="apple">Apple</Select.Item>
              <Select.Item id="banana">Banana</Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      );
    }
    ```

<!-- cross-pitfall-ref: selectedkey-not-value -->

<!-- pitfall: select-no-option-sub-part -->
<!-- multi-idea-ok -->

- **No Select.Option — use Select.Item** — `Select.Trigger` also requires `<Select.Icon />` placed after `<Select.Value />`.
  - anti-pattern: `<Select.Option id="a">A</Select.Option>`
  - fix: `<Select.Item id="a" textValue="A">A</Select.Item>`
<!-- pitfall: use-selectsection-with-selectheader-for -->
- **Use Select.Section with Select.Header for grouped options** — to render a categorized selector with labelled groups, place `Select.Section` elements (each with a `Select.Header` child and `Select.Item` children) directly inside `Select.ListBox`. There is no `Select.Group` or `Select.Category` sub-part.
  - anti-pattern: `<Select.ListBox><Select.Group label="Fruits"><Select.Item id="apple">Apple</Select.Item></Select.Group></Select.ListBox>`
  - fix: `<Select.ListBox><Select.Section id="fruits"><Select.Header>Fruits</Select.Header><Select.Item id="apple" textValue="Apple">Apple</Select.Item></Select.Section></Select.ListBox>`
<!-- pitfall: use-select-with-selectsection-for -->
- **Use Select with Select.Section for any prompt that asks for a categorized or grouped selector** — when the request is to show a selector with labelled groups of options, render `Select.Root` with `Select.Section` and `Select.Header` inside `Select.ListBox` instead of leaving the file empty.
  - anti-pattern: `// empty file`
  - fix: `import { Select } from '@tale-ui/react/select'; export function FoodCategorySelector() { return <Select.Root placeholder="Select a food..."><Select.Label>Food</Select.Label><Select.Trigger><Select.Value /><Select.Icon /></Select.Trigger><Select.Popover><Select.ListBox><Select.Section id="fruits"><Select.Header>Fruits</Select.Header><Select.Item id="apple" textValue="Apple">Apple</Select.Item><Select.Item id="banana" textValue="Banana">Banana</Select.Item></Select.Section><Select.Section id="vegetables"><Select.Header>Vegetables</Select.Header><Select.Item id="carrot" textValue="Carrot">Carrot</Select.Item><Select.Item id="broccoli" textValue="Broccoli">Broccoli</Select.Item></Select.Section></Select.ListBox></Select.Popover></Select.Root>; }`

## Notes

- Each `Select.Item` should have an `id` and a `textValue` prop. `textValue` is inferred from text children but should be explicit for complex item content (icons, badges, etc.).
- `isDisabled` on `Select.Root` disables the entire select. Use `isDisabled` on individual `Select.Item` elements to disable specific options.
- The `placeholder` prop belongs on `Select.Root`, not `Select.Value`. It is shown when no item is selected.
