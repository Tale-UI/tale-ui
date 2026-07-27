import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoPlayer } from '@tale-ui/react/video-player';

// A freely-licensed short video for demo purposes
const DEMO_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const DEMO_THUMB = 'https://placehold.co/640x360/1e293b/ffffff?text=▶+Play+Video';

type Args = {
  size?: 'sm' | 'md' | 'lg';
  src: string;
  type: string;
  autoPlay: boolean;
  thumbnailUrl: string;
  thumbnailAlt: string;
  showThumbnailOverlay: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/VideoPlayer',
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    src: { control: 'text' },
    type: { control: 'text' },
    autoPlay: { control: 'boolean' },
    thumbnailUrl: { control: 'text' },
    thumbnailAlt: { control: 'text' },
    showThumbnailOverlay: { control: 'boolean' },
  },
  args: {
    size: 'md',
    src: DEMO_VIDEO,
    type: 'video/mp4',
    autoPlay: false,
    thumbnailUrl: DEMO_THUMB,
    thumbnailAlt: 'Play demo video',
    showThumbnailOverlay: true,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <VideoPlayer.Root
        src={args.src}
        type={args.type}
        autoPlay={args.autoPlay}
        size={args.size}
        thumbnailUrl={args.thumbnailUrl}
        thumbnailAlt={args.thumbnailAlt}
        showThumbnailOverlay={args.showThumbnailOverlay}
      />
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: 640,
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p
            style={{
              fontSize: 'var(--label-s-font-size)',
              color: 'var(--neutral-60)',
              marginBottom: '0.25rem',
            }}
          >
            {size}
          </p>
          <VideoPlayer.Root
            src={DEMO_VIDEO}
            size={size}
            thumbnailUrl={DEMO_THUMB}
            thumbnailAlt={`Video (${size})`}
          />
        </div>
      ))}
    </div>
  ),
};

export const WithoutThumbnail: Story = {
  name: 'Without Thumbnail',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <VideoPlayer.Root src={DEMO_VIDEO} size="md" />
    </div>
  ),
};
