# TimeField

`import { TimeField } from '@tale-ui/react/time-field';`

A segmented time input field that allows users to type a time value with individual segments for hours, minutes, and period.

## Parts

| Part | Description |
|------|-------------|
| `TimeField.Root` | Wrapper that manages time field state |
| `TimeField.DateInput` | Container for time segments; accepts a render function |
| `TimeField.Segment` | Individual editable segment (hour, minute, AM/PM) |
| `TimeField.Label` | Accessible label |
| `TimeField.Description` | Helper text |
| `TimeField.ErrorMessage` | Validation error message |

## Props

Accepts all React Aria `TimeField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<TimeField.Root>
  <TimeField.DateInput style={{ display: 'flex' }}>
    {(segment) => <TimeField.Segment segment={segment} />}
  </TimeField.DateInput>
</TimeField.Root>
```

## Examples

### With Label

```tsx
<TimeField.Root>
  <TimeField.Label>Time</TimeField.Label>
  <TimeField.DateInput style={{ display: 'flex' }}>
    {(segment) => <TimeField.Segment segment={segment} />}
  </TimeField.DateInput>
</TimeField.Root>
```

## CSS Classes

- `.tale-time-field` — Root
- `.tale-time-field__input` — DateInput container
- `.tale-time-field__segment` — Individual segment
- `.tale-time-field__label` — Label
- `.tale-time-field__description` — Description text
- `.tale-time-field__error` — Error message

## Pitfalls

<!-- pitfall: time-field-no-extra-sub-parts -->
- **No extra sub-parts: `TimeField.Group`, `TimeField.Trigger`, `TimeField.Input`, `TimeField.Popover`, `TimeField.Dialog` do not exist** — `TimeField` is a segmented inline input only; it has no trigger or popover anatomy.
  - anti-pattern: `<TimeField.Root><TimeField.Trigger /><TimeField.Popover><TimeField.DateInput /></TimeField.Popover></TimeField.Root>`
  - fix: `<TimeField.Root><TimeField.Label>Time</TimeField.Label><TimeField.DateInput /></TimeField.Root>`
  - complete example:
    ```tsx
    import { TimeField } from '@tale-ui/react/time-field';

    export function Example() {
      return (
        <TimeField.Root>
          <TimeField.Label>Time</TimeField.Label>
          <TimeField.DateInput>
            {(segment) => <TimeField.Segment segment={segment} />}
          </TimeField.DateInput>
        </TimeField.Root>
      );
    }
    ```

<!-- pitfall: time-field-dateinput-not-input -->
- **The input sub-part is `TimeField.DateInput`, not `TimeField.Input`** — There is no `TimeField.Input`. The correct sub-part for the segmented time input is `TimeField.DateInput`.
  - anti-pattern: `<TimeField.Input>`
  - fix: `<TimeField.DateInput>`

<!-- pitfall: time-field-hour-singular -->
- **Property is `hour` (singular), not `hours`** — React Aria uses `hour` (singular) for the hour segment value. Using `hours` will be silently ignored.
  - anti-pattern: `granularity="hours"`
  - fix: `granularity="hour"`

<!-- cross-pitfall-ref: no-native-date -->
<!-- cross-pitfall-ref: derive-date-type-from-props -->

## Notes

- `DateInput` requires a render function child that receives each segment.
- Supports `isRequired` and `isDisabled` props on the Root.
