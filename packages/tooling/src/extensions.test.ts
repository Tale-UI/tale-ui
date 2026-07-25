import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import {
  authorizeExtensionExecution,
  createVirtualExtensionRegistry,
  discoverExtension,
  verifyExtensionIntegrity,
} from './extensions.js';

const fixtureRoot = resolve('fixtures/extensions/full');
const packageBytes = Buffer.from('fixture tarball bytes');
const projectId = `sha256:${createHash('sha256').update('fixture-project').digest('hex')}`;

function trust(status: 'trusted' | 'revoked' = 'trusted') {
  return {
    schemaVersion: '1.0.0' as const,
    generatedAt: '2026-07-25T00:00:00.000Z',
    freshness: { warnAfterDays: 7 as const, failAfterDays: 30 as const },
    publishers: [
      {
        publisher: 'fixture.tale-ui.dev',
        status,
        packages: ['@fixture/tale-extension'],
        provenanceRequired: true,
        reviewedAt: '2026-07-25T00:00:00.000Z',
        ...(status === 'revoked'
          ? {
              revocation: {
                reason: 'Fixture revocation',
                effectiveAt: '2026-07-25T00:00:00.000Z',
              },
            }
          : {}),
      },
    ],
  };
}

function approval() {
  return {
    schemaVersion: '1.0.0' as const,
    projectId,
    package: '@fixture/tale-extension',
    publisher: 'fixture.tale-ui.dev',
    version: '1.0.0',
    integrity:
      'sha512-MsgCGCc5K35IkjlYRQdTDCpndOD0Fjf6C06fNFBQEC6xF4013xW2UcwMerii0t15JagdPzXjaQcWA3vC3pbnMw==',
    capabilities: ['validation.run', 'codemod.run'],
    approvedAt: '2026-07-25T00:00:00.000Z',
    revoked: false,
  };
}

test('schema-only discovery covers all five namespaced contribution classes', () => {
  const { manifest } = discoverExtension(fixtureRoot);
  assert.equal(manifest.contributions.length, 5);
  assert.equal(verifyExtensionIntegrity(packageBytes, manifest.integrity), true);
  const virtual = createVirtualExtensionRegistry([{ manifest, packageBytes }]);
  assert.deepEqual(
    new Set(virtual.map(({ contributionClass }) => contributionClass)),
    new Set([
      'components-and-docs',
      'recipes-and-templates',
      'validations-and-pitfalls',
      'codemods',
      'a2ui-types',
    ]),
  );
  assert.ok(virtual.every(({ id }) => id.startsWith('fixture.tale-extension:')));
});

test('local execution authorization returns a confined path without importing it', () => {
  const decision = authorizeExtensionExecution({
    packageRoot: fixtureRoot,
    artifactId: 'fixture.tale-extension:validation:fixture-validation',
    packageBytes,
    trustRegistry: trust(),
    approval: approval(),
    projectId,
    surface: 'local',
    now: new Date('2026-07-30T00:00:00.000Z'),
  });
  assert.equal(decision.allowed, true);
  assert.equal(decision.entrypoint, join(fixtureRoot, 'executables/validation.mjs'));
  assert.deepEqual(decision.warnings, []);
});

test('hosted, revoked, stale, unapproved, and corrupt execution fail closed', () => {
  const base = {
    packageRoot: fixtureRoot,
    artifactId: 'fixture.tale-extension:codemod:fixture-codemod',
    packageBytes,
    trustRegistry: trust(),
    approval: approval(),
    projectId,
    surface: 'local' as const,
    now: new Date('2026-07-30T00:00:00.000Z'),
  };
  for (const override of [
    { surface: 'hosted' as const },
    { trustRegistry: trust('revoked') },
    { now: new Date('2026-09-01T00:00:00.000Z') },
    { approval: { ...approval(), revoked: true } },
    { packageBytes: Buffer.from('corrupt') },
  ]) {
    assert.throws(
      () => authorizeExtensionExecution({ ...base, ...override }),
      /TALE_EXTENSION_UNTRUSTED|Extension execution denied/,
    );
  }
});
