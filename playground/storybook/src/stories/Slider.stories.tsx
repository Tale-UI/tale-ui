import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@tale-ui/react/slider';

type Args = {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Slider',
  argTypes: {
    defaultValue: { control: 'number' },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
    step: { control: 'number' },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    defaultValue: 50,
    minValue: 0,
    maxValue: 100,
    step: 1,
    orientation: 'horizontal',
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-slider-wide">
      <Slider.Root
        key={`${args.defaultValue}-${args.minValue}-${args.maxValue}-${args.step}-${args.orientation}`}
        defaultValue={args.defaultValue}
        minValue={args.minValue}
        maxValue={args.maxValue}
        step={args.step}
        orientation={args.orientation}
        isDisabled={args.isDisabled}
      >
        <Slider.Header>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={30}>
        <Slider.Header>
          <Slider.Label>Brightness</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Range: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Header>
          <Slider.Label>Price Range</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Steps: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={50} step={10}>
        <Slider.Header>
          <Slider.Label>Quality</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={60} isDisabled>
        <Slider.Header>
          <Slider.Label>Disabled Slider</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const ThumbLabelBottom: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={50}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb>
              <Slider.Output position="bottom" />
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const ThumbLabelTop: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={50}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb>
              <Slider.Output position="top" />
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const ThumbLabelRange: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb index={0}>
              <Slider.Output position="top" index={0} />
            </Slider.Thumb>
            <Slider.Thumb index={1}>
              <Slider.Output position="top" index={1} />
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-vertical">
      <Slider.Root defaultValue={40} orientation="vertical">
        <Slider.Header>
          <Slider.Label>Vertical</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', width: 400 }}>
        {/* ── Single value ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Single value</span>
          <Slider.Root defaultValue={50}>
            <Slider.Header>
              <Slider.Label>Volume</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Range (two thumbs) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Range (two thumbs)</span>
          <Slider.Root defaultValue={[20, 80]}>
            <Slider.Header>
              <Slider.Label>Price Range</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Custom step ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Step = 10</span>
          <Slider.Root defaultValue={50} step={10}>
            <Slider.Header>
              <Slider.Label>Quality</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Custom min/max ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Custom range (min 200, max 1000, step 50)</span>
          <Slider.Root defaultValue={600} minValue={200} maxValue={1000} step={50}>
            <Slider.Header>
              <Slider.Label>Budget</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Track only (no header) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Track only (no header)</span>
          <Slider.Root defaultValue={35}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Thumb label top (single) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Thumb label (top)</span>
          <Slider.Root defaultValue={50}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb>
                  <Slider.Output position="top" />
                </Slider.Thumb>
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Thumb label bottom (single) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Thumb label (bottom)</span>
          <Slider.Root defaultValue={50}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb>
                  <Slider.Output position="bottom" />
                </Slider.Thumb>
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Thumb labels on range (top) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Thumb labels on range (top)</span>
          <Slider.Root defaultValue={[25, 75]}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb index={0}>
                  <Slider.Output position="top" index={0} />
                </Slider.Thumb>
                <Slider.Thumb index={1}>
                  <Slider.Output position="top" index={1} />
                </Slider.Thumb>
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Thumb labels on range (bottom) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Thumb labels on range (bottom)</span>
          <Slider.Root defaultValue={[30, 70]}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb index={0}>
                  <Slider.Output position="bottom" index={0} />
                </Slider.Thumb>
                <Slider.Thumb index={1}>
                  <Slider.Output position="bottom" index={1} />
                </Slider.Thumb>
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Disabled ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Disabled</span>
          <Slider.Root defaultValue={60} isDisabled>
            <Slider.Header>
              <Slider.Label>Disabled</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Disabled range ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Disabled range</span>
          <Slider.Root defaultValue={[20, 80]} isDisabled>
            <Slider.Header>
              <Slider.Label>Disabled Range</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        {/* ── Vertical variations ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Vertical</span>
          <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
            <div className="story-slider-vertical">
              <Slider.Root defaultValue={40} orientation="vertical">
                <Slider.Header>
                  <Slider.Label>Single</Slider.Label>
                  <Slider.Output />
                </Slider.Header>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
            </div>

            <div className="story-slider-vertical">
              <Slider.Root defaultValue={[20, 70]} orientation="vertical">
                <Slider.Header>
                  <Slider.Label>Range</Slider.Label>
                  <Slider.Output />
                </Slider.Header>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
            </div>

            <div className="story-slider-vertical">
              <Slider.Root defaultValue={60} orientation="vertical" isDisabled>
                <Slider.Header>
                  <Slider.Label>Disabled</Slider.Label>
                  <Slider.Output />
                </Slider.Header>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
