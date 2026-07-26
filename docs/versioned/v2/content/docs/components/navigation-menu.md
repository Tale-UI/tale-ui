# NavigationMenu

`import { NavigationMenu } from '@tale-ui/react/navigation-menu';`

A horizontal navigation bar with links and optional dropdown submenus.

## Parts

| Part | Description |
|------|-------------|
| `NavigationMenu.Root` | The `<nav>` wrapper element. |
| `NavigationMenu.List` | The `<ul>` list of navigation items. |
| `NavigationMenu.Item` | An `<li>` list item. |
| `NavigationMenu.Link` | An `<a>` navigation link. |
| `NavigationMenu.Trigger` | A `<button>` that toggles a dropdown submenu. |
| `NavigationMenu.Popup` | Dropdown container for submenu content. |
| `NavigationMenu.Content` | Content wrapper inside the dropdown popup. |
| `NavigationMenu.Icon` | Dropdown chevron icon inside a trigger. |

## Props

Accepts all native `<nav>` element props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { NavigationMenu } from '@tale-ui/react/navigation-menu';

<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">About</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

## Examples

### With Dropdown

```tsx
import { useState } from 'react';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';

function NavWithDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger onClick={() => setOpen(!open)}>
            Products <NavigationMenu.Icon />
          </NavigationMenu.Trigger>
          {open && (
            <NavigationMenu.Popup>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#">Widget Pro</NavigationMenu.Link>
                <NavigationMenu.Link href="#">Gadget Plus</NavigationMenu.Link>
                <NavigationMenu.Link href="#">Tool Suite</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Popup>
          )}
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
```

## CSS Classes

- `.tale-navigation-menu` — Root `<nav>` element
- `.tale-navigation-menu__list` — `<ul>` list
- `.tale-navigation-menu__item` — `<li>` item
- `.tale-navigation-menu__link` — `<a>` link
- `.tale-navigation-menu__trigger` — Dropdown toggle button
- `.tale-navigation-menu__popup` — Dropdown container
- `.tale-navigation-menu__content` — Content inside dropdown
- `.tale-navigation-menu__icon` — Dropdown chevron icon inside a trigger
- `.tale-navigation-menu__viewport` — Animated viewport container for dropdown content

## Pitfalls

<!-- pitfall: navigation-menu-list-required -->
<!-- multi-idea-ok -->
- **`NavigationMenu.List` is required between `NavigationMenu.Root` and `NavigationMenu.Item`** — placing items directly in `Root` skips the `<ul>` semantic wrapper.
  - anti-pattern: `<NavigationMenu.Root><NavigationMenu.Item>...</NavigationMenu.Item></NavigationMenu.Root>`
  - fix: `<NavigationMenu.Root><NavigationMenu.List><NavigationMenu.Item>...</NavigationMenu.Item></NavigationMenu.List></NavigationMenu.Root>`
  - complete example:
    ```tsx
    import { NavigationMenu } from '@tale-ui/react/navigation-menu';

    export function Example() {
      return (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#">About</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      );
    }
    ```

<!-- pitfall: navigation-menu-no-nav-component -->
- **No standalone Nav component in Tale UI** — use `NavigationMenu.Root` as the `<nav>` wrapper.
  - anti-pattern: `import { Nav } from '@tale-ui/react/nav';`
  - fix: `import { NavigationMenu } from '@tale-ui/react/navigation-menu';`
<!-- pitfall: use-navigationmenu-for-any-prompt -->
- **Use <NavigationMenu> for any prompt that asks for a site navigation bar or a list of nav links — never substitute HeaderNav** — when the request is to show a navigation bar with page links (e.g. Home, Products, About), render `NavigationMenu.Root` with `NavigationMenu.List`, `NavigationMenu.Item`, and `NavigationMenu.Link` instead of leaving the file empty or using `HeaderNav`. `HeaderNav` is an app-shell header component, not a semantic site navigation menu.
  - anti-pattern: `import { HeaderNav } from '@tale-ui/react/header-nav'; <HeaderNav.Root><HeaderNav.Secondary><HeaderNav.NavButton href="/">Home</HeaderNav.NavButton></HeaderNav.Secondary></HeaderNav.Root>`
  - fix: `import { NavigationMenu } from '@tale-ui/react/navigation-menu'; <NavigationMenu.Root><NavigationMenu.List><NavigationMenu.Item><NavigationMenu.Link href="/">Home</NavigationMenu.Link></NavigationMenu.Item></NavigationMenu.List></NavigationMenu.Root>`

## Notes

- This is a plain HTML implementation (not built on React Aria). Manage dropdown open/close state yourself.
- All parts are simple semantic HTML elements (`nav`, `ul`, `li`, `a`, `button`, `div`).
- Dropdown visibility is controlled by conditionally rendering `NavigationMenu.Popup`.
