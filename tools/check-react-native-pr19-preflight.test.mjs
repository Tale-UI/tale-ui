import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PreflightError,
  exportsRadioField,
  inspectRegistry,
  validatePreflight,
} from './check-react-native-pr19-preflight.mjs';

const response = (status, body) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
});

const createDependencies = (overrides = {}) => {
  let queryCount = 0;
  return {
    queryPr: async () => {
      queryCount += 1;
      return { baseRefName: 'main', baseRefOid: 'base-oid', queryCount };
    },
    fetchBase: async () => 'base-oid',
    commitExists: async () => true,
    pathExistsAtBase: async () => false,
    resolveRegistry: async () => 'https://registry.example/',
    inspectRegistry: async (registry) => ({
      registry,
      inspectedVersions: [],
      decision: 'safe-unpublished',
    }),
    ...overrides,
  };
};

const rejectsDecision = async (promise, decision) => {
  await assert.rejects(promise, (error) => {
    assert.equal(error instanceof PreflightError, true);
    assert.equal(error.decision, decision);
    return true;
  });
};

test('validates package absence and emits the post-inspection base OID', async () => {
  const events = [];
  const result = await validatePreflight({
    expectedBaseOid: 'base-oid',
    dependencies: createDependencies({
      queryPr: async () => {
        events.push('query');
        return { baseRefName: 'main', baseRefOid: 'base-oid' };
      },
      inspectRegistry: async (registry) => {
        events.push('registry');
        return {
          registry,
          inspectedVersions: ['1.0.0'],
          decision: 'safe-explicitly-unexposed',
        };
      },
    }),
  });
  assert.deepEqual(events, ['query', 'registry', 'query']);
  assert.equal(result.baseOid, 'base-oid');
  assert.equal(result.decision, 'safe-explicitly-unexposed');
});

test('does not require a clean worktree', async () => {
  const dependencies = createDependencies({
    worktreeIsDirty: async () => {
      throw new Error('cleanliness must remain outside this helper');
    },
  });
  const result = await validatePreflight({ dependencies });
  assert.equal(result.decision, 'safe-unpublished');
});

test('blocks missing PR data', async () => {
  await rejectsDecision(
    validatePreflight({
      dependencies: createDependencies({ queryPr: async () => ({ baseRefName: 'main' }) }),
    }),
    'ambiguous',
  );
});

test('blocks an expected base mismatch', async () => {
  await rejectsDecision(
    validatePreflight({
      expectedBaseOid: 'different',
      dependencies: createDependencies(),
    }),
    'ambiguous',
  );
});

test('blocks a fetch mismatch', async () => {
  await rejectsDecision(
    validatePreflight({
      dependencies: createDependencies({ fetchBase: async () => 'other-oid' }),
    }),
    'ambiguous',
  );
});

test('blocks an OID that is not a commit', async () => {
  await rejectsDecision(
    validatePreflight({
      dependencies: createDependencies({ commitExists: async () => false }),
    }),
    'ambiguous',
  );
});

test('blocks either package being present at the exact base', async () => {
  for (const presentPath of [
    'packages/react-native/package.json',
    'packages/foundations/package.json',
  ]) {
    await rejectsDecision(
      validatePreflight({
        dependencies: createDependencies({
          pathExistsAtBase: async (_oid, path) => path === presentPath,
        }),
      }),
      'ambiguous',
    );
  }
});

test('blocks a base change after registry inspection', async () => {
  let queryCount = 0;
  await rejectsDecision(
    validatePreflight({
      dependencies: createDependencies({
        queryPr: async () => {
          queryCount += 1;
          return {
            baseRefName: 'main',
            baseRefOid: queryCount === 1 ? 'base-oid' : 'changed-oid',
          };
        },
      }),
    }),
    'ambiguous',
  );
});

test('treats a package-level 404 as safely unpublished', async () => {
  const result = await inspectRegistry('https://registry.example/', async () => response(404, {}));
  assert.deepEqual(result, {
    registry: 'https://registry.example/',
    inspectedVersions: [],
    decision: 'safe-unpublished',
  });
});

test('inspects every safe manifest', async () => {
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(url);
    if (urls.length === 1) {
      return response(200, { versions: { '1.0.0': {}, '2.0.0': {} } });
    }
    const version = url.endsWith('/1.0.0') ? '1.0.0' : '2.0.0';
    return response(200, { version, exports: { '.': './index.js', './button': './button.js' } });
  };
  const result = await inspectRegistry('https://registry.example/', fetchImpl);
  assert.deepEqual(result.inspectedVersions, ['1.0.0', '2.0.0']);
  assert.equal(result.decision, 'safe-explicitly-unexposed');
  assert.equal(urls.length, 3);
});

test('detects exact and wildcard RadioField exports', () => {
  assert.equal(exportsRadioField({ './radio-field': './radio-field.js' }), true);
  assert.equal(exportsRadioField({ './*': './*.js' }), true);
  assert.equal(exportsRadioField({ './radio-*': './radio-*.js' }), true);
  assert.equal(exportsRadioField({ './radio-group': './radio-group.js' }), false);
});

test('blocks exact and wildcard published exposure', async () => {
  for (const exportsMap of [{ './radio-field': './radio-field.js' }, { './*': './*.js' }]) {
    let calls = 0;
    await rejectsDecision(
      inspectRegistry('https://registry.example/', async () => {
        calls += 1;
        return calls === 1
          ? response(200, { versions: { '1.0.0': {} } })
          : response(200, { version: '1.0.0', exports: exportsMap });
      }),
      'exposed',
    );
  }
});

test('blocks missing versions, manifests, exports, and incomplete manifests as ambiguous', async () => {
  await rejectsDecision(
    inspectRegistry('https://registry.example/', async () => response(200, { versions: {} })),
    'ambiguous',
  );
  await rejectsDecision(
    inspectRegistry('https://registry.example/', async (url) =>
      url.endsWith('/1.0.0') ? response(404, {}) : response(200, { versions: { '1.0.0': {} } }),
    ),
    'ambiguous',
  );
  await rejectsDecision(
    inspectRegistry('https://registry.example/', async (url) =>
      url.endsWith('/1.0.0')
        ? response(200, { version: '1.0.0' })
        : response(200, { versions: { '1.0.0': {} } }),
    ),
    'ambiguous',
  );
  await rejectsDecision(
    inspectRegistry('https://registry.example/', async (url) =>
      url.endsWith('/1.0.0')
        ? response(200, { exports: {} })
        : response(200, { versions: { '1.0.0': {} } }),
    ),
    'ambiguous',
  );
});

test('blocks registry network and HTTP failures as unavailable', async () => {
  await rejectsDecision(
    inspectRegistry('https://registry.example/', async () => {
      throw new Error('offline');
    }),
    'unavailable',
  );
  await rejectsDecision(
    inspectRegistry('https://registry.example/', async () => response(503, {})),
    'unavailable',
  );
});
