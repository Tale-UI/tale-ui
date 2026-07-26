import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const A2UI_FREEZE_REVISION = '5e539e19287b9f5469d8f13e0ebe44f43d4dda62';
const protectedPaths = [
  'packages/a2ui',
  'tools/a2ui-catalog-metadata.js',
  'tools/a2ui-golden-prompts',
  'registry/a2ui-catalog.json',
  'docs/a2ui-integration.md',
];

function readFromRevision(path) {
  const result = spawnSync('git', ['show', `${A2UI_FREEZE_REVISION}:${path}`], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `Could not read ${path} at ${A2UI_FREEZE_REVISION}.`);
  return result.stdout;
}

function extractWorkflowJob(source, job) {
  const match = source.match(new RegExp(`^  ${job}:\\n[\\s\\S]*?(?=^  [a-zA-Z0-9_-]+:|\\Z)`, 'm'));
  assert.ok(match, `Workflow job ${job} is missing.`);
  return match[0];
}

test('component-equivalence expansion leaves all A2UI publication surfaces unchanged', () => {
  const result = spawnSync(
    'git',
    ['diff', '--exit-code', A2UI_FREEZE_REVISION, '--', ...protectedPaths],
    { encoding: 'utf8' },
  );
  assert.equal(
    result.status,
    0,
    `Protected A2UI surfaces changed from ${A2UI_FREEZE_REVISION}:\n${result.stdout}${result.stderr}`,
  );
});

test('component-equivalence expansion freezes the A2UI CI and release topology', () => {
  const currentCi = readFileSync('.github/workflows/ci.yml', 'utf8');
  const frozenCi = readFromRevision('.github/workflows/ci.yml');
  assert.equal(
    extractWorkflowJob(currentCi, 'check-a2ui'),
    extractWorkflowJob(frozenCi, 'check-a2ui'),
    'The A2UI CI job changed from the approved freeze revision.',
  );

  const currentPublish = readFileSync('.github/workflows/publish.yml', 'utf8');
  const frozenPublish = readFromRevision('.github/workflows/publish.yml');
  assert.doesNotMatch(currentPublish, /a2ui/i, 'A2UI must remain outside the publish workflow.');
  assert.doesNotMatch(frozenPublish, /a2ui/i, 'The freeze revision unexpectedly published A2UI.');

  const currentScripts = Object.fromEntries(
    Object.entries(JSON.parse(readFileSync('package.json', 'utf8')).scripts)
      .filter(([name]) => name.startsWith('a2ui:') && name !== 'a2ui:component-equivalence:check')
      .sort(([left], [right]) => left.localeCompare(right)),
  );
  const frozenScripts = Object.fromEntries(
    Object.entries(JSON.parse(readFromRevision('package.json')).scripts)
      .filter(([name]) => name.startsWith('a2ui:'))
      .sort(([left], [right]) => left.localeCompare(right)),
  );
  assert.deepEqual(
    currentScripts,
    frozenScripts,
    'A2UI build, catalog, registry, or golden script topology changed.',
  );
});
