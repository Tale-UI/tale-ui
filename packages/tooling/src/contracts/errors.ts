export const TALE_ERROR_EXIT = {
  TALE_INVALID_ARGUMENT: 2,
  TALE_UNSUPPORTED_COMMAND: 2,
  TALE_UNSUPPORTED_CAPABILITY: 3,
  TALE_UNSUPPORTED_CONTRACT_VERSION: 3,
  TALE_UNSUPPORTED_REGISTRY_VERSION: 3,
  TALE_VERSION_RANGE_MISMATCH: 3,
  TALE_SCHEMA_MISMATCH: 3,
  TALE_EXTENSION_UNSUPPORTED: 3,
  TALE_ARTIFACT_NOT_FOUND: 4,
  TALE_OPERATION_NOT_FOUND: 4,
  TALE_MIGRATION_UNAVAILABLE: 4,
  TALE_VALIDATION_FAILED: 5,
  TALE_VALIDATION_TIMEOUT: 5,
  TALE_VALIDATION_CANCELLED: 5,
  TALE_OUTSIDE_PROJECT_ROOT: 6,
  TALE_UNSAFE_PATH: 6,
  TALE_SYMLINK_REFUSED: 6,
  TALE_OVERWRITE_REFUSED: 6,
  TALE_CHANGED_SINCE_PLAN: 6,
  TALE_IDEMPOTENCY_CONFLICT: 6,
  TALE_TEMPLATE_CONFLICT: 6,
  TALE_EXTENSION_UNTRUSTED: 6,
  TALE_RECOVERY_PRECONDITION_FAILED: 6,
  TALE_UNVERIFIABLE_POSTIMAGE: 6,
  TALE_CONCURRENT_MUTATION: 7,
  TALE_OPERATION_IN_PROGRESS: 7,
  TALE_RECOVERY_IN_PROGRESS: 7,
  TALE_RETRYABLE_EXTERNAL_ERROR: 7,
  TALE_CORRUPT_REGISTRY: 8,
  TALE_CORRUPT_OPERATION_STATE: 8,
  TALE_MALFORMED_PROJECT_CONFIG: 8,
  TALE_INVALID_TSCONFIG: 8,
  TALE_INTERNAL_ERROR: 1,
} as const;

export type TaleErrorCode = keyof typeof TALE_ERROR_EXIT;

export interface TaleError {
  code: TaleErrorCode;
  message: string;
  details: Record<string, unknown>;
  retryable: boolean;
  documentation: string;
  deprecatedIn?: string;
  replacementCode?: TaleErrorCode;
}

export function isTaleErrorCode(value: unknown): value is TaleErrorCode {
  return typeof value === 'string' && value in TALE_ERROR_EXIT;
}

export class TaleToolingError extends Error {
  readonly code: TaleErrorCode;
  readonly details: Record<string, unknown>;
  readonly retryable: boolean;

  constructor(
    code: TaleErrorCode,
    message: string,
    options: {
      details?: Record<string, unknown>;
      retryable?: boolean;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'TaleToolingError';
    this.code = code;
    this.details = options.details || {};
    this.retryable = options.retryable || false;
  }
}

export function toTaleError(error: unknown): TaleError {
  const normalized =
    error instanceof TaleToolingError
      ? error
      : new TaleToolingError('TALE_INTERNAL_ERROR', 'An internal tooling error occurred.');
  return {
    code: normalized.code,
    message: normalized.message,
    details: normalized.details,
    retryable: normalized.retryable,
    documentation: `https://tale-ui.dev/errors/${normalized.code}`,
  };
}
