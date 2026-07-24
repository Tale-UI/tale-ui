/**
 * mcp-core.mjs
 *
 * Pure business-logic functions extracted from mcp-server.mjs.
 * Import here from the MCP stdio server (thin protocol wrapper) and from
 * the Studio dev-server plugin (/api/* routes) — same code path, no duplication.
 *
 * Each exported `*Core` function returns { text: string, isError?: boolean }.
 * Callers wrap the text in whatever envelope they need (MCP content block, JSON HTTP body, etc.).
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const IS_MONOREPO = existsSync(join(__dirname, 'validate-generated.mjs'));
export const ROOT = IS_MONOREPO ? resolve(__dirname, '..') : __dirname;

const REGISTRY_PATH = join(ROOT, 'registry/components.json');
const A2UI_CATALOG_PATH = join(ROOT, 'registry/a2ui-catalog.json');
const PITFALLS_PATH = join(ROOT, 'registry/pitfalls.json');
const RECIPES_DIR = join(ROOT, 'docs/recipes');
const DOCS_DIR = join(ROOT, 'docs');
const DOCS_ARCHIVE_DIR = join(DOCS_DIR, 'archive');
const STORIES_DIR = join(ROOT, 'playground/storybook/src/stories');

// ─── Data loaders ────────────────────────────────────────────────────────────

export function loadRegistry() {
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
}

export function loadA2UICatalog() {
  return JSON.parse(readFileSync(A2UI_CATALOG_PATH, 'utf8'));
}

export function loadPitfalls() {
  try {
    return JSON.parse(readFileSync(PITFALLS_PATH, 'utf8'));
  } catch {
    return { crossComponentPitfalls: [], generalConventions: [], triggerStylingTable: null };
  }
}

export function loadRecipeIndex() {
  const files = readdirSync(RECIPES_DIR).filter((f) => f.endsWith('.md') && f !== 'index.md');
  return files.map((f) => {
    const slug = f.replace('.md', '');
    const content = readFileSync(join(RECIPES_DIR, f), 'utf8').replace(/\r\n/g, '\n');
    const titleMatch = content.match(/^# (.+)/m);
    return { slug, title: titleMatch ? titleMatch[1] : slug, file: f };
  });
}

// ─── Docs index ──────────────────────────────────────────────────────────────

function walkDir(dir) {
  const entries = [];
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      if (full !== DOCS_ARCHIVE_DIR) {
        entries.push(...walkDir(full));
      }
    } else if (item.name.endsWith('.md') && item.name !== 'index.md') {
      entries.push(full);
    }
  }
  return entries;
}

let docsIndexCache = null;
export function loadDocsIndex() {
  if (docsIndexCache) {
    return docsIndexCache;
  }
  const files = walkDir(DOCS_DIR);
  docsIndexCache = files.map((filePath) => {
    const content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    const titleMatch = content.match(/^# (.+)/m);
    const relativePath = filePath
      .replace(`${ROOT}/`, '')
      .replace(`${ROOT}\\`, '')
      .replace(/\\/g, '/');
    return { path: relativePath, title: titleMatch ? titleMatch[1] : relativePath, content };
  });
  return docsIndexCache;
}

export function searchDocs(query) {
  const docs = loadDocsIndex();
  const q = query.toLowerCase();
  const queryWords = q.split(/\s+/).filter(Boolean);

  const scored = docs.map((doc) => {
    const lower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    let score = 0;
    if (titleLower.includes(q)) {
      score += 50;
    }
    for (const w of queryWords) {
      if (titleLower.includes(w)) {
        score += 20;
      }
    }
    for (const w of queryWords) {
      const count = lower.split(w).length - 1;
      score += Math.min(count * 2, 20);
    }
    const lines = doc.content.split('\n');
    const snippets = [];
    for (const line of lines) {
      if (snippets.length >= 3) {
        break;
      }
      const lineLower = line.toLowerCase();
      if (queryWords.some((w) => lineLower.includes(w)) && line.trim().length > 10) {
        snippets.push(line.trim());
      }
    }
    return { path: doc.path, title: doc.title, score, snippets };
  });

  return scored
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

// ─── Storybook loader ────────────────────────────────────────────────────────

let storyMapCache = null;
export function loadStoryMap() {
  if (storyMapCache) {
    return storyMapCache;
  }
  storyMapCache = new Map();
  if (!existsSync(STORIES_DIR)) {
    return storyMapCache;
  }
  for (const file of readdirSync(STORIES_DIR)) {
    if (!file.endsWith('.stories.tsx') && !file.endsWith('.stories.ts')) {
      continue;
    }
    const filePath = join(STORIES_DIR, file);
    const source = readFileSync(filePath, 'utf8');
    const storyNames = [];
    const exportRegex = /^export\s+const\s+(\w+)\s*:/gm;
    let m;
    while ((m = exportRegex.exec(source)) !== null) {
      if (m[1] !== 'default') {
        storyNames.push(m[1]);
      }
    }
    const componentName = file.replace(/\.stories\.(tsx?|jsx?)$/, '');
    storyMapCache.set(componentName, {
      path: filePath.replace(`${ROOT}/`, ''),
      source,
      storyNames,
    });
  }
  return storyMapCache;
}

// ─── Search helpers ──────────────────────────────────────────────────────────

export function fuzzyMatch(query, text) {
  if (!text) {
    return 0;
  }
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) {
    return 100;
  }
  if (t.includes(q)) {
    return 80;
  }
  const queryWords = q.split(/\s+/);
  const matchedWords = queryWords.filter((w) => t.includes(w));
  if (matchedWords.length === queryWords.length) {
    return 70;
  }
  if (matchedWords.length > 0) {
    return 40 * (matchedWords.length / queryWords.length);
  }
  return 0;
}

export const SYNONYMS = {
  dropdown: ['Select', 'Combobox', 'Menu'],
  modal: ['Dialog', 'AlertDialog'],
  popup: ['Popover', 'Dialog', 'Tooltip'],
  overlay: ['Dialog', 'AlertDialog', 'Drawer', 'Popover'],
  sidebar: ['Drawer', 'NavigationMenu'],
  toggle: ['Switch', 'ToggleButton', 'ToggleButtonGroup'],
  'toggle button': ['ToggleButton'],
  'formatting toggle': ['ToggleButton'],
  'text formatting': ['ToggleButton', 'ToggleButtonGroup'],
  bold: ['ToggleButton'],
  toast: ['Banner'],
  notification: ['Banner'],
  alert: ['Banner', 'AlertDialog'],
  chip: ['Badge', 'TagGroup'],
  tag: ['TagGroup', 'Badge'],
  loader: ['Spinner', 'ProgressBar', 'ProgressCircle'],
  loading: ['Spinner', 'ProgressBar', 'ProgressCircle'],
  input: ['TextField', 'TextArea', 'NumberField', 'SearchField', 'Input'],
  'text input': ['TextField', 'Input'],
  'text field': ['TextField', 'Input'],
  textarea: ['TextArea'],
  autocomplete: ['Autocomplete', 'Combobox'],
  typeahead: ['Autocomplete', 'Combobox'],
  nav: ['NavigationMenu', 'Breadcrumbs', 'Tabs'],
  navigation: ['NavigationMenu', 'Breadcrumbs', 'Tabs'],
  stepper: ['NumberField'],
  accordion: ['Accordion', 'Disclosure'],
  collapse: ['Accordion', 'Disclosure'],
  expandable: ['Accordion', 'Disclosure'],
  table: ['Table'],
  grid: ['GridList', 'Table'],
  avatar: ['Avatar'],
  image: ['Image', 'Avatar'],
  icon: ['Icon', 'IconButton', 'FeaturedIcon'],
  'icon button': ['IconButton', 'Button'],
  iconbutton: ['IconButton'],
  'featured icon': ['FeaturedIcon'],
  'notification icon': ['FeaturedIcon', 'Icon'],
  'themed icon': ['FeaturedIcon'],
  rating: ['RatingStars', 'RatingBadge'],
  'star rating': ['RatingStars'],
  stars: ['RatingStars'],
  'color mode': ['ColorModeToggle'],
  'dark mode': ['ColorModeToggle'],
  'theme toggle': ['ColorModeToggle'],
  'light dark': ['ColorModeToggle'],
  destructive: ['Button', 'IconButton'],
  delete: ['IconButton', 'Button'],
  trash: ['IconButton'],
  spinner: ['Spinner', 'ProgressCircle'],
  'primary button': ['Button'],
  'secondary button': ['Button'],
  progress: ['ProgressBar', 'ProgressCircle', 'Meter'],
  meter: ['Meter', 'ProgressBar'],
  slider: ['Slider'],
  range: ['Slider', 'RangeCalendar'],
  date: ['DatePicker', 'DateField', 'Calendar', 'DateRangePicker'],
  calendar: ['Calendar', 'DatePicker', 'RangeCalendar'],
  time: ['TimeField'],
  color: [
    'ColorPicker',
    'ColorArea',
    'ColorSlider',
    'ColorField',
    'ColorWheel',
    'ColorSwatch',
    'ColorSwatchPicker',
  ],
  form: ['Form', 'TextField', 'Select', 'Checkbox', 'Radio'],
  card: ['Card'],
  empty: ['EmptyState'],
  'empty state': ['EmptyState'],
  'no data': ['EmptyState'],
  file: ['FileTrigger', 'DropZone'],
  upload: ['FileTrigger', 'DropZone'],
  'drag and drop': ['DropZone'],
  paginate: ['Pagination'],
  paging: ['Pagination'],
  breadcrumb: ['Breadcrumbs'],
  tree: ['Tree'],
  list: ['List', 'GridList'],
};

export function searchComponents(components, query) {
  const q = query.toLowerCase();
  const synonymBoosts = new Map();
  for (const [term, targets] of Object.entries(SYNONYMS)) {
    if (q.includes(term)) {
      for (const target of targets) {
        synonymBoosts.set(target, (synonymBoosts.get(target) || 0) + 60);
      }
    }
  }
  const scored = components.map((c) => {
    const nameScore = fuzzyMatch(query, c.name);
    const descScore = fuzzyMatch(query, c.description);
    const catScore = fuzzyMatch(query, c.category);
    const partsScore = c.parts ? Math.max(...c.parts.map((p) => fuzzyMatch(query, p)), 0) * 0.5 : 0;
    const synonymScore = synonymBoosts.get(c.name) || 0;
    const score = Math.max(nameScore, descScore * 0.9, catScore * 0.7, partsScore, synonymScore);
    return { ...c, score };
  });
  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// ─── Core tool functions ──────────────────────────────────────────────────────
// Each returns { text: string, isError?: boolean }.

export function listComponentsCore() {
  const registry = loadRegistry();
  const summary = registry.components.map((c) => ({
    name: c.name,
    import: c.import,
    category: c.category,
    description:
      c.status === 'deprecated'
        ? `⚠️ Deprecated — ${c.deprecationNote || c.description}`
        : c.description,
    kind: c.kind,
    status: c.status || 'stable',
  }));
  return { text: JSON.stringify(summary, null, 2) };
}

export function getComponentCore(name) {
  const registry = loadRegistry();
  const query = name.toLowerCase().replace(/-/g, '');
  const component = registry.components.find(
    (c) =>
      c.name.toLowerCase() === query ||
      c.slug.replace(/-/g, '') === query ||
      c.slug === name.toLowerCase(),
  );
  if (!component) {
    return {
      text: `Component "${name}" not found. Use list_components to see available components.`,
      isError: true,
    };
  }
  const pitfallData = loadPitfalls();
  const crossPitfalls = (component.crossPitfallRefs || [])
    .map((id) => pitfallData.crossComponentPitfalls.find((p) => p.id === id))
    .filter(Boolean);
  const hasTriggerStyling = crossPitfalls.some((p) => p.category === 'trigger-styling');
  const result = { ...component };
  if (crossPitfalls.length > 0) {
    result.crossComponentPitfalls = crossPitfalls;
  }
  if (hasTriggerStyling && pitfallData.triggerStylingTable) {
    result.triggerStylingTable = pitfallData.triggerStylingTable;
  }
  return { text: JSON.stringify(result, null, 2) };
}

export function searchComponentsCore(query) {
  const registry = loadRegistry();
  const results = searchComponents(registry.components, query);
  if (results.length === 0) {
    return { text: `No components match "${query}". Try broader terms or use list_components.` };
  }
  const summary = results.map((c) => ({
    name: c.name,
    import: c.import,
    category: c.category,
    description: c.description,
    kind: c.kind,
    relevance: Math.round(c.score),
  }));
  return { text: JSON.stringify(summary, null, 2) };
}

export function listRecipesCore() {
  return { text: JSON.stringify(loadRecipeIndex(), null, 2) };
}

export function getRecipeCore(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const filePath = join(RECIPES_DIR, `${slug}.md`);
  try {
    return { text: readFileSync(filePath, 'utf8') };
  } catch {
    const available = loadRecipeIndex()
      .map((r) => r.slug)
      .join(', ');
    return { text: `Recipe "${name}" not found. Available: ${available}`, isError: true };
  }
}

export function searchDocsCore(query) {
  const results = searchDocs(query);
  if (results.length === 0) {
    return { text: `No docs match "${query}". Try broader terms.` };
  }
  const summary = results.map((d) => ({
    path: d.path,
    title: d.title,
    relevance: Math.round(d.score),
    snippets: d.snippets,
  }));
  return { text: JSON.stringify(summary, null, 2) };
}

export function listA2UITypesCore() {
  const catalog = loadA2UICatalog();
  const summary = catalog.types.map((t) => ({
    name: t.name,
    category: t.category,
    component: t.component,
    props: t.props,
    isSubPart: t.isSubPart,
    description: t.description,
  }));
  return { text: JSON.stringify(summary, null, 2) };
}

export function getA2UITypeCore(name) {
  const catalog = loadA2UICatalog();
  const type = catalog.types.find((t) => t.name.toLowerCase() === name.toLowerCase());
  if (!type) {
    const available = catalog.types
      .filter((t) => !t.isSubPart)
      .map((t) => t.name)
      .join(', ');
    return { text: `A2UI type "${name}" not found. Available types: ${available}`, isError: true };
  }
  const result = { ...type };
  if (type.name === 'Text') {
    result.usageHints = catalog.usageHints;
  }
  if (type.name === 'Icon') {
    result.availableIcons = catalog.iconNames;
  }
  const prefix = type.name;
  const subParts = catalog.types.filter(
    (t) => t.isSubPart && t.name.startsWith(prefix) && t.name !== prefix,
  );
  if (subParts.length > 0) {
    result.subParts = subParts.map((s) => ({
      name: s.name,
      description: s.description,
      props: s.props,
    }));
  }
  return { text: JSON.stringify(result, null, 2) };
}

export function getA2UIExampleCore(name) {
  const catalog = loadA2UICatalog();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const example = catalog.examples[slug];
  if (!example) {
    const available = Object.keys(catalog.examples).join(', ');
    return { text: `Example "${name}" not found. Available: ${available}`, isError: true };
  }
  return { text: JSON.stringify(example, null, 2) };
}

function legacyValidationErrors(parsed) {
  const registryErrors = (parsed.registryErrors || []).map((entry) =>
    typeof entry === 'string' ? entry : entry.message,
  );
  const tsErrors = (parsed.typescriptErrors || []).map(
    (entry) => `Line ${entry.line}: ${entry.message}`,
  );
  return [...registryErrors, ...tsErrors];
}

export function validateCodeCore(code) {
  if (!IS_MONOREPO) {
    return { text: 'validate_code is only available in the Tale UI monorepo.', isError: true };
  }
  const validatorPath = join(ROOT, 'tools/validate-generated.mjs');
  try {
    const result = execFileSync(process.execPath, [validatorPath, '--code', code, '--json'], {
      cwd: ROOT,
      timeout: 30000,
      encoding: 'utf8',
    });
    const parsed = JSON.parse(result);
    const errors = legacyValidationErrors(parsed);
    if (errors.length === 0) {
      return { text: '✅ Code is valid — no registry or TypeScript errors.' };
    }
    return {
      text: `Found ${errors.length} error(s):\n\n${errors.map((entry) => `• ${entry}`).join('\n')}`,
      isError: true,
    };
  } catch (err) {
    const stdout = err.stdout || '';
    try {
      const parsed = JSON.parse(stdout);
      const errors = legacyValidationErrors(parsed);
      return {
        text: `Found ${errors.length} error(s):\n\n${errors.map((entry) => `• ${entry}`).join('\n')}`,
        isError: true,
      };
    } catch {
      return { text: `Validation failed: ${err.message}`, isError: true };
    }
  }
}

export function getComponentStoriesCore(name) {
  if (!IS_MONOREPO) {
    return { text: 'get_component_stories is only available in the Tale UI monorepo.' };
  }
  const stories = loadStoryMap();
  const entry =
    stories.get(name) ||
    [...stories.entries()].find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1];
  if (!entry) {
    const available = [...stories.keys()].sort().join(', ');
    return { text: `No story file found for "${name}". Components with stories: ${available}` };
  }
  return {
    text: JSON.stringify(
      { file: entry.path, storyNames: entry.storyNames, source: entry.source },
      null,
      2,
    ),
  };
}

export function planUiCore(prompt) {
  const registry = loadRegistry();
  const recipes = loadRecipeIndex();
  const componentResults = searchComponents(registry.components, prompt).slice(0, 6);
  const pLower = prompt.toLowerCase();
  const recipeMatch = recipes.find(
    (r) =>
      r.slug.split('-').some((w) => w.length > 3 && pLower.includes(w)) ||
      r.title
        .toLowerCase()
        .split(/\s+/)
        .some((w) => w.length > 3 && pLower.includes(w)),
  );
  const pitfallData = loadPitfalls();

  const lines = ['## Component Plan\n'];

  lines.push('### Recommended components\n');
  if (componentResults.length === 0) {
    lines.push(
      'No matching components found. Use `list_components` to browse all available components.\n',
    );
  } else {
    for (const c of componentResults) {
      const statusNote = c.status === 'deprecated' ? ' ⚠️ **deprecated**' : '';
      lines.push(`- **${c.name}**${statusNote} — \`${c.import}\``);
      lines.push(`  ${c.description || ''}`);
      lines.push(`  Kind: ${c.kind} | Call \`get_component\` for props, parts, and examples`);
      lines.push('');
    }
  }

  if (recipeMatch) {
    lines.push('### Applicable recipe\n');
    lines.push(`**${recipeMatch.title}** — \`${recipeMatch.slug}\``);
    lines.push('Call `get_recipe` with this slug for a copy-paste starting point.\n');
  }

  lines.push('### Default visual style\n');
  lines.push(
    "- Use each component's default visual props when the prompt does not ask for a specific appearance.",
  );
  lines.push(
    '- Do not invent non-default `variant`, `theme`, `size`, `shape`, `color`, or decorative modifiers just to make the UI look nicer.',
  );
  lines.push(
    "- Prefer the component's basic example/default composition as the canonical baseline.\n",
  );

  const pitfallLines = [];
  const seenCrossRefs = new Set();

  for (const c of componentResults) {
    const fullEntry = registry.components.find((comp) => comp.name === c.name);
    if (fullEntry?.pitfalls?.length > 0) {
      for (const p of fullEntry.pitfalls) {
        pitfallLines.push(`- **${c.name}: ${p.summary}**`);
        if (p.detail) {
          for (const line of p.detail.split('\n')) {
            pitfallLines.push(`  ${line}`);
          }
        }
        if (p.antiPatterns?.length > 0) {
          for (const ap of p.antiPatterns) {
            pitfallLines.push(`  - anti-pattern: \`${ap}\``);
          }
        }
        if (p.fixes?.length > 0) {
          for (const fx of p.fixes) {
            pitfallLines.push(`  - fix: \`${fx}\``);
          }
        }
        if (p.completeExample) {
          pitfallLines.push('  - complete example:');
          pitfallLines.push('');
          pitfallLines.push('    ```tsx');
          for (const line of p.completeExample.split('\n')) {
            pitfallLines.push(`    ${line}`);
          }
          pitfallLines.push('    ```');
        }
        pitfallLines.push('');
      }
    }
    if (fullEntry?.crossPitfallRefs?.length > 0) {
      for (const refId of fullEntry.crossPitfallRefs) {
        if (seenCrossRefs.has(refId)) {
          continue;
        }
        seenCrossRefs.add(refId);
        const cp = pitfallData.crossComponentPitfalls.find((p) => p.id === refId);
        if (!cp) {
          continue;
        }
        pitfallLines.push(`- **Cross-component: ${cp.summary}**`);
        if (cp.detail) {
          for (const line of cp.detail.split('\n')) {
            pitfallLines.push(`  ${line}`);
          }
        }
        if (cp.antiPatterns?.length > 0) {
          for (const ap of cp.antiPatterns) {
            pitfallLines.push(`  - anti-pattern: \`${ap}\``);
          }
        }
        if (cp.fixes?.length > 0) {
          for (const fx of cp.fixes) {
            pitfallLines.push(`  - fix: \`${fx}\``);
          }
        }
        if (cp.completeExample) {
          pitfallLines.push('  - complete example:');
          pitfallLines.push('');
          pitfallLines.push('    ```tsx');
          for (const line of cp.completeExample.split('\n')) {
            pitfallLines.push(`    ${line}`);
          }
          pitfallLines.push('    ```');
        }
        pitfallLines.push('');
      }
    }
  }

  for (const gc of pitfallData.generalConventions) {
    pitfallLines.push(`- **Convention: ${gc.summary}**`);
    if (gc.detail) {
      for (const line of gc.detail.split('\n')) {
        pitfallLines.push(`  ${line}`);
      }
    }
    if (gc.antiPatterns?.length > 0) {
      for (const ap of gc.antiPatterns) {
        pitfallLines.push(`  - anti-pattern: \`${ap}\``);
      }
    }
    if (gc.fixes?.length > 0) {
      for (const fx of gc.fixes) {
        pitfallLines.push(`  - fix: \`${fx}\``);
      }
    }
    if (gc.completeExample) {
      pitfallLines.push('  - complete example:');
      pitfallLines.push('');
      pitfallLines.push('    ```tsx');
      for (const line of gc.completeExample.split('\n')) {
        pitfallLines.push(`    ${line}`);
      }
      pitfallLines.push('    ```');
    }
    pitfallLines.push('');
  }

  if (pitfallLines.length > 0) {
    lines.push('### Pitfalls to avoid\n');
    lines.push(...pitfallLines);
  }

  const docResults = searchDocs(prompt).slice(0, 3);
  if (docResults.length > 0) {
    lines.push('### Relevant documentation\n');
    for (const d of docResults) {
      lines.push(`- **${d.title}** (\`${d.path}\`)`);
      if (d.snippets.length > 0) {
        lines.push(`  > ${d.snippets[0]}`);
      }
    }
    lines.push('');
  }

  lines.push('### Next steps\n');
  lines.push(
    '1. Call `get_component` on each component above for exact props, allowed values, and sub-parts — even if a complete example is shown, `get_component` is the authoritative API reference.',
  );
  lines.push(
    '2. If a pitfall has a `complete example:` block that matches your prompt, use it as the starting point for the JSX, but verify the import path and props against `get_component` output first.',
  );
  lines.push('3. If a recipe was found, call `get_recipe` for the complete pattern.');
  lines.push('4. Generate JSX using only the components listed. Call `validate_code` afterwards.');

  return { text: lines.join('\n') };
}
