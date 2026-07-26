# PaymentInput

`import { PaymentInput } from '@tale-ui/react/payment-input';`

A credit card number input with auto-formatting and card type detection. Automatically groups digits (4-4-4-4 for most cards, 4-6-5 for Amex) and detects the card network (Visa, Mastercard, Amex, Discover).

## Parts

| Part | Description |
|------|-------------|
| `PaymentInput.Root` | Wrapper managing value, formatting, and ARIA semantics |
| `PaymentInput.Label` | Accessible label |
| `PaymentInput.Group` | Groups the input and card icon together |
| `PaymentInput.Input` | The text input (`inputMode="numeric"`) |
| `PaymentInput.CardIcon` | Auto-detects card type from input value and displays an icon |
| `PaymentInput.Description` | Helper text |
| `PaymentInput.ErrorMessage` | Validation error message |

## Props

Accepts all React Aria `TextField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<PaymentInput.Root>
  <PaymentInput.Label>Card number</PaymentInput.Label>
  <PaymentInput.Group>
    <PaymentInput.Input />
    <PaymentInput.CardIcon />
  </PaymentInput.Group>
</PaymentInput.Root>
```

## Examples

### With Description

```tsx
<PaymentInput.Root>
  <PaymentInput.Label>Card number</PaymentInput.Label>
  <PaymentInput.Group>
    <PaymentInput.Input />
    <PaymentInput.CardIcon />
  </PaymentInput.Group>
  <PaymentInput.Description>Enter your 15 or 16 digit card number</PaymentInput.Description>
</PaymentInput.Root>
```

### With Validation

```tsx
<PaymentInput.Root isRequired>
  <PaymentInput.Label>Card number</PaymentInput.Label>
  <PaymentInput.Group>
    <PaymentInput.Input />
    <PaymentInput.CardIcon />
  </PaymentInput.Group>
  <PaymentInput.ErrorMessage>Please enter a valid card number</PaymentInput.ErrorMessage>
</PaymentInput.Root>
```

## CSS Classes

- `.tale-payment-input` — Root
- `.tale-payment-input__label` — Label
- `.tale-payment-input__group` — Input + icon wrapper
- `.tale-payment-input__input` — Text input
- `.tale-payment-input__card-icon` — Card type icon (has `data-card-type` attribute: visa, mastercard, amex, discover, unknown)
- `.tale-payment-input__description` — Description text
- `.tale-payment-input__error` — Error message

## Pitfalls

<!-- pitfall: payment-input-no-phantom-sub-parts -->
<!-- multi-idea-ok -->
- **No phantom sub-parts: `PaymentInput.Number`, `PaymentInput.CardNumber`, and `PaymentInput.NumberInput` do not exist** — the card number input sub-part is `PaymentInput.Input`.
  - anti-pattern: `<PaymentInput.CardNumber />`
  - fix: `<PaymentInput.Input />`
  - complete example:
    ```tsx
    import { PaymentInput } from '@tale-ui/react/payment-input';

    export function Example() {
      return (
        <PaymentInput.Root>
          <PaymentInput.Label>Card number</PaymentInput.Label>
          <PaymentInput.Group>
            <PaymentInput.Input placeholder="1234 5678 9012 3456" />
            <PaymentInput.CardIcon />
          </PaymentInput.Group>
        </PaymentInput.Root>
      );
    }
    ```

## Notes

- CardIcon auto-detects card type — use self-closing inside Group, no value prop needed.
- Input auto-formats digits with spaces. Do not manually format the value.
- Always wrap Input and CardIcon in PaymentInput.Group.
- Card type detection: Visa (starts with 4), Mastercard (51-55 or 2221-2720), Amex (34 or 37), Discover (6011, 644-649, 65).
- Amex cards are formatted as 4-6-5 (15 digits). All others as 4-4-4-4 (16 digits).
