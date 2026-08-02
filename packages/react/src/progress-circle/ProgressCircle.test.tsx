import { expect } from 'vitest';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { ProgressCircle } from '@tale-ui/react/progress-circle';
import { createRenderer } from '#test-utils';

describe('<ProgressCircle />', () => {
  const { render } = createRenderer();

  it('uses ProgressCircle.Label as its accessible name', async () => {
    await render(
      <ProgressCircle.Root value={60}>
        <ProgressCircle.Track />
        <ProgressCircle.Label>Upload progress</ProgressCircle.Label>
      </ProgressCircle.Root>,
    );

    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toBeVisible();
  });

  it('uses a zero percentage when min and max are equal', async () => {
    await render(
      <ProgressCircle.Root value={5} minValue={5} maxValue={5} aria-label="Upload progress">
        <ProgressCircle.Track data-testid="track" />
        <ProgressCircle.Value data-testid="value" />
      </ProgressCircle.Root>,
    );

    const indicator = screen.getByTestId('track').querySelector('.tale-progress-circle__indicator');
    expect(indicator?.getAttribute('stroke-dashoffset')).toBe('100');
    expect(screen.getByTestId('value').textContent).toBe('0%');
  });
});
