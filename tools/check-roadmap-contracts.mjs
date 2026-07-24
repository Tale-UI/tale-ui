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

function sourceRevision(paths) {
  const preimage = paths.map((path) => `${path}\0${text(path)}`).join('\0');
  return `sha256:${createHash('sha256').update(preimage).digest('hex')}`;
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

function isValid(schemaPath, value) {
  const localAjv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(localAjv);
  return localAjv.compile(json(schemaPath))(value);
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
assert.deepEqual(
  artifactRegistry.generatedFrom,
  artifactRegistry.generatedFrom.toSorted(),
  'Artifact source paths must be canonically sorted',
);
assert.equal(
  artifactRegistry.sourceRevision,
  sourceRevision(artifactRegistry.generatedFrom),
  'Artifact source revision must match the canonical source preimage',
);
for (const path of artifactRegistry.generatedFrom) {
  assert.ok(existsSync(join(ROOT, path)), `Artifact registry source is missing: ${path}`);
}
assert.deepEqual(
  Object.keys(artifactRegistry.packageVersions),
  Object.keys(artifactRegistry.packageVersions).toSorted(),
  'Package-version keys must be canonically sorted',
);
assert.equal(
  capabilityRegistry.registryVersion,
  artifactRegistry.registryVersion,
  'Artifact and capability registry versions must correlate',
);
assert.equal(
  artifactRegistry.capabilityManifestId,
  capabilityRegistry.manifestId,
  'Artifact registry must reference the generated capability manifest',
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
assert.deepEqual(
  artifacts.map((artifact) => artifact.id),
  artifacts.map((artifact) => artifact.id).toSorted(),
  'Artifacts must be canonically ordered by stable ID',
);
const byKind = (kind) =>
  artifacts.filter((artifact) => artifact.kind === kind).map((artifact) => artifact.slug);
const chartSlugs = Object.keys(json('packages/charts/package.json').exports)
  .filter((exportPath) => /^\.\/[a-z0-9-]+-chart$/.test(exportPath))
  .map((exportPath) => exportPath.slice(2));

assert.deepEqual(
  new Set(byKind('component')),
  new Set([
    ...json('registry/components.json').components.map((component) => component.slug),
    ...chartSlugs,
  ]),
  'Unified component source set differs from the React registry and chart exports',
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

const capabilityIds = new Set(capabilityRegistry.capabilities.map((capability) => capability.id));
assert.equal(
  capabilityIds.size,
  capabilityRegistry.capabilities.length,
  'Generated capability IDs must be unique',
);
const capabilitySource = json('registry/sources/capabilities.json');
assert.equal(
  new Set(capabilitySource.capabilities.map((capability) => capability.id)).size,
  capabilitySource.capabilities.length,
  'Source capability IDs must be unique',
);
assert.deepEqual(
  capabilityRegistry.capabilities,
  capabilitySource.capabilities
    .map((capability) => ({
      ...capability,
      availability: capability.availability.toSorted(),
      status: capability.status || 'available',
    }))
    .toSorted((a, b) => a.id.localeCompare(b.id)),
  'Generated capabilities must exactly match their normalized source records',
);
for (const capability of capabilityRegistry.capabilities) {
  assert.deepEqual(
    capability.availability,
    capability.availability.toSorted(),
    `${capability.id} availability must be canonically sorted`,
  );
}
for (const artifact of artifacts) {
  assert.equal(
    artifact.id,
    `${artifact.namespace}:${artifact.kind}:${artifact.slug}`,
    `${artifact.id} fields must reproduce its stable ID`,
  );
  for (const key of ['aliases', 'keywords', 'related', 'capabilities', 'platforms', 'locales']) {
    if (artifact[key]) {
      assert.deepEqual(
        artifact[key],
        artifact[key].toSorted(),
        `${artifact.id} ${key} must be canonically sorted`,
      );
    }
  }
  if (artifact.package) {
    assert.equal(
      artifact.version,
      artifactRegistry.packageVersions[artifact.package],
      `${artifact.id} version must match its correlated package version`,
    );
  } else {
    assert.equal(
      'version' in artifact,
      false,
      `${artifact.id} must not declare a version without a package`,
    );
  }
  for (const capability of artifact.capabilities) {
    assert.ok(
      capabilityIds.has(capability),
      `${artifact.id} references unknown capability ${capability}`,
    );
  }
}

const componentRegistry = json('registry/components.json');
const sharedPitfallCount = [
  ...json('registry/pitfalls.json').generalConventions,
  ...json('registry/pitfalls.json').crossComponentPitfalls,
].length;
const componentPitfallCount = componentRegistry.components.reduce(
  (count, component) => count + (component.pitfalls?.length || 0),
  0,
);
assert.equal(
  byKind('pitfall').length,
  sharedPitfallCount + componentPitfallCount,
  'Unified pitfalls must include shared and component-specific guidance',
);

const artifactById = new Map(artifacts.map((artifact) => [artifact.id, artifact]));
for (const artifact of artifacts) {
  if (artifact.replacementId) {
    const replacement = artifactById.get(artifact.replacementId);
    assert.notEqual(replacement?.id, artifact.id, `${artifact.id} must not replace itself`);
    assert.equal(
      replacement?.kind,
      artifact.kind,
      `${artifact.id} replacement must have the same artifact kind`,
    );
  }
}
assert.ok(
  artifactById
    .get('tale:pitfall:card--card-button-selected-controlled')
    .related.includes('tale:component:card'),
  'Component-specific pitfalls must relate to their component root',
);
assert.ok(
  artifactById.get('tale:a2ui-type:card').related.includes('tale:component:card'),
  'Namespaced A2UI component references must relate to their component root',
);
for (const [legacyId, replacementId] of [
  ['tale:a2ui-type:checkbox', 'tale:a2ui-type:checkbox-field'],
  ['tale:a2ui-type:radio', 'tale:a2ui-type:radio-field'],
  ['tale:a2ui-type:radio-option', 'tale:a2ui-type:radio-field-option'],
  ['tale:a2ui-type:switch', 'tale:a2ui-type:switch-field'],
]) {
  assert.equal(artifactById.get(legacyId).lifecycle, 'deprecated');
  assert.equal(artifactById.get(legacyId).replacementId, replacementId);
}

const portablePathPatterns = [
  json('schemas/operation.schema.json').properties.plannedPostimages.items.properties.path.pattern,
  json('schemas/composition.schema.json').properties.targets.items.pattern,
  json('schemas/dry-run.schema.json').properties.files.items.properties.path.pattern,
  json('schemas/validation-request.schema.json').properties.file.pattern,
  json('schemas/validation-result.schema.json').properties.diagnostics.items.properties.path
    .pattern,
];
assert.equal(
  new Set(portablePathPatterns).size,
  1,
  'All root-confined path schemas must share one portable relative-path contract',
);
const portablePath = new RegExp(portablePathPatterns[0]);
for (const path of [
  '../outside',
  '..\\outside',
  'src/../../outside',
  'src\\..\\..\\outside',
  '/outside',
  '\\\\server\\share',
  'C:\\outside',
  'C:/outside',
  'C:outside',
]) {
  assert.equal(portablePath.test(path), false, `Unsafe path passed schema pattern: ${path}`);
}
for (const path of ['src/file.tsx', 'src\\file.tsx', 'app/routes/settings.tsx']) {
  assert.equal(portablePath.test(path), true, `Safe relative path failed schema pattern: ${path}`);
}

validate(
  'schemas/error-envelope.schema.json',
  {
    ok: true,
    command: 'manifest',
    requestId: 'request-1',
    versions: {
      contract: '1.0.0',
      registry: artifactRegistry.registryVersion,
      capabilityManifest: capabilityRegistry.schemaVersion,
      packages: artifactRegistry.packageVersions,
    },
    capabilities: capabilityRegistry.capabilities
      .filter((capability) => capability.status === 'available')
      .map((capability) => capability.id),
    data: { releaseChannel: artifactRegistry.releaseChannel },
    warnings: [],
  },
  'success envelope fixture',
);
assert.equal(
  isValid('schemas/error-envelope.schema.json', {
    ok: true,
    command: 'manifest',
    requestId: 'request-1',
    versions: {
      contract: '1.0.0',
      registry: artifactRegistry.registryVersion,
      packages: artifactRegistry.packageVersions,
    },
    capabilities: [],
    data: {},
    warnings: [],
  }),
  false,
  'Success envelopes must include every correlated version field',
);

validate(
  'schemas/error-envelope.schema.json',
  {
    ok: false,
    command: 'search',
    requestId: 'request-1',
    error: {
      code: 'TALE_INVALID_ARGUMENT',
      message: 'Deprecated code fixture',
      details: {},
      retryable: false,
      documentation: 'https://tale-ui.dev/errors/TALE_INVALID_ARGUMENT',
      deprecatedIn: '2.0.0',
      replacementCode: 'TALE_UNSUPPORTED_COMMAND',
    },
  },
  'deprecated error fixture',
);

const declaredErrorCodes = [
  ...text('packages/tooling/src/contracts/errors.ts').matchAll(/^\s+(TALE_[A-Z0-9_]+):\s*\d+,?$/gm),
].map((match) => match[1]);
const schemaErrorCodes = json('schemas/error-envelope.schema.json').$defs.errorCode.enum;
assert.deepEqual(
  declaredErrorCodes.toSorted(),
  schemaErrorCodes.toSorted(),
  'Error envelope codes must exactly match the tooling registry',
);
assert.equal(
  isValid('schemas/error-envelope.schema.json', {
    ok: false,
    command: 'search',
    requestId: 'request-2',
    error: {
      code: 'TALE_INVALID_ARGUMNET',
      message: 'Typo fixture',
      details: {},
      retryable: false,
      documentation: 'https://tale-ui.dev/errors/TALE_INVALID_ARGUMNET',
    },
  }),
  false,
  'Error envelopes must reject undeclared TALE_* codes',
);

const digestFixture = `sha256:${'0'.repeat(64)}`;
const dryRunFixture = {
  schemaVersion: '1.0.0',
  requestId: 'request-1',
  planDigest: digestFixture,
  files: [
    {
      path: 'src/example.tsx',
      action: 'update',
      postimageDigest: digestFixture,
      postimageSize: 42,
    },
  ],
  warnings: [],
};
assert.equal(isValid('schemas/dry-run.schema.json', dryRunFixture), true);
assert.equal(
  isValid('schemas/dry-run.schema.json', {
    ...dryRunFixture,
    files: [{ ...dryRunFixture.files[0], content: 'unreviewed postimage' }],
  }),
  false,
  'Dry-run file entries must reject undeclared fields',
);

const dispositionInventories = {
  table: INVENTORIES['analysis/table-plugins/inventory.json'],
  'app-shell': INVENTORIES['analysis/app-shell/inventory.json'],
  chat: INVENTORIES['analysis/chat/inventory.json'],
  content: INVENTORIES['analysis/content/inventory.json'],
};
for (const [inventory, candidates] of Object.entries(dispositionInventories)) {
  const dispositionFixture = {
    schemaVersion: '1.0.0',
    inventory,
    evidenceRevision: 'fixture',
    records: candidates.map((candidate) => ({
      candidate,
      disposition: 'defer',
      rationale: 'Fixture evidence',
      evidenceDigest: digestFixture,
    })),
  };
  assert.equal(
    isValid('schemas/candidate-disposition.schema.json', dispositionFixture),
    true,
    `${inventory} disposition fixture must be valid`,
  );
  assert.equal(
    isValid('schemas/candidate-disposition.schema.json', {
      ...dispositionFixture,
      records: [],
    }),
    false,
    `${inventory} dispositions must reject empty records`,
  );
  assert.equal(
    isValid('schemas/candidate-disposition.schema.json', {
      ...dispositionFixture,
      records: dispositionFixture.records.map((record, index) =>
        index === 1 ? { ...record, candidate: candidates[0] } : record,
      ),
    }),
    false,
    `${inventory} dispositions must reject duplicate candidates`,
  );
  assert.equal(
    isValid('schemas/candidate-disposition.schema.json', {
      ...dispositionFixture,
      records: dispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, candidate: 'unknown candidate' } : record,
      ),
    }),
    false,
    `${inventory} dispositions must reject unknown candidates`,
  );
}

const operationFixture = {
  schemaVersion: '1.0.0',
  operationId: 'operation-1',
  operation: 'generate',
  rootDigest: digestFixture,
  idempotencyDigest: digestFixture,
  payloadDigest: digestFixture,
  state: 'reserved',
  plannedPostimages: [{ path: 'src/example.tsx', digest: digestFixture, size: 42 }],
};
assert.equal(isValid('schemas/operation.schema.json', operationFixture), true);
assert.equal(
  isValid('schemas/operation.schema.json', {
    ...operationFixture,
    plannedPostimages: [{ ...operationFixture.plannedPostimages[0], content: 'private' }],
  }),
  false,
  'Operation postimages must reject undeclared fields',
);

const rankingCandidates = INVENTORIES['analysis/table-plugins/inventory.json'];
const rankingFixture = {
  schemaVersion: '1.0.0',
  evidenceRevision: 'fixture',
  records: rankingCandidates.map((candidate, index) => ({
    candidate,
    demandEvidence: ['fixture'],
    reactAriaCompatibility: 'fixture',
    accessibilityRisks: [],
    stateModel: 'fixture',
    ssrHydration: 'fixture',
    performance: { rows1k: 'fixture', rows10k: 'fixture' },
    cost: {
      implementation: 'fixture',
      migration: 'fixture',
      maintenance: 'fixture',
    },
    disposition: 'defer',
    rank: index + 1,
    evidenceDigest: digestFixture,
  })),
};
assert.equal(isValid('schemas/table-ranking.schema.json', rankingFixture), true);
assert.equal(
  isValid('schemas/table-ranking.schema.json', {
    ...rankingFixture,
    records: rankingFixture.records.map((record, index) =>
      index === 1 ? { ...record, candidate: rankingCandidates[0] } : record,
    ),
  }),
  false,
  'Table rankings must contain each frozen candidate exactly once',
);
assert.equal(
  isValid('schemas/table-ranking.schema.json', {
    ...rankingFixture,
    records: rankingFixture.records.map((record, index) =>
      index === 1 ? { ...record, rank: 1 } : record,
    ),
  }),
  false,
  'Table rankings must contain every rank exactly once',
);
assert.equal(
  isValid('schemas/table-ranking.schema.json', {
    ...rankingFixture,
    records: rankingFixture.records.map((record, index) =>
      index === 0
        ? {
            ...record,
            cost: { implementation: 'fixture', maintenance: 'fixture' },
          }
        : record,
    ),
  }),
  false,
  'Table rankings must include implementation, migration, and maintenance costs',
);

const templateFixture = {
  schemaVersion: '1.0.0',
  id: 'tale:template:dashboard',
  version: '1.0.0',
  source: 'source/dashboard',
  skeleton: 'skeleton/dashboard',
  dependencies: {},
  preview: {},
  golden: 'golden/dashboard.tsx',
  compatibility: {},
  appearance: ['light', 'dark'],
  rtl: true,
  provenance: {},
  license: 'MIT',
  digest: digestFixture,
};
assert.equal(isValid('schemas/template.schema.json', templateFixture), true);
assert.equal(
  isValid('schemas/template.schema.json', { ...templateFixture, appearance: ['light'] }),
  false,
  'Templates must declare both supported appearances',
);
for (const [field, unsafePath] of [
  ['source', 'source/../../outside'],
  ['source', 'source/nested\\..\\outside'],
  ['skeleton', 'skeleton/../../../secret'],
  ['skeleton', 'skeleton/nested/../secret'],
]) {
  assert.equal(
    isValid('schemas/template.schema.json', { ...templateFixture, [field]: unsafePath }),
    false,
    `Templates must reject traversal in ${field}: ${unsafePath}`,
  );
}

const migrationFixture = {
  schemaVersion: '1.0.0',
  id: 'migration.1',
  order: 1,
  from: '1.0.0',
  to: '2.0.0',
  transforms: [{ kind: 'typescript', path: 'migrations/example.ts' }],
  affectedArtifacts: ['tale:component:button'],
  reversible: true,
  backupPolicy: 'required',
  idempotent: true,
  checksum: digestFixture,
};
assert.equal(isValid('schemas/migration.schema.json', migrationFixture), true);
const { backupPolicy: omittedBackupPolicy, ...migrationWithoutBackupPolicy } = migrationFixture;
assert.equal(omittedBackupPolicy, 'required');
assert.equal(
  isValid('schemas/migration.schema.json', migrationWithoutBackupPolicy),
  false,
  'Migrations must declare a backup policy',
);

const validationFileFixture = {
  schemaVersion: '1.0.0',
  requestId: 'request-1',
  root: '/project',
  file: 'src/example.tsx',
  timeoutMs: 1000,
};
assert.equal(isValid('schemas/validation-request.schema.json', validationFileFixture), true);
assert.equal(
  isValid('schemas/validation-request.schema.json', {
    ...validationFileFixture,
    virtualFile: 'src/virtual.tsx',
  }),
  false,
  'File validation mode must reject virtual-file fields',
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
