#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { compareCanonicalStrings, computeArtifactSourceRevision } from './artifact-canonical.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const INVENTORIES = {
  'registry/sources/roadmap/table-plugins/inventory.json': [
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
  'registry/sources/roadmap/app-shell/inventory.json': [
    'root',
    'header',
    'sidebar',
    'main',
    'secondary panel',
    'mobile navigation',
    'skip link',
    'resizable-region adapter',
  ],
  'registry/sources/roadmap/chat/inventory.json': [
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
  'registry/sources/roadmap/content/inventory.json': [
    'Kbd',
    'Timestamp',
    'Blockquote',
    'Citation',
    'CodeBlock',
    'MetadataList',
  ],
  'registry/sources/roadmap/extensions/inventory.json': [
    'components-and-docs',
    'recipes-and-templates',
    'validations-and-pitfalls',
    'codemods',
    'a2ui-types',
  ],
  'registry/sources/roadmap/component-equivalence/inventory.json': [
    'AspectRatio',
    'Blockquote',
    'ButtonGroup',
    'Citation',
    'Code',
    'Lightbox',
    'Markdown',
    'Outline',
    'OverflowList',
    'Resizable',
    'Skeleton',
    'Timestamp',
    'Toast',
  ],
};

const COMPONENT_EQUIVALENCE_SOURCE =
  'docs/plans/component-equivalence-expansion-implementation-plan.md';
const COMPONENT_EQUIVALENCE_INVENTORY_PATH =
  'registry/sources/roadmap/component-equivalence/inventory.json';
const COMPONENT_EQUIVALENCE_DISPOSITIONS_PATH =
  'registry/sources/roadmap/component-equivalence/candidate-dispositions.json';
const COMPONENT_EQUIVALENCE_CANDIDATES = INVENTORIES[COMPONENT_EQUIVALENCE_INVENTORY_PATH];
const COMPONENT_EQUIVALENCE_A2UI_RATIONALES = {
  AspectRatio: 'No A2UI publication is authorized.',
  Blockquote: 'No A2UI publication is authorized.',
  ButtonGroup: 'No A2UI publication is authorized.',
  Citation: 'Trust and document identity are outside the current catalog.',
  Code: 'No A2UI publication is authorized.',
  Lightbox: 'Overlay, focus, and selection state are outside the current catalog.',
  Markdown: 'Untrusted parsing is outside the current catalog.',
  Outline: 'Document identity and observers are outside the current catalog.',
  OverflowList: 'Layout measurement and focus routing are outside the current catalog.',
  Resizable: 'Gesture and state callbacks are outside the current catalog.',
  Skeleton: 'No A2UI publication is authorized.',
  Timestamp: 'Locale, timezone, and clock ownership are outside the current catalog.',
  Toast: 'Queues, timers, announcements, and leases are outside the current catalog.',
};
const SUPPORTED_PACKAGE_DECLARATION_REFERENCES = new Set([
  'package:react-aria-components@1.19.0#Group',
  'package:react-aria-components@1.19.0#UNSTABLE_Toast',
  'package:react-aria-components@1.19.0#UNSTABLE_ToastRegion',
  'package:react-aria@3.50.0#useMove',
]);

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

function assertEvidenceDigests(records, label) {
  for (const record of records) {
    const { evidenceDigest, ...evidencePreimage } = record;
    assert.equal(
      evidenceDigest,
      digest(evidencePreimage),
      `${label} evidence digest is stale for ${record.candidate}`,
    );
  }
}

function assertComponentEquivalenceContracts(inventory, dispositions, label) {
  assert.equal(
    inventory.source,
    COMPONENT_EQUIVALENCE_SOURCE,
    `${label} inventory must name the approved implementation plan`,
  );
  assert.equal(
    dispositions.source,
    COMPONENT_EQUIVALENCE_SOURCE,
    `${label} dispositions must name the approved implementation plan`,
  );
  assert.equal(
    dispositions.source,
    inventory.source,
    `${label} inventory and dispositions must name the same source`,
  );
  assert.deepEqual(
    inventory.candidates,
    COMPONENT_EQUIVALENCE_CANDIDATES,
    `${label} inventory must preserve the exact frozen candidate order`,
  );
  assert.equal(
    new Set(inventory.candidates).size,
    COMPONENT_EQUIVALENCE_CANDIDATES.length,
    `${label} inventory candidates must be unique`,
  );
  assert.deepEqual(
    dispositions.records.map(({ candidate }) => candidate),
    inventory.candidates,
    `${label} disposition candidates must exactly match inventory order`,
  );
  assert.equal(
    new Set(dispositions.records.map(({ candidate }) => candidate)).size,
    COMPONENT_EQUIVALENCE_CANDIDATES.length,
    `${label} disposition candidates must be unique`,
  );
  for (const record of dispositions.records) {
    assert.equal(
      record.disposition,
      'approve',
      `${label} implementation disposition must approve ${record.candidate}`,
    );
    assert.equal(
      record.a2uiDisposition,
      'n/a',
      `${label} A2UI disposition must be n/a for ${record.candidate}`,
    );
    assert.equal(
      record.rationale,
      COMPONENT_EQUIVALENCE_A2UI_RATIONALES[record.candidate],
      `${label} A2UI rationale changed for ${record.candidate}`,
    );
    for (const source of record.evidence.sources) {
      if (SUPPORTED_PACKAGE_DECLARATION_REFERENCES.has(source)) {
        continue;
      }
      assert.ok(
        existsSync(join(ROOT, source.split('#')[0])),
        `${label} evidence source is missing or unsupported for ${record.candidate}: ${source}`,
      );
    }
  }
  assertEvidenceDigests(dispositions.records, label);
  assert.equal(
    dispositions.evidenceRevision,
    digest(dispositions.records),
    `${label} evidence revision must match the complete record set`,
  );
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

const performanceBudgetPath = 'test/baselines/roadmap/performance-budgets.json';
const performanceBudget = json(performanceBudgetPath);
assert.equal(
  performanceBudget.$schema,
  '../../../schemas/performance-budget.schema.json',
  `${performanceBudgetPath} must reference the root schema from its canonical location`,
);
assert.ok(
  existsSync(resolve(dirname(join(ROOT, performanceBudgetPath)), performanceBudget.$schema)),
  `${performanceBudgetPath} references a missing relative JSON Schema`,
);
validate('schemas/performance-budget.schema.json', performanceBudget, performanceBudgetPath);

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
validate(
  'schemas/hook-source.schema.json',
  json('registry/sources/hooks.json'),
  'registry/sources/hooks.json',
);
validate(
  'schemas/i18n-catalog.schema.json',
  json('packages/react/src/i18n-provider/catalogs/en.json'),
  'packages/react/src/i18n-provider/catalogs/en.json',
);
const i18nCatalog = json('packages/react/src/i18n-provider/catalogs/en.json');
const i18nInventory = json('test/baselines/roadmap/i18n-message-inventory.json');
assert.deepEqual(
  Object.keys(i18nCatalog.messages).toSorted(compareCanonicalStrings),
  i18nInventory.messageIds.toSorted(compareCanonicalStrings),
  'The Tale-owned English message catalog must preserve the approved exact inventory',
);
assert.equal(
  i18nInventory.applicationCopy,
  'excluded',
  'The Tale message catalog must not absorb application copy',
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
  computeArtifactSourceRevision(artifactRegistry.generatedFrom, text),
  'Artifact source revision must match the canonical source preimage',
);
for (const path of artifactRegistry.generatedFrom) {
  assert.ok(existsSync(join(ROOT, path)), `Artifact registry source is missing: ${path}`);
}
assert.deepEqual(
  Object.keys(artifactRegistry.packageVersions),
  Object.keys(artifactRegistry.packageVersions).toSorted(compareCanonicalStrings),
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

const tableRankingPath = 'registry/sources/roadmap/table-plugins/ranking.json';
const tableRanking = json(tableRankingPath);
validate('schemas/table-ranking.schema.json', tableRanking, tableRankingPath);
assert.equal(
  tableRanking.status,
  'approved',
  'P0-D cannot exit until every Table candidate disposition and rank is approved',
);
const tableCandidates = INVENTORIES['registry/sources/roadmap/table-plugins/inventory.json'];
assert.deepEqual(
  tableRanking.records.map((record) => record.rank),
  Array.from({ length: tableCandidates.length }, (_, index) => index + 1),
  'Table ranking records must be ordered by rank',
);
assert.deepEqual(
  new Set(tableRanking.records.map((record) => record.candidate)),
  new Set(tableCandidates),
  'Table ranking must preserve the exact frozen candidate set',
);
assert.deepEqual(
  tableRanking.prototypeCandidates,
  ['selection', 'sorting'],
  'P0-D must prototype selection and sorting without substituting candidates',
);
const tableEvidenceSources = [
  ...new Set(
    tableRanking.records.flatMap((record) =>
      record.demandEvidence.map((evidence) => evidence.source.split('#')[0]),
    ),
  ),
].toSorted(compareCanonicalStrings);
for (const source of tableEvidenceSources) {
  assert.ok(existsSync(join(ROOT, source)), `Table ranking evidence source is missing: ${source}`);
}
assert.equal(
  tableRanking.evidenceRevision,
  digest(tableEvidenceSources.map((path) => ({ path, content: text(path) }))),
  'Table ranking evidence revision does not match its source preimage',
);
for (const record of tableRanking.records) {
  const { evidenceDigest, ...evidencePreimage } = record;
  assert.equal(
    evidenceDigest,
    digest(evidencePreimage),
    `Table ranking evidence digest is stale for ${record.candidate}`,
  );
}
assert.ok(
  existsSync(join(ROOT, 'docs/architecture/rfc-table-controller.md')),
  'Table controller RFC is required with the ranking',
);
assert.match(
  text('docs/architecture/rfc-table-controller.md'),
  /^- Status: Approved$/m,
  'The Table controller RFC must record its approved status',
);
assert.ok(
  existsSync(join(ROOT, 'packages/react/src/table/TableController.experimental.ts')),
  'Selection and sorting prototypes require the private controller source',
);
assert.ok(
  existsSync(join(ROOT, 'packages/react/src/table/TableController.experimental.test.tsx')),
  'Selection and sorting prototypes require controller fixtures',
);
const tableBenchmarkPath = 'test/baselines/roadmap/table-controller.json';
const tableBenchmark = json(tableBenchmarkPath);
validate('schemas/table-benchmark.schema.json', tableBenchmark, tableBenchmarkPath);
assert.equal(
  tableBenchmark.method.runtime,
  'packages/react/src/table/TableController.experimental.ts',
  'Table benchmark must exercise the private controller prototype',
);
assert.deepEqual(
  tableBenchmark.cases.map(({ operation, rowCount }) => [operation, rowCount]),
  [
    ['selection-clone', 1000],
    ['selection-clone', 10000],
    ['stable-sort', 1000],
    ['stable-sort', 10000],
  ],
  'Table benchmark must preserve the exact selection/sorting 1k/10k matrix',
);
for (const benchmarkCase of tableBenchmark.cases) {
  assert.equal(
    benchmarkCase.samplesMs.length,
    tableBenchmark.method.measuredIterations,
    `${benchmarkCase.name} must preserve every measured sample`,
  );
  const sortedSamples = benchmarkCase.samplesMs.toSorted((left, right) => left - right);
  assert.deepEqual(
    benchmarkCase.summaryMs,
    {
      minimum: sortedSamples[0],
      median: sortedSamples[Math.floor(sortedSamples.length / 2)],
      p95: sortedSamples[Math.ceil(sortedSamples.length * 0.95) - 1],
      maximum: sortedSamples.at(-1),
    },
    `${benchmarkCase.name} summary must match its samples`,
  );
}
const tableSortingBenchmarkPath = 'test/baselines/roadmap/table-sorting.json';
const tableSortingBenchmark = json(tableSortingBenchmarkPath);
validate(
  'schemas/table-sorting-benchmark.schema.json',
  tableSortingBenchmark,
  tableSortingBenchmarkPath,
);
assert.deepEqual(
  tableSortingBenchmark.cases.map(({ operation, rowCount }) => [operation, rowCount]),
  [
    ['stable-sort', 1000],
    ['stable-sort', 10000],
  ],
  'Stable Table sorting must preserve the exact 1k/10k benchmark matrix',
);
for (const benchmarkCase of tableSortingBenchmark.cases) {
  assert.equal(
    benchmarkCase.samplesMs.length,
    tableSortingBenchmark.method.measuredIterations,
    `${benchmarkCase.name} must preserve every measured sample`,
  );
  const sortedSamples = benchmarkCase.samplesMs.toSorted((left, right) => left - right);
  assert.deepEqual(
    benchmarkCase.summaryMs,
    {
      minimum: sortedSamples[0],
      median: sortedSamples[Math.floor(sortedSamples.length / 2)],
      p95: sortedSamples[Math.ceil(sortedSamples.length * 0.95) - 1],
      maximum: sortedSamples.at(-1),
    },
    `${benchmarkCase.name} summary must match its samples`,
  );
}
assert.ok(
  text('packages/react/src/table/index.ts').includes('useTableController'),
  'Rank-one Table sorting must export the stable controller',
);
assert.ok(
  existsSync(join(ROOT, 'packages/react/src/table/TableController.test.tsx')),
  'Stable Table sorting requires controller fixtures',
);
assert.ok(
  existsSync(join(ROOT, 'docs/architecture/rfc-table-sorting.md')),
  'Stable Table sorting requires its promotion and A2UI decision record',
);
assert.ok(
  existsSync(join(ROOT, 'tools/golden-prompts/table-controller-sorting.json')),
  'Stable Table sorting requires a golden prompt',
);

const artifacts = artifactRegistry.artifacts;
const tableControllerArtifact = artifacts.find(
  (artifact) => artifact.id === 'tale:hook:use-table-controller',
);
assert.equal(
  tableControllerArtifact?.package,
  '@tale-ui/react',
  'Stable Table sorting requires a public controller hook registry record',
);
assert.ok(
  tableControllerArtifact?.retrieval.some(
    (pointer) => pointer.type === 'package-export' && pointer.path === '@tale-ui/react/table',
  ),
  'Table controller hook must be retrievable from its public package export',
);
assert.deepEqual(
  artifacts.map((artifact) => artifact.id),
  artifacts.map((artifact) => artifact.id).toSorted(compareCanonicalStrings),
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
    .toSorted((a, b) => compareCanonicalStrings(a.id, b.id)),
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
const tableComponent = componentRegistry.components.find((component) => component.slug === 'table');
assert.ok(tableComponent, 'Table must remain in the component registry');
assert.deepEqual(
  tableComponent.props
    .map((prop) => prop.name)
    .filter((name) =>
      ['controller', 'tableProps', 'defaultSortDescriptor', 'onQueryChange'].includes(name),
    ),
  [],
  'Table controller spreads and hook options must not be misclassified as Table.Root props',
);
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
  table: INVENTORIES['registry/sources/roadmap/table-plugins/inventory.json'],
  'app-shell': INVENTORIES['registry/sources/roadmap/app-shell/inventory.json'],
  chat: INVENTORIES['registry/sources/roadmap/chat/inventory.json'],
  content: INVENTORIES['registry/sources/roadmap/content/inventory.json'],
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
      evidence: {
        sources: ['fixture'],
        repeatedTemplateEvidence: 'Fixture template evidence',
        ordinaryDataApi: 'Fixture ordinary-data boundary',
        accessibility: 'Fixture accessibility evidence',
        state: 'Fixture state evidence',
        streaming: 'Fixture streaming evidence',
        localization: 'Fixture localization evidence',
        security: 'Fixture security evidence',
        ssr: 'Fixture SSR evidence',
        performance: 'Fixture performance evidence',
        ownership: 'Fixture ownership evidence',
        migration: 'Fixture migration evidence',
      },
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

const componentEquivalenceInventoryFixture = {
  schemaVersion: '1.0.0',
  inventory: 'component-equivalence-expansion',
  source: COMPONENT_EQUIVALENCE_SOURCE,
  status: 'frozen',
  candidates: [...COMPONENT_EQUIVALENCE_CANDIDATES],
};
const componentEquivalenceDispositionFixture = {
  schemaVersion: '1.0.0',
  inventory: 'component-equivalence-expansion',
  source: COMPONENT_EQUIVALENCE_SOURCE,
  evidenceRevision: '',
  records: COMPONENT_EQUIVALENCE_CANDIDATES.map((candidate) => {
    const record = {
      candidate,
      disposition: 'approve',
      a2uiDisposition: 'n/a',
      rationale: COMPONENT_EQUIVALENCE_A2UI_RATIONALES[candidate],
      evidence: {
        sources: [COMPONENT_EQUIVALENCE_SOURCE],
        accessibility: 'Fixture accessibility evidence',
        state: 'Fixture state evidence',
        localization: 'Fixture localization evidence',
        security: 'Fixture security evidence',
        ssr: 'Fixture SSR evidence',
        performance: 'Fixture performance evidence',
        ownership: 'Fixture ownership evidence',
        migration: 'Fixture migration evidence',
      },
    };
    return { ...record, evidenceDigest: digest(record) };
  }),
};
componentEquivalenceDispositionFixture.evidenceRevision = digest(
  componentEquivalenceDispositionFixture.records,
);
assert.equal(
  isValid('schemas/candidate-inventory.schema.json', componentEquivalenceInventoryFixture),
  true,
  'The complete component-equivalence inventory fixture must be valid',
);
assert.equal(
  isValid('schemas/candidate-disposition.schema.json', componentEquivalenceDispositionFixture),
  true,
  'The complete component-equivalence disposition fixture must be valid',
);
assert.doesNotThrow(() =>
  assertComponentEquivalenceContracts(
    componentEquivalenceInventoryFixture,
    componentEquivalenceDispositionFixture,
    'component-equivalence positive fixture',
  ),
);

for (const [label, fixture] of [
  [
    'missing source',
    (({ source: omittedSource, ...rest }) => {
      assert.equal(omittedSource, COMPONENT_EQUIVALENCE_SOURCE);
      return rest;
    })(componentEquivalenceInventoryFixture),
  ],
  ['wrong source', { ...componentEquivalenceInventoryFixture, source: 'docs/wrong-plan.md' }],
  [
    'missing candidate',
    {
      ...componentEquivalenceInventoryFixture,
      candidates: componentEquivalenceInventoryFixture.candidates.slice(0, -1),
    },
  ],
  [
    'additional candidate',
    {
      ...componentEquivalenceInventoryFixture,
      candidates: [...componentEquivalenceInventoryFixture.candidates, 'Additional'],
    },
  ],
  [
    'duplicate candidate',
    {
      ...componentEquivalenceInventoryFixture,
      candidates: componentEquivalenceInventoryFixture.candidates.map((candidate, index) =>
        index === 1 ? componentEquivalenceInventoryFixture.candidates[0] : candidate,
      ),
    },
  ],
  [
    'reordered candidates',
    {
      ...componentEquivalenceInventoryFixture,
      candidates: [
        componentEquivalenceInventoryFixture.candidates[1],
        componentEquivalenceInventoryFixture.candidates[0],
        ...componentEquivalenceInventoryFixture.candidates.slice(2),
      ],
    },
  ],
  [
    'unknown candidate',
    {
      ...componentEquivalenceInventoryFixture,
      candidates: componentEquivalenceInventoryFixture.candidates.map((candidate, index) =>
        index === 0 ? 'Unknown' : candidate,
      ),
    },
  ],
  ['undeclared top-level field', { ...componentEquivalenceInventoryFixture, unreviewed: true }],
]) {
  assert.equal(
    isValid('schemas/candidate-inventory.schema.json', fixture),
    false,
    `The component-equivalence inventory must reject ${label}`,
  );
}

const withoutDispositionSource = (({ source: omittedSource, ...rest }) => {
  assert.equal(omittedSource, COMPONENT_EQUIVALENCE_SOURCE);
  return rest;
})(componentEquivalenceDispositionFixture);
const dispositionSchemaNegativeFixtures = [
  ['missing source', withoutDispositionSource],
  ['wrong source', { ...componentEquivalenceDispositionFixture, source: 'docs/wrong-plan.md' }],
  [
    'missing candidate',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.slice(0, -1),
    },
  ],
  [
    'additional candidate',
    {
      ...componentEquivalenceDispositionFixture,
      records: [
        ...componentEquivalenceDispositionFixture.records,
        componentEquivalenceDispositionFixture.records.at(-1),
      ],
    },
  ],
  [
    'duplicate candidate',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 1
          ? { ...record, candidate: componentEquivalenceDispositionFixture.records[0].candidate }
          : record,
      ),
    },
  ],
  [
    'reordered candidates',
    {
      ...componentEquivalenceDispositionFixture,
      records: [
        componentEquivalenceDispositionFixture.records[1],
        componentEquivalenceDispositionFixture.records[0],
        ...componentEquivalenceDispositionFixture.records.slice(2),
      ],
    },
  ],
  [
    'unknown candidate',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, candidate: 'Unknown' } : record,
      ),
    },
  ],
  [
    'missing A2UI disposition',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) => {
        if (index !== 0) {
          return record;
        }
        const { a2uiDisposition: omittedDisposition, ...rest } = record;
        assert.equal(omittedDisposition, 'n/a');
        return rest;
      }),
    },
  ],
  [
    'non-n/a A2UI disposition',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, a2uiDisposition: 'available' } : record,
      ),
    },
  ],
  [
    'non-approve implementation disposition',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, disposition: 'defer' } : record,
      ),
    },
  ],
  [
    'missing evidence digest',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) => {
        if (index !== 0) {
          return record;
        }
        const { evidenceDigest: omittedDigest, ...rest } = record;
        assert.match(omittedDigest, /^sha256:/);
        return rest;
      }),
    },
  ],
  [
    'malformed evidence digest',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, evidenceDigest: 'sha256:not-a-digest' } : record,
      ),
    },
  ],
  ['undeclared top-level field', { ...componentEquivalenceDispositionFixture, unreviewed: true }],
  [
    'undeclared record field',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, unreviewed: true } : record,
      ),
    },
  ],
  [
    'undeclared evidence field',
    {
      ...componentEquivalenceDispositionFixture,
      records: componentEquivalenceDispositionFixture.records.map((record, index) =>
        index === 0 ? { ...record, evidence: { ...record.evidence, unreviewed: true } } : record,
      ),
    },
  ],
];
for (const [label, fixture] of dispositionSchemaNegativeFixtures) {
  assert.equal(
    isValid('schemas/candidate-disposition.schema.json', fixture),
    false,
    `The component-equivalence dispositions must reject ${label}`,
  );
}

const mismatchedSourceFixture = {
  ...componentEquivalenceDispositionFixture,
  source: 'docs/plans/prioritized-roadmap-implementation-plan.md',
};
assert.throws(
  () =>
    assertComponentEquivalenceContracts(
      componentEquivalenceInventoryFixture,
      mismatchedSourceFixture,
      'component-equivalence source-mismatch fixture',
    ),
  /must name the approved implementation plan|must name the same source/,
  'The checker must reject an inventory/disposition source mismatch',
);
const wrongA2uiRationaleFixture = {
  ...componentEquivalenceDispositionFixture,
  records: componentEquivalenceDispositionFixture.records.map((record, index) =>
    index === 0 ? { ...record, rationale: 'Changed rationale.' } : record,
  ),
};
assert.equal(
  isValid('schemas/candidate-disposition.schema.json', wrongA2uiRationaleFixture),
  true,
  'A changed non-empty A2UI rationale remains schema-valid for checker coverage',
);
assert.throws(
  () =>
    assertComponentEquivalenceContracts(
      componentEquivalenceInventoryFixture,
      wrongA2uiRationaleFixture,
      'component-equivalence rationale fixture',
    ),
  /A2UI rationale changed/,
  'The checker must reject a changed candidate-specific A2UI rationale',
);
for (const [label, mutate] of [
  [
    'evidence',
    (record) => ({
      ...record,
      evidence: { ...record.evidence, security: 'Changed security evidence' },
    }),
  ],
  ['implementation disposition', (record) => ({ ...record, disposition: 'defer' })],
  ['A2UI disposition', (record) => ({ ...record, a2uiDisposition: 'available' })],
]) {
  const staleDigestFixture = {
    ...componentEquivalenceDispositionFixture,
    records: componentEquivalenceDispositionFixture.records.map((record, index) =>
      index === 0 ? mutate(record) : record,
    ),
  };
  assert.throws(
    () => assertEvidenceDigests(staleDigestFixture.records, `${label} stale-digest fixture`),
    /evidence digest is stale/,
    `The checker must reject a stale digest after changing ${label}`,
  );
}

for (const [inventory, path] of Object.entries({
  'app-shell': 'registry/sources/roadmap/app-shell/candidate-dispositions.json',
  chat: 'registry/sources/roadmap/chat/candidate-dispositions.json',
  content: 'registry/sources/roadmap/content/candidate-dispositions.json',
})) {
  const artifact = json(path);
  validate('schemas/candidate-disposition.schema.json', artifact, path);
  assert.equal(artifact.inventory, inventory, `${path} must name the matching inventory`);
  assert.deepEqual(
    artifact.records.map(({ candidate }) => candidate).toSorted(compareCanonicalStrings),
    dispositionInventories[inventory].toSorted(compareCanonicalStrings),
    `${path} must preserve exact candidate set equality`,
  );
}

const componentEquivalenceInventory = json(COMPONENT_EQUIVALENCE_INVENTORY_PATH);
const componentEquivalenceDispositions = json(COMPONENT_EQUIVALENCE_DISPOSITIONS_PATH);
validate(
  'schemas/candidate-inventory.schema.json',
  componentEquivalenceInventory,
  COMPONENT_EQUIVALENCE_INVENTORY_PATH,
);
validate(
  'schemas/candidate-disposition.schema.json',
  componentEquivalenceDispositions,
  COMPONENT_EQUIVALENCE_DISPOSITIONS_PATH,
);
assertComponentEquivalenceContracts(
  componentEquivalenceInventory,
  componentEquivalenceDispositions,
  'canonical component-equivalence expansion',
);

const contentDispositions = json('registry/sources/roadmap/content/candidate-dispositions.json');
assert.equal(
  contentDispositions.evidenceRevision,
  digest(contentDispositions.records),
  'Content evidence revision must match the complete record set',
);
for (const candidate of ['Timestamp', 'Blockquote', 'Citation']) {
  const record = contentDispositions.records.find((entry) => entry.candidate === candidate);
  assert.equal(
    record?.disposition,
    'approve',
    `Content must approve ${candidate} under the component-equivalence plan`,
  );
  assertEvidenceDigests([record], `Content ${candidate}`);
  assert.ok(
    record.evidence.sources.includes(COMPONENT_EQUIVALENCE_SOURCE),
    `Content ${candidate} must cite the approved component-equivalence plan`,
  );
}
const chatRfc = text('docs/architecture/rfc-chat.md');
assert.match(
  chatRfc,
  /standalone, bounded `Markdown` component/,
  'The Chat RFC must approve standalone bounded Markdown',
);
assert.match(
  chatRfc,
  /This decision does not change `Chat`: Chat continues to accept React children\s+and plain text and does not parse Markdown\./,
  'The standalone Markdown decision must not change Chat behavior',
);
assert.doesNotMatch(
  chatRfc,
  /Generic Markdown remains deferred/,
  'The superseded standalone Markdown deferral must be removed',
);

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

const rankingCandidates = INVENTORIES['registry/sources/roadmap/table-plugins/inventory.json'];
const rankingFixture = {
  schemaVersion: '1.0.0',
  status: 'proposed',
  inventory: 'registry/sources/roadmap/table-plugins/inventory.json',
  evidenceRevision: digestFixture,
  methodology: 'fixture',
  prototypeCandidates: ['selection', 'sorting'],
  records: rankingCandidates.map((candidate, index) => ({
    candidate,
    demandEvidence: [{ source: 'fixture', claim: 'fixture' }],
    reactAriaCompatibility: 'fixture',
    accessibilityRisks: ['fixture'],
    stateModel: 'fixture',
    controlledUncontrolled: 'fixture',
    clientServer: 'fixture',
    ssrHydration: 'fixture',
    performance: { rows1k: 'fixture', rows10k: 'fixture' },
    cost: {
      implementation: 'fixture',
      migration: 'fixture',
      maintenance: 'fixture',
    },
    disposition: 'defer',
    rank: index + 1,
    rankingRationale: 'fixture',
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
  group: 'deprecated-api',
  description: 'Fixture migration.',
  from: '1.0.0',
  to: '2.0.0',
  dependencies: [],
  transforms: [
    {
      id: 'fixture',
      kind: 'typescript',
      path: 'migrations/example.ts',
      files: ['**/*.tsx'],
    },
  ],
  affectedArtifacts: ['tale:component:button'],
  deprecations: [],
  sourceEvidence: ['CHANGELOG.md'],
  parsers: ['typescript'],
  sensitiveFiles: 'require-explicit',
  generatedFiles: 'require-explicit',
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
