import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadarChart } from '@tale-ui/charts/radar-chart';
import '@tale-ui/charts/chart.css';

const radarData = [
  { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
  { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Comfort', A: 86, B: 130, fullMark: 150 },
  { subject: 'Safety', A: 99, B: 100, fullMark: 150 },
  { subject: 'Efficiency', A: 85, B: 90, fullMark: 150 },
];

type Args = {
  data: Record<string, unknown>[];
  width: number;
  height: number;
  palette: string[];
  dataKey: string;
  angleKey: string;
  fillOpacity: number;
  strokeWidth: number;
};

const meta: Meta<Args> = {
  title: 'Charts/RadarChart',
  parameters: { layout: 'centered' },
  argTypes: {
    data: { control: 'object' },
    width: { control: { type: 'number', min: 240, step: 20 } },
    height: { control: { type: 'number', min: 200, step: 20 } },
    palette: { control: 'object' },
    dataKey: { control: 'select', options: ['A', 'B'] },
    angleKey: { control: 'text' },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 1 } },
  },
  args: {
    data: radarData,
    width: 600,
    height: 400,
    palette: ['#087e8b', '#ff5a5f'],
    dataKey: 'A',
    angleKey: 'subject',
    fillOpacity: 0.2,
    strokeWidth: 2,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <RadarChart.Root
        data={args.data}
        width={args.width}
        height={args.height}
        palette={args.palette}
      >
        <RadarChart.PolarGrid />
        <RadarChart.PolarAngleAxis dataKey={args.angleKey} />
        <RadarChart.Tooltip />
        <RadarChart.Legend />
        <RadarChart.Radar
          dataKey={args.dataKey}
          fillOpacity={args.fillOpacity}
          strokeWidth={args.strokeWidth}
        />
      </RadarChart.Root>
    );
  },
};

export const SingleSeries: Story = {
  render() {
    return (
      <RadarChart.Root data={radarData} width={600} height={400}>
        <RadarChart.PolarGrid />
        <RadarChart.PolarAngleAxis dataKey="subject" />
        <RadarChart.PolarRadiusAxis />
        <RadarChart.Tooltip />
        <RadarChart.Radar dataKey="A" />
      </RadarChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Multiple Series</span>
          <RadarChart.Root data={radarData} width={600} height={350}>
            <RadarChart.PolarGrid />
            <RadarChart.PolarAngleAxis dataKey="subject" />
            <RadarChart.Tooltip />
            <RadarChart.Legend />
            <RadarChart.Radar dataKey="A" />
            <RadarChart.Radar dataKey="B" />
          </RadarChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Single Series</span>
          <RadarChart.Root data={radarData} width={600} height={350}>
            <RadarChart.PolarGrid />
            <RadarChart.PolarAngleAxis dataKey="subject" />
            <RadarChart.PolarRadiusAxis />
            <RadarChart.Tooltip />
            <RadarChart.Radar dataKey="A" />
          </RadarChart.Root>
        </div>
      </div>
    );
  },
};
