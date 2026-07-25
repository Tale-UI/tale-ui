# ProgressBar

`import { ProgressBar } from '@tale-ui/react/progress-bar';`

A horizontal bar indicating progress toward completion, with support for determinate and indeterminate states.

## Parts

| Part | Description |
|------|-------------|
| `ProgressBar.Root` | Wrapper managing value and ARIA semantics |
| `ProgressBar.Header` | Flex row wrapper for Label + Value |
| `ProgressBar.Label` | Accessible text label |
| `ProgressBar.Value` | Displays the current value (e.g. "60%"); `aria-hidden` |
| `ProgressBar.Track` | Background rail |
| `ProgressBar.Indicator` | Filled portion; set `value` for determinate width, omit for indeterminate |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `labelPosition` | `'top' \| 'right' \| 'bottom' \| 'top-floating' \| 'bottom-floating'` | `'top'` | Where to position the label/value relative to the track |

Also accepts all React Aria `ProgressBar` props (`value`, `minValue`, `maxValue`, `isIndeterminate`, etc.).

### Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| null` | — | The current value (0--max). When `null` or omitted the bar is indeterminate |
| `min` | `number` | `0` | The minimum value |
| `max` | `number` | `100` | The maximum value |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100}>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

## Examples

### With Label and Value (top, default)

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading...</ProgressBar.Label>
    <ProgressBar.Value>60%</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Label position: right

Value text appears inline to the right of the bar. The Label is hidden in this layout.

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100} labelPosition="right">
  <ProgressBar.Header>
    <ProgressBar.Value>60%</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Label position: bottom

Value text appears below the bar.

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100} labelPosition="bottom">
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading...</ProgressBar.Label>
    <ProgressBar.Value>60%</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Label position: top-floating

A floating tooltip appears above the bar, anchored to the fill point.

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100} labelPosition="top-floating">
  <ProgressBar.Header>
    <ProgressBar.Value>60%</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Label position: bottom-floating

A floating tooltip appears below the bar, anchored to the fill point.

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100} labelPosition="bottom-floating">
  <ProgressBar.Header>
    <ProgressBar.Value>60%</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Indeterminate

```tsx
<ProgressBar.Root isIndeterminate minValue={0} maxValue={100}>
  <ProgressBar.Label>Loading...</ProgressBar.Label>
  <ProgressBar.Track>
    <ProgressBar.Indicator />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Multiple Values

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
  {[0, 25, 50, 75, 100].map((value) => (
    <ProgressBar.Root key={value} value={value} minValue={0} maxValue={100}>
      <ProgressBar.Header>
        <ProgressBar.Label>Progress</ProgressBar.Label>
        <ProgressBar.Value>{value}%</ProgressBar.Value>
      </ProgressBar.Header>
      <ProgressBar.Track>
        <ProgressBar.Indicator value={value} />
      </ProgressBar.Track>
    </ProgressBar.Root>
  ))}
</div>
```

## CSS Classes

- `.tale-progress-bar` — Root container
- `.tale-progress-bar__header` — Header row (Label + Value)
- `.tale-progress-bar__label` — Label text
- `.tale-progress-bar__value` — Value display
- `.tale-progress-bar__track` — Background rail
- `.tale-progress-bar__indicator` — Filled bar (`data-indeterminate` attribute set when no value)

## Pitfalls

<!-- cross-pitfall-ref: minvalue-maxvalue-not-min-max -->
<!-- cross-pitfall-ref: meter-progress-value-needs-children -->
<!-- cross-pitfall-ref: meter-progress-indicator-needs-value -->
<!-- cross-pitfall-ref: meter-progress-no-output-sub-part -->

## Notes

- Built on React Aria `ProgressBar`.
- `ProgressBar.Indicator` computes width as a percentage from its own `value`, `min`, and `max` props.
- For indeterminate state, pass `isIndeterminate` on `Root` and omit `value` on `Indicator`. The indicator receives a `data-indeterminate` attribute for CSS animation targeting.
- For floating label positions (`top-floating`, `bottom-floating`), the `Value` is positioned absolutely relative to `Root` using the fill percentage. Floating tooltips are hidden when the bar is indeterminate. The `Header` wrapper uses `display: contents` in non-top layouts so Label and Value participate directly in Root's flex flow.
