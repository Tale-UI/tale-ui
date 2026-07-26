# DateRangePicker

`import { DateRangePicker } from '@tale-ui/react/date-range-picker';`

A compound date input for selecting a start and end date, with a trigger that opens a range calendar popover.

## Parts

| Part | Description |
|------|-------------|
| `DateRangePicker.Root` | Wrapper that manages date range state |
| `DateRangePicker.Group` | Groups start/end inputs and trigger |
| `DateRangePicker.StartDate` | Date input for the start date |
| `DateRangePicker.EndDate` | Date input for the end date |
| `DateRangePicker.Segment` | Individual editable segment |
| `DateRangePicker.Trigger` | Button that opens the calendar popover |
| `DateRangePicker.Popover` | Popover container |
| `DateRangePicker.Dialog` | Dialog wrapper inside the popover |
| `DateRangePicker.Label` | Accessible label |
| `DateRangePicker.Description` | Helper text |
| `DateRangePicker.ErrorMessage` | Validation error message |

## Props

Accepts all React Aria `DateRangePicker` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { DateRangePicker } from '@tale-ui/react/date-range-picker';
import { RangeCalendar } from '@tale-ui/react/range-calendar';

<DateRangePicker.Root>
  <DateRangePicker.Label>Date range</DateRangePicker.Label>
  <DateRangePicker.Group>
    <DateRangePicker.StartDate>
      {(segment) => <DateRangePicker.Segment segment={segment} />}
    </DateRangePicker.StartDate>
    <span aria-hidden="true">&ndash;</span>
    <DateRangePicker.EndDate>
      {(segment) => <DateRangePicker.Segment segment={segment} />}
    </DateRangePicker.EndDate>
    <DateRangePicker.Trigger />
  </DateRangePicker.Group>
  <DateRangePicker.Popover>
    <DateRangePicker.Dialog>
      <RangeCalendar.Root>
        <RangeCalendar.Header>
          <RangeCalendar.PreviousButton />
          <RangeCalendar.Heading />
          <RangeCalendar.NextButton />
        </RangeCalendar.Header>
        <RangeCalendar.Grid>
          <RangeCalendar.GridHeader>
            {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
          </RangeCalendar.GridHeader>
          <RangeCalendar.GridBody>
            {(date) => <RangeCalendar.Cell date={date} />}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      </RangeCalendar.Root>
    </DateRangePicker.Dialog>
  </DateRangePicker.Popover>
</DateRangePicker.Root>
```

## CSS Classes

- `.tale-date-range-picker` — Root
- `.tale-date-range-picker__group` — Input group
- `.tale-date-range-picker__start` — Start date input
- `.tale-date-range-picker__end` — End date input
- `.tale-date-range-picker__segment` — Individual segment
- `.tale-date-range-picker__trigger` — Trigger button
- `.tale-date-range-picker__popover` — Popover
- `.tale-date-range-picker__dialog` — Dialog
- `.tale-date-range-picker__label` — Label
- `.tale-date-range-picker__description` — Description text
- `.tale-date-range-picker__error` — Error message

## Pitfalls

<!-- pitfall: date-range-picker-start-end-sub-parts -->
<!-- multi-idea-ok -->
- **Uses `StartDate` and `EndDate` sub-parts, not `DateInput`** — There is no `DateRangePicker.DateInput`. Use `DateRangePicker.StartDate` and `DateRangePicker.EndDate` for the two segmented inputs.
  - anti-pattern: `<DateRangePicker.DateInput>`
  - fix: `<DateRangePicker.StartDate>{(segment) => <DateRangePicker.Segment segment={segment} />}</DateRangePicker.StartDate>`
  - complete example:
    ```tsx
    import { DateRangePicker } from '@tale-ui/react/date-range-picker';
    import { RangeCalendar } from '@tale-ui/react/range-calendar';

    export function Example() {
      return (
        <DateRangePicker.Root>
          <DateRangePicker.Label>Date range</DateRangePicker.Label>
          <DateRangePicker.Group>
            <DateRangePicker.StartDate>
              {(segment) => <DateRangePicker.Segment segment={segment} />}
            </DateRangePicker.StartDate>
            <span aria-hidden="true">–</span>
            <DateRangePicker.EndDate>
              {(segment) => <DateRangePicker.Segment segment={segment} />}
            </DateRangePicker.EndDate>
            <DateRangePicker.Trigger />
          </DateRangePicker.Group>
          <DateRangePicker.Popover>
            <DateRangePicker.Dialog>
              <RangeCalendar.Root>
                <RangeCalendar.Header>
                  <RangeCalendar.PreviousButton />
                  <RangeCalendar.Heading />
                  <RangeCalendar.NextButton />
                </RangeCalendar.Header>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
              </RangeCalendar.Root>
            </DateRangePicker.Dialog>
          </DateRangePicker.Popover>
        </DateRangePicker.Root>
      );
    }
    ```

<!-- pitfall: date-range-picker-dialog-no-auto-calendar -->
- **`DateRangePicker.Dialog` does not auto-render a calendar** — You must compose a full `RangeCalendar` (imported from `@tale-ui/react/range-calendar`) as children inside `DateRangePicker.Dialog`.
  - anti-pattern: `<DateRangePicker.Dialog />`
  - fix: `<DateRangePicker.Dialog><RangeCalendar.Root>...</RangeCalendar.Root></DateRangePicker.Dialog>`

<!-- pitfall: date-range-picker-no-date-value-type-import -->
- **Do not import `DateValueType` from `@tale-ui/react/date-range-picker`** — `DateValueType` is not exported. Use `DateValue` instead: `import type { DateValue } from '@tale-ui/react/date-range-picker'`.
  - anti-pattern: `import type { DateValueType } from '@tale-ui/react/date-range-picker'`
  - fix: `import type { DateValue } from '@tale-ui/react/date-range-picker'`

<!-- cross-pitfall-ref: no-native-date -->
<!-- cross-pitfall-ref: derive-date-type-from-props -->
<!-- cross-pitfall-ref: parse-date-import-from-internationalized-date -->
<!-- cross-pitfall-ref: no-null-state-without-type -->

## Notes

- Requires `RangeCalendar` from `@tale-ui/react/range-calendar` for the popover content.
- `StartDate` and `EndDate` each accept a render function child for segments.
- Supports `isRequired` and `isDisabled` props on the Root.
- The popover renders a RangeCalendar component — import both `DateRangePicker` and `RangeCalendar` parts.
