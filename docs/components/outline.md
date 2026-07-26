# Outline

`import { Outline } from '@tale-ui/react/outline';`

Experimental document navigation that renders a named landmark with nested
ordered lists and can keep an active heading in sync through
`IntersectionObserver`.

## Props

| Prop                 | Type                                                               | Default                | Description                                                       |
| -------------------- | ------------------------------------------------------------------ | ---------------------- | ----------------------------------------------------------------- |
| `items`              | `readonly OutlineItem[]`                                           | —                      | Ordered headings with logical IDs, target IDs, labels, and levels |
| `aria-label`         | `string`                                                           | —                      | Accessible name; mutually exclusive with `aria-labelledby`        |
| `aria-labelledby`    | `string`                                                           | —                      | Naming element ID; mutually exclusive with `aria-label`           |
| `activeId`           | `string \| null`                                                   | —                      | Controlled active logical ID                                      |
| `defaultActiveId`    | `string \| null`                                                   | `null`                 | Initial uncontrolled active logical ID                            |
| `onActiveChange`     | `(id: string \| null) => void`                                     | —                      | Called for accepted click and observation proposals               |
| `onAction`           | `(id: string, event: React.MouseEvent<HTMLAnchorElement>) => void` | —                      | Runs first for unmodified primary link activation                 |
| `observeTargets`     | `boolean`                                                          | `true`                 | Enables active-heading observation                                |
| `getObserverRoot`    | `(nav: HTMLElement) => Element \| Document \| null`                | `() => null`           | Resolves an observer root in the Outline owner document           |
| `observerRootMargin` | `string`                                                           | `"0px 0px -70% 0px"`   | Observer root margin                                              |
| `observerThreshold`  | `number \| readonly number[]`                                      | `[0, .25, .5, .75, 1]` | Observer threshold values                                         |

Outline also accepts native `<nav>` attributes except `children`, `role`,
accessible naming fields, `onChange`, and `dangerouslySetInnerHTML`.

```ts
interface OutlineItem {
  id: string;
  targetId: string;
  label: string;
  level: number;
}
```

## Basic Usage

```tsx
import { Outline } from '@tale-ui/react/outline';

const items = [
  { id: 'overview', targetId: 'overview', label: 'Overview', level: 1 },
  { id: 'setup', targetId: 'setup', label: 'Setup', level: 2 },
  { id: 'api', targetId: 'api', label: 'API', level: 1 },
] as const;

export function ArticleOutline() {
  return <Outline aria-label="On this page" items={items} />;
}
```

The first item must have level `1`. Levels may increase by one or return to an
existing ancestor level. Logical IDs and target IDs must be unique,
non-whitespace strings without fragment or control characters.

## Active State

Use `activeId` for controlled state or `defaultActiveId` for uncontrolled
state. The mode is fixed for the lifetime of a mounted Outline. Invalid
generations show no active marker and pause Tale actions and observation until
the original mode becomes valid again.

An uncontrolled active ID removed by a new item collection is cleared and
reported once. Reordering preserves a present logical ID. Changes to
`defaultActiveId` after initialization are ignored.

`onAction` runs before the click proposes active state. Calling
`event.preventDefault()` in `onAction` suppresses that proposal. Modified and
non-primary activations retain native link behavior without proposing state.

Targets are resolved only with the rendered navigation element's
`ownerDocument`. Invalid observer settings disable observation without
disabling otherwise valid click behavior.

## CSS Classes

- `.tale-outline`
- `.tale-outline__list`
- `.tale-outline__list--nested`
- `.tale-outline__item`
- `.tale-outline__link`

## Pitfalls

- Keep `id` stable as the logical active-state identity and use `targetId` for
  the document heading ID. Reordering stable logical IDs preserves selection.
- Remount Outline to switch between controlled and uncontrolled active state.
