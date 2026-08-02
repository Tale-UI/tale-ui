import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const sourceRoot = new URL('../src/', import.meta.url);
const colorProperties = new Set([
  'backgroundColor',
  'borderBottomColor',
  'borderColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'boxShadow',
  'color',
  'outlineColor',
  'placeholderTextColor',
  'shadowColor',
  'textDecorationColor',
  'textShadowColor',
  'tintColor',
]);
const typographyProperties = new Set([
  'fontFamily',
  'fontSize',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
]);
const rawColorPattern = /#[\da-f]{3,8}\b|rgba?\s*\(|hsla?\s*\(/i;

const propertyName = (node) => {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) {
    return node.text;
  }
  return undefined;
};

const collectLiterals = (node, literals = []) => {
  if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) {
    literals.push(node.text);
    return literals;
  }
  ts.forEachChild(node, (child) => collectLiterals(child, literals));
  return literals;
};

test('React Native component colors and typography originate from foundational tokens', async () => {
  const filenames = (await readdir(sourceRoot))
    .filter((filename) => /\.(?:ts|tsx)$/.test(filename))
    .sort();
  const failures = (
    await Promise.all(
      filenames.map(async (filename) => {
        const fileFailures = [];
        const absolutePath = path.join(fileURLToPath(sourceRoot), filename);
        const source = await readFile(absolutePath, 'utf8');
        if (rawColorPattern.test(source)) {
          fileFailures.push(`${filename}: contains a raw hex/rgb/hsl color literal`);
        }
        const sourceFile = ts.createSourceFile(
          filename,
          source,
          ts.ScriptTarget.Latest,
          true,
          filename.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
        );

        const visit = (node) => {
          if (ts.isPropertyAssignment(node)) {
            const name = propertyName(node.name);
            if (name && colorProperties.has(name)) {
              const disallowed = collectLiterals(node.initializer);
              if (disallowed.length > 0) {
                fileFailures.push(
                  `${filename}:${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1} ` +
                    `${name} contains literal ${JSON.stringify(disallowed[0])}`,
                );
              }
            }
            if (name && typographyProperties.has(name)) {
              const literals = collectLiterals(node.initializer);
              if (literals.length > 0) {
                fileFailures.push(
                  `${filename}:${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1} ` +
                    `${name} contains literal ${JSON.stringify(literals[0])}`,
                );
              }
            }
          }
          if (ts.isJsxAttribute(node)) {
            const name = node.name.text;
            if (
              colorProperties.has(name) &&
              node.initializer &&
              ts.isStringLiteral(node.initializer)
            ) {
              fileFailures.push(
                `${filename}:${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1} ` +
                  `${name} contains literal ${JSON.stringify(node.initializer.text)}`,
              );
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(sourceFile);
        return fileFailures;
      }),
    )
  ).flat();

  assert.deepEqual(failures, []);
});
