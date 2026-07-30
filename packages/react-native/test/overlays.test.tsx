/* eslint-disable testing-library/no-await-sync-events -- RNTL v14 events are asynchronous under React 19. */
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Dialog } from '../src/dialog';
import { AlertDialog, Drawer } from '../src/overlays';
import { TaleProvider } from '../src/provider';
import { Text } from '../src/text';

const renderWithProvider = (children: React.ReactNode) =>
  render(<TaleProvider appearance="light">{children}</TaleProvider>);

type RenderNode = {
  props: Record<string, unknown>;
  children: Array<RenderNode | string>;
};

const collectNodes = (root: RenderNode): RenderNode[] => {
  const nodes = [root];
  for (const child of root.children ?? []) {
    if (typeof child !== 'string') {
      nodes.push(...collectNodes(child));
    }
  }
  return nodes;
};

const assertUngrouped = (view: Awaited<ReturnType<typeof renderWithProvider>>, label: string) => {
  const nodes = collectNodes(view.root as RenderNode);
  const contentParents = nodes.filter(({ props }) => {
    const style = props.style as Record<string, unknown> | undefined;
    return style?.width === '90%' || style?.maxHeight === '90%';
  });
  expect(contentParents).toHaveLength(1);
  expect(contentParents[0].props.accessible).toBeUndefined();
  expect(contentParents[0].props.accessibilityLabel).toBeUndefined();
  expect(nodes.some(({ props }) => props.accessibilityLabel === label)).toBe(false);
};

const getModal = (view: Awaited<ReturnType<typeof renderWithProvider>>) => {
  const modal = collectNodes(view.root as RenderNode).find(
    ({ props }) => props.accessibilityViewIsModal === true,
  );
  expect(modal).toBeDefined();
  return modal!;
};

describe('native overlay structure and dismissal', () => {
  test('keeps Dialog descendants separately queryable and supports both close paths', async () => {
    const onOpenChange = jest.fn();
    const view = await renderWithProvider(
      <Dialog isOpen onOpenChange={onOpenChange} title="Account settings">
        <Text>Dialog content</Text>
      </Dialog>,
    );

    expect(screen.getByRole('header', { name: 'Account settings' })).toBeTruthy();
    expect(screen.getByText('Dialog content')).toBeTruthy();
    assertUngrouped(view, 'Account settings');

    const close = screen.getByRole('button', { name: 'Close' });
    const modal = getModal(view);
    await fireEvent.press(close);
    modal.props.onRequestClose();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenNthCalledWith(1, false);
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
  });

  test('inherits the ungrouped Dialog structure for AlertDialog', async () => {
    const onOpenChange = jest.fn();
    const view = await renderWithProvider(
      <AlertDialog isOpen onOpenChange={onOpenChange} title="Delete draft">
        <Text>This action cannot be undone.</Text>
      </AlertDialog>,
    );

    expect(screen.getByRole('header', { name: 'Delete draft' })).toBeTruthy();
    expect(screen.getByText('This action cannot be undone.')).toBeTruthy();
    assertUngrouped(view, 'Delete draft');
  });

  test('keeps Drawer descendants separately queryable and supports both close paths', async () => {
    const onOpenChange = jest.fn();
    const view = await renderWithProvider(
      <Drawer isOpen label="Navigation drawer" onOpenChange={onOpenChange}>
        <Text>Drawer content</Text>
      </Drawer>,
    );

    expect(screen.getByRole('header', { name: 'Navigation drawer' })).toBeTruthy();
    expect(screen.getByText('Drawer content')).toBeTruthy();
    assertUngrouped(view, 'Navigation drawer');

    const close = screen.getByRole('button', { name: 'Close drawer' });
    const modal = getModal(view);
    await fireEvent.press(close);
    modal.props.onRequestClose();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenNthCalledWith(1, false);
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
  });
});
