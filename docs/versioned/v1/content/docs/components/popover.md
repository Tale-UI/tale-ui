# Popover

`import { Popover } from '@tale-ui/react/popover';`

A positioned overlay anchored to a trigger button, with optional arrow and close button.

## Parts

| Part                  | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `Popover.Root`        | Manages open/close state.                                           |
| `Popover.Trigger`     | Button that toggles the popover.                                    |
| `Popover.Popup`       | Positioned overlay container. Accepts `placement` and `offset`.     |
| `Popover.Arrow`       | Arrow pointing to the trigger. Place inside `Popup` (auto-hoisted). |
| `Popover.Title`       | Heading with `slot="title"`.                                        |
| `Popover.Description` | Description paragraph.                                              |
| `Popover.Close`       | Button that closes the popover via `slot="close"`.                  |

## Props

Accepts all React Aria `DialogTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { Popover } from '@tale-ui/react/popover';

<Popover.Root>
  <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
    Open Popover
  </Popover.Trigger>
  <Popover.Popup placement="bottom" offset={8}>
    <Popover.Title>Popover Title</Popover.Title>
    <Popover.Description>This is a basic popover with a title and description.</Popover.Description>
  </Popover.Popup>
</Popover.Root>;
```

## Examples

### With Arrow

```tsx
<Popover.Root>
  <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
    With Arrow
  </Popover.Trigger>
  <Popover.Popup placement="bottom" offset={8}>
    <Popover.Arrow />
    <Popover.Title>Arrow Popover</Popover.Title>
    <Popover.Description>
      This popover includes an arrow pointing to the trigger.
    </Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

### With Close Button

```tsx
<Popover.Root>
  <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
    Open Popover
  </Popover.Trigger>
  <Popover.Popup placement="bottom" offset={8}>
    <Popover.Close aria-label="Close" />
    <Popover.Title>Dismissible Popover</Popover.Title>
    <Popover.Description>Click the close button to dismiss this popover.</Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

## CSS Classes

- `.tale-popover__popup` — Popover content container
- `.tale-popover__popup--frameless` — Uses a neutral-10 surface and removes the border color
- `.tale-popover__search-container` — Rounded neutral-10 wrapper for search controls inside popovers
- `.tale-popover__empty` — Inline padding for empty-state text inside popovers
- `.tale-popover__arrow` — Arrow element
- `.tale-popover__title` — Title heading
- `.tale-popover__description` — Description paragraph
- `.tale-popover__close` — Close button

## Pitfalls

<!-- cross-pitfall-ref: no-asChild-on-triggers -->
<!-- cross-pitfall-ref: no-button-inside-trigger -->
<!-- pitfall: use-popover-for-any-prompt -->

- **Use Popover for any prompt that asks for an info button, help popover, tooltip-like overlay, or button-triggered explanatory overlay** — render Popover.Root with Popover.Trigger and Popover.Popup containing Popover.Description; do not leave the file empty, return null, or substitute a different overlay. An 'info button that opens a popover with help text' is the canonical Popover use case — always generate code immediately without asking for clarification.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function FeatureHelpPopover() { return null; }`
  - anti-pattern: `export function FeatureHelpPopover() {}`
  - fix: `import { Popover } from '@tale-ui/react/popover'; import { Icon } from '@tale-ui/react/icon'; import { HelpCircle } from 'lucide-react'; export function FeatureHelpPopover() { return <Popover.Root><Popover.Trigger className="tale-button tale-button--neutral tale-button--md" aria-label="Show help"><Icon icon={HelpCircle} size="sm" /></Popover.Trigger><Popover.Popup placement="bottom" offset={8}><Popover.Description>This feature automatically saves your changes so you can leave and come back later.</Popover.Description></Popover.Popup></Popover.Root>; }`
  - complete example:

    ```tsx
    import { Popover } from '@tale-ui/react/popover';
    import { Icon } from '@tale-ui/react/icon';
    import { HelpCircle } from 'lucide-react';

    export function FeatureHelpPopover() {
      return (
        <Popover.Root>
          <Popover.Trigger
            className="tale-button tale-button--neutral tale-button--md"
            aria-label="Show help"
          >
            <Icon icon={HelpCircle} size="sm" />
          </Popover.Trigger>
          <Popover.Popup placement="bottom" offset={8}>
            <Popover.Description>
              This feature automatically saves your changes so you can leave and come back later.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Root>
      );
    }
    ```

## Notes

- **Do not nest `<Button>` inside `<Popover.Trigger>`.** `Popover.Trigger` is a React Aria `Button` — nesting another `<Button>` creates invalid `<button><button>` HTML. Instead, apply button styling via `className="tale-button tale-button--{variant} tale-button--{size}"` directly on `Popover.Trigger`.
- **`Popover.Close` is for the icon-only X button** (positioned top-right via `tale-popover__close`). For styled action buttons inside the popover, use `<Button>` instead.
- `Popover.Arrow` can be placed anywhere inside `Popup` -- it is automatically hoisted to be a direct child of the RA Popover (required by React Aria).
- Supported `placement` values: `"top"`, `"bottom"`, `"left"`, `"right"`. Also supports `shouldFlip` (default true) and `crossOffset` for fine-tuned positioning.
- The popover is dismissible by default — closes on Escape key or clicking outside.
- The popup receives a `data-placement` attribute reflecting the actual rendered position (may differ from requested if flipped).
- **`--trigger-width` CSS custom property** (new in React Aria 1.17/1.18): standalone popovers now expose `--trigger-width` on the popup, matching the trigger element's width. Useful for menu-like popovers that should be exactly as wide as their trigger, e.g. `.tale-popover__popup { width: var(--trigger-width); }`.
