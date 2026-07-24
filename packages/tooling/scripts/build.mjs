#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { chmod, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPOSITORY_ROOT = resolve(PACKAGE_ROOT, '../..');
const BUILD_ROOT = join(PACKAGE_ROOT, 'build');

await rm(BUILD_ROOT, { recursive: true, force: true });
execFileSync(
  process.execPath,
  [
    join(REPOSITORY_ROOT, 'node_modules/typescript/bin/tsc'),
    '-p',
    join(PACKAGE_ROOT, 'tsconfig.build.json'),
  ],
  { cwd: PACKAGE_ROOT, stdio: 'inherit' },
);

await mkdir(join(BUILD_ROOT, 'registry'), { recursive: true });
await Promise.all(
  ['artifacts.json', 'capabilities.json', 'roadmap-traceability.json'].map((file) =>
    cp(join(REPOSITORY_ROOT, 'registry', file), join(BUILD_ROOT, 'registry', file)),
  ),
);
const reactPackage = JSON.parse(
  await readFile(join(REPOSITORY_ROOT, 'packages/react/package.json'), 'utf8'),
);
await writeFile(
  join(BUILD_ROOT, 'registry/react-exports.json'),
  `${JSON.stringify(
    { name: reactPackage.name, exports: Object.keys(reactPackage.exports) },
    null,
    2,
  )}\n`,
);
await cp(join(REPOSITORY_ROOT, 'schemas'), join(BUILD_ROOT, 'schemas'), { recursive: true });
await cp(join(PACKAGE_ROOT, 'templates'), join(BUILD_ROOT, 'templates'), { recursive: true });
await cp(join(PACKAGE_ROOT, 'bin'), join(BUILD_ROOT, 'bin'), { recursive: true });
await Promise.all(
  ['tale.mjs', 'tale-mcp.mjs'].map((file) => chmod(join(BUILD_ROOT, 'bin', file), 0o755)),
);

await Promise.all(
  ['README.md', 'CLAUDE.md'].map((file) => cp(join(PACKAGE_ROOT, file), join(BUILD_ROOT, file))),
);
await cp(join(REPOSITORY_ROOT, 'LICENSE'), join(BUILD_ROOT, 'LICENSE'));

const sourceManifest = JSON.parse(await readFile(join(PACKAGE_ROOT, 'package.json'), 'utf8'));
const buildManifest = {
  ...sourceManifest,
  exports: {
    '.': { types: './index.d.ts', import: './index.js', default: './index.js' },
    './api': { types: './api.d.ts', import: './api.js', default: './api.js' },
    './contracts': {
      types: './contracts/index.d.ts',
      import: './contracts/index.js',
      default: './contracts/index.js',
    },
    './registry': {
      types: './registry.d.ts',
      import: './registry.js',
      default: './registry.js',
    },
    './mcp': { types: './mcp.d.ts', import: './mcp.js', default: './mcp.js' },
    './materialize': {
      types: './materialize.d.ts',
      import: './materialize.js',
      default: './materialize.js',
    },
    './operations': {
      types: './operations.d.ts',
      import: './operations.js',
      default: './operations.js',
    },
    './validation': {
      types: './validation/index.d.ts',
      import: './validation/index.js',
      default: './validation/index.js',
    },
    './package.json': './package.json',
  },
  main: './index.js',
  types: './index.d.ts',
};
delete buildManifest.scripts;
delete buildManifest.devDependencies;
delete buildManifest.publishConfig.directory;
await writeFile(join(BUILD_ROOT, 'package.json'), `${JSON.stringify(buildManifest, null, 2)}\n`);

process.stdout.write('Built @tale-ui/tooling with package-relative registry and schema assets.\n');
