/* eslint-disable no-await-in-loop -- migration discovery and planning preserve canonical file order */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  MigrationApplyResult,
  MigrationFileReport,
  MigrationPlan,
  MigrationRequest,
  TaleMigrationManifest,
} from './contracts/migrations.js';
import { TaleToolingError } from './contracts/errors.js';
import { applyProjectMutation, readProjectFile } from './operations.js';

interface DeclarativeTransform {
  schemaVersion: '1.0.0';
  operation: 'literal-replacements' | 'field-controls' | 'color-aliases';
  replacements?: Array<{ search: string; replacement: string }>;
  levels?: number[];
  extensions: string[];
}

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationRootCandidates = [
  join(currentDirectory, 'migrations'),
  join(currentDirectory, '..', 'migrations'),
];
const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.tale',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'storybook-static',
]);
const sensitiveNames = [/^\.env(?:\.|$)/, /credential/i, /private[-_.]?key/i, /secret/i];

function migrationRoot() {
  const root = migrationRootCandidates.find((candidate) => existsSync(candidate));
  if (!root) {
    throw new TaleToolingError(
      'TALE_CORRUPT_REGISTRY',
      'Tale UI: installed migration assets are unavailable.',
    );
  }
  return root;
}

function canonical(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(value: string): `sha256:${string}` {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

async function parseJson<T>(path: string, message: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    throw new TaleToolingError('TALE_CORRUPT_REGISTRY', message, { cause: error });
  }
}

async function migrationDirectories() {
  return (await readdir(migrationRoot(), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function listMigrations(): Promise<TaleMigrationManifest[]> {
  const manifests = await Promise.all(
    (await migrationDirectories()).map((directory) =>
      parseJson<TaleMigrationManifest>(
        join(migrationRoot(), directory, 'manifest.json'),
        `Tale UI: migration metadata for ${directory} is unavailable or malformed.`,
      ),
    ),
  );
  return manifests.sort(
    (left, right) => left.order - right.order || left.id.localeCompare(right.id),
  );
}

async function loadMigration(id: string) {
  const entries = await Promise.all(
    (await migrationDirectories()).map(async (directory) => ({
      directory,
      manifest: await parseJson<TaleMigrationManifest>(
        join(migrationRoot(), directory, 'manifest.json'),
        `Tale UI: migration metadata for ${directory} is unavailable or malformed.`,
      ),
    })),
  );
  const entry = entries.find(({ manifest }) => manifest.id === id);
  if (!entry) {
    throw new TaleToolingError(
      'TALE_MIGRATION_UNAVAILABLE',
      'Tale UI: the requested migration is not installed.',
    );
  }
  const migration = entry.manifest;
  if (migration.transforms.length !== 1) {
    throw new TaleToolingError(
      'TALE_CORRUPT_REGISTRY',
      'Tale UI: migration transform metadata is inconsistent.',
    );
  }
  const transform = await parseJson<DeclarativeTransform>(
    join(migrationRoot(), entry.directory, migration.transforms[0]!.path),
    'Tale UI: migration transform is unavailable or malformed.',
  );
  if (digest(canonical(transform)) !== migration.checksum) {
    throw new TaleToolingError(
      'TALE_CORRUPT_REGISTRY',
      'Tale UI: migration transform checksum verification failed.',
    );
  }
  return { migration, transform };
}

async function walk(root: string, directory = root): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      continue;
    }
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await walk(root, join(directory, entry.name))));
      }
    } else if (entry.isFile()) {
      files.push(relative(root, join(directory, entry.name)).replaceAll('\\', '/'));
    }
  }
  return files.sort();
}

function isSensitive(path: string) {
  return sensitiveNames.some((pattern) => pattern.test(basename(path)));
}

function isGenerated(path: string) {
  return path
    .split('/')
    .some((segment) => ['generated', 'build', 'dist', '.next', 'coverage'].includes(segment));
}

function replaceLiteral(content: string, search: string, replacement: string) {
  const occurrences = content.split(search).length - 1;
  return {
    content: occurrences > 0 ? content.split(search).join(replacement) : content,
    replacements: occurrences,
  };
}

function replaceElement(
  content: string,
  oldNamespace: string,
  newNamespace: string,
  childParts: string[],
) {
  let replacements = 0;
  const pattern = new RegExp(
    `<${oldNamespace}\\.Root([^>]*)>([\\s\\S]*?)<\\/${oldNamespace}\\.Root>`,
    'g',
  );
  const next = content.replace(pattern, (_match, props: string, body: string) => {
    replacements += 1;
    let children = body;
    for (const part of childParts) {
      children = children
        .replaceAll(`<${oldNamespace}.${part}`, `<${newNamespace}.${part}`)
        .replaceAll(`</${oldNamespace}.${part}>`, `</${newNamespace}.${part}>`);
    }
    return `<${newNamespace}.Root${props}><${newNamespace}.Button>${children}</${newNamespace}.Button></${newNamespace}.Root>`;
  });
  return { content: next, replacements };
}

function hasNamedImport(content: string, name: string, source: string) {
  const pattern = new RegExp(
    `import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from\\s*['"]${source.replaceAll('/', '\\/')}['"]`,
  );
  return pattern.test(content);
}

function replaceFieldControlImport(
  content: string,
  oldName: string,
  newName: string,
  oldSource: string,
  newSource: string,
) {
  let updated = false;
  const oldImport = new RegExp(
    `import\\s*\\{([^}]*)\\}\\s*from\\s*(['"])${oldSource.replaceAll('/', '\\/')}\\2\\s*;?`,
    'g',
  );
  const next = content.replace(oldImport, (statement, specifierText: string, quote: string) => {
    const specifiers = specifierText
      .split(',')
      .map((specifier) => specifier.trim())
      .filter(Boolean);
    const remaining = specifiers.filter((specifier) => specifier !== oldName);
    if (remaining.length === specifiers.length) {
      return statement;
    }
    updated = true;
    const preserved = remaining.length
      ? `import { ${remaining.join(', ')} } from ${quote}${oldSource}${quote};\n`
      : '';
    const replacement = hasNamedImport(content, newName, newSource)
      ? ''
      : `import { ${newName} } from ${quote}${newSource}${quote};`;
    return `${preserved}${replacement}`;
  });
  return { content: next, updated };
}

function transformFieldControls(content: string) {
  for (const unsupported of ['Checkbox.Visual', 'Radio.Visual', 'Switch.Visual']) {
    if (content.includes(unsupported)) {
      throw new TaleToolingError(
        'TALE_MIGRATION_UNAVAILABLE',
        `Tale UI: ${unsupported} is render-only and has no field-control replacement.`,
      );
    }
  }
  let next = content;
  let replacements = 0;
  for (const [oldName, newName, path, parts] of [
    ['Checkbox', 'CheckboxField', 'checkbox', ['Indicator']],
    ['Radio', 'RadioField', 'radio', ['Indicator', 'Dot']],
    ['Switch', 'SwitchField', 'switch', ['Thumb']],
  ] as const) {
    const element = replaceElement(next, oldName, newName, [...parts]);
    next = element.content;
    replacements += element.replacements;
    const oldSource = `@tale-ui/react/${path}`;
    const newSource = `@tale-ui/react/${path}-field`;
    const imported = replaceFieldControlImport(next, oldName, newName, oldSource, newSource);
    next = imported.content;
    if (imported.updated && element.replacements > 0) {
      replacements += 1;
    }
    if (
      element.replacements > 0 &&
      !imported.updated &&
      !hasNamedImport(next, newName, newSource)
    ) {
      throw new TaleToolingError(
        'TALE_MIGRATION_UNAVAILABLE',
        `Tale UI: the ${oldName} import uses an alias or composition that cannot be migrated safely.`,
      );
    }
  }
  if (next.includes('<Radio.Group') || next.includes('</Radio.Group>')) {
    next = next
      .replaceAll('<Radio.Group', '<RadioGroup')
      .replaceAll('</Radio.Group>', '</RadioGroup>');
    const anchor = "import { RadioField } from '@tale-ui/react/radio-field';";
    if (next.includes(anchor) && !next.includes("'@tale-ui/react/radio-group'")) {
      next = next.replace(
        anchor,
        `${anchor}\nimport { RadioGroup } from '@tale-ui/react/radio-group';`,
      );
      replacements += 1;
    }
  }
  if (
    /@tale-ui\/react\/(?:checkbox|radio|switch)(?:['"])/.test(next) &&
    /<(?:Checkbox|Radio|Switch)\.Root/.test(next)
  ) {
    throw new TaleToolingError(
      'TALE_MIGRATION_UNAVAILABLE',
      'Tale UI: a deprecated field-control import uses an alias or composition that cannot be migrated safely.',
    );
  }
  return { content: next, replacements };
}

function transformContent(content: string, transform: DeclarativeTransform) {
  if (transform.operation === 'field-controls') {
    return transformFieldControls(content);
  }
  if (transform.operation === 'color-aliases') {
    let next = content;
    let replacements = 0;
    for (const level of transform.levels || []) {
      const result = replaceLiteral(next, `var(--brand-${level}`, `var(--color-${level}`);
      next = result.content;
      replacements += result.replacements;
    }
    return { content: next, replacements };
  }
  let next = content;
  let replacements = 0;
  for (const replacement of transform.replacements || []) {
    const result = replaceLiteral(next, replacement.search, replacement.replacement);
    next = result.content;
    replacements += result.replacements;
  }
  return { content: next, replacements };
}

async function assertSupported(root: string, migration: TaleMigrationManifest) {
  if (!['package-rename', 'deprecated-api', 'import-path'].includes(migration.group)) {
    return;
  }
  const project = await readProjectFile(root, 'package.json');
  if (!project.exists) {
    return;
  }
  let manifest: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  try {
    manifest = JSON.parse(project.content);
  } catch (error) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      'Tale UI: migration requires a readable package.json.',
      { cause: error },
    );
  }
  if (migration.group === 'package-rename') {
    const groups = [manifest.dependencies || {}, manifest.devDependencies || {}];
    const coreRange = groups.map((group) => group['@tale-ui/core']).find(Boolean);
    const cssRange = groups.map((group) => group['@tale-ui/css']).find(Boolean);
    if (coreRange && cssRange) {
      throw new TaleToolingError(
        'TALE_MALFORMED_PROJECT_CONFIG',
        'Tale UI: both @tale-ui/core and @tale-ui/css are declared; resolve the mixed package state before migration.',
      );
    }
    const coreMajor = coreRange?.match(/(\d+)/)?.[1];
    if (coreMajor && Number(coreMajor) > 1) {
      throw new TaleToolingError(
        'TALE_VERSION_RANGE_MISMATCH',
        'Tale UI: the package rename supports @tale-ui/core v1 projects only.',
      );
    }
    return;
  }
  const range =
    manifest.dependencies?.['@tale-ui/react'] || manifest.devDependencies?.['@tale-ui/react'];
  const version = range
    ?.match(/(\d+)\.(\d+)\.(\d+)/)
    ?.slice(1)
    .map(Number);
  if (
    version &&
    (version[0]! > 2 ||
      (migration.group === 'deprecated-api' &&
        version[0] === 1 &&
        (version[1]! < 3 || (version[1] === 3 && version[2]! < 53))))
  ) {
    throw new TaleToolingError(
      'TALE_VERSION_RANGE_MISMATCH',
      `Tale UI: ${migration.id} does not support the installed @tale-ui/react range.`,
    );
  }
}

export async function planMigration(request: MigrationRequest): Promise<MigrationPlan> {
  if (request.schemaVersion !== '1.0.0' || !request.requestId || !request.migration) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: migration planning requires schema, request, and migration identities.',
    );
  }
  const { migration, transform } = await loadMigration(request.migration);
  await assertSupported(request.root, migration);
  const candidates = request.files || (await walk(request.root));
  const files: MigrationFileReport[] = [];
  for (const path of candidates) {
    if (!transform.extensions.includes(extname(path))) {
      continue;
    }
    const existing = await readProjectFile(request.root, path);
    if (!existing.exists) {
      continue;
    }
    const preimageDigest = digest(existing.content);
    if (isSensitive(path) && !request.authorizeSensitive) {
      files.push({
        path,
        action: 'skipped',
        preimageDigest,
        postimageDigest: preimageDigest,
        replacements: 0,
        reason: 'sensitive',
      });
      continue;
    }
    if (isGenerated(path) && !request.authorizeGenerated) {
      files.push({
        path,
        action: 'skipped',
        preimageDigest,
        postimageDigest: preimageDigest,
        replacements: 0,
        reason: 'generated',
      });
      continue;
    }
    const transformed = transformContent(existing.content, transform);
    if (transformed.replacements > 0) {
      files.push({
        path,
        action: 'update',
        preimageDigest,
        postimageDigest: digest(transformed.content),
        replacements: transformed.replacements,
      });
    }
  }
  files.sort((left, right) => left.path.localeCompare(right.path));
  const state: MigrationPlan['state'] = files.some((file) => file.action === 'update')
    ? 'applicable'
    : 'already-migrated';
  const preimage = {
    schemaVersion: '1.0.0' as const,
    requestId: request.requestId,
    migration,
    state,
    files,
  };
  return {
    ...preimage,
    planDigest: digest(canonical({ migration, state, files })),
  };
}

export async function applyMigration(request: MigrationRequest): Promise<MigrationApplyResult> {
  const plan = await planMigration(request);
  if (request.planDigest && request.planDigest !== plan.planDigest) {
    throw new TaleToolingError(
      'TALE_CHANGED_SINCE_PLAN',
      'Tale UI: migration inputs changed after dry-run; review the new plan before applying.',
    );
  }
  const changed = plan.files.filter((file) => file.action === 'update');
  if (changed.length === 0) {
    return { ...plan, replayed: true };
  }
  const { transform } = await loadMigration(request.migration);
  const files = await Promise.all(
    changed.map(async (file) => {
      const existing = await readProjectFile(request.root, file.path);
      const transformed = transformContent(existing.content, transform);
      if (digest(existing.content) !== file.preimageDigest) {
        throw new TaleToolingError(
          'TALE_CHANGED_SINCE_PLAN',
          'Tale UI: a migration input changed after planning.',
        );
      }
      return { path: file.path, content: transformed.content, overwrite: true };
    }),
  );
  const result = await applyProjectMutation({
    schemaVersion: '1.0.0',
    requestId: request.requestId,
    root: request.root,
    operation: 'upgrade',
    idempotencyKey: request.idempotencyKey || `tale-migration-${request.migration}-v1`,
    files,
  });
  return {
    ...plan,
    operationId: result.operationId,
    replayed: result.replayed,
  };
}
