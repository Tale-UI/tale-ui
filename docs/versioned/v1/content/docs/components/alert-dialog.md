# AlertDialog

`import { AlertDialog } from '@tale-ui/react/alert-dialog';`

A modal alert dialog with `role="alertdialog"` for confirmations and destructive actions.

## Parts

| Part | Description |
|------|-------------|
| `AlertDialog.Root` | Manages open/close state. |
| `AlertDialog.Trigger` | Button that opens the alert dialog. Applies `tale-alert-dialog__trigger` (not `tale-button`). |
| `AlertDialog.Backdrop` | Modal overlay behind the dialog. **Must wrap `AlertDialog.Popup`**. |
| `AlertDialog.Popup` | Modal wrapper. Must be a child of `AlertDialog.Backdrop`. |
| `AlertDialog.Content` | The `alertdialog` element. Wrap Title, Description, and actions inside. |
| `AlertDialog.Title` | Heading with `slot="title"`. |
| `AlertDialog.Description` | Paragraph describing the alert. |
| `AlertDialog.Close` | Button that closes the dialog via `slot="close"`. |
| `AlertDialog.Actions` | Actions row for confirm/cancel buttons. |

## Props

Accepts all React Aria `DialogTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { useState } from 'react';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Button } from '@tale-ui/react/button';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog.Root isOpen={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className="tale-button tale-button--danger">
        Delete Item
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Content>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This will permanently delete the item. This action cannot be undone.
            </AlertDialog.Description>
            <AlertDialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
            </AlertDialog.Actions>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
  );
}
```

> **Note:** `AlertDialog.Trigger` does NOT auto-apply `tale-button` — add both base class and variant. For action buttons, use standalone `Button` components.

## CSS Classes

- `.tale-alert-dialog__trigger` — Trigger button (not `tale-button`)
- `.tale-alert-dialog__backdrop` — Backdrop overlay
- `.tale-alert-dialog__popup` — Modal wrapper
- `.tale-alert-dialog__content` — Dialog content (`role="alertdialog"`)
- `.tale-alert-dialog__title` — Title heading
- `.tale-alert-dialog__description` — Description paragraph
- `.tale-alert-dialog__close` — Close button
- `.tale-alert-dialog__actions` — Actions row

## Pitfalls

<!-- pitfall: alert-dialog-no-cancel-action-parts -->
- **No `AlertDialog.Cancel` or `AlertDialog.Action` sub-parts** — use `<Button>` inside `AlertDialog.Actions` for Cancel and Confirm.
  - anti-pattern: `<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>`
  - fix: `<Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>`

<!-- pitfall: alert-dialog-content-required -->
- **`AlertDialog.Content` is required inside `AlertDialog.Popup`** — it provides `role="alertdialog"`; do not place `Title` and `Description` directly inside `Popup`.
  - anti-pattern: `<AlertDialog.Popup><AlertDialog.Title>...</AlertDialog.Title></AlertDialog.Popup>`
  - fix: `<AlertDialog.Popup><AlertDialog.Content><AlertDialog.Title>...</AlertDialog.Title></AlertDialog.Content></AlertDialog.Popup>`

<!-- pitfall: alert-dialog-trigger-needs-base-class -->
- **`AlertDialog.Trigger` requires the base `tale-button` class** — unlike most styled wrappers, the trigger applies `tale-alert-dialog__trigger` (a positioning hook), not `tale-button`. Variant/size modifiers alone give color and dimensions but no padding, border-radius, or font styling.
  - anti-pattern: `<AlertDialog.Trigger className="tale-button--danger tale-button--md">`
  - fix: `<AlertDialog.Trigger className="tale-button tale-button--danger tale-button--md">`

<!-- cross-pitfall-ref: no-asChild-on-triggers -->
<!-- cross-pitfall-ref: no-button-inside-trigger -->
<!-- cross-pitfall-ref: isopen-on-dialog-and-alert-dialog -->
<!-- cross-pitfall-ref: backdrop-wraps-popup-on-dialog-and-alert-dialog -->

## Notes

- **Trigger needs explicit `tale-button`.** Unlike `Dialog.Trigger`, `AlertDialog.Trigger` applies `tale-alert-dialog__trigger` as its base class, not `tale-button`. Add both classes for button styling: `className="tale-button tale-button--danger"`.
- **Popup and Content are separate.** `Popup` is the Modal container, `Content` is the alertdialog element inside it. Always nest `Content` inside `Popup`.
- Unlike `Dialog`, AlertDialog renders with `role="alertdialog"` for screen reader announcements.
- **ARIA labelling:** `AlertDialog.Title` is automatically associated with `aria-labelledby` and `AlertDialog.Description` with `aria-describedby`. Always include both for accessibility.
- **Uncontrolled shortcut:** For simple cases, you can skip `isOpen`/`onOpenChange` and use `slot="close"` on action `Button` elements instead of `onPress={() => setOpen(false)}`. React Aria will close the dialog automatically.
- **Do not add a corner X close button by default.** AlertDialog uses `role="alertdialog"` — it is semantically for actions that require explicit acknowledgement (destructive operations, confirmations). Adding `<AlertDialog.Close />` (corner X icon) allows dismissal without making a choice, which defeats the purpose. The basic example intentionally omits it. If you must include `AlertDialog.Close`, ensure it behaves identically to the safe/non-destructive action (Cancel) — never wire it to the destructive action. For general-purpose modals that can be freely dismissed, use `Dialog` instead.
