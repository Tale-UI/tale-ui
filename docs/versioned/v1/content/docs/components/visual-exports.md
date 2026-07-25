# Visual-Only Exports

Visual-only exports render component indicators (checkbox box, radio circle, switch toggle, toggle button) **without** React Aria behaviour — no keyboard handling, no focus management, no ARIA attributes.

## Important: Component Authors Only

**Do not use Visual exports to build application UIs.** When generating pages, forms, or interactive experiences, always use the standard interactive controls (`CheckboxField.Root`, `RadioField.Root` inside `RadioGroup`, `SwitchField.Root`, `ToggleButton`) which include full accessibility behaviour.

Visual exports are `aria-hidden="true"` and provide **zero** keyboard or screen reader support on their own. Using them in place of standard components creates inaccessible interfaces.

## When to Use

Use Visual exports **only** when building new compound components or component variations where behaviour is provided by a different source:

- Embedding a checkbox visual inside a `Menu.Item` (Menu handles selection)
- Creating a custom card-based radio group where the card handles interaction
- Building a read-only settings summary with toggle visuals
- Composing a drag-and-drop list where items show toggle state

## Available Exports

| Export | Renders | BEM Class |
|--------|---------|-----------|
| `Checkbox.Visual` | Checkbox indicator box | `tale-checkbox__indicator` |
| `Radio.Visual` | Radio indicator circle | `tale-radio__indicator` |
| `Switch.Visual` | Switch track + thumb | `tale-switch` + `tale-switch__thumb` |
| `ToggleButtonVisual` | Toggle button container | `tale-toggle-button` |

All Visual components accept:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the visual appears in its active/selected state |
| `className` | `string` | — | Additional CSS class name |

`ToggleButtonVisual` also accepts `size` (`'sm' | 'md' | 'lg'`, default `'md'`).

## Examples

### Checkbox Visual in a Menu Item

```tsx
import { Checkbox } from '@tale-ui/react/checkbox';
import { Menu } from '@tale-ui/react/menu';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

<Menu.Item onAction={toggleNotifications}>
  <Checkbox.Visual checked={notificationsEnabled}>
    <Icon icon={Check} size="sm" />
  </Checkbox.Visual>
  Enable notifications
</Menu.Item>
```

### Radio Visual in a Custom Card

```tsx
import { Radio } from '@tale-ui/react/radio';

<div role="radio" aria-checked={isSelected} onClick={onSelect}>
  <Radio.Visual checked={isSelected} />
  <span>Option label</span>
</div>
```

### Switch Visual in a Read-Only Summary

```tsx
import { Switch } from '@tale-ui/react/switch';

<div className="settings-summary">
  <Switch.Visual checked={isEnabled} />
  <span>Dark mode</span>
</div>
```

## Notes

- Visual components reuse the same BEM classes as their interactive counterparts — all existing CSS applies.
- `data-selected` is set when `checked` is true, matching React Aria's data attribute convention.
- Visual components render no `<input>`, no `role`, and no keyboard listeners. The parent must provide all behaviour and accessibility.
