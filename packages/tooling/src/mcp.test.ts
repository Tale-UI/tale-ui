import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { TaleToolingError } from './contracts/errors.js';
import type { ValidationCodeRequest } from './contracts/validation.js';
import { parseMcpValidationResponse, validateCodeForMcp } from './mcp.js';
import { validateCode } from './validation/index.js';

test('local MCP returns the same normalized validation result as the API', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tale-tooling-mcp-'));
  const request: ValidationCodeRequest = {
    schemaVersion: '1.0.0',
    requestId: 'mcp-parity',
    root,
    code: "import { Missing } from '@tale-ui/react/not-real';",
    virtualFile: 'src/example.tsx',
    timeoutMs: 10_000,
    rules: ['registry'],
  };
  try {
    const apiResult = await validateCode(request);
    const response = await validateCodeForMcp(request.code, {
      requestId: request.requestId,
      root,
      virtualFile: request.virtualFile,
      timeoutMs: request.timeoutMs,
      rules: request.rules,
    });
    assert.equal(response.isError, true);
    assert.deepEqual(JSON.parse(response.content[0]!.text), apiResult);
    assert.deepEqual(parseMcpValidationResponse(response), apiResult);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('local MCP rejects an empty validation rule selection', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tale-tooling-mcp-'));
  try {
    const response = await validateCodeForMcp('export const answer: string = 42;', {
      root,
      rules: [],
    });
    assert.equal(response.isError, true);
    const payload = JSON.parse(response.content[0]!.text);
    assert.equal(payload.error.code, 'TALE_INVALID_ARGUMENT');
    assert.match(payload.error.message, /cannot be empty/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('MCP response parsing rejects operational errors and malformed payloads', () => {
  assert.throws(
    () =>
      parseMcpValidationResponse({
        isError: true,
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: {
                code: 'TALE_VALIDATION_TIMEOUT',
                message:
                  'Tale UI: validation timed out, so no complete result is available. Retry with a longer timeout.',
                details: {},
                retryable: false,
                documentation: 'https://tale-ui.dev/errors/TALE_VALIDATION_TIMEOUT',
              },
            }),
          },
        ],
      }),
    (error) =>
      error instanceof TaleToolingError &&
      error.code === 'TALE_VALIDATION_TIMEOUT' &&
      error.message.startsWith('Tale UI:'),
  );
  assert.throws(
    () =>
      parseMcpValidationResponse({
        content: [{ type: 'text', text: '{invalid' }],
      }),
    (error) =>
      error instanceof TaleToolingError &&
      error.code === 'TALE_INTERNAL_ERROR' &&
      error.message.startsWith('Tale UI:') &&
      !(error.cause instanceof SyntaxError && error.message === error.cause.message),
  );
  assert.throws(
    () =>
      parseMcpValidationResponse({
        content: [{ type: 'text', text: JSON.stringify({ valid: true }) }],
      }),
    (error) =>
      error instanceof TaleToolingError &&
      error.code === 'TALE_INTERNAL_ERROR' &&
      error.message.includes('unexpected payload'),
  );
});
