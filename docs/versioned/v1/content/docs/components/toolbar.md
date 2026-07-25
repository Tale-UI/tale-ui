# Toolbar

`import { Toolbar } from '@tale-ui/react/toolbar';`

A horizontal toolbar grouping actions, links, and inputs with keyboard navigation.

## Parts

| Part | Description |
|------|-------------|
| `Toolbar.Root` | Container. Accepts `aria-label`. |
| `Toolbar.Group` | Groups related toolbar items together. |
| `Toolbar.Button` | A toolbar action button. |
| `Toolbar.Link` | A toolbar link. |
| `Toolbar.Input` | A text input inside the toolbar. |
| `Toolbar.Separator` | A visual divider between groups. |

## Props

Accepts all React Aria `Toolbar` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Toolbar.Root aria-label="Formatting">
  <Toolbar.Group>
    <Toolbar.Button>Bold</Toolbar.Button>
    <Toolbar.Button>Italic</Toolbar.Button>
    <Toolbar.Button>Underline</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Button>Left</Toolbar.Button>
    <Toolbar.Button>Center</Toolbar.Button>
    <Toolbar.Button>Right</Toolbar.Button>
  </Toolbar.Group>
</Toolbar.Root>
```

## Examples

### With Input

```tsx
<Toolbar.Root aria-label="Search toolbar">
  <Toolbar.Group>
    <Toolbar.Button>Filter</Toolbar.Button>
    <Toolbar.Button>Sort</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Input placeholder="Search..." aria-label="Search" />
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Button>Reset</Toolbar.Button>
  </Toolbar.Group>
</Toolbar.Root>
```

## CSS Classes

- `.tale-toolbar` — Base
- `.tale-toolbar__group` — Button/item group
- `.tale-toolbar__button` — Action button
- `.tale-toolbar__link` — Link element
- `.tale-toolbar__input` — Text input (also applies `.tale-input`)
- `.tale-toolbar__separator` — Divider

## Pitfalls

<!-- pitfall: toolbar-button-html-attrs-only -->
- **`Toolbar.Button` only accepts standard HTML button attributes** — `Toolbar.Button` does not accept `onPress`, `isSelected`, `onChange`, or `defaultSelected`. Use `onClick`, `aria-label`, and `disabled` instead.
  - anti-pattern: `<Toolbar.Button onPress={handlePress} isSelected={active} />`
  - fix: `<Toolbar.Button onClick={handlePress} aria-pressed={active} />`
  - complete example:
    ```tsx
    import { Toolbar } from '@tale-ui/react/toolbar';

    export function Example() {
      return (
        <Toolbar.Root aria-label="Formatting">
          <Toolbar.Group>
            <Toolbar.Button>Bold</Toolbar.Button>
            <Toolbar.Button>Italic</Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group>
            <Toolbar.Button>Left</Toolbar.Button>
            <Toolbar.Button>Center</Toolbar.Button>
          </Toolbar.Group>
        </Toolbar.Root>
      );
    }
    ```

<!-- pitfall: toolbar-no-standalone-toolbar-button -->
- **No standalone `ToolbarButton` named export** — There is no top-level `ToolbarButton` export. Always use `Toolbar.Button` accessed through the namespace.
  - anti-pattern: `import { ToolbarButton } from '@tale-ui/react/toolbar';`
  - fix: `import { Toolbar } from '@tale-ui/react/toolbar'`

<!-- pitfall: toolbar-toggle-use-toggle-button -->
- **For toggleable toolbar buttons, use `<ToggleButton>` from `@tale-ui/react/toggle-button`** — Place a `ToggleButton` inside the toolbar instead of `Toolbar.Button` when toggling state is needed.
  - anti-pattern: `<Toolbar.Button isSelected={bold} onChange={setBold}>Bold</Toolbar.Button>`
  - fix: `<ToggleButton isSelected={bold} onChange={setBold}>Bold</ToggleButton>`

## Notes

- `Toolbar.Root` wraps React Aria `Toolbar`, providing arrow-key navigation between focusable children.
- `Toolbar.Input` automatically gets the `.tale-input` class in addition to `.tale-toolbar__input`.
