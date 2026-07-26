#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repositoryRoot = resolve(packageRoot, '../..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const matrix = JSON.parse(await readFile(join(packageRoot, 'test/validation/matrix.json'), 'utf8'));
const selectorExceptions = JSON.parse(
  await readFile(join(packageRoot, 'test/validation/selector-exceptions.json'), 'utf8'),
);
assert.equal(matrix.schemaVersion, '1.0.0');
const requestedNodeMajor = Number(
  process.env.TALE_PACKED_NODE_MAJOR ?? process.versions.node.split('.')[0],
);

assert.ok(
  matrix.nodeMajors.includes(requestedNodeMajor),
  `Unsupported Node matrix major: ${requestedNodeMajor}`,
);
assert.equal(
  Number(process.versions.node.split('.')[0]),
  requestedNodeMajor,
  `This process is Node ${process.versions.node}; run it under Node ${requestedNodeMajor}.`,
);

const fixtureRoot = await mkdtemp(join(tmpdir(), 'tale-styles-packed-'));
const packRoot = join(fixtureRoot, 'packs');
const consumerRoot = join(fixtureRoot, 'consumer');
const prebuiltDirectory = process.env.TALE_PACKED_TARBALL_DIR;

async function packWorkspace(relativeDirectory) {
  const directory = join(repositoryRoot, relativeDirectory);
  const before = new Set(await readdir(packRoot));
  execFileSync(pnpm, ['--dir', directory, 'pack', '--pack-destination', packRoot, '--silent'], {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
  const created = (await readdir(packRoot)).filter(
    (file) => file.endsWith('.tgz') && !before.has(file),
  );
  assert.equal(created.length, 1, `Expected one tarball from ${relativeDirectory}.`);
  return join(packRoot, created[0]);
}

async function resolveTarball(packageName, environmentName, relativeDirectory) {
  const explicit = process.env[environmentName];
  if (explicit) {
    return resolve(explicit);
  }
  if (prebuiltDirectory) {
    const stem = packageName.replace(/^@/, '').replace('/', '-');
    const pattern = new RegExp(`^${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d.*\\.tgz$`);
    const matches = (await readdir(resolve(prebuiltDirectory))).filter((file) =>
      pattern.test(file),
    );
    assert.equal(matches.length, 1, `Expected one ${packageName} tarball in ${prebuiltDirectory}.`);
    return join(resolve(prebuiltDirectory), matches[0]);
  }
  return packWorkspace(relativeDirectory);
}

try {
  await mkdir(packRoot);
  await mkdir(consumerRoot);
  const suppliedIndividualTarballs = ['TALE_CSS_TARBALL', 'TALE_STYLES_TARBALL'].filter(
    (name) => process.env[name],
  );
  if (!prebuiltDirectory && suppliedIndividualTarballs.length > 0) {
    assert.equal(
      suppliedIndividualTarballs.length,
      2,
      'Supply both TALE_CSS_TARBALL and TALE_STYLES_TARBALL or use TALE_PACKED_TARBALL_DIR.',
    );
  }
  if (prebuiltDirectory || suppliedIndividualTarballs.length > 0) {
    assert.equal(
      Number(process.env.TALE_PACKED_BUILD_NODE_MAJOR),
      matrix.packNodeMajor,
      `Prebuilt tarballs must declare TALE_PACKED_BUILD_NODE_MAJOR=${matrix.packNodeMajor}.`,
    );
  }
  const cssTarball = await resolveTarball('@tale-ui/css', 'TALE_CSS_TARBALL', 'packages/css');
  const stylesTarball = await resolveTarball(
    '@tale-ui/react-styles',
    'TALE_STYLES_TARBALL',
    'packages/styles',
  );

  await writeFile(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'tale-styles-packed-consumer',
        private: true,
        type: 'module',
        dependencies: {
          '@tale-ui/css': `file:${cssTarball}`,
          '@tale-ui/react-styles': `file:${stylesTarball}`,
        },
        pnpm: {
          overrides: {
            '@tale-ui/css': `file:${cssTarball}`,
          },
        },
      },
      null,
      2,
    )}\n`,
  );
  execFileSync(pnpm, ['install'], { cwd: consumerRoot, stdio: 'inherit' });

  const specifiers = Object.keys(packageJson.exports).map((subpath) =>
    subpath === '.' ? '@tale-ui/react-styles' : `@tale-ui/react-styles/${subpath.slice(2)}`,
  );
  await writeFile(
    join(consumerRoot, 'probe.mjs'),
    `import { readFile } from 'node:fs/promises';\n` +
      `const specifiers = ${JSON.stringify(specifiers)};\n` +
      `const headless = new Set(${JSON.stringify(
        selectorExceptions.headlessExports.map(({ subpath }) => subpath),
      )}.map((subpath) => '@tale-ui/react-styles/' + subpath.slice(2)));\n` +
      `for (const specifier of specifiers) {\n` +
      `  const resolved = import.meta.resolve(specifier);\n` +
      `  const css = await readFile(new URL(resolved), 'utf8');\n` +
      `  if (!css.trim()) throw new Error(\`\${specifier} resolved to empty CSS\`);\n` +
      `  if (specifier !== '@tale-ui/react-styles' && !headless.has(specifier)) {\n` +
      `    const slug = specifier.slice('@tale-ui/react-styles/'.length);\n` +
      `    const selector = slug === '_primitives' ? '.tale-' : '.tale-' + slug;\n` +
      `    if (!css.includes(selector)) throw new Error(\`\${specifier} omitted its own Tale selector\`);\n` +
      `  }\n` +
      `}\n`,
  );
  execFileSync(process.execPath, ['probe.mjs'], { cwd: consumerRoot, stdio: 'inherit' });
  process.stdout.write(`Packed Styles consumer passed on Node ${requestedNodeMajor}.\n`);
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}
