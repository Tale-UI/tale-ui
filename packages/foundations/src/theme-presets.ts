import type { ThemeDefinition } from './theme';

export type StandardThemePreset = Readonly<{
  id: string;
  name: string;
  description: string;
  brandColor: string;
  neutralColor: string;
}>;

export type MonochromeThemePreset = Readonly<{
  id: string;
  name: string;
  description: string;
  color: string;
}>;

export const STANDARD_THEME_DEFINITIONS = Object.freeze([
  {
    id: 'harbour',
    name: 'Harbour',
    description: 'Deep teal with a warm stone neutral.',
    brandColor: '#025768',
    neutralColor: '#79716b',
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    description: 'Clear cyan teal with a cool mineral neutral.',
    brandColor: '#006a6b',
    neutralColor: '#677472',
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Confident blue with a crisp steel neutral.',
    brandColor: '#215d9a',
    neutralColor: '#68717a',
  },
  {
    id: 'violet-dusk',
    name: 'Violet Dusk',
    description: 'Soft violet with a balanced slate neutral.',
    brandColor: '#6552a3',
    neutralColor: '#706d78',
  },
  {
    id: 'wildflower',
    name: 'Wildflower',
    description: 'Muted berry with a gently rosy neutral.',
    brandColor: '#8f3d65',
    neutralColor: '#746b70',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Earthy coral with a warm clay neutral.',
    brandColor: '#9b3f35',
    neutralColor: '#756b68',
  },
  {
    id: 'amber-grove',
    name: 'Amber Grove',
    description: 'Burnished amber with a soft sand neutral.',
    brandColor: '#8a5a0a',
    neutralColor: '#756f64',
  },
  {
    id: 'fern',
    name: 'Fern',
    description: 'Leaf green with a quiet botanical neutral.',
    brandColor: '#3b6b43',
    neutralColor: '#6a7169',
  },
] as const satisfies readonly StandardThemePreset[]);

export const MONOCHROME_THEME_DEFINITIONS = Object.freeze([
  {
    id: 'antique',
    name: 'Antique',
    description: 'Burnished ochre across the brand and neutral scales.',
    color: '#936400',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Fresh leaf green across the brand and neutral scales.',
    color: '#317d00',
  },
  {
    id: 'mauve',
    name: 'Mauve',
    description: 'Dusty rose across the brand and neutral scales.',
    color: '#9b5267',
  },
  {
    id: 'mountain-meadow',
    name: 'Mountain Meadow',
    description: 'Lush green teal across the brand and neutral scales.',
    color: '#007e64',
  },
  {
    id: 'rosewater',
    name: 'Rosewater',
    description: 'Vivid rose across the brand and neutral scales.',
    color: '#c60648',
  },
  {
    id: 'teal',
    name: 'Teal',
    description: 'Cool blue teal across the brand and neutral scales.',
    color: '#25778d',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Rich burnt orange across the brand and neutral scales.',
    color: '#a64300',
  },
] as const satisfies readonly MonochromeThemePreset[]);

export const harbourTheme: ThemeDefinition = Object.freeze({
  id: 'harbour',
  name: 'Harbour',
});
