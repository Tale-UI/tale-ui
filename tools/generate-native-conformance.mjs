#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { loadAndValidateNativeInventory } from './lib/react-native-implementation-inventory.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const inventory = loadAndValidateNativeInventory({ root: ROOT });
const now = new Date();
const TODAY = now.toISOString().slice(0, 10);
const MAX_EXPIRY = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const native = readJson('packages/tokens/native.json');
const exceptionSource = readJson('registry/conformance/exceptions.json');
const schema = readJson('schemas/conformance.schema.json');
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const matchedExceptions = new Map(
  exceptionSource.exceptions.map((exception) => [exception.tokenPattern, []]),
);
for (const token of native.unsupportedTokenNames) {
  const matching = exceptionSource.exceptions.filter((exception) =>
    new RegExp(exception.tokenPattern).test(token),
  );
  if (matching.length !== 1) {
    throw new Error(`${token} must match exactly one native platform exception.`);
  }
  matchedExceptions.get(matching[0].tokenPattern).push(token);
}
for (const exception of exceptionSource.exceptions) {
  if (matchedExceptions.get(exception.tokenPattern).length === 0) {
    throw new Error(`Unused native exception ${exception.tokenPattern}.`);
  }
  if (exception.expiresOn < TODAY || exception.expiresOn > MAX_EXPIRY) {
    throw new Error(`Native exception ${exception.tokenPattern} is expired or exceeds 180 days.`);
  }
}

const reports = {};
for (const appearance of ['light', 'dark']) {
  const report = {
    schemaVersion: '1.0.0',
    sourceDigest: native.sourceDigest,
    platform: 'react-native',
    appearance,
    highContrast: 'guided',
    matched: native.portableTokenNames,
    unmatched: native.unsupportedTokenNames,
    exceptions: exceptionSource.exceptions,
  };
  if (!validate(report)) {
    throw new Error(ajv.errorsText(validate.errors, { separator: '\n' }));
  }
  reports[appearance] = report;
}

const workspacePackages = [
  ...readdirSync(join(ROOT, 'packages')).map((name) => join(ROOT, 'packages', name)),
  ...readdirSync(join(ROOT, 'apps')).map((name) => join(ROOT, 'apps', name)),
]
  .filter((directory) => existsSync(join(directory, 'package.json')))
  .map((directory) => readJson(`${directory.slice(ROOT.length + 1)}/package.json`));
const nativePackage = workspacePackages.find(({ name }) => name === '@tale-ui/react-native');
if (!nativePackage) {
  throw new Error('Tale UI native conformance requires @tale-ui/react-native.');
}
for (const requiredExport of [
  './provider',
  ...inventory.implementations.map(({ publicSubpath }) => publicSubpath),
]) {
  if (!nativePackage.exports?.[requiredExport]) {
    throw new Error(`@tale-ui/react-native is missing ${requiredExport}.`);
  }
}
for (const requiredPath of [
  'registry/platforms/react-native.json',
  'registry/platforms/react-native-recipe-candidates.json',
  'playground/react-native-storybook/src/Foundation.stories.tsx',
  'analysis/react-native-layer/React Native Compatibility Matrix.md',
]) {
  if (!existsSync(join(ROOT, requiredPath))) {
    throw new Error(`Native conformance requires ${requiredPath}.`);
  }
}

const example = readFileSync(join(ROOT, 'examples/react-native/TokenCard.tsx'), 'utf8');
if (!example.includes("from '@tale-ui/tokens/native'") || !example.includes('react-native')) {
  throw new Error('React Native example must consume @tale-ui/tokens/native.');
}
const nativeProperties = new Set(
  native.portableTokenNames.map((name) =>
    name.replace(/^--/, '').replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase()),
  ),
);
for (const token of [
  'neutral10',
  'neutral30',
  'radiusM',
  'spaceXs',
  'spaceS',
  'textColor',
  'titleMFontSize',
  'neutral80',
  'textSFontSize',
]) {
  if (!nativeProperties.has(token)) {
    throw new Error(`React Native example references missing token ${token}.`);
  }
}

const summary = {
  schemaVersion: '1.0.0',
  sourceDigest: native.sourceDigest,
  platforms: ['web', 'react-native'],
  appearances: ['light', 'dark'],
  portableTokens: native.portableTokenNames.length,
  platformExceptions: exceptionSource.exceptions.length,
  unsupportedTokens: native.unsupportedTokenNames.length,
  highContrastGuidance: 'docs/native-token-conformance.md',
  reactNativeExample: 'examples/react-native/TokenCard.tsx',
  nativeComponentLibrary: true,
  nativeRegistry: 'registry/platforms/react-native.json',
  storybook: 'playground/react-native-storybook',
};
for (const [path, value] of [
  ['registry/conformance/react-native-light.json', reports.light],
  ['registry/conformance/react-native-dark.json', reports.dark],
  ['registry/conformance/report.json', summary],
]) {
  const absolute = join(ROOT, path);
  const rendered = canonical(value);
  if (CHECK) {
    if (readFileSync(absolute, 'utf8') !== rendered) {
      throw new Error(`${path} is stale; run pnpm native:conformance:generate.`);
    }
  } else {
    writeFileSync(absolute, rendered);
  }
}
console.log(
  `${CHECK ? 'OK' : 'Generated'}: ${summary.portableTokens} portable tokens, ${summary.unsupportedTokens} matched exceptions, native component library verified`,
);
