import assert from 'node:assert/strict';

const SHARED_FOUNDATION_PATTERNS = [
  /^packages\/tokens\//,
  /^packages\/css\/src\/tokens\//,
  /^packages\/react\/src\/_primitives\//,
  /^packages\/styles\/src\/(?:index|_primitives)\.css$/,
  /^packages\/a2ui\/src\/(?:catalog|renderer)\b/,
  /^playground\/storybook\/\.storybook\//,
];

export function slugifyAccessibilityName(value) {
  assert.equal(typeof value, 'string', 'Accessibility component names must be strings');
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function normalizeRepositoryPath(value, repositoryRoot) {
  assert.equal(typeof value, 'string', 'Accessibility changed paths must be strings');
  let normalized = value.replaceAll('\\', '/').replace(/\/+/g, '/');
  const normalizedRoot = repositoryRoot
    ?.replaceAll('\\', '/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
  if (normalizedRoot && normalized.startsWith(`${normalizedRoot}/`)) {
    normalized = normalized.slice(normalizedRoot.length + 1);
  }
  return normalized.replace(/^\.\/+/, '').replace(/\/\.\//g, '/');
}

export function normalizeRepositoryPaths(paths, repositoryRoot) {
  return [
    ...new Set(paths.map((path) => normalizeRepositoryPath(path, repositoryRoot))),
  ].toSorted();
}

export function accessibilitySlugFromPath(path) {
  const normalized = normalizeRepositoryPath(path);
  const component = normalized.match(
    /^(?:packages\/react\/src|docs\/components)\/([^/]+)(?:\/|\.md$)/,
  )?.[1];
  const style = normalized.match(/^packages\/styles\/src\/([^/]+)\.css$/)?.[1];
  const story = normalized.match(/\/([^/]+)\.stories\.[jt]sx?$/)?.[1];
  const componentStyle = style && !['index', '_primitives'].includes(style) ? style : undefined;
  const value = component ?? componentStyle ?? story;
  return value ? slugifyAccessibilityName(value) : undefined;
}

export function accessibilitySlugsFromPaths(paths) {
  return [
    ...new Set(paths.map(accessibilitySlugFromPath).filter((value) => value !== undefined)),
  ].toSorted();
}

export function isSharedFoundationPath(path) {
  const normalized = normalizeRepositoryPath(path);
  return SHARED_FOUNDATION_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function createAccessibilitySelection({
  changedPaths = [],
  components,
  full = false,
  scheduled = false,
  baseAvailable = true,
  repositoryRoot,
} = {}) {
  const normalizedPaths = normalizeRepositoryPaths(changedPaths, repositoryRoot);
  const explicitSlugs = components
    ? [...new Set(components.map(slugifyAccessibilityName))].toSorted()
    : undefined;

  if (explicitSlugs) {
    return {
      mode: 'explicit-components',
      changedPaths: [],
      changedSlugs: explicitSlugs,
      storyStrategy: 'matching',
    };
  }
  if (full) {
    return {
      mode: scheduled ? 'scheduled-full' : 'explicit-full',
      changedPaths: [],
      changedSlugs: [],
      storyStrategy: scheduled ? 'all' : 'primary',
    };
  }
  if (!baseAvailable) {
    return {
      mode: 'base-unavailable',
      changedPaths: [],
      changedSlugs: [],
      storyStrategy: 'primary',
    };
  }

  const sharedFoundationChange = normalizedPaths.some(isSharedFoundationPath);
  return {
    mode: sharedFoundationChange ? 'shared-foundation-change' : 'changed-components',
    changedPaths: normalizedPaths,
    changedSlugs: accessibilitySlugsFromPaths(normalizedPaths),
    storyStrategy: sharedFoundationChange ? 'primary' : 'matching',
  };
}

export function storybookAccessibilityStories(storybookIndex) {
  assert.ok(
    storybookIndex && typeof storybookIndex === 'object',
    'Storybook index must be an object',
  );
  assert.ok(
    storybookIndex.entries && typeof storybookIndex.entries === 'object',
    'Storybook index must contain entries',
  );
  return Object.values(storybookIndex.entries)
    .filter((entry) => entry.type === 'story')
    .filter(
      (entry) => entry.title.startsWith('Components/') || entry.title.startsWith('Foundations/'),
    )
    .toSorted((left, right) => left.id.localeCompare(right.id));
}

export function primaryAccessibilityStories(stories) {
  const byTitle = new Map();
  for (const story of stories.toSorted((left, right) => left.id.localeCompare(right.id))) {
    const group = byTitle.get(story.title) ?? [];
    group.push(story);
    byTitle.set(story.title, group);
  }
  return [...byTitle.values()]
    .map(
      (group) =>
        group.find(({ id }) => id.endsWith('--all-variations')) ??
        group.find(({ id }) => id.endsWith('--default')) ??
        group.find(({ id }) => id.endsWith('--basic')) ??
        group[0],
    )
    .toSorted((left, right) => left.id.localeCompare(right.id));
}

export function selectAccessibilityStories(stories, selection) {
  if (selection.storyStrategy === 'all') {
    return stories.toSorted((left, right) => left.id.localeCompare(right.id));
  }
  if (selection.storyStrategy === 'primary') {
    return primaryAccessibilityStories(stories);
  }
  assert.equal(
    selection.storyStrategy,
    'matching',
    `Unknown accessibility story strategy: ${selection.storyStrategy}`,
  );
  const slugs = new Set(selection.changedSlugs);
  return stories
    .filter((story) => slugs.has(slugifyAccessibilityName(story.title.split('/').at(-1))))
    .toSorted((left, right) => left.id.localeCompare(right.id));
}
