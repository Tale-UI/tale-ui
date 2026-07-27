import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from '@tale-ui/charts/bar-chart';
import '@tale-ui/charts/chart.css';

const monthlyData = [
  { month: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { month: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
  { month: 'Mar', revenue: 5000, profit: 3200, expenses: 1800 },
  { month: 'Apr', revenue: 4500, profit: 2800, expenses: 1700 },
  { month: 'May', revenue: 6000, profit: 3900, expenses: 2100 },
  { month: 'Jun', revenue: 5500, profit: 3500, expenses: 2000 },
];

type Args = {
  data: Record<string, unknown>[];
  width: number;
  height: number;
  palette: string[];
  dataKey: string;
  maxBarSize: number;
};

const meta: Meta<Args> = {
  title: 'Charts/BarChart',
  parameters: { layout: 'centered' },
  argTypes: {
    data: { control: 'object' },
    width: { control: { type: 'number', min: 240, step: 20 } },
    height: { control: { type: 'number', min: 160, step: 20 } },
    palette: { control: 'object' },
    dataKey: { control: 'select', options: ['revenue', 'profit', 'expenses'] },
    maxBarSize: { control: { type: 'number', min: 4, max: 120, step: 4 } },
  },
  args: {
    data: monthlyData,
    width: 600,
    height: 300,
    palette: ['#087e8b', '#ff5a5f', '#f5b700'],
    dataKey: 'revenue',
    maxBarSize: 48,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <BarChart.Root
        data={args.data}
        width={args.width}
        height={args.height}
        palette={args.palette}
      >
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        <BarChart.YAxis />
        <BarChart.Tooltip />
        <BarChart.Bar dataKey={args.dataKey} maxBarSize={args.maxBarSize} />
      </BarChart.Root>
    );
  },
};

export const MultipleSeries: Story = {
  render() {
    return (
      <BarChart.Root data={monthlyData} width={600} height={300}>
        <BarChart.Grid strokeDasharray="3 3" />
        <BarChart.XAxis dataKey="month" />
        <BarChart.YAxis />
        <BarChart.Tooltip />
        <BarChart.Legend />
        <BarChart.Bar dataKey="revenue" />
        <BarChart.Bar dataKey="profit" />
        <BarChart.Bar dataKey="expenses" />
      </BarChart.Root>
    );
  },
};

export const CustomPalette: Story = {
  render() {
    return (
      <BarChart.Root
        data={monthlyData}
        width={600}
        height={300}
        palette={['#3b82f6', '#10b981', '#f59e0b']}
      >
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        <BarChart.YAxis />
        <BarChart.Tooltip />
        <BarChart.Legend />
        <BarChart.Bar dataKey="revenue" />
        <BarChart.Bar dataKey="profit" />
        <BarChart.Bar dataKey="expenses" />
      </BarChart.Root>
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
          <BarChart.Root data={monthlyData} width={600} height={250}>
            <BarChart.Grid />
            <BarChart.XAxis dataKey="month" />
            <BarChart.YAxis />
            <BarChart.Tooltip />
            <BarChart.Bar dataKey="revenue" />
          </BarChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Multiple Series</span>
          <BarChart.Root data={monthlyData} width={600} height={250}>
            <BarChart.Grid strokeDasharray="3 3" />
            <BarChart.XAxis dataKey="month" />
            <BarChart.YAxis />
            <BarChart.Tooltip />
            <BarChart.Legend />
            <BarChart.Bar dataKey="revenue" />
            <BarChart.Bar dataKey="profit" />
            <BarChart.Bar dataKey="expenses" />
          </BarChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Custom Palette</span>
          <BarChart.Root
            data={monthlyData}
            width={600}
            height={250}
            palette={['#3b82f6', '#10b981', '#f59e0b']}
          >
            <BarChart.Grid />
            <BarChart.XAxis dataKey="month" />
            <BarChart.YAxis />
            <BarChart.Tooltip />
            <BarChart.Legend />
            <BarChart.Bar dataKey="revenue" />
            <BarChart.Bar dataKey="profit" />
            <BarChart.Bar dataKey="expenses" />
          </BarChart.Root>
        </div>
      </div>
    );
  },
};
