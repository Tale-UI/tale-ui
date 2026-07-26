# ImageCropper

`import { ImageCropper } from '@tale-ui/react/image-cropper';`

Image crop UI built on `react-image-crop`. Requires the `react-image-crop` peer dependency.

## Parts

| Part                | Description                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `ImageCropper.Root` | Crop container (wraps `react-image-crop`'s `ReactCrop`). Controls crop state via `crop` + `onChange`. |
| `ImageCropper.Img`  | The `<img>` to be cropped. Place directly inside `ImageCropper.Root`.                                 |

## Props

### ImageCropper.Root

Accepts all props from `react-image-crop`'s `ReactCropProps`. Key props:

| Prop           | Type                                                  | Default  | Description                            |
| -------------- | ----------------------------------------------------- | -------- | -------------------------------------- |
| `crop`         | `Crop`                                                | —        | Controlled crop state                  |
| `onChange`     | `(crop: PixelCrop, percentCrop: PercentCrop) => void` | required | Called on every drag/resize            |
| `onComplete`   | `(crop: PixelCrop, percentCrop: PercentCrop) => void` | —        | Called when the user lifts the pointer |
| `aspect`       | `number`                                              | —        | Enforced aspect ratio (e.g. `16 / 9`)  |
| `circularCrop` | `boolean`                                             | —        | Renders a circular crop selection      |
| `minWidth`     | `number`                                              | —        | Minimum crop width in px               |
| `minHeight`    | `number`                                              | —        | Minimum crop height in px              |
| `ruleOfThirds` | `boolean`                                             | —        | Show rule-of-thirds guide lines        |
| `className`    | `string`                                              | —        | Additional CSS class                   |

### ImageCropper.Img

| Prop  | Type     | Default                 | Description              |
| ----- | -------- | ----------------------- | ------------------------ |
| `src` | `string` | required                | URL of the image to crop |
| `alt` | `string` | `'Image to be cropped'` | Accessible alt text      |

Also accepts all standard `<img>` HTML attributes.

## Utility Functions

These are also exported from the package for use outside the component:

| Export                               | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| `cropToFile(imageSrc, crop)`         | Crops the image to a canvas and returns a `File` |
| `cropToDownloadable(imageSrc, crop)` | Crops the image and triggers a browser download  |
| `fileToLink(file)`                   | Converts a `File` to a Base64 data URL           |
| `fileToBlob(file)`                   | Converts a `File` to a `Blob`                    |
| `makeAspectCrop`                     | Re-exported from `react-image-crop`              |
| `centerCrop`                         | Re-exported from `react-image-crop`              |

## Basic Usage

```tsx
import { ImageCropper } from '@tale-ui/react/image-cropper';
import { useState } from 'react';
import type { Crop, PixelCrop } from '@tale-ui/react/image-cropper';

function AvatarCropper() {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  return (
    <ImageCropper.Root crop={crop} onChange={setCrop} onComplete={setCompletedCrop} aspect={1}>
      <ImageCropper.Img src="/photo.jpg" alt="Crop your photo" />
    </ImageCropper.Root>
  );
}
```

## Examples

### With Aspect Ratio

```tsx
<ImageCropper.Root crop={crop} onChange={setCrop} aspect={16 / 9}>
  <ImageCropper.Img src="/landscape.jpg" alt="Crop" />
</ImageCropper.Root>
```

### Circular Crop

```tsx
<ImageCropper.Root crop={crop} onChange={setCrop} aspect={1} circularCrop>
  <ImageCropper.Img src="/photo.jpg" alt="Crop avatar" />
</ImageCropper.Root>
```

### Save Cropped Image

```tsx
import { ImageCropper, cropToFile } from '@tale-ui/react/image-cropper';

async function handleSave() {
  if (completedCrop && imageSrc) {
    const file = await cropToFile(imageSrc, completedCrop);
    if (file) {
      // upload or preview the file
    }
  }
}
```

### With makeAspectCrop Helper

```tsx
import { ImageCropper, makeAspectCrop, centerCrop } from '@tale-ui/react/image-cropper';

function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
  const initialCrop = centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 16 / 9, width, height),
    width,
    height,
  );
  setCrop(initialCrop);
}
```

## CSS Classes

- `.tale-image-cropper` — Root wrapper (applies to `ReactCrop` element)
- `.tale-image-cropper__img` — The `<img>` element

The full `ReactCrop` CSS is included in `@tale-ui/react-styles`. Consumers do **not** need to import `react-image-crop/dist/ReactCrop.css`.

## Notes

- Requires `react-image-crop` to be installed: `npm install react-image-crop`
- Do **not** import `react-image-crop/dist/ReactCrop.css` — Tale UI's styles already include the necessary CSS themed with `--color-60` tokens.

## Pitfalls

<!-- pitfall: never-apply-nonlayout-inline-styles -->

- **Never apply non-layout inline styles (objectFit, objectPosition) to ImageCropper.Img — use a wrapper element for those CSS overrides instead** — `ImageCropper.Img` only accepts layout styles (`maxHeight`, `width`) directly on its `style` prop; passing visual rendering styles like `objectFit` causes a validation error.
  - anti-pattern: `<ImageCropper.Img style={{ maxHeight: 400, width: '100%', objectFit: 'contain' }} />`
  - fix: `<div style={{ maxHeight: 400, width: '100%' }}><ImageCropper.Img style={{ maxHeight: 400, width: '100%' }} /></div>`

<!-- pitfall: imagecropper-gap-uses-spacing-tokens -->
- **When wrapping ImageCropper in a Column or Row layout container, use spacing-token gap values — never component-size names** — `gap="lg"` is not a valid `Gap` value; map: `lg`→`l`, `md`→`m`, `sm`→`s`.
  - anti-pattern: `<Column gap="lg"><ImageCropper.Root ...>...</ImageCropper.Root></Column>`
  - fix: `<Column gap="l"><ImageCropper.Root ...>...</ImageCropper.Root></Column>`

<!-- pitfall: use-imagecropper-for-any-prompt -->
- **Use ImageCropper.Root for any prompt that asks for cropping an avatar or other image** — when the request is specifically to crop an image — including any mention of '1:1 aspect ratio', 'square crop', or 'avatar photo' — immediately output the full ImageCropper.Root composition without deliberation. Never return empty code, time out, or substitute Image. Import centerCrop, makeAspectCrop, and the Crop type all from @tale-ui/react/image-cropper. Initialize crop state as useState<Crop>() (no initial value), wire an onLoad handler on ImageCropper.Img to compute the initial centered crop, and pass aspect={1} to ImageCropper.Root for square crops.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function AvatarCropper() {}`
  - anti-pattern: `export function AvatarCropper() { return null; }`
  - anti-pattern: `import { Image } from '@tale-ui/react/image'; export function AvatarCropper() { return <Image src="/avatar.jpg" alt="User avatar" />; }`
  - fix: `import * as React from 'react'; import { ImageCropper, centerCrop, makeAspectCrop } from '@tale-ui/react/image-cropper'; import type { Crop } from '@tale-ui/react/image-cropper'; export function AvatarCropper() { const [crop, setCrop] = React.useState<Crop>(); function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) { const { width, height } = event.currentTarget; setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, width, height), width, height)); } return <ImageCropper.Root crop={crop} onChange={setCrop} aspect={1}><ImageCropper.Img src="/avatar.jpg" alt="User avatar to crop" onLoad={handleImageLoad} style={{ maxHeight: 320, width: '100%' }} /></ImageCropper.Root>; }`
  - complete example:
    ```tsx
    import * as React from 'react';
    import { ImageCropper, centerCrop, makeAspectCrop } from '@tale-ui/react/image-cropper';
    import type { Crop } from '@tale-ui/react/image-cropper';

    export function AvatarCropper() {
      const [crop, setCrop] = React.useState<Crop>();

      function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = event.currentTarget;
        setCrop(
          centerCrop(
            makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
            width,
            height
          )
        );
      }

      return (
        <ImageCropper.Root crop={crop} onChange={setCrop} aspect={1}>
          <ImageCropper.Img
            src="/avatar.jpg"
            alt="User avatar to crop"
            onLoad={handleImageLoad}
            style={{ maxHeight: 320, width: '100%' }}
          />
        </ImageCropper.Root>
      );
    }
    ```

<!-- pitfall: imagecropper-label-text-and-neutral-button -->
- **Use Tale UI label-plus-button props when composing ImageCropper with surrounding UI** — `Text` has no `weight` prop; passing `weight="semibold"` causes `Type '{ weight: string; ... }' is not assignable to type 'TextProps'`. Use `Text variant="label"` for labels. Use `Button variant="neutral"` for change or re-upload actions because `Button` has no `"secondary"` variant.
  - anti-pattern: `<Text weight="semibold">Crop avatar photo</Text>`
  - anti-pattern: `<Button variant="secondary">Change photo</Button>`
  - fix: `<Text variant="label">Crop avatar photo</Text>`
  - fix: `<Button variant="neutral">Change photo</Button>`
