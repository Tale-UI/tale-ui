#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const OUTPUT_ROOT = join(ROOT, 'registry/integrations');

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(value) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

const components = readJson('registry/components.json').components;
const variables = readJson('packages/tokens/figma/variables.json');
const allowlist = readJson('registry/integrations/figma-allowlist.json');
const sourceDigest = digest(
  `${canonical(components)}\0${variables.sourceDigest}\0${canonical(allowlist)}`,
);
const records = [
  {
    schemaVersion: '1.0.0',
    classification: 'public',
    registryId: 'tale:foundation:design-tokens',
    mappingKind: 'token',
    sourceDigest,
    publishable: true,
    publicData: {
      collectionId: variables.collections[0].id,
      collectionName: variables.collections[0].name,
      modes: variables.collections[0].modes,
      variableCount: variables.collections[0].variables.length,
      source: variables.source,
    },
  },
];
const codeConnect = [];
for (const component of components) {
  const registryId = `tale:component:${component.slug}`;
  const componentSource = component.import.startsWith('@tale-ui/charts/')
    ? `packages/charts/src/${component.slug}/index.ts`
    : `packages/react/src/${component.slug}/index.ts`;
  records.push({
    schemaVersion: '1.0.0',
    classification: 'public',
    registryId,
    mappingKind: 'component',
    sourceDigest,
    publishable: true,
    publicData: {
      name: component.name,
      importPath: component.import,
      lifecycle: component.status,
      owner: 'design-systems',
    },
  });
  const variantProps = component.props.filter(
    ({ allowedValues }) => Array.isArray(allowedValues) && allowedValues.length > 0,
  );
  for (const property of variantProps) {
    for (const value of property.allowedValues) {
      records.push({
        schemaVersion: '1.0.0',
        classification: 'public',
        registryId,
        mappingKind: 'variant',
        sourceDigest,
        publishable: true,
        publicData: {
          componentName: component.name,
          property: property.name,
          value,
          mappingId: `${registryId}:${property.name}:${value}`,
        },
      });
    }
  }
  codeConnect.push({
    registryId,
    componentName: component.name,
    package: component.import,
    source: componentSource,
    properties: Object.fromEntries(
      variantProps.map(({ name, allowedValues }) => [name, allowedValues]),
    ),
    ownership: {
      design: 'design-systems',
      code: component.import.startsWith('@tale-ui/charts/')
        ? 'data-visualization'
        : 'design-systems',
    },
  });
  records.push({
    schemaVersion: '1.0.0',
    classification: 'public',
    registryId,
    mappingKind: 'code-connection',
    sourceDigest,
    publishable: true,
    publicData: {
      componentName: component.name,
      package: component.import,
      source: componentSource,
    },
  });
}

const schema = readJson('schemas/figma-record.schema.json');
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
for (const record of records) {
  if (!validate(record)) {
    throw new Error(`Invalid Figma record: ${JSON.stringify(validate.errors)}`);
  }
}

const publicMappings = {
  schemaVersion: '1.0.0',
  sourceDigest,
  classification: 'public',
  records,
};
const codeConnectOutput = {
  schemaVersion: '1.0.0',
  sourceDigest,
  mappingKind: 'code-connect-equivalent',
  mappings: codeConnect,
};
const publicParity = {
  schemaVersion: '1.0.0',
  sourceDigest,
  generatedParity: {
    status: 'complete',
    tokenVariables: variables.collections[0].variables.length,
    components: components.length,
    variants: records.filter(({ mappingKind }) => mappingKind === 'variant').length,
    codeConnections: codeConnect.length,
  },
  liveParity: {
    status: allowlist.files.length === 0 ? 'unavailable' : 'pending-authenticated-run',
    reason:
      allowlist.files.length === 0
        ? 'No Figma file identifier is approved in the private allowlist.'
        : 'Live parity is generated only in the authenticated internal workflow.',
  },
  privacy: {
    classification: 'public',
    containsFileKeys: false,
    containsNodeIds: false,
    containsUrls: false,
    containsScreenshots: false,
    containsFreeText: false,
  },
};

for (const [name, value] of [
  ['figma-public.json', publicMappings],
  ['code-connect.json', codeConnectOutput],
  ['figma-parity-public.json', publicParity],
]) {
  const path = join(OUTPUT_ROOT, name);
  const rendered = canonical(value);
  if (CHECK) {
    if (readFileSync(path, 'utf8') !== rendered) {
      throw new Error(`${path} is stale; run pnpm figma:generate.`);
    }
  } else {
    writeFileSync(path, rendered);
  }
}

console.log(
  `${CHECK ? 'OK' : 'Generated'}: ${variables.collections[0].variables.length} variables, ${components.length} components, ${publicParity.generatedParity.variants} variants, live parity ${publicParity.liveParity.status}`,
);
