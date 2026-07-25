# PieChart

`import { PieChart } from '@tale-ui/charts/pie-chart';`

A pie chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `PieChart.Root` | Container wrapping Recharts `PieChart`. Accepts `width`, `height`, `palette`. |
| `PieChart.Pie` | A pie series. Accepts `data`, `dataKey`, `nameKey`. |
| `PieChart.Cell` | Individual slice styling. Auto-generated from palette unless manually specified. |
| `PieChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `PieChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom slice colours |

### Pie

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Pie data array (required) |
| `dataKey` | `string` | — | Numeric value key (required) |
| `nameKey` | `string` | `'name'` | Label key for legend/tooltip |
| `innerRadius` | `number` | `0` | Inner radius (set > 0 for donut) |
| `outerRadius` | `number` | `80` | Outer radius |
| `paddingAngle` | `number` | `2` | Angle between slices in degrees |

### Cell

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fill` | `string` | Auto from palette | Slice fill colour |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
const data = [
  { name: 'Direct', value: 400 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Social', value: 100 },
];

<PieChart.Root width={400} height={300}>
  <PieChart.Pie data={data} dataKey="value" nameKey="name" />
  <PieChart.Tooltip />
  <PieChart.Legend />
</PieChart.Root>
```

## Examples

### Donut Chart

```tsx
<PieChart.Root width={400} height={300}>
  <PieChart.Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} />
  <PieChart.Tooltip />
  <PieChart.Legend />
</PieChart.Root>
```

### Custom Slice Colours

```tsx
<PieChart.Root width={400} height={300} palette={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50']}>
  <PieChart.Pie data={data} dataKey="value" nameKey="name" />
  <PieChart.Tooltip />
</PieChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={300}>
  <PieChart.Root>
    <PieChart.Pie data={data} dataKey="value" nameKey="name" />
    <PieChart.Tooltip />
    <PieChart.Legend />
  </PieChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--pie` — Pie chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Slice colours are auto-assigned from the palette. Override with `palette` on Root or `fill` on individual `Cell` elements.
- `Cell` elements are auto-generated for each data entry when not manually specified.
- Set `innerRadius` > 0 to create a donut chart.
- Default `paddingAngle={2}` adds a small gap between slices for visual clarity.
- All Tale UI design tokens are used for tooltip styling — dark mode works automatically.

## Pitfalls

<!-- pitfall: use-piechart-for-any-prompt -->
<!-- pitfall: use-piechart-for-any-prompt -->
- **Use `PieChart` for any prompt that asks for a pie chart, donut chart, or traffic-source breakdown** — when the request explicitly asks for a pie chart, render `PieChart.Root` with `PieChart.Pie`; if the prompt asks for a legend or tooltip, include `PieChart.Legend` and `PieChart.Tooltip` instead of leaving the file blank or substituting another chart type.
  - anti-pattern: `// empty file`
  - anti-pattern: `<BarChart.Root data={data}><BarChart.Bar dataKey="value" /></BarChart.Root>`
  - fix: `<PieChart.Root width={400} height={300}><PieChart.Pie data={data} dataKey="value" nameKey="name" /><PieChart.Tooltip /><PieChart.Legend /></PieChart.Root>`
