# SelectNative

`import { SelectNative } from '@tale-ui/react/select-native';`

A styled native `<select>` element matching the Input field appearance. Use when you need native browser select behaviour instead of a custom popover listbox.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'sm' \| 'md'` | `'md'` | Field size |

Also accepts all standard `<select>` HTML attributes. Pass `<option>` elements as children.

## Basic Usage

```tsx
<SelectNative>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</SelectNative>
```

## Examples

### All Sizes

```tsx
<SelectNative size="sm">
  <option>Small</option>
</SelectNative>
<SelectNative size="md">
  <option>Medium</option>
</SelectNative>
```

### Disabled

```tsx
<SelectNative disabled>
  <option>Cannot select</option>
</SelectNative>
```

### With Groups

```tsx
<SelectNative>
  <optgroup label="Fruits">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
  </optgroup>
  <optgroup label="Vegetables">
    <option value="carrot">Carrot</option>
    <option value="broccoli">Broccoli</option>
  </optgroup>
</SelectNative>
```

## CSS Classes

- `.tale-select-native` -- Base
- `.tale-select-native--sm` / `--md` -- Size modifiers

## Pitfalls

<!-- pitfall: select-native-no-sub-parts -->
- **`SelectNative` has NO sub-parts** — no `.Root`, `.Label`, `.Trigger`, `.Value`, etc. Use `<SelectNative>` directly with plain HTML `<label>` and `<option>` children.
  - anti-pattern: `<SelectNative.Root><SelectNative.Label>Size</SelectNative.Label><SelectNative.Trigger /></SelectNative.Root>`
  - fix: `<label>Size<SelectNative><option value="sm">Small</option></SelectNative></label>`
  - complete example:
    ```tsx
    import { SelectNative } from '@tale-ui/react/select-native';

    export function Example() {
      return (
        <>
          <SelectNative>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
          </SelectNative>

          <SelectNative disabled>
            <option>Disabled</option>
          </SelectNative>
        </>
      );
    }
    ```

<!-- cross-pitfall-ref: no-label-component -->

## Notes

- Custom component -- not built on a React Aria primitive.
- Renders a native `<select>` element with Tale UI field styling.
- Use this instead of `Select` when you need native mobile picker behaviour or `<optgroup>` support.
- Pair with `Field` for label and validation: wrap in `<Field.Root>` with `<Field.Label>` and `<Field.Control>`.
