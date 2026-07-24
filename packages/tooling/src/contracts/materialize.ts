import type { ProjectMutationResult } from './operations.js';

export interface TaleTemplateManifest {
  schemaVersion: '1.0.0';
  id: `tale:template:${string}`;
  version: string;
  source: string;
  skeleton: string;
  dependencies: Record<string, string>;
  preview: {
    recipe: string;
    accessibility: string;
    responsive: boolean;
  };
  golden: string;
  compatibility: {
    react: string;
    tale: string;
    frameworks: string[];
  };
  appearance: ['light', 'dark'];
  rtl: true;
  provenance: {
    source: string;
    firstParty: true;
  };
  license: 'MIT';
  digest: `sha256:${string}`;
}

export interface InitializeProjectRequest {
  schemaVersion: '1.0.0';
  requestId: string;
  root: string;
  idempotencyKey: string;
  addScripts?: boolean;
}

export interface AddTemplateRequest {
  schemaVersion: '1.0.0';
  requestId: string;
  root: string;
  idempotencyKey: string;
  template: string;
  target?: string;
  skeleton?: boolean;
  addDependencies?: boolean;
}

export interface TemplateMaterializationResult extends ProjectMutationResult {
  template: TaleTemplateManifest;
}

export interface TemplateSourceResult {
  template: TaleTemplateManifest;
  variant: 'source' | 'skeleton';
  content: string;
}
