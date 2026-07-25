# Accordion

`import { Accordion } from '@tale-ui/react/accordion';`

A vertically stacked set of collapsible sections, allowing one or multiple panels to be expanded at a time.

## Parts

| Part | Description |
|------|-------------|
| `Accordion.Root` | Wraps the entire accordion group; controls expand behavior |
| `Accordion.Item` | A single collapsible section |
| `Accordion.Header` | Heading element (`<h3>`) wrapping the trigger |
| `Accordion.Trigger` | Button that toggles the associated panel; renders a chevron icon automatically |
| `Accordion.Panel` | Collapsible content area revealed when the item is expanded |

## Props

Accepts all React Aria `DisclosureGroup` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Accordion.Root>
  <Accordion.Item id="a">
    <Accordion.Header>
      <Accordion.Trigger>What is Tale UI?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Tale UI is a comprehensive design system and component library built
      with React and CSS custom properties.
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="b">
    <Accordion.Header>
      <Accordion.Trigger>How do I install it?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Install via npm or pnpm: <code>pnpm add @tale-ui/react @tale-ui/react-styles</code>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

## Examples

### Multiple Open

```tsx
<Accordion.Root allowsMultipleExpanded>
  <Accordion.Item id="a">
    <Accordion.Header>
      <Accordion.Trigger>Section One</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Multiple items can be open at the same time.
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="b">
    <Accordion.Header>
      <Accordion.Trigger>Section Two</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Try opening this while the first section is still open.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

### Default Open

```tsx
<Accordion.Root defaultExpandedKeys={['a']}>
  <Accordion.Item id="a">
    <Accordion.Header>
      <Accordion.Trigger>Initially Open</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      This section is open by default.
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="b">
    <Accordion.Header>
      <Accordion.Trigger>Initially Closed</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      This section starts closed.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

### Disabled

```tsx
<Accordion.Root isDisabled>
  <Accordion.Item id="a">
    <Accordion.Header>
      <Accordion.Trigger>Disabled Item</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      This content cannot be revealed because the accordion is disabled.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

## CSS Classes

- `.tale-accordion` — Root container
- `.tale-accordion__item` — Individual collapsible section
- `.tale-accordion__header` — Heading element (`<h3>`)
- `.tale-accordion__trigger` — Toggle button
- `.tale-accordion__trigger-icon` — Chevron SVG icon inside the trigger
- `.tale-accordion__panel` — Collapsible content area

## Pitfalls

<!-- pitfall: accordion-trigger-inside-header -->
- **`Accordion.Trigger` must go inside `Accordion.Header`** — `Accordion.Header` renders an `<h3>` wrapper; the trigger button is a separate child.
  - anti-pattern: `<Accordion.Item><Accordion.Trigger>Title</Accordion.Trigger><Accordion.Panel>…</Accordion.Panel></Accordion.Item>`
  - fix: `<Accordion.Item><Accordion.Header><Accordion.Trigger>Title</Accordion.Trigger></Accordion.Header><Accordion.Panel>…</Accordion.Panel></Accordion.Item>`
  - complete example:
    ```tsx
    import { Accordion } from '@tale-ui/react/accordion';

    export function Example() {
      return (
        <Accordion.Root>
          <Accordion.Item id="a">
            <Accordion.Header>
              <Accordion.Trigger>Question</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Answer</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      );
    }
    ```

<!-- pitfall: accordion-no-content-sub-part -->
- **Use `Accordion.Panel` for content, NOT `Accordion.Content`** — there is no `Accordion.Content` sub-part.
  - anti-pattern: `<Accordion.Content>Body text</Accordion.Content>`
  - fix: `<Accordion.Panel>Body text</Accordion.Panel>`

<!-- pitfall: accordion-no-type-prop -->
- **No `type` prop** — use `allowsMultipleExpanded` on `Accordion.Root` to allow multiple panels open simultaneously.
  - anti-pattern: `<Accordion.Root type="multiple">`
  - fix: `<Accordion.Root allowsMultipleExpanded>`

<!-- pitfall: accordion-default-expanded-keys -->
<!-- multi-idea-ok -->
- **Uses `defaultExpandedKeys` (array), NOT `defaultOpen`, `defaultValue`, or `defaultSelectedKey`** — pass an array of item `id` strings to set the initially expanded panels.
  - anti-pattern: `<Accordion.Root defaultOpen="item-1">`
  - fix: `<Accordion.Root defaultExpandedKeys={['item-1']}>`

## Notes

- Built on React Aria `DisclosureGroup` and `Disclosure` components.
- By default only one item can be open at a time. Pass `allowsMultipleExpanded` to allow multiple.
- Use `defaultExpandedKeys` to set initially expanded items (pass an array of item `id` values).
- The `isDisabled` prop can be set on `Root` to disable the entire group.
