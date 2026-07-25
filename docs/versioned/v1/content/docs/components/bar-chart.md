# BarChart

`import { BarChart } from '@tale-ui/charts/bar-chart';`

A bar chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `BarChart.Root` | Container wrapping Recharts `BarChart`. Accepts `data`, `width`, `height`, `palette`. |
| `BarChart.Bar` | A bar series. Accepts `dataKey`. |
| `BarChart.XAxis` | Horizontal axis. Accepts `dataKey` and Recharts XAxis props. |
| `BarChart.YAxis` | Vertical axis. |
| `BarChart.Grid` | Cartesian grid lines. |
| `BarChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `BarChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array (required) |
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom series colours |

### Bar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Data key to plot (required) |
| `fill` | `string` | Auto from palette | Bar fill colour |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
<BarChart.Root data={data} width={600} height={300}>
  <BarChart.Grid />
  <BarChart.XAxis dataKey="month" />
  <BarChart.YAxis />
  <BarChart.Tooltip />
  <BarChart.Bar dataKey="revenue" />
</BarChart.Root>
```

## Examples

### Multiple Series

```tsx
<BarChart.Root data={data} width={600} height={300}>
  <BarChart.Grid strokeDasharray="3 3" />
  <BarChart.XAxis dataKey="month" />
  <BarChart.YAxis />
  <BarChart.Tooltip />
  <BarChart.Legend />
  <BarChart.Bar dataKey="revenue" />
  <BarChart.Bar dataKey="profit" />
</BarChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={300}>
  <BarChart.Root data={data}>
    <BarChart.Grid />
    <BarChart.XAxis dataKey="month" />
    <BarChart.YAxis />
    <BarChart.Bar dataKey="revenue" />
  </BarChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--bar` — Bar chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Series colours are auto-assigned from the palette. Override per-Bar with `fill`.
- Bars have rounded top corners by default (`radius={[4, 4, 0, 0]}`).
- All Tale UI design tokens are used for grid, axis, tooltip styling — dark mode works automatically.

## Pitfalls

<!-- pitfall: do-not-import-taleuichartsstyles-chart -->
- **Do not import `@tale-ui/charts/styles` — chart styles are bundled automatically** — there is no separate styles entry point; adding this side-effect import causes `Cannot find module '@tale-ui/charts/styles'` TypeScript errors.
  - anti-pattern: `import '@tale-ui/charts/styles'`
  - fix: `import { BarChart } from '@tale-ui/charts/bar-chart'`
