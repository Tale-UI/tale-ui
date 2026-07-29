import { resolveTheme } from '@tale-ui/foundations/theme';
import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Badge } from '../src/badge';
import { Button } from '../src/button';
import { Card } from '../src/card';
import { CheckboxField } from '../src/checkbox-field';
import { Input } from '../src/input';
import { ProgressBar } from '../src/progress-bar';
import { TaleProvider } from '../src/provider';
import { SwitchField } from '../src/switch-field';
import { Tabs } from '../src/tabs';
import { Text } from '../src/text';
import { ToggleButton } from '../src/toggle-button';
import { fieldFocusRing, platformFontFamily } from '../src/_style-utils';

const renderWithProvider = (children: React.ReactNode) =>
  render(<TaleProvider appearance="light">{children}</TaleProvider>);

const resolvedStyle = (style: unknown) => StyleSheet.flatten(style);
const lightTokens = resolveTheme(harbourTheme, 'light').tokens;

describe('React Native visual parity contracts', () => {
  test('maps web button variants, sizes, and disabled state to native styles', async () => {
    await renderWithProvider(
      <React.Fragment>
        <Button accessibilityLabel="Primary">Primary</Button>
        <Button accessibilityLabel="Danger" size="lg" variant="danger">
          Danger
        </Button>
        <Button accessibilityLabel="Disabled" isDisabled>
          Disabled
        </Button>
      </React.Fragment>,
    );

    const primary = screen.getByRole('button', { name: 'Primary' });
    const primaryRest = resolvedStyle(primary.props.style);
    expect(primaryRest.backgroundColor).toBe('#025768');
    expect(primaryRest.borderRadius).toBe(10);
    expect(primaryRest.minHeight).toBe(36);
    const danger = resolvedStyle(screen.getByRole('button', { name: 'Danger' }).props.style);
    expect(danger.backgroundColor).toBe('#cc3330');
    expect(danger.minHeight).toBe(44);

    const disabled = resolvedStyle(screen.getByRole('button', { name: 'Disabled' }).props.style);
    expect(disabled.opacity).toBe(0.45);
  });

  test('keeps badge, card, text, and field geometry on the canonical token scale', async () => {
    await renderWithProvider(
      <React.Fragment>
        <Badge accessibilityLabel="Colour badge" size="lg" type="rounded" variant="brand">
          New
        </Badge>
        <Card accessibilityLabel="Outlined card" padding="sm">
          <Text>Card</Text>
        </Card>
        <Text accessibilityLabel="Muted label" color="muted" size="s" variant="label">
          Muted
        </Text>
        <Input accessibilityLabel="Large input" size="lg" />
      </React.Fragment>,
    );

    const badge = StyleSheet.flatten(screen.getByLabelText('Colour badge').props.style);
    expect(badge.borderColor).toBe('#7badb1');
    expect(badge.borderRadius).toBe(7.5);
    expect(badge.paddingHorizontal).toBe(14);

    const card = StyleSheet.flatten(screen.getByLabelText('Outlined card').props.style);
    expect(card.backgroundColor).toBe('#f9f8f8');
    expect(card.borderColor).toBe('#d5d2d1');
    expect(card.borderRadius).toBe(15);
    expect(card.padding).toBe(14);

    const muted = StyleSheet.flatten(screen.getByLabelText('Muted label').props.style);
    expect(muted.color).toBe('#79716b');
    expect(muted.fontSize).toBe(13.3);
    expect(muted.fontWeight).toBe('500');

    const input = StyleSheet.flatten(screen.getByLabelText('Large input').props.style);
    expect(input.borderColor).toBe('#cbc8c6');
    expect(input.borderRadius).toBe(7.5);
    expect(input.minHeight).toBe(44);
    expect(input.fontSize).toBe(19.2);
  });

  test('derives field typography and focus colors from foundational tokens', async () => {
    await renderWithProvider(<Input accessibilityLabel="Tokenized input" />);

    const input = screen.getByLabelText('Tokenized input');
    fireEvent(input, 'onFocus', { nativeEvent: {} });
    await waitFor(() =>
      expect(resolvedStyle(screen.getByLabelText('Tokenized input').props.style).borderColor).toBe(
        lightTokens.neutral50,
      ),
    );
    const focused = resolvedStyle(screen.getByLabelText('Tokenized input').props.style);

    expect(focused.boxShadow).toBe(fieldFocusRing(lightTokens).boxShadow);
    expect(focused.outlineWidth).toBe(0);
    expect(focused.color).toBe(lightTokens.neutral90);
    expect(focused.fontFamily).toBe(platformFontFamily(lightTokens.textFontFamily));
    expect(focused.fontSize).toBe(lightTokens.textMFontSize);
    expect(focused.fontWeight).toBe(String(lightTokens.textFontWeight));
    expect(focused.lineHeight).toBe(lightTokens.textMFontSize * lightTokens.textLineHeight);
  });

  test('renders custom native choice controls instead of platform-default visuals', async () => {
    await renderWithProvider(
      <React.Fragment>
        <CheckboxField accessibilityLabel="Checked" isSelected>
          Checked
        </CheckboxField>
        <SwitchField label="Enabled" value />
        <ToggleButton accessibilityLabel="Selected toggle" isSelected>
          Selected
        </ToggleButton>
      </React.Fragment>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Checked' });
    expect(checkbox.props.accessibilityState.checked).toBe(true);
    const checkboxIndicator = StyleSheet.flatten(checkbox.children[0].children[0].props.style);
    expect(checkboxIndicator.backgroundColor).toBe('#025768');
    expect(checkboxIndicator.borderRadius).toBe(5);

    const switchControl = screen.getByRole('switch', { name: 'Enabled' });
    expect(switchControl.props.accessibilityState.checked).toBe(true);
    const track = StyleSheet.flatten(switchControl.children[0].children[0].props.style);
    expect(track.backgroundColor).toBe('#025768');
    expect(track.height).toBe(22);
    expect(track.width).toBe(40);

    const toggle = resolvedStyle(
      screen.getByRole('button', { name: 'Selected toggle' }).props.style,
    );
    expect(toggle.backgroundColor).toBe('#45403d');
    expect(toggle.borderColor).toBe('#45403d');
  });

  test('styles progress and tabs with the same track, indicator, and selected-state tokens as web', async () => {
    await renderWithProvider(
      <React.Fragment>
        <ProgressBar label="Upload" value={64} />
        <Tabs
          defaultSelectedKey="one"
          items={[
            { id: 'one', label: 'One', content: <Text>First</Text> },
            { id: 'two', label: 'Two', content: <Text>Second</Text> },
          ]}
          variant="pills"
        />
      </React.Fragment>,
    );

    const progress = screen.getByRole('progressbar', { name: 'Upload' });
    const track = StyleSheet.flatten(progress.children[1].props.style);
    const indicator = StyleSheet.flatten(progress.children[1].children[0].props.style);
    expect(track.backgroundColor).toBe('#d0cdcb');
    expect(track.height).toBe(8);
    expect(indicator.backgroundColor).toBe('#11100f');
    expect(indicator.width).toBe('64%');

    const selectedTab = screen.getByRole('tab', { name: 'One' });
    const selectedStyle = StyleSheet.flatten(selectedTab.props.style);
    expect(selectedStyle.backgroundColor).toBe('#f9f8f8');
    expect(selectedStyle.borderColor).toBe('#e8e7e6');
    expect(selectedStyle.borderRadius).toBe(7.5);
  });
});
