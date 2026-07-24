import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createErrorEnvelope,
  createSuccessEnvelope,
  getArtifact,
  getManifest,
  searchArtifacts,
} from './api.js';
import { TaleToolingError } from './contracts/errors.js';
import { loadArtifactRegistry } from './registry.js';

test('manifest correlates registry, capability, and package versions', () => {
  const manifest = getManifest();
  assert.equal(manifest.contractVersion, '1.0.0');
  assert.equal(manifest.registryVersion, '1.0.0');
  assert.equal(manifest.releaseChannel, 'internal');
  assert.equal(manifest.packageVersions['@tale-ui/tooling'], '0.0.0-internal');
  assert.ok(manifest.capabilities.some((capability) => capability.id === 'artifact.search'));
  assert.ok(manifest.capabilities.some((capability) => capability.id === 'manifest.get'));
  assert.equal(
    manifest.capabilities.find((capability) => capability.id === 'code.validate')?.status,
    'gated',
  );
});

test('registry loader caches the canonical payload', () => {
  assert.strictEqual(loadArtifactRegistry(), loadArtifactRegistry());
});

test('read-only API searches mixed kinds and retrieves stable IDs', () => {
  const result = searchArtifacts({ query: 'table', limit: 100 });
  assert.ok(new Set(result.results.map((artifact) => artifact.kind)).size > 1);
  assert.equal(getArtifact('tale:component:table')?.name, 'Table');
  assert.equal(getArtifact('Table', { kind: 'component' })?.id, 'tale:component:table');
});

test('invalid API input maps to the stable invalid-argument contract', () => {
  assert.throws(
    () => searchArtifacts({ limit: 0 }),
    (error) => error instanceof TaleToolingError && error.code === 'TALE_INVALID_ARGUMENT',
  );
  assert.throws(
    () => getArtifact(''),
    (error) => error instanceof TaleToolingError && error.code === 'TALE_INVALID_ARGUMENT',
  );
});

test('machine envelopes carry correlated versions and sanitized errors', () => {
  const success = createSuccessEnvelope('manifest', 'request-1', { ready: true });
  assert.equal(success.ok, true);
  assert.equal(success.versions.registry, '1.0.0');
  assert.ok(success.capabilities.includes('artifact.search'));
  assert.equal(success.capabilities.includes('code.validate'), false);

  const failure = createErrorEnvelope(
    'component',
    'request-2',
    new TaleToolingError('TALE_ARTIFACT_NOT_FOUND', 'Artifact not found.'),
  );
  assert.deepEqual(failure.error.details, {});
  assert.equal(failure.error.code, 'TALE_ARTIFACT_NOT_FOUND');
  assert.equal(JSON.stringify(failure).includes(process.cwd()), false);
});
