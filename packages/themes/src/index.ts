export {
  DEFAULT_MONOCHROME_THEME_ID,
  DEFAULT_STANDARD_THEME_ID,
  MONOCHROME_THEMES,
  MONOCHROME_THEME_ATTRIBUTE,
  MONOCHROME_THEME_IDS,
  STANDARD_THEMES,
  STANDARD_THEME_IDS,
  THEME_ATTRIBUTE,
  applyMonochromeTheme,
  applyStandardTheme,
  clearTheme,
  createMonochromeTheme,
  createStandardTheme,
  getMonochromeThemeById,
  getMonochromeThemeClassName,
  getMonochromeThemeIdForColor,
  getStandardThemeById,
  getStandardThemeClassName,
  getStandardThemeIdForColors,
  isMonochromeThemeId,
  isStandardThemeId,
} from './themes.js';

export type {
  GeneratedMonochromeTheme,
  GeneratedStandardTheme,
  MonochromeTheme,
  MonochromeThemeDefinition,
  MonochromeThemeId,
  StandardTheme,
  StandardThemeDefinition,
  StandardThemeId,
  ThemeColor,
} from './themes.js';

export { generateMonochromePalette } from './monochrome.js';
export {
  MONOCHROME_THEME_DEFINITIONS,
  STANDARD_THEME_DEFINITIONS,
} from '@tale-ui/foundations/theme-presets';
