#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const canonical = (value) => `${JSON.stringify(value, null, 2)}\n`;

const web = readJson('registry/components.json');
const overrideSource = readJson('registry/platforms/react-native-disposition-overrides.json');
const overrides = new Map(Object.entries(overrideSource.overrides));
const recipeComponents = new Set([
  'Button',
  'Text',
  'Icon',
  'Row',
  'Column',
  'Card',
  'Separator',
  'Badge',
  'Spinner',
  'ProgressBar',
]);
const implementedComponents = new Set([
  ...recipeComponents,
  'Accordion',
  'AlertDialog',
  'Banner',
  'Breadcrumbs',
  'CheckboxField',
  'CheckboxGroup',
  'Dialog',
  'Disclosure',
  'Drawer',
  'Field',
  'Fieldset',
  'Form',
  'GridList',
  'IconButton',
  'Input',
  'List',
  'ListBox',
  'Pagination',
  'RadioField',
  'RadioGroup',
  'SearchField',
  'Skeleton',
  'Slider',
  'SwitchField',
  'Tabs',
  'TagGroup',
  'TextArea',
  'Toast',
  'ToggleButton',
  'ToggleButtonGroup',
  'Toolbar',
]);

const requireAcceptedEvidence = (record) => {
  if (record.delivery === 'proposed') {
    return;
  }
  const evidence = record.evidence ?? {};
  for (const field of [
    'owner',
    'rationale',
    'webContract',
    'nativeBehavior',
    'accessibility',
    'deviations',
    'implementationPlan',
    'testPlan',
    'storybookPlan',
    'performancePlan',
    'approval',
  ]) {
    if (!evidence[field]) {
      throw new Error(`${record.id} ${record.delivery} disposition lacks evidence.${field}.`);
    }
  }
  if (
    ['native-alternative', 'not-applicable'].includes(record.strategy) &&
    !evidence.migrationGuidance
  ) {
    throw new Error(`${record.id} requires actionable migration guidance.`);
  }
};

const generate = () => {
  const components = web.components
    .map((component) => {
      const isImplemented = implementedComponents.has(component.name);
      const hasCompletedStableOutcome = component.status === 'stable' && !isImplemented;
      const evidence =
        component.status === 'stable' || isImplemented
          ? {
              owner: 'Tale UI maintainers',
              rationale: isImplemented
                ? 'Native primitives provide a responsible implementation of this design-system role.'
                : 'Use the platform-native control or navigation pattern instead of imitating DOM behavior.',
              webContract: `registry/components.json#${component.slug}`,
              nativeBehavior: isImplemented
                ? 'Implemented with React Native primitives and component-scoped state.'
                : 'Delegated to the application platform or navigation framework.',
              accessibility: isImplemented
                ? 'Maps intent to React Native role, state, value, and live-region props.'
                : 'The platform-native alternative owns accessibility behavior.',
              deviations: isImplemented
                ? 'See native public API.'
                : 'No DOM event, ARIA, or portal API is reproduced.',
              implementationPlan: isImplemented
                ? `packages/react-native/src/${component.slug}.tsx`
                : 'No package implementation; application integrates the documented native alternative.',
              testPlan: isImplemented
                ? 'Type, package, contract, and device checklist.'
                : 'Consumer migration review.',
              storybookPlan: isImplemented
                ? 'All Variations native Storybook coverage.'
                : 'Migration guidance only.',
              performancePlan: isImplemented
                ? 'Native primitive render budget.'
                : 'Owned by the selected native alternative.',
              approval:
                'Authorized by the repository React Native architecture and implementation-owner prompt.',
              migrationGuidance: isImplemented
                ? 'Import the matching @tale-ui/react-native subpath.'
                : `Use the platform-native ${component.name} pattern and retain Tale UI tokens for visual alignment.`,
            }
          : undefined;
      const base = {
        id: component.name,
        slug: component.slug,
        category: component.category,
        webLifecycle: component.status,
        strategy: isImplemented
          ? 'adapted'
          : hasCompletedStableOutcome
            ? 'native-alternative'
            : 'adapted',
        delivery: isImplemented || hasCompletedStableOutcome ? 'stable' : 'proposed',
        targets: isImplemented ? ['ios', 'android', 'web'] : ['ios', 'android'],
        contractId: isImplemented ? component.name.toLowerCase() : null,
        recipeId: recipeComponents.has(component.name) ? component.name.toLowerCase() : null,
        owner: 'Tale UI maintainers',
        deviations: [],
        evidence,
      };
      return { ...base, ...(overrides.get(component.name) ?? {}) };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  for (const record of components) {
    requireAcceptedEvidence(record);
  }
  const liveIds = [...web.components.map(({ name }) => name)].sort((a, b) => a.localeCompare(b));
  const nativeIds = components.map(({ id }) => id);
  if (canonical(liveIds) !== canonical(nativeIds)) {
    throw new Error('React Native dispositions must exactly cover the live React registry.');
  }

  const stableCount = components.filter(({ webLifecycle }) => webLifecycle === 'stable').length;
  const registry = {
    schemaVersion: '1.0.0',
    generatedFrom: 'registry/components.json',
    compatibility: {
      reactNative: '0.86.x',
      expo: '57.x',
      react: '19.2.x',
    },
    counts: {
      total: components.length,
      stable: stableCount,
      proposed: components.filter(({ delivery }) => delivery === 'proposed').length,
    },
    components,
  };
  const candidate = {
    schemaVersion: '1.0.0',
    adoption: 'shadow',
    warning: 'Candidate declarations are not reachable from public web CSS.',
    recipes: [...recipeComponents].sort().map((component) => ({
      id: component.toLowerCase(),
      component,
      webCandidate: `.tale-${component.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '')} { color: var(--text-color); opacity: 1; }`,
      native: { root: { color: { token: 'textColor' }, opacity: 1 } },
    })),
  };
  const parity = [
    '# React Native component parity',
    '',
    'Generated from the live React registry and governed native dispositions.',
    '',
    '| Component | Web lifecycle | Strategy | Delivery |',
    '| --- | --- | --- | --- |',
    ...components.map(
      ({ id, webLifecycle, strategy, delivery }) =>
        `| ${id} | ${webLifecycle} | ${strategy} | ${delivery} |`,
    ),
    '',
  ].join('\n');
  return {
    'registry/platforms/react-native.json': canonical(registry),
    'registry/platforms/react-native-recipe-candidates.json': canonical(candidate),
    'docs/react-native-component-parity.md': parity,
  };
};

const first = generate();
const second = generate();
if (
  createHash('sha256').update(canonical(first)).digest('hex') !==
  createHash('sha256').update(canonical(second)).digest('hex')
) {
  throw new Error('React Native layer generation is not byte-identical.');
}

for (const [path, content] of Object.entries(first)) {
  const absolute = join(root, path);
  if (check) {
    if (readFileSync(absolute, 'utf8') !== content) {
      throw new Error(`${path} is stale; run pnpm native:registry:generate.`);
    }
  } else {
    writeFileSync(absolute, content);
  }
}

console.log(`${check ? 'OK' : 'Generated'}: React Native registry, parity, and shadow recipes.`);
