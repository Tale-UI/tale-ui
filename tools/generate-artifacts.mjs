#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  compareCanonicalStrings,
  computeArtifactSourceRevision,
  normalizeArtifactSourceText,
} from './artifact-canonical.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_MODE = process.argv.includes('--check');
const PLAN_PATH = 'analysis/gap-analysis-astryx/plans/prioritized-roadmap-implementation-plan.md';
const ARTIFACT_OUTPUT = 'registry/artifacts.json';
const CAPABILITY_OUTPUT = 'registry/capabilities.json';
const TRACEABILITY_OUTPUT = 'registry/roadmap-traceability.json';

const GENERATED_INPUTS = [
  'registry/components.json',
  'registry/a2ui-catalog.json',
  'registry/pitfalls.json',
  'registry/sources/capabilities.json',
  'registry/sources/foundations.json',
  'registry/sources/hooks.json',
  'packages/react/package.json',
  'packages/a2ui/package.json',
  'packages/css/package.json',
  'packages/tokens/package.json',
  'packages/styles/package.json',
  'packages/themes/package.json',
  'packages/utils/package.json',
  'packages/charts/package.json',
  'packages/tooling/package.json',
];

const TOP_LEVEL_PUBLIC_DOCS = [
  'docs/a2ui-integration.md',
  'docs/authoring-components.md',
  'docs/component-index.md',
  'docs/consuming-design-system.md',
  'docs/design-philosophy.md',
  'docs/managing-packages.md',
  'docs/package-dependencies.md',
  'docs/react-aria-deviations.md',
  'docs/react-setup.md',
  'docs/workspace-structure.md',
  'packages/css/docs/ai-reference.md',
  'packages/css/docs/architecture.md',
  'packages/css/docs/building-components.md',
  'packages/css/docs/design-tokens.md',
  'packages/css/docs/framework-integration.md',
  'packages/css/docs/naming-conventions.md',
];

const DEPRECATED_COMPONENT_REPLACEMENTS = {
  checkbox: 'tale:component:checkbox-field',
  radio: 'tale:component:radio-field',
  switch: 'tale:component:switch-field',
};

const DEPRECATED_A2UI_REPLACEMENTS = {
  Checkbox: 'tale:a2ui-type:checkbox-field',
  Radio: 'tale:a2ui-type:radio-field',
  RadioOption: 'tale:a2ui-type:radio-field-option',
  Switch: 'tale:a2ui-type:switch-field',
};

function readText(path) {
  return normalizeArtifactSourceText(readFileSync(join(ROOT, path), 'utf8'));
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function digest(value) {
  return `sha256:${sha256(typeof value === 'string' ? value : canonicalJson(value))}`;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function titleFromMarkdown(path) {
  const match = readText(path).match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : path;
}

function words(...values) {
  return [
    ...new Set(
      values
        .flatMap((value) => (value || '').toLowerCase().split(/[^a-z0-9]+/))
        .filter((value) => value.length > 1),
    ),
  ].sort();
}

function artifactBase({
  kind,
  slug,
  name,
  description = '',
  lifecycle = 'stable',
  packageName,
  version,
  aliases = [],
  replacementId,
  keywords = [],
  related = [],
  retrieval,
  capabilities = ['artifact.get', 'artifact.search'],
  platforms = ['web', 'agent'],
  source,
  metadata,
}) {
  const result = {
    id: `tale:${kind}:${slug}`,
    namespace: 'tale',
    kind,
    slug,
    name,
    description: description || '',
    lifecycle,
    ...(packageName ? { package: packageName, version } : {}),
    ...(aliases.length > 0 ? { aliases: [...new Set(aliases)].sort() } : {}),
    ...(replacementId ? { replacementId } : {}),
    keywords: [...new Set(keywords)].sort(),
    related: [...new Set(related)].sort(),
    retrieval,
    capabilities: [...new Set(capabilities)].sort(),
    platforms: [...new Set(platforms)].sort(),
    provenance: {
      source,
      firstParty: true,
      license: 'MIT',
    },
    trust: 'first-party',
    ...(metadata ? { metadata } : {}),
  };
  return result;
}

function componentArtifacts(components, reactVersion) {
  return components.map((component) => {
    const replacementId = DEPRECATED_COMPONENT_REPLACEMENTS[component.slug];
    if (component.status === 'deprecated' && !replacementId) {
      throw new Error(`Deprecated component ${component.slug} has no replacement mapping`);
    }
    return artifactBase({
      kind: 'component',
      slug: component.slug,
      name: component.name,
      description: component.description,
      lifecycle: component.status || 'stable',
      packageName: '@tale-ui/react',
      version: reactVersion,
      aliases: [component.name],
      replacementId,
      keywords: words(component.name, component.category, component.description),
      related: replacementId ? [replacementId] : [],
      retrieval: [
        {
          type: 'registry',
          path: 'registry/components.json',
          selector: `components[slug=${component.slug}]`,
        },
        {
          type: 'package-export',
          path: component.import,
        },
      ],
      capabilities: ['artifact.get', 'artifact.search', 'component.get'],
      source: `packages/react/src/${component.slug}/index.ts`,
      metadata: {
        category: component.category,
        componentKind: component.kind,
      },
    });
  });
}

function chartComponentArtifacts(chartPackage, chartVersion) {
  const chartRows = new Map(
    readText('docs/component-index.md')
      .split('\n')
      .filter((line) => line.includes('`@tale-ui/charts/'))
      .map((line) => {
        const cells = line
          .slice(1, -1)
          .split('|')
          .map((cell) => cell.trim());
        const importPath = cells[2].replaceAll('`', '');
        return [
          importPath,
          {
            name: cells[0],
            description: cells[1],
            parts: cells[3].split(',').map((part) => part.trim()),
          },
        ];
      }),
  );
  const chartExports = Object.keys(chartPackage.exports)
    .filter((exportPath) => /^\.\/[a-z0-9-]+-chart$/.test(exportPath))
    .sort();

  return chartExports.map((exportPath) => {
    const slug = exportPath.slice(2);
    const importPath = `@tale-ui/charts/${slug}`;
    const row = chartRows.get(importPath);
    const source = `packages/charts/src/${slug}/index.ts`;
    if (!row || !existsSync(join(ROOT, source))) {
      throw new Error(`Chart export ${importPath} is missing canonical docs or source`);
    }
    return artifactBase({
      kind: 'component',
      slug,
      name: row.name,
      description: row.description,
      packageName: '@tale-ui/charts',
      version: chartVersion,
      aliases: [row.name],
      keywords: words(row.name, 'Charts', row.description),
      retrieval: [
        { type: 'file', path: `docs/components/${slug}.md` },
        { type: 'package-export', path: importPath },
      ],
      capabilities: ['artifact.get', 'artifact.search'],
      source,
      metadata: {
        category: 'Charts',
        componentKind: 'compound',
        parts: row.parts,
      },
    });
  });
}

function recipeArtifacts(componentIds) {
  const recipePaths = readdirSync(join(ROOT, 'docs/recipes'))
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .sort()
    .map((name) => `docs/recipes/${name}`);

  return {
    paths: recipePaths,
    records: recipePaths.map((path) => {
      const content = readText(path);
      const slug = path.split('/').at(-1).replace(/\.md$/, '');
      const related = [...content.matchAll(/@tale-ui\/(?:react|charts)\/([a-z0-9-]+)/g)]
        .map((match) => `tale:component:${match[1]}`)
        .filter((id) => componentIds.has(id));
      return artifactBase({
        kind: 'recipe',
        slug,
        name: titleFromMarkdown(path),
        description: `Canonical Tale UI recipe: ${titleFromMarkdown(path)}`,
        keywords: words(slug, titleFromMarkdown(path)),
        related,
        retrieval: [{ type: 'file', path }],
        capabilities: ['artifact.get', 'artifact.search', 'recipe.get'],
        source: path,
      });
    }),
  };
}

function templateArtifacts(toolingVersion) {
  const directories = readdirSync(join(ROOT, 'packages/tooling/templates'), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const paths = directories.flatMap((slug) => [
    `packages/tooling/templates/${slug}/template.json`,
    `packages/tooling/templates/${slug}/source/App.tsx`,
    `packages/tooling/templates/${slug}/skeleton/App.tsx`,
  ]);
  const records = directories.map((slug) => {
    const path = `packages/tooling/templates/${slug}/template.json`;
    const template = readJson(path);
    validate('schemas/template.schema.json', template);
    if (template.id !== `tale:template:${slug}`) {
      throw new Error(`${path} identity must match its directory`);
    }
    return artifactBase({
      kind: 'template',
      slug,
      name: slug
        .split('-')
        .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
        .join(' '),
      description: `Installable Tale UI ${slug.replaceAll('-', ' ')} template.`,
      packageName: '@tale-ui/tooling',
      version: toolingVersion,
      keywords: words(slug, template.preview.recipe),
      retrieval: [
        { type: 'file', path },
        {
          type: 'package-export',
          path: '@tale-ui/tooling/materialize',
          selector: template.id,
        },
      ],
      capabilities: ['artifact.get', 'artifact.search', 'project.mutate'],
      source: path,
      metadata: {
        templateVersion: template.version,
        compatibility: template.compatibility,
        appearance: template.appearance,
        rtl: template.rtl,
        digest: template.digest,
      },
    });
  });
  return { paths, records };
}

function migrationArtifacts(toolingVersion) {
  const directories = readdirSync(join(ROOT, 'packages/tooling/migrations'), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const paths = directories.flatMap((directory) => [
    `packages/tooling/migrations/${directory}/manifest.json`,
    `packages/tooling/migrations/${directory}/transform.json`,
  ]);
  const records = directories.map((directory) => {
    const path = `packages/tooling/migrations/${directory}/manifest.json`;
    const migration = readJson(path);
    validate('schemas/migration.schema.json', migration);
    return artifactBase({
      kind: 'codemod',
      slug: migration.id,
      name: migration.description,
      description: `${migration.from} → ${migration.to}`,
      packageName: '@tale-ui/tooling',
      version: toolingVersion,
      aliases: [migration.id],
      keywords: words(migration.id, migration.group, migration.description),
      related: migration.affectedArtifacts.filter((id) => id.startsWith('tale:')),
      retrieval: [
        { type: 'file', path },
        {
          type: 'package-export',
          path: '@tale-ui/tooling/migrations',
          selector: migration.id,
        },
      ],
      capabilities: ['artifact.get', 'artifact.search', 'project.mutate'],
      source: path,
      metadata: {
        order: migration.order,
        group: migration.group,
        from: migration.from,
        to: migration.to,
        reversible: migration.reversible,
        checksum: migration.checksum,
      },
    });
  });
  return { paths, records };
}

function a2uiArtifacts(catalog, a2uiVersion, componentByName) {
  return catalog.types.map((type) => {
    const componentName = type.component.split('.')[0].toLowerCase();
    const relatedComponent = componentByName.get(componentName);
    const replacementId = DEPRECATED_A2UI_REPLACEMENTS[type.name];
    return artifactBase({
      kind: 'a2ui-type',
      slug: slugify(type.name),
      name: type.name,
      description: type.description,
      lifecycle: replacementId ? 'deprecated' : 'stable',
      packageName: '@tale-ui/a2ui',
      version: a2uiVersion,
      aliases: [type.name],
      replacementId,
      keywords: words(type.name, type.category, type.component, type.description),
      related: [relatedComponent, replacementId].filter(Boolean),
      retrieval: [
        {
          type: 'registry',
          path: 'registry/a2ui-catalog.json',
          selector: `types[name=${type.name}]`,
        },
      ],
      source: 'packages/a2ui/src/catalog.ts',
      platforms: ['agent', 'web'],
      metadata: {
        category: type.category,
        component: type.component,
        isSubPart: type.isSubPart,
      },
    });
  });
}

function hookArtifacts(hookSource, packageVersions) {
  return hookSource.hooks.map((entry) => {
    const definition =
      typeof entry === 'string'
        ? {
            name: entry,
            path: `packages/utils/src/${entry}.ts`,
            packageName: '@tale-ui/utils',
            exportPath: `@tale-ui/utils/${entry}`,
            description: `Public React utility hook ${entry}.`,
          }
        : entry;
    const { name, path, packageName, exportPath, description } = definition;
    if (!existsSync(join(ROOT, path))) {
      throw new Error(`Hook source is missing: ${path}`);
    }
    if (!packageVersions[packageName]) {
      throw new Error(`Hook ${name} references unknown package ${packageName}`);
    }
    return artifactBase({
      kind: 'hook',
      slug: slugify(name),
      name,
      description,
      packageName,
      version: packageVersions[packageName],
      aliases: [name],
      keywords: words(name, 'react hook utility'),
      retrieval: [
        { type: 'file', path },
        { type: 'package-export', path: exportPath },
      ],
      source: path,
    });
  });
}

function foundationArtifacts(source) {
  return source.foundations.map((foundation) => {
    if (!existsSync(join(ROOT, foundation.path))) {
      throw new Error(`Foundation source is missing: ${foundation.path}`);
    }
    return artifactBase({
      kind: 'foundation',
      slug: foundation.slug,
      name: foundation.title,
      description: `Tale UI foundation guidance for ${foundation.title}.`,
      keywords: foundation.keywords,
      retrieval: [{ type: 'file', path: foundation.path }],
      source: foundation.path,
    });
  });
}

function sharedPitfallArtifacts(pitfalls, componentByName) {
  return [...pitfalls.generalConventions, ...pitfalls.crossComponentPitfalls].map((pitfall) => {
    const related = (pitfall.appliesTo || [])
      .map((name) => componentByName.get(name.toLowerCase()))
      .filter(Boolean);
    return artifactBase({
      kind: 'pitfall',
      slug: slugify(pitfall.id),
      name: pitfall.summary,
      description: pitfall.detail,
      keywords: words(pitfall.id, pitfall.category, pitfall.summary),
      related,
      retrieval: [
        {
          type: 'registry',
          path: 'registry/pitfalls.json',
          selector: `id=${pitfall.id}`,
        },
      ],
      source: 'docs/pitfalls.md',
      platforms: ['agent', 'web'],
      metadata: {
        ruleId: pitfall.id,
        category: pitfall.category,
      },
    });
  });
}

function componentPitfallArtifacts(components) {
  return components.flatMap((component) =>
    (component.pitfalls || []).map((pitfall) =>
      artifactBase({
        kind: 'pitfall',
        slug: `${component.slug}--${slugify(pitfall.id)}`,
        name: pitfall.summary,
        description: pitfall.detail,
        keywords: words(
          component.name,
          component.slug,
          pitfall.id,
          pitfall.summary,
          pitfall.detail,
        ),
        related: [`tale:component:${component.slug}`],
        retrieval: [
          {
            type: 'registry',
            path: 'registry/components.json',
            selector: `components[slug=${component.slug}].pitfalls[id=${pitfall.id}]`,
          },
        ],
        source: `docs/components/${component.slug}.md`,
        platforms: ['agent', 'web'],
        metadata: {
          ruleId: pitfall.id,
          category: 'component',
          component: component.name,
        },
      }),
    ),
  );
}

function publicDocPaths() {
  const componentDocs = readdirSync(join(ROOT, 'docs/components'))
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .sort()
    .map((name) => `docs/components/${name}`);
  return [...new Set([...TOP_LEVEL_PUBLIC_DOCS, ...componentDocs])].sort();
}

function docArtifacts(paths, componentIds) {
  return paths.map((path) => {
    const componentSlug = path.startsWith('docs/components/')
      ? path.split('/').at(-1).replace(/\.md$/, '')
      : null;
    const componentId = componentSlug ? `tale:component:${componentSlug}` : null;
    const slug = slugify(path.replace(/\.md$/, '').replaceAll('/', '--'));
    return artifactBase({
      kind: 'doc',
      slug,
      name: titleFromMarkdown(path),
      description: `Public Tale UI documentation: ${titleFromMarkdown(path)}`,
      keywords: words(path, titleFromMarkdown(path)),
      related: componentId && componentIds.has(componentId) ? [componentId] : [],
      retrieval: [{ type: 'file', path }],
      source: path,
    });
  });
}

function parseTraceability(plan) {
  const criteria = [];
  for (const line of plan.split('\n')) {
    if (!/^\|\s*(R\d{2}\.\d|SM\d{2})\s*\|/.test(line)) {
      continue;
    }
    const cells = line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim());
    if (cells.length !== 6) {
      throw new Error(`Malformed traceability row: ${line}`);
    }
    criteria.push({
      id: cells[0],
      requirement: cells[1],
      deliverable: cells[2],
      automatedVerification: cells[3],
      manualEvidenceAndOwner: cells[4],
      releaseGate: cells[5],
    });
  }
  const ids = criteria.map((criterion) => criterion.id);
  if (criteria.length === 0 || new Set(ids).size !== ids.length) {
    throw new Error('Traceability criteria are missing or contain duplicate IDs');
  }
  return {
    schemaVersion: '1.0.0',
    source: PLAN_PATH,
    sourceDigest: digest(plan),
    criteria,
  };
}

function sourceRevision(paths) {
  return computeArtifactSourceRevision(paths, readText);
}

function validate(schemaPath, value) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(readJson(schemaPath));
  if (!validator(value)) {
    throw new Error(
      `${schemaPath} validation failed:\n${ajv.errorsText(validator.errors, {
        separator: '\n',
      })}`,
    );
  }
}

function writeOrCheck(path, value) {
  const output = canonicalJson(value);
  const fullPath = join(ROOT, path);
  if (CHECK_MODE) {
    if (!existsSync(fullPath)) {
      throw new Error(`MISSING: ${path}`);
    }
    if (readFileSync(fullPath, 'utf8') !== output) {
      throw new Error(`STALE: ${path} — run \`pnpm artifacts:generate\``);
    }
    return;
  }
  writeFileSync(fullPath, output);
}

function build() {
  const componentRegistry = readJson('registry/components.json');
  const a2uiCatalog = readJson('registry/a2ui-catalog.json');
  const pitfalls = readJson('registry/pitfalls.json');
  const capabilitySource = readJson('registry/sources/capabilities.json');
  const foundationSource = readJson('registry/sources/foundations.json');
  const hookSource = readJson('registry/sources/hooks.json');
  const packagePaths = GENERATED_INPUTS.filter((path) => path.endsWith('package.json'));
  const packages = Object.fromEntries(
    packagePaths.map((path) => {
      const manifest = readJson(path);
      return [manifest.name, manifest.version];
    }),
  );

  const chartPackage = readJson('packages/charts/package.json');
  const components = [
    ...componentArtifacts(componentRegistry.components, packages['@tale-ui/react']),
    ...chartComponentArtifacts(chartPackage, packages['@tale-ui/charts']),
  ];
  const componentIds = new Set(components.map((record) => record.id));
  const componentByName = new Map(
    components.map((record) => [record.name.toLowerCase(), record.id]),
  );
  const recipes = recipeArtifacts(componentIds);
  const templates = templateArtifacts(packages['@tale-ui/tooling']);
  const migrations = migrationArtifacts(packages['@tale-ui/tooling']);
  const docs = publicDocPaths();
  const records = [
    ...components,
    ...hookArtifacts(hookSource, packages),
    ...recipes.records,
    ...templates.records,
    ...migrations.records,
    ...docArtifacts(docs, componentIds),
    ...a2uiArtifacts(a2uiCatalog, packages['@tale-ui/a2ui'], componentByName),
    ...foundationArtifacts(foundationSource),
    ...sharedPitfallArtifacts(pitfalls, componentByName),
    ...componentPitfallArtifacts(componentRegistry.components),
  ].sort((a, b) => compareCanonicalStrings(a.id, b.id));

  const ids = records.map((record) => record.id);
  const capabilityIds = new Set(capabilitySource.capabilities.map((capability) => capability.id));
  if (capabilityIds.size !== capabilitySource.capabilities.length) {
    throw new Error('Capability source contains duplicate IDs');
  }
  if (new Set(ids).size !== ids.length) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    throw new Error(`Duplicate artifact IDs: ${[...new Set(duplicates)].join(', ')}`);
  }
  const recordById = new Map(records.map((record) => [record.id, record]));
  for (const record of records) {
    for (const relation of record.related) {
      if (!ids.includes(relation)) {
        throw new Error(`${record.id} has dangling relation ${relation}`);
      }
    }
    if (record.replacementId) {
      const replacement = recordById.get(record.replacementId);
      if (!replacement) {
        throw new Error(`${record.id} has dangling replacement ${record.replacementId}`);
      }
      if (replacement.id === record.id || replacement.kind !== record.kind) {
        throw new Error(
          `${record.id} has incompatible replacement ${record.replacementId}; ` +
            'replacements must be different artifacts of the same kind',
        );
      }
    }
    for (const capability of record.capabilities) {
      if (!capabilityIds.has(capability)) {
        throw new Error(`${record.id} references unknown capability ${capability}`);
      }
    }
  }

  const generatedFrom = [
    ...GENERATED_INPUTS,
    ...recipes.paths,
    ...templates.paths,
    ...migrations.paths,
    ...docs,
    ...components
      .filter((record) => record.package === '@tale-ui/charts')
      .map((record) => record.provenance.source),
    ...hookSource.hooks.map((entry) =>
      typeof entry === 'string' ? `packages/utils/src/${entry}.ts` : entry.path,
    ),
    ...foundationSource.foundations.map((record) => record.path),
  ].sort();
  const uniqueSources = [...new Set(generatedFrom)];
  const artifactPreimage = {
    schemaVersion: '1.0.0',
    registryVersion: '1.0.0',
    releaseChannel: 'internal',
    generatedFrom: uniqueSources,
    sourceRevision: sourceRevision(uniqueSources),
    packageVersions: Object.fromEntries(
      Object.entries(packages).sort(([a], [b]) => compareCanonicalStrings(a, b)),
    ),
    capabilityManifestId: capabilitySource.manifestId,
    artifacts: records,
  };
  const artifactRegistry = {
    ...artifactPreimage,
    digest: digest(artifactPreimage),
  };

  const capabilityPreimage = {
    schemaVersion: capabilitySource.schemaVersion,
    manifestId: capabilitySource.manifestId,
    registryVersion: artifactRegistry.registryVersion,
    capabilities: capabilitySource.capabilities
      .map((capability) => ({
        ...capability,
        availability: [...capability.availability].sort(),
        status: capability.status || 'available',
      }))
      .sort((a, b) => compareCanonicalStrings(a.id, b.id)),
  };
  const capabilityRegistry = {
    ...capabilityPreimage,
    digest: digest(capabilityPreimage),
  };
  const traceability = parseTraceability(readText(PLAN_PATH));

  validate('schemas/artifact.schema.json', artifactRegistry);
  validate('schemas/capability.schema.json', capabilityRegistry);
  validate('schemas/roadmap-traceability.schema.json', traceability);

  return { artifactRegistry, capabilityRegistry, traceability };
}

try {
  const firstBuild = build();
  if (CHECK_MODE) {
    const secondBuild = build();
    for (const key of ['artifactRegistry', 'capabilityRegistry', 'traceability']) {
      if (canonicalJson(firstBuild[key]) !== canonicalJson(secondBuild[key])) {
        throw new Error(`NONDETERMINISTIC: ${key} differs across consecutive builds`);
      }
    }
  }
  const { artifactRegistry, capabilityRegistry, traceability } = firstBuild;
  writeOrCheck(ARTIFACT_OUTPUT, artifactRegistry);
  writeOrCheck(CAPABILITY_OUTPUT, capabilityRegistry);
  writeOrCheck(TRACEABILITY_OUTPUT, traceability);
  const mode = CHECK_MODE ? 'OK' : 'GENERATED';
  console.log(
    `${mode}: ${relative(ROOT, join(ROOT, ARTIFACT_OUTPUT))} ` +
      `(${artifactRegistry.artifacts.length} artifacts, ${capabilityRegistry.capabilities.length} capabilities, ` +
      `${traceability.criteria.length} criteria${CHECK_MODE ? ', two-build identity verified' : ''})`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
