# HeaderNav

`import { HeaderNav } from '@tale-ui/react/header-nav';`

Horizontal header navigation primitives. Compose them to build marketing headers, app headers, and responsive navigations with mobile drawer support.

## Parts

| Part | Description |
|------|-------------|
| `HeaderNav.Root` | The `<header>` element. Applies flex layout, height, padding, and background. |
| `HeaderNav.Logo` | Brand/logo area — wraps children in an `<a>` when `href` is provided. |
| `HeaderNav.Secondary` | `<nav>` container for the primary nav links, centered in the header. |
| `HeaderNav.NavButton` | A styled anchor link used as a nav item inside `Secondary`. |
| `HeaderNav.Actions` | Container for CTAs (buttons, avatars, etc.) pinned to the right. |
| `HeaderNav.MobileTrigger` | A hamburger button that opens a modal drawer with nav content. |

## Props

### `HeaderNav.Root`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes. |

Accepts all standard `React.HTMLAttributes<HTMLElement>`.

### `HeaderNav.Logo`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | When provided, wraps children in `<a href={href}>`. |
| `className` | `string` | — | Additional CSS classes. |

### `HeaderNav.NavButton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | Link destination. |
| `current` | `boolean` | `false` | Active state — applies `--current` modifier and `aria-current="page"`. |
| `className` | `string` | — | Additional CSS classes. |

### `HeaderNav.Actions`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes. |

### `HeaderNav.Secondary`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes. |

### `HeaderNav.MobileTrigger`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | **Required.** Nav content rendered inside the modal drawer. |

## Basic Usage

```tsx
import { HeaderNav } from '@tale-ui/react/header-nav';

<HeaderNav.Root>
  <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
  <HeaderNav.Secondary>
    <HeaderNav.NavButton href="/features" current>Features</HeaderNav.NavButton>
    <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
    <HeaderNav.NavButton href="/docs">Docs</HeaderNav.NavButton>
  </HeaderNav.Secondary>
  <HeaderNav.Actions>
    <a href="/login" className="tale-button tale-button--neutral tale-button--md">Log in</a>
    <a href="/signup" className="tale-button tale-button--primary tale-button--md">Sign up</a>
  </HeaderNav.Actions>
</HeaderNav.Root>
```

## Examples

### Logo + Actions Only

```tsx
<HeaderNav.Root>
  <HeaderNav.Logo href="/">MyBrand</HeaderNav.Logo>
  <HeaderNav.Actions>
    <a href="/login" className="tale-button tale-button--ghost tale-button--md">Log in</a>
    <a href="/signup" className="tale-button tale-button--primary tale-button--md">Get started</a>
  </HeaderNav.Actions>
</HeaderNav.Root>
```

### With Mobile Drawer

```tsx
<HeaderNav.Root>
  <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
  <HeaderNav.Secondary>
    <HeaderNav.NavButton href="/features" current>Features</HeaderNav.NavButton>
    <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
  </HeaderNav.Secondary>
  <HeaderNav.Actions>
    <a href="/signup" className="tale-button tale-button--primary tale-button--md">Sign up</a>
    <HeaderNav.MobileTrigger>
      <nav style={{ padding: 'var(--space-m)' }}>
        <a href="/features">Features</a>
        <a href="/pricing">Pricing</a>
      </nav>
    </HeaderNav.MobileTrigger>
  </HeaderNav.Actions>
</HeaderNav.Root>
```

## CSS Classes

- `.tale-header-nav` — Root `<header>` element
- `.tale-header-nav__logo` — Logo container
- `.tale-header-nav__logo-link` — Logo anchor (when `href` provided)
- `.tale-header-nav__secondary` — Secondary nav container
- `.tale-header-nav__nav-btn` — Nav link button
- `.tale-header-nav__nav-btn--current` — Active state modifier
- `.tale-header-nav__actions` — Actions container
- `.tale-header-nav__mobile-trigger` — Hamburger button
- `.tale-header-nav__mobile-overlay` — Full-screen backdrop
- `.tale-header-nav__mobile-drawer` — Slide-in panel
- `.tale-header-nav__mobile-close-btn` — Close button inside drawer

## Notes

- `HeaderNav.Logo` renders a plain `<div>` with `margin-right: auto` when no `href` is provided. Provide `href` for marketing sites where the logo links to the homepage.
- `HeaderNav.Actions` has `margin-left: auto`, pushing it to the right end of the header.
- `HeaderNav.MobileTrigger` uses React Aria `DialogTrigger`, `ModalOverlay`, `Modal`, and `Dialog` for accessible modal behaviour on small screens.
- To hide the `Secondary` nav on mobile and show `MobileTrigger` instead, use CSS media queries on the consumer side.

## Pitfalls

<!-- pitfall: header-nav-mobile-trigger-requires-children -->
<!-- applies-to: HeaderNav -->
- **HeaderNav.MobileTrigger requires children — omitting them causes a TypeScript error 'Property children is missing in type {} but required in type HeaderNavMobileTriggerProps'** — it does not render any content automatically; pass an `<Icon>` child (e.g. a hamburger menu icon) so the button has visible and accessible content. Import `Icon` from `@tale-ui/react/icon` and the icon (e.g. `Menu`) from `lucide-react`.
  - anti-pattern: `<HeaderNav.MobileTrigger />`
  - anti-pattern: `import { HeaderNav } from '@tale-ui/react/header-nav'; // missing Icon and Menu imports causes self-closing MobileTrigger`
  - fix: `<HeaderNav.MobileTrigger><Icon icon={Menu} size="sm" /></HeaderNav.MobileTrigger>`
  - fix: `import { Icon } from '@tale-ui/react/icon'; import { Menu } from 'lucide-react'; // always add these alongside HeaderNav when MobileTrigger is present`

<!-- pitfall: header-nav-text-needs-separate-import -->
<!-- applies-to: HeaderNav -->
- **Always import Text from @tale-ui/react/text when rendering text inside HeaderNav sub-parts such as HeaderNav.Logo** — `Text` is not re-exported from `@tale-ui/react/header-nav`; using `<Text>` without a separate import causes 'cannot be used as a JSX component' TypeScript errors.
  - anti-pattern: `<HeaderNav.Logo href="/"><Text variant="heading" as="span">Acme</Text></HeaderNav.Logo>`
  - fix: `import { Text } from '@tale-ui/react/text'; ... <HeaderNav.Logo href="/"><Text variant="heading" as="span">Acme</Text></HeaderNav.Logo>`
  - complete example:

    ```tsx
    import { HeaderNav } from '@tale-ui/react/header-nav';
    import { Icon } from '@tale-ui/react/icon';
    import { Menu } from 'lucide-react';

    export function SiteHeader() {
      return (
        <HeaderNav.Root>
          <HeaderNav.Actions>
            <HeaderNav.MobileTrigger><Icon icon={Menu} size="sm" /></HeaderNav.MobileTrigger>
          </HeaderNav.Actions>
        </HeaderNav.Root>
      );
    }
    ```
