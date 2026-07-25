#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import axe from 'axe-core';
import { JSDOM } from 'jsdom';

const ROOT = resolve(import.meta.dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const URL = valueAfter('--url');
const BASE = valueAfter('--base') ?? 'origin/main';
const COMPONENTS = valueAfter('--components')
  ?.split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const FULL = args.includes('--full');
const SCHEDULED = args.includes('--scheduled');
const SMOKE = args.includes('--smoke');
const CAPTURE = args.includes('--capture');
const ADOPT_REPORT = valueAfter('--adopt-report');
const OUTPUT = valueAfter('--output') ?? join(ROOT, '.artifacts/accessibility-current.json');
const BASELINE_PATH = join(ROOT, 'test/accessibility/baseline.json');
const EXCEPTIONS_PATH = join(ROOT, 'test/accessibility/exceptions.json');
const MANUAL_PATH = join(ROOT, 'test/accessibility/manual-evidence.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function validate(schemaName, value, valuePath) {
  const schema = readJson(join(ROOT, 'schemas', schemaName));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(schema);
  assert.ok(
    validator(value),
    `${valuePath}: ${ajv.errorsText(validator.errors, { separator: '\n' })}`,
  );
}

const baseline = readJson(BASELINE_PATH);
const exceptions = readJson(EXCEPTIONS_PATH);
const manualEvidence = readJson(MANUAL_PATH);
validate('accessibility-baseline.schema.json', baseline, BASELINE_PATH);
validate('accessibility-exceptions.schema.json', exceptions, EXCEPTIONS_PATH);
validate('manual-accessibility-evidence.schema.json', manualEvidence, MANUAL_PATH);
assert.deepEqual(
  new Set(manualEvidence.modalities.map(({ modality }) => modality)),
  new Set(['screen-reader', 'zoom-reflow', 'keyboard', 'touch', 'reduced-motion']),
  'Manual accessibility records must preserve every required modality',
);
for (const exception of exceptions.exceptions) {
  assert.ok(exception.expiresOn >= TODAY, `Expired accessibility exception ${exception.id}`);
}
for (const record of manualEvidence.modalities) {
  if (record.status === 'pending-manual') {
    assert.ok(
      record.reviewBy >= TODAY,
      `Manual accessibility review is overdue for ${record.modality}`,
    );
  }
}

if (ADOPT_REPORT) {
  const report = readJson(resolve(ROOT, ADOPT_REPORT));
  const changed = new Set(report.selection.changedSlugs.map((slug) => slug.replaceAll('-', '')));
  const accepted = report.violations.filter((violation) => {
    const storySlug = violation.storyId
      .split('--')[0]
      .replace(/^(?:components|foundations)-/, '')
      .replaceAll('-', '');
    return !changed.has(storySlug);
  });
  writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        ...baseline,
        capturedOn: TODAY,
        runner: { ...baseline.runner, version: axe.version },
        knownViolations: accepted,
      },
      null,
      2,
    )}\n`,
  );
  console.log(
    `ADOPTED: ${accepted.length} unchanged-story violations; rejected ${report.violations.length - accepted.length} changed-story violations`,
  );
  process.exit(0);
}

async function smoke() {
  const dom = new JSDOM('<main><button>Save</button></main>', {
    runScripts: 'dangerously',
    url: 'https://tale-ui.test/',
  });
  dom.window.eval(axe.source);
  const clean = await dom.window.axe.run(dom.window.document, {
    runOnly: ['button-name'],
  });
  assert.equal(clean.violations.length, 0, 'Axe smoke-test clean fixture regressed');
  dom.window.document.body.innerHTML = '<main><button></button></main>';
  const invalid = await dom.window.axe.run(dom.window.document, {
    runOnly: ['button-name'],
  });
  assert.ok(
    invalid.violations.some(({ id }) => id === 'button-name'),
    'Axe smoke test did not detect the intentional violation',
  );
  console.log(`OK: axe-core ${axe.version} detects and clears the maintained smoke fixtures`);
}

if (SMOKE) {
  await smoke();
  process.exit(0);
}

assert.ok(URL, 'Pass --url for a running Storybook, or use --smoke');

function changedPaths() {
  if (FULL) {
    return { paths: [], fallback: true, reason: SCHEDULED ? 'scheduled-full' : 'explicit-full' };
  }
  try {
    const output = execFileSync('git', ['diff', '--name-only', `${BASE}...HEAD`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return { paths: output.trim().split('\n').filter(Boolean), fallback: false };
  } catch {
    return { paths: [], fallback: true, reason: 'base-unavailable' };
  }
}

function slugify(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

const changes = COMPONENTS
  ? { paths: [], fallback: false, reason: 'explicit-components' }
  : changedPaths();
const sharedPatterns = [
  /^packages\/tokens\//,
  /^packages\/css\/src\/tokens\//,
  /^packages\/react\/src\/_primitives\//,
  /^packages\/styles\/src\/index\.css$/,
  /^packages\/a2ui\/src\/(?:catalog|renderer)\b/,
  /^playground\/storybook\/\.storybook\//,
];
if (changes.paths.some((path) => sharedPatterns.some((pattern) => pattern.test(path)))) {
  changes.fallback = true;
  changes.reason = 'shared-foundation-change';
}

const changedSlugs = new Set();
for (const component of COMPONENTS ?? []) {
  changedSlugs.add(slugify(component));
}
for (const path of changes.paths) {
  const component = path.match(
    /^(?:packages\/react\/src|docs\/components)\/([^/]+)(?:\/|\.md$)/,
  )?.[1];
  const style = path.match(/^packages\/styles\/src\/([^/]+)\.css$/)?.[1];
  const story = path.match(/\/([^/]+)\.stories\.[jt]sx?$/)?.[1];
  for (const value of [component, style, story]) {
    if (value) {
      changedSlugs.add(slugify(value));
    }
  }
}

async function fetchWithRetry(url, attempts = 60) {
  try {
    const response = await fetch(url);
    if (response.ok || attempts <= 1) {
      return response;
    }
  } catch (error) {
    if (attempts <= 1) {
      throw error;
    }
  }
  await new Promise((resolveRetry) => {
    setTimeout(resolveRetry, 500);
  });
  return fetchWithRetry(url, attempts - 1);
}

const indexUrl = new globalThis.URL('index.json', `${URL.replace(/\/$/, '')}/`);
const response = await fetchWithRetry(indexUrl);
assert.ok(response.ok, `Unable to load Storybook index: ${response.status}`);
const storyIndex = await response.json();
const stories = Object.values(storyIndex.entries)
  .filter((entry) => entry.type === 'story')
  .filter(
    (entry) => entry.title.startsWith('Components/') || entry.title.startsWith('Foundations/'),
  )
  .sort((left, right) => left.id.localeCompare(right.id));

function primaryStories(entries) {
  const byTitle = new Map();
  for (const story of entries) {
    const group = byTitle.get(story.title) ?? [];
    group.push(story);
    byTitle.set(story.title, group);
  }
  return [...byTitle.values()].map(
    (group) =>
      group.find(({ id }) => id.endsWith('--all-variations')) ??
      group.find(({ id }) => id.endsWith('--default')) ??
      group.find(({ id }) => id.endsWith('--basic')) ??
      group[0],
  );
}

let selected;
if (changes.fallback) {
  selected = SCHEDULED ? stories : primaryStories(stories);
} else {
  selected = stories.filter((story) => {
    const titleSlug = slugify(story.title.split('/').at(-1));
    return changedSlugs.has(titleSlug);
  });
}

const browser = await chromium.launch({ headless: true });
const violations = [];
try {
  const page = await browser.newPage();
  for (const story of selected) {
    const storyUrl = new globalThis.URL('iframe', `${URL.replace(/\/$/, '')}/`);
    storyUrl.searchParams.set('id', story.id);
    storyUrl.searchParams.set('viewMode', 'story');
    await page.goto(storyUrl.toString(), { waitUntil: 'networkidle' });
    await page.waitForSelector('#storybook-root');
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(async () =>
      globalThis.axe.run('#storybook-root', {
        resultTypes: ['violations'],
      }),
    );
    for (const violation of result.violations) {
      for (const node of violation.nodes) {
        violations.push({
          storyId: story.id,
          rule: violation.id,
          target: node.target.join(' > '),
          impact: violation.impact ?? 'minor',
        });
      }
    }
  }
} finally {
  await browser.close();
}

violations.sort(
  (left, right) =>
    left.storyId.localeCompare(right.storyId) ||
    left.rule.localeCompare(right.rule) ||
    left.target.localeCompare(right.target),
);
const keyOf = ({ storyId, rule, target }) => `${storyId}\n${rule}\n${target}`;
const known = new Set(baseline.knownViolations.map(keyOf));
const isExcepted = (violation) =>
  exceptions.exceptions.some(
    (exception) =>
      exception.storyId === violation.storyId &&
      exception.rule === violation.rule &&
      (!exception.targetContains || violation.target.includes(exception.targetContains)),
  );
const newViolations = violations.filter(
  (violation) => !known.has(keyOf(violation)) && !isExcepted(violation),
);
const currentKeys = new Set(violations.map(keyOf));
const resolved = baseline.knownViolations.filter((violation) => !currentKeys.has(keyOf(violation)));

const report = {
  schemaVersion: '1.0.0',
  runner: { name: 'axe-core', version: axe.version },
  selection: {
    base: BASE,
    mode: changes.fallback ? changes.reason : (changes.reason ?? 'changed-components'),
    changedPaths: changes.paths,
    changedSlugs: [...changedSlugs].sort(),
    storyCount: selected.length,
    stories: selected.map(({ id }) => id),
  },
  totals: {
    violations: violations.length,
    newViolations: newViolations.length,
    resolvedBaselineViolations: resolved.length,
    activeExceptions: exceptions.exceptions.length,
  },
  violations,
  newViolations,
  resolvedBaselineViolations: resolved,
};
mkdirSync(resolve(OUTPUT, '..'), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`);

if (CAPTURE) {
  const nextBaseline = {
    ...baseline,
    capturedOn: TODAY,
    runner: { ...baseline.runner, version: axe.version },
    knownViolations: violations,
  };
  writeFileSync(BASELINE_PATH, `${JSON.stringify(nextBaseline, null, 2)}\n`);
}

assert.equal(
  newViolations.length,
  0,
  `Found ${newViolations.length} new axe violation(s); inspect ${OUTPUT}`,
);
console.log(
  `OK: axe ${selected.length} stor${selected.length === 1 ? 'y' : 'ies'}, ${violations.length} known/excepted violations, ${resolved.length} resolved`,
);
