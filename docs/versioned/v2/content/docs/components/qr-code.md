# QRCode

`import { QRCode } from '@tale-ui/react/qr-code';`

QR code generator with decorative corner-frame handles. Requires the `qr-code-styling` peer dependency.

## Parts

| Part | Description |
|------|-------------|
| `QRCode.Root` | Renders the QR code SVG with corner handles. Requires `value`. |
| `QRCode.Scan` | Decorative gradient scan-line overlay. Absolutely position inside a relative container that also holds `QRCode.Root`. |

## Props

### QRCode.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | The string to encode in the QR code |
| `size` | `'md' \| 'lg'` | `'md'` | Size of the rendered QR code (`96×96` or `128×128` px) |
| `options` | `QRCodeStylingOptions` | — | Extra options forwarded to `qr-code-styling` (overrides `data` and `type`) |

Also accepts all standard `<div>` HTML attributes.

### QRCode.Scan

No Tale UI-specific props. Accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
import { QRCode } from '@tale-ui/react/qr-code';

<QRCode.Root value="https://example.com" size="md" />
```

## Examples

### Both Sizes

```tsx
<div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
  <QRCode.Root value="https://example.com" size="md" />
  <QRCode.Root value="https://example.com" size="lg" />
</div>
```

### With Scan Overlay

```tsx
<div style={{ position: 'relative', display: 'inline-flex' }}>
  <QRCode.Root value="https://example.com" size="lg" />
  <QRCode.Scan />
</div>
```

### Custom Options

```tsx
<QRCode.Root
  value="https://example.com"
  size="lg"
  options={{
    dotsOptions: { color: '#7c3aed', type: 'rounded' },
    backgroundOptions: { color: '#f3f0ff' },
  }}
/>
```

## CSS Classes

- `.tale-qr-code` — Root container
- `.tale-qr-code--md` / `--lg` — Size modifiers
- `.tale-qr-code__canvas` — Inner div where the QR SVG is appended
- `.tale-qr-code__handle` — Corner frame handle span
- `.tale-qr-code__handle--tl` / `--tr` / `--br` / `--bl` — Corner position modifiers
- `.tale-qr-code-scan` — Decorative gradient scan overlay

## Notes

- Requires `qr-code-styling` to be installed: `npm install qr-code-styling`
- The QR code SVG is rendered by appending to a DOM node via `qr-code-styling`; it updates automatically when `value` or `options` change.
- `options.data` and `options.type` are overridden internally — use `value` and `size` instead.

## Pitfalls
