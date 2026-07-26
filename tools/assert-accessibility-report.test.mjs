import assert from 'node:assert/strict';
import test from 'node:test';
import { assertAccessibilityReport } from './assert-accessibility-report.mjs';

const storybookIndex = {
  entries: {
    'components-aspect-ratio--all-variations': {
      id: 'components-aspect-ratio--all-variations',
      type: 'story',
      title: 'Components/AspectRatio',
    },
    'components-aspect-ratio--default': {
      id: 'components-aspect-ratio--default',
      type: 'story',
      title: 'Components/AspectRatio',
    },
    'components-toast--default': {
      id: 'components-toast--default',
      type: 'story',
      title: 'Components/Toast',
    },
    'foundations-colour--basic': {
      id: 'foundations-colour--basic',
      type: 'story',
      title: 'Foundations/Colour',
    },
  },
};

function report(selection) {
  return {
    schemaVersion: '1.0.0',
    runner: { name: 'axe-core', version: '4.11.1' },
    selection: {
      base: 'base-sha',
      ...selection,
      storyCount: selection.stories.length,
    },
    totals: {
      violations: 0,
      newViolations: 0,
      resolvedBaselineViolations: 0,
      activeExceptions: 0,
    },
    violations: [],
    newViolations: [],
    resolvedBaselineViolations: [],
  };
}

test('accepts deterministic broad shared-foundation evidence', () => {
  assert.doesNotThrow(() =>
    assertAccessibilityReport({
      report: report({
        mode: 'shared-foundation-change',
        changedPaths: [
          'packages/react/src/aspect-ratio/AspectRatio.styled.tsx',
          'packages/styles/src/index.css',
        ],
        changedSlugs: ['aspect-ratio'],
        stories: [
          'components-aspect-ratio--all-variations',
          'components-toast--default',
          'foundations-colour--basic',
        ],
      }),
      mode: 'shared-foundation-change',
      components: ['AspectRatio'],
      stories: ['components-aspect-ratio--all-variations'],
      storybookIndex,
    }),
  );
});

test('accepts exact explicit cumulative components and their default stories', () => {
  assert.doesNotThrow(() =>
    assertAccessibilityReport({
      report: report({
        mode: 'explicit-components',
        changedPaths: [],
        changedSlugs: ['aspect-ratio', 'toast'],
        stories: ['components-aspect-ratio--default', 'components-toast--default'],
      }),
      mode: 'explicit-components',
      components: ['Toast', 'AspectRatio'],
      stories: ['components-aspect-ratio--default', 'components-toast--default'],
      storybookIndex,
    }),
  );
});

test('rejects fallback modes, missing current paths, and unrelated fallback stories', () => {
  const shared = report({
    mode: 'base-unavailable',
    changedPaths: ['packages/styles/src/index.css'],
    changedSlugs: ['aspect-ratio'],
    stories: [
      'components-aspect-ratio--all-variations',
      'components-toast--default',
      'foundations-colour--basic',
    ],
  });
  assert.throws(
    () =>
      assertAccessibilityReport({
        report: shared,
        mode: 'shared-foundation-change',
        components: ['AspectRatio'],
        stories: ['components-aspect-ratio--all-variations'],
        storybookIndex,
      }),
    /shared-foundation-change selection/,
  );

  shared.selection.mode = 'shared-foundation-change';
  assert.throws(
    () =>
      assertAccessibilityReport({
        report: shared,
        mode: 'shared-foundation-change',
        components: ['AspectRatio'],
        stories: ['components-aspect-ratio--all-variations'],
        storybookIndex,
      }),
    /cannot re-derive current-bundle component/,
  );

  const cumulative = report({
    mode: 'explicit-components',
    changedPaths: [],
    changedSlugs: ['aspect-ratio'],
    stories: ['components-toast--default'],
  });
  assert.throws(
    () =>
      assertAccessibilityReport({
        report: cumulative,
        mode: 'explicit-components',
        components: ['AspectRatio'],
        stories: ['components-toast--default'],
        storybookIndex,
      }),
    /unrelated fallback story/,
  );
});

test('rejects inconsistent report totals and missing required stories', () => {
  const invalid = report({
    mode: 'explicit-components',
    changedPaths: [],
    changedSlugs: ['toast'],
    stories: ['components-toast--default'],
  });
  invalid.totals.newViolations = 1;
  assert.throws(
    () =>
      assertAccessibilityReport({
        report: invalid,
        mode: 'explicit-components',
        components: ['Toast'],
        stories: ['components-toast--default'],
        storybookIndex,
      }),
    /totals.newViolations must match/,
  );

  invalid.totals.newViolations = 0;
  assert.throws(
    () =>
      assertAccessibilityReport({
        report: invalid,
        mode: 'explicit-components',
        components: ['Toast'],
        stories: ['components-toast--missing'],
        storybookIndex,
      }),
    /Required story is absent from Storybook/,
  );
});

test('rejects a non-default cumulative story even when its title matches', () => {
  const invalid = report({
    mode: 'explicit-components',
    changedPaths: [],
    changedSlugs: ['aspect-ratio'],
    stories: ['components-aspect-ratio--all-variations'],
  });
  assert.throws(
    () =>
      assertAccessibilityReport({
        report: invalid,
        mode: 'explicit-components',
        components: ['AspectRatio'],
        stories: ['components-aspect-ratio--all-variations'],
        storybookIndex,
      }),
    /exact default-story set/,
  );
});
