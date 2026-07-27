import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@tale-ui/charts/line-chart';
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
  type: 'basis' | 'linear' | 'monotone' | 'step';
  strokeWidth: number;
};

const meta: Meta<Args> = {
  title: 'Charts/LineChart',
  parameters: { layout: 'centered' },
  argTypes: {
    data: { control: 'object' },
    width: { control: { type: 'number', min: 240, step: 20 } },
    height: { control: { type: 'number', min: 160, step: 20 } },
    palette: { control: 'object' },
    dataKey: { control: 'select', options: ['revenue', 'profit'] },
    type: { control: 'select', options: ['basis', 'linear', 'monotone', 'step'] },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 1 } },
  },
  args: {
    data: monthlyData,
    width: 600,
    height: 300,
    palette: ['#087e8b', '#ff5a5f'],
    dataKey: 'revenue',
    type: 'monotone',
    strokeWidth: 2,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <LineChart.Root
        data={args.data}
        width={args.width}
        height={args.height}
        palette={args.palette}
      >
        <LineChart.Grid />
        <LineChart.XAxis dataKey="month" />
        <LineChart.YAxis />
        <LineChart.Tooltip />
        <LineChart.Line dataKey={args.dataKey} type={args.type} strokeWidth={args.strokeWidth} />
      </LineChart.Root>
    );
  },
};

export const MultipleSeries: Story = {
  render() {
    return (
      <LineChart.Root data={monthlyData} width={600} height={300}>
        <LineChart.Grid strokeDasharray="3 3" />
        <LineChart.XAxis dataKey="month" />
        <LineChart.YAxis />
        <LineChart.Tooltip />
        <LineChart.Legend />
        <LineChart.Line dataKey="revenue" />
        <LineChart.Line dataKey="profit" />
      </LineChart.Root>
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
          <LineChart.Root data={monthlyData} width={600} height={250}>
            <LineChart.Grid />
            <LineChart.XAxis dataKey="month" />
            <LineChart.YAxis />
            <LineChart.Tooltip />
            <LineChart.Line dataKey="revenue" />
          </LineChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Multiple Series</span>
          <LineChart.Root data={monthlyData} width={600} height={250}>
            <LineChart.Grid strokeDasharray="3 3" />
            <LineChart.XAxis dataKey="month" />
            <LineChart.YAxis />
            <LineChart.Tooltip />
            <LineChart.Legend />
            <LineChart.Line dataKey="revenue" />
            <LineChart.Line dataKey="profit" />
          </LineChart.Root>
        </div>
      </div>
    );
  },
};
