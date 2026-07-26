# CSPProvider

`import { CSPProvider } from '@tale-ui/react/csp-provider';`

Provides Content Security Policy (CSP) configuration for Tale UI components that inject inline `<style>` or `<script>` elements.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nonce` | `string` | — | Nonce value applied to inline `<style>` and `<script>` tags |
| `disableStyleElements` | `boolean` | `false` | Prevents Tale UI from injecting inline `<style>` elements entirely |
| `children` | `ReactNode` | — | App content |

## Basic Usage

Wrap your app root to apply a CSP nonce to all Tale UI inline styles:

```tsx
import { CSPProvider } from '@tale-ui/react/csp-provider';

<CSPProvider nonce={myNonceValue}>
  <App />
</CSPProvider>
```

### Disable Inline Styles

If your CSP policy forbids all inline styles (even with a nonce), disable them entirely:

```tsx
<CSPProvider disableStyleElements>
  <App />
</CSPProvider>
```

When `disableStyleElements` is `true`, components that normally inject inline styles will not render them. You must provide equivalent styles via your own CSS.

## Notes

- Place `CSPProvider` at or near the root of your React tree, above any Tale UI components.
- The `nonce` value should come from your server's CSP header and be passed to the client (typically via a `<meta>` tag or server-rendered prop).
- If you do not use a Content Security Policy, you do not need this provider.
