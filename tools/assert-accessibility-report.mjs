#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  accessibilitySlugsFromPaths,
  normalizeRepositoryPaths,
  primaryAccessibilityStories,
  slugifyAccessibilityName,
  storybookAccessibilityStories,
} from './accessibility-selection.mjs';

function sortedUnique(values) {
  return [...new Set(values)].toSorted();
}

function assertStringArray(value, label) {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  for (const item of value) {
    assert.equal(typeof item, 'string', `${label} entries must be strings`);
  }
}

export function assertAccessibilityReport({
  report,
  mode,
  components,
  stories: requiredStories,
  storybookIndex,
}) {
  assert.ok(report && typeof report === 'object', 'Accessibility report must be an object');
  assert.equal(report.schemaVersion, '1.0.0', 'Accessibility report schemaVersion must be 1.0.0');
  assert.equal(report.runner?.name, 'axe-core', 'Accessibility report must identify axe-core');
  assert.equal(
    typeof report.runner?.version,
    'string',
    'Accessibility report must record axe version',
  );
  assert.ok(
    report.selection && typeof report.selection === 'object',
    'Report selection is required',
  );
  assert.equal(typeof report.selection.base, 'string', 'Report selection must record its base');
  assertStringArray(report.selection.changedPaths, 'selection.changedPaths');
  assertStringArray(report.selection.changedSlugs, 'selection.changedSlugs');
  assertStringArray(report.selection.stories, 'selection.stories');
  assert.equal(
    report.selection.storyCount,
    report.selection.stories.length,
    'selection.storyCount must match the selected story IDs',
  );
  assert.deepEqual(
    report.selection.changedPaths,
    normalizeRepositoryPaths(report.selection.changedPaths),
    'selection.changedPaths must be normalized, unique, and sorted',
  );
  assert.deepEqual(
    report.selection.changedSlugs,
    sortedUnique(report.selection.changedSlugs),
    'selection.changedSlugs must be unique and sorted',
  );
  assert.deepEqual(
    report.selection.stories,
    sortedUnique(report.selection.stories),
    'selection.stories must be unique and sorted',
  );

  for (const field of ['violations', 'newViolations', 'resolvedBaselineViolations']) {
    assert.ok(Array.isArray(report[field]), `${field} must be an array`);
  }
  assert.equal(
    report.totals?.violations,
    report.violations.length,
    'totals.violations must match violations',
  );
  assert.equal(
    report.totals?.newViolations,
    report.newViolations.length,
    'totals.newViolations must match newViolations',
  );
  assert.equal(
    report.totals?.resolvedBaselineViolations,
    report.resolvedBaselineViolations.length,
    'totals.resolvedBaselineViolations must match resolvedBaselineViolations',
  );
  assert.equal(report.totals.newViolations, 0, 'Accessibility report has new axe violations');

  const expectedComponents = sortedUnique(components.map(slugifyAccessibilityName));
  const expectedStoryIds = sortedUnique(requiredStories);
  assert.ok(expectedComponents.length > 0, 'At least one required component is needed');
  assert.ok(expectedStoryIds.length > 0, 'At least one required story is needed');

  const availableStories = storybookAccessibilityStories(storybookIndex);
  const storiesById = new Map(availableStories.map((story) => [story.id, story]));
  const defaultStoryIds = expectedComponents
    .map((component) => {
      const matches = availableStories.filter(
        (story) =>
          story.id.endsWith('--default') &&
          slugifyAccessibilityName(story.title.split('/').at(-1)) === component,
      );
      assert.equal(
        matches.length,
        1,
        `Expected exactly one default Storybook story for ${component}`,
      );
      return matches[0].id;
    })
    .toSorted();
  for (const storyId of report.selection.stories) {
    assert.ok(storiesById.has(storyId), `Selected story is absent from Storybook: ${storyId}`);
  }
  for (const storyId of expectedStoryIds) {
    assert.ok(storiesById.has(storyId), `Required story is absent from Storybook: ${storyId}`);
    assert.ok(
      report.selection.stories.includes(storyId),
      `Required story is absent from the report: ${storyId}`,
    );
  }

  for (const component of expectedComponents) {
    assert.ok(
      report.selection.changedSlugs.includes(component),
      `Required component is absent from selection.changedSlugs: ${component}`,
    );
    assert.ok(
      expectedStoryIds.some((storyId) => {
        const story = storiesById.get(storyId);
        return story && slugifyAccessibilityName(story.title.split('/').at(-1)) === component;
      }),
      `Required component relies on an unrelated fallback story: ${component}`,
    );
  }

  if (mode === 'shared-foundation-change') {
    assert.equal(
      report.selection.mode,
      'shared-foundation-change',
      'Shared report must come from shared-foundation-change selection',
    );
    assert.ok(report.selection.changedPaths.length > 0, 'Shared report must retain changed paths');
    assert.ok(
      report.selection.changedPaths.includes('packages/styles/src/index.css'),
      'Shared report must retain packages/styles/src/index.css',
    );
    const derivedSlugs = accessibilitySlugsFromPaths(report.selection.changedPaths);
    for (const component of expectedComponents) {
      assert.ok(
        derivedSlugs.includes(component),
        `Shared report cannot re-derive current-bundle component ${component} from changed paths`,
      );
    }
    assert.deepEqual(
      report.selection.stories,
      primaryAccessibilityStories(availableStories).map(({ id }) => id),
      'Shared report must select the deterministic primary story for every component/foundation',
    );
  } else {
    assert.equal(mode, 'explicit-components', `Unsupported accessibility assertion mode: ${mode}`);
    assert.equal(
      report.selection.mode,
      'explicit-components',
      'Cumulative report must come from explicit-components selection',
    );
    assert.deepEqual(
      report.selection.changedPaths,
      [],
      'Explicit cumulative report must not contain changed paths',
    );
    assert.deepEqual(
      report.selection.changedSlugs,
      expectedComponents,
      'Explicit cumulative report must contain the exact cumulative component set',
    );
    assert.deepEqual(
      expectedStoryIds,
      defaultStoryIds,
      'Explicit cumulative required stories must be the exact default-story set',
    );
    assert.deepEqual(
      report.selection.stories,
      defaultStoryIds,
      'Explicit cumulative report must select exactly one default story per component',
    );
    for (const storyId of report.selection.stories) {
      const story = storiesById.get(storyId);
      assert.ok(
        expectedComponents.includes(slugifyAccessibilityName(story.title.split('/').at(-1))),
        `Explicit cumulative report selected unrelated story ${storyId}`,
      );
    }
  }
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  assert.notEqual(index, -1, `Missing required ${flag}`);
  const value = args[index + 1];
  assert.ok(value && !value.startsWith('--'), `Missing value for ${flag}`);
  return value;
}

function commaList(value) {
  const values = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  assert.ok(values.length > 0, 'Comma-separated assertion lists must not be empty');
  return values;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const args = process.argv.slice(2);
  const reportPath = valueAfter(args, '--report');
  const mode = valueAfter(args, '--mode');
  const storybookIndexPath = valueAfter(args, '--storybook-index');
  assertAccessibilityReport({
    report: readJson(reportPath),
    mode,
    components: commaList(valueAfter(args, '--components')),
    stories: commaList(valueAfter(args, '--stories')),
    storybookIndex: readJson(storybookIndexPath),
  });
  console.log(`OK: ${reportPath} satisfies ${mode} accessibility evidence`);
}
