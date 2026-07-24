import type { CorrelatedVersions } from './envelope.js';

export type ValidationRule = 'registry' | 'typescript';

interface ValidationRequestBase {
  schemaVersion: '1.0.0';
  requestId: string;
  root: string;
  timeoutMs: number;
  rules?: ValidationRule[];
}

export interface ValidationFileRequest extends ValidationRequestBase {
  file: string;
  code?: never;
  virtualFile?: never;
}

export interface ValidationCodeRequest extends ValidationRequestBase {
  code: string;
  virtualFile: string;
  file?: never;
}

export type ValidationRequest = ValidationFileRequest | ValidationCodeRequest;

export interface ValidationDiagnostic {
  code: string | number;
  ruleId?: string;
  severity: 'error' | 'warning' | 'info';
  path?: string;
  line?: number;
  column?: number;
  message: string;
}

export interface ValidationVersions extends CorrelatedVersions {
  typescript: string;
}

export interface ValidationResult {
  schemaVersion: '1.0.0';
  requestId: string;
  valid: boolean;
  diagnostics: ValidationDiagnostic[];
  versions: ValidationVersions;
  fallbackConfig: boolean;
}

export interface ValidationRunOptions {
  signal?: AbortSignal;
}
