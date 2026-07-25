import { BarChart } from '@tale-ui/charts/bar-chart';
import { LineChart } from '@tale-ui/charts/line-chart';
import { PieChart } from '@tale-ui/charts/pie-chart';
import { ChartContainer } from '@tale-ui/charts';
import { Text } from '@tale-ui/react/text';

const monthlyData = [
  { month: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { month: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
  { month: 'Mar', revenue: 5000, profit: 3200, expenses: 1800 },
  { month: 'Apr', revenue: 4500, profit: 2800, expenses: 1700 },
  { month: 'May', revenue: 6000, profit: 3900, expenses: 2100 },
  { month: 'Jun', revenue: 5500, profit: 3500, expenses: 2000 },
];

const channelData = [
  { name: 'Direct', value: 400 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Social', value: 100 },
];

export function Example() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-l)' }}>
      {/* Revenue trend */}
      <div>
        <Text as="h3" variant="heading" size="s">
          Revenue Trend
        </Text>
        <ChartContainer height={300}>
          <LineChart.Root data={monthlyData}>
            <LineChart.Grid />
            <LineChart.XAxis dataKey="month" />
            <LineChart.YAxis />
            <LineChart.Tooltip />
            <LineChart.Legend />
            <LineChart.Line dataKey="revenue" />
            <LineChart.Line dataKey="profit" />
          </LineChart.Root>
        </ChartContainer>
      </div>

      {/* Channel breakdown */}
      <div>
        <Text as="h3" variant="heading" size="s">
          Traffic Sources
        </Text>
        <ChartContainer height={300}>
          <PieChart.Root>
            <PieChart.Pie data={channelData} dataKey="value" nameKey="name" />
            <PieChart.Tooltip />
            <PieChart.Legend />
          </PieChart.Root>
        </ChartContainer>
      </div>

      {/* Monthly comparison */}
      <div style={{ gridColumn: '1 / -1' }}>
        <Text as="h3" variant="heading" size="s">
          Monthly Comparison
        </Text>
        <ChartContainer height={300}>
          <BarChart.Root data={monthlyData}>
            <BarChart.Grid />
            <BarChart.XAxis dataKey="month" />
            <BarChart.YAxis />
            <BarChart.Tooltip />
            <BarChart.Legend />
            <BarChart.Bar dataKey="revenue" />
            <BarChart.Bar dataKey="profit" />
            <BarChart.Bar dataKey="expenses" />
          </BarChart.Root>
        </ChartContainer>
      </div>
    </div>
  );
}
