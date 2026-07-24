#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const INVENTORIES = {
  'analysis/table-plugins/inventory.json': [
    'selection',
    'sorting',
    'pagination',
    'filtering',
    'column visibility/settings',
    'column resize',
    'sticky columns',
    'row expansion',
    'grouped/tree rows',
    'virtualization',
  ],
  'analysis/app-shell/inventory.json': [
    'root',
    'header',
    'sidebar',
    'main',
    'secondary panel',
    'mobile navigation',
    'skip link',
    'resizable-region adapter',
  ],
  'analysis/chat/inventory.json': [
    'ChatLayout',
    'MessageList',
    'Message',
    'MessageBubble',
    'MessageMetadata',
    'SystemMessage',
    'Composer',
    'ToolCall',
    'streaming-text utility',
  ],
  'analysis/content/inventory.json': [
    'Kbd',
    'Timestamp',
    'Blockquote',
    'Citation',
    'CodeBlock',
    'MetadataList',
  ],
  'analysis/extensions/inventory.json': [
    'components-and-docs',
    'recipes-and-templates',
    'validations-and-pitfalls',
    'codemods',
    'a2ui-types',
  ],
};

function text(path) {
  return readFileSync(join(ROOT, path), 'utf8');
}

function json(path) {
  return JSON.parse(text(path));
}

function digest(value) {
  return `sha256:${createHash('sha256')
    .update(`${JSON.stringify(value, null, 2)}\n`)
    .digest('hex')}`;
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const schemaFiles = readdirSync(join(ROOT, 'schemas'))
  .filter((name) => name.endsWith('.schema.json'))
  .sort();
for (const name of schemaFiles) {
  const schema = json(`schemas/${name}`);
  try {
    ajv.compile(schema);
  } catch (error) {
    throw new Error(`Invalid JSON Schema schemas/${name}: ${error.message}`);
  }
}

function validate(schemaPath, value, valuePath) {
  const localAjv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(localAjv);
  const validator = localAjv.compile(json(schemaPath));
  if (!validator(value)) {
    throw new Error(
      `${valuePath} does not satisfy ${schemaPath}:\n${localAjv.errorsText(validator.errors, {
        separator: '\n',
      })}`,
    );
  }
}

validate(
  'schemas/artifact.schema.json',
  json('registry/artifacts.json'),
  'registry/artifacts.json',
);
validate(
  'schemas/capability.schema.json',
  json('registry/capabilities.json'),
  'registry/capabilities.json',
);
validate(
  'schemas/roadmap-traceability.schema.json',
  json('registry/roadmap-traceability.json'),
  'registry/roadmap-traceability.json',
);

const artifactRegistry = json('registry/artifacts.json');
const { digest: artifactDigest, ...artifactPreimage } = artifactRegistry;
assert.equal(
  artifactDigest,
  digest(artifactPreimage),
  'registry/artifacts.json digest does not match its canonical preimage',
);
const capabilityRegistry = json('registry/capabilities.json');
const { digest: capabilityDigest, ...capabilityPreimage } = capabilityRegistry;
assert.equal(
  capabilityDigest,
  digest(capabilityPreimage),
  'registry/capabilities.json digest does not match its canonical preimage',
);

for (const [path, expected] of Object.entries(INVENTORIES)) {
  const inventory = json(path);
  validate('schemas/candidate-inventory.schema.json', inventory, path);
  assert.ok(
    existsSync(join(ROOT, inventory.source.split('#')[0])),
    `${path} references a missing canonical source`,
  );
  assert.deepEqual(
    new Set(inventory.candidates),
    new Set(expected),
    `${path} must preserve the exact roadmap candidate set`,
  );
  assert.equal(inventory.candidates.length, expected.length, `${path} must not contain duplicates`);
}

const artifacts = artifactRegistry.artifacts;
const byKind = (kind) =>
  artifacts.filter((artifact) => artifact.kind === kind).map((artifact) => artifact.slug);

assert.deepEqual(
  new Set(byKind('component')),
  new Set(json('registry/components.json').components.map((component) => component.slug)),
  'Unified component source set differs from registry/components.json',
);
assert.deepEqual(
  new Set(byKind('recipe')),
  new Set(
    readdirSync(join(ROOT, 'docs/recipes'))
      .filter((name) => name.endsWith('.md') && name !== 'index.md')
      .map((name) => name.replace(/\.md$/, '')),
  ),
  'Unified recipe source set differs from docs/recipes',
);
assert.deepEqual(
  new Set(byKind('foundation')),
  new Set(json('registry/sources/foundations.json').foundations.map((entry) => entry.slug)),
  'Unified foundation source set differs from its source manifest',
);
assert.deepEqual(
  new Set(byKind('a2ui-type')),
  new Set(
    json('registry/a2ui-catalog.json').types.map((entry) =>
      entry.name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-'),
    ),
  ),
  'Unified A2UI type source set differs from registry/a2ui-catalog.json',
);

const a2uiCatalog = json('registry/a2ui-catalog.json');
assert.equal(
  'generatedAt' in a2uiCatalog,
  false,
  'A2UI catalog must not contain wall-clock-derived metadata',
);

const traceability = json('registry/roadmap-traceability.json');
const traceIds = traceability.criteria.map((criterion) => criterion.id);
assert.equal(new Set(traceIds).size, traceIds.length, 'Traceability IDs must be unique');
assert.ok(traceIds.includes('R01.1') && traceIds.includes('R17.2'));
assert.deepEqual(
  traceIds.filter((id) => id.startsWith('SM')),
  ['SM01', 'SM02', 'SM03', 'SM04', 'SM05', 'SM06', 'SM07', 'SM08'],
);

console.log(
  `OK: ${schemaFiles.length} schemas, ${Object.keys(INVENTORIES).length} frozen inventories, ` +
    `${artifacts.length} artifacts, ${traceIds.length} traceability criteria`,
);
