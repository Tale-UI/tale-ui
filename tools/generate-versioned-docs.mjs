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
const V2_TAG = 'release-v2.0.0';
const V2_REVISION = 'be1b3be433ddf244f57e252260afda448249169d';
const V1_TAG = 'react-v1.3.56';
const V1_REVISION = '16e8ae2b3f26fdc2015cc10aa2d689edcbf60ca2';
const VERSIONED_ROOT = join(ROOT, 'docs/versioned');
const V2_CONTENT_ROOT = join(VERSIONED_ROOT, 'v2/content');
const V1_CONTENT_ROOT = join(VERSIONED_ROOT, 'v1/content');
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

function historicalPathsFromGit(tag) {
  return execFileSync('git', ['ls-tree', '-r', '--name-only', tag], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter((path) => PUBLIC_PATH.test(path))
    .sort();
}

function gitText(tag, path) {
  return execFileSync('git', ['show', `${tag}:${path}`], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
    .replaceAll('\r\n', '\n')
    .replace(/[ \t]+$/gm, '');
}

function snapshotText(contentRoot, path) {
  return readFileSync(join(contentRoot, path), 'utf8').replaceAll('\r\n', '\n');
}

function currentText(path) {
  return readFileSync(join(ROOT, path), 'utf8').replaceAll('\r\n', '\n');
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function historicalPackageVersions(tag) {
  const manifests = execFileSync('git', ['ls-tree', '-r', '--name-only', tag, 'packages'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter((path) => /^packages\/[^/]+\/package\.json$/.test(path))
    .sort();
  return Object.fromEntries(
    manifests
      .map((path) => JSON.parse(gitText(tag, path)))
      .filter(({ name, version }) => name?.startsWith('@tale-ui/') && version)
      .map(({ name, version }) => [name, version])
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function makeManifest({ v2Paths, v1Paths, readV2, readV1 }) {
  const currentPaths = currentPublicPaths();
  const currentEntries = contentEntries(currentPaths, currentText);
  const v2Entries = contentEntries(v2Paths, readV2);
  const v1Entries = contentEntries(v1Paths, readV1);
  const registry = JSON.parse(readFileSync(join(ROOT, 'registry/artifacts.json'), 'utf8'));
  return {
    $schema: '../../schemas/docs-provenance.schema.json',
    schemaVersion: '1.0.0',
    origin: 'https://tale-ui.github.io/tale-ui/',
    versions: [
      {
        major: 3,
        source: 'working-tree-public-docs',
        sourceRevision: registry.sourceRevision,
        contentDigest: digestEntries(currentEntries),
        packageVersions: registry.packageVersions,
        registryVersion: registry.registryVersion,
        publicAllowlist: currentPaths,
      },
      {
        major: 2,
        source: V2_TAG,
        sourceRevision: V2_REVISION,
        contentDigest: digestEntries(v2Entries),
        packageVersions: historicalPackageVersions(V2_TAG),
        registryVersion: 'legacy-v2',
        publicAllowlist: v2Paths,
      },
      {
        major: 1,
        source: V1_TAG,
        sourceRevision: V1_REVISION,
        contentDigest: digestEntries(v1Entries),
        packageVersions: { '@tale-ui/react': '1.3.56' },
        registryVersion: 'legacy-v1',
        publicAllowlist: v1Paths,
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
  const v2 = committed.versions.find(({ major }) => major === 2);
  const v1 = committed.versions.find(({ major }) => major === 1);
  if (!v2 || !v1) {
    throw new Error('Versioned docs manifest must retain historical v2 and v1.');
  }
  const actualV2SnapshotPaths = walk(V2_CONTENT_ROOT)
    .map((path) => relative(V2_CONTENT_ROOT, path).replaceAll('\\', '/'))
    .sort();
  const actualV1SnapshotPaths = walk(V1_CONTENT_ROOT)
    .map((path) => relative(V1_CONTENT_ROOT, path).replaceAll('\\', '/'))
    .sort();
  if (canonical(actualV2SnapshotPaths) !== canonical(v2.publicAllowlist)) {
    throw new Error('Immutable v2 snapshot files differ from the public allowlist.');
  }
  if (canonical(actualV1SnapshotPaths) !== canonical(v1.publicAllowlist)) {
    throw new Error('Retained v1 snapshot files differ from the public allowlist.');
  }
  const generated = makeManifest({
    v2Paths: actualV2SnapshotPaths,
    v1Paths: actualV1SnapshotPaths,
    readV2: (path) => snapshotText(V2_CONTENT_ROOT, path),
    readV1: (path) => snapshotText(V1_CONTENT_ROOT, path),
  });
  validateManifest(generated);
  if (canonical(generated) !== canonical(committed)) {
    throw new Error('docs/versioned/manifest.json is stale; run pnpm docs:versions:generate.');
  }
  const expectedRollback = {
    schemaVersion: '1.0.0',
    currentMajor: 3,
    previousMajor: 2,
    lastKnownGood: '/docs/v2/',
    manifestDigest: `sha256:${sha256(canonical(committed))}`,
  };
  if (canonical(expectedRollback) !== readFileSync(ROLLBACK_PATH, 'utf8')) {
    throw new Error('docs/versioned/rollback.json is stale.');
  }
  console.log(
    `OK: current v3, ${actualV2SnapshotPaths.length} immutable v2 files, and ${actualV1SnapshotPaths.length} retained v1 files`,
  );
  process.exit(0);
}

const v2Paths = historicalPathsFromGit(V2_TAG);
const v1Paths = walk(V1_CONTENT_ROOT)
  .map((path) => relative(V1_CONTENT_ROOT, path).replaceAll('\\', '/'))
  .sort();
if (v1Paths.length === 0) {
  throw new Error('Retained immutable v1 snapshot is missing.');
}
rmSync(V2_CONTENT_ROOT, { recursive: true, force: true });
for (const path of v2Paths) {
  const output = join(V2_CONTENT_ROOT, path);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, gitText(V2_TAG, path));
}
const manifest = makeManifest({
  v2Paths,
  v1Paths,
  readV2: (path) => gitText(V2_TAG, path),
  readV1: (path) => snapshotText(V1_CONTENT_ROOT, path),
});
validateManifest(manifest);
mkdirSync(VERSIONED_ROOT, { recursive: true });
writeFileSync(MANIFEST_PATH, canonical(manifest));
writeFileSync(
  ROLLBACK_PATH,
  canonical({
    schemaVersion: '1.0.0',
    currentMajor: 3,
    previousMajor: 2,
    lastKnownGood: '/docs/v2/',
    manifestDigest: `sha256:${sha256(canonical(manifest))}`,
  }),
);
console.log(
  `Generated current v3 provenance and immutable v2 snapshot (${v2Paths.length} files); retained ${v1Paths.length} v1 files.`,
);
