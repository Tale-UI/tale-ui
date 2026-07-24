import type { ArtifactRecord, ArtifactRegistry } from '../contracts/artifact.js';
import type { ValidationDiagnostic } from '../contracts/validation.js';

function lineAndColumn(source: string, offset: number) {
  const prefix = source.slice(0, offset);
  const lines = prefix.split('\n');
  return { line: lines.length, column: lines.at(-1)!.length + 1 };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function componentKind(component: ArtifactRecord) {
  return component.metadata?.componentKind;
}

export function validateRegistryRules(
  code: string,
  path: string,
  registry: ArtifactRegistry,
): ValidationDiagnostic[] {
  const diagnostics: ValidationDiagnostic[] = [];
  const components = registry.artifacts.filter(
    (artifact) => artifact.kind === 'component' && artifact.package === '@tale-ui/react',
  );
  const bySlug = new Map(components.map((component) => [component.slug, component]));
  const imported = new Map<string, ArtifactRecord>();
  const importPattern =
    /import\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+['"]@tale-ui\/react\/([^'"]+)['"]/g;

  for (const match of code.matchAll(importPattern)) {
    const [, specifiers, slug] = match;
    const location = lineAndColumn(code, match.index);
    const component = bySlug.get(slug);
    if (!component) {
      diagnostics.push({
        code: 'TALE_INVALID_IMPORT',
        ruleId: 'registry.import',
        severity: 'error',
        path,
        ...location,
        message: `Import path '@tale-ui/react/${slug}' is not present in the installed registry.`,
      });
      continue;
    }
    for (const specifier of specifiers.split(',')) {
      const normalized = specifier.trim().replace(/^type\s+/, '');
      const [original, alias] = normalized.split(/\s+as\s+/);
      if (original) {
        imported.set((alias || original).trim(), component);
      }
    }
    if (component.lifecycle === 'deprecated') {
      diagnostics.push({
        code: 'TALE_DEPRECATED_ARTIFACT',
        ruleId: 'registry.lifecycle',
        severity: 'warning',
        path,
        ...location,
        message: component.replacementId
          ? `${component.name} is deprecated; use ${component.replacementId}.`
          : `${component.name} is deprecated.`,
      });
    }
  }

  for (const [name, component] of imported) {
    const escaped = escapeRegExp(name);
    const bare = new RegExp(`<${escaped}(?:\\s|/?>)`);
    const root = new RegExp(`<${escaped}\\.Root(?:\\s|/?>)`);
    const bareMatch = bare.exec(code);
    const rootMatch = root.exec(code);
    if (componentKind(component) === 'compound' && bareMatch && !rootMatch) {
      diagnostics.push({
        code: 'TALE_WRONG_COMPONENT_KIND',
        ruleId: 'registry.component-kind',
        severity: 'error',
        path,
        ...lineAndColumn(code, bareMatch.index),
        message: `${name} is compound; use <${name}.Root> instead of <${name}>.`,
      });
    }
    if (componentKind(component) === 'simple' && rootMatch) {
      diagnostics.push({
        code: 'TALE_WRONG_COMPONENT_KIND',
        ruleId: 'registry.component-kind',
        severity: 'error',
        path,
        ...lineAndColumn(code, rootMatch.index),
        message: `${name} is simple; use <${name}> instead of <${name}.Root>.`,
      });
    }
  }
  return diagnostics;
}
