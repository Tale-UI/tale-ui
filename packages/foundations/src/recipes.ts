import type { NativeTokenName } from '@tale-ui/tokens/native';

export type PortableStyleValue = number | string | Readonly<{ token: NativeTokenName }>;
export type PortableDeclarations = Readonly<Record<string, PortableStyleValue>>;

export type PortableRecipe = Readonly<{
  id: string;
  component: string;
  adoption: 'shadow' | 'approved' | 'consumer-active';
  slots: Readonly<Record<string, PortableDeclarations>>;
  variants?: Readonly<Record<string, Readonly<Record<string, PortableDeclarations>>>>;
  states?: Readonly<Record<string, Readonly<Record<string, PortableDeclarations>>>>;
}>;

export const token = (name: NativeTokenName): Readonly<{ token: NativeTokenName }> =>
  Object.freeze({ token: name });

export const defineRecipe = <T extends PortableRecipe>(recipe: T): Readonly<T> => {
  if (!recipe.id || !recipe.component || Object.keys(recipe.slots).length === 0) {
    throw new Error(
      'Tale UI: A portable recipe requires id, component, and slots. Add complete recipe metadata.',
    );
  }
  return Object.freeze({ ...recipe });
};

const foundationRecipeIds = [
  'Button',
  'Text',
  'Icon',
  'Row',
  'Column',
  'Card',
  'Separator',
  'Badge',
  'Spinner',
  'ProgressBar',
] as const;

export const foundationalRecipes = Object.freeze(
  foundationRecipeIds.map((component) =>
    defineRecipe({
      id: component.toLowerCase(),
      component,
      adoption: 'shadow',
      slots: {
        root: {
          color: token('textColor'),
          opacity: 1,
        },
      },
      states:
        component === 'Button'
          ? {
              disabled: { root: { opacity: 0.45 } },
              pending: { root: { opacity: 0.7 } },
            }
          : undefined,
    }),
  ),
);
