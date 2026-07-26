# mergeProps

`import { mergeProps } from '@tale-ui/react/merge-props';`

Merges multiple sets of React props with smart handling for event handlers, `className`, and `style`.

## Props

Accepts any number of props objects. See the `@example` JSDoc on the export for usage.

## Basic Usage

```tsx
import { mergeProps } from '@tale-ui/react/merge-props';

const baseProps = { className: 'base', onClick: handleClick };
const extraProps = { className: 'extra', 'aria-label': 'Button' };

const merged = mergeProps(baseProps, extraProps);
// → { className: 'extra base', onClick: handleClick, 'aria-label': 'Button' }
```

## Merge Rules

| Prop type | Behaviour |
|-----------|-----------|
| `className` | Concatenated (rightmost first) |
| `style` | Shallow-merged (rightmost wins on conflicts) |
| `on*` event handlers | Chained — rightmost handler executes first; call `event.preventTaleUIHandler()` to stop prior handlers |
| Everything else | Rightmost value wins (Object.assign semantics) |

## Examples

### Merging Event Handlers

```tsx
const a = { onClick: () => console.log('a') };
const b = { onClick: () => console.log('b') };

const merged = mergeProps(a, b);
// Clicking calls: b handler first, then a handler
```

### Preventing Prior Handlers

```tsx
const a = { onClick: () => console.log('a') };
const b = { onClick: (e) => { e.preventTaleUIHandler(); console.log('b only'); } };

const merged = mergeProps(a, b);
// Clicking calls: b handler only — a handler is skipped
```

## Variants

```tsx
import { mergeProps, mergePropsN } from '@tale-ui/react/merge-props';
```

- `mergeProps(a, b, c?, d?, e?)` — merge up to 5 prop sets (best performance)
- `mergePropsN(propsArray)` — merge an arbitrary-length array of props (slightly lower performance)

## Notes

- `ref` is **not** merged — the rightmost ref wins.
- Accepts up to 5 arguments. For more, use `mergePropsN`.
- Props can be objects or functions that receive the merged-so-far props and return new props.
