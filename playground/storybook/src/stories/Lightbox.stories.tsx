import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '@tale-ui/react/image';
import { Lightbox } from '@tale-ui/react/lightbox';

interface GalleryItem {
  id: string;
  label: string;
  src: string;
}

function imageDataUrl(color: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${color}"/><text x="600" y="410" fill="white" font-family="sans-serif" font-size="64" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const gallery: readonly GalleryItem[] = [
  {
    id: 'coast',
    label: 'Rocky coast at golden hour',
    src: imageDataUrl('#315f78', 'Rocky coast'),
  },
  {
    id: 'forest',
    label: 'Sunlight through a green forest',
    src: imageDataUrl('#315f48', 'Forest trail'),
  },
  {
    id: 'city',
    label: 'City lights reflected after rain',
    src: imageDataUrl('#513f70', 'City lights'),
  },
];

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Lightbox',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<Args>;

function Gallery({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Lightbox.Root
      items={gallery}
      getKey={(item) => item.id}
      getLabel={(item) => item.label}
      renderContent={(item) => (
        <Image src={item.src} alt={item.label} fit="contain" width={1200} height={800} />
      )}
      defaultOpen={defaultOpen}
      defaultSelectedKey="forest"
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-xs)',
          justifyContent: 'center',
        }}
      >
        {gallery.map((item) => (
          <Lightbox.Trigger key={item.id} itemKey={item.id} variant="ghost">
            <Image src={item.src} alt="" fit="cover" radius="md" width={180} height={120} />
            <span className="sr-only">{`Open ${item.label}`}</span>
          </Lightbox.Trigger>
        ))}
      </div>
      <Lightbox.Backdrop isDismissable>
        <Lightbox.Popup>
          <Lightbox.Content />
          <Lightbox.Caption />
          <Lightbox.Previous />
          <Lightbox.Next />
          <Lightbox.Close />
        </Lightbox.Popup>
      </Lightbox.Backdrop>
    </Lightbox.Root>
  );
}

export const Default: Story = {
  render: () => <Gallery />,
};

export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Gallery defaultOpen />,
};
