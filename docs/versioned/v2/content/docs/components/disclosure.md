# Disclosure

`import { Disclosure } from '@tale-ui/react/disclosure';`

A single collapsible section that toggles visibility of its content panel.

## Parts

| Part | Description |
|------|-------------|
| `Disclosure.Root` | Wrapper managing expanded state |
| `Disclosure.Trigger` | Button that toggles the panel |
| `Disclosure.Panel` | Collapsible content area |

## Props

Accepts all React Aria `Disclosure` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Disclosure.Root>
  <Disclosure.Trigger>Show more</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This is the hidden content revealed when the disclosure is expanded.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

## Examples

### Default Expanded

```tsx
<Disclosure.Root defaultExpanded>
  <Disclosure.Trigger>Show more</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This content is visible by default.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

### Disabled

```tsx
<Disclosure.Root isDisabled>
  <Disclosure.Trigger>Show more</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This content cannot be toggled.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

### Controlled

```tsx
const [isExpanded, setIsExpanded] = useState(false);

<Disclosure.Root isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
  <Disclosure.Trigger>{isExpanded ? 'Collapse' : 'Expand'}</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This disclosure is controlled externally via useState.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

## CSS Classes

- `.tale-disclosure` — Root container
- `.tale-disclosure__trigger` — Toggle button
- `.tale-disclosure__panel` — Collapsible content area

## Pitfalls

<!-- pitfall: disclosure-no-content-sub-part -->
- **Use `Disclosure.Panel` for content, NOT `Disclosure.Content`** — there is no `Disclosure.Content` sub-part.
  - anti-pattern: `<Disclosure.Content>Details here</Disclosure.Content>`
  - fix: `<Disclosure.Panel>Details here</Disclosure.Panel>`
  - complete example:
    ```tsx
    import { Disclosure } from '@tale-ui/react/disclosure';

    export function Example() {
      return (
        <Disclosure.Root>
          <Disclosure.Trigger>Show more</Disclosure.Trigger>
          <Disclosure.Panel>Hidden content revealed on expand.</Disclosure.Panel>
        </Disclosure.Root>
      );
    }
    ```

<!-- pitfall: disclosure-no-header-or-icon-parts -->
- **No `Content`, `Header`, or `Icon` sub-parts** — the only parts are `Root`, `Trigger`, and `Panel`.
  - anti-pattern: `<Disclosure.Header><Disclosure.Trigger>...</Disclosure.Trigger></Disclosure.Header>`
  - fix: `<Disclosure.Trigger>...</Disclosure.Trigger>`

<!-- pitfall: disclosure-controlled-state-props -->
- **Controlled state uses isExpanded/onExpandedChange** — NOT `open`/`onOpenChange`.
  - anti-pattern: `<Disclosure.Root open={isOpen} onOpenChange={setIsOpen}>`
  - fix: `<Disclosure.Root isExpanded={isOpen} onExpandedChange={setIsOpen}>`
<!-- pitfall: text-inside-disclosuretrigger-has-no -->
- **Text inside Disclosure.Trigger has no weight prop — use variant="label" for label-weight trigger text** — `Text` does not accept a `weight` prop; passing `weight="medium"` inside `Disclosure.Trigger` causes `Type '{ weight: string; ... }' is not assignable to type 'TextProps'`. Use `variant="label"` instead.
  - anti-pattern: `<Disclosure.Trigger><Text weight="medium">What is included?</Text></Disclosure.Trigger>`
  - fix: `<Disclosure.Trigger><Text variant="label">What is included?</Text></Disclosure.Trigger>`

## Notes

- Built on React Aria `Disclosure` and `DisclosurePanel`.
- Supports both uncontrolled (`defaultExpanded`) and controlled (`isExpanded` + `onExpandedChange`) modes.
- The panel's expand/collapse animation uses the `--disclosure-panel-height` CSS variable (set in `_primitives.css`).
- For multiple collapsible sections, use the Accordion component instead.
