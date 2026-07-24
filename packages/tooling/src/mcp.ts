import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ValidationResult, ValidationRule } from './contracts/validation.js';
import { isTaleErrorCode, TaleToolingError, toTaleError } from './contracts/errors.js';
import { getManifest } from './api.js';
import { validateCode } from './validation/index.js';

interface McpContent {
  type: 'text';
  text: string;
}

export interface McpValidationResponse {
  [key: string]: unknown;
  content: McpContent[];
  isError?: boolean;
}

export interface LocalMcpOptions {
  root?: string;
  timeoutMs?: number;
}

const validationResultSchema = z
  .object({
    schemaVersion: z.literal('1.0.0'),
    requestId: z.string(),
    valid: z.boolean(),
    diagnostics: z.array(
      z
        .object({
          code: z.union([z.string(), z.number().int()]),
          ruleId: z.string().optional(),
          severity: z.enum(['error', 'warning', 'info']),
          path: z.string().optional(),
          line: z.number().int().min(1).optional(),
          column: z.number().int().min(1).optional(),
          message: z.string(),
        })
        .strict(),
    ),
    versions: z
      .object({
        contract: z.string(),
        registry: z.string(),
        capabilityManifest: z.string(),
        packages: z.record(z.string()),
        typescript: z.string(),
      })
      .strict(),
    fallbackConfig: z.boolean(),
  })
  .strict();

const mcpErrorSchema = z
  .object({
    error: z
      .object({
        code: z.string(),
        message: z.string().startsWith('Tale UI: '),
        details: z.record(z.unknown()),
        retryable: z.boolean(),
      })
      .passthrough(),
  })
  .strict();

function hasCapability(id: string) {
  return getManifest().capabilities.some(
    (capability) =>
      capability.id === id &&
      capability.status === 'available' &&
      capability.availability.includes('local-mcp'),
  );
}

export async function validateCodeForMcp(
  code: string,
  options: LocalMcpOptions & {
    requestId?: string;
    virtualFile?: string;
    rules?: ValidationRule[];
    signal?: AbortSignal;
  } = {},
): Promise<McpValidationResponse> {
  try {
    const result = await validateCode(
      {
        schemaVersion: '1.0.0',
        requestId: options.requestId || randomUUID(),
        root: options.root || process.cwd(),
        code,
        virtualFile: options.virtualFile || 'src/tale-validation.tsx',
        timeoutMs: options.timeoutMs ?? 30_000,
        ...(options.rules ? { rules: options.rules } : {}),
      },
      { signal: options.signal },
    );
    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      ...(result.valid ? {} : { isError: true }),
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: toTaleError(error) }) }],
      isError: true,
    };
  }
}

export function createLocalMcpServer(options: LocalMcpOptions = {}) {
  const server = new McpServer({ name: 'tale-ui', version: '1.0.0' });
  if (hasCapability('code.validate')) {
    server.tool(
      'validate_code',
      'Validate Tale UI React code against the installed registry and TypeScript project.',
      {
        code: z.string().max(1_000_000),
        virtualFile: z.string().optional(),
        timeoutMs: z.number().int().min(1).max(60_000).optional(),
        rules: z
          .array(z.enum(['registry', 'typescript']))
          .min(1)
          .optional(),
      },
      async ({ code, virtualFile, timeoutMs, rules }, extra) =>
        validateCodeForMcp(code, {
          ...options,
          ...(virtualFile ? { virtualFile } : {}),
          ...(timeoutMs ? { timeoutMs } : {}),
          ...(rules ? { rules } : {}),
          signal: extra.signal,
        }),
    );
  }
  return server;
}

export function parseMcpValidationResponse(response: McpValidationResponse): ValidationResult {
  const content = response.content[0];
  if (!content) {
    throw new TaleToolingError(
      'TALE_INTERNAL_ERROR',
      'Tale UI: local MCP validation returned no content, so its result cannot be interpreted. ' +
        'Restart the local MCP server and retry validation.',
    );
  }
  let payload: unknown;
  try {
    payload = JSON.parse(content.text);
  } catch (cause) {
    throw new TaleToolingError(
      'TALE_INTERNAL_ERROR',
      'Tale UI: local MCP validation returned malformed JSON, so its result cannot be interpreted. ' +
        'Restart the local MCP server and retry validation.',
      { cause },
    );
  }
  const failure = mcpErrorSchema.safeParse(payload);
  if (failure.success && isTaleErrorCode(failure.data.error.code)) {
    throw new TaleToolingError(failure.data.error.code, failure.data.error.message, {
      details: failure.data.error.details,
      retryable: failure.data.error.retryable,
    });
  }
  const result = validationResultSchema.safeParse(payload);
  if (!result.success) {
    throw new TaleToolingError(
      'TALE_INTERNAL_ERROR',
      'Tale UI: local MCP validation returned an unexpected payload, so its result cannot be interpreted. ' +
        'Restart the local MCP server and retry validation.',
    );
  }
  return result.data;
}
