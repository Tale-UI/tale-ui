import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import ts from 'typescript';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const requiredFields = [
  'id',
  'slug',
  'publicSubpath',
  'entrypoint',
  'ownerModule',
  'entrypointKind',
  'expectedSymbol',
  'aliasOf',
  'contractId',
  'recipeId',
];

const unwrapExpression = (node) => {
  let current = node;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
};

const extractStringArray = (path, variableName) => {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== variableName) {
        continue;
      }
      const initializer = declaration.initializer && unwrapExpression(declaration.initializer);
      if (!initializer || !ts.isArrayLiteralExpression(initializer)) {
        throw new Error(`${variableName} must be a literal array.`);
      }
      return initializer.elements.map((element) => {
        const value = unwrapExpression(element);
        if (!ts.isStringLiteral(value)) {
          throw new Error(`${variableName} must contain only string literals.`);
        }
        return value.text;
      });
    }
  }
  throw new Error(`Missing ${variableName} in ${path}.`);
};

const assertUnique = (records, field) => {
  const values = records.map((record) => record[field]);
  if (new Set(values).size !== values.length) {
    throw new Error(`React Native inventory has duplicate ${field} values.`);
  }
};

const sourceModuleSymbol = (checker, sourceFile, description) => {
  const symbol = checker.getSymbolAtLocation(sourceFile);
  if (!symbol) {
    throw new Error(`Cannot resolve TypeScript module for ${description}.`);
  }
  return symbol;
};

const declarationFiles = (symbol) =>
  new Set(
    (symbol.declarations ?? []).map((declaration) => resolve(declaration.getSourceFile().fileName)),
  );

export function loadAndValidateNativeInventory({
  root = resolve(import.meta.dirname, '../..'),
  inventoryData,
  manifestData,
  webRegistryData,
  packageRoot = join(root, 'packages/react-native'),
  contractsPath = join(root, 'packages/foundations/src/contracts.ts'),
  recipesPath = join(root, 'packages/foundations/src/recipes.ts'),
  enforceProductionCounts = true,
} = {}) {
  const inventory =
    inventoryData ?? readJson(join(root, 'registry/platforms/react-native-implementations.json'));
  const manifest = manifestData ?? readJson(join(packageRoot, 'package.json'));
  const web = webRegistryData ?? readJson(join(root, 'registry/components.json'));

  if (inventory.schemaVersion !== '1.0.0' || !Array.isArray(inventory.implementations)) {
    throw new Error('React Native implementation inventory must use schema 1.0.0.');
  }
  const records = inventory.implementations;
  for (const record of records) {
    for (const field of requiredFields) {
      if (!Object.hasOwn(record, field)) {
        throw new Error(`${record.id ?? 'Inventory record'} is missing ${field}.`);
      }
    }
    if (!['direct', 'reexport'].includes(record.entrypointKind)) {
      throw new Error(`${record.id} has invalid entrypointKind ${record.entrypointKind}.`);
    }
    if (record.aliasOf !== null) {
      throw new Error(`${record.id} is an alias; the approved inventory permits zero aliases.`);
    }
  }
  for (const field of ['id', 'slug', 'publicSubpath', 'entrypoint']) {
    assertUnique(records, field);
  }

  const webById = new Map(web.components.map((component) => [component.name, component]));
  for (const record of records) {
    const component = webById.get(record.id);
    if (!component) {
      throw new Error(`${record.id} is absent from registry/components.json.`);
    }
    if (component.slug !== record.slug) {
      throw new Error(`${record.id} inventory slug does not match the React registry.`);
    }
  }

  const expectedExportKeys = [
    '.',
    './provider',
    ...records.map(({ publicSubpath }) => publicSubpath),
  ];
  const actualExportKeys = Object.keys(manifest.exports ?? {});
  if (
    expectedExportKeys.length !== actualExportKeys.length ||
    expectedExportKeys.some((key) => !actualExportKeys.includes(key))
  ) {
    throw new Error(
      'Native package exports must exactly equal root, provider, and inventory subpaths.',
    );
  }
  for (const record of records) {
    if (manifest.exports[record.publicSubpath] !== `./${record.entrypoint}`) {
      throw new Error(`${record.id} package export does not match its inventory entrypoint.`);
    }
  }

  const contractIds = extractStringArray(contractsPath, 'foundationalIds');
  const recipeComponents = extractStringArray(recipesPath, 'foundationRecipeIds');
  const contracts = new Set(contractIds);
  const recipes = new Map(
    recipeComponents.map((component) => [component.toLowerCase(), component]),
  );
  for (const record of records) {
    const expectedContract = contracts.has(record.id) ? record.id : null;
    if (record.contractId !== expectedContract) {
      throw new Error(`${record.id} has a noncanonical contract reference.`);
    }
    const expectedRecipe = recipeComponents.includes(record.id) ? record.id.toLowerCase() : null;
    if (record.recipeId !== expectedRecipe) {
      throw new Error(`${record.id} has a noncanonical recipe reference.`);
    }
    if (record.recipeId && recipes.get(record.recipeId) !== record.contractId) {
      throw new Error(`${record.id} recipe does not belong to its contract component.`);
    }
  }

  const rootNames = [
    ...new Set(
      records.flatMap(({ entrypoint, ownerModule }) => [
        resolve(packageRoot, entrypoint),
        resolve(packageRoot, ownerModule),
      ]),
    ),
  ];
  for (const path of rootNames) {
    if (!existsSync(path)) {
      throw new Error(`React Native inventory source is missing: ${path}.`);
    }
  }
  const program = ts.createProgram({
    rootNames,
    options: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2022,
      skipLibCheck: true,
      noEmit: true,
    },
  });
  const checker = program.getTypeChecker();

  for (const record of records) {
    const entrypoint = resolve(packageRoot, record.entrypoint);
    const owner = resolve(packageRoot, record.ownerModule);
    const sourceFile = program.getSourceFile(entrypoint);
    if (!sourceFile) {
      throw new Error(`Cannot load ${record.id} entrypoint ${record.entrypoint}.`);
    }
    const moduleSymbol = sourceModuleSymbol(checker, sourceFile, record.entrypoint);
    const exported = checker
      .getExportsOfModule(moduleSymbol)
      .find((symbol) => symbol.getName() === record.expectedSymbol);
    if (!exported) {
      throw new Error(`${record.id} entrypoint does not export ${record.expectedSymbol}.`);
    }
    const isAlias = Boolean(exported.flags & ts.SymbolFlags.Alias);
    if (record.entrypointKind === 'direct') {
      if (isAlias || !declarationFiles(exported).has(entrypoint)) {
        throw new Error(`${record.id} must directly declare ${record.expectedSymbol}.`);
      }
      if (entrypoint !== owner) {
        throw new Error(`${record.id} direct entrypoint must own its symbol.`);
      }
    } else {
      if (!isAlias) {
        throw new Error(`${record.id} must be a TypeScript re-export.`);
      }
      const aliased = checker.getAliasedSymbol(exported);
      if (record.aliasOf === null && aliased.getName() !== record.expectedSymbol) {
        throw new Error(`${record.id} renames ${aliased.getName()} as ${record.expectedSymbol}.`);
      }
      if (!declarationFiles(aliased).has(owner)) {
        throw new Error(`${record.id} resolves to an owner other than ${record.ownerModule}.`);
      }
    }
  }

  if (enforceProductionCounts) {
    const direct = records.filter(({ entrypointKind }) => entrypointKind === 'direct').length;
    const reexports = records.length - direct;
    const owners = new Set(records.map(({ ownerModule }) => ownerModule)).size;
    if (records.length !== 40 || direct !== 27 || reexports !== 13 || owners !== 30) {
      throw new Error(
        `Native inventory counts must be 40 records, 27 direct, 13 re-export, and 30 owners; ` +
          `received ${records.length}, ${direct}, ${reexports}, and ${owners}.`,
      );
    }
    if (actualExportKeys.length !== 42) {
      throw new Error(
        `Native package must expose exactly 42 export keys; found ${actualExportKeys.length}.`,
      );
    }
  }

  return Object.freeze({
    schemaVersion: inventory.schemaVersion,
    implementations: Object.freeze(records.map((record) => Object.freeze({ ...record }))),
  });
}
