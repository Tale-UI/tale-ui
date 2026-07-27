import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@tale-ui/react/badge';
import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';
import { Link } from '@tale-ui/react/link';
import { Tooltip } from '@tale-ui/react/tooltip';

type Args = {
  columns: 1 | 2 | 3 | 4;
  minColumnWidth: number;
  variant: 'plain' | 'divided';
  density: 'compact' | 'default' | 'spacious';
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/KeyValuePairs',
  parameters: { layout: 'centered' },
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 4] },
    minColumnWidth: { control: 'number' },
    variant: { control: 'select', options: ['plain', 'divided'] },
    density: { control: 'select', options: ['compact', 'default', 'spacious'] },
    label: { control: 'text' },
  },
  args: {
    columns: 1,
    minColumnWidth: 150,
    variant: 'plain',
    density: 'default',
    label: 'Service metadata',
  },
};

export default meta;
type Story = StoryObj<Args>;

function ServicePairs(args: Args) {
  return (
    <KeyValuePairs.Root
      aria-label={args.label}
      columns={args.columns}
      minColumnWidth={args.minColumnWidth}
      variant={args.variant}
      density={args.density}
      style={{ width: '26.25rem' }}
    >
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>Status</KeyValuePairs.Term>
        <KeyValuePairs.Details>
          <Badge variant="success">Active</Badge>
        </KeyValuePairs.Details>
      </KeyValuePairs.Item>
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>Owner</KeyValuePairs.Term>
        <KeyValuePairs.Details>Platform Team</KeyValuePairs.Details>
      </KeyValuePairs.Item>
      <KeyValuePairs.Item>
        <KeyValuePairs.Term>Region</KeyValuePairs.Term>
        <KeyValuePairs.Details>us-east-1</KeyValuePairs.Details>
      </KeyValuePairs.Item>
    </KeyValuePairs.Root>
  );
}

export const Default: Story = {
  render(args) {
    return <ServicePairs {...args} />;
  },
};

export const Divided: Story = {
  render() {
    return <ServicePairs columns={1} minColumnWidth={150} variant="divided" density="default" />;
  },
};

export const ResponsiveColumns: Story = {
  render() {
    return <ServicePairs columns={3} minColumnWidth={180} variant="divided" density="default" />;
  },
};

export const Grouped: Story = {
  render() {
    return (
      <KeyValuePairs.Root
        aria-label="Infrastructure summary"
        columns={2}
        minColumnWidth={220}
        style={{ width: '26.25rem' }}
      >
        <KeyValuePairs.Group>
          <KeyValuePairs.GroupTitle>Network</KeyValuePairs.GroupTitle>
          <KeyValuePairs.GroupList>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>VPC</KeyValuePairs.Term>
              <KeyValuePairs.Details>vpc-1234</KeyValuePairs.Details>
            </KeyValuePairs.Item>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Subnet</KeyValuePairs.Term>
              <KeyValuePairs.Details>subnet-5678</KeyValuePairs.Details>
            </KeyValuePairs.Item>
          </KeyValuePairs.GroupList>
        </KeyValuePairs.Group>
        <KeyValuePairs.Group>
          <KeyValuePairs.GroupTitle>Runtime</KeyValuePairs.GroupTitle>
          <KeyValuePairs.GroupList>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Endpoint</KeyValuePairs.Term>
              <KeyValuePairs.Details>
                <Link href="https://api.example.com">api.example.com</Link>
              </KeyValuePairs.Details>
            </KeyValuePairs.Item>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Instances</KeyValuePairs.Term>
              <KeyValuePairs.Details>4</KeyValuePairs.Details>
            </KeyValuePairs.Item>
          </KeyValuePairs.GroupList>
        </KeyValuePairs.Group>
      </KeyValuePairs.Root>
    );
  },
};

export const WithInfo: Story = {
  render() {
    return (
      <KeyValuePairs.Root aria-label="Service metadata" style={{ width: '17.5rem' }}>
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>
            Region
            <KeyValuePairs.Info>
              <Tooltip.Root>
                <Tooltip.Trigger className="tale-button tale-button--ghost tale-button--sm">
                  ?
                </Tooltip.Trigger>
                <Tooltip.Popup>Primary deployment region.</Tooltip.Popup>
              </Tooltip.Root>
            </KeyValuePairs.Info>
          </KeyValuePairs.Term>
          <KeyValuePairs.Details>us-east-1</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>
    );
  },
};
