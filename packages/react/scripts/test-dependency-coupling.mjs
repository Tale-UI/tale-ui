#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ReactAria from 'react-aria';
import * as ReactAriaComponents from 'react-aria-components';
import { runStableToastAdapterFixture } from '../test/dependency-coupling/stable-toast-adapter.fixture.mjs';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));

assert.equal(
  packageJson.dependencies['react-aria-components'],
  '1.20.0',
  'React Aria Components must remain exactly pinned for Group and unstable Toast coupling.',
);
assert.equal(
  packageJson.dependencies['react-aria'],
  '3.51.0',
  'react-aria must remain exactly pinned for useMove coupling.',
);

for (const dependencySet of [
  packageJson.dependencies,
  packageJson.peerDependencies,
  packageJson.optionalDependencies,
]) {
  assert.equal(
    dependencySet?.['react-stately'],
    undefined,
    'The React package must not take a direct react-stately dependency.',
  );
}

assert.ok(
  ['function', 'object'].includes(typeof ReactAriaComponents.Group),
  'RAC Group must remain a renderable component.',
);
assert.ok(
  ['function', 'object'].includes(typeof ReactAriaComponents.UNSTABLE_Toast),
  'RAC unstable Toast must remain a renderable component.',
);
assert.ok(
  ['function', 'object'].includes(typeof ReactAriaComponents.UNSTABLE_ToastRegion),
  'RAC unstable ToastRegion must remain a renderable component.',
);
assert.equal(
  typeof ReactAriaComponents.UNSTABLE_ToastQueue,
  'function',
  'RAC unstable ToastQueue must remain constructible.',
);
assert.equal(
  ReactAriaComponents.UNSTABLE_ToastQueue.prototype.add.length,
  1,
  'Raw ToastQueue.add must retain its one-argument runtime shape.',
);
for (const method of ['subscribe', 'close', 'clear', 'pauseAll', 'resumeAll']) {
  assert.equal(
    typeof ReactAriaComponents.UNSTABLE_ToastQueue.prototype[method],
    'function',
    `Raw ToastQueue.${method} must remain available.`,
  );
}

assert.equal(typeof ReactAria.useMove, 'function', 'react-aria must continue to export useMove.');
assert.equal(ReactAria.useMove.length, 1, 'useMove must retain its one-options-argument shape.');

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
execFileSync(
  pnpm,
  ['exec', 'tsc', '--project', join(packageRoot, 'test/dependency-coupling/tsconfig.json')],
  {
    cwd: packageRoot,
    stdio: 'inherit',
  },
);

await runStableToastAdapterFixture(ReactAriaComponents.UNSTABLE_ToastQueue);

process.stdout.write('React dependency coupling contracts passed.\n');
