#!/usr/bin/env node
/**
 * Validate every TSX recipe in docs/recipes.
 *
 * The validator extracts the same renderable code shape that Recipe Studio uses:
 * all fenced tsx blocks in a recipe are joined, duplicate imports from separate
 * docs/preview blocks are coalesced, and the last function is exposed as
 * `Example` when the recipe does not provide one explicitly.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RECIPES_DIR = join(ROOT, 'docs', 'recipes');
const VALIDATOR = join(ROOT, 'tools', 'validate-generated.mjs');

function importLocalKey(spec) {
  let value = spec.trim();
  if (value.startsWith('type ')) {
    value = value.slice(5).trim();
  }
  const alias = value.match(/\s+as\s+(.+)$/);
  return (alias ? alias[1] : value).trim();
}

function coalesceNamedImports(code) {
  const lines = code.split('\n');
  const importsByModule = new Map();
  const removeLines = new Set();

  lines.forEach((line, index) => {
    const match = line.match(/^import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"];?\s*$/);
    if (!match) {
      return;
    }

    const [, rawSpecs, modulePath] = match;
    if (!importsByModule.has(modulePath)) {
      importsByModule.set(modulePath, { index, specs: new Map() });
    }
    const entry = importsByModule.get(modulePath);

    for (const rawSpec of rawSpecs.split(',')) {
      const spec = rawSpec.trim();
      if (!spec) {
        continue;
      }
      const localKey = importLocalKey(spec);
      if (!entry.specs.has(localKey)) {
        entry.specs.set(localKey, spec);
      }
    }

    if (entry.index !== index) {
      removeLines.add(index);
    }
  });

  for (const [modulePath, entry] of importsByModule) {
    lines[entry.index] = `import { ${[...entry.specs.values()].join(', ')} } from '${modulePath}';`;
  }

  return lines.filter((_, index) => !removeLines.has(index)).join('\n');
}

const DISALLOWED_STYLE_PROPS = new Set([
  'background',
  'backgroundColor',
  'border',
  'borderBottom',
  'borderColor',
  'borderLeft',
  'borderRadius',
  'borderRight',
  'borderTop',
  'boxShadow',
  'color',
  'cursor',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'opacity',
  'textAlign',
  'textDecoration',
  'textTransform',
]);

const UTILITY_CLASS_PATTERN =
  /^(?:text|font|w|h|min-w|min-h|max-w|max-h|flex|grid|gap|items|justify|content|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|bg|border|rounded|shadow|opacity|overflow|whitespace|truncate)-/;

const ALLOWED_DESIGN_SYSTEM_CLASSES = new Set(['dark', 'light']);

function lineForIndex(code, index) {
  return code.slice(0, index).split('\n').length;
}

function validateRecipeStyling(markdown, code) {
  const errors = [];

  for (const match of markdown.matchAll(/```([a-zA-Z0-9_-]+)\n/g)) {
    const lang = match[1].toLowerCase();
    if (['css', 'scss', 'sass', 'less'].includes(lang)) {
      errors.push(
        `Recipe includes a fenced ${lang} block; use Tale UI components and recipe TSX only instead of bespoke CSS.`,
      );
    }
  }

  for (const match of code.matchAll(/className\s*=\s*["']([^"']*)["']/g)) {
    const classes = match[1].split(/\s+/).filter(Boolean);
    const invalid = classes.filter((className) => {
      if (ALLOWED_DESIGN_SYSTEM_CLASSES.has(className)) {
        return false;
      }
      if (UTILITY_CLASS_PATTERN.test(className) || className.startsWith('text--')) {
        return true;
      }
      return !className.startsWith('tale-');
    });

    if (invalid.length > 0) {
      errors.push(
        `Line ${lineForIndex(code, match.index)} uses bespoke className value(s): ${invalid.join(', ')}.`,
      );
    }
  }

  for (const match of code.matchAll(/className\s*=\s*\{(?!\s*["'`])/g)) {
    errors.push(
      `Line ${lineForIndex(code, match.index)} uses a dynamic className; keep recipe snippets on Tale UI classes only.`,
    );
  }

  for (const match of code.matchAll(/\b(?:childrenClassName|svgClassName)\s*=\s*["'][^"']+["']/g)) {
    errors.push(
      `Line ${lineForIndex(code, match.index)} uses ${match[0].split('=')[0]}; avoid recipe-specific styling hooks.`,
    );
  }

  for (const match of code.matchAll(
    /<(?:Menu|Tooltip|Drawer)\.Trigger>\s*<(?:Button|IconButton|button)\b/g,
  )) {
    errors.push(
      `Line ${lineForIndex(code, match.index)} nests a button inside a trigger; style the trigger directly with Tale UI classes.`,
    );
  }

  for (const match of code.matchAll(/style\s*=\s*\{\{([\s\S]*?)\}\}/g)) {
    const body = match[1];
    const disallowed = [];

    for (const propMatch of body.matchAll(/([A-Za-z_$][\w$]*)\s*:/g)) {
      const propName = propMatch[1];
      if (DISALLOWED_STYLE_PROPS.has(propName)) {
        disallowed.push(propName);
      }
    }

    if (/display\s*:\s*['"]flex['"]/.test(body)) {
      disallowed.push('display:flex');
    }

    if (disallowed.length > 0) {
      errors.push(
        `Line ${lineForIndex(code, match.index)} uses bespoke inline style prop(s): ${[...new Set(disallowed)].join(', ')}.`,
      );
    }
  }

  for (const match of code.matchAll(/<(h[1-6]|p)\b/g)) {
    errors.push(
      `Line ${lineForIndex(code, match.index)} uses a bare <${match[1]}>; use the Text component for visible text.`,
    );
  }

  return errors;
}

export function extractRecipeCode(markdown) {
  const blocks = [...markdown.matchAll(/```tsx\n([\s\S]*?)```/g)].map((match) => match[1]);
  if (blocks.length === 0) {
    return null;
  }

  let code = blocks.join('\n\n');
  code = code.replace(/^import\s+['"]@tale-ui\/charts\/styles['"];?\n/gm, '');
  code = coalesceNamedImports(code);

  if (/export\s+function\s+Example\b/.test(code)) {
    return { code, blockCount: blocks.length };
  }

  const functions = [...code.matchAll(/^(export(?:\s+default)?\s+)?function\s+(\w+)/gm)];
  if (functions.length === 0) {
    return { code: null, blockCount: blocks.length };
  }

  const target = functions[functions.length - 1];
  return {
    code: `${code.slice(0, target.index)}export function Example${code.slice(target.index + target[0].length)}`,
    blockCount: blocks.length,
  };
}

function validateRecipe(file) {
  const markdown = readFileSync(join(RECIPES_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const result = extractRecipeCode(markdown);

  if (!result) {
    return {
      file,
      valid: false,
      errors: ['No fenced ```tsx block found. Add a TSX recipe example.'],
    };
  }

  if (!result.code) {
    return {
      file,
      valid: false,
      errors: [
        `Found ${result.blockCount} TSX block(s), but no function declaration to expose as Example.`,
      ],
    };
  }

  const stylingErrors = validateRecipeStyling(markdown, result.code);
  if (stylingErrors.length > 0) {
    return {
      file,
      valid: false,
      blockCount: result.blockCount,
      errors: stylingErrors,
    };
  }

  const child = spawnSync(process.execPath, [VALIDATOR, '--json', '--code', result.code], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
  });

  if (child.status === 0) {
    return { file, valid: true, blockCount: result.blockCount, errors: [] };
  }

  try {
    const parsed = JSON.parse(child.stdout);
    return {
      file,
      valid: false,
      blockCount: result.blockCount,
      errors: [
        ...(parsed.registryErrors ?? []).map((error) => `[registry] ${error.message}`),
        ...(parsed.typescriptErrors ?? []).map((error) => {
          const loc = error.line > 0 ? `:${error.line}` : '';
          return `[tsc${loc}] ${error.message}`;
        }),
      ],
    };
  } catch {
    return {
      file,
      valid: false,
      blockCount: result.blockCount,
      errors: [(child.stdout || child.stderr || 'Recipe validation failed.').trim()],
    };
  }
}

const requestedFiles = process.argv
  .slice(2)
  .filter((file) => file.endsWith('.md'))
  .map((file) => basename(file));
const recipeFiles = (requestedFiles.length > 0 ? [...new Set(requestedFiles)] : readdirSync(RECIPES_DIR))
  .filter((file) => file.endsWith('.md') && file !== 'index.md')
  .sort((a, b) => a.localeCompare(b));

const results = recipeFiles.map(validateRecipe);
const failures = results.filter((result) => !result.valid);

for (const result of results) {
  if (result.valid) {
    console.log(`✅ ${result.file} — ${result.blockCount} TSX block(s)`);
  } else {
    console.log(`❌ ${result.file}`);
    for (const error of result.errors) {
      console.log(`  ${error}`);
    }
  }
}

if (failures.length > 0) {
  console.log(`\n${failures.length}/${results.length} recipe(s) failed validation.`);
  process.exit(1);
}

console.log(`\n✅ ${results.length} recipe(s) valid.`);
