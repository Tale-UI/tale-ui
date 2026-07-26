# Breadcrumbs

`import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';`

A navigation trail showing the current page location within a hierarchy.

## Parts

| Part | Description |
|------|-------------|
| `Breadcrumbs.Root` | Ordered list container (`<ol>`). |
| `Breadcrumbs.Item` | A single breadcrumb entry (`<li>`). |
| `Breadcrumbs.Link` | The clickable link inside an item. Omit `href` for the current (last) item. |

## Props

Accepts all React Aria `Breadcrumbs` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Breadcrumbs.Root>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link>Widget</Breadcrumbs.Link>
  </Breadcrumbs.Item>
</Breadcrumbs.Root>
```

## Examples

### Long Path

```tsx
<Breadcrumbs.Root>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Category</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Subcategory</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link>Widget Pro</Breadcrumbs.Link>
  </Breadcrumbs.Item>
</Breadcrumbs.Root>
```

## CSS Classes

- `.tale-breadcrumbs` — Base
- `.tale-breadcrumbs__item` — List item
- `.tale-breadcrumbs__link` — Link element

## Pitfalls

<!-- pitfall: breadcrumbs-use-breadcrumbs-link -->
- **Use `Breadcrumbs.Link` inside `Breadcrumbs.Item`, not a standalone `<Link>`** — `Breadcrumbs.Link` provides separator and `data-current` styling that bare `<Link>` lacks.
  - anti-pattern: `import { Link } from '@tale-ui/react/link'; <Breadcrumbs.Item><Link href="/">Home</Link></Breadcrumbs.Item>`
  - fix: `<Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>`
  - complete example:
    ```tsx
    import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';

    export function Example() {
      return (
        <Breadcrumbs.Root>
          <Breadcrumbs.Item><Breadcrumbs.Link href="#">Home</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Item><Breadcrumbs.Link href="#">Products</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Item><Breadcrumbs.Link>Current Page</Breadcrumbs.Link></Breadcrumbs.Item>
        </Breadcrumbs.Root>
      );
    }
    ```

## Notes

- Omit the `href` prop on the last `Breadcrumbs.Link` to mark it as the current page.
- Built on React Aria `Breadcrumbs`, `Breadcrumb`, and `Link` components.
- The last item in the breadcrumb trail automatically receives `data-current`, which styles it as non-interactive text.
