import { describe, expect, it } from 'vitest';
import { resolveControlledState, toggleReducer, updateSelection } from './state.js';

describe('renderer-neutral state', () => {
  it('distinguishes controlled values and updates selection immutably', () => {
    expect(resolveControlledState({ value: false, defaultValue: true })).toEqual({
      value: false,
      isControlled: true,
    });
    expect(toggleReducer(false, { type: 'toggle' })).toBe(true);
    const selected = new Set(['a']);
    expect([...updateSelection(selected, 'b', 'multiple')]).toEqual(['a', 'b']);
    expect([...selected]).toEqual(['a']);
  });
});
