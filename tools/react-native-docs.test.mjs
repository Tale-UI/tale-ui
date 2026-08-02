import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';

const ROOT = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(join(ROOT, path), 'utf8');
const readJson = (path) => JSON.parse(read(path));
const tracked = new Set(
  execFileSync('git', ['ls-files', '-z', '--', '*.md', '*.mdx'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean),
);
const activeAnalysis = [
  'analysis/react-native-layer/ADR-001-Compatibility-and-Platform-Dispositions.md',
  'analysis/react-native-layer/React Native Compatibility Matrix.md',
  'analysis/react-native-layer/React Native Layer Implementation Progress.md',
];
const canonical = [
  'README.md',
  'packages/foundations/README.md',
  'packages/react-native/README.md',
  'docs/design-philosophy.md',
  'docs/react-native-setup.md',
  'docs/react-native-accessibility.md',
  'docs/authoring-react-native-components.md',
  'docs/native-token-conformance.md',
  'docs/workspace-structure.md',
  'docs/package-dependencies.md',
  'playground/react-native-storybook/README.md',
  'test/consumer/react-native-package/README.md',
  ...activeAnalysis,
];

const excludedCurrentScope = (path) =>
  path.includes('/versioned/') ||
  path.includes('/archive/') ||
  path.includes('/plans/') ||
  path.includes('/research/') ||
  path.endsWith('CHANGELOG.md') ||
  (path.startsWith('analysis/') && !activeAnalysis.includes(path));

const currentText = [...tracked]
  .filter((path) => !excludedCurrentScope(path))
  .map((path) => read(path))
  .join('\n');

test('keeps every canonical native document tracked and current-scope analysis explicit', () => {
  for (const path of canonical) {
    assert.ok(tracked.has(path), `${path} must be tracked.`);
  }
  assert.equal(activeAnalysis.length, 3);
  const artifactRfc = read('analysis/react-native-layer/Artifact V2 RFC.md');
  assert.match(artifactRfc, /standalone proposal/u);
  assert.match(artifactRfc, /not a requirement/u);
});

test('derives and documents distinct lifecycle, disposition, implementation, and story counts', () => {
  const manifest = readJson('packages/react-native/package.json');
  const inventory = readJson(
    'registry/platforms/react-native-implementations.json',
  ).implementations;
  const registry = readJson('registry/platforms/react-native.json');
  const controls = readJson('registry/platforms/react-native-story-controls.json');
  const storyRoot = join(ROOT, 'playground/react-native-storybook/src/components');
  const storyFiles = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(path);
      } else if (entry.name.endsWith('.stories.tsx')) {
        storyFiles.push(path);
      }
    }
  };
  visit(storyRoot);

  assert.equal(inventory.length, 40);
  assert.equal(Object.keys(manifest.exports).length, 42);
  assert.deepEqual(registry.counts, {
    total: 133,
    webStable: 112,
    completed: 114,
    proposed: 19,
    implementations: 40,
  });
  assert.equal(Object.keys(controls).length, 40);
  assert.equal(storyFiles.length, 40);
  assert.equal(
    storyFiles.reduce(
      (count, path) =>
        count +
        (readFileSync(path, 'utf8').match(/export const (?:Playground|AllVariations)/gu)?.length ??
          0),
      0,
    ),
    80,
  );

  const progress = read(activeAnalysis[2]).replaceAll(/\s+/gu, ' ');
  assert.match(progress, /133 native dispositions: 114 completed and 19 proposed/u);
  assert.match(progress, /112 stable records/u);
  assert.match(progress, /40 canonical implementation records/u);
  assert.match(progress, /40 controlled Playground stories, 40 All Variations/u);
  assert.match(
    read('packages/react-native/README.md'),
    /40 experimental component implementations/u,
  );
  assert.match(
    read('test/consumer/react-native-package/README.md'),
    /all 40 implementation subpaths/u,
  );
});

test('rejects contradictory current native package, runtime, release, and RadioField claims', () => {
  for (const pattern of [
    /(?:npm|pnpm)\s+(?:install|add)[^`\n]*@tale-ui\/(?:react-native|foundations)/iu,
    /@tale-ui\/react-native.{0,80}\bplanned\b/iu,
    /\bplanned\b.{0,80}@tale-ui\/react-native/iu,
    /@tale-ui\/react-native\/radio-field/iu,
    /plain React Native.{0,120}(?:executes|runs|verifies).{0,40}Hermes/iu,
    /Hermes.{0,80}(?:executes|runs|verifies).{0,80}plain React Native/iu,
    /Tale UI (?:is|as) (?:a )?runtime application framework/iu,
    /@tale-ui\/(?:react-native|foundations).{0,100}(?:published to npm|publicly available)/iu,
    /publication workflow.{0,120}(?:publishes|includes).{0,80}@tale-ui\/(?:react-native|foundations)/iu,
  ]) {
    assert.doesNotMatch(currentText, pattern);
  }

  const nativeReadme = read('packages/react-native/README.md').replaceAll(/\s+/gu, ' ');
  assert.match(nativeReadme, /RadioField.*intentionally absent/su);
  assert.match(nativeReadme, /only renamed `RadioGroup`/u);
  assert.match(nativeReadme, /metadata-only compatibility fields/u);
  assert.match(nativeReadme, /subscribes to the device colour scheme/u);
  assert.match(read('README.md'), /current publication workflow does not publish either package/u);
  assert.doesNotMatch(currentText, /@tale-ui\/foundations.{0,100}registry (?:404|absence)/iu);
});

test('keeps the manual promotion checklist private, post-merge, and non-overriding', () => {
  const accessibility = read('docs/react-native-accessibility.md').replaceAll(/\s+/gu, ' ');
  for (const phrase of [
    'documentation-only checklist',
    'manually by humans after merge',
    'cannot satisfy, override, repair, or rewrite a failed PR check',
    'serial numbers',
    'UDIDs',
    'Android IDs',
    'advertising identifiers',
    'personal or account data',
    'credentials',
    'secrets',
    'VoiceOver',
    'TalkBack',
    'Dialog, AlertDialog, and Drawer',
    'Dynamic Type',
    'RTL',
    'reduced-motion',
    'frame-time',
    'memory behavior',
    'failed, unavailable, or untested',
    'experimental and release-blocked',
  ]) {
    assert.ok(accessibility.includes(phrase), `Accessibility checklist lacks "${phrase}".`);
  }
});

test('matches the current publication workflow and schema-1 native authorities', () => {
  const publication = read('.github/workflows/publish.yml');
  assert.doesNotMatch(publication, /@tale-ui\/foundations/u);
  assert.doesNotMatch(publication, /@tale-ui\/react-native/u);
  for (const path of [
    'registry/platforms/react-native-implementations.json',
    'registry/platforms/react-native-disposition-overrides.json',
    'registry/platforms/react-native.json',
  ]) {
    assert.equal(readJson(path).schemaVersion, '1.0.0');
  }
  assert.doesNotMatch(currentText, /schema 2|schemaVersion["`: ]+2/iu);
});
