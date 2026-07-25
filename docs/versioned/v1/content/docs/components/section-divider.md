# SectionDivider

`import { SectionDivider } from '@tale-ui/react/section-divider';`

A decorative full-width horizontal rule styled as a section boundary. It has built-in maximum-width and responsive horizontal padding to match typical page layout containers.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | -- | Additional classes applied to the outer `<div>` wrapper |

Also accepts all standard `<div>` HTML attributes. Children are **not** rendered.

## Basic Usage

```tsx
import { SectionDivider } from '@tale-ui/react/section-divider';

<SectionDivider />
```

## Examples

### Between page sections

```tsx
<section>
  <h2>Features</h2>
  <p>...</p>
</section>
<SectionDivider />
<section>
  <h2>Pricing</h2>
  <p>...</p>
</section>
```

### Custom colour via CSS variable

```tsx
<SectionDivider style={{ '--section-divider-color': 'var(--color-20)' } as React.CSSProperties} />
```

## CSS Classes

- `.tale-section-divider` — Outer wrapper with layout padding
- `.tale-section-divider__rule` — The `<hr>` element (1 px height, `--neutral-20` background)

## Pitfalls

<!-- pitfall: section-divider-not-separator -->
- **Use Separator not SectionDivider for in-component dividers** — `SectionDivider` is for page-level section breaks only. For UI dividers inside components (menus, cards, lists) use `Separator` instead.
  - anti-pattern: `<Menu><SectionDivider /></Menu>`
  - fix: `<Menu.Separator />`
<!-- pitfall: sectiondivider-shorthand-tokens-no-compounds -->
- **Column gap/Text variant props around SectionDivider use shorthand tokens, never compounds like 'sm', 'md', 'heading-m', or 'text-m'** — Column gap must be a spacing token ('xs', 's', 'm', 'l', 'xl', '2xl'), not a component-size name ('sm', 'md', 'lg'). Text variant must be a standalone token like 'heading' or 'text', never a compound string like 'heading-m', 'text-m', or 'body-m'. Both errors commonly appear together when wrapping SectionDivider with labelled content sections.
  - anti-pattern: `<Column gap="sm"><Text variant="heading-m">Title</Text><Text variant="text-m">Body</Text></Column>`
  - anti-pattern: `<Column gap="md"><Text variant="heading-m">Title</Text><Text variant="text-m">Body</Text></Column>`
  - anti-pattern: `<Column gap="md"><Text variant="heading-m">Title</Text><Text variant="body-m">Body</Text></Column>`
  - fix: `<Column gap="m"><Text variant="heading">Title</Text><Text variant="text">Body</Text></Column>`
  - fix: `<Column gap="s"><Text variant="heading">Title</Text><Text variant="text">Body</Text></Column>`
  - complete example:
    ```tsx
    import { SectionDivider } from '@tale-ui/react/section-divider';
    import { Column } from '@tale-ui/react/column';
    import { Text } from '@tale-ui/react/text';

    export function SectionDividerExample() {
      return (
        <Column gap="xl">
          <Column gap="m">
            <Text variant="heading">Our Features</Text>
            <Text variant="text" color="muted">
              Discover everything our platform has to offer.
            </Text>
          </Column>

          <SectionDivider />

          <Column gap="m">
            <Text variant="heading">Pricing</Text>
            <Text variant="text" color="muted">
              Simple, transparent pricing with no hidden fees.
            </Text>
          </Column>
        </Column>
      );
    }
    ```

## Notes

- Custom component — not built on a React Aria primitive.
- The `role="separator"` comes from the inner `<hr>`. The outer wrapper is presentational.
- Responsive padding: `var(--space-m)` on mobile, `var(--space-2xl)` at wider viewports.
