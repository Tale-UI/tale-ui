import { expect } from 'vitest';
import { fireEvent, screen } from '@tale-ui/monorepo-tests/test-utils';
import { ContextMenu } from '@tale-ui/react/context-menu';
import { createRenderer } from '#test-utils';

function Example() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>File actions</ContextMenu.Trigger>
      <ContextMenu.Popup>
        <ContextMenu.MenuList aria-label="File actions">
          <ContextMenu.Item id="open">Open</ContextMenu.Item>
        </ContextMenu.MenuList>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  );
}

describe('<ContextMenu />', () => {
  const { render } = createRenderer();

  it('opens from a context-menu event through React Aria MenuTrigger', async () => {
    await render(<Example />);

    fireEvent.contextMenu(screen.getByRole('button', { name: 'File actions' }), {
      clientX: 24,
      clientY: 32,
    });

    expect(await screen.findByRole('menu', { name: 'File actions' })).not.toBeNull();
  });

  it('keeps the context-menu target keyboard focusable', async () => {
    await render(<Example />);
    const trigger = screen.getByRole('button', { name: 'File actions' });
    trigger.focus();

    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('tabindex')).toBe('0');
  });
});
