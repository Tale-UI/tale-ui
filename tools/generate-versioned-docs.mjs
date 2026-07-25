#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const PREVIOUS_TAG = 'react-v1.3.56';
const PREVIOUS_REVISION = '16e8ae2b3f26fdc2015cc10aa2d689edcbf60ca2';
const VERSIONED_ROOT = join(ROOT, 'docs/versioned');
const CONTENT_ROOT = join(VERSIONED_ROOT, 'v1/content');
const MANIFEST_PATH = join(VERSIONED_ROOT, 'manifest.json');
const ROLLBACK_PATH = join(VERSIONED_ROOT, 'rollback.json');
const PUBLIC_PATH =
  /^(?:docs\/[^/]+\.md|docs\/components\/[^/]+\.md|docs\/recipes\/[^/]+\.md|packages\/css\/docs\/[^/]+\.md)$/;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function digestEntries(entries) {
  return `sha256:${sha256(entries.map(({ path, digest }) => `${path}\0${digest}`).join('\n'))}`;
}

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory)
    .sort()
    .flatMap((name) => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

function currentPublicPaths() {
  const directories = ['docs', 'docs/components', 'docs/recipes', 'packages/css/docs'];
  return directories
    .flatMap((directory) =>
      readdirSync(join(ROOT, directory))
        .filter((name) => name.endsWith('.md'))
        .map((name) => `${directory}/${name}`),
    )
    .filter((path) => PUBLIC_PATH.test(path))
    .sort();
}

function contentEntries(paths, read) {
  return paths.map((path) => ({
    path,
    digest: `sha256:${sha256(read(path).replaceAll('\r\n', '\n'))}`,
  }));
}

function previousPathsFromGit() {
  return execFileSync('git', ['ls-tree', '-r', '--name-only', PREVIOUS_TAG], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter((path) => PUBLIC_PATH.test(path))
    .sort();
}

function gitText(path) {
  return execFileSync('git', ['show', `${PREVIOUS_TAG}:${path}`], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
    .replaceAll('\r\n', '\n')
    .replace(/[ \t]+$/gm, '');
}

function snapshotText(path) {
  return readFileSync(join(CONTENT_ROOT, path), 'utf8').replaceAll('\r\n', '\n');
}

function currentText(path) {
  return readFileSync(join(ROOT, path), 'utf8').replaceAll('\r\n', '\n');
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function makeManifest(previousPaths) {
  const currentPaths = currentPublicPaths();
  const currentEntries = contentEntries(currentPaths, currentText);
  const previousEntries = contentEntries(previousPaths, CHECK ? snapshotText : gitText);
  const registry = JSON.parse(readFileSync(join(ROOT, 'registry/artifacts.json'), 'utf8'));
  return {
    $schema: '../../schemas/docs-provenance.schema.json',
    schemaVersion: '1.0.0',
    origin: 'https://tale-ui.github.io/tale-ui/',
    versions: [
      {
        major: 2,
        source: 'working-tree-public-docs',
        sourceRevision: registry.sourceRevision,
        contentDigest: digestEntries(currentEntries),
        packageVersions: registry.packageVersions,
        registryVersion: registry.registryVersion,
        publicAllowlist: currentPaths,
      },
      {
        major: 1,
        source: PREVIOUS_TAG,
        sourceRevision: PREVIOUS_REVISION,
        contentDigest: digestEntries(previousEntries),
        packageVersions: { '@tale-ui/react': '1.3.56' },
        registryVersion: 'legacy-v1',
        publicAllowlist: previousPaths,
      },
    ],
  };
}

function validateManifest(manifest) {
  const schema = JSON.parse(
    readFileSync(join(ROOT, 'schemas/docs-provenance.schema.json'), 'utf8'),
  );
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(manifest)) {
    throw new Error(ajv.errorsText(validate.errors, { separator: '\n' }));
  }
}

if (CHECK) {
  const committed = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const previous = committed.versions.find(({ major }) => major === 1);
  if (!previous) {
    throw new Error('Versioned docs manifest is missing previous major v1.');
  }
  const actualSnapshotPaths = walk(CONTENT_ROOT)
    .map((path) => relative(CONTENT_ROOT, path).replaceAll('\\', '/'))
    .sort();
  if (canonical(actualSnapshotPaths) !== canonical(previous.publicAllowlist)) {
    throw new Error('Previous-major snapshot files differ from the public allowlist.');
  }
  const generated = makeManifest(actualSnapshotPaths);
  validateManifest(generated);
  if (canonical(generated) !== canonical(committed)) {
    throw new Error('docs/versioned/manifest.json is stale; run pnpm docs:versions:generate.');
  }
  const expectedRollback = {
    schemaVersion: '1.0.0',
    currentMajor: 2,
    previousMajor: 1,
    lastKnownGood: '/docs/v1/',
    manifestDigest: `sha256:${sha256(canonical(committed))}`,
  };
  if (canonical(expectedRollback) !== readFileSync(ROLLBACK_PATH, 'utf8')) {
    throw new Error('docs/versioned/rollback.json is stale.');
  }
  console.log(
    `OK: current v2 and ${actualSnapshotPaths.length} immutable v1 public documentation files`,
  );
  process.exit(0);
}

const previousPaths = previousPathsFromGit();
rmSync(CONTENT_ROOT, { recursive: true, force: true });
for (const path of previousPaths) {
  const output = join(CONTENT_ROOT, path);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, gitText(path));
}
const manifest = makeManifest(previousPaths);
validateManifest(manifest);
mkdirSync(VERSIONED_ROOT, { recursive: true });
writeFileSync(MANIFEST_PATH, canonical(manifest));
writeFileSync(
  ROLLBACK_PATH,
  canonical({
    schemaVersion: '1.0.0',
    currentMajor: 2,
    previousMajor: 1,
    lastKnownGood: '/docs/v1/',
    manifestDigest: `sha256:${sha256(canonical(manifest))}`,
  }),
);
console.log(`Generated immutable v1 docs snapshot (${previousPaths.length} files).`);
