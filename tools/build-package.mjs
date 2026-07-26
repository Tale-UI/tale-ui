#!/usr/bin/env node

/**
 * Build script for Tale UI packages that publish dual CJS + ESM output.
 * Produces CJS + ESM bundles, type declarations,
 * a publish-ready package.json, and copies static files.
 *
 * Usage (from package dir): node ../../tools/build-package.mjs [--ignore "glob"]... [--copy file]...
 */

import { execaCommand } from 'execa';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parseArgs } from 'node:util';
import { createRequire } from 'node:module';
import { rewriteEsmSpecifiers } from './rewrite-esm-specifiers.mjs';

const require = createRequire(import.meta.url);

const cwd = process.cwd();
const pkgJsonPath = path.join(cwd, 'package.json');
const pkg = JSON.parse(await fs.readFile(pkgJsonPath, 'utf8'));
const buildDir = path.join(cwd, pkg.publishConfig?.directory ?? 'build');
const srcDir = path.join(cwd, 'src');

// ── CLI args ───────────────────────────────────────────────────────────────
const { values } = parseArgs({
  options: {
    ignore: { type: 'string', multiple: true, default: [] },
    copy: { type: 'string', multiple: true, default: [] },
    minimal: { type: 'boolean', default: false },
  },
  strict: false,
  allowPositionals: true,
});

const extraIgnores = /** @type {string[]} */ (values.ignore ?? []);
const extraCopy = /** @type {string[]} */ (values.copy ?? []);
const minimalBuild = values.minimal ?? false;

// ── Helpers ────────────────────────────────────────────────────────────────
const BASE_IGNORES = [
  '**/*.test.js',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.js',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.d.ts',
  '**/*.test/*.*',
  '**/test-cases/*.*',
];

const babelBin = path.dirname(require.resolve('@babel/cli/package.json'));
const babelCmd = path.join(babelBin, 'bin', 'babel.js');

function babelIgnoreList() {
  return [...BASE_IGNORES, ...extraIgnores].join(',');
}

async function fileExists(p) {
  return fs.stat(p).then(
    () => true,
    () => false,
  );
}

async function runBabel(outDir, envName) {
  const configFile = path.resolve(cwd, '../../babel.config.mjs');
  const cmd = [
    'node',
    babelCmd,
    '--config-file',
    configFile,
    '--extensions',
    '.js,.ts,.tsx',
    srcDir,
    '--out-dir',
    outDir,
    '--ignore',
    babelIgnoreList(),
    '--out-file-extension',
    '.js',
    '--compact',
    'auto',
    '--env-name',
    envName,
  ];
  await execaCommand(cmd.join(' '), { cwd, stdio: 'inherit', shell: true });
}

async function addLicenseHeader(filePath) {
  if (!(await fileExists(filePath))) {
    return;
  }
  const content = await fs.readFile(filePath, 'utf8');
  await fs.writeFile(
    filePath,
    `/**\n * ${pkg.name} v${pkg.version}\n *\n * @license ${pkg.license}\n * This source code is licensed under the ${pkg.license} license found in the\n * LICENSE file in the root directory of this source tree.\n */\n${content}`,
  );
  console.log(`License added to ${filePath}`);
}

// ── Clean ──────────────────────────────────────────────────────────────────
console.log(`Selected output directory: "${path.relative(cwd, buildDir)}"`);
await fs.rm(buildDir, { recursive: true, force: true });

// ── Babel: CJS → build/ ───────────────────────────────────────────────────
console.log('Transpiling files to "build" for "cjs" bundle.');
await runBabel(buildDir, 'production');
await addLicenseHeader(path.join(buildDir, 'index.js'));

// ── Babel: ESM → build/esm/ ───────────────────────────────────────────────
const esmDir = path.join(buildDir, 'esm');
console.log('Transpiling files to "build/esm" for "esm" bundle.');
await runBabel(esmDir, 'esm');

// ESM package.json marker
await fs.writeFile(
  path.join(esmDir, 'package.json'),
  JSON.stringify({ type: 'module', sideEffects: pkg.sideEffects ?? false }),
);
await addLicenseHeader(path.join(esmDir, 'index.js'));

// ── TypeScript declarations ────────────────────────────────────────────────
const tsconfigBuild = path.join(cwd, 'tsconfig.build.json');
if (await fileExists(tsconfigBuild)) {
  console.log('Building types...');
  // Build into a temp dir, then copy .d.ts files into build/ and build/esm/
  const tmpDir = path.join(buildDir, '__types_tmp');
  const tscBin = path.join(path.dirname(require.resolve('typescript/package.json')), 'bin', 'tsc');
  await execaCommand(
    `node ${tscBin} -p ${tsconfigBuild} --emitDeclarationOnly --outDir ${tmpDir}`,
    { cwd, stdio: 'inherit' },
  );

  // Copy .d.ts files into CJS root and ESM dirs
  const dtsFiles = [];
  async function collectDts(dir, rel) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(rel, entry.name);
      if (entry.isDirectory()) {
        await collectDts(fullPath, relPath);
      } else if (entry.name.endsWith('.d.ts') || entry.name.endsWith('.d.ts.map')) {
        dtsFiles.push(relPath);
      }
    }
  }

  // The tsc output may nest under a src/ dir depending on tsconfig
  let typesRoot = tmpDir;
  if (await fileExists(path.join(tmpDir, 'src'))) {
    typesRoot = path.join(tmpDir, 'src');
  }
  await collectDts(typesRoot, '');

  for (const relFile of dtsFiles) {
    const src = path.join(typesRoot, relFile);
    // Copy to both CJS root and ESM dir
    for (const dest of [path.join(buildDir, relFile), path.join(buildDir, 'esm', relFile)]) {
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.cp(src, dest);
    }
  }

  await fs.rm(tmpDir, { recursive: true, force: true });
  console.log(`Copied ${dtsFiles.length} type declaration files.`);
}

const rewritten = await rewriteEsmSpecifiers(esmDir);
console.log(
  `Rewrote ${rewritten.rewrittenSpecifiers} relative ESM specifiers in ${rewritten.rewrittenFiles} files.`,
);

// ── Generate build/package.json ────────────────────────────────────────────
const buildPkg = { ...pkg };
// Preserve postinstall hook for consumers, remove everything else
const postinstall = buildPkg.scripts?.postinstall;
delete buildPkg.scripts;
if (postinstall) {
  buildPkg.scripts = { postinstall };
}
delete buildPkg.devDependencies;
delete buildPkg.imports;
if (buildPkg.publishConfig) {
  delete buildPkg.publishConfig.directory;
}
// The build root contains CJS; build/esm/package.json marks the ESM subtree.
buildPkg.type = 'commonjs';

// Remap exports: ./src/foo/index.ts → CJS ./foo/index.js + ESM ./esm/foo/index.js
if (buildPkg.exports) {
  const newExports = {};
  for (const [key, value] of Object.entries(buildPkg.exports)) {
    // CSS exports: value is a string ("./src/foo.css") or object ({ types, default })
    const cssPath =
      typeof value === 'string'
        ? value
        : typeof value === 'object' && value !== null && typeof value.default === 'string'
          ? value.default
          : null;
    if (cssPath && cssPath.startsWith('./src/') && cssPath.endsWith('.css')) {
      const stripped = cssPath.replace(/^\.\/src\//, './');
      const srcFile = path.join(cwd, cssPath);
      const destFile = path.join(buildDir, stripped);
      await fs.mkdir(path.dirname(destFile), { recursive: true });
      await fs.cp(srcFile, destFile);
      // Copy types declaration if present in object form
      if (typeof value === 'object' && typeof value.types === 'string') {
        const typesStripped = value.types.replace(/^\.\/src\//, './');
        const typesSrc = path.join(cwd, value.types);
        const typesDest = path.join(buildDir, typesStripped);
        await fs.cp(typesSrc, typesDest);
        newExports[key] = { types: typesStripped, default: stripped };
      } else {
        newExports[key] = stripped;
      }
    } else if (typeof value === 'string' && value.startsWith('./src/')) {
      const stripped = value.replace(/^\.\/src\//, './').replace(/\.tsx?$/, '.js');
      const esmPath = stripped.replace(/^\.\//, './esm/');
      const typesPath = stripped.replace(/\.js$/, '.d.ts');
      const esmTypesPath = esmPath.replace(/\.js$/, '.d.ts');
      newExports[key] = {
        import: { types: esmTypesPath, default: esmPath },
        require: { types: typesPath, default: stripped },
        default: { types: esmTypesPath, default: esmPath },
      };
    } else {
      newExports[key] = value;
    }
  }
  buildPkg.exports = newExports;
  // Set main/types for the root export
  if (newExports['.']) {
    buildPkg.main = newExports['.'].require?.default ?? './index.js';
    buildPkg.types = newExports['.'].require?.types ?? './index.d.ts';
  }
}

await fs.writeFile(path.join(buildDir, 'package.json'), JSON.stringify(buildPkg, null, 2));

// ── Copy static files ──────────────────────────────────────────────────────
const repoRoot = path.resolve(cwd, '../..');
const filesToCopy = [
  { src: path.join(cwd, 'README.md'), fallback: path.join(repoRoot, 'README.md') },
  { src: path.join(cwd, 'LICENSE'), fallback: path.join(repoRoot, 'LICENSE') },
  { src: path.join(cwd, 'CHANGELOG.md'), fallback: path.join(repoRoot, 'CHANGELOG.md') },
  { src: path.join(cwd, 'CLAUDE.md') },
];

let copied = 0;
for (const { src, fallback } of filesToCopy) {
  const source = (await fileExists(src))
    ? src
    : fallback && (await fileExists(fallback))
      ? fallback
      : null;
  if (source) {
    await fs.cp(source, path.join(buildDir, path.basename(source)));
    copied++;
  }
}

// Copy bin/ directory if present
const binDir = path.join(cwd, 'bin');
if (await fileExists(binDir)) {
  await fs.cp(binDir, path.join(buildDir, 'bin'), { recursive: true });
  copied++;
}

// Copy current docs into build/docs/ (component guides, recipes, pitfalls, etc.).
// Historical material under docs/archive is intentionally excluded from package
// artifacts and the consumer-facing MCP documentation index.
if (!minimalBuild) {
  const docsDir = path.join(repoRoot, 'docs');
  if (await fileExists(docsDir)) {
    const archiveDir = path.join(docsDir, 'archive');
    await fs.cp(docsDir, path.join(buildDir, 'docs'), {
      recursive: true,
      filter(source) {
        const relative = path.relative(archiveDir, source);
        return relative.startsWith('..') || path.isAbsolute(relative);
      },
    });
    copied++;
  }

  // Copy registry data files (components.json, pitfalls.json, a2ui-catalog.json)
  // The MCP server reads these at runtime from __dirname/registry/ in consumer mode.
  const registryDir = path.join(repoRoot, 'registry');
  if (await fileExists(registryDir)) {
    await fs.cp(registryDir, path.join(buildDir, 'registry'), { recursive: true });
    copied++;
  }

  // Copy the MCP server and its core module — IS_MONOREPO detection inside
  // the scripts handles path differences at runtime.
  for (const file of ['mcp-server.mjs', 'mcp-core.mjs']) {
    const src = path.join(repoRoot, 'tools', file);
    if (await fileExists(src)) {
      await fs.cp(src, path.join(buildDir, file));
      copied++;
    }
  }
}

// Copy extra files (e.g., .npmignore)
for (const file of extraCopy) {
  const source = path.resolve(cwd, file);
  if (await fileExists(source)) {
    const sourceStats = await fs.stat(source);
    await fs.cp(source, path.join(buildDir, path.basename(file)), {
      recursive: sourceStats.isDirectory(),
    });
    copied++;
  }
}

console.log(`📋 Copied ${copied} files.`);
