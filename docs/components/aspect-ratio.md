# AspectRatio

`import { AspectRatio } from '@tale-ui/react/aspect-ratio';`

Experimental native CSS aspect-ratio container for responsive media and other
content. AspectRatio does not clone or alter its children.

## Props

| Prop        | Type                                                             | Default | Description                                        |
| ----------- | ---------------------------------------------------------------- | ------- | -------------------------------------------------- |
| `ratio`     | `number \| \`${number}/${number}\` \| \`${number} / ${number}\`` | `1`     | Positive width-to-height ratio                     |
| `objectFit` | `"cover" \| "contain"`                                           | —       | Sizing for direct-child `img` and `video` elements |
| `children`  | `React.ReactNode`                                                | —       | Content rendered without cloning                   |

AspectRatio also accepts native `<div>` attributes except
`dangerouslySetInnerHTML`. Tale owns `style.aspectRatio`; other inline style
fields remain available.

## Basic Usage

```tsx
import { AspectRatio } from '@tale-ui/react/aspect-ratio';
import { Image } from '@tale-ui/react/image';

export function ResponsiveLandscape() {
  return (
    <AspectRatio ratio="16 / 9" objectFit="cover">
      <Image src="/landscape.jpg" alt="A mountain landscape" />
    </AspectRatio>
  );
}
```

Positive finite numbers and positive decimal pairs are accepted. Invalid
runtime ratios fall back to `1`. Invalid runtime `objectFit` values are omitted.
The fit selector applies only to direct-child native `img` and `video` elements.

## CSS Classes

- `.tale-aspect-ratio`
- `.tale-aspect-ratio--cover`
- `.tale-aspect-ratio--contain`

## Pitfalls

<!-- pitfall: aspect-ratio-direct-media -->

- **Keep fitted media direct children of `AspectRatio`** — `objectFit` intentionally targets only immediate `img` and `video` children.
  - anti-pattern: `<AspectRatio objectFit="cover"><div><Image src="/photo.jpg" alt="Landscape" /></div></AspectRatio>`
  - fix: `<AspectRatio objectFit="cover"><Image src="/photo.jpg" alt="Landscape" /></AspectRatio>`
