import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '@tale-ui/react/image';
import { Lightbox } from '@tale-ui/react/lightbox';

interface GalleryItem {
  id: string;
  label: string;
  src: string;
}

const gallery: readonly GalleryItem[] = [
  {
    id: 'coast',
    label: 'Rocky coast at golden hour',
    src: 'https://picsum.photos/seed/tale-lightbox-coast/1200/800',
  },
  {
    id: 'forest',
    label: 'Sunlight through a green forest',
    src: 'https://picsum.photos/seed/tale-lightbox-forest/1200/800',
  },
  {
    id: 'city',
    label: 'City lights reflected after rain',
    src: 'https://picsum.photos/seed/tale-lightbox-city/1200/800',
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
