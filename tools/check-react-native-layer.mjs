#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const root = new URL('../', import.meta.url);
const mode = process.argv[2] ?? 'all';
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const registry = readJson('registry/platforms/react-native.json');
const storyControlMetadata = readJson('registry/platforms/react-native-story-controls.json');
const manifest = readJson('packages/react-native/package.json');
const storyDirectory = new URL('playground/react-native-storybook/src/', root);
const storySources = [];
const collectStories = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) {
      collectStories(target);
    } else if (entry.name.endsWith('.stories.tsx')) {
      storySources.push(readFileSync(target, 'utf8'));
    }
  }
};
collectStories(storyDirectory);
const stories = storySources.join('\n');
const implemented = registry.components.filter(
  ({ delivery, strategy }) => delivery === 'stable' && strategy === 'adapted',
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
  for (const component of implemented) {
    assert.ok(manifest.exports[`./${component.slug}`], `${component.id} lacks a public export`);
    assert.ok(
      stories.includes(`from '@tale-ui/react-native/${component.slug}'`),
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
  console.log(
    `OK: ${stable.length} stable outcomes and ${implemented.length} implemented exports/stories/control contracts.`,
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
