import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { ValidationCodeRequest } from './contracts/validation.js';
import { validateCodeForMcp } from './mcp.js';
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
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
