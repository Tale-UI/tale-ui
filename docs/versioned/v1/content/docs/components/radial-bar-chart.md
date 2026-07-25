# RadialBarChart

`import { RadialBarChart } from '@tale-ui/charts/radial-bar-chart';`

A radial bar chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `RadialBarChart.Root` | Container wrapping Recharts `RadialBarChart`. Accepts `data`, `width`, `height`, `palette`. |
| `RadialBarChart.RadialBar` | The radial bar series. Accepts `dataKey`. |
| `RadialBarChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `RadialBarChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array (required) |
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom bar colours |
| `innerRadius` | `number \| string` | `'10%'` | Inner radius of the chart |
| `outerRadius` | `number \| string` | `'80%'` | Outer radius of the chart |

### RadialBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Numeric value key (required) |
| `fill` | `string` | Auto from palette | Bar fill colour |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
const data = [
  { name: 'Q1', value: 80, fill: 'var(--color-50)' },
  { name: 'Q2', value: 60, fill: 'var(--color-40)' },
  { name: 'Q3', value: 90, fill: 'var(--color-60)' },
  { name: 'Q4', value: 70, fill: 'var(--color-30)' },
];

<RadialBarChart.Root data={data} width={400} height={300}>
  <RadialBarChart.RadialBar dataKey="value" />
  <RadialBarChart.Tooltip />
  <RadialBarChart.Legend />
</RadialBarChart.Root>
```

## Examples

### With Palette Colours

```tsx
<RadialBarChart.Root data={data} width={400} height={300} palette={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50']}>
  <RadialBarChart.RadialBar dataKey="value" />
  <RadialBarChart.Tooltip />
  <RadialBarChart.Legend />
</RadialBarChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={300}>
  <RadialBarChart.Root data={data}>
    <RadialBarChart.RadialBar dataKey="value" />
    <RadialBarChart.Tooltip />
    <RadialBarChart.Legend />
  </RadialBarChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--radial-bar` — Radial bar chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Bar colours can be set via `palette` on Root, `fill` on RadialBar, or `fill` on each data entry.
- The simplest chart type — no axes or grid needed.
- All Tale UI design tokens are used for tooltip styling — dark mode works automatically.

## Pitfalls
