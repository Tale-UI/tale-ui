import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { resolveTheme, type ResolvedTheme, type ThemeDefinition } from '@tale-ui/foundations/theme';
import * as React from 'react';
import { type ColorSchemeName, useColorScheme } from 'react-native';

export type TaleDirection = 'ltr' | 'rtl';
export type TaleDensity = 'compact' | 'regular' | 'comfortable';
export type TaleAppearance = 'light' | 'dark' | 'system';

type TaleContextValue = Readonly<{
  theme: ResolvedTheme;
  locale: string;
  direction: TaleDirection;
  density: TaleDensity;
  reducedMotion: boolean;
  textScale: number;
}>;

const defaultTheme = resolveTheme(harbourTheme, 'light');
const TaleContext = React.createContext<TaleContextValue>({
  theme: defaultTheme,
  locale: 'en',
  direction: 'ltr',
  density: 'regular',
  reducedMotion: false,
  textScale: 1,
});

export type TaleProviderProps = React.PropsWithChildren<{
  theme?: ThemeDefinition;
  appearance?: TaleAppearance;
  /** @deprecated Metadata only; Tale UI does not apply locale behavior. */
  locale?: string;
  /** @deprecated Metadata only; Tale UI does not apply layout direction. */
  direction?: TaleDirection;
  /** @deprecated Metadata only; Tale UI does not apply provider-level density. */
  density?: TaleDensity;
  reducedMotion?: boolean;
  /** Manual multiplier consumed by Tale Text; this does not subscribe to OS Dynamic Type. */
  textScale?: number;
  /** Deterministic system-mode override, primarily for tests and previews. */
  colorScheme?: ColorSchemeName;
}>;

export function TaleProvider({
  children,
  theme = harbourTheme,
  appearance = 'system',
  locale = 'en',
  direction = 'ltr',
  density = 'regular',
  reducedMotion = false,
  textScale = 1,
  colorScheme,
}: TaleProviderProps) {
  const subscribedSystemScheme = useColorScheme();
  const resolvedAppearance =
    appearance === 'light' || appearance === 'dark'
      ? appearance
      : colorScheme === 'light' || colorScheme === 'dark'
        ? colorScheme
        : subscribedSystemScheme === 'dark'
          ? 'dark'
          : 'light';
  const resolved = React.useMemo(
    () => resolveTheme(theme, resolvedAppearance),
    [resolvedAppearance, theme],
  );
  const value = React.useMemo(
    () => ({ theme: resolved, locale, direction, density, reducedMotion, textScale }),
    [density, direction, locale, reducedMotion, resolved, textScale],
  );
  return <TaleContext.Provider value={value}>{children}</TaleContext.Provider>;
}

export const useTale = (): TaleContextValue => React.useContext(TaleContext);
export const useTaleTheme = (): ResolvedTheme => useTale().theme;
