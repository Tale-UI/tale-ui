export interface TaleMigrationTransform {
  id: string;
  kind: 'javascript' | 'typescript' | 'css' | 'config';
  path: string;
  files: string[];
}

export interface TaleMigrationManifest {
  schemaVersion: '1.0.0';
  id: string;
  order: number;
  group: 'package-rename' | 'deprecated-api' | 'token-name' | 'import-path';
  description: string;
  from: string;
  to: string;
  dependencies: string[];
  transforms: TaleMigrationTransform[];
  affectedArtifacts: string[];
  deprecations: Array<{
    id: string;
    replacementId: string;
    documentation: string;
  }>;
  sourceEvidence: string[];
  parsers: Array<'text' | 'json' | 'css' | 'typescript'>;
  sensitiveFiles: 'require-explicit';
  generatedFiles: 'require-explicit';
  reversible: boolean;
  backupPolicy: 'required' | 'optional' | 'none';
  idempotent: true;
  checksum: `sha256:${string}`;
}

export interface MigrationRequest {
  schemaVersion: '1.0.0';
  requestId: string;
  root: string;
  migration: string;
  idempotencyKey?: string;
  planDigest?: `sha256:${string}`;
  files?: string[];
  authorizeSensitive?: boolean;
  authorizeGenerated?: boolean;
}

export interface MigrationFileReport {
  path: string;
  action: 'update' | 'no-op' | 'skipped';
  preimageDigest: `sha256:${string}`;
  postimageDigest: `sha256:${string}`;
  replacements: number;
  reason?: 'sensitive' | 'generated';
}

export interface MigrationPlan {
  schemaVersion: '1.0.0';
  requestId: string;
  migration: TaleMigrationManifest;
  state: 'applicable' | 'already-migrated';
  planDigest: `sha256:${string}`;
  files: MigrationFileReport[];
}

export interface MigrationApplyResult extends MigrationPlan {
  operationId?: string;
  replayed: boolean;
}
