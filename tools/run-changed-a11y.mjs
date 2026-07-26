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
import {
  accessibilityViolationKey,
  resolvedAccessibilityViolations,
} from './accessibility-baseline.mjs';
import {
  createAccessibilitySelection,
  selectAccessibilityStories,
  storybookAccessibilityStories,
} from './accessibility-selection.mjs';

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
  try {
    const output = execFileSync('git', ['diff', '--name-only', `${BASE}...HEAD`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return { paths: output.trim().split('\n').filter(Boolean), baseAvailable: true };
  } catch {
    return { paths: [], baseAvailable: false };
  }
}

const changes = COMPONENTS || FULL ? { paths: [], baseAvailable: true } : changedPaths();
const selection = createAccessibilitySelection({
  changedPaths: changes.paths,
  components: COMPONENTS,
  full: FULL,
  scheduled: SCHEDULED,
  baseAvailable: changes.baseAvailable,
  repositoryRoot: ROOT,
});

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
const stories = storybookAccessibilityStories(storyIndex);
const selected = selectAccessibilityStories(stories, selection);

const browser = await chromium.launch({ headless: true });
const violations = [];
try {
  const page = await browser.newPage();
  for (const story of selected) {
    const storyUrl = new globalThis.URL('iframe.html', `${URL.replace(/\/$/, '')}/`);
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
const known = new Set(baseline.knownViolations.map(accessibilityViolationKey));
const isExcepted = (violation) =>
  exceptions.exceptions.some(
    (exception) =>
      exception.storyId === violation.storyId &&
      exception.rule === violation.rule &&
      (!exception.targetContains || violation.target.includes(exception.targetContains)),
  );
const newViolations = violations.filter(
  (violation) => !known.has(accessibilityViolationKey(violation)) && !isExcepted(violation),
);
const resolved = resolvedAccessibilityViolations(
  baseline.knownViolations,
  violations,
  selected.map(({ id }) => id),
);

const report = {
  schemaVersion: '1.0.0',
  runner: { name: 'axe-core', version: axe.version },
  selection: {
    base: BASE,
    mode: selection.mode,
    changedPaths: selection.changedPaths,
    changedSlugs: selection.changedSlugs,
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
