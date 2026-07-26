#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const expansionContract = JSON.parse(
  await readFile(join(packageRoot, 'test/public-types/expansion-subpaths.json'), 'utf8'),
);

const expectedExpansionSubpaths = [
  './aspect-ratio',
  './blockquote',
  './button-group',
  './citation',
  './code',
  './lightbox',
  './markdown',
  './outline',
  './overflow-list',
  './resizable',
  './skeleton',
  './timestamp',
  './toast',
];

assert.equal(expansionContract.schemaVersion, '1.0.0');
assert.deepEqual(
  expansionContract.subpaths.map(({ subpath }) => subpath),
  expectedExpansionSubpaths,
  'The component-equivalence public-type opt-in list must keep its frozen order.',
);

for (const entry of expansionContract.subpaths) {
  assert.equal(typeof entry.enabled, 'boolean', `${entry.subpath} must declare enabled.`);
  if (entry.enabled) {
    assert.ok(
      Object.hasOwn(packageJson.exports, entry.subpath),
      `${entry.subpath} is enabled for public-type validation but is not exported.`,
    );
  }
}

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
execFileSync(
  pnpm,
  ['exec', 'tsc', '--project', join(packageRoot, 'test/public-types/tsconfig.json')],
  {
    cwd: packageRoot,
    stdio: 'inherit',
  },
);

process.stdout.write('React public type contracts passed.\n');
