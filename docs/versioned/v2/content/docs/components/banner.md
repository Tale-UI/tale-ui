# Banner

`import { Banner } from '@tale-ui/react/banner';`

An inline notification banner with semantic colour variants for feedback messages.

## Parts

| Part                 | Description                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| `Banner.Root`        | Container (`<div>`). Accepts `variant` and `size` props.                              |
| `Banner.Icon`        | Wrapper for an icon.                                                                  |
| `Banner.Title`       | Main heading text.                                                                    |
| `Banner.Description` | Supporting description text.                                                          |
| `Banner.Actions`     | Container for action buttons.                                                         |
| `Banner.Close`       | Dismiss button. Default `aria-label="Dismiss"` and X icon; pass children to override. |

## Props

### Root

| Prop    | Type                                          | Default  | Description             |
| ------- | --------------------------------------------- | -------- | ----------------------- |
| variant | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Semantic colour variant |
| size    | `'sm' \| 'md'`                                | `'md'`   | Size variant            |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<Banner.Root variant="info">
  <Banner.Icon>
    <Icon icon={InfoIcon} size="sm" />
  </Banner.Icon>
  <Banner.Title>Heads up</Banner.Title>
  <Banner.Description>Your trial expires in 3 days.</Banner.Description>
</Banner.Root>
```

## Examples

### All Variants

```tsx
<Banner.Root variant="info">
  <Banner.Title>Info</Banner.Title>
  <Banner.Description>Informational message.</Banner.Description>
</Banner.Root>

<Banner.Root variant="success">
  <Banner.Title>Success</Banner.Title>
  <Banner.Description>Operation completed.</Banner.Description>
</Banner.Root>

<Banner.Root variant="warning">
  <Banner.Title>Warning</Banner.Title>
  <Banner.Description>Please review before continuing.</Banner.Description>
</Banner.Root>

<Banner.Root variant="error">
  <Banner.Title>Error</Banner.Title>
  <Banner.Description>Something went wrong.</Banner.Description>
</Banner.Root>
```

### With Actions

```tsx
<Banner.Root variant="warning">
  <Banner.Title>Update available</Banner.Title>
  <Banner.Description>A new version is ready to install.</Banner.Description>
  <Banner.Actions>
    <Button variant="ghost" size="sm">
      Later
    </Button>
    <Button variant="primary" size="sm">
      Update now
    </Button>
  </Banner.Actions>
</Banner.Root>
```

### Dismissible

```tsx
<Banner.Root variant="info">
  <Banner.Title>Tip</Banner.Title>
  <Banner.Description>You can customise your dashboard.</Banner.Description>
  <Banner.Close onClick={() => setVisible(false)} />
</Banner.Root>
```

### Small Size

```tsx
<Banner.Root variant="success" size="sm">
  <Banner.Title>Saved</Banner.Title>
  <Banner.Description>Changes saved successfully.</Banner.Description>
</Banner.Root>
```

## CSS Classes

- `.tale-banner` — Root container
- `.tale-banner--info` — Info variant (uses `--neutral-*` tokens — dark background with light text)
- `.color-success` / `.color-warning` / `.color-error` — Theme class from `@tale-ui/css` applied for non-info variants. Remaps `--color-*` tokens to the semantic palette. Applied automatically by the React component.
- `.tale-banner--sm` — Small size
- `.tale-banner__icon` — Icon container
- `.tale-banner__title` — Title text
- `.tale-banner__description` — Description text
- `.tale-banner__actions` — Actions container
- `.tale-banner__close` — Close/dismiss button

## Pitfalls

<!-- pitfall: banner-always-use-root -->

- **Always use `<Banner.Root>`, never bare `<Banner>`** — `Banner` is a namespace component; calling `<Banner>` directly renders nothing.
  - anti-pattern: `<Banner variant="info">Alert</Banner>`
  - fix: `<Banner.Root variant="info"><Banner.Title>Alert</Banner.Title></Banner.Root>`
  - complete example:

    ```tsx
    import { Banner } from '@tale-ui/react/banner';
    import { Icon } from '@tale-ui/react/icon';
    import { InfoIcon } from 'lucide-react';

    export function Example() {
      return (
        <Banner.Root variant="info">
          <Banner.Icon>
            <Icon icon={InfoIcon} size="sm" />
          </Banner.Icon>
          <Banner.Title>Heads up</Banner.Title>
          <Banner.Description>Your trial expires in 3 days.</Banner.Description>
        </Banner.Root>
      );
    }
    ```

<!-- pitfall: banner-no-brand-or-neutral-variant -->

- **No `'brand'` or `'neutral'` variant** — valid values are `'info'` (default), `'success'`, `'warning'`, `'error'`.
  - anti-pattern: `<Banner.Root variant="brand">`
  - fix: `<Banner.Root variant="info">`

<!-- pitfall: banner-use-title-and-description -->
<!-- multi-idea-ok -->

- **Pass content via `Banner.Title` and `Banner.Description`** — do NOT pass raw `<Text>` children directly to `Banner.Root`.
  - anti-pattern: `<Banner.Root><Text>Something went wrong.</Text></Banner.Root>`
  - fix: `<Banner.Root><Banner.Title>Something went wrong.</Banner.Title></Banner.Root>`
  <!-- pitfall: banner-actions-for-buttons -->
- **Use Banner.Actions to add action buttons inside a Banner — never place Button children directly inside Banner.Root** — Banner.Root exposes a Banner.Actions sub-part for placing interactive buttons alongside the title and description. Wrap Button components inside Banner.Actions; do not add them as raw children of Banner.Root. Use this for any prompt that asks for a banner with one or more action buttons such as 'Later' (ghost) and 'Update now' (primary).
  - anti-pattern: `<Banner.Root variant="warning"><Banner.Title>Update available</Banner.Title><Button variant="ghost">Later</Button><Button variant="primary">Update now</Button></Banner.Root>`
  - anti-pattern: `<Banner.Root variant="warning"><Banner.Description>A new version is ready to install.</Banner.Description><Button variant="primary">Update now</Button></Banner.Root>`
  - fix: `<Banner.Root variant="warning"><Banner.Title>Update available</Banner.Title><Banner.Description>A new version is ready to install.</Banner.Description><Banner.Actions><Button variant="ghost">Later</Button><Button variant="primary">Update now</Button></Banner.Actions></Banner.Root>`
  - complete example:

    ```tsx
    import { Banner } from '@tale-ui/react/banner';
    import { Button } from '@tale-ui/react/button';

    export function UpdateAvailableBanner() {
      return (
        <Banner.Root variant="warning">
          <Banner.Title>Update available</Banner.Title>
          <Banner.Description>A new version is ready to install.</Banner.Description>
          <Banner.Actions>
            <Button variant="ghost">Later</Button>
            <Button variant="primary">Update now</Button>
          </Banner.Actions>
        </Banner.Root>
      );
    }
    ```

## Notes

- Custom component — not built on a React Aria primitive.
- Uses `role="status"` for accessibility.
- The `info` variant uses `--neutral-*` tokens (dark `neutral-90` background, `neutral-5` text). Action buttons and close button are styled for visibility on this dark background.
- The `success`, `warning`, and `error` variants use `--color-*` tokens, switched via `.color-*` theme classes.
- `Banner.Close` has a default `aria-label="Dismiss"` and renders a default X icon via the `Icon` component. Pass children to override.
- All parts are optional. Use only what you need.
