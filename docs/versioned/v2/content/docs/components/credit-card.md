# CreditCard

`import { CreditCard } from '@tale-ui/react/credit-card';`

Visual credit-card display component with 13 decorative style variants. Accepts card details as props and renders a pixel-perfect card face. The component scales uniformly when `width` is provided.

## Parts

| Part | Element | Description |
|------|---------|-------------|
| `CreditCard.Root` | `<div>` | The full card renderer |

## Props — `CreditCard.Root`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| company | `string` | `'Company'` | Company or bank name shown top-left |
| cardNumber | `string` | `'1234 1234 1234 1234'` | 16-digit card number string |
| cardHolder | `string` | `'OLIVIA RHYE'` | Cardholder name (rendered uppercase) |
| cardExpiration | `string` | `'06/28'` | Expiration date string |
| type | `CreditCardType` | `'brand-dark'` | Visual style variant (see table below) |
| width | `number` | -- | Desired width in pixels. Height is calculated automatically to maintain the 316 × 190 aspect ratio. Defaults to 316 px |

Also accepts all standard `<div>` HTML attributes.

### Type variants

| Value | Style |
|-------|-------|
| `brand-dark` | Dark gradient using `--color-70` → `--color-90`; white text |
| `brand-light` | Light `--color-10` background; dark text; color Mastercard logo |
| `gray-dark` | Dark gradient using `--neutral-70` → `--neutral-90`; white text |
| `gray-light` | Light `--neutral-10` background; dark text; color Mastercard logo |
| `transparent` | Glassmorphism: semi-transparent + blur; white text |
| `transparent-gradient` | Glassmorphism with colour blob diffusor; white text |
| `transparent-strip` | Glass + transparent dark bottom half; white text |
| `gray-strip` | Light gray + dark bottom half; mixed text |
| `gradient-strip` | Blue-to-pink gradient + dark bottom half; white text |
| `salmon-strip` | Salmon + dark bottom half; white text |
| `gray-strip-vertical` | Glass + dark left column; white text |
| `gradient-strip-vertical` | Purple-to-pink gradient + dark left column; white text |
| `salmon-strip-vertical` | Salmon + dark left column; white text |

## Basic Usage

```tsx
import { CreditCard } from '@tale-ui/react/credit-card';

<CreditCard.Root company="Acme Inc." />
```

## Examples

### All normal variants

```tsx
<CreditCard.Root type="brand-dark" />
<CreditCard.Root type="brand-light" />
<CreditCard.Root type="gray-dark" />
<CreditCard.Root type="gray-light" />
<CreditCard.Root type="transparent" />
<CreditCard.Root type="transparent-gradient" />
```

### Strip variants

```tsx
<CreditCard.Root type="gray-strip" />
<CreditCard.Root type="gradient-strip" />
<CreditCard.Root type="salmon-strip" />
```

### Vertical strip variants

```tsx
<CreditCard.Root type="gradient-strip-vertical" />
<CreditCard.Root type="salmon-strip-vertical" />
```

### Custom card details

```tsx
<CreditCard.Root
  type="brand-dark"
  company="Acme Bank"
  cardNumber="4242 4242 4242 4242"
  cardHolder="JOHN DOE"
  cardExpiration="12/29"
/>
```

### Scaled width

```tsx
{/* Renders at 240 × 144 px (maintains 316:190 ratio) */}
<CreditCard.Root type="brand-dark" width={240} />
```

## CSS Classes

- `.tale-credit-card` — Outer sized wrapper
- `.tale-credit-card__inner` — Inner card at native 316 × 190 (scaled via `transform`)
- `.tale-credit-card__inner--{type}` — Variant background modifier (one of the 13 type values)
- `.tale-credit-card__strip` — Dark horizontal strip overlay (strip variants)
- `.tale-credit-card__strip-vertical` — Dark vertical strip overlay (vertical strip variants)
- `.tale-credit-card__gradient-diffusor` — Colour blob container (`transparent-gradient` only)
- `.tale-credit-card__header` — Top row (company + paypass icon)
- `.tale-credit-card__company` — Company name text
- `.tale-credit-card__paypass` — Paypass/contactless SVG icon
- `.tale-credit-card__footer` — Bottom row (details + logo)
- `.tale-credit-card__details` — Left column of footer
- `.tale-credit-card__name-row` — Holder + expiration row
- `.tale-credit-card__holder` — Cardholder name
- `.tale-credit-card__expiration` — Expiration date
- `.tale-credit-card__number` — Card number
- `.tale-credit-card__logo-wrap` — Mastercard logo container

## Pitfalls

<!-- pitfall: credit-card-compound-root -->
- **Always use `CreditCard.Root`** — `CreditCard` is a namespace; it cannot be rendered directly.
  - anti-pattern: `<CreditCard type="brand-dark" />`
  - fix: `<CreditCard.Root type="brand-dark" />`

<!-- pitfall: credit-card-width-prop -->
- **Use the `width` prop to scale, not CSS `width`** — CSS `width` only resizes the outer wrapper, not the inner card chrome. Use the `width` prop to scale the whole card uniformly.
  - anti-pattern: `<CreditCard.Root style={{ width: '240px' }} />`
  - fix: `<CreditCard.Root width={240} />`
<!-- pitfall: use-creditcard-for-any-prompt -->
- **Use CreditCard.Root for any prompt that asks for a credit card display — never return empty code** — When a prompt asks for a credit card (dark, branded, etc.), immediately render CreditCard.Root with the appropriate type prop. Dark brand-coloured cards use type="brand-dark". CreditCard.Root does NOT accept companyName or cardNumber props — passing them causes a TypeScript assignability error because they are not part of RootProps. Use only the documented props: type and width.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function DarkCard() {}`
  - anti-pattern: `<CreditCard type="brand-dark" companyName="Acme" cardNumber="4111 1111 1111 1111" />`
  - anti-pattern: `<CreditCard.Root type="brand-dark" companyName="Acme Corp" cardNumber="4111 1111 1111 1111" />`
  - fix: `import { CreditCard } from '@tale-ui/react/credit-card'; export function DarkBrandCard() { return <CreditCard.Root type="brand-dark" />; }`
  - complete example:
    ```tsx
    import { CreditCard } from '@tale-ui/react/credit-card';

    export function DarkBrandCard() {
      return (
        <CreditCard.Root type="brand-dark" />
      );
    }
    ```

## Notes

- Custom component — not built on a React Aria primitive.
- The Mastercard logo is an inline SVG; it shows the color logo for `brand-*` and `gray-*` light variants, and a white logo for all other variants.
- Glassmorphism (`transparent` / `transparent-gradient`) works best when the card is placed over a colorful background.
