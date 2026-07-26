import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const EXPLICIT_RUNTIME_EXTENSION = /\.(?:cjs|css|js|json|mjs|node|wasm)$/i;

function collectRelativeSpecifiers(filePath, source) {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.d.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS,
  );
  const specifiers = [];

  function addSpecifier(node) {
    if (!ts.isStringLiteralLike(node) || !node.text.startsWith('.')) {
      return;
    }

    specifiers.push({
      specifier: node.text,
      start: node.getStart(sourceFile) + 1,
      end: node.getEnd() - 1,
    });
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier) {
        addSpecifier(node.moduleSpecifier);
      }
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0
    ) {
      addSpecifier(node.arguments[0]);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      addSpecifier(node.argument.literal);
    } else if (ts.isExternalModuleReference(node) && node.expression) {
      addSpecifier(node.expression);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return specifiers.sort((left, right) => left.start - right.start);
}

async function exists(filePath) {
  return fs.stat(filePath).then(
    () => true,
    () => false,
  );
}

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(filePath)));
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts')) {
      files.push(filePath);
    }
  }

  return files;
}

async function runtimeSpecifier(filePath, specifier) {
  if (EXPLICIT_RUNTIME_EXTENSION.test(specifier)) {
    return specifier;
  }

  const candidate = path.resolve(path.dirname(filePath), specifier);
  if ((await exists(`${candidate}.js`)) || (await exists(`${candidate}.d.ts`))) {
    return `${specifier}.js`;
  }

  if (
    (await exists(path.join(candidate, 'index.js'))) ||
    (await exists(path.join(candidate, 'index.d.ts')))
  ) {
    return `${specifier.replace(/\/$/, '')}/index.js`;
  }

  throw new Error(`Cannot resolve relative ESM specifier "${specifier}" from ${filePath}`);
}

export async function rewriteEsmSpecifiers(directory) {
  const files = await collectFiles(directory);
  let rewrittenFiles = 0;
  let rewrittenSpecifiers = 0;

  for (const filePath of files) {
    const source = await fs.readFile(filePath, 'utf8');
    const specifiers = collectRelativeSpecifiers(filePath, source);
    if (specifiers.length === 0) {
      continue;
    }

    let cursor = 0;
    let output = '';
    let changed = false;

    for (const match of specifiers) {
      const specifier = match.specifier;
      const rewritten = await runtimeSpecifier(filePath, specifier);
      output += source.slice(cursor, match.start);
      output += rewritten;
      cursor = match.end;
      if (rewritten !== specifier) {
        changed = true;
        rewrittenSpecifiers++;
      }
    }

    if (changed) {
      output += source.slice(cursor);
      await fs.writeFile(filePath, output);
      rewrittenFiles++;
    }
  }

  return { rewrittenFiles, rewrittenSpecifiers };
}
