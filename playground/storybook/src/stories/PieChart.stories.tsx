import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChart } from '@tale-ui/charts/pie-chart';
import '@tale-ui/charts/chart.css';

const channelData = [
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
  dataKey: string;
  nameKey: string;
  innerRadius: number;
  outerRadius: number;
  paddingAngle: number;
};

const meta: Meta<Args> = {
  title: 'Charts/PieChart',
  parameters: { layout: 'centered' },
  argTypes: {
    data: { control: 'object' },
    width: { control: { type: 'number', min: 240, step: 20 } },
    height: { control: { type: 'number', min: 160, step: 20 } },
    palette: { control: 'object' },
    dataKey: { control: 'text' },
    nameKey: { control: 'text' },
    innerRadius: { control: { type: 'number', min: 0, step: 5 } },
    outerRadius: { control: { type: 'number', min: 10, step: 5 } },
    paddingAngle: { control: { type: 'range', min: 0, max: 20, step: 1 } },
  },
  args: {
    data: channelData,
    width: 600,
    height: 300,
    palette: ['#087e8b', '#ff5a5f', '#f5b700', '#7a5195'],
    dataKey: 'value',
    nameKey: 'name',
    innerRadius: 0,
    outerRadius: 80,
    paddingAngle: 2,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <PieChart.Root
        data={args.data}
        width={args.width}
        height={args.height}
        palette={args.palette}
      >
        <PieChart.Pie
          dataKey={args.dataKey}
          nameKey={args.nameKey}
          innerRadius={args.innerRadius}
          outerRadius={args.outerRadius}
          paddingAngle={args.paddingAngle}
        />
        <PieChart.Tooltip />
        <PieChart.Legend />
      </PieChart.Root>
    );
  },
};

export const Donut: Story = {
  render() {
    return (
      <PieChart.Root width={600} height={300}>
        <PieChart.Pie
          data={channelData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
        />
        <PieChart.Tooltip />
        <PieChart.Legend />
      </PieChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default Pie</span>
          <PieChart.Root width={600} height={250}>
            <PieChart.Pie data={channelData} dataKey="value" nameKey="name" />
            <PieChart.Tooltip />
            <PieChart.Legend />
          </PieChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Donut</span>
          <PieChart.Root width={600} height={250}>
            <PieChart.Pie
              data={channelData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
            />
            <PieChart.Tooltip />
            <PieChart.Legend />
          </PieChart.Root>
        </div>
      </div>
    );
  },
};
