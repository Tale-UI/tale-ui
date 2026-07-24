import type { TaleError } from './errors.js';

export interface CorrelatedVersions {
  contract: string;
  registry: string;
  capabilityManifest: string;
  packages: Record<string, string>;
}

export interface TaleSuccessEnvelope<T> {
  ok: true;
  command: string;
  requestId: string;
  versions: CorrelatedVersions;
  capabilities: string[];
  data: T;
  warnings: string[];
  metadata?: Record<string, unknown>;
}

export interface TaleErrorEnvelope {
  ok: false;
  command: string;
  requestId: string;
  error: TaleError;
}

export type TaleEnvelope<T> = TaleSuccessEnvelope<T> | TaleErrorEnvelope;
