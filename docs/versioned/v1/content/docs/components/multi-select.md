# MultiSelect

A dropdown that supports selecting multiple items. Includes an inline search field for filtering items and an optional footer with Reset and Select All actions.

## Import

```tsx
import { MultiSelect } from '@tale-ui/react/multi-select';
```

## Parts

| Part                     | Element              | Description                                                                               |
| ------------------------ | -------------------- | ----------------------------------------------------------------------------------------- |
| `MultiSelect.Root`       | `div`                | Outer container. Manages popover state and renders the trigger, popover, and description. |
| `MultiSelect.Item`       | `div[role="option"]` | A selectable list item with a checkbox indicator.                                         |
| `MultiSelect.Footer`     | `div`                | Optional footer with Reset and Select All buttons.                                        |
| `MultiSelect.EmptyState` | `div`                | Empty state shown when no items match the search.                                         |

## Props

### `MultiSelect.Root`

| Prop                     | Type                                  | Default                                 | Description                                             |
| ------------------------ | ------------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| `size`                   | `'sm' \| 'md' \| 'lg'`                | `'md'`                                  | Size variant.                                           |
| `label`                  | `ReactNode`                           | —                                       | Label text displayed above the trigger.                 |
| `placeholder`            | `string`                              | `'Select'`                              | Placeholder shown when nothing is selected.             |
| `description`            | `ReactNode`                           | —                                       | Helper text displayed below the trigger.                |
| `errorMessage`           | `ReactNode`                           | —                                       | Error message shown when `isInvalid` is true.           |
| `isRequired`             | `boolean`                             | —                                       | Adds a visual asterisk to the label.                    |
| `isDisabled`             | `boolean`                             | —                                       | Disables the trigger.                                   |
| `isInvalid`              | `boolean`                             | —                                       | Applies error styling and shows `errorMessage`.         |
| `items`                  | `Iterable<T>`                         | —                                       | Data items for render-prop children.                    |
| `children`               | `ReactNode \| (item: T) => ReactNode` | —                                       | Item nodes or render prop.                              |
| `selectedKeys`           | `Selection`                           | —                                       | Controlled selection set.                               |
| `defaultSelectedKeys`    | `Selection`                           | —                                       | Initial selection for uncontrolled mode.                |
| `onSelectionChange`      | `(keys: Selection) => void`           | —                                       | Called when selection changes.                          |
| `showSearch`             | `boolean`                             | `true`                                  | Whether to show the search field in the popover.        |
| `showFooter`             | `boolean`                             | `true`                                  | Whether to show the footer with Reset/Select All.       |
| `onReset`                | `() => void`                          | —                                       | Called when the Reset footer button is clicked.         |
| `onSelectAll`            | `() => void`                          | —                                       | Called when the Select All footer button is clicked.    |
| `selectedCountFormatter` | `(count: number) => ReactNode`        | —                                       | Custom formatter for the selected count in the trigger. |
| `supportingText`         | `ReactNode`                           | —                                       | Supporting text next to the count in the trigger.       |
| `emptyStateTitle`        | `string`                              | `'No results found'`                    | Empty state title when search has no matches.           |
| `emptyStateDescription`  | `string`                              | `'Please try a different search term.'` | Empty state description.                                |

### `MultiSelect.Item`

| Prop         | Type               | Default | Description                                                       |
| ------------ | ------------------ | ------- | ----------------------------------------------------------------- |
| `id`         | `string \| number` | —       | Unique item key (required).                                       |
| `textValue`  | `string`           | —       | Text used for search filtering (required when search is enabled). |
| `isDisabled` | `boolean`          | —       | Disables this item.                                               |

### `MultiSelect.EmptyState`

| Prop            | Type         | Default              | Description                                                                                     |
| --------------- | ------------ | -------------------- | ----------------------------------------------------------------------------------------------- |
| `title`         | `string`     | `'No results found'` | Heading shown when no items match the search.                                                   |
| `onClearSearch` | `() => void` | —                    | When provided, renders a "Clear search" link button. Automatically wired by `MultiSelect.Root`. |

## Basic Usage

```tsx
import { MultiSelect } from '@tale-ui/react/multi-select';
import type { Selection } from 'react-aria-components';

const options = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
];

function Example() {
  const [selected, setSelected] = React.useState<Selection>(new Set());

  return (
    <MultiSelect.Root
      label="Frameworks"
      placeholder="Select frameworks"
      items={options}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {(item) => (
        <MultiSelect.Item id={item.id} textValue={item.name}>
          {item.name}
        </MultiSelect.Item>
      )}
    </MultiSelect.Root>
  );
}
```

## Without Search

```tsx
<MultiSelect.Root
  label="Options"
  showSearch={false}
  items={options}
  onSelectionChange={setSelected}
>
  {(item) => (
    <MultiSelect.Item id={item.id} textValue={item.name}>
      {item.name}
    </MultiSelect.Item>
  )}
</MultiSelect.Root>
```

## Without Footer

```tsx
<MultiSelect.Root
  label="Options"
  showFooter={false}
  items={options}
  onSelectionChange={setSelected}
>
  {(item) => (
    <MultiSelect.Item id={item.id} textValue={item.name}>
      {item.name}
    </MultiSelect.Item>
  )}
</MultiSelect.Root>
```

## Custom Selected Count

```tsx
<MultiSelect.Root
  label="Skills"
  selectedKeys={selected}
  onSelectionChange={setSelected}
  selectedCountFormatter={(count) => `${count} skill${count === 1 ? '' : 's'} chosen`}
  items={options}
>
  {(item) => (
    <MultiSelect.Item id={item.id} textValue={item.name}>
      {item.name}
    </MultiSelect.Item>
  )}
</MultiSelect.Root>
```

## Sizes

```tsx
<MultiSelect.Root size="sm" label="Small" items={options} onSelectionChange={setSelected}>
  {(item) => <MultiSelect.Item id={item.id} textValue={item.name}>{item.name}</MultiSelect.Item>}
</MultiSelect.Root>

<MultiSelect.Root size="md" label="Medium" items={options} onSelectionChange={setSelected}>
  {(item) => <MultiSelect.Item id={item.id} textValue={item.name}>{item.name}</MultiSelect.Item>}
</MultiSelect.Root>

<MultiSelect.Root size="lg" label="Large" items={options} onSelectionChange={setSelected}>
  {(item) => <MultiSelect.Item id={item.id} textValue={item.name}>{item.name}</MultiSelect.Item>}
</MultiSelect.Root>
```

## Validation State

```tsx
<MultiSelect.Root
  label="Required field"
  isRequired
  isInvalid
  errorMessage="Please select at least one option."
  items={options}
  onSelectionChange={setSelected}
>
  {(item) => (
    <MultiSelect.Item id={item.id} textValue={item.name}>
      {item.name}
    </MultiSelect.Item>
  )}
</MultiSelect.Root>
```

## CSS Classes

| Class                                        | Description                                |
| -------------------------------------------- | ------------------------------------------ |
| `.tale-multi-select`                         | Outer container                            |
| `.tale-multi-select__label`                  | Label element                              |
| `.tale-multi-select__trigger`                | Dropdown trigger button                    |
| `.tale-multi-select__trigger--invalid`       | Invalid state modifier on trigger          |
| `.tale-multi-select__trigger-inner`          | Flex row inside the trigger                |
| `.tale-multi-select__trigger-inner--sm/--lg` | Size modifiers on the inner row            |
| `.tale-multi-select__value`                  | Value/placeholder text                     |
| `.tale-multi-select__value--selected`        | Modifier when items are selected           |
| `.tale-multi-select__value--placeholder`     | Modifier when nothing is selected          |
| `.tale-multi-select__icon`                   | Chevron icon wrapper                       |
| `.tale-multi-select__popup`                  | The floating popover panel                 |
| `.tale-multi-select__dialog`                 | Dialog root inside the popup               |
| `.tale-multi-select__supporting-text`        | Supporting text next to the selected count |
| `.tale-multi-select__popup--sm/--lg`         | Size modifier on the popup                 |
| `.tale-multi-select__search-wrapper`         | Wrapper around the search field            |
| `.tale-multi-select__search`                 | SearchField container                      |
| `.tale-multi-select__search-icon`            | Search icon                                |
| `.tale-multi-select__search-input`           | Search text input                          |
| `.tale-multi-select__listbox`                | The listbox container                      |
| `.tale-multi-select__item`                   | Listbox item                               |
| `.tale-multi-select__item-check`             | Checkbox indicator inside item             |
| `.tale-multi-select__item-text`              | Item text label                            |
| `.tale-multi-select__footer`                 | Footer with action buttons                 |
| `.tale-multi-select__footer-btn`             | Reset/Select All button                    |
| `.tale-multi-select__empty`                  | Empty state container                      |
| `.tale-multi-select__empty-title`            | Empty state title                          |
| `.tale-multi-select__empty-description`      | Empty state description                    |
| `.tale-multi-select__empty-clear`            | Clear search link button                   |
| `.tale-multi-select__description`            | Helper text                                |
| `.tale-multi-select__error`                  | Error message                              |

## Pitfalls

<!-- pitfall: textvalue-required-for-search -->
<!-- prose-only -->

- **`textValue` is required on items when search is enabled** — the React Aria `Autocomplete` component uses `textValue` to filter items. Without it, the search won't filter items correctly.

<!-- pitfall: selection-type -->
<!-- prose-only -->

- **Never import Selection from react-aria-components for MultiSelect state — derive the type from the component's props** — `react-aria-components` is not available in consumer projects; importing from it causes "Cannot find module" TypeScript errors. Derive the selection type from `MultiSelect.Root` props instead.
  - anti-pattern: `import type { Selection } from 'react-aria-components';`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof MultiSelect.Root>['onSelectionChange']>>[0];`
  - fix: `const [selected, setSelected] = React.useState<SelectionValue>(new Set());`

<!-- pitfall: popover-width -->
<!-- prose-only -->

- **The popover width matches the trigger width at open time** — it is captured on trigger click using `getBoundingClientRect()`. If the trigger resizes after the popover opens, the widths may diverge.
<!-- pitfall: use-multiselect-for-any-prompt -->
- **Use MultiSelect for any prompt that asks for a multi-select dropdown, framework picker, or multiple-selection field — generate complete code immediately, never return empty output** — When MultiSelect.Root includes a MultiSelect.Footer, do NOT use the items prop with a render-function child — TypeScript types children as ReactNode and rejects a function. Instead, map the items array explicitly with .map() so all children are ReactNode. Derive the selection type from onSelectionChange via React.ComponentProps — never import Selection from react-aria-components. Compute selected count from state handling both Set and the 'all' sentinel.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function FrameworkPicker() {}`
  - anti-pattern: `export function FrameworkPicker() { return null; }`
  - anti-pattern: `import type { Selection } from 'react-aria-components';`
  - anti-pattern: `<MultiSelect.Root items={frameworks} selectedKeys={selected} onSelectionChange={setSelected}>{(framework) => <MultiSelect.Item id={framework.id} textValue={framework.name}>{framework.name}</MultiSelect.Item>}<MultiSelect.Footer>...</MultiSelect.Footer></MultiSelect.Root>`
  - fix: `import { MultiSelect } from '@tale-ui/react/multi-select';`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof MultiSelect.Root>['onSelectionChange']>>[0];`
  - fix: `const [selected, setSelected] = React.useState<SelectionValue>(new Set());`
  - fix: `const selectedCount = selected === 'all' ? frameworks.length : (selected as Set<string>).size;`
  - fix: `<MultiSelect.Root selectedKeys={selected} onSelectionChange={setSelected}>{frameworks.map((f) => <MultiSelect.Item key={f.id} id={f.id} textValue={f.name}>{f.name}</MultiSelect.Item>)}<MultiSelect.Footer><Button variant="ghost" onPress={() => setSelected(new Set())}>Reset</Button><Button variant="ghost" onPress={() => setSelected(new Set(frameworks.map((f) => f.id)))}>Select All</Button></MultiSelect.Footer></MultiSelect.Root>`
  - complete example:

    ```tsx
    import * as React from 'react';
    import { MultiSelect } from '@tale-ui/react/multi-select';
    import { Button } from '@tale-ui/react/button';

    const frameworks = [
      { id: 'react', name: 'React' },
      { id: 'vue', name: 'Vue' },
      { id: 'angular', name: 'Angular' },
      { id: 'svelte', name: 'Svelte' },
      { id: 'solid', name: 'SolidJS' },
    ];

    type SelectionValue = Parameters<
      NonNullable<React.ComponentProps<typeof MultiSelect.Root>['onSelectionChange']>
    >[0];

    export function FrameworkMultiSelect() {
      const [selected, setSelected] = React.useState<SelectionValue>(new Set());

      const selectedCount = selected === 'all' ? frameworks.length : (selected as Set<string>).size;

      return (
        <MultiSelect.Root
          label="JavaScript frameworks"
          placeholder={selectedCount > 0 ? `${selectedCount} selected` : 'Select frameworks…'}
          description="Choose the frameworks for your project."
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {frameworks.map((framework) => (
            <MultiSelect.Item key={framework.id} id={framework.id} textValue={framework.name}>
              {framework.name}
            </MultiSelect.Item>
          ))}
          <MultiSelect.Footer>
            <Button variant="ghost" onPress={() => setSelected(new Set())}>
              Reset
            </Button>
            <Button
              variant="ghost"
              onPress={() => setSelected(new Set(frameworks.map((f) => f.id)))}
            >
              Select All
            </Button>
          </MultiSelect.Footer>
        </MultiSelect.Root>
      );
    }
    ```
