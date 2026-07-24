# @tale-ui/tooling

Internal-first Node tooling for Tale UI artifact discovery, local validation,
and future safe project operations.

The package is ESM-only and requires Node 22 or newer.

The current slice exposes read-only manifest, artifact search, artifact lookup,
and local validation through the API, `tale` CLI, and `tale-mcp` server.
Mutation remains capability-gated.

```ts
import { getManifest, searchArtifacts } from '@tale-ui/tooling';

const manifest = getManifest();
const results = searchArtifacts({ query: 'table' });
```

```ts
import { validateCode } from '@tale-ui/tooling/validation';

const result = await validateCode({
  schemaVersion: '1.0.0',
  requestId: crypto.randomUUID(),
  root: process.cwd(),
  code: 'export const answer: number = 42;',
  virtualFile: 'src/generated.ts',
  timeoutMs: 30_000,
});
```

Validation uses the packaged TypeScript compiler API and virtual files. It does
not invoke package managers, create scratch files, or execute project code.

```bash
tale validate src/example.tsx --json
tale validate --code 'export const answer: number = 42' \
  --virtual-file src/example.ts --json
tale-mcp
```

The local MCP server registers `validate_code` only when the installed
capability manifest marks `code.validate` available for `local-mcp`.
