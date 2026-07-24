import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ArtifactRegistry } from './contracts/artifact.js';
import type { CapabilityManifest } from './contracts/capability.js';
import { TaleToolingError } from './contracts/errors.js';

const MODULE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const registryCache = new Map<string, ArtifactRegistry>();
const capabilityCache = new Map<string, CapabilityManifest>();
const reactExportCache = new Map<string, ReadonlySet<string>>();

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

export function loadReactExportPaths(options: { assetsRoot?: string } = {}) {
  const assetsRoot = resolveAssetsRoot(options.assetsRoot);
  let exports = reactExportCache.get(assetsRoot);
  if (!exports) {
    const installedPath = join(assetsRoot, 'registry/react-exports.json');
    const sourcePath = join(assetsRoot, 'packages/react/package.json');
    try {
      const manifest = JSON.parse(
        readFileSync(existsSync(installedPath) ? installedPath : sourcePath, 'utf8'),
      ) as { name: string; exports: Record<string, unknown> | string[] };
      const entries = Array.isArray(manifest.exports)
        ? manifest.exports
        : Object.keys(manifest.exports);
      exports = new Set(
        entries.map((entry) =>
          entry === '.' ? manifest.name : `${manifest.name}/${entry.slice(2)}`,
        ),
      );
      reactExportCache.set(assetsRoot, exports);
    } catch (cause) {
      throw new TaleToolingError(
        'TALE_CORRUPT_REGISTRY',
        'Tale UI: the installed React export manifest is unreadable, so registry validation ' +
          'cannot determine public imports. Reinstall @tale-ui/tooling and retry.',
        { cause },
      );
    }
  }
  return exports;
}
