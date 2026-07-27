import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '@tale-ui/react/image';

type Args = {
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fit: 'cover' | 'contain' | 'fill' | 'none';
  alt: string;
};

const meta: Meta<Args> = {
  title: 'Components/Image',
  parameters: { layout: 'centered' },
  argTypes: {
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    fit: { control: 'select', options: ['cover', 'contain', 'fill', 'none'] },
    alt: { control: 'text' },
  },
  args: { radius: 'none', fit: 'cover', alt: 'Placeholder image' },
};

export default meta;
type Story = StoryObj<Args>;

const PLACEHOLDER = 'https://picsum.photos/seed/taleui/400/300';

export const Default: Story = {
  render(args) {
    return (
      <Image
        src={PLACEHOLDER}
        alt={args.alt}
        radius={args.radius}
        fit={args.fit}
        width={400}
        height={300}
      />
    );
  },
};

export const AllRadii: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const radii = ['none', 'sm', 'md', 'lg', 'full'] as const;
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {radii.map((r) => (
          <div key={r} style={{ textAlign: 'center' }}>
            <Image
              src={PLACEHOLDER}
              alt={`Radius ${r}`}
              radius={r}
              width={160}
              height={160}
              style={{ objectFit: 'cover' }}
            />
            <div className="story-label" style={{ marginTop: '0.25rem' }}>
              {r}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
