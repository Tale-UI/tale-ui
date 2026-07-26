# Toast

```ts
import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';
```

Experimental queued feedback with Tale-owned snapshots, localized Region and
dismiss labels, automatic timeouts, and deterministic programmatic control.

## Queue Factory

| Option             | Type     | Default | Description                                    |
| ------------------ | -------- | ------- | ---------------------------------------------- |
| `maxVisibleToasts` | `number` | `1`     | Maximum number of Toasts rendered at once      |
| `defaultTimeout`   | `number` | `5000`  | Default lifetime in milliseconds; `0` persists |

`createToastQueue` returns one queue with these methods:

| Method                   | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `add(message, options?)` | Validates and queues a Toast, then returns its opaque key |
| `close(key)`             | Closes the keyed Toast when it belongs to this queue      |
| `clear()`                | Closes every queued Toast                                 |
| `pauseAll()`             | Adds a programmatic pause reason for every active timeout |
| `resumeAll()`            | Removes one programmatic pause reason                     |

Messages require a non-empty string `title`. They may also include a string
`description` and a `variant` of `neutral`, `success`, `warning`, or `danger`.
Per-Toast options may set a non-negative `timeout` and an `onClose` callback.
A timeout of `0` persists until close or clear.

Keys are opaque, monotonic only within their queue, and must not be parsed or
shared between queues. The public queue is intentionally not structurally
compatible with React Aria's unstable queue.

## Region Props

| Prop           | Type                                                         | Default        | Description                                 |
| -------------- | ------------------------------------------------------------ | -------------- | ------------------------------------------- |
| `queue`        | `ToastQueue`                                                 | —              | Queue whose visible Toasts this Region owns |
| `aria-label`   | `string`                                                     | localized      | Accessible name for the notification Region |
| `className`    | `string`                                                     | —              | Additional class name for the Region        |
| `placement`    | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'bottom-end'` | Logical viewport placement                  |
| `dismissLabel` | `string`                                                     | localized      | Accessible label for each dismiss button    |

`ToastRegion` forwards its ref to the Region `HTMLDivElement`. Invalid queue
values render nothing. Invalid labels fall back to localized defaults and an
invalid placement falls back to `bottom-end`.

## Basic Usage

```tsx
import { useState } from 'react';
import { Button } from '@tale-ui/react/button';
import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';

export function SavedFeedback() {
  const [queue] = useState(() =>
    createToastQueue({
      maxVisibleToasts: 3,
    }),
  );

  return (
    <>
      <Button
        onPress={() => {
          queue.add({
            title: 'Changes saved',
            description: 'Your preferences are up to date.',
            variant: 'success',
          });
        }}
      >
        Save changes
      </Button>
      <ToastRegion queue={queue} />
    </>
  );
}
```

Create the queue once for each mounted application or provider boundary. Do
not create it during every render and do not use a module-global queue in an
SSR application.

## Timers and Closing

```tsx
const key = queue.add(
  {
    title: 'Upload in progress',
    variant: 'neutral',
  },
  {
    timeout: 0,
    onClose() {
      console.log('Upload notification closed');
    },
  },
);

queue.close(key);
```

Hover, focus, and Region interaction pause the relevant timeout without
discarding its remaining duration. `pauseAll` and `resumeAll` are balanced:
each programmatic pause requires its matching resume. Closing or clearing runs
each Toast's `onClose` once.

## Accessibility

- Keep one Region mounted for each queue so announcements, interaction pauses,
  and cleanup retain one owner.
- Use concise titles that make sense when announced without surrounding page
  context. Descriptions should add detail rather than repeat the title.
- Use `danger` only for failures or destructive outcomes and `warning` for
  conditions that need attention.
- Keep the localized default Region and dismiss labels unless product-specific
  wording is clearer.
- Do not use Toasts for content that must remain available. Put durable status
  and recovery instructions in the page as well.

## CSS Classes

- `.tale-toast-region`
- `.tale-toast`
- `.tale-toast__content`
- `.tale-toast__title`
- `.tale-toast__description`
- `.tale-toast__dismiss`

## Pitfalls

- Keep the queue identity stable for the lifetime of its mounted Region.
- Treat returned keys as opaque and queue-local.
- Use `timeout: 0` only when the user has another clear way to dismiss or act
  on the feedback.
- Balance every explicit `pauseAll()` call with one `resumeAll()` call.
