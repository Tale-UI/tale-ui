import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart } from '@tale-ui/charts/area-chart';
import '@tale-ui/charts/chart.css';

const monthlyData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 5000, profit: 3200 },
  { month: 'Apr', revenue: 4500, profit: 2800 },
  { month: 'May', revenue: 6000, profit: 3900 },
  { month: 'Jun', revenue: 5500, profit: 3500 },
];

type Args = {
  data: Record<string, unknown>[];
  width: number;
  height: number;
  palette: string[];
  dataKey: string;
  fillOpacity: number;
  strokeWidth: number;
};

const meta: Meta<Args> = {
  title: 'Charts/AreaChart',
  parameters: { layout: 'centered' },
  argTypes: {
    data: { control: 'object' },
    width: { control: { type: 'number', min: 240, step: 20 } },
    height: { control: { type: 'number', min: 160, step: 20 } },
    palette: { control: 'object' },
    dataKey: { control: 'select', options: ['revenue', 'profit'] },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 1 } },
  },
  args: {
    data: monthlyData,
    width: 600,
    height: 300,
    palette: ['#087e8b', '#ff5a5f'],
    dataKey: 'revenue',
    fillOpacity: 0.15,
    strokeWidth: 2,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <AreaChart.Root
        data={args.data}
        width={args.width}
        height={args.height}
        palette={args.palette}
      >
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.YAxis />
        <AreaChart.Tooltip />
        <AreaChart.Area
          dataKey={args.dataKey}
          fillOpacity={args.fillOpacity}
          strokeWidth={args.strokeWidth}
        />
      </AreaChart.Root>
    );
  },
};

export const MultipleSeries: Story = {
  render() {
    return (
      <AreaChart.Root data={monthlyData} width={600} height={300}>
        <AreaChart.Grid strokeDasharray="3 3" />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.YAxis />
        <AreaChart.Tooltip />
        <AreaChart.Legend />
        <AreaChart.Area dataKey="revenue" />
        <AreaChart.Area dataKey="profit" />
      </AreaChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Single Series</span>
          <AreaChart.Root data={monthlyData} width={600} height={250}>
            <AreaChart.Grid />
            <AreaChart.XAxis dataKey="month" />
            <AreaChart.YAxis />
            <AreaChart.Tooltip />
            <AreaChart.Area dataKey="revenue" />
          </AreaChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Multiple Series</span>
          <AreaChart.Root data={monthlyData} width={600} height={250}>
            <AreaChart.Grid strokeDasharray="3 3" />
            <AreaChart.XAxis dataKey="month" />
            <AreaChart.YAxis />
            <AreaChart.Tooltip />
            <AreaChart.Legend />
            <AreaChart.Area dataKey="revenue" />
            <AreaChart.Area dataKey="profit" />
          </AreaChart.Root>
        </div>
      </div>
    );
  },
};
