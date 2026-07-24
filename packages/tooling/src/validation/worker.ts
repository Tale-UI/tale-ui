import { parentPort, workerData } from 'node:worker_threads';
import type { ValidationRequest } from '../contracts/validation.js';
import { TaleToolingError } from '../contracts/errors.js';
import { validateRequestCore } from './core.js';

try {
  parentPort!.postMessage({
    ok: true,
    result: validateRequestCore(workerData as ValidationRequest),
  });
} catch (error) {
  const normalized =
    error instanceof TaleToolingError
      ? error
      : new TaleToolingError('TALE_INTERNAL_ERROR', 'Tale UI: validation failed internally.');
  parentPort!.postMessage({
    ok: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      retryable: normalized.retryable,
    },
  });
}
