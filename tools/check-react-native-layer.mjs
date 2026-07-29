#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { loadAndValidateNativeInventory } from './lib/react-native-implementation-inventory.mjs';

const root = new URL('../', import.meta.url);
const mode = process.argv[2] ?? 'all';
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const registry = readJson('registry/platforms/react-native.json');
const storyControlMetadata = readJson('registry/platforms/react-native-story-controls.json');
const manifest = readJson('packages/react-native/package.json');
const inventory = loadAndValidateNativeInventory();
const storyDirectory = new URL('playground/react-native-storybook/src/', root);
const storySources = [];
const collectStories = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) {
      collectStories(target);
    } else if (entry.name.endsWith('.stories.tsx')) {
      storySources.push({ target, source: readFileSync(target, 'utf8') });
    }
  }
};
collectStories(storyDirectory);
const stories = storySources.map(({ source }) => source).join('\n');
const registryById = new Map(registry.components.map((component) => [component.id, component]));
const implemented = inventory.implementations.map((implementation) => ({
  ...registryById.get(implementation.id),
  ...implementation,
}));
const fixtureSource = readFileSync(
  new URL('playground/react-native-storybook/src/Registry.fixtures.tsx', root),
  'utf8',
);
const playgroundSource = readFileSync(
  new URL('playground/react-native-storybook/src/NativePlayground.tsx', root),
  'utf8',
);

const checkAccessibility = () => {
  for (const component of implemented) {
    assert.ok(component.evidence.accessibility, `${component.id} lacks accessibility evidence`);
    assert.ok(component.evidence.testPlan, `${component.id} lacks a test plan`);
    assert.ok(component.owner, `${component.id} lacks an owner`);
  }
  console.log(`OK: ${implemented.length} implemented native accessibility evidence records.`);
};

const checkPerformance = async () => {
  // eslint-disable-next-line import/no-relative-packages
  const { harbourTheme } = await import('../packages/foundations/build/esm/theme-presets.js');
  // eslint-disable-next-line import/no-relative-packages
  const { resolveTheme } = await import('../packages/foundations/build/esm/theme.js');
  const started = performance.now();
  for (let iteration = 0; iteration < 1_000; iteration += 1) {
    resolveTheme(harbourTheme, iteration % 2 === 0 ? 'light' : 'dark');
  }
  const duration = performance.now() - started;
  assert.ok(duration < 250, `Theme resolution exceeded 250ms/1000: ${duration}ms`);
  console.log(`OK: 1,000 theme resolutions in ${duration.toFixed(2)}ms (budget 250ms).`);
};

const checkCoverage = () => {
  const stable = registry.components.filter(({ webLifecycle }) => webLifecycle === 'stable');
  assert.equal(stable.filter(({ delivery }) => delivery !== 'stable').length, 0);
  assert.equal(registry.counts.total, 133);
  assert.equal(registry.counts.webStable, 112);
  assert.equal(registry.counts.completed, 114);
  assert.equal(registry.counts.proposed, 19);
  assert.equal(registry.counts.implementations, 40);
  const componentStories = storySources.filter(({ target }) =>
    fileURLToPath(target).includes('/src/components/'),
  );
  assert.equal(componentStories.length, 40);
  assert.equal(
    componentStories.reduce(
      (count, { source }) =>
        count + (source.match(/export const (?:Playground|AllVariations)/gu)?.length ?? 0),
      0,
    ),
    80,
  );
  assert.deepEqual(
    Object.keys(storyControlMetadata).sort(),
    implemented.map(({ slug }) => slug).sort(),
  );
  for (const component of implemented) {
    assert.ok(manifest.exports[component.publicSubpath], `${component.id} lacks a public export`);
    assert.ok(
      stories.includes(`from '@tale-ui/react-native/${component.publicSubpath.slice(2)}'`),
      `${component.id} lacks a public Storybook import`,
    );
    assert.ok(
      stories.includes(`title: 'Components/${component.category}/${component.id}'`),
      `${component.id} lacks hierarchical Storybook navigation`,
    );
    assert.ok(
      stories.includes(`name: 'All Variations'`),
      `${component.id} lacks an All Variations story`,
    );
    assert.ok(
      stories.includes(`nativeComponent: '${component.slug}'`),
      `${component.id} lacks registry-linked Storybook metadata`,
    );
    assert.ok(
      fixtureSource.includes(`nativeComponent: '${component.slug}'`),
      `${component.id} lacks an All Variations fixture`,
    );
    assert.ok(
      playgroundSource.includes(`from '@tale-ui/react-native/${component.publicSubpath.slice(2)}'`),
      `${component.id} lacks a playground runtime import`,
    );
    const controls = storyControlMetadata[component.slug];
    assert.ok(controls, `${component.id} lacks a Storybook control contract`);
    assert.equal(controls.component, component.id);
    assert.equal(controls.category, component.category);
    assert.equal(controls.title, `Components/${component.category}/${component.id}`);
    assert.ok(
      controls.properties.length + controls.actions.length > 0,
      `${component.id} lacks property or action coverage`,
    );
    for (const property of controls.properties) {
      assert.ok(property.name, `${component.id} has an unnamed Storybook property`);
      assert.ok(property.description, `${component.id}.${property.name} lacks control guidance`);
      assert.ok(property.control, `${component.id}.${property.name} lacks a control type`);
    }
    for (const event of controls.actions) {
      assert.ok(event.name.startsWith('on'), `${component.id}.${event.name} is not an event prop`);
      assert.ok(event.description, `${component.id}.${event.name} lacks action guidance`);
    }
    const coveredProperties = new Set([
      ...controls.properties.map(({ name }) => name),
      ...controls.actions.map(({ name }) => name),
      ...Object.keys(controls.excludedProperties),
    ]);
    for (const property of controls.adapterProperties) {
      assert.ok(
        coveredProperties.has(property),
        `${component.id}.${property} lacks control coverage or an exclusion rationale`,
      );
    }
    for (const [property, rationale] of Object.entries(controls.excludedProperties)) {
      assert.ok(
        controls.adapterProperties.includes(property),
        `${component.id}.${property} excludes an unknown adapter property`,
      );
      assert.ok(rationale, `${component.id}.${property} lacks an exclusion rationale`);
    }
  }
  for (const forbidden of ['expo', 'react-dom', '@tale-ui/themes', 'storybook']) {
    assert.equal(manifest.dependencies?.[forbidden], undefined);
  }
  assert.equal(manifest.exports['./radio-field'], undefined);
  assert.equal(
    inventory.implementations.some(({ id }) => id === 'RadioField'),
    false,
  );
  assert.equal(stories.includes('@tale-ui/react-native/radio-field'), false);
  assert.equal(fixtureSource.includes('RadioField'), false);
  assert.equal(playgroundSource.includes('RadioField'), false);
  const radioField = registryById.get('RadioField');
  assert.equal(radioField.delivery, 'stable');
  assert.equal(radioField.strategy, 'native-alternative');
  console.log(
    `OK: ${stable.length} web-stable outcomes, ${registry.counts.completed} completed dispositions, and ${implemented.length} experimental implementations.`,
  );
};

if (mode === 'a11y') {
  checkAccessibility();
} else if (mode === 'performance') {
  await checkPerformance();
} else {
  checkCoverage();
  checkAccessibility();
  await checkPerformance();
}
