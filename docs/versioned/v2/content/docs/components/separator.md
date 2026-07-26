# Separator

`import { Separator } from '@tale-ui/react/separator';`

A visual divider between content sections, supporting horizontal and vertical orientations.

## Props

Accepts all React Aria `Separator` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Separator />
```

## Examples

### Vertical

```tsx
<div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 'var(--space-m)' }}>
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>
```

### Between Content Blocks

```tsx
<div>
  <p>First block of content.</p>
  <Separator />
  <p>Second block of content.</p>
</div>
```

## CSS Classes

- `.tale-separator` — Base (horizontal by default)
- `.tale-separator--vertical` — Vertical orientation modifier

## Pitfalls

<!-- pitfall: separator-no-margin-padding-props -->
- **Does NOT accept margin, padding, or other CSS shorthand as direct props** — use the `style` prop or a custom `className` for spacing adjustments.
  - anti-pattern: `<Separator margin="16px" />`
  - fix: `<Separator style={{ margin: '16px' }} />`
  - complete example:
    ```tsx
    import { Separator } from '@tale-ui/react/separator';

    export function Example() {
      return (
        <>
          <Separator />
          <Separator orientation="vertical" />
        </>
      );
    }
    ```

<!-- pitfall: separator-only-orientation-and-html-attrs -->
<!-- multi-idea-ok -->
- **Only accepts `orientation` and standard HTML attributes** — no additional Tale UI-specific props exist.
  - anti-pattern: `<Separator gap="16px" />`
  - fix: `<Separator style={{ margin: '16px' }} />`

## Notes

- Built on React Aria `Separator`.
- Defaults to `orientation="horizontal"`. Pass `orientation="vertical"` for a vertical line.
- The `--vertical` modifier class is applied automatically when `orientation="vertical"`.
