# Loading Patterns

Spinner, ProgressBar, and Button pending state for loading UIs.

## Inline loading spinner

```tsx
import { Spinner } from '@tale-ui/react/spinner';
import { Row } from '@tale-ui/react/row';

export function LoadingSection() {
  return (
    <Row justify="center" style={{ padding: 'var(--space-l)' }}>
      <Spinner size="md" aria-label="Loading content" />
    </Row>
  );
}
```

## Button with pending state

```tsx
import { useState } from 'react';
import { Button } from '@tale-ui/react/button';

async function submitForm() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export function SubmitButton() {
  const [pending, setPending] = useState(false);

  async function handlePress() {
    setPending(true);
    try {
      await submitForm();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="primary" isPending={pending} onPress={handlePress}>
      Save Changes
    </Button>
  );
}
```

## Determinate progress bar

```tsx
import { ProgressBar } from '@tale-ui/react/progress-bar';

export function UploadProgress({ percent }: { percent: number }) {
  return (
    <ProgressBar.Root value={percent} minValue={0} maxValue={100}>
      <ProgressBar.Header>
        <ProgressBar.Label>Uploading...</ProgressBar.Label>
        <ProgressBar.Value />
      </ProgressBar.Header>
      <ProgressBar.Track>
        <ProgressBar.Indicator value={percent} />
      </ProgressBar.Track>
    </ProgressBar.Root>
  );
}
```

## Indeterminate progress bar

```tsx
import { ProgressBar } from '@tale-ui/react/progress-bar';

export function IndeterminateLoading() {
  return (
    <ProgressBar.Root isIndeterminate>
      <ProgressBar.Header>
        <ProgressBar.Label>Processing...</ProgressBar.Label>
      </ProgressBar.Header>
      <ProgressBar.Track>
        <ProgressBar.Indicator value={null} />
      </ProgressBar.Track>
    </ProgressBar.Root>
  );
}
```

## Key points

- `Spinner` is a simple component — pass `size` (`sm`, `md`, `lg`) and always include `aria-label`.
- `Button` accepts `isPending` which shows a spinner and disables interaction.
- `ProgressBar.Indicator` **must** receive `value` separately from the Root (see [deviations](../react-aria-deviations.md#meter-and-progressbar-value-passing)).
- For indeterminate state, pass `isIndeterminate` to Root and `value={null}` to Indicator.
