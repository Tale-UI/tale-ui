# Combobox

`import { Combobox } from '@tale-ui/react/combobox';`

A compound combobox (autocomplete select) with a text input, trigger button, and popover listbox, built on React Aria's ComboBox.

## Parts

| Part                     | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `Combobox.Root`          | Top-level combobox wrapper                                               |
| `Combobox.Label`         | Accessible label                                                         |
| `Combobox.InputGroup`    | Groups the input and trigger button together                             |
| `Combobox.Input`         | The text input for filtering                                             |
| `Combobox.Trigger`       | Button to open/close the dropdown                                        |
| `Combobox.Popover`       | Floating popover container. Accepts `placement` and `offset`.            |
| `Combobox.ListBox`       | Scrollable list of options                                               |
| `Combobox.Item`          | An individual option                                                     |
| `Combobox.Section`       | A group of related items                                                 |
| `Combobox.Header`        | Section header label                                                     |
| `Combobox.Empty`         | Shown when no items match the filter                                     |
| `Combobox.Chips`         | Container for multi-select chip tags                                     |
| `Combobox.Chip`          | A single chip tag                                                        |
| `Combobox.ChipRemove`    | Remove button inside a chip (renders a default × icon; use self-closing) |
| `Combobox.ItemIndicator` | Selection indicator inside an item                                       |
| `Combobox.Separator`     | Visual divider                                                           |

## Props

Accepts all React Aria `ComboBox` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Combobox.Root>
  <Combobox.InputGroup>
    <Combobox.Input />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Popover>
    <Combobox.ListBox>
      <Combobox.Item id="apple" textValue="Apple">
        Apple
      </Combobox.Item>
      <Combobox.Item id="banana" textValue="Banana">
        Banana
      </Combobox.Item>
      <Combobox.Item id="cherry" textValue="Cherry">
        Cherry
      </Combobox.Item>
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>
```

## Examples

### With Label

```tsx
<Combobox.Root>
  <Combobox.Label>Favorite fruit</Combobox.Label>
  <Combobox.InputGroup>
    <Combobox.Input />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Popover>
    <Combobox.ListBox>
      <Combobox.Item id="apple" textValue="Apple">
        Apple
      </Combobox.Item>
      <Combobox.Item id="banana" textValue="Banana">
        Banana
      </Combobox.Item>
      <Combobox.Item id="cherry" textValue="Cherry">
        Cherry
      </Combobox.Item>
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>
```

### With Placeholder

```tsx
<Combobox.Root>
  <Combobox.Label>Search countries</Combobox.Label>
  <Combobox.InputGroup>
    <Combobox.Input placeholder="Type to search..." />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Popover>
    <Combobox.ListBox>
      <Combobox.Item id="us" textValue="United States">
        United States
      </Combobox.Item>
      <Combobox.Item id="ca" textValue="Canada">
        Canada
      </Combobox.Item>
      <Combobox.Item id="mx" textValue="Mexico">
        Mexico
      </Combobox.Item>
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>
```

### With Sections

```tsx
<Combobox.Root>
  <Combobox.Label>Food</Combobox.Label>
  <Combobox.InputGroup>
    <Combobox.Input placeholder="Search food..." />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Popover>
    <Combobox.ListBox>
      <Combobox.Section>
        <Combobox.Header>Fruits</Combobox.Header>
        <Combobox.Item id="apple" textValue="Apple">
          Apple
        </Combobox.Item>
        <Combobox.Item id="banana" textValue="Banana">
          Banana
        </Combobox.Item>
      </Combobox.Section>
      <Combobox.Section>
        <Combobox.Header>Vegetables</Combobox.Header>
        <Combobox.Item id="carrot" textValue="Carrot">
          Carrot
        </Combobox.Item>
        <Combobox.Item id="broccoli" textValue="Broccoli">
          Broccoli
        </Combobox.Item>
      </Combobox.Section>
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>
```

### Empty State

```tsx
<Combobox.Root>
  <Combobox.Label>Search</Combobox.Label>
  <Combobox.InputGroup>
    <Combobox.Input placeholder="Type to filter..." />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Popover>
    <Combobox.ListBox>
      <Combobox.Empty>No results found.</Combobox.Empty>
      <Combobox.Item id="apple" textValue="Apple">
        Apple
      </Combobox.Item>
      <Combobox.Item id="banana" textValue="Banana">
        Banana
      </Combobox.Item>
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>
```

### Multi-select with Chips

```tsx
<Combobox.Root selectionMode="multiple">
  <Combobox.Label>Frameworks</Combobox.Label>
  <Combobox.Chips>
    <Combobox.Chip>
      React <Combobox.ChipRemove aria-label="Remove React" />
    </Combobox.Chip>
    <Combobox.Chip>
      Vue <Combobox.ChipRemove aria-label="Remove Vue" />
    </Combobox.Chip>
  </Combobox.Chips>
  <Combobox.InputGroup>
    <Combobox.Input placeholder="Add framework..." />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Popover>
    <Combobox.ListBox>
      <Combobox.Item id="react" textValue="React">
        React
      </Combobox.Item>
      <Combobox.Item id="vue" textValue="Vue">
        Vue
      </Combobox.Item>
      <Combobox.Item id="angular" textValue="Angular">
        Angular
      </Combobox.Item>
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>
```

## CSS Classes

- `.tale-combobox` -- Base (root)
- `.tale-combobox__label` -- Label
- `.tale-combobox__input-group` -- Input + trigger wrapper
- `.tale-combobox__input` -- Text input
- `.tale-combobox__trigger` -- Dropdown trigger button
- `.tale-combobox__popover` -- Floating popover
- `.tale-combobox__listbox` -- List of options
- `.tale-combobox__item` -- Individual option
- `.tale-combobox__header` -- Section header
- `.tale-combobox__empty` -- Empty state message
- `.tale-combobox__item-indicator` -- Selection indicator inside an item
- `.tale-combobox__chips` -- Multi-select chips container
- `.tale-combobox__chip` -- Individual chip
- `.tale-combobox__chip-remove` -- Chip remove button
- `.tale-combobox__separator` -- Divider

## Pitfalls

<!-- pitfall: combobox-placeholder-on-input -->

- **`Combobox.Input` owns `placeholder`** — do NOT put it on `Combobox.Root`.
  - anti-pattern: `<Combobox.Root placeholder="Type to search...">`
  - fix: `<Combobox.Input placeholder="Type to search..." />`
  - complete example:

    ```tsx
    import { Combobox } from '@tale-ui/react/combobox';

    export function Example() {
      return (
        <Combobox.Root>
          <Combobox.Label>Country</Combobox.Label>
          <Combobox.InputGroup>
            <Combobox.Input placeholder="Search..." />
            <Combobox.Trigger />
          </Combobox.InputGroup>
          <Combobox.Popover>
            <Combobox.ListBox>
              <Combobox.Item id="us" textValue="United States">
                United States
              </Combobox.Item>
              <Combobox.Item id="uk" textValue="United Kingdom">
                United Kingdom
              </Combobox.Item>
            </Combobox.ListBox>
          </Combobox.Popover>
        </Combobox.Root>
      );
    }
    ```

<!-- pitfall: combobox-no-icon-prop-on-input -->

- **`Combobox.Input` does NOT accept an `icon` prop** — place `<Icon>` inside `Combobox.InputGroup`.
  - anti-pattern: `<Combobox.Input icon={Search} />`
  - fix: `<Combobox.InputGroup><Icon icon={Search} size="sm" /><Combobox.Input /><Combobox.Trigger /></Combobox.InputGroup>`

<!-- cross-pitfall-ref: selectedkey-not-value -->

<!-- pitfall: combobox-no-phantom-imports -->
<!-- prose-only -->

- **Never import list data from non-existent local modules** — define item arrays inline or import from real project data sources.
<!-- pitfall: combobox-derive-selectedkey-type-from-props -->
- **Never annotate selectedKey state as React.Key | null — derive the key type from Combobox.Root's onSelectionChange prop** — React.Key is not the same as the Key type used internally by Combobox.Root. Annotating useState with React.Key | null causes 'Type Key | null is not assignable to type Key | null | undefined' TypeScript errors because the component's selectedKey prop type is incompatible with React.Key. Derive the correct type from the component's own onSelectionChange prop using React.ComponentProps, exactly as you would for TagSelect or GridList controlled selection.
  - anti-pattern: `const [selectedKey, setSelectedKey] = React.useState<React.Key | null>(null);`
  - fix: `type SelectedKey = Parameters<NonNullable<React.ComponentProps<typeof Combobox.Root>['onSelectionChange']>>[0]; const [selectedKey, setSelectedKey] = React.useState<SelectedKey>(null);`
  - complete example:

    ```tsx
    import * as React from 'react';
    import { Combobox } from '@tale-ui/react/combobox';

    const countries = [
      { id: 'au', name: 'Australia' },
      { id: 'ca', name: 'Canada' },
      { id: 'gb', name: 'United Kingdom' },
      { id: 'us', name: 'United States' },
    ];

    type SelectedKey = Parameters<
      NonNullable<React.ComponentProps<typeof Combobox.Root>['onSelectionChange']>
    >[0];

    export function CountryCombobox() {
      const [selectedKey, setSelectedKey] = React.useState<SelectedKey>(null);

      return (
        <Combobox.Root selectedKey={selectedKey} onSelectionChange={setSelectedKey}>
          <Combobox.Label>Country</Combobox.Label>
          <Combobox.InputGroup>
            <Combobox.Input placeholder="Search countries..." />
            <Combobox.Trigger />
          </Combobox.InputGroup>
          <Combobox.Popover>
            <Combobox.ListBox>
              {countries.map((country) => (
                <Combobox.Item key={country.id} id={country.id} textValue={country.name}>
                  {country.name}
                </Combobox.Item>
              ))}
            </Combobox.ListBox>
          </Combobox.Popover>
        </Combobox.Root>
      );
    }
    ```

## Notes

- Each `Combobox.Item` should have both an `id` and a `textValue` prop for accessibility and filtering.
- `Combobox.InputGroup` wraps both the input and trigger to form a single visual control.
- `Combobox.Trigger` renders a chevron by default. Pass children only if you need a custom trigger icon.
- `Combobox.Empty` is displayed when filtering yields no matches.
- For multi-select, use `selectionMode="multiple"` on `Combobox.Root` with `Combobox.Chips`, `Combobox.Chip`, and `Combobox.ChipRemove` to display selected values as tags.
- Use `inputValue` and `onInputChange` on `Combobox.Root` for controlled text input.
- When `defaultFilter` is omitted, React Aria uses its locale-aware `contains`
  filter. Supply `defaultFilter` only when a different matching strategy is
  required.
