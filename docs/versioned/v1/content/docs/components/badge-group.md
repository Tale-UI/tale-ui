# BadgeGroup

`import { BadgeGroup } from '@tale-ui/react/badge-group';`

A badge with a pinned leading or trailing addon text segment. Commonly used for version labels, counts, or supplementary context attached to a primary badge label.

## Parts

| Part | Element | Description |
|------|---------|-------------|
| `BadgeGroup.Root` | `<div>` | Compound root — renders the badge text plus the addon segment |

## Props — `BadgeGroup.Root`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| addonText | `string` | -- | Text shown in the pinned addon segment |
| size | `'md' \| 'lg'` | `'md'` | Badge size |
| color | `'brand' \| 'warning' \| 'error' \| 'gray' \| 'success'` | `'brand'` | Semantic color theme |
| theme | `'light' \| 'modern'` | `'light'` | Visual style |
| align | `'leading' \| 'trailing'` | `'trailing'` | Whether the addon is pinned to the leading or trailing edge |
| iconTrailing | `React.ReactNode` | -- | Optional icon to render after the badge text (before the addon) |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
import { BadgeGroup } from '@tale-ui/react/badge-group';

<BadgeGroup.Root addonText="v1.0">New feature</BadgeGroup.Root>
```

## Examples

### Colors

```tsx
<BadgeGroup.Root color="brand" addonText="New">Latest release</BadgeGroup.Root>
<BadgeGroup.Root color="success" addonText="+12%">Revenue</BadgeGroup.Root>
<BadgeGroup.Root color="warning" addonText="3">Pending</BadgeGroup.Root>
<BadgeGroup.Root color="error" addonText="!">Critical</BadgeGroup.Root>
<BadgeGroup.Root color="gray" addonText="v2">Beta</BadgeGroup.Root>
```

### Sizes

```tsx
<BadgeGroup.Root size="md" addonText="md">Medium</BadgeGroup.Root>
<BadgeGroup.Root size="lg" addonText="lg">Large</BadgeGroup.Root>
```

### Themes

```tsx
<BadgeGroup.Root theme="light" addonText="light">Light theme</BadgeGroup.Root>
<BadgeGroup.Root theme="modern" addonText="modern">Modern theme</BadgeGroup.Root>
```

### Leading addon

```tsx
<BadgeGroup.Root align="leading" addonText="PRO">Unlock all features</BadgeGroup.Root>
```

### With trailing icon

```tsx
import { ArrowRight } from 'lucide-react';

<BadgeGroup.Root addonText="v2" iconTrailing={<ArrowRight className="size-3" />}>
  See what's new
</BadgeGroup.Root>
```

## CSS Classes

- `.tale-badge-group` — Base wrapper
- `.tale-badge-group--md` / `--lg` — Size modifiers
- `.tale-badge-group--light` / `--modern` — Theme modifiers
- `.tale-badge-group--brand` / `--success` / `--warning` / `--error` / `--gray` — Color modifiers
- `.tale-badge-group--leading` / `--trailing` — Addon alignment modifiers
- `.tale-badge-group__addon` — The pinned addon segment
- `.tale-badge-group__dot` — Decorative dot (light theme only)
- `.tale-badge-group__icon` — Trailing icon wrapper

## Pitfalls

<!-- pitfall: badge-group-compound-root -->
- **Always use `BadgeGroup.Root`** — `BadgeGroup` is a namespace. Rendering `<BadgeGroup>` directly is a TypeScript error.
  - anti-pattern: `<BadgeGroup addonText="v1">New</BadgeGroup>`
  - fix: `<BadgeGroup.Root addonText="v1">New</BadgeGroup.Root>`

<!-- pitfall: badge-group-addon-required -->
- **`addonText` is the primary distinguishing feature** — omitting it renders a plain badge with no addon segment.
  - anti-pattern: `<BadgeGroup.Root>New</BadgeGroup.Root>`
  - fix: `<BadgeGroup.Root addonText="v1.0">New</BadgeGroup.Root>`

## Notes

- Custom component — not built on a React Aria primitive.
- The `iconTrailing` prop renders before the addon (i.e. between the label and the addon segment).
