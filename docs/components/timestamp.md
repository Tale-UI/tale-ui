# Timestamp

`import { Timestamp } from '@tale-ui/react/timestamp';`

Experimental locale- and timezone-explicit native time element. Timestamp
accepts absolute instants only, normalizes its machine-readable `dateTime` to
UTC, and owns deterministic absolute and relative formatting.

## Props

| Prop              | Type                                   | Default    | Description                                          |
| ----------------- | -------------------------------------- | ---------- | ---------------------------------------------------- |
| `value`           | `Date \| number \| string`             | —          | Absolute timestamp value                             |
| `locale`          | `string`                               | —          | Explicit `Intl` locale                               |
| `timeZone`        | `string`                               | —          | Explicit IANA timezone                               |
| `format`          | `date \| time \| datetime \| relative` | `datetime` | Frozen formatting preset                             |
| `formatOptions`   | `Intl.DateTimeFormatOptions`           | —          | Absolute preset overrides, except `timeZone`         |
| `now`             | `Date \| number \| string`             | —          | Required relative server and hydration clock         |
| `refreshInterval` | `number`                               | `60000`    | Relative refresh cadence; `0` disables refresh       |
| `invalidFallback` | `ReactNode`                            | `—`        | Content rendered when validation or formatting fails |

Timestamp also accepts native `<time>` attributes except `children`,
`dateTime`, and `dangerouslySetInnerHTML`. It forwards its ref to the native
`HTMLTimeElement`.

`formatOptions` is available only for absolute formats. `now` and
`refreshInterval` are available only for `format="relative"`. Enabled refresh
intervals must be finite and at least 1,000 milliseconds.

## Absolute Usage

```tsx
import { Timestamp } from '@tale-ui/react/timestamp';

export function PublishedAt() {
  return (
    <Timestamp
      value="2026-07-27T04:30:00+00:00"
      locale="en-AU"
      timeZone="Australia/Melbourne"
      format="datetime"
    />
  );
}
```

The frozen presets are:

- `date`: numeric year, short month, and numeric day
- `time`: numeric hour and two-digit minute
- `datetime`: all date and time fields above

Consumer `formatOptions` override preset fields. Timestamp always applies its
explicit `timeZone` last.

## Relative Usage

```tsx
import { Timestamp } from '@tale-ui/react/timestamp';

const renderedAt = Date.parse('2026-07-27T04:00:00Z');

export function RecentActivity() {
  return (
    <Timestamp
      value="2026-07-27T04:05:00Z"
      locale="en-AU"
      timeZone="Australia/Melbourne"
      format="relative"
      now={renderedAt}
      refreshInterval={60_000}
    />
  );
}
```

Relative output uses fixed seconds, minutes, hours, days, seven-day weeks,
30-day months, and 365-day years. Exact halves round away from zero. The
supplied `now` anchors SSR and the first hydration output; client refreshes add
only elapsed time after mount.

## Validation and Fallbacks

Date instances are copied. Numbers must be finite epoch milliseconds. Strings
must be complete timestamps with a `Z` or numeric UTC offset, for example
`2026-07-27T04:30:00Z` or `2026-07-27T14:30:00+10:00`.

Invalid values, locale, timezone, options, relative clocks, or intervals render
`invalidFallback`. A valid target retains its normalized UTC `dateTime` even
when visible formatting fails.

## CSS Classes

- `.tale-timestamp`

## Pitfalls

- Do not pass locale-dependent date strings such as `07/27/2026`. Convert data
  boundaries to an absolute offset-bearing timestamp.
- Do not derive relative `now` from `Date.now()` during render. Capture it once
  on the server or request boundary so SSR and hydration agree.
- Do not place `timeZone` in `formatOptions`; use the required top-level prop.
