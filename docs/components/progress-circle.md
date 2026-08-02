# ProgressCircle

`import { ProgressCircle } from '@tale-ui/react/progress-circle';`

A circular progress indicator showing task completion. Supports determinate (with value) and indeterminate (spinner) states.

## Parts

| Part                   | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `ProgressCircle.Root`  | Container. Wraps React Aria ProgressBar.                      |
| `ProgressCircle.Track` | SVG element with rail and indicator circles.                  |
| `ProgressCircle.Label` | Text label.                                                   |
| `ProgressCircle.Value` | Percentage text. Auto-renders `{percentage}%` if no children. |

## Props

### Root

| Prop       | Type                   | Default | Description                                   |
| ---------- | ---------------------- | ------- | --------------------------------------------- |
| `value`    | `number \| null`       | —       | Current value. Pass `null` for indeterminate. |
| `minValue` | `number`               | `0`     | Minimum value                                 |
| `maxValue` | `number`               | `100`   | Maximum value                                 |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the circular indicator                |

Also accepts all React Aria `ProgressBar` props.

## Basic Usage

```tsx
<ProgressCircle.Root value={60}>
  <ProgressCircle.Track />
</ProgressCircle.Root>
```

## Examples

### With Label and Value

```tsx
<ProgressCircle.Root value={75}>
  <ProgressCircle.Track />
  <ProgressCircle.Label>Upload</ProgressCircle.Label>
  <ProgressCircle.Value />
</ProgressCircle.Root>
```

### Indeterminate

```tsx
<ProgressCircle.Root value={null}>
  <ProgressCircle.Track />
</ProgressCircle.Root>
```

### All Sizes

```tsx
<ProgressCircle.Root value={60} size="sm"><ProgressCircle.Track /></ProgressCircle.Root>
<ProgressCircle.Root value={60} size="md"><ProgressCircle.Track /></ProgressCircle.Root>
<ProgressCircle.Root value={60} size="lg"><ProgressCircle.Track /></ProgressCircle.Root>
```

### Complete

```tsx
<ProgressCircle.Root value={100}>
  <ProgressCircle.Track />
</ProgressCircle.Root>
```

## CSS Classes

- `.tale-progress-circle` -- Root container
- `.tale-progress-circle--sm` -- Small size
- `.tale-progress-circle--lg` -- Large size
- `.tale-progress-circle__track` -- SVG container
- `.tale-progress-circle__rail` -- Background ring (stroke)
- `.tale-progress-circle__indicator` -- Filled arc (stroke)
- `.tale-progress-circle__label` -- Text label
- `.tale-progress-circle__value` -- Percentage text

## Pitfalls

<!-- pitfall: progress-circle-no-text-inside-root -->

- **Do NOT place `<Text>` inside `ProgressCircle.Root`** — use `ProgressCircle.Label` for labelling and `ProgressCircle.Value` for the percentage display.
  - anti-pattern: `<ProgressCircle.Root value={60}><Text>Loading</Text></ProgressCircle.Root>`
  - fix: `<ProgressCircle.Root value={60}><ProgressCircle.Label>Loading</ProgressCircle.Label><ProgressCircle.Value /></ProgressCircle.Root>`
  - complete example:

    ```tsx
    import { ProgressCircle } from '@tale-ui/react/progress-circle';

    export function Example() {
      return (
        <>
          <ProgressCircle.Root value={60}>
            <ProgressCircle.Track />
          </ProgressCircle.Root>

          <ProgressCircle.Root value={null}>
            <ProgressCircle.Track />
          </ProgressCircle.Root>
        </>
      );
    }
    ```

<!-- pitfall: progress-circle-size-valid-values -->

- **size only accepts 'sm', 'md', 'lg'** — NOT the short forms `'s'`, `'m'`, `'l'`, and NOT `'xl'`.
  - anti-pattern: `<ProgressCircle.Root size="m" />`
  - fix: `<ProgressCircle.Root size="md" />`

<!-- pitfall: progress-circle-shorthand-tokens-in-column -->
- **`Column`/`Text` props around `ProgressCircle` use shorthand tokens — `gap="s"`, `size="s"`, `color="muted"`** — `Column gap="sm"` is not a valid `Gap` value (use `gap="s"`); `Text size="sm"` is not valid for `Text` (use `size="s"`); `Text color="secondary"` is not a valid `Color` on `Text` (use `color="muted"` for supporting copy).
  - anti-pattern: `<Column gap="sm"><ProgressCircle.Root value={65}><ProgressCircle.Track /></ProgressCircle.Root><Text size="sm" color="secondary">65%</Text></Column>`
  - fix: `<Column gap="s"><ProgressCircle.Root value={65}><ProgressCircle.Track /></ProgressCircle.Root><Text size="s" color="muted">65%</Text></Column>`
  - complete example:

    ```tsx
    import { ProgressCircle } from '@tale-ui/react/progress-circle';
    import { Column } from '@tale-ui/react/column';
    import { Text } from '@tale-ui/react/text';

    export function UploadProgress() {
      return (
        <Column gap="s" align="center">
          <ProgressCircle.Root value={65} size="lg" aria-label="Upload progress">
            <ProgressCircle.Track />
          </ProgressCircle.Root>
          <Text size="s" color="muted">
            Uploading… 65%
          </Text>
        </Column>
      );
    }
    ```

## Notes

- Built on React Aria `ProgressBar` — provides `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` automatically.
- Pass `value={null}` for an indeterminate spinning animation.
- When `value` reaches `maxValue`, `[data-complete]` is set and the indicator turns green.
- The `Value` sub-part auto-renders the rounded percentage if no children are provided.
- When `minValue` equals `maxValue`, the circle and generated value use `0%` rather than an invalid `NaN` position.
- SVG dimensions scale with `size`: sm = 32px, md = 48px, lg = 64px.
