import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { checkStorybookLoader } from './check-react-native-storybook-loader.mjs';

const loader = new URL(
  '../playground/react-native-storybook/.rnstorybook/storybook.requires.ts',
  import.meta.url,
);
const snapshot = () => ({
  bytes: readFileSync(loader),
  mode: statSync(loader).mode,
  size: statSync(loader).size,
  mtimeMs: statSync(loader).mtimeMs,
});

test('repeats in distinct temporary projects without changing the repository loader', async () => {
  const before = snapshot();
  const first = await checkStorybookLoader();
  const second = await checkStorybookLoader();
  assert.notEqual(first.temporaryRoot, second.temporaryRoot);
  assert.deepEqual(snapshot(), before);
});

test('supports simultaneous isolated checks without locks or repository writes', async () => {
  const before = snapshot();
  const roots = [];
  await Promise.all([
    checkStorybookLoader({ onTemporaryRoot: (root) => roots.push(root) }),
    checkStorybookLoader({ onTemporaryRoot: (root) => roots.push(root) }),
  ]);
  assert.equal(roots.length, 2);
  assert.notEqual(roots[0], roots[1]);
  assert.deepEqual(snapshot(), before);
});
