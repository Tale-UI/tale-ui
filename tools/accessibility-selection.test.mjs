import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createAccessibilitySelection,
  normalizeRepositoryPath,
  primaryAccessibilityStories,
  selectAccessibilityStories,
  slugifyAccessibilityName,
  storybookIframePathFromProbe,
} from './accessibility-selection.mjs';

const stories = [
  { id: 'components-button--basic', type: 'story', title: 'Components/Button' },
  { id: 'components-button--default', type: 'story', title: 'Components/Button' },
  {
    id: 'components-button--all-variations',
    type: 'story',
    title: 'Components/Button',
  },
  { id: 'components-toast--example', type: 'story', title: 'Components/Toast' },
  { id: 'foundations-colour--basic', type: 'story', title: 'Foundations/Colour' },
];

test('normalizes repository paths and component names deterministically', () => {
  assert.equal(
    normalizeRepositoryPath(
      String.raw`C:\repo\packages\react\src\button\Button.styled.tsx`,
      'C:/repo',
    ),
    'packages/react/src/button/Button.styled.tsx',
  );
  assert.equal(slugifyAccessibilityName('OverflowList'), 'overflow-list');
});

test('selects the supported iframe route for dev and static Storybook servers', () => {
  assert.equal(storybookIframePathFromProbe(200, null), 'iframe.html');
  assert.equal(storybookIframePathFromProbe(301, '/iframe'), 'iframe');
  assert.equal(storybookIframePathFromProbe(302, 'https://storybook.test/iframe'), 'iframe');
  assert.equal(storybookIframePathFromProbe(302, '/unrelated'), 'iframe.html');
});

test('retains component paths and slugs when a shared style entry triggers broad coverage', () => {
  assert.deepEqual(
    createAccessibilitySelection({
      changedPaths: [
        'packages/styles/src/index.css',
        './packages/react/src/toast/Toast.styled.tsx',
        'docs/components/toast.md',
      ],
    }),
    {
      mode: 'shared-foundation-change',
      changedPaths: [
        'docs/components/toast.md',
        'packages/react/src/toast/Toast.styled.tsx',
        'packages/styles/src/index.css',
      ],
      changedSlugs: ['toast'],
      storyStrategy: 'primary',
    },
  );
});

test('treats tokens, primitives, and Storybook configuration as shared foundations', () => {
  for (const path of [
    'packages/tokens/tokens.json',
    'packages/react/src/_primitives/Field.tsx',
    'packages/styles/src/_primitives.css',
    'playground/storybook/.storybook/preview.tsx',
  ]) {
    assert.equal(
      createAccessibilitySelection({ changedPaths: [path] }).mode,
      'shared-foundation-change',
      path,
    );
  }
});

test('keeps component-only and explicit component selection distinct', () => {
  assert.deepEqual(
    createAccessibilitySelection({
      changedPaths: ['packages/react/src/outline/Outline.styled.tsx'],
    }),
    {
      mode: 'changed-components',
      changedPaths: ['packages/react/src/outline/Outline.styled.tsx'],
      changedSlugs: ['outline'],
      storyStrategy: 'matching',
    },
  );
  assert.deepEqual(createAccessibilitySelection({ components: ['Toast', 'AspectRatio'] }), {
    mode: 'explicit-components',
    changedPaths: [],
    changedSlugs: ['aspect-ratio', 'toast'],
    storyStrategy: 'default-matching',
  });
});

test('preserves distinct unavailable, explicit-full, and scheduled-full modes', () => {
  assert.equal(createAccessibilitySelection({ baseAvailable: false }).mode, 'base-unavailable');
  assert.deepEqual(createAccessibilitySelection({ full: true }), {
    mode: 'explicit-full',
    changedPaths: [],
    changedSlugs: [],
    storyStrategy: 'primary',
  });
  assert.deepEqual(createAccessibilitySelection({ full: true, scheduled: true }), {
    mode: 'scheduled-full',
    changedPaths: [],
    changedSlugs: [],
    storyStrategy: 'all',
  });
});

test('selects deterministic primary and component-matching stories', () => {
  assert.deepEqual(
    primaryAccessibilityStories(stories).map(({ id }) => id),
    ['components-button--all-variations', 'components-toast--example', 'foundations-colour--basic'],
  );
  assert.deepEqual(
    selectAccessibilityStories(
      stories,
      createAccessibilitySelection({ components: ['Button'] }),
    ).map(({ id }) => id),
    ['components-button--default'],
  );
});
