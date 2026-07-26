#!/usr/bin/env node

import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const indexCss = await readFile(join(packageRoot, 'src/index.css'), 'utf8');
const expansionContract = JSON.parse(
  await readFile(join(packageRoot, 'test/validation/expansion-subpaths.json'), 'utf8'),
);
const selectorExceptions = JSON.parse(
  await readFile(join(packageRoot, 'test/validation/selector-exceptions.json'), 'utf8'),
);
const customPropertyInventory = JSON.parse(
  await readFile(join(packageRoot, 'test/validation/custom-property-inventory.json'), 'utf8'),
);
const expectedExpansionSubpaths = [
  './aspect-ratio',
  './blockquote',
  './button-group',
  './citation',
  './code',
  './lightbox',
  './markdown',
  './outline',
  './overflow-list',
  './resizable',
  './skeleton',
  './timestamp',
  './toast',
];

async function listCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return listCssFiles(path);
      }
      return entry.isFile() && entry.name.endsWith('.css') ? [path] : [];
    }),
  );
  return nested.flat();
}

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

const headlessExports = new Set(selectorExceptions.headlessExports.map(({ subpath }) => subpath));

const targets = new Set();
await Promise.all(
  Object.entries(packageJson.exports).map(async ([subpath, target]) => {
    assert.equal(typeof target, 'string', `${subpath} must resolve directly to CSS.`);
    assert.match(target, /^\.\/src\/.+\.css$/, `${subpath} must resolve to package CSS.`);
    assert.ok(!normalize(target).startsWith('..'), `${subpath} must remain inside the package.`);
    assert.ok(!targets.has(target), `${subpath} duplicates the export target ${target}.`);
    targets.add(target);
    const cssPath = join(packageRoot, target);
    await access(cssPath);
    if (subpath !== '.' && !headlessExports.has(subpath)) {
      const selector = subpath === './_primitives' ? '.tale-' : `.tale-${subpath.slice(2)}`;
      const targetCss = stripCssComments(await readFile(cssPath, 'utf8'));
      assert.ok(
        targetCss.includes(selector),
        `${subpath} must have the expected ${selector} selector in its own CSS target.`,
      );
    }
  }),
);

assert.equal(packageJson.main.replace(/^\.\//, ''), packageJson.exports['.'].replace(/^\.\//, ''));
assert.equal(packageJson.style.replace(/^\.\//, ''), packageJson.exports['.'].replace(/^\.\//, ''));

for (const [subpath, target] of Object.entries(packageJson.exports)) {
  if (subpath === '.') {
    continue;
  }
  const relativeTarget = target.replace('./src/', './');
  assert.ok(
    indexCss.includes(`@import '${relativeTarget}';`),
    `${subpath} is not included by the aggregate stylesheet.`,
  );
}

assert.equal(expansionContract.schemaVersion, '1.0.0');
assert.equal(selectorExceptions.schemaVersion, '1.0.0');
assert.deepEqual(
  [...headlessExports].sort(),
  ['./color-picker', './file-trigger'],
  'Headless Styles exceptions must remain explicit and minimal.',
);
for (const { subpath, rationale } of selectorExceptions.headlessExports) {
  assert.ok(Object.hasOwn(packageJson.exports, subpath), `${subpath} is not an exported subpath.`);
  assert.ok(rationale.trim().length > 0, `${subpath} must explain why it has no selector.`);
}
assert.deepEqual(
  expansionContract.subpaths.map(({ subpath }) => subpath),
  expectedExpansionSubpaths,
  'The component-equivalence Styles opt-in list must keep its frozen order.',
);
for (const entry of expansionContract.subpaths) {
  assert.equal(typeof entry.enabled, 'boolean', `${entry.subpath} must declare enabled.`);
  if (entry.enabled) {
    assert.ok(
      Object.hasOwn(packageJson.exports, entry.subpath),
      `${entry.subpath} is enabled for Styles validation but is not exported.`,
    );
  }
}

const declarationFiles = [
  ...(await listCssFiles(join(packageRoot, '../css/src'))),
  ...(await listCssFiles(join(packageRoot, 'src'))),
];
const declarationSources = await Promise.all(
  declarationFiles.map(async (file) => stripCssComments(await readFile(file, 'utf8'))),
);
const declaredTokens = new Set(
  declarationSources.flatMap((css) =>
    [...css.matchAll(/(--[a-z0-9_-]+)\s*:/gi)].map((match) => match[1]),
  ),
);
assert.equal(customPropertyInventory.schemaVersion, '1.0.0');
const externalCustomProperties = new Set(
  customPropertyInventory.properties.map(({ name, rationale }) => {
    assert.match(name, /^--[a-z0-9_-]+$/);
    assert.ok(rationale.trim().length > 0, `${name} must include provenance.`);
    return name;
  }),
);
for (const css of declarationSources) {
  for (const match of css.matchAll(/var\(\s*(--[a-z0-9_-]+)/gi)) {
    assert.ok(
      declaredTokens.has(match[1]) || externalCustomProperties.has(match[1]),
      `CSS references a custom property missing from token/runtime inventories: ${match[1]}.`,
    );
  }
}

const declaredDependencies = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.optionalDependencies ?? {}),
]);
for (const css of declarationSources) {
  for (const match of css.matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    if (specifier.startsWith('.') || specifier.startsWith('/')) {
      continue;
    }
    const packageName = specifier.startsWith('@')
      ? specifier.split('/').slice(0, 2).join('/')
      : specifier.split('/')[0];
    assert.ok(
      declaredDependencies.has(packageName),
      `CSS imports undeclared package dependency ${packageName}.`,
    );
  }
}

process.stdout.write(
  `Validated ${Object.keys(packageJson.exports).length} Styles package exports.\n`,
);
