import assert from 'node:assert/strict';
import test from 'node:test';
import { accessibilityViolationKey, normalizeAxeTarget } from './accessibility-baseline.mjs';

test('normalizes generated React Aria prefixes in axe selectors', () => {
  assert.equal(normalizeAxeTarget('#react-aria2529365808-_r_28_'), '#react-aria-_r_28_');
  assert.equal(
    normalizeAxeTarget('output[for="react-aria5663684381-_r_20_-0"]'),
    'output[for="react-aria-_r_20_-0"]',
  );
});

test('keeps stable selector details in accessibility violation keys', () => {
  const baseline = {
    storyId: 'components-slider--all-variations',
    rule: 'color-contrast',
    target: '#react-aria5663684381-_r_20_',
  };
  const sameNodeFromAnotherBuild = {
    ...baseline,
    target: '#react-aria8434912819-_r_20_',
  };
  const differentNode = {
    ...baseline,
    target: '#react-aria8434912819-_r_2u_',
  };

  assert.equal(
    accessibilityViolationKey(baseline),
    accessibilityViolationKey(sameNodeFromAnotherBuild),
  );
  assert.notEqual(accessibilityViolationKey(baseline), accessibilityViolationKey(differentNode));
});

test('does not normalize unrelated numeric IDs', () => {
  assert.equal(normalizeAxeTarget('#invoice123-row'), '#invoice123-row');
});
