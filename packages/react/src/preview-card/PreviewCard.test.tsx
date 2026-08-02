import { expect } from 'vitest';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { PreviewCard } from '@tale-ui/react/preview-card';
import { createRenderer } from '#test-utils';

describe('<PreviewCard />', () => {
  const { render } = createRenderer();

  it('makes a text trigger keyboard focusable', async () => {
    await render(
      <PreviewCard.Root delay={0}>
        <PreviewCard.Trigger>Profile preview</PreviewCard.Trigger>
        <PreviewCard.Popup>
          <PreviewCard.Content aria-label="Profile preview content">Preview</PreviewCard.Content>
        </PreviewCard.Popup>
      </PreviewCard.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Profile preview' });
    expect(trigger.classList.contains('tale-preview-card__trigger')).toBe(true);
    expect(trigger.getAttribute('tabindex')).toBe('0');
  });

  it('opens for keyboard focus through React Aria PreviewTrigger', async () => {
    const { user } = await render(
      <PreviewCard.Root delay={0} closeDelay={0}>
        <PreviewCard.Trigger>Profile preview</PreviewCard.Trigger>
        <PreviewCard.Popup>
          <PreviewCard.Content aria-label="Profile preview content">Preview</PreviewCard.Content>
        </PreviewCard.Popup>
      </PreviewCard.Root>,
    );

    await user.tab();

    expect(await screen.findByRole('dialog', { name: 'Profile preview content' })).not.toBeNull();
  });
});
