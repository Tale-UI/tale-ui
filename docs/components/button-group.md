# ButtonGroup

`import { ButtonGroup } from '@tale-ui/react/button-group';`

Experimental React Aria `Group` wrapper for arranging related action controls.
It provides layout and group semantics, but no selection model.

## Props

| Prop              | Type                                    | Default        | Description                                           |
| ----------------- | --------------------------------------- | -------------- | ----------------------------------------------------- |
| `children`        | `React.ReactNode`                       | —              | Static action controls                                |
| `aria-label`      | `string`                                | —              | Direct accessible name                                |
| `aria-labelledby` | `string`                                | —              | ID of an element that names the group                 |
| `role`            | `'group' \| 'region' \| 'presentation'` | `'group'`      | Grouping role                                         |
| `orientation`     | `'horizontal' \| 'vertical'`            | `'horizontal'` | Layout axis                                           |
| `isAttached`      | `boolean`                               | `false`        | Joins the borders of compatible direct-child controls |
| `className`       | `string`                                | —              | Additional static class name                          |
| `style`           | `React.CSSProperties`                   | —              | Additional static inline styles                       |

`group` and `region` require exactly one non-empty `aria-label` or
`aria-labelledby`. A `presentation` group must not have either. Invalid runtime
combinations fail closed to an unnamed `presentation` role.

ButtonGroup also accepts the non-render-prop attributes and interaction state
props supported by React Aria `Group`, including `slot`, `isDisabled`,
`isInvalid`, and `isReadOnly`.

## Basic Usage

```tsx
import { Button } from '@tale-ui/react/button';
import { ButtonGroup } from '@tale-ui/react/button-group';

export function DocumentActions() {
  return (
    <ButtonGroup aria-label="Document actions">
      <Button>Save</Button>
      <Button variant="neutral">Share</Button>
    </ButtonGroup>
  );
}
```

## Attached Controls

Use `isAttached` when adjacent compatible controls should read as one visual
set. Orientation only changes layout; it does not add keyboard selection
behavior.

```tsx
<ButtonGroup aria-label="Text actions" isAttached>
  <Button>Cut</Button>
  <Button>Copy</Button>
  <Button>Paste</Button>
</ButtonGroup>

<ButtonGroup aria-label="Move item" orientation="vertical" isAttached>
  <Button>Move up</Button>
  <Button>Move down</Button>
</ButtonGroup>
```

## Presentational Layout

Use `role="presentation"` only when another component already provides the
required grouping semantics.

```tsx
<ButtonGroup role="presentation">
  <Button>Previous</Button>
  <Button>Next</Button>
</ButtonGroup>
```

## CSS Classes

- `.tale-button-group`
- `.tale-button-group--horizontal`
- `.tale-button-group--vertical`
- `.tale-button-group--attached`

## Pitfalls

<!-- pitfall: button-group-requires-one-accessible-name -->

- **Give semantic button groups exactly one accessible name** — `group` and `region` require one non-whitespace `aria-label` or `aria-labelledby`; use `role="presentation"` only for intentionally semantic-free layout.
  - anti-pattern: `<ButtonGroup><Button>Save</Button></ButtonGroup>`
  - anti-pattern: `<ButtonGroup aria-label="Actions" aria-labelledby="actions-heading"><Button>Save</Button></ButtonGroup>`
  - fix: `<ButtonGroup aria-label="Document actions"><Button>Save</Button></ButtonGroup>`

<!-- pitfall: button-group-is-not-selection -->

- **Do not use `ButtonGroup` for selectable choices** — it groups independent actions and does not provide roving focus, selected state, or single/multiple selection.
  - anti-pattern: `<ButtonGroup aria-label="Alignment"><ToggleButton id="left">Left</ToggleButton><ToggleButton id="right">Right</ToggleButton></ButtonGroup>`
  - fix: `<ToggleButtonGroup aria-label="Alignment"><ToggleButton id="left">Left</ToggleButton><ToggleButton id="right">Right</ToggleButton></ToggleButtonGroup>`

<!-- pitfall: button-group-static-rendering -->

- **Use static `ButtonGroup` rendering inputs** — render-function children, class names, and styles are intentionally excluded and blocked at runtime.
  - anti-pattern: `<ButtonGroup aria-label="Actions" className={({ isDisabled }) => isDisabled ? 'muted' : ''}>{({ isDisabled }) => <Button isDisabled={isDisabled}>Save</Button>}</ButtonGroup>`
  - fix: `<ButtonGroup aria-label="Actions" className="document-actions"><Button>Save</Button></ButtonGroup>`

## Notes

- Built on React Aria `Group`.
- Invalid runtime orientation values fall back to horizontal; invalid
  `isAttached` values fall back to detached.
- Attached styling targets direct Tale UI Button, IconButton, and ToggleButton
  controls.
- Function children, class names, styles, and `dangerouslySetInnerHTML` are
  blocked without invocation.
