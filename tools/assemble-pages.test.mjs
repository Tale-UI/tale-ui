import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { mkdtemp } from 'node:fs/promises';
import { assemblePages } from './assemble-pages.mjs';

test('Pages assembly exposes current, previous, agent, and rollback routes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tale-pages-'));
  const docsOutput = join(root, 'docs-out');
  const pagesOutput = join(root, 'pages');
  mkdirSync(docsOutput, { recursive: true });
  writeFileSync(join(docsOutput, 'index.html'), '<h1>Current</h1>');
  const result = assemblePages({ docsOutput, pagesOutput, basePath: '/tale-ui' });
  assert.deepEqual(result.currentRoutes, ['/docs/', '/docs/current/', '/docs/v2/']);
  assert.ok(result.previousRoutes.length >= 100);
  assert.equal(readFileSync(join(pagesOutput, 'docs/index.html'), 'utf8'), '<h1>Current</h1>');
  assert.match(readFileSync(join(pagesOutput, 'docs/v1/index.html'), 'utf8'), /react-v1\.3\.56/);
  const recipeIndex = readFileSync(join(pagesOutput, 'docs/v1/recipes/index/index.html'), 'utf8');
  assert.match(recipeIndex, /\/tale-ui\/docs\/v1\/recipes\/form-with-validation\//);
  assert.doesNotMatch(recipeIndex, /href="form-with-validation\.md"/);
  const philosophy = readFileSync(
    join(pagesOutput, 'docs/v1/design-philosophy/index.html'),
    'utf8',
  );
  assert.match(philosophy, /\/tale-ui\/docs\/v1\/css\/framework-integration\//);
  assert.match(readFileSync(join(pagesOutput, 'llms.txt'), 'utf8'), /tale-ui/);
  assert.match(readFileSync(join(pagesOutput, 'docs/rollback.json'), 'utf8'), /lastKnownGood/);
});
