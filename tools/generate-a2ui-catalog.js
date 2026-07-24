#!/usr/bin/env node

/**
 * generate-a2ui-catalog.js
 *
 * Generates registry/a2ui-catalog.json from the A2UI catalog source.
 * The MCP server reads this file to serve list_a2ui_types, get_a2ui_type,
 * and get_a2ui_example tools.
 *
 * Usage:
 *   node tools/generate-a2ui-catalog.js          # generate
 *   node tools/generate-a2ui-catalog.js --check   # exit 1 if stale
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'packages/a2ui/src/catalog.ts');
const ICON_REGISTRY_PATH = path.join(ROOT, 'packages/a2ui/src/icon-registry.ts');
const EXAMPLES_DIR = path.join(ROOT, 'packages/a2ui/src/agent/examples');
const OUTPUT_PATH = path.join(ROOT, 'registry/a2ui-catalog.json');
const COMPONENTS_REGISTRY_PATH = path.join(ROOT, 'registry/components.json');

const isCheck = process.argv.includes('--check');

const {
  TYPE_DESCRIPTIONS,
  PROP_VALUES,
  PROP_VALUE_OVERRIDES,
  PROP_ALLOWED_VALUES,
  SUB_PARTS,
} = require('./a2ui-catalog-metadata.js');

/* ─── Source Parsing ──────────────────────────────────────────────────────── */

function extractCatalogEntries(source) {
  const entries = [];
  let currentCategory = 'Uncategorized';

  const lines = source.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const catMatch = lines[i].match(/\/\*\s*──\s*(.+?)\s*──/);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    const entryMatch = lines[i].match(/^\s{2}(\w+):\s*\{$/);
    if (!entryMatch) {
      continue;
    }

    const typeName = entryMatch[1];
    let component = '?';
    const adapterProps = [];
    let j = i + 1;

    while (j < lines.length) {
      const line = lines[j];
      if (line.match(/^\s*\}\s*as\s+CatalogEntry/)) {
        break;
      }

      const compMatch = line.match(/component:\s*(\S+),/);
      if (compMatch) {
        component = compMatch[1];
      }

      for (const propMatch of line.matchAll(/props\.(\w+)/g)) {
        if (!adapterProps.includes(propMatch[1])) {
          adapterProps.push(propMatch[1]);
        }
      }
      j++;
    }

    entries.push({ typeName, component, adapterProps, category: currentCategory });
  }

  return entries;
}

function extractIconNames(source) {
  const names = [];
  const mapMatch = source.match(/const iconMap[^{]*\{([\s\S]*?)\n\};/);
  if (!mapMatch) {
    return names;
  }
  for (const match of mapMatch[1].matchAll(/^\s+'?([\w-]+)'?\s*:/gm)) {
    names.push(match[1]);
  }
  return names.sort();
}

function extractUsageHints(source) {
  const hints = [];
  const fnMatch = source.match(/function mapTextHint[\s\S]*?\n\}/);
  if (!fnMatch) {
    return hints;
  }
  for (const match of fnMatch[0].matchAll(
    /case '([^']+)':\s*return\s*\{\s*variant:\s*'([^']+)',\s*size:\s*'([^']+)',\s*as:\s*'([^']+)'/g,
  )) {
    hints.push({ hint: match[1], variant: match[2], size: match[3], element: match[4] });
  }
  return hints;
}

function loadExamples() {
  const examples = {};
  const files = fs.readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const slug = file.replace('.json', '');
    const content = JSON.parse(fs.readFileSync(path.join(EXAMPLES_DIR, file), 'utf8'));
    examples[slug] = { description: content.description, messages: content.messages };
  }
  return examples;
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

function loadComponentDescriptions() {
  // Build a name → description map from registry/components.json.
  // Used as a fallback when TYPE_DESCRIPTIONS has no entry for an A2UI type.
  try {
    const reg = JSON.parse(fs.readFileSync(COMPONENTS_REGISTRY_PATH, 'utf8'));
    const map = new Map();
    for (const c of reg.components) {
      map.set(c.name, c.description);
    }
    return map;
  } catch {
    return new Map();
  }
}

function resolveDescription(typeName, component, componentDescriptions) {
  // 1. Explicit A2UI override wins.
  if (TYPE_DESCRIPTIONS[typeName]) {
    return TYPE_DESCRIPTIONS[typeName];
  }
  // 2. Fall back to the registry description for the underlying component.
  //    component may be "Card.Root", "List.Item" etc — strip the sub-part suffix
  //    to get the component name ("Card", "List").
  const baseName = component.replace(/\.\w+$/, '');
  return componentDescriptions.get(baseName) || componentDescriptions.get(component) || '';
}

function main() {
  const catalogSource = fs.readFileSync(CATALOG_PATH, 'utf8');
  const iconSource = fs.readFileSync(ICON_REGISTRY_PATH, 'utf8');

  const entries = extractCatalogEntries(catalogSource);
  const iconNames = extractIconNames(iconSource);
  const usageHints = extractUsageHints(catalogSource);
  const examples = loadExamples();
  const componentDescriptions = loadComponentDescriptions();

  const types = entries.map((entry) => ({
    name: entry.typeName,
    category: entry.category,
    component: entry.component,
    props: entry.adapterProps.map((p) => {
      const typeKey = `${entry.typeName}.${p}`;
      const hint = PROP_VALUE_OVERRIDES[typeKey] || PROP_VALUES[p] || '';
      // allowedValues: machine-readable array when a closed enum exists, null otherwise
      const allowedValues =
        typeKey in PROP_ALLOWED_VALUES
          ? PROP_ALLOWED_VALUES[typeKey]
          : (PROP_ALLOWED_VALUES[p] ?? null);
      return { name: p, hint, allowedValues };
    }),
    isSubPart: SUB_PARTS.has(entry.typeName),
    description: resolveDescription(entry.typeName, entry.component, componentDescriptions),
  }));

  const catalog = {
    schemaVersion: '1.0.0',
    types,
    usageHints,
    iconNames,
    examples,
  };

  const output = `${JSON.stringify(catalog, null, 2)}\n`;

  if (isCheck) {
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.log(
        `MISSING: ${path.relative(ROOT, OUTPUT_PATH)} — run \`node tools/generate-a2ui-catalog.js\` to create`,
      );
      process.exit(1);
    }
    const existing = fs.readFileSync(OUTPUT_PATH, 'utf8');
    if (existing !== output) {
      console.log(
        `STALE: ${path.relative(ROOT, OUTPUT_PATH)} — run \`node tools/generate-a2ui-catalog.js\` to update`,
      );
      process.exit(1);
    }
    console.log(`OK: ${path.relative(ROOT, OUTPUT_PATH)}`);
  } else {
    fs.writeFileSync(OUTPUT_PATH, output);
    console.log(
      `GENERATED: ${path.relative(ROOT, OUTPUT_PATH)} (${types.length} types, ${iconNames.length} icons, ${usageHints.length} hints, ${Object.keys(examples).length} examples)`,
    );
  }
}

main();
