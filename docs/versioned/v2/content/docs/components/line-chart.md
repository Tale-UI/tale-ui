# LineChart

`import { LineChart } from '@tale-ui/charts/line-chart';`

A line chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `LineChart.Root` | Container wrapping Recharts `LineChart`. Accepts `data`, `width`, `height`, `palette`. |
| `LineChart.Line` | A line series. Accepts `dataKey`. |
| `LineChart.XAxis` | Horizontal axis. Accepts `dataKey` and Recharts XAxis props. |
| `LineChart.YAxis` | Vertical axis. |
| `LineChart.Grid` | Cartesian grid lines. |
| `LineChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `LineChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array (required) |
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom series colours |

### Line

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Data key to plot (required) |
| `stroke` | `string` | Auto from palette | Line stroke colour |
| `strokeWidth` | `number` | `2` | Line thickness in pixels |
| `dot` | `boolean` | `false` | Whether to show data point dots |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
<LineChart.Root data={data} width={600} height={300}>
  <LineChart.Grid />
  <LineChart.XAxis dataKey="month" />
  <LineChart.YAxis />
  <LineChart.Tooltip />
  <LineChart.Line dataKey="revenue" />
</LineChart.Root>
```

## Examples

### Multiple Series

```tsx
<LineChart.Root data={data} width={600} height={300}>
  <LineChart.Grid strokeDasharray="3 3" />
  <LineChart.XAxis dataKey="month" />
  <LineChart.YAxis />
  <LineChart.Tooltip />
  <LineChart.Legend />
  <LineChart.Line dataKey="revenue" />
  <LineChart.Line dataKey="profit" />
</LineChart.Root>
```

### With Dots and Custom Stroke

```tsx
<LineChart.Root data={data} width={600} height={300}>
  <LineChart.Grid />
  <LineChart.XAxis dataKey="month" />
  <LineChart.YAxis />
  <LineChart.Tooltip />
  <LineChart.Line dataKey="revenue" stroke="var(--color-50)" strokeWidth={3} dot />
</LineChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={300}>
  <LineChart.Root data={data}>
    <LineChart.Grid />
    <LineChart.XAxis dataKey="month" />
    <LineChart.YAxis />
    <LineChart.Line dataKey="revenue" />
  </LineChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--line` — Line chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Series colours are auto-assigned from the palette. Override per-Line with `stroke`.
- Lines default to `strokeWidth={2}` and `dot={false}` for a clean appearance.
- All Tale UI design tokens are used for grid, axis, tooltip styling — dark mode works automatically.

## Pitfalls

<!-- pitfall: use-linechart-for-any-prompt -->
- **Use `LineChart` for any prompt that asks for a line chart, trend chart, or time-series chart** — when the request explicitly asks for a line chart, render `LineChart.Root` with at least one `LineChart.Line`; if the prompt asks for a grid, axes, or a tooltip, include `LineChart.Grid`, `LineChart.XAxis`, `LineChart.YAxis`, and `LineChart.Tooltip` instead of leaving the file blank or substituting another chart type.
  - anti-pattern: `// empty file`
  - anti-pattern: `<BarChart.Root data={data}><BarChart.Bar dataKey="visitors" /></BarChart.Root>`
  - fix: `<LineChart.Root data={data} width={600} height={300}><LineChart.Grid /><LineChart.XAxis dataKey="week" /><LineChart.YAxis /><LineChart.Tooltip /><LineChart.Line dataKey="visitors" /></LineChart.Root>`
