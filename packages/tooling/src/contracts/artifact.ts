export type ArtifactKind =
  | 'component'
  | 'hook'
  | 'recipe'
  | 'template'
  | 'doc'
  | 'a2ui-type'
  | 'foundation'
  | 'pitfall'
  | 'validation'
  | 'codemod'
  | 'composition'
  | 'extension';

export type ArtifactLifecycle = 'stable' | 'experimental' | 'deprecated' | 'retired';

export type ArtifactId = `${string}:${ArtifactKind}:${string}`;

export interface ArtifactRetrievalPointer {
  type: 'registry' | 'file' | 'package-export';
  path: string;
  selector?: string;
}

export interface ArtifactRecord {
  id: ArtifactId;
  namespace: string;
  kind: ArtifactKind;
  slug: string;
  name: string;
  description?: string;
  lifecycle: ArtifactLifecycle;
  package?: `@tale-ui/${string}`;
  version?: string;
  aliases?: string[];
  deprecatedIn?: string;
  replacementId?: ArtifactId;
  migration?: string;
  keywords: string[];
  related: ArtifactId[];
  retrieval: ArtifactRetrievalPointer[];
  capabilities: string[];
  platforms: Array<'web' | 'native' | 'agent'>;
  locales?: string[];
  provenance: {
    source: string;
    firstParty: boolean;
    license?: string;
  };
  integrity?: `sha256-${string}`;
  trust: 'first-party' | 'trusted' | 'untrusted' | 'revoked';
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

export interface ArtifactRegistry {
  schemaVersion: string;
  registryVersion: string;
  releaseChannel: 'internal' | 'canary' | 'beta' | 'stable';
  generatedFrom: string[];
  sourceRevision: `sha256:${string}`;
  digest: `sha256:${string}`;
  packageVersions: Record<string, string>;
  capabilityManifestId: 'tale:capability-manifest:core';
  artifacts: ArtifactRecord[];
}

export interface ArtifactSearchRequest {
  query?: string;
  kinds?: ArtifactKind[];
  lifecycle?: ArtifactLifecycle[];
  limit?: number;
  cursor?: number;
}

export interface ArtifactSearchResult {
  registryVersion: string;
  sourceRevision: `sha256:${string}`;
  results: Array<
    Pick<
      ArtifactRecord,
      'id' | 'kind' | 'name' | 'lifecycle' | 'description' | 'retrieval' | 'replacementId'
    > & { relevance: number }
  >;
  nextCursor: number | null;
}
