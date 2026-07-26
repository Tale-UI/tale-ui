#!/usr/bin/env node

import assert from 'node:assert/strict';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePackage = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const builtPackage = JSON.parse(await readFile(join(packageRoot, 'build/package.json'), 'utf8'));

function assertLocalTarget(target, label) {
  assert.match(target, /^\.\//, `${label} must be package-relative.`);
  assert.ok(!normalize(target).startsWith('..'), `${label} must remain inside the package.`);
}

async function assertFile(root, target, label) {
  assertLocalTarget(target, label);
  await access(join(root, target));
}

assert.deepEqual(
  Object.keys(builtPackage.exports),
  Object.keys(sourcePackage.exports),
  'Built React exports must exactly match the source manifest.',
);

await Promise.all(
  Object.entries(sourcePackage.exports).map(async ([subpath, sourceTarget]) => {
    const builtTarget = builtPackage.exports[subpath];
    if (typeof sourceTarget === 'object') {
      await assertFile(packageRoot, sourceTarget.types, `${subpath} source types`);
      await assertFile(packageRoot, sourceTarget.default, `${subpath} source default`);
      assert.equal(builtTarget.types, sourceTarget.types.replace('./src/', './'));
      assert.equal(builtTarget.default, sourceTarget.default.replace('./src/', './'));
      await assertFile(join(packageRoot, 'build'), builtTarget.types, `${subpath} built types`);
      await assertFile(join(packageRoot, 'build'), builtTarget.default, `${subpath} built default`);
      return;
    }

    await assertFile(packageRoot, sourceTarget, `${subpath} source`);
    await Promise.all(
      ['import', 'require', 'default'].map(async (condition) => {
        assert.equal(
          typeof builtTarget[condition],
          'object',
          `${subpath} must expose ${condition}.`,
        );
        await assertFile(
          join(packageRoot, 'build'),
          builtTarget[condition].types,
          `${subpath} ${condition} types`,
        );
        await assertFile(
          join(packageRoot, 'build'),
          builtTarget[condition].default,
          `${subpath} ${condition} default`,
        );
      }),
    );
  }),
);

assert.equal(builtPackage.main, builtPackage.exports['.'].require.default);
assert.equal(builtPackage.types, builtPackage.exports['.'].require.types);

async function listFiles(root, relative = '') {
  const entries = await readdir(join(root, relative), { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(relative, entry.name);
      if (entry.isDirectory()) {
        return listFiles(root, path);
      }
      return [path.replaceAll('\\', '/')];
    }),
  );
  return files.flat().toSorted();
}

const buildRoot = join(packageRoot, 'build');
const docsFiles = await listFiles(join(buildRoot, 'docs'));
assert.ok(
  docsFiles.includes('consumer-claude-md-snippet.md'),
  'The setup binary requires the packaged consumer guidance.',
);
assert.ok(docsFiles.includes('recipes/index.md'), 'The MCP runtime requires packaged recipes.');
assert.ok(
  docsFiles.every((path) => path.endsWith('.md')),
  'Packaged React docs must contain Markdown source only.',
);
for (const forbidden of ['.next/', 'archive/', 'node_modules/', 'out/', 'src/', 'versioned/']) {
  assert.ok(
    docsFiles.every((path) => !path.startsWith(forbidden)),
    `Packaged React docs must exclude ${forbidden}`,
  );
}
assert.deepEqual(
  await listFiles(join(buildRoot, 'registry')),
  ['a2ui-catalog.json', 'components.json', 'pitfalls.json'],
  'The packed registry must contain only MCP runtime data.',
);
await Promise.all(
  ['mcp-core.mjs', 'mcp-server.mjs', 'bin/setup.mjs'].map((path) => access(join(buildRoot, path))),
);
const buildStats = await stat(buildRoot);
assert.ok(buildStats.isDirectory());

process.stdout.write(
  `Validated ${Object.keys(sourcePackage.exports).length} React package exports.\n`,
);
