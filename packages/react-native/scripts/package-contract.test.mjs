import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { loadAndValidateNativeInventory } from '../../../tools/lib/react-native-implementation-inventory.mjs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const inventory = loadAndValidateNativeInventory();
const packedSurface = readFileSync(
  new URL('../../../test/consumer/react-native-package/surface.tsx', import.meta.url),
  'utf8',
);

test('keeps platform runtime dependencies out of the package graph', () => {
  for (const forbidden of ['expo', 'react-dom', '@tale-ui/themes', 'storybook']) {
    assert.equal(manifest.dependencies?.[forbidden], undefined);
  }
  assert.ok(manifest.peerDependencies.react);
  assert.ok(manifest.peerDependencies['react-native']);
});

test('exports exactly the provider and canonical implementation inventory', () => {
  assert.deepEqual(
    Object.keys(manifest.exports).sort(),
    [
      '.',
      './provider',
      ...inventory.implementations.map(({ publicSubpath }) => publicSubpath),
    ].sort(),
  );
  assert.equal(manifest.exports['./radio-field'], undefined);
});

test('keeps every packed-consumer symbol reachable from its inventory subpath', () => {
  for (const implementation of inventory.implementations) {
    assert.match(
      packedSurface,
      new RegExp(
        `import \\{ ${implementation.expectedSymbol} \\} from ` +
          `'@tale-ui/react-native/${implementation.publicSubpath.slice(2)}';`,
        'u',
      ),
    );
    assert.match(packedSurface, new RegExp(`\\n  ${implementation.expectedSymbol},`, 'u'));
  }
  assert.doesNotMatch(packedSurface, /@tale-ui\/react-native\/radio-field/u);
});
