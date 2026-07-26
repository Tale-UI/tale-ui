import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const COMPONENT_EQUIVALENCE_BASELINE = '11ba83bf667d7ae0c107fb14f23700321b622fb8';

function read(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readAtRevision(revision, path) {
  return JSON.parse(
    execFileSync('git', ['show', `${revision}:${path}`], {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    }),
  );
}

function recordIdentity(record) {
  const identity = { ...record };
  delete identity.sourceDigest;
  return identity;
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

test('component-equivalence expansion preserves every prior public Figma identity', () => {
  const baselinePublic = readAtRevision(
    COMPONENT_EQUIVALENCE_BASELINE,
    'registry/integrations/figma-public.json',
  );
  const currentPublic = read('registry/integrations/figma-public.json');
  const baselineConnections = readAtRevision(
    COMPONENT_EQUIVALENCE_BASELINE,
    'registry/integrations/code-connect.json',
  );
  const currentConnections = read('registry/integrations/code-connect.json');

  const currentRecords = new Map(
    currentPublic.records.map((record) => [
      `${record.registryId}\0${record.mappingKind}\0${record.publicData.mappingId ?? ''}`,
      recordIdentity(record),
    ]),
  );
  for (const record of baselinePublic.records) {
    const key = `${record.registryId}\0${record.mappingKind}\0${record.publicData.mappingId ?? ''}`;
    assert.deepEqual(
      currentRecords.get(key),
      recordIdentity(record),
      `Prior public Figma record changed identity: ${key}`,
    );
  }

  const currentMappings = new Map(
    currentConnections.mappings.map((mapping) => [mapping.registryId, mapping]),
  );
  for (const mapping of baselineConnections.mappings) {
    assert.deepEqual(
      currentMappings.get(mapping.registryId),
      mapping,
      `Prior Code Connect mapping changed identity: ${mapping.registryId}`,
    );
  }
});
