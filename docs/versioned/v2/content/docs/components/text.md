# Text

`import { Text } from '@tale-ui/react/text';`

A typographic primitive for rendering text with design-system typography variants and color options.

## Props

| Prop      | Type                                                                                | Default     | Description                    |
| --------- | ----------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| `variant` | `'display' \| 'heading' \| 'title' \| 'label' \| 'text' \| 'mono'`                  | `'text'`    | Typography variant             |
| `size`    | `'xs' \| 's' \| 'm' \| 'l'`                                                         | `'m'`       | Size within the chosen variant |
| `as`      | `'p' \| 'span' \| 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div' \| 'label'` | `'span'`    | HTML element to render         |
| `color`   | `'default' \| 'muted' \| 'accent'`                                                  | `'default'` | Text color                     |

Also accepts all standard HTML attributes for the rendered element.

## Basic Usage

```tsx
<Text variant="heading" size="l">
  Welcome back
</Text>
```

## Examples

### Variants

```tsx
<Text variant="display" size="l">Display</Text>
<Text variant="heading" size="l">Heading</Text>
<Text variant="title" size="l">Title</Text>
<Text variant="label" size="l">Label</Text>
<Text variant="text" size="l">Text</Text>
<Text variant="mono" size="l">Mono</Text>
```

### Sizes

```tsx
<Text variant="text" size="xs">Extra small</Text>
<Text variant="text" size="s">Small</Text>
<Text variant="text" size="m">Medium</Text>
<Text variant="text" size="l">Large</Text>
```

### Colors

```tsx
<Text color="default">Default color</Text>
<Text color="muted">Muted color</Text>
<Text color="accent">Accent color</Text>
```

### Semantic Elements

```tsx
<Text as="h1" variant="display" size="l">Page Title</Text>
<Text as="h2" variant="heading" size="l">Section Heading</Text>
<Text as="p" variant="text" size="m">Body paragraph text.</Text>
<Text as="label" variant="label" size="s">Form label</Text>
```

### Combined

```tsx
<Text as="h1" variant="display" size="l" color="accent">
  Hero Title
</Text>
<Text as="p" variant="text" size="m" color="muted">
  A supporting description rendered as a paragraph.
</Text>
<Text variant="mono" size="s" color="muted">
  const x = 42;
</Text>
```

## CSS Classes

- `.tale-text` -- Base
- `.tale-text--muted` -- Muted color variant
- `.tale-text--accent` -- Accent color variant
- Typography is applied via `text--{variant}-{size}` foundation classes (e.g. `text--heading-l`, `text--label-s`)

## Pitfalls

<!-- pitfall: text-no-bare-paragraph-tags -->

- **Never use bare `<p>` paragraph tags or `<span>` for visible text** — Tale UI's typography tokens (color, size, variant) are only applied through `Text`; bare paragraph tags are forbidden just like bare heading tags.
  - anti-pattern: `<p style={{ color: 'gray' }}>This action cannot be undone.</p>`
  - fix: `<Text color="muted">This action cannot be undone.</Text>`
  - complete example:

    ```tsx
    import { Text } from '@tale-ui/react/text';

    export function Example() {
      return (
        <>
          <Text variant="heading" size="l" as="h1">
            Page title
          </Text>
          <Text variant="text" color="muted">
            Secondary info
          </Text>
          <Text variant="mono" size="s" as="code">
            const x = 1;
          </Text>
        </>
      );
    }
    ```

<!-- pitfall: text-size-valid-values -->

- **size only accepts 'xs', 's', 'm', 'l'** — no other size tokens are valid.
  - anti-pattern: `<Text size="sm">Hello</Text>`
  - anti-pattern: `<Text size="md">Hello</Text>`
  - anti-pattern: `<Text size="lg">Hello</Text>`
  - fix: `<Text size="s">Hello</Text>`
  - fix: `<Text size="m">Hello</Text>`
  - fix: `<Text size="l">Hello</Text>`

<!-- pitfall: text-mono-not-code -->

- **Monospace variant is `"mono"`, NOT `"code"`** — use `variant="mono"` for monospace text.
  - anti-pattern: `<Text variant="code">console.log(x)</Text>`
  - fix: `<Text variant="mono">console.log(x)</Text>`

<!-- pitfall: text-no-invalid-variants -->

- **variant+size compound strings like 'heading-m', 'heading-l', 'heading-xl', 'body-m', 'label-m', or 'label-l' are not valid — always pass them as two separate props** — compound strings fail TypeScript; there is also no `'body'` variant, use `variant="text"` for body copy. When generating heading+body content-section pairs, also use `color="muted"` (not `color="secondary"`) for supporting text.
  - anti-pattern: `<Text variant="heading-xl">Title</Text>`
  - anti-pattern: `<Text variant="heading-l">Title</Text>`
  - anti-pattern: `<Text variant="heading-m">Title</Text>`
  - anti-pattern: `<Text variant="body-m">Description</Text>`
  - anti-pattern: `<Text variant="body-m" color="secondary">Description</Text>`
  - anti-pattern: `<Text variant="label-l">Label</Text>`
  - anti-pattern: `<Text variant="label-m">Label</Text>`
  - fix: `<Text variant="heading" size="l">Title</Text>`
  - fix: `<Text variant="heading" size="m">Title</Text>`
  - fix: `<Text variant="heading">Title</Text>`
  - fix: `<Text variant="text" size="m">Description</Text>`
  - fix: `<Text variant="text" size="m" color="muted">Description</Text>`
  - fix: `<Text variant="label">Label</Text>`
  - fix: `<Text variant="label" size="l">Label</Text>`
  - fix: `<Text variant="label" size="m">Label</Text>`

<!-- pitfall: text-no-html-for-prop -->
- **No htmlFor prop on Text — use a native <label> HTML element instead** — TextProps does not accept htmlFor even when as="label" is set. The type signature of Text is strict and does not forward arbitrary HTML element attributes from the as target. To associate a visible label with a form control, use a native <label htmlFor="..."> element directly. Never pass htmlFor to Text in any form.
  - anti-pattern: `<Text htmlFor="email">Email</Text>`
  - anti-pattern: `<Text as="label" htmlFor="country" variant="label">Country</Text>`
  - fix: `<label htmlFor="country">Country</label>`
  - complete example:
    ```tsx
    import { SelectNative } from '@tale-ui/react/select-native';
    import { Column } from '@tale-ui/react/column';

    export function CountrySelect() {
      return (
        <Column gap="xs">
          <label htmlFor="country">Country</label>
          <SelectNative id="country" name="country">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
          </SelectNative>
        </Column>
      );
    }
    ```

<!-- pitfall: text-as-prop-valid-elements -->

- **as prop only accepts 'p', 'span', 'div', 'h1'–'h6', 'label'** — not `'strong'`, `'code'`, `'pre'`, `'kbd'`, or other elements. For keyboard shortcut markup use a native `<kbd>` HTML element directly. For inline monospace/code snippets, use `variant="mono"` without `as="code"` — `"code"` is not a valid TextElement and causes a TypeScript error.
  - anti-pattern: `<Text as="strong">Bold</Text>`
  - anti-pattern: `<Text as="kbd">⌘ S</Text>`
  - anti-pattern: `<Text variant="mono" as="code">pnpm install</Text>`
  - fix: `<Text variant="label">Bold</Text>`
  - fix: `<kbd>⌘ S</kbd>`
  - fix: `<Text variant="mono" as="span">pnpm install</Text>`

<!-- pitfall: text-color-valid-values -->

- **`color` only accepts `'default'`, `'muted'`, `'accent'`** — no other color values are valid.
  - anti-pattern: `<Text color="secondary">Note</Text>`
  - fix: `<Text color="muted">Note</Text>`

<!-- pitfall: text-uses-separate-variant-size-color-props -->

- **Text has no boolean `muted` prop — use `color="muted"` for secondary text, plus separate `variant`/`size` props when needed** — `muted` is a common shorthand in other libraries, but Tale UI `Text` controls tone only through the `color` prop; using `<Text muted>` causes a TypeScript error.
  - anti-pattern: `<Text muted>This action cannot be undone.</Text>`
  - anti-pattern: `<Text muted variant="body-sm">This action cannot be undone.</Text>`
  - fix: `<Text as="p" color="muted">This action cannot be undone.</Text>`
  - fix: `<Text as="p" variant="text" size="s" color="muted">This action cannot be undone.</Text>`

<!-- pitfall: for-muted-or-secondary-paragraph -->

- **Use `color="muted"` for muted secondary paragraph copy** — prompts that ask for subdued body text should not be translated into generic component tokens like `'md'` or neutral color names; on `Text`, the muted tone is `color="muted"` and paragraph sizing should usually stay implicit unless the prompt asks for a specific text scale.
  - anti-pattern: `<Text size="md" color="neutral">This action cannot be undone.</Text>`
  - fix: `<Text as="p" color="muted">This action cannot be undone.</Text>`

<!-- pitfall: color-only-accepts-default-muted -->

- **color only accepts 'default', 'muted', 'accent'** — no other color values are valid. Common wrong values include 'secondary', 'neutral', 'gray', 'dim', and status tokens like 'success', 'error', 'warning' (which are valid on DotIcon/Badge but not on Text); all map to 'muted'.
  - anti-pattern: `<Text color="neutral">Note</Text>`
  - anti-pattern: `<Text color="secondary">Note</Text>`
  - anti-pattern: `<Text color="success">Online</Text>`
  - anti-pattern: `<Text color="danger">Error message</Text>`
  - fix: `<Text color="muted">Note</Text>`

<!-- pitfall: no-link-code-or-caption -->

- **No 'link', 'code', or 'caption' variant** — valid values are `'display'`, `'heading'`, `'title'`, `'label'`, `'text'`, `'mono'`.
  - anti-pattern: `<Text variant="caption">Fine print</Text>`
  - fix: `<Text variant="label">Fine print</Text>`

<!-- pitfall: never-apply-nonlayout-inline-styles -->

- **Never apply non-layout inline styles (color, fontWeight, fontSize, textDecoration, fontStyle) to Text** — use `variant`, `size`, and `color` props for typography control; for bold labels inside buttons or icon-only toggles, use a plain text node rather than a `<Text>` wrapper with `style={{ fontWeight: ... }}`. For tinted or muted text, use the `color` prop (`'default'`, `'muted'`, or `'accent'`) — never a CSS `color` inline style.
  - anti-pattern: `<Text style={{ color: 'var(--neutral-60)' }}>Note</Text>`
  - fix: `<Text color="muted">Note</Text>`
  - anti-pattern: `<Text as="span" style={{ fontWeight: 700 }}>B</Text>`
  - fix: `B`

<!-- pitfall: text-has-no-weight-prop -->

- **Text has no weight prop — use variant="label" for label-weight text** — There is no `weight` prop on `Text`; passing `weight="medium"` or any weight string causes `Type '{ weight: string; ... }' is not assignable to type 'TextProps'`. To render bold or label-weight text use `variant="label"`. This applies everywhere Text appears, including inside List.Item, Disclosure.Trigger, accordion headers, and other trigger labels.
  - anti-pattern: `<Text weight="medium">Plan Name</Text>`
  - anti-pattern: `<Text weight="semibold">Color Palette</Text>`
  - anti-pattern: `<Text weight="medium">What is included?</Text>`
  - anti-pattern: `<Text size="m" weight="medium">Plan Name</Text>`
  - anti-pattern: `<Text weight="semibold" size="lg">Title</Text>`
  - anti-pattern: `<Text weight="medium">{member.name}</Text>`
  - fix: `<Text variant="label">Plan Name</Text>`
  - fix: `<Text variant="label">Color Palette</Text>`
  - fix: `<Text variant="label">What is included?</Text>`
  - fix: `<Text size="m" variant="label">Plan Name</Text>`
  - fix: `<Text variant="label" size="l">Title</Text>`
  - fix: `<Text variant="label">{member.name}</Text>`

## Notes

- Custom component -- not built on a React Aria primitive.
- Default variant is `text`, default size is `m`, default color is `default`.
- The `as` prop controls which HTML element is rendered (default `span`). Choose semantic elements for accessibility (e.g. `h1`-`h6` for headings, `p` for paragraphs).
- Typography styles (font-size, line-height, font-weight, letter-spacing) come from the design system's foundation typography classes, not from BEM modifiers.
