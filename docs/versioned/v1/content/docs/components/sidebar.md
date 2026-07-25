# Sidebar

`import { Sidebar } from '@tale-ui/react/sidebar';`

Sidebar navigation primitives. Compose them to build simple, dual-tier, slim, or section-divided sidebars. All layout and positioning (fixed, sticky, flex child, etc.) is left to the consumer.

## Parts

| Part | Description |
|------|-------------|
| `Sidebar.Root` | The `<aside>` container. Sets up flex column layout and background. |
| `Sidebar.Header` | Top section for logo, search, and branding elements. |
| `Sidebar.Search` | A search input with built-in search icon. |
| `Sidebar.Divider` | A horizontal rule (`<hr>`) to separate sections visually. |
| `Sidebar.NavList` | A `<ul>` containing nav items. Grows to fill available space. |
| `Sidebar.NavItem` | A single nav entry — renders as a link, or a collapsible group when `items` prop is provided. |
| `Sidebar.NavButton` | Icon-only button link, suited for slim/collapsed sidebar variants. |
| `Sidebar.AccountCard` | Avatar + name + email + options trigger, anchored at the bottom. |
| `Sidebar.AccountMenu` | Styled container for the popover opened from `AccountCard`. Wrap with `Popover`/`Dialog`. |
| `Sidebar.MobileTrigger` | Renders a mobile header bar + hamburger → modal drawer, using RAC Dialog/Modal. |
| `Sidebar.FeatureCard` | Decorative promotional card placed above the `AccountCard`. |

## Props

### `Sidebar.Root`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hideBorder` | `boolean` | `false` | Removes the right border. |
| `className` | `string` | — | Additional CSS classes. |

### `Sidebar.Search`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'Search'` | Input placeholder text. |
| `value` | `string` | — | Controlled value. |
| `onChange` | `(event) => void` | — | Change handler. |
| `className` | `string` | — | Additional CSS classes. |

### `Sidebar.NavItem`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | Link destination. Omit when using `items`. |
| `icon` | `React.FC<{className?: string}>` | — | Icon component (e.g. from lucide-react). |
| `current` | `boolean` | `false` | Marks item as active. |
| `badge` | `ReactNode` | — | Small label rendered on the right. |
| `external` | `boolean` | `false` | Shows external-link icon. |
| `items` | `{ href, label, current? }[]` | — | Sub-items; renders a collapsible `<details>` group. |

### `Sidebar.NavButton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | Link destination. |
| `icon` | `React.FC<{className?: string}>` | — | Icon component. |
| `label` | `string` | — | Accessible label (`aria-label`). |
| `current` | `boolean` | `false` | Active state. |
| `className` | `string` | — | Additional CSS classes. |

### `Sidebar.AccountCard`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | **Required.** User's display name. |
| `email` | `string` | — | **Required.** User's email. |
| `avatarSrc` | `string` | — | Avatar image URL. Falls back to initial letter. |
| `avatarAlt` | `string` | — | Alt text for avatar image (defaults to `name`). |
| `status` | `'online' \| 'offline'` | — | Status indicator dot. |
| `className` | `string` | — | Additional CSS classes. |

### `Sidebar.MobileTrigger`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | **Required.** The sidebar content shown inside the drawer. |
| `logo` | `ReactNode` | Logo/brand element displayed in the mobile header bar. |

### `Sidebar.FeatureCard`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Card heading. |
| `description` | `string` | — | Supporting text. |
| `dismissLabel` | `string` | `'Dismiss'` | Label for the dismiss button. |
| `onDismiss` | `() => void` | — | Called when the dismiss button is clicked. |
| `className` | `string` | — | Additional CSS classes. |

## Basic Usage

```tsx
import { LayoutDashboard, Settings, Users } from 'lucide-react';
import { Sidebar } from '@tale-ui/react/sidebar';

<Sidebar.Root>
  <Sidebar.Header>
    <img src="/logo.svg" alt="MyApp" />
  </Sidebar.Header>
  <Sidebar.NavList>
    <Sidebar.NavItem href="/dashboard" icon={LayoutDashboard} current>
      Dashboard
    </Sidebar.NavItem>
    <Sidebar.NavItem href="/team" icon={Users}>
      Team
    </Sidebar.NavItem>
    <Sidebar.NavItem href="/settings" icon={Settings}>
      Settings
    </Sidebar.NavItem>
  </Sidebar.NavList>
  <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
</Sidebar.Root>
```

## Examples

### With Search

```tsx
<Sidebar.Root>
  <Sidebar.Header>
    <strong>MyApp</strong>
    <Sidebar.Search placeholder="Search…" />
  </Sidebar.Header>
  <Sidebar.NavList>
    <Sidebar.NavItem href="/dashboard" icon={LayoutDashboard} current>
      Dashboard
    </Sidebar.NavItem>
  </Sidebar.NavList>
  <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" status="online" />
</Sidebar.Root>
```

### With Collapsible Sub-Items

```tsx
<Sidebar.NavItem
  icon={Users}
  items={[
    { href: '/team/members', label: 'Members' },
    { href: '/team/invites', label: 'Invitations' },
  ]}
>
  Team
</Sidebar.NavItem>
```

### With Divider Between Sections

```tsx
<Sidebar.Root>
  <Sidebar.Header>…</Sidebar.Header>
  <Sidebar.NavList>
    <Sidebar.NavItem href="/dashboard" icon={LayoutDashboard}>Dashboard</Sidebar.NavItem>
  </Sidebar.NavList>
  <Sidebar.Divider />
  <Sidebar.NavList>
    <Sidebar.NavItem href="/settings" icon={Settings}>Settings</Sidebar.NavItem>
  </Sidebar.NavList>
  <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
</Sidebar.Root>
```

### Mobile Drawer

```tsx
<Sidebar.MobileTrigger logo={<img src="/logo.svg" alt="MyApp" />}>
  <Sidebar.NavList>
    <Sidebar.NavItem href="/dashboard" icon={LayoutDashboard}>Dashboard</Sidebar.NavItem>
  </Sidebar.NavList>
</Sidebar.MobileTrigger>
```

## CSS Classes

- `.tale-sidebar` — Root container
- `.tale-sidebar--no-border` — No right border modifier
- `.tale-sidebar__header` — Header section
- `.tale-sidebar__search` — Search wrapper
- `.tale-sidebar__search-icon` — Search icon
- `.tale-sidebar__search-input` — Search input
- `.tale-sidebar__divider` — Horizontal divider
- `.tale-sidebar__nav-list` — Navigation list (`<ul>`)
- `.tale-sidebar__nav-item` — List item (`<li>`)
- `.tale-sidebar__nav-link` — Nav link / summary element
- `.tale-sidebar__nav-link--current` — Active state modifier
- `.tale-sidebar__nav-icon` — Nav item icon
- `.tale-sidebar__nav-label` — Nav item text
- `.tale-sidebar__nav-badge` — Optional badge on right
- `.tale-sidebar__nav-external` — External link icon
- `.tale-sidebar__nav-chevron` — Collapse arrow (rotates when open)
- `.tale-sidebar__nav-children` — Child `<ul>` for collapsible items
- `.tale-sidebar__nav-child-link` — Child item link
- `.tale-sidebar__nav-btn` — Slim/icon-only nav button
- `.tale-sidebar__nav-btn--current` — Active state for nav button
- `.tale-sidebar__account-card` — Account card container
- `.tale-sidebar__account-avatar` — Avatar image
- `.tale-sidebar__account-avatar--placeholder` — Initials placeholder
- `.tale-sidebar__account-status` — Status dot
- `.tale-sidebar__account-status--online` — Online dot (green)
- `.tale-sidebar__account-status--offline` — Offline dot (gray)
- `.tale-sidebar__account-name` — Name text
- `.tale-sidebar__account-email` — Email text
- `.tale-sidebar__account-trigger` — Options button
- `.tale-sidebar__account-menu` — Popover menu container
- `.tale-sidebar__feature-card` — Feature/promo card
- `.tale-sidebar__feature-card-title` — Card title
- `.tale-sidebar__feature-card-description` — Card description
- `.tale-sidebar__feature-card-dismiss` — Dismiss button
- `.tale-sidebar__mobile-header` — Mobile header bar
- `.tale-sidebar__mobile-menu-btn` — Hamburger button
- `.tale-sidebar__mobile-overlay` — Full-screen backdrop
- `.tale-sidebar__mobile-drawer` — Side panel container
- `.tale-sidebar__mobile-close-btn` — Close button inside drawer

## Notes

- All positioning (fixed, sticky, absolute) is the consumer's responsibility. Wrap `Sidebar.Root` in a container with the desired layout.
- `Sidebar.NavList` has `flex: 1` and `overflow-y: auto` — place multiple lists to create sections.
- Collapsible items use the native `<details>`/`<summary>` pattern for zero-JS expand/collapse.
- `Sidebar.MobileTrigger` uses React Aria `DialogTrigger`, `ModalOverlay`, `Modal`, and `Dialog` for accessible modal behaviour.

## Pitfalls
