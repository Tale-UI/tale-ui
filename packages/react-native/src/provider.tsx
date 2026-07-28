import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { resolveTheme, type ResolvedTheme, type ThemeDefinition } from '@tale-ui/foundations/theme';
import * as React from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

export type TaleDirection = 'ltr' | 'rtl';
export type TaleDensity = 'compact' | 'regular' | 'comfortable';
export type TaleAppearance = 'light' | 'dark' | 'system';

type TaleContextValue = Readonly<{
  theme: ResolvedTheme;
  locale: string;
  direction: TaleDirection;
  density: TaleDensity;
  reducedMotion: boolean;
}>;

const defaultTheme = resolveTheme(harbourTheme, 'light');
const TaleContext = React.createContext<TaleContextValue>({
  theme: defaultTheme,
  locale: 'en',
  direction: 'ltr',
  density: 'regular',
  reducedMotion: false,
});

export type TaleProviderProps = React.PropsWithChildren<{
  theme?: ThemeDefinition;
  appearance?: TaleAppearance;
  locale?: string;
  direction?: TaleDirection;
  density?: TaleDensity;
  reducedMotion?: boolean;
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
  colorScheme,
}: TaleProviderProps) {
  const systemScheme = Appearance.getColorScheme();
  const requestedScheme = colorScheme ?? systemScheme;
  let resolvedAppearance: 'light' | 'dark';
  if (appearance === 'system') {
    resolvedAppearance = requestedScheme === 'dark' ? 'dark' : 'light';
  } else {
    resolvedAppearance = appearance;
  }
  const resolved = React.useMemo(
    () => resolveTheme(theme, resolvedAppearance),
    [resolvedAppearance, theme],
  );
  const value = React.useMemo(
    () => ({ theme: resolved, locale, direction, density, reducedMotion }),
    [density, direction, locale, reducedMotion, resolved],
  );
  return <TaleContext.Provider value={value}>{children}</TaleContext.Provider>;
}

export const useTale = (): TaleContextValue => React.useContext(TaleContext);
export const useTaleTheme = (): ResolvedTheme => useTale().theme;
