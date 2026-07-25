# VideoPlayer

`import { VideoPlayer } from '@tale-ui/react/video-player';`

Full-featured video player with custom controls built on the native `<video>` element. No additional peer dependencies required beyond `lucide-react`.

## Parts

| Part | Description |
|------|-------------|
| `VideoPlayer.Root` | The complete video player. All controls and state are encapsulated. |

## Props

### VideoPlayer.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | URL of the video |
| `type` | `string` | `'video/mp4'` | MIME type of the video |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Player size — affects control layout. `sm` hides the progress bar; `lg` shows the volume slider and speed control |
| `autoPlay` | `boolean` | `false` | Auto-play on mount |
| `thumbnailUrl` | `string` | — | URL of a thumbnail image shown before playback |
| `thumbnailAlt` | `string` | — | Alt text for the thumbnail |
| `showThumbnailOverlay` | `boolean` | — | Show a subtle dark overlay on the thumbnail |
| `className` | `string` | — | Additional CSS class |

Also supports an imperative `ref` of type `VideoPlayerRef`.

## Imperative Ref

```ts
interface VideoPlayerRef {
  play(): void;
  pause(): void;
  readonly paused: boolean;
  readonly videoElement: HTMLVideoElement | null;
}
```

## Keyboard Shortcuts

When the video container or `<video>` element is focused:

| Key | Action |
|-----|--------|
| `Space` / `K` | Play / Pause |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
| `←` | Seek back 10 s |
| `→` | Seek forward 10 s |
| `↑` | Volume +10% |
| `↓` | Volume −10% |

## Basic Usage

```tsx
import { VideoPlayer } from '@tale-ui/react/video-player';

<VideoPlayer.Root src="/intro.mp4" size="md" />
```

## Examples

### With Thumbnail

```tsx
<VideoPlayer.Root
  src="/demo.mp4"
  thumbnailUrl="/thumb.jpg"
  thumbnailAlt="Product demo"
  size="lg"
/>
```

### Imperative Control

```tsx
import { VideoPlayer } from '@tale-ui/react/video-player';
import type { VideoPlayerRef } from '@tale-ui/react/video-player';
import { useRef } from 'react';

function Example() {
  const playerRef = useRef<VideoPlayerRef>(null);

  return (
    <>
      <VideoPlayer.Root ref={playerRef} src="/clip.mp4" size="md" />
      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.pause()}>Pause</button>
    </>
  );
}
```

### All Sizes

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
  <VideoPlayer.Root src="/clip.mp4" size="sm" />
  <VideoPlayer.Root src="/clip.mp4" size="md" />
  <VideoPlayer.Root src="/clip.mp4" size="lg" />
</div>
```

## CSS Classes

- `.tale-video-player` — Root container
- `.tale-video-player--sm` / `--md` / `--lg` — Size modifiers
- `.tale-video-player__video` — The `<video>` element
- `.tale-video-player__thumbnail` — Thumbnail overlay wrapper
- `.tale-video-player__thumbnail--visible` — Visible state of thumbnail
- `.tale-video-player__thumbnail-img` — Thumbnail image
- `.tale-video-player__thumbnail-play` — Centered play button overlay on thumbnail
- `.tale-video-player__thumbnail-play-icon` — Play icon SVG
- `.tale-video-player__thumbnail-overlay` — Optional dark overlay on thumbnail
- `.tale-video-player__controls` — Control bar
- `.tale-video-player__controls--visible` — Visible state of control bar (shown on hover/focus)
- `.tale-video-player__controls-inner` — Inner flex row
- `.tale-video-player__btn` — Icon button
- `.tale-video-player__btn-icon` — Icon inside button
- `.tale-video-player__volume` — Volume control wrapper (`lg` only)
- `.tale-video-player__volume-slider` — Volume range input
- `.tale-video-player__progress-area` — Progress + time row
- `.tale-video-player__progress-area--hidden` — Hidden on `sm` size
- `.tale-video-player__progress` — Clickable progress track (large hit area)
- `.tale-video-player__progress-bar` — Visible bar
- `.tale-video-player__progress-buffered` — Buffered segment(s)
- `.tale-video-player__progress-fill` — Current time fill
- `.tale-video-player__progress-hover-line` — Vertical hover indicator
- `.tale-video-player__progress-hover-time` — Floating time on hover
- `.tale-video-player__time` — Time text (current / remaining)
- `.tale-video-player__speed-btn` — Speed toggle button (`lg` only)
- `.tale-video-player__speed-label` — Numeric speed label
- `.tale-video-player__speed-x` — "×" icon next to speed label

## Notes

- Controls appear on hover or when the container receives focus.
- Double-clicking the video toggles fullscreen.
- The progress track has a large invisible hit area (padding) to make scrubbing easy on touch devices.

## Pitfalls

<!-- pitfall: videoplayerroot-does-not-accept-a -->
- **VideoPlayer.Root does NOT accept a style prop — wrap it in a layout element to control width or maxWidth** — `VideoPlayer.Root` only supports its documented component props plus `className`; passing inline layout styles directly to it causes a TypeScript error because `style` is not part of `VideoPlayerProps`.
  - anti-pattern: `<VideoPlayer.Root src="/demo.mp4" size="md" thumbnailUrl="/thumb.jpg" thumbnailAlt="Product demo" style={{ width: '40rem', maxWidth: '100%' }} />`
  - fix: `<div style={{ width: '40rem', maxWidth: '100%' }}><VideoPlayer.Root src="/demo.mp4" size="md" thumbnailUrl="/thumb.jpg" thumbnailAlt="Product demo" /></div>`
