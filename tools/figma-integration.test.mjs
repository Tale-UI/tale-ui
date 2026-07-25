import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

function read(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('public Figma outputs correlate registry IDs without private references', () => {
  const components = read('registry/components.json').components;
  const mappings = read('registry/integrations/figma-public.json');
  const parity = read('registry/integrations/figma-parity-public.json');
  const componentIds = mappings.records
    .filter(({ mappingKind }) => mappingKind === 'component')
    .map(({ registryId }) => registryId);
  assert.deepEqual(
    componentIds,
    components.map(({ slug }) => `tale:component:${slug}`),
  );
  assert.equal(parity.liveParity.status, 'unavailable');
  assert.equal(parity.privacy.containsFileKeys, false);
  assert.equal(existsSync('registry/integrations/figma-internal.json'), false);
  const inspect = (value) => {
    if (Array.isArray(value)) {
      value.forEach(inspect);
      return;
    }
    if (!value || typeof value !== 'object') {
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      assert.ok(
        !['filekey', 'nodeid', 'screenshot', 'protectedreference'].includes(key.toLowerCase()),
        `Public Figma output leaked ${key}`,
      );
      inspect(child);
    }
  };
  inspect({ mappings, parity });
});

test('Figma token variables preserve exact light/dark parity', () => {
  const native = read('packages/tokens/native.json');
  const variables = read('packages/tokens/figma/variables.json').collections[0].variables;
  assert.equal(variables.length, native.portableTokenNames.length);
  for (const variable of variables) {
    assert.equal(variable.valuesByMode.light, native.modes.light[variable.codeName]);
    assert.equal(variable.valuesByMode.dark, native.modes.dark[variable.codeName]);
  }
});
