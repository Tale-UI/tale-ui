import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ArtifactRegistry } from './contracts/artifact.js';
import type { CapabilityManifest } from './contracts/capability.js';
import { TaleToolingError } from './contracts/errors.js';

const MODULE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const registryCache = new Map<string, ArtifactRegistry>();
const capabilityCache = new Map<string, CapabilityManifest>();

function resolveAssetsRoot(assetsRoot?: string) {
  if (assetsRoot) {
    return resolve(assetsRoot);
  }
  if (existsSync(join(MODULE_DIRECTORY, 'registry/artifacts.json'))) {
    return MODULE_DIRECTORY;
  }
  const workspaceRoot = resolve(MODULE_DIRECTORY, '../../..');
  if (existsSync(join(workspaceRoot, 'registry/artifacts.json'))) {
    return workspaceRoot;
  }
  throw new TaleToolingError(
    'TALE_CORRUPT_REGISTRY',
    'The installed Tale UI registry assets are unavailable.',
  );
}

function readRegistry<T>(assetsRoot: string, file: string): T {
  try {
    return JSON.parse(readFileSync(join(assetsRoot, 'registry', file), 'utf8')) as T;
  } catch (cause) {
    throw new TaleToolingError(
      'TALE_CORRUPT_REGISTRY',
      `The installed Tale UI ${file} asset is unreadable.`,
      { cause },
    );
  }
}

export function loadArtifactRegistry(options: { assetsRoot?: string } = {}) {
  const assetsRoot = resolveAssetsRoot(options.assetsRoot);
  let registry = registryCache.get(assetsRoot);
  if (!registry) {
    registry = readRegistry<ArtifactRegistry>(assetsRoot, 'artifacts.json');
    registryCache.set(assetsRoot, registry);
  }
  return registry;
}

export function loadCapabilityManifest(options: { assetsRoot?: string } = {}) {
  const assetsRoot = resolveAssetsRoot(options.assetsRoot);
  let manifest = capabilityCache.get(assetsRoot);
  if (!manifest) {
    manifest = readRegistry<CapabilityManifest>(assetsRoot, 'capabilities.json');
    capabilityCache.set(assetsRoot, manifest);
  }
  return manifest;
}
