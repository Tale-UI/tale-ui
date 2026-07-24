import ts from 'typescript';
import type { ArtifactRecord, ArtifactRegistry } from '../contracts/artifact.js';
import type { ValidationDiagnostic } from '../contracts/validation.js';

function location(sourceFile: ts.SourceFile, node: ts.Node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: position.line + 1, column: position.character + 1 };
}

function componentKind(component?: ArtifactRecord) {
  return component?.metadata?.componentKind;
}

function scriptKind(path: string) {
  if (path.endsWith('.tsx')) {
    return ts.ScriptKind.TSX;
  }
  if (path.endsWith('.jsx')) {
    return ts.ScriptKind.JSX;
  }
  if (path.endsWith('.js') || path.endsWith('.mjs') || path.endsWith('.cjs')) {
    return ts.ScriptKind.JS;
  }
  return ts.ScriptKind.TS;
}

export function validateRegistryRules(
  code: string,
  path: string,
  registry: ArtifactRegistry,
  publicReactExports: ReadonlySet<string>,
): ValidationDiagnostic[] {
  const diagnostics: ValidationDiagnostic[] = [];
  const components = registry.artifacts.filter(
    (artifact) => artifact.kind === 'component' && artifact.package === '@tale-ui/react',
  );
  const bySlug = new Map(components.map((component) => [component.slug, component]));
  const imported = new Map<string, ArtifactRecord>();
  const sourceFile = ts.createSourceFile(
    path,
    code,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(path),
  );

  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      (statement.moduleSpecifier.text !== '@tale-ui/react' &&
        !statement.moduleSpecifier.text.startsWith('@tale-ui/react/'))
    ) {
      continue;
    }
    const importPath = statement.moduleSpecifier.text;
    if (!publicReactExports.has(importPath)) {
      diagnostics.push({
        code: 'TALE_INVALID_IMPORT',
        ruleId: 'registry.import',
        severity: 'error',
        path,
        ...location(sourceFile, statement.moduleSpecifier),
        message: `Import path '${importPath}' is not a public @tale-ui/react export.`,
      });
      continue;
    }
    const slug = importPath.startsWith('@tale-ui/react/')
      ? importPath.slice('@tale-ui/react/'.length)
      : '';
    const component = bySlug.get(slug);
    if (!component) {
      continue;
    }
    const namedBindings = statement.importClause?.namedBindings;
    if (namedBindings && ts.isNamedImports(namedBindings) && !statement.importClause?.isTypeOnly) {
      for (const specifier of namedBindings.elements) {
        if (!specifier.isTypeOnly) {
          imported.set(specifier.name.text, component);
        }
      }
    }
    if (component.lifecycle === 'deprecated') {
      diagnostics.push({
        code: 'TALE_DEPRECATED_ARTIFACT',
        ruleId: 'registry.lifecycle',
        severity: 'warning',
        path,
        ...location(sourceFile, statement.moduleSpecifier),
        message: component.replacementId
          ? `${component.name} is deprecated; use ${component.replacementId}.`
          : `${component.name} is deprecated.`,
      });
    }
  }

  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const { tagName } = node;
      if (ts.isIdentifier(tagName)) {
        const component = imported.get(tagName.text);
        if (componentKind(component) === 'compound') {
          diagnostics.push({
            code: 'TALE_WRONG_COMPONENT_KIND',
            ruleId: 'registry.component-kind',
            severity: 'error',
            path,
            ...location(sourceFile, tagName),
            message: `${tagName.text} is compound; use <${tagName.text}.Root> instead of <${tagName.text}>.`,
          });
        }
      } else if (
        ts.isPropertyAccessExpression(tagName) &&
        ts.isIdentifier(tagName.expression) &&
        tagName.name.text === 'Root'
      ) {
        const component = imported.get(tagName.expression.text);
        if (componentKind(component) === 'simple') {
          diagnostics.push({
            code: 'TALE_WRONG_COMPONENT_KIND',
            ruleId: 'registry.component-kind',
            severity: 'error',
            path,
            ...location(sourceFile, tagName),
            message: `${tagName.expression.text} is simple; use <${tagName.expression.text}> instead of <${tagName.expression.text}.Root>.`,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return diagnostics;
}
