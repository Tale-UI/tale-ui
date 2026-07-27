import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorField } from '@tale-ui/react/color-field';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { ColorSwatch } from '@tale-ui/react/color-swatch';
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
import { ColorWheel } from '@tale-ui/react/color-wheel';
import { parseColor } from 'react-aria-components';

type Args = Record<string, unknown>;

const meta: Meta<Args> = {
  title: 'Components/Color Components',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

// ── Color Area ─────────────────────────────────────────────────────────────

export const ColorAreaStory: Story = {
  name: 'Color Area',
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness'],
    },
    yChannel: {
      control: 'select',
      options: ['red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness'],
    },
    defaultValue: { control: 'color' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    xChannel: 'saturation',
    yChannel: 'lightness',
    defaultValue: '#ff0000',
    isDisabled: false,
  },
  render(args) {
    return (
      <ColorArea.Root
        defaultValue={parseColor(args.defaultValue as string)}
        xChannel={args.xChannel as 'saturation'}
        yChannel={args.yChannel as 'lightness'}
        isDisabled={args.isDisabled as boolean}
      >
        <ColorArea.Thumb />
      </ColorArea.Root>
    );
  },
};

// ── Color Slider ───────────────────────────────────────────────────────────

export const ColorSliderStory: Story = {
  name: 'Color Slider',
  argTypes: {
    channel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness', 'brightness', 'alpha', 'red', 'green', 'blue'],
    },
    defaultValue: { control: 'color' },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    isDisabled: { control: 'boolean' },
    showOutput: { control: 'boolean' },
  },
  args: {
    channel: 'hue',
    defaultValue: '#ff0000',
    orientation: 'horizontal',
    isDisabled: false,
    showOutput: true,
  },
  render(args) {
    const channel = args.channel as 'hue';
    return (
      <ColorSlider.Root
        channel={channel}
        defaultValue={parseColor(args.defaultValue as string)}
        orientation={args.orientation as 'horizontal'}
        isDisabled={args.isDisabled as boolean}
      >
        <ColorSlider.Label>{channel.charAt(0).toUpperCase() + channel.slice(1)}</ColorSlider.Label>
        {(args.showOutput as boolean) && <ColorSlider.Output />}
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider.Root>
    );
  },
};

// ── Color Wheel ────────────────────────────────────────────────────────────

export const ColorWheelStory: Story = {
  name: 'Color Wheel',
  argTypes: {
    outerRadius: { control: { type: 'range', min: 40, max: 200, step: 5 } },
    innerRadius: { control: { type: 'range', min: 20, max: 180, step: 5 } },
    defaultValue: { control: 'color' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    outerRadius: 100,
    innerRadius: 70,
    defaultValue: '#ff0000',
    isDisabled: false,
  },
  render(args) {
    return (
      <ColorWheel.Root
        defaultValue={parseColor(args.defaultValue as string)}
        outerRadius={args.outerRadius as number}
        innerRadius={args.innerRadius as number}
        isDisabled={args.isDisabled as boolean}
      >
        <ColorWheel.Track />
        <ColorWheel.Thumb />
      </ColorWheel.Root>
    );
  },
};

// ── Color Field ────────────────────────────────────────────────────────────

export const ColorFieldStory: Story = {
  name: 'Color Field',
  argTypes: {
    label: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  args: {
    label: 'Hex colour',
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isRequired: false,
  },
  render(args) {
    return (
      <div className="story-field">
        <ColorField.Root
          defaultValue={parseColor('#ff0000')}
          isDisabled={args.isDisabled as boolean}
          isReadOnly={args.isReadOnly as boolean}
          isInvalid={args.isInvalid as boolean}
          isRequired={args.isRequired as boolean}
        >
          <ColorField.Label>{args.label as string}</ColorField.Label>
          <ColorField.Input />
        </ColorField.Root>
      </div>
    );
  },
};

// ── Color Swatch ───────────────────────────────────────────────────────────

export const ColorSwatchStory: Story = {
  name: 'Color Swatch',
  argTypes: {
    color: { control: 'color' },
    shape: { control: 'inline-radio', options: ['square', 'circle'] },
    defaultValue: { control: 'color' },
    enableSecondary: { control: 'boolean' },
    secondaryColor: { control: 'color', if: { arg: 'enableSecondary' } },
  },
  args: {
    color: '#ff0000',
    shape: 'square',
    defaultValue: '#ff0000',
    enableSecondary: false,
    secondaryColor: '#e0e0e0',
  },
  render(args) {
    return (
      <ColorSwatch
        color={args.color as string}
        shape={args.shape as 'square' | 'circle'}
        secondaryColor={
          (args.enableSecondary as boolean) ? (args.secondaryColor as string) : undefined
        }
        style={{ width: '2.5rem', height: '2.5rem' }}
      />
    );
  },
};

// ── Color Swatch Picker ────────────────────────────────────────────────────

const SWATCH_PALETTE = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'] as const;
const NEUTRAL_PAIRS: Record<string, string> = {
  '#ff0000': '#fef2f2',
  '#ff8800': '#fff7ed',
  '#ffff00': '#fefce8',
  '#00ff00': '#f0fdf4',
  '#0088ff': '#eff6ff',
  '#8800ff': '#faf5ff',
};

export const ColorSwatchPickerStory: Story = {
  name: 'Color Swatch Picker',
  argTypes: {
    shape: { control: 'inline-radio', options: ['square', 'circle'] },
    showSecondary: {
      control: 'boolean',
      description: 'Render each swatch as a brand + neutral diagonal split (theme preview)',
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    shape: 'square',
    showSecondary: false,
    isDisabled: false,
  },
  render(args) {
    return (
      <ColorSwatchPicker.Root
        defaultValue={parseColor(args.defaultValue as string)}
        shape={args.shape as 'square' | 'circle'}
        isDisabled={args.isDisabled as boolean}
      >
        {SWATCH_PALETTE.map((c) => (
          <ColorSwatchPicker.Item key={c} color={c}>
            <ColorSwatch
              secondaryColor={(args.showSecondary as boolean) ? NEUTRAL_PAIRS[c] : undefined}
            />
          </ColorSwatchPicker.Item>
        ))}
      </ColorSwatchPicker.Root>
    );
  },
};

// ── Combined Picker (no controls — composition demo) ───────────────────────

export const CombinedPicker: Story = {
  name: 'Combined Picker',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-col story-col--m">
        <ColorArea.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>
          <ColorArea.Thumb />
        </ColorArea.Root>
        <ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
          <ColorSlider.Label>Hue</ColorSlider.Label>
          <ColorSlider.Output />
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider.Root>
        <ColorSlider.Root channel="saturation" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
          <ColorSlider.Label>Saturation</ColorSlider.Label>
          <ColorSlider.Output />
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider.Root>
      </div>
    );
  },
};

// ── All Variations (no controls — gallery) ─────────────────────────────────

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div
        style={{
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          padding: 16,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Area</span>
          <ColorArea.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>
            <ColorArea.Thumb />
          </ColorArea.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Slider</span>
          <ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
            <ColorSlider.Label>Hue</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Wheel</span>
          <ColorWheel.Root
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            outerRadius={100}
            innerRadius={70}
          >
            <ColorWheel.Track />
            <ColorWheel.Thumb />
          </ColorWheel.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Swatch (square)</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff'].map((c) => (
              <ColorSwatch key={c} color={c} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Swatch (circle)</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff'].map((c) => (
              <ColorSwatch key={c} color={c} shape="circle" />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Swatch (diagonal split)</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {SWATCH_PALETTE.map((c) => (
              <ColorSwatch key={c} color={c} secondaryColor={NEUTRAL_PAIRS[c]} />
            ))}
            {SWATCH_PALETTE.map((c) => (
              <ColorSwatch
                key={`${c}-circle`}
                color={c}
                shape="circle"
                secondaryColor={NEUTRAL_PAIRS[c]}
              />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Swatch Picker (square)</span>
          <ColorSwatchPicker.Root defaultValue={parseColor('#ff0000')}>
            {SWATCH_PALETTE.map((c) => (
              <ColorSwatchPicker.Item key={c} color={c}>
                <ColorSwatch />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Swatch Picker (circle)</span>
          <ColorSwatchPicker.Root defaultValue={parseColor('#ff0000')} shape="circle">
            {SWATCH_PALETTE.map((c) => (
              <ColorSwatchPicker.Item key={c} color={c}>
                <ColorSwatch />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Swatch Picker (theme preview)</span>
          <ColorSwatchPicker.Root defaultValue={parseColor('#ff0000')} shape="circle">
            {SWATCH_PALETTE.map((c) => (
              <ColorSwatchPicker.Item key={c} color={c}>
                <ColorSwatch secondaryColor={NEUTRAL_PAIRS[c]} />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Color Field</span>
          <ColorField.Root defaultValue={parseColor('#ff0000')}>
            <ColorField.Label>Hex colour</ColorField.Label>
            <ColorField.Input />
          </ColorField.Root>
        </div>
      </div>
    );
  },
};
