# Card

`import { Card } from '@tale-ui/react/card';`

A container component for grouping related content with visual separation. Use `Card.Root` for
presentational content and `Card.Button` for a whole-card action with React Aria interactions.

## Parts

| Part          | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `Card.Root`   | Outer container (`<div>`). Accepts `variant` and `padding` props.    |
| `Card.Button` | Interactive card surface (`<button>`) built on React Aria Button.    |
| `Card.Header` | Top section for titles and actions within `Card.Root` (`<div>`).     |
| `Card.Body`   | Main content area within `Card.Root` (`<div>`).                      |
| `Card.Footer` | Bottom section for actions or metadata within `Card.Root` (`<div>`). |

## Props

### Root

| Prop      | Type                                   | Default      | Description                       |
| --------- | -------------------------------------- | ------------ | --------------------------------- |
| `variant` | `'elevated' \| 'outlined' \| 'filled'` | `'outlined'` | Visual style                      |
| `padding` | `'sm' \| 'md' \| 'lg'`                 | `'md'`       | Internal padding for all sections |

Also accepts all standard `<div>` HTML attributes.

### Button

| Prop         | Type                                   | Default      | Description                                                                      |
| ------------ | -------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| `variant`    | `'elevated' \| 'outlined' \| 'filled'` | `'outlined'` | Visual style                                                                     |
| `padding`    | `'sm' \| 'md' \| 'lg'`                 | `'md'`       | Inner padding                                                                    |
| `isSelected` | `boolean`                              | —            | Controlled selected state; adds `aria-pressed` and `data-selected` when provided |

Also accepts React Aria Button props, including `onPress`, `isDisabled`, `isPending`,
`autoFocus`, and accessible-name attributes.

### Header / Body / Footer

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

All parts accept standard `<div>` HTML attributes including `className`.

## Basic Usage

```tsx
<Card.Root>
  <Card.Header>
    <Text variant="title" size="m">
      Card Title
    </Text>
  </Card.Header>
  <Card.Body>
    <Text variant="text" size="m">
      Card content goes here.
    </Text>
  </Card.Body>
</Card.Root>
```

## Examples

### Interactive action card

`Card.Button` is an alternative root to `Card.Root`. Its children must not contain links, buttons,
form controls, or other interactive elements. Compose its content from phrasing elements such as
`Text` rendered as a `<span>`, `Badge`, and `Icon`; the div-based Card section parts are for
`Card.Root`.

```tsx
import { Card } from '@tale-ui/react/card';
import { Text } from '@tale-ui/react/text';

<Card.Button variant="outlined" padding="sm" onPress={() => openProject('atlas')}>
  <Text as="span" variant="label" size="m">
    Atlas project
  </Text>
  <Text as="span" variant="text" size="s" color="muted">
    Open project details
  </Text>
</Card.Button>;
```

### Controlled selected state

Provide `isSelected` when the action has a persistent on/off or active state. This applies
`aria-pressed` only when the prop is present, so an ordinary `Card.Button` remains a normal button.

```tsx
import * as React from 'react';
import { Card } from '@tale-ui/react/card';
import { Text } from '@tale-ui/react/text';

export function ThemeCard() {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card.Button isSelected={selected} onPress={() => setSelected((value) => !value)}>
      <Text as="span" variant="label" size="m">
        Harbour theme
      </Text>
    </Card.Button>
  );
}
```

### Outlined (Default)

```tsx
<Card.Root variant="outlined">
  <Card.Header>
    <Text variant="title" size="m">
      Project Settings
    </Text>
  </Card.Header>
  <Card.Body>
    <Text variant="text" size="m">
      Configure your project preferences.
    </Text>
  </Card.Body>
  <Card.Footer>
    <Row gap="s" justify="end">
      <Button>Cancel</Button>
      <Button variant="primary">Save</Button>
    </Row>
  </Card.Footer>
</Card.Root>
```

### Elevated

```tsx
<Card.Root variant="elevated">
  <Card.Body>
    <Text variant="text" size="m">
      An elevated card with a shadow for visual depth.
    </Text>
  </Card.Body>
</Card.Root>
```

### Filled

```tsx
<Card.Root variant="filled">
  <Card.Body>
    <Text variant="text" size="m">
      A filled card with a subtle background color.
    </Text>
  </Card.Body>
</Card.Root>
```

### Padding Sizes

```tsx
<Card.Root padding="sm">
  <Card.Body><Text>Small padding</Text></Card.Body>
</Card.Root>

<Card.Root padding="md">
  <Card.Body><Text>Medium padding (default)</Text></Card.Body>
</Card.Root>

<Card.Root padding="lg">
  <Card.Body><Text>Large padding</Text></Card.Body>
</Card.Root>
```

### Full Example with All Sections

```tsx
<Card.Root variant="outlined" padding="md">
  <Card.Header>
    <Row justify="between" align="center">
      <Text variant="title" size="m">
        Team Members
      </Text>
      <Badge variant="brand">3 active</Badge>
    </Row>
  </Card.Header>
  <Card.Body>
    <Column gap="s">
      <Text variant="text" size="m">
        Alice Johnson
      </Text>
      <Text variant="text" size="m">
        Bob Smith
      </Text>
      <Text variant="text" size="m">
        Carol Lee
      </Text>
    </Column>
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost" size="sm">
      View all
    </Button>
  </Card.Footer>
</Card.Root>
```

## CSS Classes

- `.tale-card` -- Root container
- `.tale-card--button` -- Interactive React Aria button surface
- `.tale-card--outlined` -- Outlined variant (border)
- `.tale-card--elevated` -- Elevated variant (box-shadow)
- `.tale-card--filled` -- Filled variant (background color)
- `.tale-card--sm` -- Small padding
- `.tale-card--md` -- Medium padding
- `.tale-card--lg` -- Large padding
- `.tale-card__header` -- Header section
- `.tale-card__body` -- Body section
- `.tale-card__footer` -- Footer section

## Interaction states

`Card.Button` exposes React Aria state attributes for styling and automated testing:

- `[data-hovered]`
- `[data-pressed]`
- `[data-focus-visible]`
- `[data-disabled]`
- `[data-pending]`
- `[data-selected]` when `isSelected` is true

React Aria supplies pointer, touch, Enter/Space activation, focus-visible detection, disabled
behavior, and pending-state announcements. Provide visible text or an `aria-label` so every
`Card.Button` has an accessible name.

## Pitfalls

<!-- pitfall: card-button-not-inside-root -->

- **`Card.Button` is an alternative root, not a child of `Card.Root`** — nesting the button adds an unnecessary interactive region inside a presentational card.
  - anti-pattern: `<Card.Root><Card.Button>Open</Card.Button></Card.Root>`
  - fix: `<Card.Button>Open</Card.Button>`

<!-- pitfall: card-button-no-interactive-children -->

- **Do not place interactive descendants inside `Card.Button`** — nested buttons, links, inputs, and controls create invalid or ambiguous interaction semantics. Use `Card.Root` when a card contains its own actions.
  - anti-pattern: `<Card.Button><Button>Save</Button></Card.Button>`
  - fix: `<Card.Root><Card.Body>Content</Card.Body><Card.Footer><Button>Save</Button></Card.Footer></Card.Root>`

<!-- pitfall: card-button-phrasing-content -->

- **Compose `Card.Button` with phrasing content, not the div-based `Card.Header`, `Card.Body`, or `Card.Footer` parts** — native buttons accept text-level content, while the structured Card sections are intended for `Card.Root`.
  - anti-pattern: `<Card.Button><Card.Body>Open project</Card.Body></Card.Button>`
  - fix: `<Card.Button><Text as="span">Open project</Text></Card.Button>`

<!-- pitfall: card-button-press-not-click -->

- **Use `onPress`, not `onClick`, for `Card.Button` actions** — `onPress` provides consistent mouse, touch, and keyboard behavior through React Aria.
  - anti-pattern: `<Card.Button onClick={openProject}>Open project</Card.Button>`
  - fix: `<Card.Button onPress={openProject}>Open project</Card.Button>`

<!-- pitfall: card-button-selected-controlled -->

- **`isSelected` is controlled and represents a pressed/active action state** — update it in response to `onPress`; for form-style mutually exclusive choices, use `RadioField` instead.
  - anti-pattern: `<Card.Button isSelected>Theme</Card.Button>` with no state update
  - fix: `<Card.Button isSelected={selected} onPress={() => setSelected(!selected)}>Theme</Card.Button>`

<!-- pitfall: card-no-elevated-boolean -->

- **No `elevated` boolean prop** — use `variant="elevated"`; there is also no `variant="raised"`.
  - anti-pattern: `<Card.Root elevated>`
  - fix: `<Card.Root variant="elevated">`
  - complete example:

    ```tsx
    import { Card } from '@tale-ui/react/card';

    export function Example() {
      return (
        <Card.Root variant="elevated">
          <Card.Header>Title</Card.Header>
          <Card.Body>Content goes here.</Card.Body>
          <Card.Footer>Footer actions</Card.Footer>
        </Card.Root>
      );
    }
    ```

<!-- pitfall: card-header-no-title-props -->

- **`Card.Header` has no `title` or `description` props** — place `<Text>` or other components directly inside `Card.Header` as children.
  - anti-pattern: `<Card.Header title="Card Title" />`
  - fix: `<Card.Header><Text variant="heading">Card Title</Text></Card.Header>`

<!-- pitfall: card-body-footer-no-gap -->
<!-- multi-idea-ok -->

- **Card.Body and Card.Footer do NOT accept a gap prop** — for stacked content in Card.Body use `<Column gap="...">`, and for side-by-side actions in Card.Footer use `<Row gap="...">` inside these parts.
  - anti-pattern: `<Card.Body gap="m">`
  - anti-pattern: `<Card.Footer gap="s">`
  - fix: `<Card.Body><Column gap="s">…</Column></Card.Body>`
  - fix: `<Card.Footer><Row gap="s">…</Row></Card.Footer>`
  <!-- pitfall: for-stat-cards-label-value -->

- **For stat cards, render <Text color="muted"> inside Card.Header — wrap value/badge in <Column> inside Card.Body** — `Card.Header` has no `title` prop; place a `<Text color="muted">` child directly. `Card.Body` has no `gap` prop; wrap contents in `<Column gap="s">`. Use `<Row gap="m">` to lay out multiple stat cards side by side.
  - anti-pattern: `<Card.Header title="Revenue" />`
  - anti-pattern: `<Card.Body gap="s">`
  - fix: `<Card.Header><Text color="muted">Revenue</Text></Card.Header>`
  - fix: `<Card.Body><Column gap="s"><Text variant="display">$48,200</Text><Badge variant="success">+12%</Badge></Column></Card.Body>`
  <!-- pitfall: use-card-row-column-text -->

- **Use Card + Row + Column + Text + Badge for any prompt that asks for stat cards, metric cards, or KPI cards** — when the request is to display a row of cards each showing a label, a large value, and a trend badge, render `Card.Root` for each card with `Card.Header`/`Card.Body`, wrap card body content in `<Column gap="s">`, and use `<Row gap="m">` to lay the cards out horizontally instead of leaving the file empty.
  - anti-pattern: `// empty file`
  - fix: `import { Card } from '@tale-ui/react/card'; import { Row } from '@tale-ui/react/row'; import { Column } from '@tale-ui/react/column'; import { Text } from '@tale-ui/react/text'; import { Badge } from '@tale-ui/react/badge'; export function StatCards() { return <Row gap="m"><Card.Root><Card.Header><Text color="muted">Revenue</Text></Card.Header><Card.Body><Column gap="s"><Text variant="display">$48,200</Text><Badge variant="success">+12%</Badge></Column></Card.Body></Card.Root></Row>; }`
  - complete example:

    ```tsx
    import { Card } from '@tale-ui/react/card';
    import { Row } from '@tale-ui/react/row';
    import { Column } from '@tale-ui/react/column';
    import { Text } from '@tale-ui/react/text';
    import { Badge } from '@tale-ui/react/badge';

    export function StatCards() {
      return (
        <Row gap="m">
          <Card.Root>
            <Card.Header>
              <Text color="muted">Revenue</Text>
            </Card.Header>
            <Card.Body>
              <Column gap="s">
                <Text variant="display">$48,200</Text>
                <Badge variant="success">+12%</Badge>
              </Column>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Header>
              <Text color="muted">Users</Text>
            </Card.Header>
            <Card.Body>
              <Column gap="s">
                <Text variant="display">12,340</Text>
                <Badge variant="success">+8%</Badge>
              </Column>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Header>
              <Text color="muted">Orders</Text>
            </Card.Header>
            <Card.Body>
              <Column gap="s">
                <Text variant="display">1,893</Text>
                <Badge variant="error">-3%</Badge>
              </Column>
            </Card.Body>
          </Card.Root>
        </Row>
      );
    }
    ```

<!-- pitfall: use-card-image-text-column -->

- **Use Card + Image + Text + Column + Row + Badge + IconButton + Icon + Button for any prompt that asks for a profile card, user card, or contact card** — when the request is to display a user's profile photo, name, role/title, skill badges, and action buttons inside a card, render `Card.Root` with `Card.Header`, `Card.Body`, and `Card.Footer`; place `<Image>` in `Card.Header`, wrap body content in `<Column gap="s">` inside `Card.Body`, and wrap footer actions in `<Row gap="s">` inside `Card.Footer`. Use `variant="elevated"` when the prompt requests an elevated card style.
  - anti-pattern: `// empty file`
  - fix: `import { Card } from '@tale-ui/react/card'; import { Image } from '@tale-ui/react/image'; import { Text } from '@tale-ui/react/text'; import { Column } from '@tale-ui/react/column'; import { Row } from '@tale-ui/react/row'; import { Badge } from '@tale-ui/react/badge'; import { IconButton } from '@tale-ui/react/icon-button'; import { Icon } from '@tale-ui/react/icon'; import { Button } from '@tale-ui/react/button'; import { Pencil } from 'lucide-react'; export function UserProfileCard() { return <Card.Root variant="elevated"><Card.Header><Image src="/profile.jpg" alt="Sarah Chen" radius="full" width={80} height={80} /></Card.Header><Card.Body><Column gap="s"><Text variant="heading">Sarah Chen</Text><Text color="muted">Senior Engineer</Text><Row gap="s"><Badge variant="neutral">React</Badge><Badge variant="neutral">TypeScript</Badge></Row></Column></Card.Body><Card.Footer><Row gap="s"><IconButton variant="ghost" aria-label="Edit profile"><Icon icon={Pencil} /></IconButton><Button variant="primary">Message</Button></Row></Card.Footer></Card.Root>; }`
  - complete example:

    ```tsx
    import { Card } from '@tale-ui/react/card';
    import { Image } from '@tale-ui/react/image';
    import { Text } from '@tale-ui/react/text';
    import { Column } from '@tale-ui/react/column';
    import { Row } from '@tale-ui/react/row';
    import { Badge } from '@tale-ui/react/badge';
    import { IconButton } from '@tale-ui/react/icon-button';
    import { Icon } from '@tale-ui/react/icon';
    import { Button } from '@tale-ui/react/button';
    import { Pencil } from 'lucide-react';

    export function UserProfileCard() {
      return (
        <Card.Root variant="elevated">
          <Card.Header>
            <Image src="/profile.jpg" alt="Sarah Chen" radius="full" width={80} height={80} />
          </Card.Header>
          <Card.Body>
            <Column gap="s">
              <Text variant="heading">Sarah Chen</Text>
              <Text color="muted">Senior Engineer</Text>
              <Row gap="s">
                <Badge variant="neutral">React</Badge>
                <Badge variant="neutral">TypeScript</Badge>
              </Row>
            </Column>
          </Card.Body>
          <Card.Footer>
            <Row gap="s">
              <IconButton variant="ghost" aria-label="Edit profile">
                <Icon icon={Pencil} />
              </IconButton>
              <Button variant="primary">Message</Button>
            </Row>
          </Card.Footer>
        </Card.Root>
      );
    }
    ```

## Notes

- `Card.Root`, `Card.Header`, `Card.Body`, and `Card.Footer` are styled structural elements. `Card.Button` is built on React Aria's `Button` primitive.
- For side-by-side cards, wrapping each `Card.Root` in its own `<Column>` inside a `<Row>` is the recommended layout pattern.
- All parts are optional. Use only what you need.
- Default variant is `outlined`, default padding is `md`.
- The `padding` prop on `Root` controls internal spacing for all child sections via CSS.
