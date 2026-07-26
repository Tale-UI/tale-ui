# @tale-ui/utils

Public shared utilities for Tale UI packages and advanced consumers. Most React
consumers receive it transitively through `@tale-ui/react`; import it directly
only when using its documented hooks, colour utilities, or DOM helpers.

## Colour Utilities

```ts
import { generatePalette, randomBaseColor, NAMED_SHADES } from '@tale-ui/utils/color';
```

| Export                           | Description                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `generatePalette(baseHex, mode)` | Generate an 11-shade tonal palette from a base hex colour (OKLCH math via culori) |
| `randomBaseColor(mode)`          | Generate a random base hex that passes WCAG contrast validation                   |
| `NAMED_SHADES`                   | `[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`                                    |
| `NEUTRAL_SHADES`                 | Full 27-shade neutral scale                                                       |
| `getContrastRatio(hex1, hex2)`   | WCAG contrast ratio between two hex colours                                       |
| `getRelativeLuminance(hex)`      | WCAG relative luminance of a hex colour                                           |

## React Hooks

Import each utility from its file-based subpath, for example:

```ts
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
```

| Hook                      | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `useId`                   | Generate a stable ID with an optional override       |
| `useMergedRefs`           | Merge React callback and object refs                 |
| `useMergedRefsN`          | Merge a dynamic ref collection                       |
| `useStableCallback`       | Keep callback identity stable while reading new code |
| `useAnimationFrame`       | Manage an animation-frame loop                       |
| `useInterval`             | Manage an interval lifecycle                         |
| `useTimeout`              | Manage a timeout lifecycle                           |
| `useOnMount`              | Run an effect on mount                               |
| `useIsoLayoutEffect`      | Use an SSR-safe layout effect                        |
| `useRefWithInit`          | Lazily initialise a ref                              |
| `useEnhancedClickHandler` | Distinguish pointer and keyboard click interactions  |

## DOM Helpers

| Subpath              | Exports                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `owner`              | `ownerWindow`, `ownerDocument`, `activeElement`, `contains`, and `getTarget`         |
| `getReactElementRef` | `getReactElementRef` for reading a React element's ref                               |
| `visuallyHidden`     | `visuallyHidden` and `visuallyHiddenInput` CSS-in-JS objects                         |
| `detectBrowser`      | Browser and platform flags such as `isWebKit`, `isIOS`, `isFirefox`, and `isAndroid` |

## General

| Subpath        | Exports                                                               |
| -------------- | --------------------------------------------------------------------- |
| `mergeObjects` | `mergeObjects` for recursively combining compatible object properties |
| `empty`        | Frozen `EMPTY_ARRAY`, `EMPTY_OBJECT`, and `NOOP` shared constants     |
| `warn`         | Development-oriented `warn` helper                                    |
| `error`        | Public error formatting and test reset helpers                        |

The file-based exports declared in [`package.json`](package.json) and the files
present in the published build are authoritative. Import only named subpaths;
there is no root barrel export.

## License

MIT
