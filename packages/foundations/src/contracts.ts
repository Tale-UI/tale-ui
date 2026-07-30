export type PlatformSupport = 'supported' | 'adapted' | 'unsupported';
export type ComponentLifecycle = 'stable' | 'experimental' | 'deprecated';

export type ComponentContract = Readonly<{
  id: string;
  category: string;
  lifecycle: ComponentLifecycle;
  parts: readonly string[];
  variants?: readonly string[];
  sizes?: readonly string[];
  states?: readonly string[];
  accessibilityIntent: readonly string[];
  support: Readonly<{
    react: PlatformSupport;
    reactNative: PlatformSupport;
    reactNativeWeb: PlatformSupport;
  }>;
  recipeId?: string;
}>;

export const defineComponentContract = <T extends ComponentContract>(contract: T): Readonly<T> => {
  if (!contract.id || contract.parts.length === 0) {
    throw new Error(
      'Tale UI: A component contract requires an id and at least one part. ' +
        'Add the canonical component metadata.',
    );
  }
  return Object.freeze({ ...contract });
};

const foundationalIds = [
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
  'Banner',
  'CheckboxField',
  'Dialog',
  'Disclosure',
  'Field',
  'IconButton',
  'Input',
  'SearchField',
  'SwitchField',
  'Tabs',
  'TextArea',
] as const;

const recipeIdByComponent = new Map<string, string>(
  foundationalRecipes.map((recipe) => [recipe.component, recipe.id] as const),
);

export const foundationalContracts = Object.freeze(
  foundationalIds.map((id) =>
    defineComponentContract({
      id,
      category: id === 'Button' ? 'Form Controls' : 'Foundation',
      lifecycle: 'stable',
      parts: ['Root'],
      states: id === 'Button' ? ['isDisabled', 'isPending', 'isPressed'] : [],
      accessibilityIntent:
        id === 'Button'
          ? ['Expose an accessible button name and disabled/busy state.']
          : ['Preserve meaningful text and grouping semantics.'],
      support: {
        react: 'supported',
        reactNative: 'supported',
        reactNativeWeb: 'supported',
      },
      ...(recipeIdByComponent.has(id) ? { recipeId: recipeIdByComponent.get(id) } : {}),
    }),
  ),
);
import { foundationalRecipes } from './recipes';
