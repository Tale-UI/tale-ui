# Media Viewing

Open a collection of gallery thumbnails in a localized, keyboard- and
swipe-navigable lightbox.

## Components Used

- `Lightbox` from `@tale-ui/react/lightbox`

## Code

```tsx
import { Lightbox } from '@tale-ui/react/lightbox';

const images = [
  { id: 'coast', label: 'Rocky coast at sunrise', src: '/coast.jpg' },
  { id: 'forest', label: 'Forest trail after rain', src: '/forest.jpg' },
] as const;

export function MediaViewer() {
  return (
    <Lightbox.Root
      items={images}
      getKey={(image) => image.id}
      getLabel={(image) => image.label}
      renderContent={(image) => <img src={image.src} alt={image.label} />}
    >
      {images.map((image) => (
        <Lightbox.Trigger key={image.id} itemKey={image.id}>
          <img src={image.src} alt={image.label} />
        </Lightbox.Trigger>
      ))}

      <Lightbox.Backdrop>
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
```

## Key points

- Keep collection keys and labels stable. Invalid or duplicate collection
  identity closes the overlay and makes controls inert.
- Root alone owns open and selection state; do not pass open-state authority
  through Backdrop or Popup modal props.
- Caption uses the current item label only when its children are omitted.
  Passing `null` intentionally renders no caption.
- Localized control names, focus containment, Escape/backdrop dismissal, RTL
  navigation, and post-close focus restoration are provided by the component.
