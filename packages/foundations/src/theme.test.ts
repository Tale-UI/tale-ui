import { nativeTokenModes } from '@tale-ui/tokens/native';
import { describe, expect, it } from 'vitest';
import { resolveTheme, validateThemeDefinition } from './theme.js';

describe('theme resolution', () => {
  it('resolves deterministic immutable appearance overrides', () => {
    const definition = {
      id: 'custom',
      name: 'Custom',
      tokens: { spaceM: 20 },
      appearances: { dark: { background: '#000000' } },
    } as const;
    const first = resolveTheme(definition, 'dark');
    const second = resolveTheme(definition, 'dark');
    expect(first).toEqual(second);
    expect(first.tokens.background).toBe('#000000');
    expect(first.tokens.color60).toBe(nativeTokenModes.dark.color60);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.tokens)).toBe(true);
  });

  it('rejects unknown token names with actionable guidance', () => {
    expect(() =>
      validateThemeDefinition({
        id: 'invalid',
        name: 'Invalid',
        tokens: { '--missing': 'value' } as never,
      }),
    ).toThrow('Tale UI: Unknown native token');
  });
});
