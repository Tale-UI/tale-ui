import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('keeps platform runtime dependencies out of the package graph', () => {
  for (const forbidden of ['expo', 'react-dom', '@tale-ui/themes', 'storybook']) {
    assert.equal(manifest.dependencies?.[forbidden], undefined);
  }
  assert.ok(manifest.peerDependencies.react);
  assert.ok(manifest.peerDependencies['react-native']);
});

test('exports the provider and foundational vertical slice', () => {
  for (const subpath of [
    './provider',
    './button',
    './icon-button',
    './text',
    './row',
    './column',
    './card',
    './separator',
    './badge',
    './spinner',
    './progress-bar',
    './skeleton',
  ]) {
    assert.ok(manifest.exports[subpath], `missing ${subpath}`);
  }
});
