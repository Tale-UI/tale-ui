import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { loadAndValidateNativeInventory } from './lib/react-native-implementation-inventory.mjs';

const ROOT = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, ROOT), 'utf8'));

test('validates the canonical production inventory and count invariants', () => {
  const inventory = loadAndValidateNativeInventory();
  assert.equal(inventory.implementations.length, 40);
  assert.equal(
    inventory.implementations.filter(({ entrypointKind }) => entrypointKind === 'direct').length,
    27,
  );
  assert.equal(new Set(inventory.implementations.map(({ ownerModule }) => ownerModule)).size, 30);
});

test('rejects duplicate records, extra package subpaths, and noncanonical references', () => {
  const inventory = readJson('registry/platforms/react-native-implementations.json');
  const manifest = readJson('packages/react-native/package.json');
  const web = readJson('registry/components.json');

  assert.throws(
    () =>
      loadAndValidateNativeInventory({
        inventoryData: {
          ...inventory,
          implementations: [...inventory.implementations, inventory.implementations[0]],
        },
        manifestData: manifest,
        webRegistryData: web,
      }),
    /duplicate/,
  );
  assert.throws(
    () =>
      loadAndValidateNativeInventory({
        inventoryData: inventory,
        manifestData: {
          ...manifest,
          exports: { ...manifest.exports, './not-in-inventory': './src/button.tsx' },
        },
        webRegistryData: web,
      }),
    /exactly equal/,
  );
  assert.throws(
    () =>
      loadAndValidateNativeInventory({
        inventoryData: {
          ...inventory,
          implementations: inventory.implementations.map((record) =>
            record.id === 'Button' ? { ...record, recipeId: 'fabricated' } : record,
          ),
        },
        manifestData: manifest,
        webRegistryData: web,
      }),
    /noncanonical recipe/,
  );
});

test('uses TypeScript declarations to accept same-name re-exports and reject renamed exports', () => {
  const root = mkdtempSync(join(tmpdir(), 'tale-native-inventory-'));
  try {
    mkdirSync(join(root, 'package/src'), { recursive: true });
    mkdirSync(join(root, 'foundations'), { recursive: true });
    writeFileSync(join(root, 'package/src/direct.ts'), 'export const Direct = 1;\n');
    writeFileSync(
      join(root, 'package/src/owner.ts'),
      'export const Reexport = 1;\nexport const Original = 1;\n',
    );
    writeFileSync(join(root, 'package/src/reexport.ts'), "export { Reexport } from './owner';\n");
    writeFileSync(
      join(root, 'package/src/renamed.ts'),
      "export { Original as Renamed } from './owner';\n",
    );
    writeFileSync(
      join(root, 'foundations/contracts.ts'),
      "const foundationalIds = ['Direct', 'Reexport', 'Renamed'] as const;\n",
    );
    writeFileSync(
      join(root, 'foundations/recipes.ts'),
      'const foundationRecipeIds = [] as const;\n',
    );

    const records = [
      {
        id: 'Direct',
        slug: 'direct',
        publicSubpath: './direct',
        entrypoint: 'src/direct.ts',
        ownerModule: 'src/direct.ts',
        entrypointKind: 'direct',
        expectedSymbol: 'Direct',
        aliasOf: null,
        contractId: 'Direct',
        recipeId: null,
      },
      {
        id: 'Reexport',
        slug: 'reexport',
        publicSubpath: './reexport',
        entrypoint: 'src/reexport.ts',
        ownerModule: 'src/owner.ts',
        entrypointKind: 'reexport',
        expectedSymbol: 'Reexport',
        aliasOf: null,
        contractId: 'Reexport',
        recipeId: null,
      },
    ];
    const manifest = {
      exports: {
        '.': './src/index.ts',
        './provider': './src/provider.ts',
        './direct': './src/direct.ts',
        './reexport': './src/reexport.ts',
      },
    };
    const web = {
      components: records.map(({ id, slug }) => ({ name: id, slug })),
    };
    const options = {
      root,
      packageRoot: join(root, 'package'),
      contractsPath: join(root, 'foundations/contracts.ts'),
      recipesPath: join(root, 'foundations/recipes.ts'),
      enforceProductionCounts: false,
      manifestData: manifest,
      webRegistryData: web,
    };
    assert.equal(
      loadAndValidateNativeInventory({
        ...options,
        inventoryData: { schemaVersion: '1.0.0', implementations: records },
      }).implementations.length,
      2,
    );

    const renamed = {
      ...records[1],
      id: 'Renamed',
      slug: 'renamed',
      publicSubpath: './renamed',
      entrypoint: 'src/renamed.ts',
      expectedSymbol: 'Renamed',
      contractId: 'Renamed',
    };
    assert.throws(
      () =>
        loadAndValidateNativeInventory({
          ...options,
          inventoryData: { schemaVersion: '1.0.0', implementations: [records[0], renamed] },
          manifestData: {
            exports: {
              '.': './src/index.ts',
              './provider': './src/provider.ts',
              './direct': './src/direct.ts',
              './renamed': './src/renamed.ts',
            },
          },
          webRegistryData: {
            components: [
              { name: 'Direct', slug: 'direct' },
              { name: 'Renamed', slug: 'renamed' },
            ],
          },
        }),
      /renames Original as Renamed/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
