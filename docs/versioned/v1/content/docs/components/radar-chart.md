# RadarChart

`import { RadarChart } from '@tale-ui/charts/radar-chart';`

A radar chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `RadarChart.Root` | Container wrapping Recharts `RadarChart`. Accepts `data`, `width`, `height`, `palette`. |
| `RadarChart.Radar` | A radar series. Accepts `dataKey`. |
| `RadarChart.PolarGrid` | Concentric grid lines. |
| `RadarChart.PolarAngleAxis` | Angular axis labels. Accepts `dataKey` for category names. |
| `RadarChart.PolarRadiusAxis` | Radial value axis. |
| `RadarChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `RadarChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array (required) |
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom series colours |

### Radar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Data key to plot (required) |
| `stroke` | `string` | Auto from palette | Radar stroke colour |
| `fill` | `string` | Auto from palette | Radar fill colour |
| `fillOpacity` | `number` | `0.15` | Fill transparency (0–1) |

### PolarAngleAxis

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Category label key (required) |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
const data = [
  { subject: 'Math', score: 80 },
  { subject: 'Science', score: 90 },
  { subject: 'English', score: 70 },
  { subject: 'History', score: 65 },
  { subject: 'Art', score: 85 },
];

<RadarChart.Root data={data} width={500} height={400}>
  <RadarChart.PolarGrid />
  <RadarChart.PolarAngleAxis dataKey="subject" />
  <RadarChart.PolarRadiusAxis />
  <RadarChart.Tooltip />
  <RadarChart.Radar dataKey="score" />
</RadarChart.Root>
```

## Examples

### Multiple Series

```tsx
const data = [
  { subject: 'Math', alice: 80, bob: 70 },
  { subject: 'Science', alice: 90, bob: 85 },
  { subject: 'English', alice: 70, bob: 90 },
  { subject: 'History', alice: 65, bob: 75 },
  { subject: 'Art', alice: 85, bob: 60 },
];

<RadarChart.Root data={data} width={500} height={400}>
  <RadarChart.PolarGrid />
  <RadarChart.PolarAngleAxis dataKey="subject" />
  <RadarChart.PolarRadiusAxis />
  <RadarChart.Tooltip />
  <RadarChart.Legend />
  <RadarChart.Radar dataKey="alice" />
  <RadarChart.Radar dataKey="bob" />
</RadarChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={400}>
  <RadarChart.Root data={data}>
    <RadarChart.PolarGrid />
    <RadarChart.PolarAngleAxis dataKey="subject" />
    <RadarChart.Radar dataKey="score" />
  </RadarChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--radar` — Radar chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Series colours are auto-assigned from the palette. Override per-Radar with `stroke` and `fill`.
- Radar areas default to `fillOpacity={0.15}` for a subtle shaded effect.
- `PolarAngleAxis` labels the spokes; `PolarRadiusAxis` labels the concentric rings.
- All Tale UI design tokens are used for grid, axis, tooltip styling — dark mode works automatically.

## Pitfalls
