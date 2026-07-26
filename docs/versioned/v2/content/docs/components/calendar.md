# Calendar

`import { Calendar } from '@tale-ui/react/calendar';`

A date picker calendar for selecting a single date, with month navigation.

## Parts

| Part                      | Description                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Calendar.Root`           | Wrapper managing date state and locale                                                               |
| `Calendar.PreviousButton` | Navigate to the previous month (renders a ChevronLeft icon by default)                               |
| `Calendar.NextButton`     | Navigate to the next month (renders a ChevronRight icon by default)                                  |
| `Calendar.Heading`        | Displays the current month and year                                                                  |
| `Calendar.Grid`           | `<table>` containing the header and body                                                             |
| `Calendar.GridHeader`     | `<thead>` row of weekday names (render prop: `(day) => ...`)                                         |
| `Calendar.GridHeaderCell` | `<th>` weekday label — **use inside `GridHeader` only**                                              |
| `Calendar.GridBody`       | `<tbody>` rows of date cells (render prop: `(date) => ...`)                                          |
| `Calendar.Cell`           | Individual date cell — **use inside `GridBody` only**; accepts a `date` prop                         |
| `Calendar.Header`         | Flex row wrapper for navigation buttons and heading                                                  |
| `Calendar.MonthPicker`    | Locale-aware month picker; renders a styled native select by default                                |
| `Calendar.YearPicker`     | Locale-aware year picker; renders a styled native select by default                                 |

## Props

Accepts all React Aria `Calendar` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### New in React Aria 1.17/1.18

These props live on the React Aria layer and flow through the Tale UI wrappers untouched:

| Part               | Prop            | Type                     | Description                                                                                                                   |
| ------------------ | --------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `Calendar.Root`    | `selectionMode` | `'single' \| 'multiple'` | Enable multiple date selection (new in 1.18). With `"multiple"`, `value`/`defaultValue`/`onChange` use an **array** of dates. |
| `Calendar.Grid`    | `weeksInMonth`  | `number`                 | Overrides the locale default number of displayed weeks.                                                                       |
| `Calendar.Heading` | `offset`        | `number`                 | Months offset for multi-month layouts (e.g. show the next month's name in a second heading).                                  |
| `Calendar.MonthPicker` | `format`     | `'numeric' \| '2-digit' \| 'long' \| 'short' \| 'narrow'` | Month label format for the generated options.                                            |
| `Calendar.MonthPicker` | `children`   | render prop              | Optional custom renderer. Render props include the RAC data plus Tale UI `className`, `isDisabled`, and `isReadOnly`.          |
| `Calendar.YearPicker`  | `visibleYears` | `number`               | Number of year options to display around the visible year.                                                                     |
| `Calendar.YearPicker`  | `format`     | `{ year?: 'numeric' \| '2-digit'; era?: 'long' \| 'short' \| 'narrow' }` | Year label format for the generated options.                         |
| `Calendar.YearPicker`  | `children`   | render prop              | Optional custom renderer. Render props include the RAC data plus Tale UI `className`, `isDisabled`, and `isReadOnly`.          |

## Basic Usage

```tsx
<Calendar.Root>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

> **Note:** Wrap navigation buttons and heading in `Calendar.Header` — it provides the flex layout automatically.

## Examples

### Disabled

```tsx
<Calendar.Root isDisabled>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

### Read Only (with default value)

```tsx
import { today, getLocalTimeZone } from '@internationalized/date';

<Calendar.Root defaultValue={today(getLocalTimeZone())} isReadOnly>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>;
```

### Multiple Selection

New in React Aria 1.18 — pass `selectionMode="multiple"` to `Calendar.Root` to let users select several individual dates. The value is an **array** of dates.

```tsx
import { today, getLocalTimeZone } from '@internationalized/date';

const now = today(getLocalTimeZone());

<Calendar.Root selectionMode="multiple" defaultValue={[now, now.add({ days: 3 })]}>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>;
```

## Month and year pickers

`Calendar.MonthPicker` and `Calendar.YearPicker` render Tale UI styled native selects by default. Place them in `Calendar.Header` between the previous and next buttons.

```tsx
<Calendar.Root>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.MonthPicker format="short" />
    <Calendar.YearPicker visibleYears={8} />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

For custom picker UI, pass a render prop. The render prop receives React Aria's locale-aware month/year list data plus the Tale UI `className` for applying the same design-system styling.

```tsx
<Calendar.MonthPicker format="short">
  {({ 'aria-label': ariaLabel, className, value, onChange, items, isDisabled }) => (
    <select
      aria-label={ariaLabel}
      className={className}
      disabled={isDisabled}
      value={String(value)}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
    >
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.formatted}
        </option>
      ))}
    </select>
  )}
</Calendar.MonthPicker>
```

## CSS Classes

- `.tale-calendar` — Root container
- `.tale-calendar__header` — Navigation header row
- `.tale-calendar__heading` — Month/year heading
- `.tale-calendar__prev-button` — Previous month button
- `.tale-calendar__next-button` — Next month button
- `.tale-calendar__month-picker` — Native month select rendered by `Calendar.MonthPicker`
- `.tale-calendar__year-picker` — Native year select rendered by `Calendar.YearPicker`
- `.tale-calendar__grid` — Table element
- `.tale-calendar__grid-header` — Weekday header row
- `.tale-calendar__grid-header-cell` — Individual weekday label
- `.tale-calendar__grid-body` — Date rows
- `.tale-calendar__cell` — Individual date cell

## Pitfalls

<!-- pitfall: calendar-header-required -->
<!-- multi-idea-ok -->

- **Navigation buttons and heading must be inside `Calendar.Header`** — `Calendar.PreviousButton`, `Calendar.Heading`, and `Calendar.NextButton` must be placed inside `Calendar.Header`; placing them directly in `Calendar.Root` loses the flex layout.
  - anti-pattern: `<Calendar.Root><Calendar.PreviousButton /><Calendar.Heading /><Calendar.NextButton /></Calendar.Root>`
  - fix: `<Calendar.Root><Calendar.Header><Calendar.PreviousButton /><Calendar.Heading /><Calendar.NextButton /></Calendar.Header></Calendar.Root>`
  - complete example:

    ```tsx
    import { Calendar } from '@tale-ui/react/calendar';

    export function Example() {
      return (
        <Calendar.Root>
          <Calendar.Header>
            <Calendar.PreviousButton />
            <Calendar.Heading />
            <Calendar.NextButton />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
          </Calendar.Grid>
        </Calendar.Root>
      );
    }
    ```

<!-- pitfall: calendar-grid-header-cell-not-cell -->

- **Use `Calendar.GridHeaderCell` in `GridHeader`, not `Calendar.Cell`** — `GridHeader` passes day name strings to its render prop; `Cell` expects a date object and crashes with `TypeError` if used here.
  - anti-pattern: `<Calendar.GridHeader>{(day) => <Calendar.Cell>{day}</Calendar.Cell>}</Calendar.GridHeader>`
  - fix: `<Calendar.GridHeader>{(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}</Calendar.GridHeader>`

<!-- pitfall: calendar-heading-no-margin -->

- **Do not add vertical margin or padding to `Calendar.Heading`** — it is positioned by `Calendar.Header`'s flex layout; extra margin breaks alignment.
  - anti-pattern: `<Calendar.Heading style={{ marginBottom: '8px' }} />`
  - fix: `<Calendar.Heading />`
<!-- pitfall: use-calendar-for-date-picker -->
- **Use `Calendar` for any prompt that asks for a date calendar picker, standalone calendar, or single date selection** — when the request is to display a calendar for picking a single date, render `Calendar.Root` with the full header and grid structure instead of leaving the file empty or substituting `DatePicker`.
  - anti-pattern: `// empty file`
  - fix: `import { Calendar } from '@tale-ui/react/calendar'; export function DateCalendarPicker() { return <Calendar.Root><Calendar.Header><Calendar.PreviousButton /><Calendar.Heading /><Calendar.NextButton /></Calendar.Header><Calendar.Grid><Calendar.GridHeader>{(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}</Calendar.GridHeader><Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody></Calendar.Grid></Calendar.Root>; }`

<!-- pitfall: calendar-multiple-value-array -->

- **With `selectionMode="multiple"` the value is `DateValue[]`, not a single date** — `value`, `defaultValue`, and the `onChange` argument are arrays of dates; passing or expecting a single date is a type error.
  - anti-pattern: `<Calendar.Root selectionMode="multiple" defaultValue={today(getLocalTimeZone())} />`
  - fix: `<Calendar.Root selectionMode="multiple" defaultValue={[today(getLocalTimeZone())]} />`

<!-- cross-pitfall-ref: no-locale-prop-on-calendar -->
<!-- cross-pitfall-ref: no-native-date -->
<!-- cross-pitfall-ref: derive-date-type-from-props -->
<!-- cross-pitfall-ref: no-null-state-without-type -->
<!-- cross-pitfall-ref: parse-date-import-from-internationalized-date -->

## Notes

- Built on React Aria `Calendar` and related components.
- Uses `@internationalized/date` for date values. Import helpers like `today()` and `getLocalTimeZone()` from that package.
- `GridHeader` and `GridBody` use render props to iterate weekday names and date objects respectively.
- **Use `Calendar.GridHeaderCell` in `GridHeader`, not `Calendar.Cell`.** `GridHeader`'s render prop passes day name strings (e.g. `"Mon"`), not date objects. Using `Calendar.Cell` there crashes with `TypeError: can't access property "calendar", date is undefined` because `Cell` expects a `date` prop. Reserve `Calendar.Cell` for `GridBody` where actual date objects are provided.
- Calendar selects a single date by default; pass `selectionMode="multiple"` (React Aria 1.18) to select several individual dates. Use RangeCalendar for selecting contiguous date ranges.
