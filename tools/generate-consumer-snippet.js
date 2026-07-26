#!/usr/bin/env node
/**
 * Consumer Snippet Generator
 *
 * Generates docs/consumer-claude-md-snippet.md from:
 *   - registry/components.json  (namespace/simple component lists)
 *   - static template (workflow steps, setup, conventions)
 *
 * The slim snippet is ~1,300 tokens — removing the 114-pitfall wall of text
 * that previously cost ~14K tokens upfront. Pitfalls are now surfaced
 * just-in-time via the MCP server's get_component and plan_ui tools,
 * or by reading docs/components/{name}.md ## Pitfalls.
 *
 * The offline fallback is generated from the same source at
 * docs/consumer-claude-md-snippet-full.md for projects that cannot use MCP.
 *
 * Run:   node tools/generate-consumer-snippet.js          # generate and write
 *        node tools/generate-consumer-snippet.js --check   # compare; exit 1 if different
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');
const OUTPUT_PATH = path.join(ROOT, 'docs/consumer-claude-md-snippet.md');
const FULL_OUTPUT_PATH = path.join(ROOT, 'docs/consumer-claude-md-snippet-full.md');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function generate() {
  const registry = JSON.parse(readFile(REGISTRY_PATH));

  const compound = registry.components
    .filter((c) => c.kind === 'compound' && c.status !== 'deprecated')
    .map((c) => c.name)
    .sort();

  const simple = registry.components
    .filter((c) => c.kind === 'simple' && c.status !== 'deprecated')
    .map((c) => c.name)
    .sort();

  const deprecated = registry.components
    .filter((c) => c.status === 'deprecated')
    .map((c) => {
      const m = (c.deprecationNote || '').match(/Use (\w+)/);
      return m ? `${c.name} (use ${m[1]})` : c.name;
    })
    .sort();

  const deprecatedSection = deprecated.length
    ? `\n**Deprecated** (still functional — avoid in new code):\n${deprecated.join(', ')}.\n`
    : '';

  return `# Tale UI — CLAUDE.md snippet for consuming projects

Copy the section below into your project's \`CLAUDE.md\` file.

---

## UI Components (@tale-ui/react)

This project uses \`@tale-ui/react\` for all UI components.

Before generating or modifying component code, you MUST:

0. **Plan before generating JSX.** The Tale UI MCP tools are registered as deferred tools — you MUST call \`ToolSearch\` with \`"mcp__tale-ui__plan_ui"\` to load the schema before you can invoke them. Then call \`mcp__tale-ui__plan_ui\` with the UI description. It returns which components to use, a matching recipe if one exists, and key pitfalls — so you choose the right components before writing a single line of JSX. Skip this step only if you are making a trivial single-component change.

1. **Read the setup guide** in \`node_modules/@tale-ui/react/README.md\` — it contains critical configuration (rem base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Check the JSDoc \`@example\` on each component's .d.ts export** before using it. Every component's Root export includes a \`@example\` block showing the correct import path, sub-parts, and composition pattern. Read the \`.d.ts\` file for each component you intend to use:

   \`\`\`text
   node_modules/@tale-ui/react/esm/{name}/{Name}.styled.d.ts
   \`\`\`

   > **Exception:** A few components use \`{Name}.d.ts\` (not \`.styled.d.ts\`): \`CSPProvider\`, \`CheckboxGroup\`, \`RadioGroup\`, \`Container\`, and \`mergeProps\`.

   The \`@example\` block at the top of each file is the authoritative usage reference.

3. **For deeper details** (all props, all variants, advanced patterns), read the local component doc:

   \`\`\`text
   node_modules/@tale-ui/react/docs/components/{name}.md
   \`\`\`

4. **Do not guess component APIs.** Always check the \`@example\` block first. Incorrect usage (wrong sub-part names, missing wrapper components, wrong import paths) causes build failures.

5. **Component pitfalls:** Use \`ToolSearch\` with \`"mcp__tale-ui__get_component"\` to load the schema, then call \`mcp__tale-ui__get_component\` for each component you intend to use — it returns the full pitfall list including anti-patterns and fixes. Cross-component pitfalls (trigger styling, date types, import paths) are surfaced by \`mcp__tale-ui__plan_ui\` automatically.

## Namespace vs Simple components

**Namespace** (use \`<Component.Root>\`, never \`<Component>\` directly):
${compound.join(', ')}.

**Simple** (direct use, no \`.Root\`):
${simple.join(', ')}.
${deprecatedSection}
**Checkbox/radio/switch guidance:** For new UI, use \`CheckboxField\`, \`RadioField\` inside \`RadioGroup\`, and \`SwitchField\`. \`Checkbox\`, \`Radio\`, and \`Switch\` are deprecated compatibility APIs and should only be used when maintaining existing code or when explicitly requested.

## General conventions

- **No \`JSX.Element\` return types or \`React.FC\`** — plain functions with no return type: \`export function MyComponent() { ... }\`
- **Token suffixes:** CSS tokens use \`-s\`/\`-m\`/\`-l\`; component \`size\` props use \`-sm\`/\`-md\`/\`-lg\`
- **Max gap:** \`Row\`/\`Column\` \`gap\` max is \`'2xl'\` — \`'3xl'\`/\`'4xl'\` do not exist
- **Spacing scale:** use \`4xs/3xs/2xs\` for micro/metadata gaps, \`xs\` for compact groups and action rows, \`s\` for card/form stacks, \`m\` for roomy component groups, and \`l/xl/2xl\` only for page-level rhythm or large editorial gaps.
- **Typography hierarchy:** type should get smaller as content nests. For apps/dashboards use \`heading-l\` page title, \`title-l\` section title, \`title-s\` card title, \`label-s/m\` item labels, \`text-s/xs\` supporting copy, and \`mono-s/xs\` for commands/paths. Reserve \`display-*\` for heroes.
- **Layout:** Use \`<Row>\` (horizontal flex) and \`<Column>\` (vertical flex) — import each separately; \`Column\` is NOT re-exported from \`@tale-ui/react/row\`
- **Triggers:** Never nest \`<Button>\`/\`<IconButton>\` inside overlay triggers — triggers render their own \`<button>\`. Style with \`className="tale-button tale-button--primary tale-button--md"\`
- **Imports:** Use per-component import paths — \`import { Button } from '@tale-ui/react/button'\`, not barrel imports
- **No global styles on semantic HTML** — Tale UI renders \`<section>\`, \`<header>\`, etc. internally; global element rules leak into overlays

6. **Charts (separate package):** Install \`@tale-ui/charts\` and \`recharts\` separately. Import chart styles via \`import '@tale-ui/charts/styles';\`. Charts use the same compound parts pattern: \`BarChart.Root\`, \`BarChart.Bar\`, etc.

8. **A2UI protocol support (optional):** If this project uses AI agents that render UI via the [A2UI protocol](https://a2ui.org/), install \`@tale-ui/a2ui\`. It maps A2UI agent messages to Tale UI components. See \`node_modules/@tale-ui/a2ui/README.md\` or the [integration guide](https://github.com/Tale-UI/tale-ui/blob/main/docs/a2ui-integration.md). Quick setup:

   \`\`\`tsx
   import { A2UIProvider, A2UISurface } from '@tale-ui/a2ui/renderer';
   import { taleUICatalog } from '@tale-ui/a2ui/catalog';

   <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
     <A2UISurface surfaceId="main" />
   </A2UIProvider>
   \`\`\`

   Common catalog types include \`TextInput\`, \`TextAreaInput\`, \`NumberInput\`, \`SliderInput\`, \`SearchInput\`, and \`Progress\` in addition to shared layout/content types like \`Column\`, \`Text\`, and \`Button\`.

7. **Dark mode must persist between refreshes.** Every new app must:

   a. Add \`class="tale-ui"\` and \`data-color-mode\` to \`<html>\`:
   \`\`\`html
   <html class="tale-ui" data-color-mode="light">
   \`\`\`

   b. Include this inline script in \`<head>\` before any CSS or JS to avoid a flash of wrong theme:
   \`\`\`html
   <script>
     (function() {
       var mode = localStorage.getItem('color-mode')
         || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
       document.documentElement.setAttribute('data-color-mode', mode);
     })();
   </script>
   \`\`\`

   c. Use \`ColorModeToggle\` for the toggle UI — it handles \`localStorage\` and \`data-color-mode\` automatically:
   \`\`\`tsx
   import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

   <ColorModeToggle />
   \`\`\`

9. **Theming with category tokens.** Override component families in one place by setting category tokens on \`:root\`. These tokens are defined in \`@tale-ui/react-styles\` and default to the same semantic token values they replace — so changing them shifts the entire family simultaneously:

   \`\`\`css
   :root {
     /* Retheme all form field inputs at once */
     --field-bg: var(--neutral-10);
     --field-border-color: var(--neutral-20);
     --field-radius: var(--radius-s);

     /* Retheme all dropdown popups and menus */
     --popup-bg: var(--neutral-12);
     --popup-radius: var(--radius-m);
     --popup-shadow: var(--shadow-l);

     /* Retheme all modal dialogs and drawers */
     --modal-title-color: var(--color-80);
     --modal-backdrop-bg: var(--scrim-strong);

     /* Retheme all progress bars and meters */
     --progress-track-height: 0.25rem;
     --progress-indicator-bg: var(--color-60);
   }
   \`\`\`

   **Available category token families:**

   | Family | Tokens | Components |
   |---|---|---|
   | \`--field-*\` | \`--field-min-height\`, \`--field-padding-block\`, \`--field-padding-inline\`, \`--field-border-color\`, \`--field-radius\`, \`--field-bg\`, \`--field-color\`, \`--field-font-family\`, \`--field-font-size\`, \`--field-focus-border\`, \`--field-focus-glow\`, \`--field-placeholder-color\`, \`--field-label-color\`, \`--field-label-font-size\`, \`--field-label-font-weight\`, \`--field-description-color\`, \`--field-error-color\` | Input, Select, Combobox, Autocomplete, SearchField, TextField, DateField, TimeField, PaymentInput + labels/descriptions/errors |
   | \`--popup-*\` | \`--popup-bg\`, \`--popup-border-color\`, \`--popup-radius\`, \`--popup-shadow\` | Select, Combobox, Autocomplete, Menu, ContextMenu, Popover popups |
   | \`--item-*\` | \`--item-padding-block\`, \`--item-padding-inline\`, \`--item-gap\`, \`--item-radius\`, \`--item-color\`, \`--item-font-size\`, \`--item-focus-bg\`, \`--item-focus-color\` | All dropdown/menu items |
   | \`--group-label-*\` | \`--group-label-color\`, \`--group-label-font-size\` | Section headers in dropdowns/menus |
   | \`--modal-*\` | \`--modal-title-color\`, \`--modal-title-font-size\`, \`--modal-description-color\`, \`--modal-description-font-size\`, \`--modal-backdrop-bg\`, \`--modal-actions-gap\` | AlertDialog, Dialog, Drawer |
   | \`--progress-*\` | \`--progress-track-height\`, \`--progress-track-bg\`, \`--progress-indicator-bg\`, \`--progress-radius\` | ProgressBar, Meter |
`;
}

const output = generate();
const fullOutput = output
  .replace(
    "# Tale UI — CLAUDE.md snippet for consuming projects\n\nCopy the section below into your project's `CLAUDE.md` file.",
    "# Tale UI — offline CLAUDE.md snippet for consuming projects\n\nUse this generated fallback when Tale UI MCP is unavailable. Copy the section below into your project's `CLAUDE.md` file.",
  )
  .replace(
    /0\. \*\*Plan before generating JSX\.\*\*.+?Skip this step only if you are making a trivial single-component change\./,
    '0. **Plan before generating JSX.** Search the bundled component docs and recipes before choosing components. Identify the required imports, composition pattern, and relevant pitfalls before writing JSX. Skip this step only for a trivial single-component change.',
  )
  .replace(
    /5\. \*\*Component pitfalls:\*\*.+?automatically\./,
    '5. **Component pitfalls:** Read the `## Pitfalls` section in `node_modules/@tale-ui/react/docs/components/{name}.md` for every component you intend to use, plus `node_modules/@tale-ui/react/docs/pitfalls.md` for cross-component rules.',
  );

if (checkMode) {
  const existing = readFile(OUTPUT_PATH);
  const existingFull = readFile(FULL_OUTPUT_PATH);
  if (existing === output && existingFull === fullOutput) {
    console.log('✅ Consumer snippets are up-to-date.');
    process.exit(0);
  } else {
    console.error('❌ Consumer snippets are out of date. Run: pnpm snippet:generate');
    process.exit(1);
  }
} else {
  fs.writeFileSync(OUTPUT_PATH, output);
  fs.writeFileSync(FULL_OUTPUT_PATH, fullOutput);
  const tokens = Math.round(output.length / 4); // rough estimate
  console.log(`✅ Generated consumer snippets (slim ~${tokens} tokens estimated)`);
}
