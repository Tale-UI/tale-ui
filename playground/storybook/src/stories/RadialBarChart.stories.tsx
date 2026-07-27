import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadialBarChart } from '@tale-ui/charts/radial-bar-chart';
import '@tale-ui/charts/chart.css';

const data = [
  { name: 'Direct', value: 400 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Social', value: 100 },
];

type Args = {
  data: Record<string, unknown>[];
  width: number;
  height: number;
  palette: string[];
  innerRadius: number;
  outerRadius: number;
  dataKey: string;
  cornerRadius: number;
};

const meta: Meta<Args> = {
  title: 'Charts/RadialBarChart',
  parameters: { layout: 'centered' },
  argTypes: {
    data: { control: 'object' },
    width: { control: { type: 'number', min: 240, step: 20 } },
    height: { control: { type: 'number', min: 200, step: 20 } },
    palette: { control: 'object' },
    innerRadius: { control: { type: 'number', min: 0, step: 5 } },
    outerRadius: { control: { type: 'number', min: 10, step: 5 } },
    dataKey: { control: 'text' },
    cornerRadius: { control: { type: 'number', min: 0, max: 30, step: 1 } },
  },
  args: {
    data,
    width: 600,
    height: 400,
    palette: ['#087e8b', '#ff5a5f', '#f5b700', '#7a5195'],
    innerRadius: 20,
    outerRadius: 90,
    dataKey: 'value',
    cornerRadius: 4,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <RadialBarChart.Root
        data={args.data}
        width={args.width}
        height={args.height}
        palette={args.palette}
        innerRadius={args.innerRadius}
        outerRadius={args.outerRadius}
      >
        <RadialBarChart.RadialBar dataKey={args.dataKey} cornerRadius={args.cornerRadius} />
        <RadialBarChart.Tooltip />
        <RadialBarChart.Legend />
      </RadialBarChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default</span>
          <RadialBarChart.Root data={data} width={600} height={350}>
            <RadialBarChart.RadialBar dataKey="value" />
            <RadialBarChart.Tooltip />
            <RadialBarChart.Legend />
          </RadialBarChart.Root>
        </div>
      </div>
    );
  },
};
