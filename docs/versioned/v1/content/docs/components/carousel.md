# Carousel

`import { Carousel } from '@tale-ui/react/carousel';`

Embla-powered slide carousel with navigation controls and indicator dots.

## Parts

| Part | Description |
|------|-------------|
| `Carousel.Root` | Container (`<div role="region">`). Default `aria-label="Carousel"`. Accepts `loop`, `autoplay`, `slidesPerView`, `orientation`. |
| `Carousel.Content` | Scrollable viewport. Receives the Embla ref internally. |
| `Carousel.Item` | Individual slide (`<div role="group">`). |
| `Carousel.PreviousTrigger` | Navigate to previous slide. Renders `ChevronLeft` icon by default. |
| `Carousel.NextTrigger` | Navigate to next slide. Renders `ChevronRight` icon by default. |
| `Carousel.Indicators` | Container for indicator dots (`<div role="tablist">`). |
| `Carousel.Indicator` | Dot button that scrolls to a specific slide. Accepts `index`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loop` | `boolean` | `false` | Enable infinite looping |
| `autoplay` | `boolean` | `false` | Auto-advance slides (4s interval) |
| `slidesPerView` | `number` | `1` | Number of slides visible at once |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Scroll direction |

### Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | — | Zero-based slide index (required) |

All other parts accept only an optional `className`.

## Basic Usage

```tsx
<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
  <Carousel.PreviousTrigger />
  <Carousel.NextTrigger />
</Carousel.Root>
```

## Examples

### With Indicators

```tsx
<Carousel.Root loop>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
  <Carousel.PreviousTrigger />
  <Carousel.NextTrigger />
  <Carousel.Indicators>
    <Carousel.Indicator index={0} />
    <Carousel.Indicator index={1} />
    <Carousel.Indicator index={2} />
  </Carousel.Indicators>
</Carousel.Root>
```

### Vertical

```tsx
<Carousel.Root orientation="vertical" style={{ height: 300 }}>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Autoplay with Loop

```tsx
<Carousel.Root autoplay loop>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

## CSS Classes

- `.tale-carousel` — Root container
- `.tale-carousel[data-orientation="vertical"]` — Vertical orientation
- `.tale-carousel__content` — Overflow viewport
- `.tale-carousel__container` — Inner flex container
- `.tale-carousel__item` — Individual slide
- `.tale-carousel__previous` — Previous navigation button
- `.tale-carousel__next` — Next navigation button
- `.tale-carousel__indicators` — Indicator dots container
- `.tale-carousel__indicator` — Individual indicator dot
- `.tale-carousel__indicator[data-selected]` — Active indicator

## Pitfalls

<!-- pitfall: carousel-correct-trigger-names -->
<!-- multi-idea-ok -->
- **Uses `Carousel.PreviousTrigger` and `Carousel.NextTrigger`** — NOT `PreviousButton` or `NextButton`.
  - anti-pattern: `<Carousel.PreviousButton />`
  - fix: `<Carousel.PreviousTrigger />`
  - complete example:
    ```tsx
    import { Carousel } from '@tale-ui/react/carousel';

    export function Example() {
      return (
        <Carousel.Root loop>
          <Carousel.Content>
            <Carousel.Item>Slide 1</Carousel.Item>
            <Carousel.Item>Slide 2</Carousel.Item>
            <Carousel.Item>Slide 3</Carousel.Item>
          </Carousel.Content>
          <Carousel.PreviousTrigger />
          <Carousel.NextTrigger />
        </Carousel.Root>
      );
    }
    ```

<!-- pitfall: carousel-no-slide-index-props -->
<!-- prose-only -->
- **No `selectedIndex`, `onSelectedIndexChange`, `currentSlide`, or `onSlideChange` props** — navigation is handled internally via Embla; use `Carousel.Indicator` with an `index` prop for dot navigation.

<!-- pitfall: carousel-no-dom-query -->
- **Never use `document.querySelector` in carousel code** — all carousel interaction is managed through the component API and context internally.
  - anti-pattern: `document.querySelector('.carousel-slide').scrollIntoView()`
  - fix: `// Use Carousel.Indicator or Carousel.PreviousTrigger/NextTrigger`

## Notes

- Requires `embla-carousel-react` as a peer dependency. Install it separately: `npm install embla-carousel-react embla-carousel`.
- Autoplay uses a 4-second interval and pauses automatically on hover and keyboard focus (WCAG 2.2.2).
- The content viewport uses `aria-live="polite"` to announce slide changes. During autoplay, `aria-live` is set to `"off"` to avoid constant announcements.
- Navigation triggers are automatically disabled when there are no more slides to scroll (unless `loop` is enabled).
- Root has a default `aria-label="Carousel"`. Override with `aria-label` or `aria-labelledby` for more specific labelling.
- Each `Item` has `role="group"` and `aria-roledescription="slide"` for screen reader support.
