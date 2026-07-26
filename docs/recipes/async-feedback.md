# Async Feedback

Report asynchronous success and failure without sharing queue state across
application instances or server-rendered requests.

## Components Used

- `Button` from `@tale-ui/react/button`
- `createToastQueue` and `ToastRegion` from `@tale-ui/react/toast`

## Code

```tsx
import { useState } from 'react';
import { Button } from '@tale-ui/react/button';
import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';

export function AsyncFeedback({ save }: { save: () => Promise<void> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [queue] = useState(() =>
    createToastQueue({
      maxVisibleToasts: 3,
    }),
  );

  async function handleSave() {
    setIsSaving(true);

    try {
      await save();
      queue.add({
        title: 'Changes saved',
        description: 'Your preferences are up to date.',
        variant: 'success',
      });
    } catch {
      queue.add(
        {
          title: 'Changes not saved',
          description: 'Check your connection and try again.',
          variant: 'danger',
        },
        { timeout: 0 },
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button isPending={isSaving} onPress={() => void handleSave()}>
        Save changes
      </Button>
      <ToastRegion queue={queue} />
    </>
  );
}
```

## Key points

- Create the queue once for the mounted application boundary. Avoid
  module-global queues in SSR applications.
- Let routine success feedback use the queue timeout. Keep actionable failure
  feedback persistent with `timeout: 0`.
- `Button` exposes the pending operation while the Toast reports its outcome.
- Keep durable recovery instructions in the page when losing them would block
  the user; a Toast is transient feedback.
