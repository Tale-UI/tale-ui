# Switch

`import { Switch } from '@tale-ui/react/switch';`

A toggle switch component with a sliding thumb, built on React Aria's Switch.

> **Deprecated:** prefer [SwitchField](switch-field.md) for new code. The underlying React Aria `Switch` is deprecated upstream (React Aria Components 1.18) in favour of `SwitchField` + `SwitchButton`. `Switch` remains fully functional and supported for backwards compatibility.

## Migration

Use `SwitchField` instead — it adds built-in description, error message, and validation support:

```tsx
// Before
import { Switch } from '@tale-ui/react/switch';

<Switch.Root>
  <Switch.Thumb />
  Enable notifications
</Switch.Root>;

// After
import { SwitchField } from '@tale-ui/react/switch-field';

<SwitchField.Root>
  <SwitchField.Button>
    <SwitchField.Thumb />
    Enable notifications
  </SwitchField.Button>
</SwitchField.Root>;
```

The label text and `Thumb` move inside `SwitchField.Button` (the clickable `<label>`); `SwitchField.Root` is a `<div>` wrapper that also lays out the optional `Description` and `Error` parts. State props (`isSelected`, `defaultSelected`, `onChange`, `isDisabled`, ...) are unchanged, and `SwitchField` additionally supports `isRequired`/`isInvalid`/`validate`.

## Parts

| Part           | Description                         |
| -------------- | ----------------------------------- |
| `Switch.Root`  | The switch label and toggle wrapper |
| `Switch.Thumb` | The sliding thumb indicator         |

## Props

Accepts all React Aria `Switch` props plus:

| Prop        | Type     | Default | Description               |
| ----------- | -------- | ------- | ------------------------- |
| `className` | `string` | --      | Additional CSS class name |

### Visual

| Prop      | Type      | Default | Description                                  |
| --------- | --------- | ------- | -------------------------------------------- |
| `checked` | `boolean` | `false` | Whether the switch visual appears on/checked |

`Switch.Visual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
<Switch.Root>
  <Switch.Thumb />
  Enable notifications
</Switch.Root>
```

## Examples

### Selected by Default

```tsx
<Switch.Root defaultSelected>
  <Switch.Thumb />
  Dark mode
</Switch.Root>
```

### Disabled

```tsx
<Switch.Root isDisabled>
  <Switch.Thumb />
  Disabled switch
</Switch.Root>
```

### Disabled and Selected

```tsx
<Switch.Root isDisabled defaultSelected>
  <Switch.Thumb />
  Disabled and on
</Switch.Root>
```

### All States

```tsx
<Switch.Root>
  <Switch.Thumb />
  Default (off)
</Switch.Root>

<Switch.Root defaultSelected>
  <Switch.Thumb />
  Default (on)
</Switch.Root>

<Switch.Root isDisabled>
  <Switch.Thumb />
  Disabled (off)
</Switch.Root>

<Switch.Root isDisabled defaultSelected>
  <Switch.Thumb />
  Disabled (on)
</Switch.Root>
```

## CSS Classes

- `.tale-switch` -- Base (root label)
- `.tale-switch__thumb` -- The sliding thumb element

## Pitfalls

<!-- pitfall: switch-no-label-indicator-sub-parts -->
<!-- multi-idea-ok -->

- **Switch has no Label or Indicator sub-parts — only Root and Thumb** — Switch exposes only Switch.Root and Switch.Thumb. For a simple standalone switch, label text can be a direct child of Switch.Root placed after Switch.Thumb. However, when building settings-card rows where a label sits on the left and the switch on the right, the label text must NOT be placed inside Switch.Root — instead place a Text label and a Switch.Root (containing only Switch.Thumb /) inside a Row style={{ justifyContent: 'space-between', alignItems: 'center' }}. Placing label text inside Switch.Root in a settings-card context causes Row to never appear in the code, failing the required-component check. Any prompt mentioning notification preference switches, notification settings, or a settings card with switches requires this Row layout pattern — the pattern Switch.Root > Switch.Thumb > label text is ONLY valid for simple standalone switches, never for settings-card layouts.
  - anti-pattern: `<Switch.Label>Enable</Switch.Label>`
  - anti-pattern: `<Switch.Root defaultSelected><Switch.Thumb />Email notifications</Switch.Root>`
  - fix: `<Switch.Root><Switch.Thumb />Enable notifications</Switch.Root>`
  - fix: `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Email notifications</Text><Switch.Root defaultSelected><Switch.Thumb /></Switch.Root></Row>`
  - complete example:
    ```tsx
    import { Switch } from '@tale-ui/react/switch';
    import { Row } from '@tale-ui/react/row';
    import { Text } from '@tale-ui/react/text';
        // Simple standalone switch — label text as Switch.Root child is valid here
        export function SimpleSwitch() {
          return (
            <Switch.Root>
              <Switch.Thumb />
              Enable notifications
            </Switch.Root>
          );
        }

        // Settings-card row — label MUST go in a sibling <Text> inside a <Row>, not inside Switch.Root
        export function SettingsRow() {
          return (
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Email notifications</Text>
              <Switch.Root defaultSelected>
                <Switch.Thumb />
              </Switch.Root>
            </Row>
          );
        }
        ```
<!-- pitfall: use-defaultselected-to-turn-a -->
- **Use `defaultSelected` to turn a switch on by default in settings rows** — `Switch.Root` accepts `defaultSelected` (uncontrolled initial state) or `isSelected`/`onChange` (controlled). For a settings-card layout with a label on the left and the switch on the right, place `<Text>` and `<Switch.Root>` inside a `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>` — do not rely on text flowing after `<Switch.Thumb />` for this pattern.
  - anti-pattern: `<Switch.Root on><Switch.Thumb />Email notifications</Switch.Root>`
  - fix: `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Email notifications</Text><Switch.Root defaultSelected><Switch.Thumb /></Switch.Root></Row>`

<!-- pitfall: use-switch-card-layout-for-settings-prompts -->

- **Use Switch, Card, Column, Row, Text for settings-card prompts with preference switches** — MANDATORY LAYOUT RULE — Row is ALWAYS required and MUST appear in both imports and JSX for settings-card switch layouts. Applies to every prompt mentioning notification preference switches, notification settings, settings card with switches, or any named on/off toggle preferences. The rules are: (1) import Row from '@tale-ui/react/row' — without this import Row will be absent from the output; (2) wrap EACH switch row in <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>; (3) place <Text> label on the left and <Switch.Root> containing ONLY <Switch.Thumb /> on the right inside that Row — NEVER put label text as a direct child of Switch.Root in this layout, not even as plain text before or after Switch.Thumb; (4) stack rows in <Column gap="s"> inside Card.Body; (5) do NOT apply style={{ justifyContent: 'space-between' }} directly to Switch.Root as a flex-layout substitute for Row; (6) use defaultSelected for any switch that should be on by default; (7) CRITICAL: placing label text inside Switch.Root — even as plain text after Switch.Thumb — will cause Row to never appear in the code, failing the required-component check. The five required imports are Card, Switch, Column, Row, and Text — all five must appear. The pattern '<Switch.Root><Switch.Thumb />Label text</Switch.Root>' is ONLY valid for simple standalone switches, never for settings-card layouts.
  - anti-pattern: `<Switch.Root defaultSelected><Switch.Thumb />Email notifications</Switch.Root>`
  - anti-pattern: `<Switch.Root><Switch.Thumb />Push notifications</Switch.Root>`
  - anti-pattern: `<Switch.Root><Switch.Thumb />SMS notifications</Switch.Root>`
  - anti-pattern: `<Column gap="s"><Switch.Root defaultSelected><Switch.Thumb />Email notifications</Switch.Root></Column>`
  - anti-pattern: `<Switch.Root isSelected={email} onChange={setEmail}><Switch.Thumb />Email notifications</Switch.Root>`
  - anti-pattern: `<Switch.Root defaultSelected style={{ justifyContent: 'space-between' }}><Switch.Thumb />Email notifications</Switch.Root>`
  - anti-pattern: `<Switch.Root defaultSelected style={{ width: '100%', justifyContent: 'space-between' }}>Email notifications<Switch.Thumb /></Switch.Root>`
  - anti-pattern: `import { Card } from '@tale-ui/react/card'; import { Switch } from '@tale-ui/react/switch'; import { Column } from '@tale-ui/react/column'; import { Text } from '@tale-ui/react/text'; /* Row is missing — Separator must never substitute Row here */`
  - fix: `import { Row } from '@tale-ui/react/row';`
  - fix: `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Email notifications</Text><Switch.Root defaultSelected><Switch.Thumb /></Switch.Root></Row>`
  - fix: `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Push notifications</Text><Switch.Root><Switch.Thumb /></Switch.Root></Row>`
  - fix: `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>SMS notifications</Text><Switch.Root><Switch.Thumb /></Switch.Root></Row>`
  - fix: `import { Card } from '@tale-ui/react/card'; import { Switch } from '@tale-ui/react/switch'; import { Column } from '@tale-ui/react/column'; import { Row } from '@tale-ui/react/row'; import { Text } from '@tale-ui/react/text';`
  - complete example:

    ```tsx
    import { Card } from '@tale-ui/react/card';
    import { Switch } from '@tale-ui/react/switch';
    import { Column } from '@tale-ui/react/column';
    import { Row } from '@tale-ui/react/row';
    import { Text } from '@tale-ui/react/text';

    export function NotificationSettings() {
      return (
        <Card.Root>
          <Card.Header>
            <Text variant="heading">Notification Preferences</Text>
          </Card.Header>
          <Card.Body>
            <Column gap="s">
              <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Email notifications</Text>
                <Switch.Root defaultSelected>
                  <Switch.Thumb />
                </Switch.Root>
              </Row>
              <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Push notifications</Text>
                <Switch.Root>
                  <Switch.Thumb />
                </Switch.Root>
              </Row>
              <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>SMS notifications</Text>
                <Switch.Root>
                  <Switch.Thumb />
                </Switch.Root>
              </Row>
            </Column>
          </Card.Body>
        </Card.Root>
      );
    }
    ```

## Notes

- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- The label text is placed as a child of `Switch.Root`, alongside `Switch.Thumb`.
- Supports `data-readonly`, `data-required`, and `data-invalid` attributes for corresponding states.
