import {
  nativeTokenModes,
  type NativeColorMode,
  type NativeTokenName,
  type NativeTokenValue,
} from '@tale-ui/tokens/native';

export type ThemeOverrideMap = Readonly<Partial<Record<NativeTokenName, NativeTokenValue>>>;
export type ResolvedTokenMap = Readonly<{
  [K in NativeTokenName]: (typeof nativeTokenModes.light)[K] extends number ? number : string;
}>;

export type ThemeDefinition = Readonly<{
  id: string;
  name: string;
  description?: string;
  tokens?: ThemeOverrideMap;
  appearances?: Readonly<Partial<Record<NativeColorMode, ThemeOverrideMap>>>;
  components?: Readonly<Record<string, Readonly<Record<string, ThemeOverrideMap>>>>;
  metadata?: Readonly<Record<string, string>>;
}>;

export type ResolvedTheme = Readonly<{
  id: string;
  name: string;
  appearance: NativeColorMode;
  tokens: ResolvedTokenMap;
  components: Readonly<Record<string, Readonly<Record<string, ThemeOverrideMap>>>>;
  metadata: Readonly<Record<string, string>>;
}>;

const tokenNames = new Set<string>(Object.keys(nativeTokenModes.light));

const validateOverrides = (overrides: ThemeOverrideMap | undefined, location: string): void => {
  for (const [name, value] of Object.entries(overrides ?? {})) {
    if (!tokenNames.has(name)) {
      throw new Error(
        `Tale UI: Unknown native token "${name}" in ${location}. ` +
          'Use a token exported by @tale-ui/tokens/native.',
      );
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(
        `Tale UI: Invalid value for "${name}" in ${location}. ` +
          'Use a serializable string or number.',
      );
    }
  }
};

const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
  }
  return value;
};

export const validateThemeDefinition = (definition: ThemeDefinition): void => {
  if (!definition.id.trim() || !definition.name.trim()) {
    throw new Error(
      'Tale UI: A theme requires non-empty id and name values. Provide stable theme metadata.',
    );
  }
  validateOverrides(definition.tokens, 'theme tokens');
  for (const [appearance, overrides] of Object.entries(definition.appearances ?? {})) {
    validateOverrides(overrides, `${appearance} appearance`);
  }
  for (const [component, slots] of Object.entries(definition.components ?? {})) {
    for (const [slot, overrides] of Object.entries(slots)) {
      validateOverrides(overrides, `${component}.${slot}`);
    }
  }
};

export const resolveTheme = (
  definition: ThemeDefinition,
  appearance: NativeColorMode,
): ResolvedTheme => {
  validateThemeDefinition(definition);
  const tokens = {
    ...nativeTokenModes[appearance],
    ...definition.tokens,
    ...definition.appearances?.[appearance],
  } as ResolvedTokenMap;
  return deepFreeze({
    id: definition.id,
    name: definition.name,
    appearance,
    tokens,
    components: { ...(definition.components ?? {}) },
    metadata: { ...(definition.metadata ?? {}) },
  });
};
