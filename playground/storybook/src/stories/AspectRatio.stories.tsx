import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@tale-ui/react/aspect-ratio';

const landscape =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Crect width="640" height="360" fill="%230f766e"/%3E%3Ccircle cx="510" cy="90" r="42" fill="%23fef3c7"/%3E%3Cpath d="M0 310 190 115l115 120 80-80 255 205H0Z" fill="%2399f6e4"/%3E%3C/svg%3E';

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  args: {
    ratio: '16 / 9',
    objectFit: 'cover',
  },
  argTypes: {
    objectFit: { control: 'select', options: ['cover', 'contain'] },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return (
      <AspectRatio {...args} style={{ width: 480, maxWidth: '80vw' }}>
        <img src={landscape} alt="Illustrated mountain landscape" />
      </AspectRatio>
    );
  },
};
