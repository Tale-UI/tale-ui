# IPhoneMockup

`import { IPhoneMockup } from '@tale-ui/react/iphone-mockup';`

Decorative SVG iPhone frame with an embedded screenshot. Supports light and dark mode images. The component renders a `314 × 640` SVG by default; scale it using `width`/`height` props or CSS on a wrapper element.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| image | `string` | required | URL of the screenshot or image to display on the phone screen |
| imageDark | `string` | -- | Optional dark-mode variant. When provided, `image` is shown in light mode and `imageDark` in dark mode |
| theme | `'light' \| 'dark'` | -- | Forces the phone chrome colour. When omitted it inherits the nearest `data-color-mode` ancestor |

Also accepts all standard `<svg>` HTML attributes (`className`, `style`, `aria-*`, etc.).

## Basic Usage

```tsx
import { IPhoneMockup } from '@tale-ui/react/iphone-mockup';

<IPhoneMockup image="/screenshots/home.png" />
```

## Examples

### With separate dark-mode screenshot

```tsx
<IPhoneMockup
  image="/screenshots/home-light.png"
  imageDark="/screenshots/home-dark.png"
/>
```

### Scaled to a specific width

```tsx
{/* The SVG viewBox is 314 × 640; set width and height scales proportionally */}
<IPhoneMockup image="/screenshots/home.png" width={240} height={490} />
```

### Forced dark chrome

```tsx
<IPhoneMockup image="/screenshots/dark-home.png" theme="dark" />
```

### In a flex container

```tsx
<div className="flex gap-8 justify-center">
  <IPhoneMockup image="/screenshots/onboarding.png" width={200} height={408} />
  <IPhoneMockup image="/screenshots/dashboard.png" width={200} height={408} />
</div>
```

## CSS Classes

- `.tale-iphone-mockup` — Root SVG element
- `.tale-iphone-mockup__image` — Light-mode image (`display: none` in dark mode when `imageDark` is provided)
- `.tale-iphone-mockup__image--dark` — Dark-mode image (`display: none` in light mode)

## Pitfalls

<!-- pitfall: iphone-mockup-image-required -->
- **`image` is required** — omitting it causes the screen area to be empty.
  - anti-pattern: `<IPhoneMockup />`
  - fix: `<IPhoneMockup image="/screenshot.png" />`

<!-- pitfall: iphone-mockup-image-size -->
<!-- prose-only -->
- **Image size should ideally be 750 × 1624 px** — the SVG pattern is sized to this resolution. Other resolutions will be stretched or compressed.
<!-- pitfall: the-exported-name-is-iphonemockup -->
- **The exported name is IPhoneMockup (capital P), not IphoneMockup** — the import destructure and JSX tag must use `IPhoneMockup`; `IphoneMockup` (lowercase 'p') does not exist as an export and causes a missing-component error.
  - anti-pattern: `import { IphoneMockup } from '@tale-ui/react/iphone-mockup';`
  - fix: `import { IPhoneMockup } from '@tale-ui/react/iphone-mockup';`

## Notes

- Custom component — not built on a React Aria primitive.
- Uses `React.useId()` to guarantee unique SVG `id` attributes when multiple instances appear on the same page.
- Dark-mode toggling is handled via CSS display rules keyed on `[data-color-mode="dark"]` on an ancestor element.
