#!/usr/bin/env node

import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { inspect } from 'node:util';
import { format } from 'prettier';

const packageRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(packageRoot, '../..');
const sourcePath = path.join(packageRoot, 'tokens.json');
const cssTokenDir = path.join(repoRoot, 'packages/css/src/tokens');
const generatedPath = path.join(packageRoot, 'src/generated.ts');
const figmaModulePath = path.join(packageRoot, 'src/figma.ts');
const nativeJsonPath = path.join(packageRoot, 'native.json');
const figmaVariablesPath = path.join(packageRoot, 'figma/variables.json');
const checkOnly = process.argv.includes('--check');

const sourceText = (await fs.readFile(sourcePath, 'utf8')).replaceAll('\r\n', '\n');
const source = JSON.parse(sourceText);
const sourceDigest = `sha256:${createHash('sha256').update(sourceText).digest('hex')}`;

if (source.formatVersion !== 1) {
  throw new Error(`Unsupported token source format: ${source.formatVersion}`);
}

const renderRule = ({ selector, declarations, media }) => {
  const body = Object.entries(declarations)
    .map(([property, value]) => `    ${property}: ${value};`)
    .join('\n');
  const rule = `${selector} {\n${body}\n}`;

  if (!media) {
    return rule;
  }

  return `@media ${media} {\n${rule
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')}\n}`;
};

const renderCss = (filename, rules) => {
  const renderedRules = rules.map(renderRule).join('\n\n');

  return `/* This file is generated from @tale-ui/tokens/tokens.json. Do not edit directly. */\n${renderedRules}\n`;
};

const cssNameToProperty = (name) =>
  name.replace(/^--/, '').replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());

const rootTokens = {};
for (const rules of Object.values(source.files)) {
  for (const { selector, declarations } of rules) {
    if (selector !== ':root') {
      continue;
    }
    for (const [property, value] of Object.entries(declarations)) {
      if (property.startsWith('--')) {
        rootTokens[property] = value;
      }
    }
  }
}

const namedShades = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const neutralShades = [
  5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96,
  98, 100,
];

const lightModeAliases = Object.fromEntries([
  ...neutralShades.map((shade) => [`--neutral-${shade}`, `var(--neutral-default-${shade})`]),
]);

const darkModeAliases = Object.fromEntries([
  ...neutralShades.map((shade, index) => [
    `--neutral-${shade}`,
    `var(--neutral-default-${neutralShades.at(-(index + 1))})`,
  ]),
  ...namedShades.map((shade, index) => [
    `--color-${shade}`,
    `var(--brand-${namedShades.at(-(index + 1))})`,
  ]),
]);

const roundNativeNumber = (value) => Math.round(value * 100) / 100;

const resolveNativeValue = (name, tokens, resolving = new Set()) => {
  if (resolving.has(name)) {
    return undefined;
  }
  const raw = tokens[name];
  if (typeof raw !== 'string') {
    return undefined;
  }

  const nextResolving = new Set(resolving).add(name);
  const alias = raw.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (alias) {
    return resolveNativeValue(alias[1], tokens, nextResolving);
  }

  const aliasTimesNumber = raw.match(/^calc\(var\((--[a-z0-9-]+)\) \* ([0-9.]+)\)$/i);
  const numberTimesAlias = raw.match(/^calc\(([0-9.]+) \* var\((--[a-z0-9-]+)\)\)$/i);
  let multipliedAlias;
  if (aliasTimesNumber) {
    multipliedAlias = { name: aliasTimesNumber[1], multiplier: aliasTimesNumber[2] };
  } else if (numberTimesAlias) {
    multipliedAlias = { name: numberTimesAlias[2], multiplier: numberTimesAlias[1] };
  }
  if (multipliedAlias) {
    const base = resolveNativeValue(multipliedAlias.name, tokens, nextResolving);
    return typeof base === 'number'
      ? roundNativeNumber(base * Number(multipliedAlias.multiplier))
      : undefined;
  }

  const rem = raw.match(/^(-?[0-9.]+)rem$/);
  if (rem) {
    return roundNativeNumber(Number(rem[1]) * source.baseFontSize);
  }

  const pixels = raw.match(/^(-?[0-9.]+)px$/);
  if (pixels) {
    return Number(pixels[1]);
  }

  const milliseconds = raw.match(/^(-?[0-9.]+)ms$/);
  if (milliseconds) {
    return Number(milliseconds[1]);
  }

  if (/^-?[0-9.]+$/.test(raw)) {
    return Number(raw);
  }
  if (/^#[0-9a-f]{3,8}$/i.test(raw) || /^(?:rgb|rgba)\(/i.test(raw)) {
    return raw;
  }

  const firstFont = raw.match(/^"([^"]+)"(?:,\s*.+)?$/);
  if (firstFont) {
    return firstFont[1];
  }

  return undefined;
};

const createNativeMode = (overrides = {}) => {
  const modeTokens = { ...rootTokens, ...overrides };
  const byCssName = {};

  for (const name of Object.keys(modeTokens).sort()) {
    const resolved = resolveNativeValue(name, modeTokens);
    if (resolved !== undefined) {
      byCssName[name] = resolved;
    }
  }

  return {
    byCssName,
    properties: Object.fromEntries(
      Object.entries(byCssName).map(([name, value]) => [cssNameToProperty(name), value]),
    ),
  };
};

const light = createNativeMode(lightModeAliases);
const dark = createNativeMode(darkModeAliases);
const portableNames = Object.keys(light.byCssName).filter((name) =>
  Object.hasOwn(dark.byCssName, name),
);
const unsupported = Object.keys(rootTokens).filter((name) => !portableNames.includes(name));

const formatObject = (value) =>
  inspect(value, {
    breakLength: 100,
    compact: false,
    depth: null,
    maxArrayLength: null,
    sorted: true,
  });

const generatedTs = await format(
  `/* This file is generated from ../tokens.json. Do not edit directly. */

export type NativeTokenValue = number | string;

export const cssTokens = ${formatObject(rootTokens)} as const;

export const nativeTokenModes = {
  light: ${formatObject(light.properties)},
  dark: ${formatObject(dark.properties)},
} as const;

export const nativeTokensByCssName = {
  light: ${formatObject(light.byCssName)},
  dark: ${formatObject(dark.byCssName)},
} as const;

/** The default light-mode native token object. */
export const nativeTokens = nativeTokenModes.light;

export type CssTokenName = keyof typeof cssTokens;
export type NativeTokenName = keyof typeof nativeTokens;
export type NativeColorMode = keyof typeof nativeTokenModes;
`,
  { parser: 'typescript', printWidth: 100, singleQuote: true, trailingComma: 'all' },
);

const nativeJson = `${JSON.stringify(
  {
    schemaVersion: '1.0.0',
    source: 'tokens.json',
    sourceDigest,
    baseFontSize: source.baseFontSize,
    modes: {
      light: light.byCssName,
      dark: dark.byCssName,
    },
    portableTokenNames: portableNames,
    unsupportedTokenNames: unsupported,
  },
  null,
  2,
)}\n`;

const figmaVariableType = (value) => {
  if (typeof value === 'number') {
    return 'FLOAT';
  }
  if (/^#|^rgba?\(/i.test(value)) {
    return 'COLOR';
  }
  return 'STRING';
};

const figmaPayload = {
  schemaVersion: '1.0.0',
  source: 'packages/tokens/tokens.json',
  sourceDigest,
  owner: 'design-systems',
  collections: [
    {
      id: 'tale-ui-foundations',
      name: 'Tale UI foundations',
      registryId: 'tale:foundation:design-tokens',
      modes: ['light', 'dark'],
      variables: portableNames.map((name) => {
        const lightValue = light.byCssName[name];
        const darkValue = dark.byCssName[name];
        return {
          id: `tale/token/${name.slice(2)}`,
          name: name.slice(2).replaceAll('-', '/'),
          codeName: name,
          resolvedType: figmaVariableType(lightValue),
          valuesByMode: { light: lightValue, dark: darkValue },
        };
      }),
    },
  ],
};
const figmaVariables = `${JSON.stringify(figmaPayload, null, 2)}\n`;
const figmaModule = await format(
  `/* This file is generated from ../tokens.json. Do not edit directly. */
export const figmaVariables = ${formatObject(figmaPayload)} as const;
export default figmaVariables;
`,
  { parser: 'typescript', printWidth: 100, singleQuote: true, trailingComma: 'all' },
);

const outputs = [
  ...Object.entries(source.files).map(([filename, rules]) => ({
    path: path.join(cssTokenDir, filename),
    content: renderCss(filename, rules),
  })),
  { path: generatedPath, content: generatedTs },
  { path: figmaModulePath, content: figmaModule },
  { path: nativeJsonPath, content: nativeJson },
  { path: figmaVariablesPath, content: figmaVariables },
];

const outputResults = await Promise.all(
  outputs.map(async (output) => {
    const current = await fs.readFile(output.path, 'utf8').catch(() => '');
    if (current === output.content) {
      return true;
    }

    if (checkOnly) {
      console.error(`Stale generated file: ${path.relative(repoRoot, output.path)}`);
      return false;
    }

    await fs.mkdir(path.dirname(output.path), { recursive: true });
    await fs.writeFile(output.path, output.content, 'utf8');
    process.stdout.write(`Generated ${path.relative(repoRoot, output.path)}.\n`);
    return true;
  }),
);

if (outputResults.includes(false)) {
  process.exitCode = 1;
}
