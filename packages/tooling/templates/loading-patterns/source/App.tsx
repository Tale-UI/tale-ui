import { Spinner } from '@tale-ui/react/spinner';
import { Row } from '@tale-ui/react/row';

export function LoadingSection() {
  return (
    <Row justify="center" style={{ padding: 'var(--space-l)' }}>
      <Spinner size="md" aria-label="Loading content" />
    </Row>
  );
}


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



export function Example() {
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
