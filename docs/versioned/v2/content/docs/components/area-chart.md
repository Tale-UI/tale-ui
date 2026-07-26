# AreaChart

`import { AreaChart } from '@tale-ui/charts/area-chart';`

An area chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `AreaChart.Root` | Container wrapping Recharts `AreaChart`. Accepts `data`, `width`, `height`, `palette`. |
| `AreaChart.Area` | An area series. Accepts `dataKey`. |
| `AreaChart.XAxis` | Horizontal axis. Accepts `dataKey` and Recharts XAxis props. |
| `AreaChart.YAxis` | Vertical axis. |
| `AreaChart.Grid` | Cartesian grid lines. |
| `AreaChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `AreaChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array (required) |
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom series colours |

### Area

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Data key to plot (required) |
| `stroke` | `string` | Auto from palette | Area stroke colour |
| `fill` | `string` | Auto from palette | Area fill colour |
| `fillOpacity` | `number` | `0.15` | Fill transparency (0–1) |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
<AreaChart.Root data={data} width={600} height={300}>
  <AreaChart.Grid />
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Tooltip />
  <AreaChart.Area dataKey="revenue" />
</AreaChart.Root>
```

## Examples

### Multiple Series

```tsx
<AreaChart.Root data={data} width={600} height={300}>
  <AreaChart.Grid strokeDasharray="3 3" />
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Tooltip />
  <AreaChart.Legend />
  <AreaChart.Area dataKey="revenue" />
  <AreaChart.Area dataKey="profit" />
</AreaChart.Root>
```

### Custom Fill Opacity

```tsx
<AreaChart.Root data={data} width={600} height={300}>
  <AreaChart.Grid />
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Tooltip />
  <AreaChart.Area dataKey="revenue" fillOpacity={0.3} />
</AreaChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={300}>
  <AreaChart.Root data={data}>
    <AreaChart.Grid />
    <AreaChart.XAxis dataKey="month" />
    <AreaChart.YAxis />
    <AreaChart.Area dataKey="revenue" />
  </AreaChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--area` — Area chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Series colours are auto-assigned from the palette. Override per-Area with `stroke` and `fill`.
- Areas default to `fillOpacity={0.15}` for a subtle shaded effect beneath the line.
- All Tale UI design tokens are used for grid, axis, tooltip styling — dark mode works automatically.

## Pitfalls

<!-- pitfall: areachart-has-no-cartesiangrid-xaxis -->
- **AreaChart exposes only `Root`, `Area`, `Tooltip` sub-parts — never use `CartesianGrid`, `XAxis`, or `YAxis` members** — using `AreaChart.CartesianGrid`, `AreaChart.XAxis`, or `AreaChart.YAxis` causes `Property 'CartesianGrid' does not exist` TypeScript errors because these recharts-style children are not exposed on the AreaChart namespace. Grid and axis display are built-in to `AreaChart.Root`; pass `showGrid`, `showXAxis`, and `showYAxis` as boolean props on `AreaChart.Root` to enable them.
  - anti-pattern: `<AreaChart.CartesianGrid strokeDasharray="3 3" />`
  - anti-pattern: `<AreaChart.XAxis dataKey="month" />`
  - anti-pattern: `<AreaChart.YAxis />`
  - fix: `<AreaChart.Root data={data} showGrid showXAxis showYAxis>`
  - fix: `<AreaChart.Area dataKey="revenue" />`
  - fix: `<AreaChart.Tooltip />`
<!-- pitfall: areachartroot-does-not-accept-data -->
- **AreaChart.Root does not accept `showGrid`, `showXAxis`, or `showYAxis` props — keep `data` on `AreaChart.Root` only** — `data`, `showGrid`, `showXAxis`, and `showYAxis` are not part of `RootProps`; passing them on `AreaChart.Root` causes `Type '{ children: Element[]; data: ...; showGrid: true; ... }' is not assignable to type 'IntrinsicAttributes & RootProps'`. Pass `data` to `AreaChart.Area` and use `AreaChart.Grid`, `AreaChart.XAxis`, and `AreaChart.YAxis` as explicit child components inside `AreaChart.Root`.
  - anti-pattern: `<AreaChart.Root data={data} showGrid showXAxis showYAxis>`
  - fix: `<AreaChart.Root><AreaChart.Grid /><AreaChart.XAxis dataKey="month" /><AreaChart.YAxis /><AreaChart.Area data={data} dataKey="revenue" /><AreaChart.Tooltip /></AreaChart.Root>`
<!-- pitfall: data-prop-belongs-on-areachartroot -->
- **data prop belongs on AreaChart.Root, not on AreaChart.Area** — `AreaChart.Root` requires `data` as a required prop; passing `data` to `AreaChart.Area` instead causes `Property 'data' is missing in type '{ children: Element[]; }' but required in type 'RootProps'`.
  - anti-pattern: `<AreaChart.Root><AreaChart.Area data={data} dataKey="revenue" /></AreaChart.Root>`
  - fix: `<AreaChart.Root data={data}><AreaChart.Area dataKey="revenue" /></AreaChart.Root>`
