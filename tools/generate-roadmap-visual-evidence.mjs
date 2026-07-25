#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const OUTPUT = 'registry/reports/roadmap-visuals.json';
const SNAPSHOT_ROOT = 'test/visual/snapshots/roadmap.spec.ts';
const templateIds = [
  'app-header',
  'chart-dashboard',
  'chat-artifact-panel',
  'chat-mobile',
  'command-palette-dashboard',
  'empty-state',
  'loading-patterns',
  'react-hook-form',
  'settings-page',
  'sidebar-header',
  'sortable-table',
  'validated-form',
];

function digest(path) {
  return `sha256:${createHash('sha256')
    .update(readFileSync(join(ROOT, path)))
    .digest('hex')}`;
}

const definitions = templateIds.flatMap((id) =>
  ['light', 'dark'].map((appearance) => ({
    id: `${id}-${appearance}`,
    criterion: 'R03.5',
    source: `packages/tooling/templates/${id}/source/App.tsx`,
    snapshot: `${SNAPSHOT_ROOT}/${id}-${appearance}.png`,
  })),
);
for (const [id, criterion, source] of [
  [
    'components-i18nprovider--pseudo-locale',
    'R07.2',
    'playground/storybook/src/stories/I18nProvider.stories.tsx',
  ],
  [
    'components-i18nprovider--forced-rtl',
    'R07.2',
    'playground/storybook/src/stories/I18nProvider.stories.tsx',
  ],
  [
    'foundations-motion-and-elevation--transition-matrix',
    'R10.2',
    'playground/storybook/src/stories/MotionElevation.stories.tsx',
  ],
  [
    'foundations-motion-and-elevation--elevation-hierarchy',
    'R10.2',
    'playground/storybook/src/stories/MotionElevation.stories.tsx',
  ],
]) {
  definitions.push({
    id,
    criterion,
    source,
    snapshot: `${SNAPSHOT_ROOT}/${id}.png`,
  });
}

const report = {
  schemaVersion: '1.0.0',
  runner: 'test/visual/roadmap.spec.ts',
  records: definitions.map((record) => ({
    ...record,
    sourceDigest: digest(record.source),
    snapshotDigest: digest(record.snapshot),
  })),
};
const schema = JSON.parse(
  readFileSync(join(ROOT, 'schemas/roadmap-visual-evidence.schema.json'), 'utf8'),
);
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
if (!validate(report)) {
  throw new Error(
    `Roadmap visual evidence is invalid:\n${validate.errors
      .map(({ instancePath, message }) => `${instancePath} ${message}`)
      .join('\n')}`,
  );
}
const rendered = `${JSON.stringify(report, null, 2)}\n`;
if (CHECK) {
  if (readFileSync(join(ROOT, OUTPUT), 'utf8') !== rendered) {
    throw new Error(
      `${OUTPUT} is stale; recapture changed visuals and run pnpm roadmap:visuals:generate.`,
    );
  }
  console.log('OK: 28 source-correlated roadmap visual snapshots');
} else {
  writeFileSync(join(ROOT, OUTPUT), rendered);
  console.log('Generated 28 source-correlated roadmap visual snapshots.');
}
