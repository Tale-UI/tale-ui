# Meter

`import { Meter } from '@tale-ui/react/meter';`

A horizontal bar representing a scalar measurement within a known range (e.g. storage usage, signal strength).

## Parts

| Part | Description |
|------|-------------|
| `Meter.Root` | Wrapper managing value and ARIA semantics |
| `Meter.Header` | Flex row wrapper for Label + Value |
| `Meter.Label` | Accessible text label |
| `Meter.Value` | Displays the current value (e.g. "60%"); `aria-hidden` |
| `Meter.Track` | Background rail |
| `Meter.Indicator` | Filled portion sized by `value`, `min`, and `max` |

## Props

### Root

No Tale UI-specific props beyond React Aria's `Meter` props (`value`, `minValue`, `maxValue`, etc.).

Also accepts all React Aria `Meter` props.

### Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | The current value |
| `min` | `number` | `0` | The minimum value |
| `max` | `number` | `100` | The maximum value |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<Meter.Root value={60} minValue={0} maxValue={100}>
  <Meter.Track>
    <Meter.Indicator value={60} />
  </Meter.Track>
</Meter.Root>
```

## Examples

### With Label and Value

```tsx
<Meter.Root value={60} minValue={0} maxValue={100}>
  <Meter.Header>
    <Meter.Label>Storage</Meter.Label>
    <Meter.Value>60%</Meter.Value>
  </Meter.Header>
  <Meter.Track>
    <Meter.Indicator value={60} />
  </Meter.Track>
</Meter.Root>
```

### Multiple Values

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
  {[10, 40, 70, 90].map((value) => (
    <Meter.Root key={value} value={value} minValue={0} maxValue={100}>
      <Meter.Header>
        <Meter.Label>Usage</Meter.Label>
        <Meter.Value>{value}%</Meter.Value>
      </Meter.Header>
      <Meter.Track>
        <Meter.Indicator value={value} />
      </Meter.Track>
    </Meter.Root>
  ))}
</div>
```

## CSS Classes

- `.tale-meter` — Root container
- `.tale-meter__header` — Header row (Label + Value)
- `.tale-meter__label` — Label text
- `.tale-meter__value` — Value display
- `.tale-meter__track` — Background rail
- `.tale-meter__indicator` — Filled bar

## Pitfalls

<!-- cross-pitfall-ref: minvalue-maxvalue-not-min-max -->
<!-- cross-pitfall-ref: meter-progress-value-needs-children -->
<!-- cross-pitfall-ref: meter-progress-indicator-needs-value -->
<!-- cross-pitfall-ref: meter-progress-no-output-sub-part -->

## Notes

- Built on React Aria `Meter`.
- `Meter.Indicator` computes width from its own `value`, `min`, and `max` props rather than reading those values from `Meter.Root`.
- Meter differs from ProgressBar semantically: use Meter for measurements within a known range (disk usage, battery level), and ProgressBar for task completion.
