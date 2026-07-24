export type CapabilitySurface = 'api' | 'cli' | 'local-mcp' | 'hosted-mcp';

export interface CapabilityRecord {
  id: string;
  version: string;
  description: string;
  availability: CapabilitySurface[];
  status: 'available' | 'gated' | 'deprecated';
  gate?: string;
}

export interface CapabilityManifest {
  schemaVersion: string;
  manifestId: 'tale:capability-manifest:core';
  registryVersion: string;
  digest: `sha256:${string}`;
  capabilities: CapabilityRecord[];
}
