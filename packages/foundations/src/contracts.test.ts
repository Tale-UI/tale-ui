import { describe, expect, it } from 'vitest';
import { foundationalContracts } from './contracts';
import { foundationalRecipes } from './recipes';

describe('foundational contract recipe references', () => {
  it('keeps contract and recipe identifiers unique', () => {
    expect(new Set(foundationalContracts.map(({ id }) => id)).size).toBe(
      foundationalContracts.length,
    );
    expect(new Set(foundationalRecipes.map(({ id }) => id)).size).toBe(foundationalRecipes.length);
  });

  it('resolves every emitted recipe reference exactly once for the same component', () => {
    const referenced = foundationalContracts.filter(({ recipeId }) => recipeId !== undefined);
    expect(referenced).toHaveLength(10);

    for (const contract of referenced) {
      const matches = foundationalRecipes.filter(({ id }) => id === contract.recipeId);
      expect(matches).toHaveLength(1);
      expect(matches[0].component).toBe(contract.id);
    }
  });

  it('omits recipe references for contracts without portable recipes', () => {
    const unsupported = foundationalContracts.filter(
      ({ id }) => !foundationalRecipes.some(({ component }) => component === id),
    );
    expect(unsupported).toHaveLength(11);
    for (const contract of unsupported) {
      expect(Object.hasOwn(contract, 'recipeId')).toBe(false);
    }
  });

  it('remains immutable, deterministic, and serializable', () => {
    expect(Object.isFrozen(foundationalContracts)).toBe(true);
    for (const contract of foundationalContracts) {
      expect(Object.isFrozen(contract)).toBe(true);
    }
    expect(JSON.parse(JSON.stringify(foundationalContracts))).toEqual(foundationalContracts);
    expect(JSON.stringify(foundationalContracts)).toBe(JSON.stringify(foundationalContracts));
  });
});
