# ToggleButtonGroup

`import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';`

A convenience re-export of `ToggleButtonGroup` from `@tale-ui/react/toggle-button`. Both import paths resolve to the same component.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | — | Propagates size to child `ToggleButton` components |

Also accepts all React Aria `ToggleButtonGroup` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';
import { ToggleButton } from '@tale-ui/react/toggle-button';

<ToggleButtonGroup aria-label="Text formatting">
  <ToggleButton>Bold</ToggleButton>
  <ToggleButton>Italic</ToggleButton>
  <ToggleButton>Underline</ToggleButton>
</ToggleButtonGroup>
```

## Pitfalls

<!-- pitfall: toggle-group-no-radix-props -->
- **No Radix-style `type`, `value`, or `onValueChange` props** — use `selectionMode`, `selectedKeys`, `defaultSelectedKeys`, `onSelectionChange` instead.
  - anti-pattern: `<ToggleButtonGroup type="single" value={sel} onValueChange={setSel}>`
  - fix: `<ToggleButtonGroup selectionMode="single" selectedKeys={sel} onSelectionChange={setSel}>`
  - complete example:
    ```tsx
    import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';
    import { ToggleButton } from '@tale-ui/react/toggle-button';

    export function Example() {
      return (
        <ToggleButtonGroup aria-label="Text formatting">
          <ToggleButton>Bold</ToggleButton>
          <ToggleButton>Italic</ToggleButton>
          <ToggleButton>Underline</ToggleButton>
        </ToggleButtonGroup>
      );
    }
    ```

<!-- pitfall: toggle-group-requires-aria-label -->
- **Requires `aria-label` or `aria-labelledby`** — React Aria logs a console warning at runtime if neither is provided.
  - anti-pattern: `<ToggleButtonGroup selectionMode="single"><ToggleButton>Bold</ToggleButton></ToggleButtonGroup>`
  - fix: `<ToggleButtonGroup aria-label="Text formatting" selectionMode="single"><ToggleButton>Bold</ToggleButton></ToggleButtonGroup>`

<!-- pitfall: toggle-group-import-path -->
- **Import `ToggleButtonGroup` from `@tale-ui/react/toggle-group`, not `@tale-ui/react/toggle-button-group`** — the module path uses the shorter `toggle-group` name; importing from `@tale-ui/react/toggle-button-group` causes `Cannot find module` TypeScript errors.
  - anti-pattern: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-button-group';`
  - fix: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';`

<!-- cross-pitfall-ref: toggle-button-group-import-path -->
<!-- pitfall: use-togglebuttongroup-for-any-prompt -->
- **Use <ToggleButtonGroup> for any prompt that asks for a toggle button group, segmented alignment control, or mutually exclusive option set** — when the request is for grouped toggles such as text alignment (Left / Center / Right), view mode switchers, or any set of options where one or more can be selected, render ToggleButtonGroup (from @tale-ui/react/toggle-group) wrapping individual ToggleButton children (from @tale-ui/react/toggle-button) instead of leaving the file empty or substituting a different component. Both imports are always required together — ToggleButtonGroup alone renders nothing without ToggleButton children. Always pass aria-label and selectionMode to ToggleButtonGroup.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function TextAlignmentGroup() {}`
  - anti-pattern: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-group'; export function TextAlignmentGroup() { return <ToggleButtonGroup aria-label="Text alignment" selectionMode="single" />; }`
  - fix: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-group'; import { ToggleButton } from '@tale-ui/react/toggle-button'; export function TextAlignmentGroup() { return <ToggleButtonGroup aria-label="Text alignment" selectionMode="single"><ToggleButton>Left</ToggleButton><ToggleButton>Center</ToggleButton><ToggleButton>Right</ToggleButton></ToggleButtonGroup>; }`
  - complete example:
    ```tsx
    import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';
    import { ToggleButton } from '@tale-ui/react/toggle-button';

    export function TextAlignmentGroup() {
      return (
        <ToggleButtonGroup aria-label="Text alignment" selectionMode="single">
          <ToggleButton>Left</ToggleButton>
          <ToggleButton>Center</ToggleButton>
          <ToggleButton>Right</ToggleButton>
        </ToggleButtonGroup>
      );
    }
    ```

## Notes

- This is the same component as `ToggleButtonGroup` from `@tale-ui/react/toggle-button` — see [ToggleButton](toggle-button.md) for the full API, props, examples, and CSS classes.
- **Requires `aria-label` or `aria-labelledby`** for accessibility.
