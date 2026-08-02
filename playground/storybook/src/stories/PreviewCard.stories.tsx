import type { Meta, StoryObj } from '@storybook/react-vite';
import { PreviewCard } from '@tale-ui/react/preview-card';

type Args = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  delay: number;
  closeDelay: number;
};

const meta: Meta<Args> = {
  title: 'Components/PreviewCard',
  parameters: { layout: 'centered' },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: { control: 'number' },
    delay: { control: { type: 'number', min: 0, step: 50 } },
    closeDelay: { control: { type: 'number', min: 0, step: 50 } },
  },
  args: {
    placement: 'bottom',
    offset: 8,
    delay: 700,
    closeDelay: 300,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <PreviewCard.Root delay={args.delay} closeDelay={args.closeDelay}>
      <PreviewCard.Trigger>Hover or focus to preview</PreviewCard.Trigger>
      <PreviewCard.Popup placement={args.placement} offset={args.offset}>
        <PreviewCard.Content aria-label="Preview">
          <div className="story-preview-content">
            <h4 className="story-preview-title">Preview Title</h4>
            <p className="story-preview-text">
              This preview opens on hover, keyboard focus, or long press.
            </p>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  ),
};

export const WithArrow: Story = {
  render: (args) => (
    <PreviewCard.Root>
      <PreviewCard.Trigger>Hover or focus to preview</PreviewCard.Trigger>
      <PreviewCard.Popup placement={args.placement} offset={args.offset}>
        <PreviewCard.Arrow />
        <PreviewCard.Content aria-label="Preview">
          <div className="story-preview-content">
            <h4 className="story-preview-title">Arrow Preview</h4>
            <p className="story-preview-text">
              This preview card includes an arrow pointing to the trigger.
            </p>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  ),
};

export const WithImage: Story = {
  render: () => (
    <PreviewCard.Root>
      <PreviewCard.Trigger>Preview with image</PreviewCard.Trigger>
      <PreviewCard.Popup placement="bottom" offset={8}>
        <PreviewCard.Content aria-label="Image preview">
          <div className="story-preview-image-wrap">
            <div className="story-image-placeholder">Image placeholder</div>
            <div className="story-preview-body">
              <h4 className="story-preview-title">Card with Image</h4>
              <p className="story-preview-text">
                A preview card that includes an image area above the text content.
              </p>
            </div>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
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
          gap: 'var(--space-l)',
          alignItems: 'flex-start',
          padding: 'var(--space-3xl)',
        }}
      >
        {placements.map((placement) => (
          <div
            key={placement}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2xs)',
              alignItems: 'center',
            }}
          >
            <span className="story-label">placement="{placement}"</span>
            <PreviewCard.Root>
              <PreviewCard.Trigger>Hover ({placement})</PreviewCard.Trigger>
              <PreviewCard.Popup placement={placement} offset={8}>
                <PreviewCard.Arrow />
                <PreviewCard.Content aria-label={`Preview ${placement}`}>
                  <div className="story-preview-content">
                    <h4 className="story-preview-title">Preview: {placement}</h4>
                    <p className="story-preview-text">This card is placed on the {placement}.</p>
                  </div>
                </PreviewCard.Content>
              </PreviewCard.Popup>
            </PreviewCard.Root>
          </div>
        ))}
      </div>
    );
  },
};
