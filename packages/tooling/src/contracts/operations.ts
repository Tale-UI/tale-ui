export type ProjectOperationKind =
  | 'init'
  | 'template-add'
  | 'generate'
  | 'compose'
  | 'upgrade';

export interface ProjectMutationFile {
  path: string;
  content: string;
  /**
   * Permit replacement of an existing non-equivalent file.
   *
   * Callers should prefer structural merges and leave this false unless the
   * existing preimage has already been validated.
   */
  overwrite?: boolean;
}

export interface ProjectMutationRequest {
  schemaVersion: '1.0.0';
  requestId: string;
  root: string;
  operation: ProjectOperationKind;
  idempotencyKey: string;
  files: ProjectMutationFile[];
}

export interface ProjectMutationFileReport {
  path: string;
  action: 'create' | 'update' | 'no-op' | 'conflict';
  postimageDigest: `sha256:${string}`;
  postimageSize: number;
}

export interface ProjectMutationPlan {
  schemaVersion: '1.0.0';
  requestId: string;
  planDigest: `sha256:${string}`;
  files: ProjectMutationFileReport[];
  warnings: string[];
}

export interface ProjectMutationResult extends ProjectMutationPlan {
  operationId: string;
  state: 'completed' | 'rolled-back';
  replayed: boolean;
}

export interface ProjectDoctorResult {
  schemaVersion: '1.0.0';
  healthy: boolean;
  blockedOperationIds: string[];
  manualInterventionOperationIds: string[];
  lock: {
    present: boolean;
    operationId?: string;
  };
  operations: Array<{
    operationId: string;
    state:
      | 'reserved'
      | 'journal-linked'
      | 'in-progress'
      | 'completed'
      | 'rolled-back'
      | 'manual-intervention'
      | 'tombstoned';
    postimagesVerified: boolean;
    evidenceExportPath: string;
  }>;
  recoverable: Array<{
    operationId: string;
    actions: Array<'resume' | 'rollback'>;
  }>;
}

export interface ProjectRecoveryRequest {
  schemaVersion: '1.0.0';
  requestId: string;
  root: string;
  operationId: string;
  action: 'resume' | 'rollback';
}
