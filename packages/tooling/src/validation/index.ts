import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import type {
  ValidationCodeRequest,
  ValidationFileRequest,
  ValidationRequest,
  ValidationResult,
  ValidationRunOptions,
} from '../contracts/validation.js';
import { TaleToolingError, isTaleErrorCode } from '../contracts/errors.js';

interface WorkerMessage {
  ok: boolean;
  result?: ValidationResult;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

function workerRuntime() {
  const builtWorker = new URL('./worker.js', import.meta.url);
  if (existsSync(fileURLToPath(builtWorker))) {
    return { url: builtWorker, execArgv: [] };
  }
  return {
    url: new URL('./worker-dev.mjs', import.meta.url),
    execArgv: [],
  };
}

function runValidation(
  request: ValidationRequest,
  options: ValidationRunOptions = {},
): Promise<ValidationResult> {
  if (options.signal?.aborted) {
    return Promise.reject(
      new TaleToolingError('TALE_VALIDATION_CANCELLED', 'Tale UI: validation was cancelled.'),
    );
  }

  return new Promise((resolve, reject) => {
    const runtime = workerRuntime();
    const worker = new Worker(runtime.url, {
      workerData: request,
      execArgv: runtime.execArgv,
      resourceLimits: {
        maxOldGenerationSizeMb: 512,
        maxYoungGenerationSizeMb: 64,
        stackSizeMb: 4,
      },
    });
    let settled = false;
    let timeout: NodeJS.Timeout | undefined;
    let cancel = () => {};
    const finish = (action: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      options.signal?.removeEventListener('abort', cancel);
      action();
    };
    cancel = () => {
      void worker.terminate();
      finish(() =>
        reject(
          new TaleToolingError('TALE_VALIDATION_CANCELLED', 'Tale UI: validation was cancelled.'),
        ),
      );
    };
    const requestedTimeout =
      Number.isInteger(request.timeoutMs) && request.timeoutMs >= 1 && request.timeoutMs <= 60_000
        ? request.timeoutMs
        : 60_000;
    timeout = setTimeout(() => {
      void worker.terminate();
      finish(() =>
        reject(
          new TaleToolingError(
            'TALE_VALIDATION_TIMEOUT',
            'Tale UI: validation exceeded timeoutMs, so it could not produce a complete result. ' +
              'Increase timeoutMs, reduce the input or project scope, then retry.',
          ),
        ),
      );
    }, requestedTimeout);
    timeout.unref();
    options.signal?.addEventListener('abort', cancel, { once: true });
    worker.once('message', (message: WorkerMessage) => {
      finish(() => {
        if (message.ok && message.result) {
          resolve(message.result);
          return;
        }
        const code =
          message.error && isTaleErrorCode(message.error.code)
            ? message.error.code
            : 'TALE_INTERNAL_ERROR';
        reject(
          new TaleToolingError(
            code,
            message.error?.message || 'Tale UI: validation failed internally.',
            { retryable: message.error?.retryable },
          ),
        );
      });
    });
    worker.once('error', () => {
      finish(() =>
        reject(new TaleToolingError('TALE_INTERNAL_ERROR', 'Tale UI: validation worker failed.')),
      );
    });
    worker.once('exit', (code) => {
      if (code !== 0) {
        finish(() =>
          reject(
            new TaleToolingError(
              'TALE_INTERNAL_ERROR',
              'Tale UI: validation worker exited unexpectedly.',
            ),
          ),
        );
      }
    });
  });
}

export function validateCode(
  request: ValidationCodeRequest,
  options?: ValidationRunOptions,
): Promise<ValidationResult> {
  return runValidation(request, options);
}

export function validateFile(
  request: ValidationFileRequest,
  options?: ValidationRunOptions,
): Promise<ValidationResult> {
  return runValidation(request, options);
}
