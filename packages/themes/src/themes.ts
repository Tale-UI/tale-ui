import { generatePalette, NAMED_SHADES } from '@tale-ui/utils/color';
import {
  MONOCHROME_THEME_DEFINITIONS,
  STANDARD_THEME_DEFINITIONS,
  type MonochromeThemePreset,
  type StandardThemePreset,
} from '@tale-ui/foundations/theme-presets';
import { generateMonochromePalette } from './monochrome.js';

export type ThemeColor = Readonly<{
  shade: number;
  hex: string;
}>;

export type StandardThemeDefinition = StandardThemePreset;
export type MonochromeThemeDefinition = MonochromeThemePreset;

const THEME_DEFINITIONS = STANDARD_THEME_DEFINITIONS;

export type StandardThemeId = (typeof THEME_DEFINITIONS)[number]['id'];
export type MonochromeThemeId = (typeof MONOCHROME_THEME_DEFINITIONS)[number]['id'];

export type GeneratedStandardTheme<TId extends string = string> = StandardThemeDefinition &
  Readonly<{
    id: TId;
    brandPalette: readonly ThemeColor[];
    neutralPalette: readonly ThemeColor[];
  }>;

export type StandardTheme = GeneratedStandardTheme<StandardThemeId>;

export type GeneratedMonochromeTheme<TId extends string = string> = MonochromeThemeDefinition &
  Readonly<{
    id: TId;
    brandPalette: readonly ThemeColor[];
    neutralPalette: readonly ThemeColor[];
  }>;

export type MonochromeTheme = GeneratedMonochromeTheme<MonochromeThemeId>;

const freezePalette = (palette: Array<{ shade: number; hex: string }>): readonly ThemeColor[] =>
  Object.freeze(palette.map((color) => Object.freeze(color)));

export const createStandardTheme = <TDefinition extends StandardThemeDefinition>(
  definition: TDefinition,
): TDefinition & GeneratedStandardTheme<TDefinition['id']> =>
  Object.freeze({
    ...definition,
    brandPalette: freezePalette(generatePalette(definition.brandColor, 'named')),
    neutralPalette: freezePalette(generatePalette(definition.neutralColor, 'neutral')),
  });

export const createMonochromeTheme = <TDefinition extends MonochromeThemeDefinition>(
  definition: TDefinition,
): TDefinition & GeneratedMonochromeTheme<TDefinition['id']> => {
  const neutralPalette = freezePalette(generateMonochromePalette(definition.color));
  const brandPalette = Object.freeze(
    neutralPalette.filter(({ shade }) => NAMED_SHADES.some((namedShade) => namedShade === shade)),
  );

  return Object.freeze({
    ...definition,
    brandPalette,
    neutralPalette,
  });
};

export const STANDARD_THEMES: readonly StandardTheme[] = Object.freeze(
  THEME_DEFINITIONS.map(createStandardTheme),
);
export const STANDARD_THEME_IDS: readonly StandardThemeId[] = Object.freeze(
  STANDARD_THEMES.map(({ id }) => id),
);
export const DEFAULT_STANDARD_THEME_ID: StandardThemeId = 'harbour';
export const THEME_ATTRIBUTE = 'data-tale-theme';
export const MONOCHROME_THEMES: readonly MonochromeTheme[] = Object.freeze(
  MONOCHROME_THEME_DEFINITIONS.map(createMonochromeTheme),
);
export const MONOCHROME_THEME_IDS: readonly MonochromeThemeId[] = Object.freeze(
  MONOCHROME_THEMES.map(({ id }) => id),
);
export const DEFAULT_MONOCHROME_THEME_ID: MonochromeThemeId = 'antique';
export const MONOCHROME_THEME_ATTRIBUTE = 'data-tale-monochrome-theme';

export const isStandardThemeId = (value: string): value is StandardThemeId =>
  STANDARD_THEME_IDS.some((themeId) => themeId === value);

export const getStandardThemeById = (themeId: string): StandardTheme | undefined =>
  STANDARD_THEMES.find(({ id }) => id === themeId);

export const isMonochromeThemeId = (value: string): value is MonochromeThemeId =>
  MONOCHROME_THEME_IDS.some((themeId) => themeId === value);

export const getMonochromeThemeById = (themeId: string): MonochromeTheme | undefined =>
  MONOCHROME_THEMES.find(({ id }) => id === themeId);

export const getStandardThemeIdForColors = (
  brandColor: string,
  neutralColor: string,
): StandardThemeId | null => {
  const normalize = (color: string) => color.replace(/^#/, '').toLowerCase();
  const normalizedBrand = normalize(brandColor);
  const normalizedNeutral = normalize(neutralColor);

  return (
    STANDARD_THEMES.find(
      (theme) =>
        normalize(theme.brandColor) === normalizedBrand &&
        normalize(theme.neutralColor) === normalizedNeutral,
    )?.id ?? null
  );
};

export const getMonochromeThemeIdForColor = (color: string): MonochromeThemeId | null => {
  const normalizedColor = color.replace(/^#/, '').toLowerCase();

  return (
    MONOCHROME_THEMES.find(
      (theme) => theme.color.replace(/^#/, '').toLowerCase() === normalizedColor,
    )?.id ?? null
  );
};

export const getStandardThemeClassName = (
  themeId: StandardThemeId,
): `standard-theme-${StandardThemeId}` => `standard-theme-${themeId}`;

export const getMonochromeThemeClassName = (
  themeId: MonochromeThemeId,
): `monochrome-theme-${MonochromeThemeId}` => `monochrome-theme-${themeId}`;

const resolveTarget = (target: Element | undefined): Element => {
  const resolvedTarget =
    target ?? (typeof document === 'undefined' ? undefined : document.documentElement);

  if (!resolvedTarget) {
    throw new Error(
      '@tale-ui/themes: Cannot apply a theme without a document. Pass the target Element explicitly when rendering outside a browser.',
    );
  }

  return resolvedTarget;
};

export const applyStandardTheme = (themeId: string, target?: Element): void => {
  if (!isStandardThemeId(themeId)) {
    throw new Error(
      `@tale-ui/themes: Unknown standard theme "${themeId}". Use one of: ${STANDARD_THEME_IDS.join(', ')}.`,
    );
  }

  const resolvedTarget = resolveTarget(target);
  resolvedTarget.removeAttribute(MONOCHROME_THEME_ATTRIBUTE);
  resolvedTarget.setAttribute(THEME_ATTRIBUTE, themeId);
};

export const applyMonochromeTheme = (themeId: string, target?: Element): void => {
  if (!isMonochromeThemeId(themeId)) {
    throw new Error(
      `@tale-ui/themes: Unknown monochrome theme "${themeId}". Use one of: ${MONOCHROME_THEME_IDS.join(', ')}.`,
    );
  }

  const resolvedTarget = resolveTarget(target);
  resolvedTarget.removeAttribute(THEME_ATTRIBUTE);
  resolvedTarget.setAttribute(MONOCHROME_THEME_ATTRIBUTE, themeId);
};

export const clearTheme = (target?: Element): void => {
  const resolvedTarget = resolveTarget(target);
  resolvedTarget.removeAttribute(THEME_ATTRIBUTE);
  resolvedTarget.removeAttribute(MONOCHROME_THEME_ATTRIBUTE);
};
