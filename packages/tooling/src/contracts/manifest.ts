import type { CapabilityRecord } from './capability.js';

export interface ToolingManifest {
  contractVersion: string;
  registryVersion: string;
  registrySchemaVersion: string;
  capabilityManifestVersion: string;
  capabilityManifestId: 'tale:capability-manifest:core';
  releaseChannel: 'internal' | 'canary' | 'beta' | 'stable';
  sourceRevision: `sha256:${string}`;
  packageVersions: Record<string, string>;
  capabilities: CapabilityRecord[];
}
