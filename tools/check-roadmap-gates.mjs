#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADR_PATH = 'docs/architecture/adr-001-tooling-package.md';
const adr = readFileSync(join(ROOT, ADR_PATH), 'utf8');
const accepted = /^- Status: Accepted$/m.test(adr);

const packageManifest = join(ROOT, 'packages/tooling/package.json');
const rootManifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const reactManifest = JSON.parse(readFileSync(join(ROOT, 'packages/react/package.json'), 'utf8'));
const publishWorkflow = readFileSync(join(ROOT, '.github/workflows/publish.yml'), 'utf8');

const prematureIntegrations = [
  existsSync(packageManifest) && 'packages/tooling/package.json',
  rootManifest.bin?.tale && 'root tale binary',
  reactManifest.bin?.tale && '@tale-ui/react tale binary',
  publishWorkflow.includes('@tale-ui/tooling') && 'tooling publish integration',
].filter(Boolean);

if (!accepted && prematureIntegrations.length > 0) {
  throw new Error(
    `${ADR_PATH} is not Accepted; remove premature integration: ${prematureIntegrations.join(
      ', ',
    )}`,
  );
}

console.log(
  accepted
    ? `OK: ${ADR_PATH} is Accepted`
    : `OK: P-01 is enforced; ${ADR_PATH} remains Proposed and no public tooling integration exists`,
);
