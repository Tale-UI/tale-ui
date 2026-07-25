import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
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

async function mutatedFixture(
  mutate: (manifest: Record<string, unknown>) => Record<string, unknown>,
) {
  const root = await mkdtemp(join(tmpdir(), 'tale-extension-'));
  await cp(fixtureRoot, root, { recursive: true });
  const path = join(root, 'extension.json');
  const manifest = JSON.parse(await readFile(path, 'utf8')) as Record<string, unknown>;
  await writeFile(path, `${JSON.stringify(mutate(manifest), null, 2)}\n`);
  return root;
}

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

test('discovery rejects corrupt schemas, missing integrity, and package identity drift', async () => {
  await Promise.all(
    [
      (manifest: Record<string, unknown>) => ({ ...manifest, schemaVersion: '2.0.0' }),
      ({ integrity: _, ...manifest }: Record<string, unknown>) => manifest,
      (manifest: Record<string, unknown>) => ({ ...manifest, package: '@fixture/other' }),
    ].map(async (mutate) => {
      const root = await mutatedFixture(mutate);
      try {
        assert.throws(() => discoverExtension(root), /invalid or unsupported|identity differs/);
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    }),
  );
});

test('virtual registry refuses duplicate namespaced artifacts', () => {
  const { manifest } = discoverExtension(fixtureRoot);
  assert.throws(
    () =>
      createVirtualExtensionRegistry([
        { manifest, packageBytes },
        { manifest, packageBytes },
      ]),
    /Duplicate virtual extension artifact/,
  );
});

test('contract, provenance, publisher, capability, and project approvals are exact', async () => {
  const incompatibleRoot = await mutatedFixture((manifest) => ({
    ...manifest,
    contractRanges: { tale: '^2.0.0', extension: '^2.0.0' },
  }));
  const noProvenanceRoot = await mutatedFixture((manifest) => ({
    ...manifest,
    provenance: {
      ...(manifest.provenance as Record<string, unknown>),
      npmProvenance: false,
    },
  }));
  try {
    for (const override of [
      { packageRoot: incompatibleRoot },
      { packageRoot: noProvenanceRoot },
      { trustRegistry: { ...trust(), publishers: [] } },
      { approval: { ...approval(), capabilities: [] } },
      { projectId: `sha256:${'0'.repeat(64)}` },
    ]) {
      assert.throws(
        () =>
          authorizeExtensionExecution({
            packageRoot: fixtureRoot,
            artifactId: 'fixture.tale-extension:validation:fixture-validation',
            packageBytes,
            trustRegistry: trust(),
            approval: approval(),
            projectId,
            surface: 'local',
            now: new Date('2026-07-30T00:00:00.000Z'),
            ...override,
          }),
        /Extension execution denied/,
      );
    }
  } finally {
    await rm(incompatibleRoot, { recursive: true, force: true });
    await rm(noProvenanceRoot, { recursive: true, force: true });
  }
});

test('trust registry age warns before it fails', () => {
  const decision = authorizeExtensionExecution({
    packageRoot: fixtureRoot,
    artifactId: 'fixture.tale-extension:validation:fixture-validation',
    packageBytes,
    trustRegistry: trust(),
    approval: approval(),
    projectId,
    surface: 'local',
    now: new Date('2026-08-02T00:00:00.000Z'),
  });
  assert.deepEqual(decision.warnings, ['Extension trust registry is older than seven days.']);
});
