import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetch } from './worker.js';

const testEnvironment = {
  RATE_LIMIT_HMAC_KEY: 'test-only-secret',
  RATE_LIMITER: {
    idFromName: (name: string) => name,
    get: () => ({ fetch: async () => new Response('Allowed.') }),
  },
};

function call(method: string, params?: Record<string, unknown>, id = 1) {
  return fetch(
    new Request('https://mcp.tale-ui.dev/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    }),
    testEnvironment,
  );
}

test('hosted MCP exposes only bounded retrieval and planning tools', async () => {
  const response = await call('tools/list');
  assert.equal(response.status, 200);
  const payload = (await response.json()) as {
    result: { tools: Array<{ name: string }> };
  };
  assert.deepEqual(
    payload.result.tools.map(({ name }) => name),
    ['search_artifacts', 'get_artifact', 'plan_ui'],
  );
  assert.ok(
    payload.result.tools.every(
      ({ name }) => !/valid|mutat|recover|migrat|extension|figma/i.test(name),
    ),
  );
});

test('tool responses correlate the registry and immutable source', async () => {
  const response = await call('tools/call', {
    name: 'get_artifact',
    arguments: { id: 'tale:component:button' },
  });
  const payload = (await response.json()) as {
    result: {
      structuredContent: {
        registryVersion: string;
        sourceRevision: string;
        source: string;
        data: { id: string; source: string };
      };
    };
  };
  assert.equal(payload.result.structuredContent.data.id, 'tale:component:button');
  assert.match(payload.result.structuredContent.sourceRevision, /^sha256:[a-f0-9]{64}$/);
  assert.match(payload.result.structuredContent.source, /registry\/artifacts\.json$/);
  assert.match(payload.result.structuredContent.data.source, /button/);
});

test('plan_ui is bounded and rejects oversized input', async () => {
  const planned = await call('tools/call', {
    name: 'plan_ui',
    arguments: { prompt: 'Build a settings form with save button and validation' },
  });
  assert.equal(planned.status, 200);
  const planPayload = (await planned.json()) as {
    result: { structuredContent: { data: { recommendations: unknown[] } } };
  };
  assert.ok(planPayload.result.structuredContent.data.recommendations.length <= 12);

  const rejected = await call('tools/call', {
    name: 'plan_ui',
    arguments: { prompt: 'x'.repeat(4001) },
  });
  assert.equal(rejected.status, 400);
});

test('planning responses do not echo request content', async () => {
  const secret = 'private-prompt-value-that-must-not-return';
  const response = await call('tools/call', {
    name: 'plan_ui',
    arguments: { prompt: `Build a table ${secret}` },
  });
  assert.doesNotMatch(await response.text(), new RegExp(secret));
});

test('hosted MCP survives a concurrent read-only load fixture', async () => {
  const responses = await Promise.all(
    Array.from({ length: 100 }, (_, index) =>
      call(
        'tools/call',
        { name: 'search_artifacts', arguments: { query: 'table', limit: 5 } },
        index,
      ),
    ),
  );
  assert.ok(responses.every(({ status }) => status === 200));
  assert.ok(responses.every(({ headers }) => headers.get('cache-control') === 'no-store'));
});

test('health is public and cancellation is explicit', async () => {
  const health = await fetch(new Request('https://mcp.tale-ui.dev/health'));
  assert.equal(health.status, 200);

  const controller = new AbortController();
  controller.abort();
  const cancelled = await fetch(
    new Request('https://mcp.tale-ui.dev/mcp', {
      method: 'POST',
      signal: controller.signal,
    }),
    testEnvironment,
  );
  assert.equal(cancelled.status, 499);
});

test('hosted calls fail closed when the rate limiter is absent', async () => {
  const response = await fetch(
    new Request('https://mcp.tale-ui.dev/mcp', {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    }),
  );
  assert.equal(response.status, 503);
});
