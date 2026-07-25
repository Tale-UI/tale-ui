# Tooltip

`import { Tooltip } from '@tale-ui/react/tooltip';`

A hover/focus-triggered tooltip with optional arrow and configurable placement.

## Parts

| Part | Description |
|------|-------------|
| `Tooltip.Root` | Manages hover/focus state. Accepts `delay` prop. |
| `Tooltip.Trigger` | Element that triggers the tooltip on hover/focus. |
| `Tooltip.Popup` | The tooltip overlay. Accepts `placement` and `offset`. |
| `Tooltip.Arrow` | Arrow pointing to the trigger. |
| `Tooltip.Title` | Bold main text for structured tooltips. |
| `Tooltip.Description` | Supporting text (lighter weight/opacity). |

## Props

Accepts all React Aria `TooltipTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { Tooltip } from '@tale-ui/react/tooltip';

<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    This is a tooltip
  </Tooltip.Popup>
</Tooltip.Root>
```

## Examples

### All Placements

```tsx
{(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
  <Tooltip.Root key={placement}>
    <Tooltip.Trigger>{placement}</Tooltip.Trigger>
    <Tooltip.Popup placement={placement} offset={8}>
      <Tooltip.Arrow />
      Tooltip on {placement}
    </Tooltip.Popup>
  </Tooltip.Root>
))}
```

### With Supporting Text

```tsx
<Tooltip.Root>
  <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">Feature info</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    <Tooltip.Title>Feature Name</Tooltip.Title>
    <Tooltip.Description>This feature allows you to do something useful.</Tooltip.Description>
  </Tooltip.Popup>
</Tooltip.Root>
```

### With Delay

```tsx
<Tooltip.Root delay={500}>
  <Tooltip.Trigger>500ms delay</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    Appeared after 500ms
  </Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root delay={0}>
  <Tooltip.Trigger>No delay</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    Instant tooltip
  </Tooltip.Popup>
</Tooltip.Root>
```

## CSS Classes

- `.tale-tooltip__trigger` — Trigger element
- `.tale-tooltip__popup` — Tooltip container
- `.tale-tooltip__arrow` — Arrow element
- `.tale-tooltip__title` — Title text (semibold)
- `.tale-tooltip__description` — Supporting text (lighter weight/opacity)

## Pitfalls

<!-- pitfall: tooltip-text-in-popup -->
- **Tooltip text goes in `Tooltip.Popup`, not as children of `Tooltip.Trigger`** — content inside `Trigger` renders as part of the interactive element, not the tooltip.
  - anti-pattern: `<Tooltip.Trigger>Click me<span>Tooltip text</span></Tooltip.Trigger>`
  - fix: `<Tooltip.Trigger>Click me</Tooltip.Trigger><Tooltip.Popup>Tooltip text</Tooltip.Popup>`
  - complete example:
    ```tsx
    import { Tooltip } from '@tale-ui/react/tooltip';

    export function Example() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">Hover me</Tooltip.Trigger>
          <Tooltip.Popup placement="top" offset={8}>
            <Tooltip.Arrow />
            Tooltip text
          </Tooltip.Popup>
        </Tooltip.Root>
      );
    }
    ```

<!-- cross-pitfall-ref: no-asChild-on-triggers -->

## Notes

- **Trigger needs explicit `tale-button` classes.** `Tooltip.Trigger` applies `tale-tooltip__trigger` (no styling). Add `className="tale-button tale-button--{variant}"` for button styling.
- Pass `delay={ms}` to `Tooltip.Root` to control how long before the tooltip appears (default is React Aria's built-in delay).
- Tooltip content is plain text or inline elements -- not interactive. Use `Popover` for interactive overlays.
- The `Tooltip.Arrow` renders an SVG arrow that automatically rotates based on placement.
- The popup receives a `data-placement` attribute (`top`, `bottom`, `left`, `right`) reflecting the actual rendered position (may differ from the requested placement if flipped by React Aria).
