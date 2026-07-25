# AppShell

`import { AppShell } from '@tale-ui/react/app-shell';`

Experimental structural slots for accessible application layouts. AppShell
owns layout only; compose `HeaderNav`, `Sidebar`, and `Drawer` for interaction.

## Parts

| Part                        | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `AppShell.Root`             | Full-height responsive grid                      |
| `AppShell.Header`           | Placement slot for `HeaderNav.Root`              |
| `AppShell.Sidebar`          | Desktop placement slot for `Sidebar.Root`        |
| `AppShell.Main`             | Scrollable main landmark and skip-link target    |
| `AppShell.MobileNavigation` | Responsive-only mobile navigation placement slot |
| `AppShell.SkipLink`         | Focus-visible keyboard bypass link               |

## Props

### Root

| Prop         | Type      | Default | Description                       |
| ------------ | --------- | ------- | --------------------------------- |
| `hasSidebar` | `boolean` | `true`  | Reserve the desktop sidebar column |

All parts accept the native attributes for their rendered element.
`AppShell.Main` defaults to `id="main-content"` and `tabIndex={-1}`.
`AppShell.SkipLink` defaults to `href="#main-content"`.

## Sidebar layout

```tsx
import { AppShell } from '@tale-ui/react/app-shell';
import { HeaderNav } from '@tale-ui/react/header-nav';
import { Sidebar } from '@tale-ui/react/sidebar';

export function ApplicationFrame({ children }: { children: React.ReactNode }) {
  return (
    <AppShell.Root>
      <AppShell.SkipLink />
      <AppShell.Header>
        <HeaderNav.Root aria-label="Application header">Workspace</HeaderNav.Root>
      </AppShell.Header>
      <AppShell.Sidebar>
        <Sidebar.Root aria-label="Primary navigation">Navigation</Sidebar.Root>
      </AppShell.Sidebar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell.Root>
  );
}
```

Use `hasSidebar={false}` for a header-only application shell. For mobile
navigation, compose `Drawer` or `HeaderNav.MobileTrigger` inside
`AppShell.MobileNavigation`; those interaction components own open state,
focus containment, and Escape behavior.

## Ownership and rendering

AppShell does not read the viewport, subscribe to media queries, persist
preferences, or own routing, loading, authentication, and application state.
Its markup is deterministic across SSR and hydration. Responsive CSS hides the
desktop sidebar and reveals the mobile slot below `48rem`. Logical properties
and an RTL grid mapping preserve start/end placement.

## CSS Classes

- `.tale-app-shell`
- `.tale-app-shell--with-sidebar`
- `.tale-app-shell__header`
- `.tale-app-shell__sidebar`
- `.tale-app-shell__main`
- `.tale-app-shell__mobile-navigation`
- `.tale-app-shell__skip-link`

## Pitfalls

<!-- pitfall: app-shell-no-application-state -->

- **Keep application behavior outside `AppShell`** — the family owns structural layout, while the application owns routes, data, authentication, persistence, and responsive interaction state.
  - anti-pattern: `<AppShell.Root route={route} user={user} sidebarOpen={open}>`
  - fix: `<AppShell.Root><AppShell.Main>{routeContent}</AppShell.Main></AppShell.Root>`
