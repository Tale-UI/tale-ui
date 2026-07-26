#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
assert.equal(
  packageJson.engines?.node,
  '>=18',
  'The React 3 consumer Node floor must remain >=18.',
);

if (!process.argv.includes('--expect-node-16-rejection')) {
  process.stdout.write(
    'React engine contract passed. Run with --expect-node-16-rejection and ' +
      'TALE_REACT_TARBALL under Node 16 to exercise engine-strict rejection.\n',
  );
  process.exit(0);
}

assert.equal(
  Number(process.versions.node.split('.')[0]),
  16,
  'The rejection probe must run under Node 16.',
);
assert.ok(process.env.TALE_REACT_TARBALL, 'TALE_REACT_TARBALL must name a prebuilt tarball.');
const tarball = resolve(process.env.TALE_REACT_TARBALL);
const fixtureRoot = await mkdtemp(join(tmpdir(), 'tale-react-node16-rejection-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

try {
  const packedManifestResult = spawnSync('tar', ['-xOf', tarball, 'package/package.json'], {
    encoding: 'utf8',
  });
  assert.equal(packedManifestResult.status, 0, 'Could not inspect the packed React manifest.');
  const packedManifest = JSON.parse(packedManifestResult.stdout);
  assert.equal(packedManifest.name, '@tale-ui/react');
  assert.equal(packedManifest.version, '3.0.0');
  assert.equal(
    packedManifest.engines?.node,
    '>=18',
    'The actual React tarball must declare the Node 18 floor before rejection is tested.',
  );
  await writeFile(
    join(fixtureRoot, 'package.json'),
    `${JSON.stringify({ name: 'tale-node16-rejection', private: true }, null, 2)}\n`,
  );
  const result = spawnSync(
    npm,
    ['install', '--engine-strict', '--ignore-scripts', '--no-package-lock', tarball],
    {
      cwd: fixtureRoot,
      encoding: 'utf8',
    },
  );
  assert.notEqual(result.status, 0, 'Node 16 engine-strict installation unexpectedly succeeded.');
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /@tale-ui\/react@3\.0\.0[\s\S]*(?:not compatible|Unsupported engine|>=18)|(?:not compatible|Unsupported engine|>=18)[\s\S]*@tale-ui\/react@3\.0\.0/i,
    'Node 16 rejection output must identify the packed React 3 Node >=18 contract.',
  );
  process.stdout.write('React Node 16 engine-strict rejection passed.\n');
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}
