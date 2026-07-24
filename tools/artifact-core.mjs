import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
/* eslint-disable import/no-relative-packages -- This compatibility wrapper shares the package's pure search core. */
import {
  getArtifactFromRegistry,
  searchArtifactsInRegistry,
} from '../packages/tooling/src/core/artifacts.js';
/* eslint-enable import/no-relative-packages */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ARTIFACTS_PATH = join(ROOT, 'registry/artifacts.json');
let cachedArtifactRegistry;

export function loadArtifactRegistry() {
  cachedArtifactRegistry ??= JSON.parse(readFileSync(ARTIFACTS_PATH, 'utf8'));
  return cachedArtifactRegistry;
}

export function searchArtifacts(request = {}) {
  return searchArtifactsInRegistry(loadArtifactRegistry(), request);
}

export function getArtifact(idOrAlias, { kind } = {}) {
  return getArtifactFromRegistry(loadArtifactRegistry(), idOrAlias, { kind });
}
