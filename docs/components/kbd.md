# Kbd

`import { Kbd } from '@tale-ui/react/kbd';`

Experimental semantic keyboard input and shortcut hint.

## Props

| Prop   | Type            | Default | Description |
| ------ | --------------- | ------- | ----------- |
| `size` | `"sm" \| "md"` | `"md"`  | Visual size |

Also accepts native `<kbd>` attributes.

## Basic Usage

```tsx
import { Kbd } from '@tale-ui/react/kbd';
import { Text } from '@tale-ui/react/text';

export function SearchShortcut() {
  return (
    <Text>
      Open search with <Kbd>⌘</Kbd> <Kbd>K</Kbd>
    </Text>
  );
}
```

Use platform-appropriate, localized key names. Kbd only represents input; it
does not register a shortcut or implement keyboard behavior.

## CSS Classes

- `.tale-kbd`
- `.tale-kbd--sm`
- `.tale-kbd--md`

## Pitfalls

<!-- pitfall: kbd-no-shortcut-behavior -->

- **Do not use `Kbd` to register shortcuts** — it is semantic display content, so application keyboard behavior remains separate.
  - anti-pattern: `<Kbd onKeyDown={openSearch}>⌘ K</Kbd>`
  - fix: `<Text>Open search with <Kbd>⌘</Kbd> <Kbd>K</Kbd></Text>`
