# Header Navigation

A horizontal navigation bar with logo, links, and right-aligned action buttons.

## Components Used

- `HeaderNav` from `@tale-ui/react/header-nav`
- `Button` from `@tale-ui/react/button`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `Separator` from `@tale-ui/react/separator`
- `Bell`, `Search` from `lucide-react`

## Code

```tsx
import { HeaderNav } from '@tale-ui/react/header-nav';
import { Button } from '@tale-ui/react/button';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Separator } from '@tale-ui/react/separator';
import { Bell, Search } from 'lucide-react';

function AppHeader() {
  return (
    <HeaderNav.Root>
      <HeaderNav.Logo href="/">Acme</HeaderNav.Logo>

      {/* Navigation links */}
      <HeaderNav.Secondary>
        <HeaderNav.NavButton href="/products">Products</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/docs">Docs</HeaderNav.NavButton>
      </HeaderNav.Secondary>

      {/* Right-aligned actions */}
      <HeaderNav.Actions>
        <IconButton aria-label="Search" variant="ghost" size="sm">
          <Icon icon={Search} size="sm" />
        </IconButton>
        <IconButton aria-label="Notifications" variant="ghost" size="sm">
          <Icon icon={Bell} size="sm" />
        </IconButton>
        <Separator orientation="vertical" style={{ height: '1.25rem' }} />
        <Button variant="primary" size="sm">
          Sign in
        </Button>
      </HeaderNav.Actions>
    </HeaderNav.Root>
  );
}
```

## Customization Points

- Replace the logo text with your brand component or image.
- Add dropdown menus beside `HeaderNav.NavButton` links when nested navigation is needed.
- Use `aria-current="page"` on the active link (React Aria handles this automatically when `href` matches).
- For a sticky header, add `position: sticky; top: 0; z-index: 10` to `HeaderNav.Root`.
- Combine with the [Sidebar Navigation](sidebar-navigation.md) recipe for a sidebar + header layout.
