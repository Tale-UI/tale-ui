#!/usr/bin/env node
/**
 * Registry Generator
 * Generates registry/components.json from source files.
 *
 * Run:   node tools/generate-registry.js          # generate and write
 *        node tools/generate-registry.js --check   # compare against committed file; exit 1 if different
 *
 * Data sources per component:
 *   - packages/react/src/{name}/index.ts          → kind (compound vs simple)
 *   - packages/react/src/{name}/{Name}.styled.tsx → props, parts, JSDoc examples
 *   - packages/styles/src/{name}.css              → CSS classes
 *   - docs/component-index.md                     → category, description
 *   - docs/components/{name}.md                   → usage examples
 *   - packages/react/package.json                 → import path
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REACT_SRC = path.join(ROOT, 'packages/react/src');
const STYLES_SRC = path.join(ROOT, 'packages/styles/src');
const DOCS_DIR = path.join(ROOT, 'docs/components');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

// ─── Shared constants (from audit-components.js) ────────────────────────────

const SKIP_DIRS = new Set([
  'types',
  'utils',
  'react-aria-adapters',
  'temporal-adapter-date-fns',
  'temporal-adapter-luxon',
  'temporal-adapter-provider',
  'unstable-use-media-query',
  'aria',
]);

const PASCAL_OVERRIDES = {
  'csp-provider': 'CSPProvider',
  'i18n-provider': 'I18nProvider',
  'toggle-group': 'ToggleButtonGroup',
  'merge-props': 'mergeProps',
  'qr-code': 'QRCode',
};

function kebabToPascal(kebab) {
  if (PASCAL_OVERRIDES[kebab]) {
    return PASCAL_OVERRIDES[kebab];
  }
  return kebab
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

// ─── Component discovery ────────────────────────────────────────────────────

function discoverComponents() {
  return fs
    .readdirSync(REACT_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !SKIP_DIRS.has(d.name))
    .map((d) => d.name)
    .sort();
}

function findStyledFile(name) {
  const dir = path.join(REACT_SRC, name);
  if (!fs.existsSync(dir)) {
    return null;
  }
  const files = fs.readdirSync(dir);
  const pascal = kebabToPascal(name);
  const styledName = `${pascal}.styled.tsx`;
  if (files.includes(styledName)) {
    return path.join(dir, styledName);
  }
  const plainName = `${pascal}.tsx`;
  if (files.includes(plainName) && !plainName.includes('.test.') && !plainName.includes('.spec.')) {
    return path.join(dir, plainName);
  }
  const styled = files.find((f) => f.endsWith('.styled.tsx'));
  if (styled) {
    return path.join(dir, styled);
  }
  return null;
}

// ─── Category & description from component-index.md ─────────────────────────

function parseComponentIndex() {
  const raw = readFile(path.join(ROOT, 'docs/component-index.md'));
  if (!raw) {
    return new Map();
  }
  const content = raw.replace(/\r\n/g, '\n');

  const map = new Map();
  let currentCategory = null;
  for (const line of content.split('\n')) {
    const catMatch = line.match(/^## (.+?) \(\d+\)/);
    if (catMatch) {
      currentCategory = catMatch[1];
      continue;
    }
    // Table row: | Component | Description | Import | Parts |
    const rowMatch = line.match(/^\|\s*(\w+)\s*\|\s*(.+?)\s*\|\s*`(.+?)`\s*\|\s*(.+?)\s*\|/);
    if (rowMatch && currentCategory) {
      map.set(rowMatch[1], {
        category: currentCategory,
        description: rowMatch[2].trim(),
        import: rowMatch[3].trim(),
        parts:
          rowMatch[4].trim() === '--'
            ? null
            : rowMatch[4]
                .trim()
                .split(',')
                .map((p) => p.trim()),
      });
    }
  }
  return map;
}

// ─── Type alias extraction ───────────────────────────────────────────────────

/**
 * Extract type aliases that are pure string unions from a styled file.
 * Returns a Map from alias name → array of string values.
 * e.g. `type Variant = 'primary' | 'neutral'` → Map { Variant → ['primary','neutral'] }
 */
function extractTypeAliases(content) {
  if (!content) {
    return new Map();
  }
  const map = new Map();
  // Match: type Name = 'a' | 'b' | ... (single-line, may have trailing semicolon)
  const re = /^(?:export\s+)?type\s+(\w+)\s*=\s*((?:'[^']*'\s*\|?\s*)+);?$/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    const body = m[2];
    const values = [...body.matchAll(/'([^']*)'/g)].map((v) => v[1]);
    if (values.length > 0) {
      map.set(name, values);
    }
  }
  return map;
}

// ─── Kind detection ─────────────────────────────────────────────────────────

function hasNamespaceObject(styledContent, pascal) {
  return Boolean(
    styledContent && new RegExp(`export\\s+const\\s+${pascal}\\s*=\\s*\\{`).test(styledContent),
  );
}

function detectKind(indexContent, styledContent, pascal) {
  if (!indexContent) {
    return 'simple';
  }
  if (/export \* as \w+ from/.test(indexContent)) {
    return 'compound';
  }
  if (hasNamespaceObject(styledContent, pascal)) {
    return 'compound';
  }
  return 'simple';
}

// ─── Props extraction ───────────────────────────────────────────────────────

function extractProps(styledContent, pascal) {
  if (!styledContent) {
    return [];
  }

  // Find exported interfaces (only those that end with Props)
  const props = [];
  const normalized = styledContent.replace(/\r\n/g, '\n');

  // Identify the "main" props interface: RootProps, {Pascal}Props, or {Pascal}RootProps
  const mainPropNames = new Set(['RootProps', `${pascal}Props`, `${pascal}RootProps`]);

  // Match exported interface blocks: export interface FooProps ... { ... }
  const ifaceRegex =
    /export\s+interface\s+(\w*Props\w*)\s+(?:extends\s+[^{]+)?\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  let ifaceMatch;

  while ((ifaceMatch = ifaceRegex.exec(normalized)) !== null) {
    const ifaceName = ifaceMatch[1];
    const body = ifaceMatch[2];
    if (!mainPropNames.has(ifaceName)) {
      continue;
    }

    // Parse each member
    const memberRegex = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/gs;
    let memberMatch;
    while ((memberMatch = memberRegex.exec(body)) !== null) {
      const description = memberMatch[1]
        ? memberMatch[1]
            .replace(/\s*\*\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        : null;
      const name = memberMatch[2];
      const required = !memberMatch[3];
      let type = memberMatch[4].trim();
      // Remove trailing `| undefined` if optional
      type = type.replace(/\s*\|\s*undefined\s*$/, '').trim();

      // Skip className — every component has it, not useful in registry
      if (name === 'className') {
        continue;
      }
      // Skip children — implicit in React
      if (name === 'children') {
        continue;
      }

      props.push({ name, type, required, description });
    }

    // Only process the first/main interface per component
    break;
  }

  // Also try `export type FooProps = Omit<...> & { custom?: ... }` pattern
  if (props.length === 0) {
    const typeRegex = /export\s+type\s+(\w*Props\w*)(?:<[^>]*>)?\s*=\s*[^{]*&\s*\{([^}]*)\}/g;
    let typeMatch;
    while ((typeMatch = typeRegex.exec(normalized)) !== null) {
      if (!mainPropNames.has(typeMatch[1])) {
        continue;
      }
      const body = typeMatch[2];
      const memberRegex2 = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/gs;
      let mm;
      while ((mm = memberRegex2.exec(body)) !== null) {
        const name = mm[2];
        if (name === 'className' || name === 'children') {
          continue;
        }
        const description = mm[1]
          ? mm[1]
              .replace(/\s*\*\s*/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
          : null;
        const required = !mm[3];
        const type = mm[4]
          .trim()
          .replace(/\s*\|\s*undefined\s*$/, '')
          .trim();
        props.push({ name, type, required, description });
      }
      break;
    }
  }

  return props;
}

// Attempt to extract default values from the forwardRef destructuring
function extractDefaults(styledContent) {
  if (!styledContent) {
    return {};
  }
  const defaults = {};
  // Match destructured defaults: { prop = 'value', prop2 = true, ... }
  const destructRegex = /\(\s*\{([^}]+)\}/;
  const match = styledContent.match(destructRegex);
  if (match) {
    const defaultRegex = /(\w+)\s*=\s*(['"][\w-]+['"]|true|false|\d+)/g;
    let dm;
    while ((dm = defaultRegex.exec(match[1])) !== null) {
      defaults[dm[1]] = dm[2];
    }
  }
  return defaults;
}

// ─── RAC root-prop alias fallbacks ──────────────────────────────────────────

const ROOT_ALIAS_PROP_MAP = {
  AriaMenuTriggerProps: [
    { name: 'isOpen', type: 'boolean' },
    { name: 'defaultOpen', type: 'boolean' },
    { name: 'onOpenChange', type: 'function' },
    { name: 'isDisabled', type: 'boolean' },
  ],
  AriaColorPickerProps: [
    { name: 'value', type: 'string | Color' },
    { name: 'defaultValue', type: 'string | Color' },
    { name: 'onChange', type: 'function' },
  ],
};

function extractRootAliasProps(styledContent, pascal) {
  if (!styledContent) {
    return [];
  }
  const normalized = styledContent.replace(/\r\n/g, '\n');
  const propTypeRegex = new RegExp(
    `export\\s+type\\s+(?:RootProps|${pascal}Props|${pascal}RootProps)\\s*=\\s*(\\w+)\\s*;`,
  );
  const match = normalized.match(propTypeRegex);
  if (!match) {
    return [];
  }

  const alias = match[1];
  const mapped = ROOT_ALIAS_PROP_MAP[alias];
  if (!mapped) {
    return [];
  }

  return mapped.map((prop) => ({
    name: prop.name,
    type: prop.type,
    required: false,
    description: null,
    default: null,
  }));
}

// ─── Parts extraction ───────────────────────────────────────────────────────

function extractParts(indexContent, styledContent, pascal) {
  const hasNamespaceReExport = /export \* as \w+ from/.test(indexContent ?? '');
  if (!indexContent || (!hasNamespaceReExport && !hasNamespaceObject(styledContent, pascal))) {
    return null;
  }
  if (!styledContent) {
    return null;
  }

  // Collect display-name-derived parts (`Component.Part`) to augment export-
  // derived parts when internal symbol names differ from public API names.
  const displayNameParts = [];
  const displayNameRegex = /\.displayName\s*=\s*['"][A-Za-z0-9]+\.(\w+)['"]/g;
  let dm;
  while ((dm = displayNameRegex.exec(styledContent)) !== null) {
    displayNameParts.push(dm[1]);
  }

  const parts = [];
  const exportRegex = /export (?:const|function) (\w+)/g;
  let m;
  while ((m = exportRegex.exec(styledContent)) !== null) {
    // Skip internal helpers (lowercase first letter or starts with 'use')
    if (/^[a-z]/.test(m[1]) || m[1].startsWith('use')) {
      continue;
    }
    parts.push(m[1]);
  }

  // Map aliased exports like `export { EmptyStateIcon as Icon }`
  const aliasRegex = /export\s*\{\s*(\w+)\s+as\s+(\w+)\s*\}/g;
  let am;
  while ((am = aliasRegex.exec(styledContent)) !== null) {
    const from = am[1];
    const to = am[2];
    if (!parts.includes(from) || parts.includes(to)) {
      continue;
    }
    const fromIndex = parts.indexOf(from);
    parts[fromIndex] = to;
  }

  for (const part of displayNameParts) {
    if (!parts.includes(part)) {
      parts.push(part);
    }
  }

  return parts.length > 0 ? [...new Set(parts)] : null;
}

// ─── CSS class extraction ───────────────────────────────────────────────────

function extractCSSClasses(cssContent) {
  if (!cssContent) {
    return [];
  }
  const classes = new Set();
  const regex = /\.(tale-[\w-]+(?:__[\w-]+)?(?:--[\w-]+)?)/g;
  let m;
  while ((m = regex.exec(cssContent)) !== null) {
    classes.add(m[1]);
  }
  return [...classes].sort();
}

// ─── Doc-based prop extraction (fallback for inherited RAC props) ───────────

/**
 * When the styled-file extraction yields zero custom props (because the
 * interface body only contains `className`), fall back to extracting
 * consumer-facing props from the component's markdown documentation.
 *
 * Sources:
 *   1. JSX attributes on `<Component.Root ...>` in code examples
 *   2. Root-scoped prop names mentioned in backticks in ## Notes
 *      (excluding negated mentions like "NOT `isOpen`")
 *   3. Prop names mentioned in backticks in ## Props section
 */
function extractDocProps(docContent, pascal) {
  if (!docContent) {
    return [];
  }
  const normalized = docContent.replace(/\r\n/g, '\n');
  const found = new Map(); // name → { type }

  // 1. Extract props from JSX code examples
  //    Match <Pascal.Root prop1 prop2="val" prop3={expr}> or <Pascal prop1 ...>
  const codeBlocks = [];
  const codeRegex = /```tsx\n([\s\S]*?)```/g;
  let cm;
  while ((cm = codeRegex.exec(normalized)) !== null) {
    codeBlocks.push(cm[1]);
  }

  for (const code of codeBlocks) {
    // Match Root element opening tags (possibly multi-line).
    // Uses balanced-brace matching to avoid stopping at > inside {arrow => fn}
    const rootTagRegex = new RegExp(
      `<${pascal}\\.Root\\b((?:[^>{}/]|\\{(?:[^{}]|\\{[^{}]*\\})*\\}|/(?!>))*)(?:>|/>)`,
      'gs',
    );
    let rm;
    while ((rm = rootTagRegex.exec(code)) !== null) {
      const attrStr = rm[1].replace(/\{\s*\.\.\.[^}]+\}/g, '');
      if (!attrStr.trim()) {
        continue;
      }

      // Parse JSX attributes sequentially to avoid false positives inside strings.
      // Matches: propName="val" | propName={expr} | propName (boolean)
      const jsxAttrRegex = /\b([a-zA-Z]\w*)\s*(?:=\s*(?:"[^"]*"|\{[^}]*(?:\{[^}]*\}[^}]*)*\}))?/g;
      let am;
      while ((am = jsxAttrRegex.exec(attrStr)) !== null) {
        const name = am[1];
        const full = am[0];
        // Skip internal/framework props
        if (
          name === 'className' ||
          name === 'children' ||
          name === 'key' ||
          name === 'ref' ||
          name === 'style'
        ) {
          continue;
        }
        // Skip aria-* (attrStr may contain aria-label="..." which splits on hyphen)
        if (name === 'aria') {
          continue;
        }

        if (!found.has(name)) {
          if (full.includes('="')) {
            found.set(name, { type: 'string' });
          } else if (full.includes('={')) {
            found.set(name, { type: inferPropType(name) });
          } else {
            // Bare prop (boolean)
            found.set(name, { type: 'boolean' });
          }
        }
      }
    }
  }

  // 2. Extract props mentioned in ## Notes section
  const notesSectionMatch = normalized.match(/## Notes\n([\s\S]*?)(?=\n## |\n$|$)/);
  if (notesSectionMatch) {
    extractPropsFromProse(notesSectionMatch[1], found, { component: pascal, rootOnly: true });
  }

  // 3. Extract props mentioned in ## Props section (prose descriptions)
  const propsSectionMatch = normalized.match(/## Props\n([\s\S]*?)(?=\n## )/);
  if (propsSectionMatch) {
    extractPropsFromProse(propsSectionMatch[1], found, { component: pascal, rootOnly: false });
  }

  return [...found.entries()]
    .filter(([name]) => name !== 'className' && name !== 'children')
    .map(([name, info]) => ({
      name,
      type: info.type,
      required: false,
      description: null,
      default: null,
    }));
}

/** Extract backtick-quoted prop names from prose text */
function extractPropsFromProse(text, found, options = {}) {
  const { component = null, rootOnly = false } = options;
  // Match `propName` where propName looks like a React prop.
  // Only match well-known prop patterns to avoid false positives.
  const propRegex =
    /`(is[A-Z]\w+|default[A-Z]\w+|on[A-Z]\w+|allows\w+|selectionMode|orientation|placeholder|sortDescriptor|inputValue|isDismissable|placement|shouldFlip|crossOffset|allowsMultipleExpanded|allowsSorting)`/g;
  const lines = text.split('\n');

  for (const line of lines) {
    if (rootOnly && component) {
      const rootRefs = [`\`${component}.Root\``, `<${component}.Root`, `${component}.Root`];
      if (!rootRefs.some((ref) => line.includes(ref))) {
        continue;
      }
    }

    propRegex.lastIndex = 0;
    let m;
    while ((m = propRegex.exec(line)) !== null) {
      const name = m[1];
      const lower = line.toLowerCase();
      const token = `\`${name.toLowerCase()}\``;

      // Skip negated mentions (e.g. "NOT `isOpen`", "does not accept `open`").
      const isNegated =
        lower.includes(`not ${token}`) ||
        lower.includes(`(not ${token})`) ||
        lower.includes(`does not accept ${token}`) ||
        lower.includes(`doesn't accept ${token}`) ||
        lower.includes(`no ${token}`) ||
        lower.includes(`there is no ${token}`);
      if (isNegated) {
        continue;
      }

      if (!found.has(name)) {
        found.set(name, { type: inferPropType(name) });
      }
    }
  }
}

/** Infer prop type from naming convention */
function inferPropType(name) {
  if (/^is[A-Z]/.test(name)) {
    return 'boolean';
  }
  if (/^allows/.test(name)) {
    return 'boolean';
  }
  if (/^default[A-Z]/.test(name) && name.endsWith('Keys')) {
    return 'Iterable<Key>';
  }
  if (/^on[A-Z]/.test(name)) {
    return 'function';
  }
  if (name === 'selectionMode') {
    return "'none' | 'single' | 'multiple'";
  }
  if (name === 'orientation') {
    return "'horizontal' | 'vertical'";
  }
  if (name === 'placement') {
    return "'top' | 'bottom' | 'left' | 'right'";
  }
  if (name === 'sortDescriptor') {
    return 'SortDescriptor';
  }
  return 'string';
}

// ─── Status extraction from styled file ─────────────────────────────────────

/**
 * Extract the component's lifecycle status from JSDoc tags in its styled file.
 * Recognises:
 *   @status stable | experimental | deprecated
 *   @deprecated <migration message>   (only read when @status deprecated)
 * Defaults to 'stable' when the tag is absent.
 */
function extractStatus(styledContent) {
  if (!styledContent) {
    return { status: 'stable', deprecationNote: null };
  }
  const statusMatch = styledContent.match(/@status\s+(stable|experimental|deprecated)/);
  const status = statusMatch ? statusMatch[1] : 'stable';
  let deprecationNote = null;
  if (status === 'deprecated') {
    const noteMatch = styledContent.match(/@deprecated\s+(.+)/);
    deprecationNote = noteMatch ? noteMatch[1].trim() : null;
  }
  return { status, deprecationNote };
}

// ─── Example extraction from docs ───────────────────────────────────────────

function extractDocExamples(docContent) {
  if (!docContent) {
    return [];
  }
  const normalized = docContent.replace(/\r\n/g, '\n');
  const examples = [];
  const regex = /```tsx\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(normalized)) !== null) {
    const code = m[1].trim();
    if (code) {
      examples.push(code);
    }
  }
  return examples;
}

// ─── Pitfall extraction from docs ───────────────────────────────────────────

function extractPitfalls(docContent) {
  if (!docContent) {
    return { pitfalls: [], crossPitfallRefs: [] };
  }
  const normalized = docContent.replace(/\r\n/g, '\n');

  // Find ## Pitfalls section using indexOf for reliability
  const sectionMarker = '\n## Pitfalls\n';
  const start = normalized.indexOf(sectionMarker);
  if (start === -1) {
    return { pitfalls: [], crossPitfallRefs: [] };
  }

  // Find the end: next ## heading or EOF
  const contentStart = start + sectionMarker.length;
  const nextHeading = normalized.indexOf('\n## ', contentStart);
  const section = normalized.slice(contentStart, nextHeading === -1 ? undefined : nextHeading);

  const pitfalls = [];
  const crossPitfallRefs = [];

  // Split section into blocks separated by blank lines or comment boundaries
  // Find each <!-- pitfall: slug --> followed by a bullet
  const pitfallRegex =
    /<!-- pitfall: ([\w-]+) -->\n([\s\S]*?)(?=<!-- pitfall:|<!-- cross-pitfall-ref:|$)/g;
  let m;
  while ((m = pitfallRegex.exec(section)) !== null) {
    const id = m[1];
    // Strip leading modifier comments (<!-- prose-only -->, <!-- multi-idea-ok -->) before the bullet
    const block = m[2]
      .trim()
      .replace(/^(<!--[^>]*-->\s*)+/, '')
      .trim();
    // First line is the bullet: "- **Summary** — detail"
    const bulletMatch = block.match(/^- \*\*(.+?)\*\*(?:\s*[—–-]\s*(.*))?/s);
    if (!bulletMatch) {
      continue;
    }

    const summary = bulletMatch[1].replace(/`/g, '').trim();
    let detail = bulletMatch[2] ? bulletMatch[2].trim() : '';

    // Parse sub-bullets: "  - anti-pattern: `...`" and "  - fix: `...`"
    const antiPatterns = [...block.matchAll(/^\s+- anti-pattern:\s*`([^`]+)`/gm)].map((x) => x[1]);
    const fixes = [...block.matchAll(/^\s+- fix:\s*`([^`]+)`/gm)].map((x) => x[1]);

    // Extract complete example — fenced block form:
    //   - complete example:
    //     ```tsx
    //     ...
    //     ```
    let completeExample = null;
    const ceFencedMatch = block.match(
      / {2}- complete example:\s*\n {4}```[^\n]*\n([\s\S]*?)\n {4}```/,
    );
    if (ceFencedMatch) {
      completeExample = ceFencedMatch[1].replace(/^ {4}/gm, '');
    } else {
      // Legacy inline form: "  - complete example: `code`"
      const ceInlineMatch = block.match(/ {2}- complete example:\s*`([^`]+)`/);
      if (ceInlineMatch) {
        completeExample = ceInlineMatch[1];
      }
    }

    // Strip sub-bullets from detail
    detail = detail
      .replace(/\n\s+- anti-pattern:.*$/gm, '')
      .replace(/\n\s+- fix:.*$/gm, '')
      .replace(/\n\s+- complete example:[\s\S]*?(?=\n\s+- |\n<!-- |$)/m, '')
      .trim();

    pitfalls.push({
      id,
      summary,
      detail,
      ...(antiPatterns.length > 0 ? { antiPatterns } : {}),
      ...(fixes.length > 0 ? { fixes } : {}),
      ...(completeExample ? { completeExample } : {}),
    });
  }

  // Parse cross-pitfall refs: <!-- cross-pitfall-ref: slug -->
  const refRegex = /<!-- cross-pitfall-ref: ([\w-]+) -->/g;
  while ((m = refRegex.exec(section)) !== null) {
    crossPitfallRefs.push(m[1]);
  }

  return { pitfalls, crossPitfallRefs };
}

// ─── Main ───────────────────────────────────────────────────────────────────

function generateRegistry() {
  const componentIndex = parseComponentIndex();
  const reactPkg = JSON.parse(readFile(path.join(ROOT, 'packages/react/package.json')));
  const slugs = discoverComponents();

  const components = [];

  for (const slug of slugs) {
    const pascal = kebabToPascal(slug);
    const styledPath = findStyledFile(slug);
    const styledContent = styledPath ? readFile(styledPath) : null;
    const indexContent = readFile(path.join(REACT_SRC, slug, 'index.ts'));
    const cssContent = readFile(path.join(STYLES_SRC, `${slug}.css`));
    const docContent = readFile(path.join(DOCS_DIR, `${slug}.md`));

    const indexInfo = componentIndex.get(pascal);
    const kind = detectKind(indexContent, styledContent, pascal);
    const importPath = reactPkg.exports[`./${slug}`] ? `@tale-ui/react/${slug}` : null;

    // Props — extract from styled file, then supplement with doc-extracted props
    const typeAliases = extractTypeAliases(styledContent);
    const rawProps = extractProps(styledContent, pascal);
    const defaults = extractDefaults(styledContent);

    const aliasProps = rawProps.length === 0 ? extractRootAliasProps(styledContent, pascal) : [];
    if (aliasProps.length > 0) {
      const existingNames = new Set(rawProps.map((p) => p.name));
      for (const ap of aliasProps) {
        if (!existingNames.has(ap.name)) {
          rawProps.push(ap);
          existingNames.add(ap.name);
        }
      }
    }

    // For compound components, also extract consumer-facing props from docs
    // (examples + Notes section) to capture inherited RAC props.
    if (kind === 'compound') {
      const docProps = extractDocProps(docContent, pascal);
      const existingNames = new Set(rawProps.map((p) => p.name));
      for (const dp of docProps) {
        if (!existingNames.has(dp.name)) {
          rawProps.push(dp);
        }
      }
    }

    const props = rawProps.map((p) => {
      // Resolve allowedValues: if the type is a known alias → expand to string array;
      // if type is an inline string union ('a' | 'b') → parse directly.
      let allowedValues = null;
      if (typeAliases.has(p.type)) {
        allowedValues = typeAliases.get(p.type);
      } else if (/^'[^']*'(\s*\|\s*'[^']*')+$/.test(p.type)) {
        allowedValues = [...p.type.matchAll(/'([^']*)'/g)].map((v) => v[1]);
      }
      return {
        name: p.name,
        type: p.type,
        required: p.required,
        description: p.description,
        default: defaults[p.name] || p.default || null,
        ...(allowedValues ? { allowedValues } : {}),
      };
    });

    // Parts
    const parts = extractParts(indexContent, styledContent, pascal);

    // CSS classes
    const cssClasses = extractCSSClasses(cssContent);

    // Examples
    const examples = extractDocExamples(docContent);

    // Status
    const { status, deprecationNote } = extractStatus(styledContent);

    // Pitfalls
    const { pitfalls, crossPitfallRefs } = extractPitfalls(docContent);

    components.push({
      name: pascal,
      slug,
      import: importPath,
      category: indexInfo?.category || null,
      description: indexInfo?.description || null,
      kind,
      status,
      ...(deprecationNote ? { deprecationNote } : {}),
      props,
      parts,
      examples: examples.length > 0 ? examples : null,
      cssClasses: cssClasses.length > 0 ? cssClasses : null,
      pitfalls: pitfalls.length > 0 ? pitfalls : null,
      crossPitfallRefs: crossPitfallRefs.length > 0 ? crossPitfallRefs : null,
    });
  }

  return {
    schemaVersion: '1.1.0',
    taleUiVersion: reactPkg.version,
    components,
  };
}

// ─── Run ────────────────────────────────────────────────────────────────────

const registry = generateRegistry();
const output = `${JSON.stringify(registry, null, 2)}\n`;

if (checkMode) {
  const existing = readFile(REGISTRY_PATH);
  if (existing === output) {
    console.log('✅ Registry is up-to-date.');
    process.exit(0);
  } else {
    console.error('❌ Registry is out of date. Run: pnpm registry:generate');
    process.exit(1);
  }
} else {
  // Ensure registry directory exists
  const registryDir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }
  fs.writeFileSync(REGISTRY_PATH, output);
  console.log(`✅ Generated registry/components.json (${registry.components.length} components)`);
}
