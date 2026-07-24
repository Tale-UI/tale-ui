#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADR_PATH = 'docs/architecture/adr-001-tooling-package.md';
const VALIDATION_BASELINE_PATH = 'analysis/baselines/validation-runtime.json';
const MUTATION_BASELINE_PATH = 'analysis/baselines/project-mutation-runtime.json';
const adr = readFileSync(join(ROOT, ADR_PATH), 'utf8');
const accepted = /^- Status: Accepted$/m.test(adr);

const packageManifest = join(ROOT, 'packages/tooling/package.json');
const publishWorkflow = readFileSync(join(ROOT, '.github/workflows/publish.yml'), 'utf8');
const capabilitySource = JSON.parse(
  readFileSync(join(ROOT, 'registry/sources/capabilities.json'), 'utf8'),
);
const artifactRegistry = JSON.parse(readFileSync(join(ROOT, 'registry/artifacts.json'), 'utf8'));

function findPackageManifests(directory) {
  if (!existsSync(directory)) {
    return [];
  }
  const manifests = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'build', 'dist', '.git'].includes(entry.name)) {
      continue;
    }
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...findPackageManifests(path));
    } else if (entry.name === 'package.json') {
      manifests.push(path);
    }
  }
  return manifests;
}

const workspaceManifestPaths = [
  join(ROOT, 'package.json'),
  ...['docs', 'packages', 'apps', 'tools', 'test', 'scripts', 'playground'].flatMap((directory) =>
    findPackageManifests(join(ROOT, directory)),
  ),
];
const taleBinaryManifests = workspaceManifestPaths.filter((path) => {
  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  if (typeof manifest.bin === 'object' && manifest.bin !== null) {
    return Object.hasOwn(manifest.bin, 'tale');
  }
  return typeof manifest.bin === 'string' && manifest.name?.split('/').at(-1) === 'tale';
});

const prematureIntegrations = [
  existsSync(packageManifest) && 'packages/tooling/package.json',
  ...taleBinaryManifests.map(
    (path) => `tale binary in ${path.slice(ROOT.length + 1).replaceAll('\\', '/')}`,
  ),
  publishWorkflow.includes('@tale-ui/tooling') && 'tooling publish integration',
].filter(Boolean);

if (!accepted && prematureIntegrations.length > 0) {
  throw new Error(
    `${ADR_PATH} is not Accepted; remove premature integration: ${prematureIntegrations.join(
      ', ',
    )}`,
  );
}

if (accepted) {
  const toolingManifest = JSON.parse(readFileSync(packageManifest, 'utf8'));
  if (artifactRegistry.releaseChannel === 'internal' && toolingManifest.private !== true) {
    throw new Error('Internal tooling releases must remain private');
  }
  if (publishWorkflow.includes('@tale-ui/tooling')) {
    throw new Error('Tooling publication is gated until packed validation parity passes');
  }
  const validationCapability = capabilitySource.capabilities.find(
    (entry) => entry.id === 'code.validate',
  );
  if (!validationCapability) {
    throw new Error('code.validate must be declared in the capability source');
  }
  if (validationCapability.status === 'available') {
    const requiredAvailability = ['api', 'cli', 'local-mcp'];
    if (
      JSON.stringify(validationCapability.availability) !== JSON.stringify(requiredAvailability)
    ) {
      throw new Error('Available code.validate must expose exact API, CLI, and local-MCP parity');
    }
    const requiredEvidence = [
      VALIDATION_BASELINE_PATH,
      'packages/tooling/fixtures/vite/tsconfig.json',
      'packages/tooling/fixtures/next/tsconfig.json',
      'packages/tooling/src/mcp-server.ts',
    ];
    for (const path of requiredEvidence) {
      if (!existsSync(join(ROOT, path))) {
        throw new Error(`code.validate is available without required gate evidence: ${path}`);
      }
    }
    const baseline = JSON.parse(readFileSync(join(ROOT, VALIDATION_BASELINE_PATH), 'utf8'));
    if (
      baseline.selectedLimits?.maximumInputBytes !== 1_000_000 ||
      baseline.selectedLimits?.maximumDiagnostics !== 200 ||
      baseline.selectedLimits?.defaultTimeoutMs !== 30_000 ||
      baseline.selectedLimits?.maximumTimeoutMs !== 60_000
    ) {
      throw new Error('code.validate runtime limits do not match the approved baseline evidence');
    }
  } else if (
    validationCapability.status !== 'gated' ||
    validationCapability.availability.length !== 0
  ) {
    throw new Error('code.validate must be available with evidence or remain fully gated');
  }
  const mutationCapability = capabilitySource.capabilities.find(
    (entry) => entry.id === 'project.mutate',
  );
  if (!mutationCapability) {
    throw new Error('project.mutate must be declared in the capability source');
  }
  if (mutationCapability.status === 'available') {
    if (
      JSON.stringify(mutationCapability.availability) !== JSON.stringify(['api', 'cli'])
    ) {
      throw new Error('Available project.mutate must expose exact API and CLI parity');
    }
    const requiredEvidence = [
      MUTATION_BASELINE_PATH,
      'packages/tooling/src/operations.test.ts',
      'packages/tooling/src/materialize.test.ts',
      'packages/tooling/scripts/test-packed.mjs',
      'packages/tooling/templates',
    ];
    for (const path of requiredEvidence) {
      if (!existsSync(join(ROOT, path))) {
        throw new Error(`project.mutate is available without required gate evidence: ${path}`);
      }
    }
    const baseline = JSON.parse(readFileSync(join(ROOT, MUTATION_BASELINE_PATH), 'utf8'));
    if (
      baseline.status !== 'passed' ||
      JSON.stringify(baseline.surfaces) !== JSON.stringify(['api', 'cli']) ||
      !baseline.safetyEvidence?.includes('read-only-doctor') ||
      !baseline.safetyEvidence?.includes('installed-package-materialization')
    ) {
      throw new Error('project.mutate gate evidence is incomplete or incompatible');
    }
  } else if (
    mutationCapability.status !== 'gated' ||
    mutationCapability.availability.length !== 0
  ) {
    throw new Error('project.mutate must be available with evidence or remain fully gated');
  }
  console.log('OK: P-01 is approved; validation and mutation evidence gates are enforced');
} else {
  console.log(
    `OK: P-01 is enforced; ${ADR_PATH} remains Proposed and no public tooling integration exists`,
  );
}
