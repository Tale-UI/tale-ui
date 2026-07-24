// eslint-disable-next-line import/extensions -- Node ESM needs the emitted JavaScript extension.
import { getArtifactFromRegistry, searchArtifactsInRegistry } from './core/artifacts.js';
import type {
  ArtifactKind,
  ArtifactRecord,
  ArtifactSearchRequest,
  ArtifactSearchResult,
} from './contracts/artifact.js';
import type {
  CorrelatedVersions,
  TaleErrorEnvelope,
  TaleSuccessEnvelope,
} from './contracts/envelope.js';
import { TaleToolingError, toTaleError } from './contracts/errors.js';
import type { CapabilitySurface } from './contracts/capability.js';
import type { ToolingManifest } from './contracts/manifest.js';
import { loadArtifactRegistry, loadCapabilityManifest } from './registry.js';

export const TOOLING_CONTRACT_VERSION = '1.0.0';

export function getManifest(): ToolingManifest {
  const registry = loadArtifactRegistry();
  const capabilities = loadCapabilityManifest();
  if (capabilities.registryVersion !== registry.registryVersion) {
    throw new TaleToolingError(
      'TALE_VERSION_RANGE_MISMATCH',
      'The installed artifact and capability registries are incompatible.',
    );
  }
  return {
    contractVersion: TOOLING_CONTRACT_VERSION,
    registryVersion: registry.registryVersion,
    registrySchemaVersion: registry.schemaVersion,
    capabilityManifestVersion: capabilities.schemaVersion,
    capabilityManifestId: capabilities.manifestId,
    releaseChannel: registry.releaseChannel,
    sourceRevision: registry.sourceRevision,
    packageVersions: registry.packageVersions,
    capabilities: capabilities.capabilities,
  };
}

export function searchArtifacts(request: ArtifactSearchRequest = {}): ArtifactSearchResult {
  try {
    return searchArtifactsInRegistry(loadArtifactRegistry(), request) as ArtifactSearchResult;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TaleToolingError('TALE_INVALID_ARGUMENT', error.message, { cause: error });
    }
    throw error;
  }
}

export function getArtifact(
  idOrAlias: string,
  options: { kind?: ArtifactKind } = {},
): ArtifactRecord | null {
  if (typeof idOrAlias !== 'string' || !idOrAlias.trim()) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Artifact lookup requires a non-empty ID or alias.',
    );
  }
  try {
    return getArtifactFromRegistry(
      loadArtifactRegistry(),
      idOrAlias,
      options,
    ) as ArtifactRecord | null;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TaleToolingError('TALE_INVALID_ARGUMENT', error.message, { cause: error });
    }
    throw error;
  }
}

function correlatedVersions(manifest: ToolingManifest): CorrelatedVersions {
  return {
    contract: manifest.contractVersion,
    registry: manifest.registryVersion,
    capabilityManifest: manifest.capabilityManifestVersion,
    packages: manifest.packageVersions,
  };
}

export function createSuccessEnvelope<T>(
  command: string,
  requestId: string,
  data: T,
  options: {
    warnings?: string[];
    metadata?: Record<string, unknown>;
    surface?: CapabilitySurface;
  } = {},
): TaleSuccessEnvelope<T> {
  const manifest = getManifest();
  const surface = options.surface || 'api';
  return {
    ok: true,
    command,
    requestId,
    versions: correlatedVersions(manifest),
    capabilities: manifest.capabilities
      .filter(
        (capability) =>
          capability.status === 'available' && capability.availability.includes(surface),
      )
      .map((capability) => capability.id)
      .sort(),
    data,
    warnings: options.warnings || [],
    ...(options.metadata ? { metadata: options.metadata } : {}),
  };
}

export function createErrorEnvelope(
  command: string,
  requestId: string,
  error: unknown,
): TaleErrorEnvelope {
  return {
    ok: false,
    command,
    requestId,
    error: toTaleError(error),
  };
}
