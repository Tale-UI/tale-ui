/* eslint-disable testing-library/no-await-sync-events -- RNTL v14 events are asynchronous under React 19. */
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Button } from '../src/button';
import { CheckboxField } from '../src/checkbox-field';
import { Dialog } from '../src/dialog';
import { Disclosure } from '../src/disclosure';
import { Input } from '../src/input';
import { Pagination } from '../src/navigation';
import { ProgressBar } from '../src/progress-bar';
import { TaleProvider } from '../src/provider';
import { RadioGroup } from '../src/radio-group';
import { Slider } from '../src/slider';
import { Tabs } from '../src/tabs';
import { Text } from '../src/text';
import { Toast } from '../src/overlays';
import { ToggleButton } from '../src/toggle-button';

const renderWithProvider = (children: React.ReactNode) =>
  render(<TaleProvider appearance="light">{children}</TaleProvider>);

describe('native adapter behavior', () => {
  test('exposes button semantics and activates once', async () => {
    const onPress = jest.fn();
    await renderWithProvider(<Button onPress={onPress}>Continue</Button>);

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button.props.accessibilityState).toEqual({ busy: false, disabled: false });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('keeps pending buttons busy, disabled, and non-activatable', async () => {
    const onPress = jest.fn();
    await renderWithProvider(
      <Button isPending onPress={onPress}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.props.accessibilityState).toEqual({ busy: true, disabled: true });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('updates an uncontrolled checkbox and reports its checked state', async () => {
    const onSelectionChange = jest.fn();
    await renderWithProvider(
      <CheckboxField onSelectionChange={onSelectionChange}>Send updates</CheckboxField>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Send updates' });
    expect(checkbox.props.accessibilityState).toEqual({
      checked: false,
      disabled: undefined,
    });
    await fireEvent.press(checkbox);
    expect(onSelectionChange).toHaveBeenCalledWith(true);
    expect(checkbox.props.accessibilityState).toEqual({
      checked: true,
      disabled: undefined,
    });
  });

  test('forwards native text input changes through the public Input adapter', async () => {
    const onChangeText = jest.fn();
    await renderWithProvider(<Input accessibilityLabel="Email" onChangeText={onChangeText} />);

    const input = screen.getByLabelText('Email');
    expect(input.type).toBe('TextInput');
    await fireEvent.changeText(input, 'reader@example.com');
    expect(onChangeText).toHaveBeenCalledWith('reader@example.com');
  });

  test('closes a modal through both the close action and native back request', async () => {
    const onOpenChange = jest.fn();
    const view = await renderWithProvider(
      <Dialog isOpen onOpenChange={onOpenChange} title="Account settings">
        <Text>Dialog content</Text>
      </Dialog>,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    const findBackHandler = (node: typeof view.root): (() => void) | undefined => {
      if (!node) {
        return undefined;
      }
      if (typeof node.props.onRequestClose === 'function') {
        return node.props.onRequestClose;
      }
      for (const child of node.children) {
        if (typeof child !== 'string') {
          const handler = findBackHandler(child);
          if (handler) {
            return handler;
          }
        }
      }
      return undefined;
    };
    const requestClose = findBackHandler(view.root);
    expect(requestClose).toBeDefined();
    requestClose?.();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('expands disclosure content and reports expanded state', async () => {
    const onExpandedChange = jest.fn();
    await renderWithProvider(
      <Disclosure onExpandedChange={onExpandedChange} title="Details">
        <Text>More information</Text>
      </Disclosure>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger.props.accessibilityState).toEqual({ expanded: false });
    expect(screen.queryByText('More information')).toBeNull();
    await fireEvent.press(trigger);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(trigger.props.accessibilityState).toEqual({ expanded: true });
    expect(screen.getByText('More information')).toBeTruthy();
  });

  test('changes radio, tab, and toggle selections through accessible controls', async () => {
    const onRadioChange = jest.fn();
    const onTabChange = jest.fn();
    const onToggleChange = jest.fn();
    await renderWithProvider(
      <React.Fragment>
        <RadioGroup
          defaultValue="one"
          items={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
          label="Choices"
          onValueChange={onRadioChange}
        />
        <Tabs
          items={[
            { id: 'first', label: 'First', content: <Text>First panel</Text> },
            { id: 'second', label: 'Second', content: <Text>Second panel</Text> },
          ]}
          onSelectionChange={onTabChange}
          selectedKey="first"
        />
        <ToggleButton isSelected={false} onSelectionChange={onToggleChange}>
          Bold
        </ToggleButton>
      </React.Fragment>,
    );

    await fireEvent.press(screen.getByRole('radio', { name: 'Two' }));
    await fireEvent.press(screen.getByRole('tab', { name: 'Second' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Bold' }));
    expect(onRadioChange).toHaveBeenCalledWith('two');
    expect(onTabChange).toHaveBeenCalledWith('second');
    expect(onToggleChange).toHaveBeenCalledWith(true);
  });

  test('supports adjustable and pagination accessibility actions', async () => {
    const onValueChange = jest.fn();
    const onPageChange = jest.fn();
    await renderWithProvider(
      <React.Fragment>
        <Slider label="Volume" onValueChange={onValueChange} step={5} value={40} />
        <Pagination onPageChange={onPageChange} page={2} totalPages={3} />
      </React.Fragment>,
    );

    await fireEvent(screen.getByRole('adjustable', { name: 'Volume' }), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    await fireEvent.press(screen.getByRole('button', { name: 'Next' }));
    expect(onValueChange).toHaveBeenCalledWith(45);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('exposes progress values and polite live notifications', async () => {
    await renderWithProvider(
      <React.Fragment>
        <ProgressBar label="Upload progress" value={64} />
        <Toast label="Saved notification">Changes saved.</Toast>
      </React.Fragment>,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Upload progress' }).props.accessibilityValue,
    ).toEqual({ min: 0, max: 100, now: 64 });
    const toast = screen.getByRole('alert', { name: 'Saved notification' });
    expect(toast.props.accessibilityLiveRegion).toBe('polite');
  });
});
