# Link

`import { Link } from '@tale-ui/react/link';`

A styled anchor element with accessible disabled state support.

## Props

Accepts all React Aria `Link` props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `iconLeading` | `React.ReactNode` | -- | Optional icon before the link text. Prefer `<Icon icon={LucideIcon} size="sm" />` from `@tale-ui/react/icon`. |
| `iconTrailing` | `React.ReactNode` | -- | Optional icon after the link text. External links and links with `target="_blank"` must use lucide `ExternalLink`. |
| `className` | `string` | -- | Additional class names. |

Links without icon slots are underlined by default. When `iconLeading` or `iconTrailing` is present, the underline is removed automatically.

## Basic Usage

```tsx
<Link href="#">Click here</Link>
```

## Examples

### Disabled

```tsx
<Link href="#" isDisabled>Click here</Link>
```

### External Link

```tsx
import { Link } from '@tale-ui/react/link';
import { Icon } from '@tale-ui/react/icon';
import { ExternalLink } from 'lucide-react';

<Link
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  iconTrailing={<Icon icon={ExternalLink} size="sm" />}
>
  Open in new tab
</Link>
```

### Leading Icon

```tsx
import { Link } from '@tale-ui/react/link';
import { Icon } from '@tale-ui/react/icon';
import { Home } from 'lucide-react';

<Link href="/dashboard" iconLeading={<Icon icon={Home} size="sm" />}>
  Dashboard
</Link>
```

### Trailing Icon

```tsx
import { Link } from '@tale-ui/react/link';
import { Icon } from '@tale-ui/react/icon';
import { ArrowRight } from 'lucide-react';

<Link href="/docs" iconTrailing={<Icon icon={ArrowRight} size="sm" />}>
  Read the docs
</Link>
```

## CSS Classes

- `.tale-link` — Base
- `.tale-link--has-icon` — Applied automatically when `iconLeading` or `iconTrailing` is present
- `.tale-link__icon` — Icon wrapper

## Pitfalls

<!-- pitfall: link-no-isexternal-prop -->
<!-- multi-idea-ok -->
- **There is no isExternal prop — use target, rel, and iconTrailing directly** — To open in a new tab, pass `target="_blank" rel="noopener noreferrer"` directly on `<Link>` and add a trailing lucide `ExternalLink` icon via `iconTrailing`. Never use a bare `<a>` tag for navigation — always use `<Link>` from `@tale-ui/react/link`.
  - anti-pattern: `<a href="https://example.com" target="_blank">Visit Example</a>`
  - anti-pattern: `<Link href="https://example.com" isExternal>`
  - anti-pattern: `<Link href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Example</Link>`
  - fix: `<Link href="https://example.com" target="_blank" rel="noopener noreferrer" iconTrailing={<Icon icon={ExternalLink} size="sm" />}>Visit Example</Link>`
  - complete example for new-tab link:

    ```tsx
    import { Link } from '@tale-ui/react/link';
    import { Icon } from '@tale-ui/react/icon';
    import { ExternalLink } from 'lucide-react';

    export function VisitExample() {
      return (
        <Link
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          iconTrailing={<Icon icon={ExternalLink} size="sm" />}
        >
          Visit Example
        </Link>
      );
    }
    ```

## Notes

- Built on React Aria `Link`. Supports `isDisabled` to prevent interaction and apply `data-disabled`.
- This is a simple (non-compound) component -- use it directly, not via sub-parts.
- The `data-current` attribute marks the link as the current page (styled with `--neutral-90`, bold, no underline, no pointer).
- Use `isDisabled` to disable the link (applies `opacity: 0.45` and `pointer-events: none`).
- Icon slots are decorative and wrapped with `aria-hidden="true"`. Provide visible link text or an `aria-label`.
- Links with `iconLeading` or `iconTrailing` remove the default underline automatically.
