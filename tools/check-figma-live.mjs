#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function collectDesignComponents(node, result = []) {
  if (node?.type === 'COMPONENT' || node?.type === 'COMPONENT_SET') {
    result.push({ nodeId: node.id, name: node.name, type: node.type });
  }
  for (const child of node?.children ?? []) {
    collectDesignComponents(child, result);
  }
  return result;
}

export function sanitizeFigmaObservation(observations, codeComponentNames) {
  const normalizedCodeNames = new Set(
    codeComponentNames.map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')),
  );
  const designComponents = observations.flatMap(({ alias, fileKey, payload }) =>
    collectDesignComponents(payload.document).map((component) => ({
      ...component,
      alias,
      fileKey,
    })),
  );
  const normalizedDesignNames = new Set(
    designComponents.map(({ name }) => name.toLowerCase().replace(/[^a-z0-9]/g, '')),
  );
  return {
    internal: {
      schemaVersion: '1.0.0',
      classification: 'internal',
      files: observations.map(({ alias, fileKey }) => ({ alias, fileKey })),
      components: designComponents,
    },
    public: {
      schemaVersion: '1.0.0',
      classification: 'public',
      filesObserved: observations.length,
      designComponents: designComponents.length,
      codeComponents: codeComponentNames.length,
      mismatchCategories: {
        designWithoutCodeName: [...normalizedDesignNames].filter(
          (name) => !normalizedCodeNames.has(name),
        ).length,
        codeWithoutDesignName: [...normalizedCodeNames].filter(
          (name) => !normalizedDesignNames.has(name),
        ).length,
      },
      containsProtectedReferences: false,
    },
  };
}

async function main() {
  const allowlist = JSON.parse(
    readFileSync(join(ROOT, 'registry/integrations/figma-allowlist.json'), 'utf8'),
  );
  if (allowlist.files.length === 0) {
    console.log('UNAVAILABLE: no approved Figma file binding; no remote request made');
    return;
  }
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new Error('FIGMA_ACCESS_TOKEN is required for an allowlisted live parity run.');
  }
  const observations = [];
  for (const file of allowlist.files) {
    const fileKey = process.env[file.secretBinding];
    if (!fileKey) {
      throw new Error(`Missing private Figma file binding ${file.secretBinding}.`);
    }
    const response = await fetch(
      `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}?depth=4`,
      { headers: { 'x-figma-token': token } },
    );
    if (!response.ok) {
      throw new Error(`Figma read failed with status ${response.status}.`);
    }
    observations.push({ alias: file.alias, fileKey, payload: await response.json() });
  }
  const components = JSON.parse(
    readFileSync(join(ROOT, 'registry/components.json'), 'utf8'),
  ).components;
  const reports = sanitizeFigmaObservation(
    observations,
    components.map(({ name }) => name),
  );
  mkdirSync(join(ROOT, '.artifacts'), { recursive: true });
  writeFileSync(
    join(ROOT, '.artifacts/figma-internal.json'),
    `${JSON.stringify(reports.internal, null, 2)}\n`,
  );
  writeFileSync(
    join(ROOT, '.artifacts/figma-public.json'),
    `${JSON.stringify(reports.public, null, 2)}\n`,
  );
  console.log(`Observed ${reports.public.designComponents} Figma components read-only.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
