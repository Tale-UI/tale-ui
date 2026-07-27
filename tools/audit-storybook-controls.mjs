#!/usr/bin/env node

/**
 * Storybook property-control audit.
 *
 * The existing coverage audit proves that a component is imported by a story.
 * This audit additionally requires every suitable, Tale-owned scalar property
 * to be represented by a Storybook control/arg in that component's canonical
 * story file. Non-serializable callbacks, render functions, collection data,
 * styling escape hatches, and mutually exclusive state alternatives are
 * intentionally excluded.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STORIES_DIR = path.join(ROOT, 'playground/storybook/src/stories');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');

const VISUAL_EXCLUDED = new Set(['CSPProvider', 'I18nProvider', 'mergeProps', 'Virtualizer']);

const STORY_FILE_ALIASES = new Map([
  ['ColorArea', 'ColorComponents.stories.tsx'],
  ['ColorField', 'ColorComponents.stories.tsx'],
  ['ColorSlider', 'ColorComponents.stories.tsx'],
  ['ColorSwatch', 'ColorComponents.stories.tsx'],
  ['ColorSwatchPicker', 'ColorComponents.stories.tsx'],
  ['ColorWheel', 'ColorComponents.stories.tsx'],
  ['DropZone', 'FileComponents.stories.tsx'],
  ['FileTrigger', 'FileComponents.stories.tsx'],
  ['IphoneMockup', 'IPhoneMockup.stories.tsx'],
  ['RatingBadge', 'RatingStars.stories.tsx'],
  ['SocialButtonGroup', 'SocialButton.stories.tsx'],
  ['Toast', 'Toast.stories.tsx'],
  ['ToggleButtonGroup', 'ToggleButton.stories.tsx'],
]);

/**
 * Registry generation supplements source props from docs for inherited APIs.
 * These entries are either example-local identifiers or mutually exclusive
 * controlled-state alternatives to the uncontrolled property already covered.
 */
const COMPONENT_PROP_EXCLUSIONS = new Map([
  ['Autocomplete', new Set(['filter', 'inputValue'])],
  ['CommandPalette', new Set(['isDismissable', 'isOpen'])],
  ['Drawer', new Set(['open'])],
  ['Illustration', new Set(['svgClassName', 'childrenClassName'])],
  ['Lightbox', new Set(['alt', 'isOpen', 'selectedKey'])],
  [
    'MultiSelect',
    new Set([
      'selectedCountFormatter',
      'skill',
      'count',
      's',
      'chosen',
      'selected',
      'Select',
      'frameworks',
    ]),
  ],
  ['Resizable', new Set(['sizes'])],
  ['Tabs', new Set(['selectedKey'])],
  ['TagSelect', new Set(['u', 'lastName'])],
]);

const NON_CONTROL_PROP_NAMES = new Set([
  'artifactPanel',
  'children',
  'className',
  'crop',
  'dangerouslySetInnerHTML',
  'defaultExpandedKeys',
  'defaultSelectedKeys',
  'formatOptions',
  'icon',
  'items',
  'options',
  'selectedKeys',
  'sources',
  'style',
]);

const CHART_REQUIREMENTS = new Map([
  [
    'AreaChart.stories.tsx',
    ['data', 'width', 'height', 'palette', 'dataKey', 'fillOpacity', 'strokeWidth'],
  ],
  ['BarChart.stories.tsx', ['data', 'width', 'height', 'palette', 'dataKey', 'maxBarSize']],
  [
    'LineChart.stories.tsx',
    ['data', 'width', 'height', 'palette', 'dataKey', 'type', 'strokeWidth'],
  ],
  [
    'PieChart.stories.tsx',
    [
      'data',
      'width',
      'height',
      'palette',
      'dataKey',
      'nameKey',
      'innerRadius',
      'outerRadius',
      'paddingAngle',
    ],
  ],
  [
    'RadarChart.stories.tsx',
    ['data', 'width', 'height', 'palette', 'dataKey', 'angleKey', 'fillOpacity', 'strokeWidth'],
  ],
  [
    'RadialBarChart.stories.tsx',
    ['data', 'width', 'height', 'palette', 'innerRadius', 'outerRadius', 'dataKey', 'cornerRadius'],
  ],
]);

function propertyName(node) {
  if (
    node &&
    (ts.isIdentifier(node) ||
      ts.isStringLiteral(node) ||
      ts.isNumericLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node))
  ) {
    return node.text;
  }
  return null;
}

function hasDisabledControl(node) {
  if (!ts.isObjectLiteralExpression(node)) {
    return false;
  }

  return node.properties.some((property) => {
    if (!ts.isPropertyAssignment(property) || propertyName(property.name) !== 'control') {
      return false;
    }
    return property.initializer.kind === ts.SyntaxKind.FalseKeyword;
  });
}

function inspectStoryFile(fileName) {
  const absolutePath = path.join(STORIES_DIR, fileName);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    absolutePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const controls = new Set();
  const args = new Set();
  const boundArgs = new Set();
  let spreadsArgs = false;
  let hasComponentMeta = false;

  function visit(node) {
    if (ts.isPropertyAssignment(node)) {
      const name = propertyName(node.name);
      if (name === 'component') {
        hasComponentMeta = true;
      }
      if (
        (name === 'argTypes' || name === 'args') &&
        ts.isObjectLiteralExpression(node.initializer)
      ) {
        for (const property of node.initializer.properties) {
          const propName = propertyName(property.name);
          if (!propName) {
            continue;
          }
          if (name === 'args') {
            args.add(propName);
          } else if (
            !ts.isPropertyAssignment(property) ||
            !hasDisabledControl(property.initializer)
          ) {
            controls.add(propName);
          }
        }
      }
    }

    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'args'
    ) {
      boundArgs.add(node.name.text);
    }

    if (
      ts.isElementAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'args' &&
      node.argumentExpression &&
      ts.isStringLiteral(node.argumentExpression)
    ) {
      boundArgs.add(node.argumentExpression.text);
    }

    if (
      ts.isJsxSpreadAttribute(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'args'
    ) {
      spreadsArgs = true;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { args, boundArgs, controls, hasComponentMeta, source, spreadsArgs };
}

function isSuitableProp(componentName, prop) {
  if (COMPONENT_PROP_EXCLUSIONS.get(componentName)?.has(prop.name)) {
    return false;
  }
  if (
    NON_CONTROL_PROP_NAMES.has(prop.name) ||
    prop.name.startsWith('on') ||
    prop.name.startsWith('get') ||
    prop.name.startsWith('render') ||
    prop.name === 'filter' ||
    prop.name === 'validate'
  ) {
    return false;
  }

  const type = prop.type ?? '';
  if (
    type.includes('=>') ||
    type.includes('function') ||
    type.includes('ReactNode') ||
    type.includes('CSSProperties') ||
    type.includes('IconComponent') ||
    type === 'unknown' ||
    type.startsWith('Iterable<') ||
    type.startsWith('readonly ')
  ) {
    return false;
  }

  return Boolean(
    prop.allowedValues?.length ||
    type === 'boolean' ||
    type === 'string' ||
    type === 'number' ||
    type.includes('number') ||
    type.startsWith("'") ||
    /^[A-Z][A-Za-z]+$/u.test(type),
  );
}

function kebabToPascal(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function findStoryFile(component) {
  const alias = STORY_FILE_ALIASES.get(component.name);
  if (alias) {
    return alias;
  }

  const direct = `${component.name}.stories.tsx`;
  if (fs.existsSync(path.join(STORIES_DIR, direct))) {
    return direct;
  }

  const bySlug = `${kebabToPascal(component.slug)}.stories.tsx`;
  return fs.existsSync(path.join(STORIES_DIR, bySlug)) ? bySlug : null;
}

function missingRequirements(requirements, inspection) {
  return requirements.filter((prop) => {
    const isDisplayed = inspection.controls.has(prop) || inspection.args.has(prop);
    if (!isDisplayed) {
      return true;
    }

    return !(
      inspection.spreadsArgs ||
      inspection.boundArgs.has(prop) ||
      (inspection.hasComponentMeta && inspection.args.has(prop))
    );
  });
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const components = registry.components.filter((component) => !VISUAL_EXCLUDED.has(component.name));
const inspections = new Map();
const failures = [];
let controlledComponents = 0;
let noSuitableControls = 0;
let eligibleProperties = 0;

for (const component of components) {
  const fileName = findStoryFile(component);
  if (!fileName) {
    failures.push({ component: component.name, file: 'missing', props: ['story file'] });
    continue;
  }

  const suitableProps = component.props
    .filter((prop) => isSuitableProp(component.name, prop))
    .map((prop) => prop.name);
  if (suitableProps.length === 0) {
    noSuitableControls += 1;
    continue;
  }

  eligibleProperties += suitableProps.length;
  controlledComponents += 1;
  const inspection = inspections.get(fileName) ?? inspectStoryFile(fileName);
  inspections.set(fileName, inspection);
  const missing = missingRequirements(suitableProps, inspection);
  if (missing.length > 0) {
    failures.push({ component: component.name, file: fileName, props: missing });
  }
}

let chartProperties = 0;
for (const [fileName, requirements] of CHART_REQUIREMENTS) {
  chartProperties += requirements.length;
  const inspection = inspections.get(fileName) ?? inspectStoryFile(fileName);
  inspections.set(fileName, inspection);
  const missing = missingRequirements(requirements, inspection);
  if (missing.length > 0) {
    failures.push({
      component: fileName.replace('.stories.tsx', ''),
      file: fileName,
      props: missing,
    });
  }
}

if (failures.length > 0) {
  console.error('❌ Storybook property-control coverage gaps:\n');
  for (const failure of failures) {
    console.error(`  ${failure.component} (${failure.file}): ${failure.props.join(', ')}`);
  }
  process.exit(1);
}

console.log('✅ Storybook property controls cover every suitable maintained UI property.');
console.log(
  `   React: ${components.length}/${components.length} components assessed ` +
    `(${controlledComponents} with controls, ${noSuitableControls} with no suitable scalar controls; ` +
    `${eligibleProperties} controlled properties).`,
);
console.log(
  `   Charts: ${CHART_REQUIREMENTS.size}/${CHART_REQUIREMENTS.size} components; ` +
    `${chartProperties} controlled properties.`,
);
