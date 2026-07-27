import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from '@tale-ui/react/tooltip';

type Args = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  delay: number;
};

const meta: Meta<Args> = {
  title: 'Components/Tooltip',
  parameters: { layout: 'centered' },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    offset: { control: { type: 'number', min: 0, max: 20 } },
    delay: { control: { type: 'number', min: 0, step: 50 } },
  },
  args: {
    placement: 'top',
    offset: 8,
    delay: 700,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-padded">
      <Tooltip.Root delay={args.delay}>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Popup placement={args.placement} offset={args.offset}>
          <Tooltip.Arrow />
          This is a tooltip
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

export const AllPlacements: Story = {
  name: 'All Placements',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-padded story-tooltip-row">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip.Root key={placement}>
          <Tooltip.Trigger>{placement}</Tooltip.Trigger>
          <Tooltip.Popup placement={placement} offset={8}>
            <Tooltip.Arrow />
            Tooltip on {placement}
          </Tooltip.Popup>
        </Tooltip.Root>
      ))}
    </div>
  ),
};

export const LongText: Story = {
  name: 'Long Text',
  render: (args) => (
    <div className="story-padded">
      <Tooltip.Root>
        <Tooltip.Trigger>Long tooltip</Tooltip.Trigger>
        <Tooltip.Popup placement={args.placement} offset={args.offset}>
          <Tooltip.Arrow />
          This is a tooltip with a longer description that wraps across multiple lines to
          demonstrate how the tooltip handles extended content gracefully.
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

export const WithoutArrow: Story = {
  name: 'Without Arrow',
  render: (args) => (
    <div className="story-padded">
      <Tooltip.Root>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Popup placement={args.placement} offset={args.offset}>
          This tooltip has no arrow
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

export const WithSupportingText: Story = {
  name: 'With Supporting Text',
  render: (args) => (
    <div className="story-padded">
      <Tooltip.Root>
        <Tooltip.Trigger>Feature info</Tooltip.Trigger>
        <Tooltip.Popup placement={args.placement} offset={args.offset}>
          <Tooltip.Arrow />
          <Tooltip.Title>Feature Name</Tooltip.Title>
          <Tooltip.Description>This feature allows you to do something useful.</Tooltip.Description>
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

export const SupportingTextPlacements: Story = {
  name: 'Supporting Text — All Placements',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-padded story-tooltip-row">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip.Root key={placement}>
          <Tooltip.Trigger>{placement}</Tooltip.Trigger>
          <Tooltip.Popup placement={placement} offset={8}>
            <Tooltip.Arrow />
            <Tooltip.Title>Heading</Tooltip.Title>
            <Tooltip.Description>Supporting text on {placement}</Tooltip.Description>
          </Tooltip.Popup>
        </Tooltip.Root>
      ))}
    </div>
  ),
};

export const WithDelay: Story = {
  name: 'With Delay',
  render: (args) => (
    <div className="story-padded story-tooltip-delay-row">
      <Tooltip.Root delay={500}>
        <Tooltip.Trigger>500ms delay</Tooltip.Trigger>
        <Tooltip.Popup placement={args.placement} offset={args.offset}>
          <Tooltip.Arrow />
          Appeared after 500ms
        </Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>No delay</Tooltip.Trigger>
        <Tooltip.Popup placement={args.placement} offset={args.offset}>
          <Tooltip.Arrow />
          Instant tooltip
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const placements = ['top', 'bottom', 'left', 'right'] as const;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xl)',
          alignItems: 'center',
          padding: 'var(--space-3xl)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">Simple tooltip — all placements</span>
          <div style={{ display: 'flex', gap: 'var(--space-l)' }}>
            {placements.map((placement) => (
              <Tooltip.Root key={placement}>
                <Tooltip.Trigger>{placement}</Tooltip.Trigger>
                <Tooltip.Popup placement={placement} offset={8}>
                  <Tooltip.Arrow />
                  Tooltip on {placement}
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
            alignItems: 'center',
          }}
        >
          <span className="story-label">With title + description — all placements</span>
          <div style={{ display: 'flex', gap: 'var(--space-l)' }}>
            {placements.map((placement) => (
              <Tooltip.Root key={placement}>
                <Tooltip.Trigger>{placement}</Tooltip.Trigger>
                <Tooltip.Popup placement={placement} offset={8}>
                  <Tooltip.Arrow />
                  <Tooltip.Title>Heading</Tooltip.Title>
                  <Tooltip.Description>Supporting text on {placement}</Tooltip.Description>
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
