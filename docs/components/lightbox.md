# Lightbox

`import { Lightbox } from '@tale-ui/react/lightbox';`

Experimental collection-driven modal media viewer with accessible naming,
keyboard and swipe navigation, focus containment, and deterministic focus
restoration.

## Parts

| Part                | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `Lightbox.Root`     | Owns the collection, selection, open state, trigger registry, and navigation |
| `Lightbox.Trigger`  | Selects its `itemKey`, then proposes opening the viewer                      |
| `Lightbox.Backdrop` | React Aria modal overlay; must wrap `Lightbox.Popup`                         |
| `Lightbox.Popup`    | Focus-contained dialog named from the selected item                          |
| `Lightbox.Content`  | Calls `renderContent` for the selected item                                  |
| `Lightbox.Caption`  | Shows the selected item label when children are omitted                      |
| `Lightbox.Previous` | Moves to the previous item and applies a localized name by default           |
| `Lightbox.Next`     | Moves to the next item and applies a localized name by default               |
| `Lightbox.Close`    | React Aria close-slot button with a localized name by default                |

## Root Props

| Prop                 | Type                                                           | Default    | Description                                           |
| -------------------- | -------------------------------------------------------------- | ---------- | ----------------------------------------------------- |
| `items`              | `readonly T[]`                                                 | —          | Ordered media collection                              |
| `getKey`             | `(item: T) => React.Key`                                       | —          | Returns a stable string, finite number, or bigint key |
| `getLabel`           | `(item: T) => string`                                          | —          | Returns the non-whitespace accessible item label      |
| `renderContent`      | `(item: T, context: LightboxRenderContext) => React.ReactNode` | —          | Renders the selected media                            |
| `isOpen`             | `boolean`                                                      | —          | Controlled open state                                 |
| `defaultOpen`        | `boolean`                                                      | `false`    | Initial uncontrolled open state                       |
| `onOpenChange`       | `(open: boolean) => void`                                      | —          | Receives open-state proposals                         |
| `selectedKey`        | `React.Key \| null`                                            | —          | Controlled selected key                               |
| `defaultSelectedKey` | `React.Key \| null`                                            | first item | Initial uncontrolled selected key                     |
| `onSelectionChange`  | `(key: React.Key \| null, item: T \| null) => void`            | —          | Receives selection proposals                          |
| `loop`               | `boolean`                                                      | `false`    | Wrap navigation at the collection boundaries          |
| `swipeNavigation`    | `boolean`                                                      | `true`     | Enable physical horizontal swipe navigation           |
| `children`           | `React.ReactNode`                                              | —          | Triggers and one Backdrop/Popup composition           |

```ts
interface LightboxRenderContext {
  key: React.Key;
  index: number;
  count: number;
}
```

Root also accepts native `<div>` attributes except children, action capture
handlers, and `dangerouslySetInnerHTML`. Its forwarded ref targets the root
`HTMLDivElement`.

## Basic Usage

```tsx
import { Image } from '@tale-ui/react/image';
import { Lightbox } from '@tale-ui/react/lightbox';

const photos = [
  { id: 'coast', label: 'Rocky coast at golden hour', src: '/coast.jpg' },
  { id: 'forest', label: 'Sunlight through a green forest', src: '/forest.jpg' },
] as const;

export function PhotoGallery() {
  return (
    <Lightbox.Root
      items={photos}
      getKey={(photo) => photo.id}
      getLabel={(photo) => photo.label}
      renderContent={(photo) => <Image src={photo.src} alt={photo.label} fit="contain" />}
    >
      {photos.map((photo) => (
        <Lightbox.Trigger key={photo.id} itemKey={photo.id} variant="ghost">
          Open {photo.label}
        </Lightbox.Trigger>
      ))}
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
```

`Lightbox.Root` is the sole open-state authority. Do not pass open-state props
to `Backdrop`, `Popup`, or `Popup.modalProps`. A trigger proposes selection
before it proposes opening.

## Controlled State

Open and selection modes are independent and fixed for the lifetime of the
mounted Root.

```tsx
const [open, setOpen] = useState(false);
const [selectedKey, setSelectedKey] = useState<React.Key | null>('coast');

<Lightbox.Root
  items={photos}
  getKey={(photo) => photo.id}
  getLabel={(photo) => photo.label}
  renderContent={(photo) => <Image src={photo.src} alt={photo.label} />}
  isOpen={open}
  onOpenChange={setOpen}
  selectedKey={selectedKey}
  onSelectionChange={setSelectedKey}
>
  {/* Triggers and overlay */}
</Lightbox.Root>;
```

Do not combine a controlled prop with its default counterpart. Do not add or
remove a controlled prop after the first valid render; remount the Root to
change mode. An invalid generation closes the visible overlay, makes controls
inert, cancels pending navigation/focus work, and invokes no state callbacks.
Returning to the established valid mode recovers synchronously.

If an uncontrolled selection is removed, Lightbox selects the new first item
(or `null`) and reports selection before closing. If a controlled selection is
absent, Lightbox proposes `null` once and then proposes closing once.

## Collection Rules

`getKey` and `getLabel` run once per item per collection generation. The entire
collection is rejected atomically when an accessor throws, a key is unsupported
or duplicated, or a label is blank. `0` and `-0` collide; `"1"`, `1`, and `1n`
are distinct. `renderContent` errors retain normal React error-boundary
behavior.

A trigger whose `itemKey` is invalid or absent is individually disabled.
Multiple triggers may target the same item; Lightbox retains their distinct
focus-restoration identities.

## Interaction and Accessibility

- Left and Right Arrow navigate only the topmost focused open Lightbox.
  Previous/next direction reverses in RTL.
- A physical swipe left or right navigates after 40 pixels. Physical mapping
  reverses in RTL. Interactive descendants and conflicting scroll regions are
  excluded, and canceled gestures do not navigate.
- Navigation stops at collection boundaries unless `loop` is enabled. A
  one-item collection is a no-op.
- React Aria provides modal focus containment, Escape handling, backdrop
  dismissal, close-slot behavior, and modal stacking.
- After dismissal, focus restoration tries the initiating trigger, another
  trigger for the last selection, the first registered trigger, and then a
  focusable Root.
- Popup is always named from the current item label. `Caption` uses that label
  only when children are `undefined`; pass `null` for an intentionally empty
  caption.
- Previous, Next, and Close use localized operational names unless exactly one
  valid `aria-label` or `aria-labelledby` is supplied.

Lightbox strips `dangerouslySetInnerHTML` from content-bearing parts. It also
owns target/capture action handlers on Trigger and the three controls; use Root
bubble handlers for permitted observation after Tale descendant actions.

## CSS Classes

- `.tale-lightbox`
- `.tale-lightbox__trigger`
- `.tale-lightbox__backdrop`
- `.tale-lightbox__popup`
- `.tale-lightbox__content`
- `.tale-lightbox__caption`
- `.tale-lightbox__previous`
- `.tale-lightbox__next`
- `.tale-lightbox__close`

## Pitfalls

- Keep collection keys primitive, unique, and stable across reorders.
- Remount Root to switch either controlled/uncontrolled state mode.
- Use `Image` for image media rather than a raw `<img>` in Tale UI examples.
<!-- pitfall: lightbox-popup-inside-backdrop -->
- **Nest Lightbox Popup inside Backdrop** — The Backdrop owns the React Aria modal overlay that contains and dismisses the Popup.
  - anti-pattern: `<><Lightbox.Backdrop /><Lightbox.Popup /></>`
  - fix: `<Lightbox.Backdrop><Lightbox.Popup /></Lightbox.Backdrop>`
