# Dropdown — Button (With Links)

A dropdown menu triggered by a button where items navigate to routes rather than triggering JS actions.

## Components Used

- `Menu` from `@tale-ui/react/menu`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';

export function ButtonLinkDropdown() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        Navigate ▾
      </Menu.Trigger>
      <Menu.Popover placement="bottom start" offset={4}>
        <Menu.MenuList>
          <Menu.LinkItem href="/dashboard">Dashboard</Menu.LinkItem>
          <Menu.LinkItem href="/projects">Projects</Menu.LinkItem>
          <Menu.LinkItem href="/reports">Reports</Menu.LinkItem>
          <Menu.Separator />
          <Menu.LinkItem href="https://docs.acme.com" target="_blank">
            Documentation ↗
          </Menu.LinkItem>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `Menu.LinkItem` renders a native `<a>` element with `href` and optional `target`. This produces correct semantics and browser-native behavior (middle-click to open in new tab, etc.).
- Mix `Menu.LinkItem` and `Menu.Item` freely in the same list — use `LinkItem` for navigation and `Item` (with `onAction`) for JS actions.
- External links should include a visual indicator (↗ or an icon) and `target="_blank"` with `rel="noopener noreferrer"` if the target URL is user-controlled.
- Do not use `onAction` on `Menu.Root` alongside `LinkItem` — `onAction` only fires for `Menu.Item`. `LinkItem` navigation is handled natively by the browser.
