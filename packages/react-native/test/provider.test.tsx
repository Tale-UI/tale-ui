import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import * as ReactNative from 'react-native';
import { TaleProvider, useTale } from '../src/provider';
import { Text } from '../src/text';

const mockUseColorScheme = jest.spyOn(ReactNative, 'useColorScheme');

function ContextProbe() {
  const value = useTale();
  const instance = React.useRef(Symbol('probe'));
  return (
    <Text testID="context">
      {[
        value.theme.appearance,
        value.locale,
        value.direction,
        value.density,
        value.reducedMotion,
        value.textScale,
        String(instance.current),
      ].join('|')}
    </Text>
  );
}

describe('TaleProvider appearance behavior', () => {
  beforeEach(() => {
    mockUseColorScheme.mockReset();
    mockUseColorScheme.mockReturnValue(null);
  });

  test('subscribes to the system scheme unconditionally', async () => {
    await render(
      <TaleProvider appearance="light" colorScheme="dark">
        <ContextProbe />
      </TaleProvider>,
    );
    expect(mockUseColorScheme).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('context')).toHaveTextContent(/^light\|/);
  });

  test('reacts to mounted system changes without remounting descendants', async () => {
    mockUseColorScheme.mockReturnValue('light');
    const view = await render(
      <TaleProvider appearance="system">
        <ContextProbe />
      </TaleProvider>,
    );
    const initial = screen.getByTestId('context').props.children;

    mockUseColorScheme.mockReturnValue('dark');
    await view.rerender(
      <TaleProvider appearance="system">
        <ContextProbe />
      </TaleProvider>,
    );
    const updated = screen.getByTestId('context').props.children;
    expect(updated).toMatch(/^dark\|/);
    expect(updated.split('|').at(-1)).toBe(initial.split('|').at(-1));
  });

  test('applies explicit, injected, subscribed, and fallback precedence', async () => {
    mockUseColorScheme.mockReturnValue('dark');
    const view = await render(
      <TaleProvider appearance="light" colorScheme="dark">
        <ContextProbe />
      </TaleProvider>,
    );
    expect(screen.getByTestId('context')).toHaveTextContent(/^light\|/);

    await view.rerender(
      <TaleProvider appearance="system" colorScheme="light">
        <ContextProbe />
      </TaleProvider>,
    );
    expect(screen.getByTestId('context')).toHaveTextContent(/^light\|/);

    await view.rerender(
      <TaleProvider appearance="system">
        <ContextProbe />
      </TaleProvider>,
    );
    expect(screen.getByTestId('context')).toHaveTextContent(/^dark\|/);

    mockUseColorScheme.mockReturnValue(null);
    await view.rerender(
      <TaleProvider appearance="system">
        <ContextProbe />
      </TaleProvider>,
    );
    expect(screen.getByTestId('context')).toHaveTextContent(/^light\|/);
  });

  test('transitions between injected and subscribed schemes and retains context metadata', async () => {
    mockUseColorScheme.mockReturnValue('light');
    const view = await render(
      <TaleProvider
        appearance="system"
        colorScheme="dark"
        density="compact"
        direction="rtl"
        locale="ar"
        reducedMotion
        textScale={1.5}
      >
        <ContextProbe />
      </TaleProvider>,
    );
    expect(String(screen.getByTestId('context').props.children)).toMatch(
      /^dark\|ar\|rtl\|compact\|true\|1\.5\|/,
    );

    await view.rerender(
      <TaleProvider
        appearance="system"
        density="comfortable"
        direction="ltr"
        locale="de"
        reducedMotion={false}
        textScale={2}
      >
        <ContextProbe />
      </TaleProvider>,
    );
    expect(String(screen.getByTestId('context').props.children)).toMatch(
      /^light\|de\|ltr\|comfortable\|false\|2\|/,
    );
  });
});
