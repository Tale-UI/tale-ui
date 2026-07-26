#!/usr/bin/env node

/**
 * audit-coverage.js
 *
 * Reports which Tale UI components are missing from:
 *   1. ComponentAudit.tsx (playground visual audit)
 *   2. Storybook stories
 *
 * And which A2UI catalog types are missing from:
 *   3. full-showcase.json (A2UI few-shot example)
 *
 * Usage:
 *   node tools/audit-coverage.js          # human-readable
 *   node tools/audit-coverage.js --json    # machine-readable JSON
 *   node tools/audit-coverage.js --check   # exit 1 if any gaps
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_REGISTRY = path.join(ROOT, 'registry/components.json');
const A2UI_CATALOG = path.join(ROOT, 'registry/a2ui-catalog.json');
const COMPONENT_AUDIT = path.join(ROOT, 'playground/vite-app/src/demos/ComponentAudit.tsx');
const STORIES_DIR = path.join(ROOT, 'playground/storybook/src/stories');
const FULL_SHOWCASE = path.join(ROOT, 'packages/a2ui/src/agent/examples/full-showcase.json');

const isJson = process.argv.includes('--json');
const isCheck = process.argv.includes('--check');

/**
 * Components excluded from visual coverage audits.
 * These are provider wrappers or utilities with no renderable output.
 */
const VISUAL_AUDIT_EXCLUDED = new Set(['CSPProvider', 'I18nProvider', 'mergeProps', 'Virtualizer']);

/**
 * A2UI compatibility aliases that remain renderable but should not be promoted
 * in the full-showcase example used by agents.
 */
const A2UI_SHOWCASE_EXCLUDED = new Set(['Checkbox', 'Radio', 'Switch']);

/**
 * Public render surfaces whose registry component is intentionally represented
 * by a differently named export.
 */
const STORYBOOK_COVERAGE_ALIASES = new Map([['ToastRegion', 'Toast']]);

/* ─── Sources ─────────────────────────────────────────────────────────────── */

/** All Tale UI React component names from registry */
function loadReactComponents() {
  const registry = JSON.parse(fs.readFileSync(COMPONENTS_REGISTRY, 'utf8'));
  return (registry.components || []).map((c) => c.name).sort();
}

/** All A2UI type names from catalog, split into top-level and sub-parts */
function loadA2UITypes() {
  const catalog = JSON.parse(fs.readFileSync(A2UI_CATALOG, 'utf8'));
  const all = catalog.types || [];
  return {
    all: all.map((t) => t.name).sort(),
    subParts: new Set(all.filter((t) => t.isSubPart).map((t) => t.name)),
    topLevel: all.filter((t) => !t.isSubPart).map((t) => t.name).sort(),
  };
}

/* ─── ComponentAudit.tsx parsing ──────────────────────────────────────────── */

/** Extract component names from <Section title="X"> calls in ComponentAudit.tsx */
function parseComponentAudit() {
  const source = fs.readFileSync(COMPONENT_AUDIT, 'utf8');
  const names = new Set();
  for (const match of source.matchAll(/<Section\s[^>]*title="([A-Z][a-zA-Z]*)"/g)) {
    names.add(match[1]);
  }
  return names;
}

/* ─── Storybook parsing ────────────────────────────────────────────────────── */

/**
 * For each .stories.tsx file, extract Tale UI component names from
 * `import { X, Y } from '@tale-ui/react/...'` lines.
 * This handles grouped story files (ColorComponents, FileComponents, etc.)
 * by reflecting the actual imports rather than the filename.
 */
function parseStorybookCoverage() {
  const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith('.stories.tsx'));
  const covered = new Set();
  for (const file of files) {
    const source = fs.readFileSync(path.join(STORIES_DIR, file), 'utf8');
    for (const match of source.matchAll(/import\s+\{([^}]+)\}\s+from\s+'@tale-ui\/react\/[^']+'/g)) {
      for (const name of match[1].split(',')) {
        const trimmed = name.trim().split(/\s+as\s+/)[0].trim();
        if (/^[A-Z]/.test(trimmed)) {
          covered.add(trimmed);
          const registryName = STORYBOOK_COVERAGE_ALIASES.get(trimmed);
          if (registryName) {covered.add(registryName);}
        }
      }
    }
  }
  return covered;
}

/* ─── A2UI full-showcase parsing ──────────────────────────────────────────── */

/** Extract all unique A2UI component type names used in full-showcase.json */
function parseShowcaseCoverage() {
  const showcase = JSON.parse(fs.readFileSync(FULL_SHOWCASE, 'utf8'));
  const covered = new Set();
  for (const msg of showcase.messages || []) {
    if (msg.type !== 'surfaceUpdate') {continue;}
    for (const comp of msg.components || []) {
      const typeName = Object.keys(comp.component || {})[0];
      if (typeName) {covered.add(typeName);}
    }
  }
  return covered;
}

/* ─── Gap calculation ─────────────────────────────────────────────────────── */

function missing(all, covered) {
  return all.filter((name) => !covered.has(name));
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

function main() {
  const reactComponents = loadReactComponents().filter((n) => !VISUAL_AUDIT_EXCLUDED.has(n));
  const { topLevel: topLevelA2UI } = loadA2UITypes();
  const requiredTopLevelA2UI = topLevelA2UI.filter((n) => !A2UI_SHOWCASE_EXCLUDED.has(n));

  const auditCovered = parseComponentAudit();
  const storybookCovered = parseStorybookCoverage();
  const showcaseCovered = parseShowcaseCoverage();

  const results = {
    react: {
      total: reactComponents.length,
      componentAudit: {
        covered: reactComponents.filter((n) => auditCovered.has(n)).length,
        missing: missing(reactComponents, auditCovered),
      },
      storybook: {
        covered: reactComponents.filter((n) => storybookCovered.has(n)).length,
        missing: missing(reactComponents, storybookCovered),
      },
    },
    a2ui: {
      total: requiredTopLevelA2UI.length,
      fullShowcase: {
        covered: requiredTopLevelA2UI.filter((n) => showcaseCovered.has(n)).length,
        missing: missing(requiredTopLevelA2UI, showcaseCovered),
      },
    },
  };

  if (isJson) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  const hasGaps =
    results.react.componentAudit.missing.length > 0 ||
    results.react.storybook.missing.length > 0 ||
    results.a2ui.fullShowcase.missing.length > 0;

  console.log('=== Coverage Audit ===\n');

  // React components
  console.log(`React Components (${results.react.total} total)`);
  for (const [label, key] of [['ComponentAudit.tsx', 'componentAudit'], ['Storybook stories', 'storybook']]) {
    const r = results.react[key];
    const status = r.missing.length === 0 ? '✓' : '✗';
    console.log(`  ${status} ${label}: ${r.covered}/${results.react.total}`);
    for (const name of r.missing) {
      console.log(`      missing: ${name}`);
    }
  }

  console.log('');

  // A2UI types
  console.log(`A2UI Types (${results.a2ui.total} showcase-required non-sub-part types)`);
  const sr = results.a2ui.fullShowcase;
  const sStatus = sr.missing.length === 0 ? '✓' : '✗';
  console.log(`  ${sStatus} full-showcase.json: ${sr.covered}/${results.a2ui.total}`);
  for (const name of sr.missing) {
    console.log(`      missing: ${name}`);
  }

  console.log('');

  if (hasGaps) {
    console.log(`Coverage gaps found.`);
    if (isCheck) {process.exit(1);}
  } else {
    console.log('All coverage checks passed.');
  }
}

main();
