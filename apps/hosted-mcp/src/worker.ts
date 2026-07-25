// eslint-disable-next-line import/no-relative-packages -- the worker bundles the canonical repository registry.
import registry from '../../../registry/artifacts.json' with { type: 'json' };

const PROTOCOL_VERSION = '2025-06-18';
const SOURCE_ROOT = 'https://github.com/Tale-UI/tale-ui/blob/main';
const MAX_BODY_BYTES = 16 * 1024;
const MAX_RESPONSE_BYTES = 64 * 1024;
const MAX_SEARCH_RESULTS = 20;
const MAX_PLAN_RESULTS = 12;
const DAILY_REQUEST_LIMIT = 500;

type Artifact = (typeof registry.artifacts)[number];

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
}

interface ToolResult {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent: Record<string, unknown>;
}

interface DurableObjectStorageLike {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
  setAlarm(timestamp: number): Promise<void>;
  deleteAll(): Promise<void>;
}

interface DurableObjectStateLike {
  storage: DurableObjectStorageLike;
}

interface HostedEnvironment {
  RATE_LIMIT_HMAC_KEY?: string;
  RATE_LIMITER?: {
    idFromName(name: string): unknown;
    get(id: unknown): { fetch(request: Request): Promise<Response> };
  };
}

const tools = [
  {
    name: 'search_artifacts',
    description: 'Search Tale UI components, recipes, templates, docs, and foundations.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        query: { type: 'string', maxLength: 256 },
        kind: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: MAX_SEARCH_RESULTS },
      },
    },
  },
  {
    name: 'get_artifact',
    description: 'Retrieve one canonical Tale UI artifact by stable ID or alias.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: { id: { type: 'string', minLength: 1, maxLength: 200 } },
    },
  },
  {
    name: 'plan_ui',
    description: 'Plan a UI from bounded public registry context before generating code.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['prompt'],
      properties: { prompt: { type: 'string', minLength: 1, maxLength: 4000 } },
    },
  },
] as const;

function sourceLink(path = 'registry/artifacts.json') {
  return `${SOURCE_ROOT}/${path}`;
}

function normalizeTerms(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1);
}

function scoreArtifact(artifact: Artifact, terms: string[]) {
  const exact = new Set([artifact.id, artifact.slug, artifact.name, ...(artifact.aliases ?? [])]);
  const searchable = [
    artifact.id,
    artifact.slug,
    artifact.name,
    artifact.description,
    ...(artifact.aliases ?? []),
    ...(artifact.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return terms.reduce(
    (score, term) =>
      score +
      ([...exact].some((value) => value.toLowerCase() === term) ? 20 : 0) +
      (searchable.includes(term) ? 2 : 0),
    0,
  );
}

function publicArtifact(artifact: Artifact) {
  return {
    id: artifact.id,
    kind: artifact.kind,
    name: artifact.name,
    description: artifact.description,
    lifecycle: artifact.lifecycle,
    package: 'package' in artifact ? artifact.package : undefined,
    version: 'version' in artifact ? artifact.version : undefined,
    replacementId: 'replacementId' in artifact ? artifact.replacementId : undefined,
    related: artifact.related,
    retrieval: artifact.retrieval,
    source: sourceLink(artifact.provenance.source),
  };
}

function searchArtifacts(args: Record<string, unknown>) {
  const query = typeof args.query === 'string' ? args.query.trim() : '';
  const kind = typeof args.kind === 'string' ? args.kind : undefined;
  const requestedLimit = typeof args.limit === 'number' ? Math.floor(args.limit) : 10;
  if (query.length > 256 || requestedLimit < 1 || requestedLimit > MAX_SEARCH_RESULTS) {
    throw new TypeError('Search input exceeds the documented hosted limits.');
  }
  const terms = normalizeTerms(query);
  return registry.artifacts
    .filter((artifact) => !kind || artifact.kind === kind)
    .map((artifact) => ({ artifact, score: terms.length ? scoreArtifact(artifact, terms) : 1 }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.artifact.id.localeCompare(right.artifact.id),
    )
    .slice(0, requestedLimit)
    .map(({ artifact }) => publicArtifact(artifact));
}

function getArtifact(args: Record<string, unknown>) {
  if (typeof args.id !== 'string' || !args.id.trim() || args.id.length > 200) {
    throw new TypeError('Artifact ID must be a non-empty string of at most 200 characters.');
  }
  const id = args.id.toLowerCase();
  const artifact = registry.artifacts.find(
    (candidate) =>
      candidate.id.toLowerCase() === id ||
      candidate.slug.toLowerCase() === id ||
      candidate.aliases?.some((alias) => alias.toLowerCase() === id),
  );
  return artifact ? publicArtifact(artifact) : null;
}

function planUi(args: Record<string, unknown>) {
  if (typeof args.prompt !== 'string' || !args.prompt.trim() || args.prompt.length > 4000) {
    throw new TypeError('Planning prompt must contain 1 to 4,000 characters.');
  }
  const terms = normalizeTerms(args.prompt);
  const ranked = registry.artifacts
    .filter(
      (artifact) =>
        artifact.lifecycle !== 'deprecated' &&
        ['component', 'recipe', 'template', 'pitfall'].includes(artifact.kind),
    )
    .map((artifact) => ({ artifact, score: scoreArtifact(artifact, terms) }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.artifact.id.localeCompare(right.artifact.id),
    )
    .slice(0, MAX_PLAN_RESULTS)
    .map(({ artifact, score }) => ({
      ...publicArtifact(artifact),
      reason: `Matched ${score} bounded registry relevance points.`,
    }));
  return {
    promptDigestInputLength: args.prompt.length,
    recommendations: ranked,
    boundary:
      'This plan uses public registry metadata only; validate and materialize locally with @tale-ui/tooling.',
  };
}

function toolResult(data: unknown): ToolResult {
  const structuredContent = {
    registryVersion: registry.registryVersion,
    sourceRevision: registry.sourceRevision,
    source: sourceLink(),
    limits: {
      responseBytes: MAX_RESPONSE_BYTES,
      searchResults: MAX_SEARCH_RESULTS,
      planResults: MAX_PLAN_RESULTS,
    },
    data,
  };
  const text = JSON.stringify(structuredContent);
  if (new TextEncoder().encode(text).byteLength > MAX_RESPONSE_BYTES) {
    throw new RangeError('Hosted MCP response exceeded its documented byte budget.');
  }
  return { content: [{ type: 'text', text }], structuredContent };
}

function jsonRpc(id: JsonRpcRequest['id'], result: unknown, status = 200) {
  return Response.json(
    { jsonrpc: '2.0', id: id ?? null, result },
    {
      status,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'application/json; charset=utf-8',
      },
    },
  );
}

function jsonRpcError(id: JsonRpcRequest['id'], code: number, message: string, status = 400) {
  return Response.json(
    { jsonrpc: '2.0', id: id ?? null, error: { code, message } },
    { status, headers: { 'cache-control': 'no-store' } },
  );
}

async function hmac(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function enforceRateLimit(request: Request, env: HostedEnvironment) {
  if (!env.RATE_LIMITER || !env.RATE_LIMIT_HMAC_KEY) {
    return new Response('Hosted MCP rate limiting is not configured.', { status: 503 });
  }
  const day = new Date().toISOString().slice(0, 10);
  const networkIdentifier = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const rotatedIdentifier = await hmac(`${day}:${networkIdentifier}`, env.RATE_LIMIT_HMAC_KEY);
  const id = env.RATE_LIMITER.idFromName(rotatedIdentifier);
  return env.RATE_LIMITER.get(id).fetch(
    new Request('https://rate-limit.internal/check', { method: 'POST' }),
  );
}

async function handleMcp(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonRpcError(null, -32600, 'Request body exceeds 16 KiB.', 413);
  }
  let message: JsonRpcRequest;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
      return jsonRpcError(null, -32600, 'Request body exceeds 16 KiB.', 413);
    }
    message = JSON.parse(text) as JsonRpcRequest;
  } catch {
    return jsonRpcError(null, -32700, 'Invalid JSON.');
  }
  if (message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return jsonRpcError(message.id, -32600, 'Invalid JSON-RPC request.');
  }
  if (message.method === 'initialize') {
    return jsonRpc(message.id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'tale-ui-hosted', version: registry.registryVersion },
      instructions:
        'Read-only public retrieval and UI planning. Run validation and mutations locally.',
    });
  }
  if (message.method === 'tools/list') {
    return jsonRpc(message.id, { tools });
  }
  if (message.method !== 'tools/call') {
    return jsonRpcError(message.id, -32601, 'Method not found.', 404);
  }
  const name = message.params?.name;
  const args = message.params?.arguments ?? {};
  try {
    if (name === 'search_artifacts') {
      return jsonRpc(message.id, toolResult(searchArtifacts(args)));
    }
    if (name === 'get_artifact') {
      return jsonRpc(message.id, toolResult(getArtifact(args)));
    }
    if (name === 'plan_ui') {
      return jsonRpc(message.id, toolResult(planUi(args)));
    }
    return jsonRpcError(message.id, -32602, 'Unknown or prohibited tool.', 400);
  } catch (error) {
    return jsonRpcError(
      message.id,
      -32602,
      error instanceof Error ? error.message : 'Invalid tool arguments.',
    );
  }
}

export async function fetch(request: Request, env: HostedEnvironment = {}): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === 'GET' && url.pathname === '/health') {
    return Response.json({
      ok: true,
      registryVersion: registry.registryVersion,
      sourceRevision: registry.sourceRevision,
      source: sourceLink(),
    });
  }
  if (request.method !== 'POST' || url.pathname !== '/mcp') {
    return new Response('Not found', { status: 404 });
  }
  if (request.signal.aborted) {
    return jsonRpcError(null, -32000, 'Request cancelled.', 499);
  }
  const rateLimit = await enforceRateLimit(request, env);
  if (!rateLimit.ok) {
    const unavailable = rateLimit.status === 503;
    return jsonRpcError(
      null,
      -32001,
      unavailable
        ? 'Hosted MCP rate limiting is unavailable.'
        : 'Daily hosted MCP request limit exceeded.',
      unavailable ? 503 : 429,
    );
  }
  return handleMcp(request);
}

export class RateLimiter {
  constructor(private readonly state: DurableObjectStateLike) {}

  async fetch() {
    const count = (await this.state.storage.get<number>('count')) ?? 0;
    if (count >= DAILY_REQUEST_LIMIT) {
      return new Response('Rate limit exceeded.', { status: 429 });
    }
    await this.state.storage.put('count', count + 1);
    if (count === 0) {
      await this.state.storage.setAlarm(Date.now() + 24 * 60 * 60 * 1000);
    }
    return new Response('Allowed.');
  }

  async alarm() {
    await this.state.storage.deleteAll();
  }
}

export default { fetch };
