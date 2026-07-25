#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { format } from 'prettier';

const ROOT = resolve(import.meta.dirname, '..');
const CHECK = process.argv.includes('--check');
const OUTPUT_ROOT = join(ROOT, 'registry/reports');
const TODAY = new Date().toISOString().slice(0, 10);
const DAY_MS = 86_400_000;

const paths = {
  lifecycle: 'registry/governance/lifecycle.json',
  ownership: 'registry/governance/ownership.json',
  exceptions: 'registry/governance/exceptions.json',
  artifacts: 'registry/artifacts.json',
};

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function validate(schemaPath, value, valuePath) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(readJson(schemaPath));
  assert.ok(
    validator(value),
    `${valuePath}: ${ajv.errorsText(validator.errors, { separator: '\n' })}`,
  );
}

const lifecycle = readJson(paths.lifecycle);
const ownership = readJson(paths.ownership);
const exceptions = readJson(paths.exceptions);
const registry = readJson(paths.artifacts);
validate('schemas/lifecycle.schema.json', lifecycle, paths.lifecycle);
validate('schemas/ownership.schema.json', ownership, paths.ownership);
validate('schemas/governance-exceptions.schema.json', exceptions, paths.exceptions);

const owners = new Map(ownership.owners.map((owner) => [owner.id, owner]));
assert.ok(owners.has(ownership.defaultOwner), 'Default owner is not defined');
assert.equal(owners.size, ownership.owners.length, 'Owner IDs must be unique');
for (const rule of ownership.rules) {
  assert.ok(owners.has(rule.owner), `Ownership rule references unknown owner ${rule.owner}`);
}

const migrationPaths = readdirSync(join(ROOT, 'packages/tooling/migrations'))
  .map((name) => `packages/tooling/migrations/${name}/manifest.json`)
  .filter((path) => existsSync(join(ROOT, path)))
  .sort();
const migrations = migrationPaths.map((path) => ({ path, manifest: readJson(path) }));
const sourcePaths = [...Object.values(paths), ...migrationPaths].sort();
const sourceRevision = `sha256:${createHash('sha256')
  .update(sourcePaths.map((path) => `${path}\n${canonical(readJson(path))}`).join(''))
  .digest('hex')}`;

function matches(artifact, match) {
  return (
    (match.kind === undefined || artifact.kind === match.kind) &&
    (match.package === undefined || artifact.package === match.package) &&
    (match.idPrefix === undefined || artifact.id.startsWith(match.idPrefix))
  );
}

function ownerFor(artifact) {
  return (
    ownership.rules.find((rule) => matches(artifact, rule.match))?.owner ?? ownership.defaultOwner
  );
}

const ownershipGroups = new Map(ownership.owners.map((owner) => [owner.id, []]));
for (const artifact of registry.artifacts) {
  ownershipGroups.get(ownerFor(artifact)).push(artifact.id);
}
const ownershipReport = {
  schemaVersion: '1.0.0',
  reportType: 'ownership',
  sourceRevision,
  artifactCount: registry.artifacts.length,
  owners: ownership.owners.map((owner) => ({
    id: owner.id,
    name: owner.name,
    contact: owner.contact,
    artifactCount: ownershipGroups.get(owner.id).length,
    artifacts: ownershipGroups.get(owner.id).sort(),
  })),
};
assert.equal(
  ownershipReport.owners.reduce((sum, owner) => sum + owner.artifactCount, 0),
  registry.artifacts.length,
  'Every artifact must have exactly one owner',
);

const lifecycleOrder = ['experimental', 'stable', 'deprecated', 'retired'];
const statusReport = {
  schemaVersion: '1.0.0',
  reportType: 'status',
  sourceRevision,
  states: lifecycleOrder.map((state) => {
    const artifacts = registry.artifacts
      .filter((artifact) => artifact.lifecycle === state)
      .map((artifact) => artifact.id)
      .sort();
    return { state, artifactCount: artifacts.length, artifacts };
  }),
};

const migrationByDeprecation = new Map();
for (const { manifest } of migrations) {
  for (const deprecation of manifest.deprecations) {
    migrationByDeprecation.set(deprecation.id, manifest.id);
  }
}
const replacementsReport = {
  schemaVersion: '1.0.0',
  reportType: 'replacements',
  sourceRevision,
  replacements: registry.artifacts
    .filter((artifact) => artifact.lifecycle === 'deprecated')
    .map((artifact) => {
      assert.ok(artifact.replacementId, `${artifact.id} has no replacement`);
      assert.ok(
        registry.artifacts.some((candidate) => candidate.id === artifact.replacementId),
        `${artifact.id} replacement is missing`,
      );
      return {
        artifactId: artifact.id,
        replacementId: artifact.replacementId,
        migrationTreatment: migrationByDeprecation.get(artifact.id) ?? 'documented-manual',
      };
    })
    .sort((a, b) => a.artifactId.localeCompare(b.artifactId)),
};

const migrationsReport = {
  schemaVersion: '1.0.0',
  reportType: 'migrations',
  sourceRevision,
  migrations: migrations.map(({ path, manifest }) => ({
    id: manifest.id,
    order: manifest.order,
    group: manifest.group,
    manifest: path,
    affectedArtifacts: [...manifest.affectedArtifacts].sort(),
    deprecations: manifest.deprecations.map(({ id, replacementId }) => ({ id, replacementId })),
  })),
};

for (const exception of exceptions.exceptions) {
  assert.ok(owners.has(exception.owner), `${exception.id} references unknown owner`);
  assert.ok(exception.expiresOn >= TODAY, `${exception.id} expired on ${exception.expiresOn}`);
  const duration = (Date.parse(exception.expiresOn) - Date.parse(exception.approvedOn)) / DAY_MS;
  assert.ok(
    duration >= 0 && duration <= lifecycle.exceptionPolicy.maximumDays,
    `${exception.id} exceeds the ${lifecycle.exceptionPolicy.maximumDays}-day maximum`,
  );
}
const exceptionsReport = {
  schemaVersion: '1.0.0',
  reportType: 'exceptions',
  sourceRevision,
  activeCount: exceptions.exceptions.length,
  exceptions: exceptions.exceptions.map((exception) => ({ ...exception, status: 'active' })),
};

const outputs = {
  'ownership.json': ownershipReport,
  'status.json': statusReport,
  'replacements.json': replacementsReport,
  'migrations.json': migrationsReport,
  'exceptions.json': exceptionsReport,
};
for (const [name, value] of Object.entries(outputs)) {
  const path = join(OUTPUT_ROOT, name);
  const content = await format(canonical(value), { parser: 'json' });
  if (CHECK) {
    assert.ok(existsSync(path), `Missing generated governance report ${name}`);
    assert.equal(readFileSync(path, 'utf8'), content, `Stale governance report ${name}`);
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
}

console.log(
  `${CHECK ? 'OK' : 'GENERATED'}: lifecycle policy, ${registry.artifacts.length} owned artifacts, ${replacementsReport.replacements.length} replacements, ${exceptionsReport.activeCount} active exceptions`,
);
