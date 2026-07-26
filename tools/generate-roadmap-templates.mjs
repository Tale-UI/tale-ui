#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(ROOT, 'packages/tooling/templates');
const CHECK = process.argv.includes('--check');

const DEFINITIONS = [
  {
    slug: 'settings-page',
    recipe: 'settings-page',
    golden: 'settings-page',
  },
  {
    slug: 'chart-dashboard',
    recipe: 'dashboard-with-charts',
    golden: 'area-chart-revenue',
    dependencies: { '@tale-ui/charts': '^0.1.5' },
  },
  {
    slug: 'sortable-table',
    recipe: 'data-table-with-sorting',
    golden: 'table-controller-sorting',
  },
  {
    slug: 'validated-form',
    recipe: 'form-with-validation',
    golden: 'form-login',
  },
  {
    slug: 'react-hook-form',
    recipe: 'react-hook-form',
    golden: 'form-login',
    dependencies: { 'react-hook-form': '^7.62.0' },
  },
  {
    slug: 'sidebar-header',
    recipe: 'sidebar-with-header',
    golden: 'sidebar-basic',
  },
  {
    slug: 'app-header',
    recipe: 'app-header-navigation',
    golden: 'header-nav-basic',
  },
  {
    slug: 'command-palette-dashboard',
    recipe: 'command-palette-dashboard',
    golden: 'command-palette-hook',
  },
  {
    slug: 'empty-state',
    recipe: 'empty-data-state',
    golden: 'empty-state-no-results',
  },
  {
    slug: 'loading-patterns',
    recipe: 'loading-patterns',
    golden: 'loading-spinner',
  },
  {
    slug: 'chat-mobile',
    recipe: 'chat-mobile',
    golden: 'chat-ordinary-data',
  },
  {
    slug: 'chat-artifact-panel',
    recipe: 'chat-artifact-panel',
    golden: 'chat-ordinary-data',
  },
];

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(value) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

function localImportKey(spec) {
  const value = spec.trim().replace(/^type\s+/, '');
  return (value.match(/\s+as\s+(.+)$/)?.[1] || value).trim();
}

function coalesceImports(code) {
  const lines = code.split('\n');
  const imports = new Map();
  const remove = new Set();
  lines.forEach((line, index) => {
    const match = line.match(/^import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"];?\s*$/);
    if (!match) {
      return;
    }
    const [, raw, module] = match;
    if (!imports.has(module)) {
      imports.set(module, { index, specs: new Map() });
    }
    const entry = imports.get(module);
    for (const item of raw.split(',')) {
      const spec = item.trim();
      if (spec) {
        entry.specs.set(localImportKey(spec), spec);
      }
    }
    if (entry.index !== index) {
      remove.add(index);
    }
  });
  for (const [module, entry] of imports) {
    lines[entry.index] = `import { ${[...entry.specs.values()].join(', ')} } from '${module}';`;
  }
  return lines.filter((_, index) => !remove.has(index)).join('\n');
}

function recipeSource(slug) {
  const markdown = readFileSync(join(ROOT, `docs/recipes/${slug}.md`), 'utf8').replaceAll(
    '\r\n',
    '\n',
  );
  const blocks = [...markdown.matchAll(/```tsx\n([\s\S]*?)```/g)].map((match) => match[1]);
  if (blocks.length === 0) {
    throw new Error(`Recipe ${slug} has no TSX source`);
  }
  let code = blocks.join('\n\n');
  const parsed = ts.createSourceFile(
    'template.tsx',
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const importRanges = parsed.statements.filter(ts.isImportDeclaration).map((statement) => ({
    start: statement.getFullStart(),
    end: statement.getEnd(),
    text: statement.getText(parsed),
  }));
  const imports = [...new Set(importRanges.map(({ text }) => text))];
  for (const range of importRanges.toReversed()) {
    code = `${code.slice(0, range.start)}${code.slice(range.end)}`;
  }
  code = coalesceImports(`${imports.join('\n')}\n\n${code.trimStart()}`)
    .replace("import { useState } from 'react';", "import * as React from 'react';")
    .replaceAll(/(?<!\.)\buseState\(/g, 'React.useState(')
    .replaceAll('console.log(', 'console.warn(')
    .replace(
      /await new Promise\(\(resolve\) => setTimeout\(resolve, (\d+)\)\);/g,
      'await new Promise((resolve) => {\n    setTimeout(resolve, $1);\n  });',
    )
    .replace(/\bif \(([^\n]+)\) return ([^\n]+);/g, 'if ($1) { return $2; }')
    .replace(/\(\s*e\s*\)\s*=>/g, '(event) =>')
    .replace(/\be\.preventDefault\(\)/g, 'event.preventDefault()')
    .replace(/^import\s+['"]@tale-ui\/charts\/styles['"];?\n/gm, '');
  if (!/export\s+function\s+Example\b/.test(code)) {
    const functions = [...code.matchAll(/^(export(?:\s+default)?\s+)?function\s+(\w+)/gm)];
    const target = functions.at(-1);
    if (!target) {
      throw new Error(`Recipe ${slug} has no function declaration`);
    }
    code = `${code.slice(0, target.index)}export function Example${code.slice(
      target.index + target[0].length,
    )}`;
  }
  return code.endsWith('\n') ? code : `${code}\n`;
}

function outputs(definition) {
  const source = recipeSource(definition.recipe);
  const skeleton =
    "import { Text } from '@tale-ui/react/text';\n\n" +
    'export function Example() {\n' +
    `  return <Text>Implement the ${definition.slug.replaceAll('-', ' ')} template here.</Text>;\n` +
    '}\n';
  const dependencies = {
    '@tale-ui/react': '^3.0.0',
    react: '>=18.0.0',
    ...(source.includes("from 'lucide-react'") ? { 'lucide-react': '^0.468.0' } : {}),
    ...(definition.dependencies || {}),
  };
  const preimage = {
    schemaVersion: '1.0.0',
    id: `tale:template:${definition.slug}`,
    version: '2.0.0',
    source: 'source/App.tsx',
    skeleton: 'skeleton/App.tsx',
    dependencies,
    preview: {
      recipe: `docs/recipes/${definition.recipe}.md`,
      accessibility: 'keyboard, screen-reader, zoom, contrast, and reduced-motion review required',
      responsive: true,
    },
    golden: `tools/golden-prompts/${definition.golden}.json`,
    compatibility: {
      react: '>=18.0.0',
      tale: '>=3.0.0 <4.0.0',
      frameworks: ['next', 'vite'],
    },
    appearance: ['light', 'dark'],
    rtl: true,
    provenance: {
      source: `docs/recipes/${definition.recipe}.md`,
      firstParty: true,
    },
    license: 'MIT',
  };
  return {
    'template.json': canonical({ ...preimage, digest: digest(canonical(preimage)) }),
    'source/App.tsx': source,
    'skeleton/App.tsx': skeleton,
  };
}

function checkOrWrite(path, content) {
  if (CHECK) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) {
      throw new Error(`STALE: ${path.slice(ROOT.length + 1)}`);
    }
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

if (!CHECK) {
  rmSync(OUTPUT, { recursive: true, force: true });
}

for (const definition of DEFINITIONS) {
  for (const [path, content] of Object.entries(outputs(definition))) {
    checkOrWrite(join(OUTPUT, definition.slug, path), content);
  }
}

if (CHECK) {
  const actual = readdirSync(OUTPUT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const expected = DEFINITIONS.map((definition) => definition.slug).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Template inventory mismatch: expected ${expected.join(', ')}`);
  }
  process.stdout.write(`OK: ${DEFINITIONS.length} roadmap templates are deterministic\n`);
} else {
  process.stdout.write(`GENERATED: ${DEFINITIONS.length} roadmap templates\n`);
}
