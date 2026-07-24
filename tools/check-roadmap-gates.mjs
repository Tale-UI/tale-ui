#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADR_PATH = 'docs/architecture/adr-001-tooling-package.md';
const adr = readFileSync(join(ROOT, ADR_PATH), 'utf8');
const accepted = /^- Status: Accepted$/m.test(adr);

const packageManifest = join(ROOT, 'packages/tooling/package.json');
const publishWorkflow = readFileSync(join(ROOT, '.github/workflows/publish.yml'), 'utf8');

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

console.log(
  accepted
    ? `OK: ${ADR_PATH} is Accepted`
    : `OK: P-01 is enforced; ${ADR_PATH} remains Proposed and no public tooling integration exists`,
);
