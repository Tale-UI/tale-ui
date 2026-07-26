import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('attached ButtonGroup resets compatible child radii with stable specificity', () => {
  const css = readFileSync(new URL('../src/button-group.css', import.meta.url), 'utf8');
  assert.match(
    css,
    /\.tale-button-group\.tale-button-group--attached\s*>\s*:where\(\.tale-button, \.tale-icon-button, \.tale-toggle-button\)\s*\{\s*position: relative;\s*border-radius: 0;/,
  );
});
