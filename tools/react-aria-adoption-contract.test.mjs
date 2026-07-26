import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reactManifest = JSON.parse(readFileSync(join(ROOT, 'packages/react/package.json'), 'utf8'));
const adoption = readFileSync(join(ROOT, 'docs/upstream/react-aria-components.md'), 'utf8');
const deviations = readFileSync(join(ROOT, 'docs/react-aria-deviations.md'), 'utf8');

const workspaceRacManifests = [
  'packages/react/package.json',
  'apps/mcp-studio/package.json',
  'apps/recipe-studio/package.json',
  'docs/package.json',
  'playground/scale/package.json',
  'playground/storybook/package.json',
  'playground/vite-app/package.json',
];

const decisionIds = [
  'component-equivalence:button-group',
  'component-equivalence:toast',
  'component-equivalence:resizable',
  'component-equivalence:resizable-table-container',
  'component-equivalence:skeleton',
];

function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

test('the React package owns an exact, non-duplicated React Aria stack', () => {
  assert.equal(reactManifest.dependencies['react-aria-components'], '1.19.0');
  assert.equal(reactManifest.dependencies['react-aria'], '3.50.0');
  assert.equal(reactManifest.dependencies['react-stately'], undefined);

  for (const path of workspaceRacManifests) {
    const manifest = JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
    assert.equal(
      manifest.dependencies?.['react-aria-components'] ??
        manifest.devDependencies?.['react-aria-components'],
      '1.19.0',
      `${path} must use the exact RAC pin`,
    );
  }
});

test('both maintained documents declare the exact target and one current decision record', () => {
  for (const [path, document] of [
    ['docs/upstream/react-aria-components.md', adoption],
    ['docs/react-aria-deviations.md', deviations],
  ]) {
    assert.match(document, /exact [`*]*react-aria-components[`*]*(?: version)? [`*]*1\.19\.0/i);
    assert.doesNotMatch(document, /currently targets [`*]*react-aria-components \^1\.19\.0/i);
    for (const decisionId of decisionIds) {
      assert.equal(
        occurrences(document, `\`${decisionId}\``),
        1,
        `${path} must contain exactly one ${decisionId} record`,
      );
    }
  }
});

test('upgrade review freezes the three upstream coupling surfaces', () => {
  for (const document of [adoption, deviations]) {
    assert.match(document, /every RAC upgrade[\s\S]{0,200}`Group`/i);
    assert.match(document, /unstable Toast raw-object\/snapshot/i);
    assert.match(document, /`useMove` coupling/i);
  }
});

test('the five adoption boundaries cannot be reversed by documentation drift', () => {
  assert.match(adoption, /ButtonGroup[\s\S]{0,240}restricted render props/i);
  assert.match(adoption, /Toast[\s\S]{0,240}privately[\s\S]{0,160}experimental lifecycle/i);
  assert.match(adoption, /Resizable[\s\S]{0,320}`useMove`[\s\S]{0,240}Tale owns topology/i);
  assert.match(adoption, /ResizableTableContainer[\s\S]{0,240}table-column-specific/i);
  assert.match(adoption, /Skeleton[\s\S]{0,300}not a React Aria Components primitive/i);

  assert.match(
    deviations,
    /ButtonGroup[\s\S]{0,320}excludes render-function `children`, `className`, and `style`/i,
  );
  assert.match(
    deviations,
    /public queue is intentionally not structurally compatible with the upstream queue class/i,
  );
  assert.match(
    deviations,
    /Resizable[\s\S]{0,420}not a wrapper around table-only `ResizableTableContainer`/i,
  );
  assert.match(deviations, /consumers remain responsible for announcing loading state/i);
});

test('maintained docs do not misstate the rejected upstream primitives', () => {
  for (const document of [adoption, deviations]) {
    assert.doesNotMatch(document, /ResizableTableContainer (?:is|as) (?:a )?general panel resiz/i);
    assert.doesNotMatch(
      document,
      /React Spectrum Skeleton is (?:a|an) (?:React Aria Components|RAC) primitive/i,
    );
  }
});
