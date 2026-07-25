# @tale-ui/tooling

Public-beta Node tooling for Tale UI artifact discovery, local validation,
safe project operations, templates, and migrations.

The package is ESM-only and requires Node 22 or newer.

The package exposes manifest, artifact search, lookup, validation, project
initialization, template materialization, migrations, recovery, and extension
authorization through its supported API and CLI surfaces. The local MCP server
remains read-oriented apart from bounded virtual-code validation.

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
tale init --scripts --json
tale search table --json
tale template empty-state --add --json
tale migrate --list --json
tale validate src/example.tsx --json
tale validate --code 'export const answer: number = 42' \
  --virtual-file src/example.ts --json
tale doctor --json
tale-mcp
```

The local MCP server registers `validate_code` only when the installed
capability manifest marks `code.validate` available for `local-mcp`.

Version `0.1.x` is published independently under the `next` npm distribution
tag. Merging source does not publish the package; an explicit `tooling-v*` tag
or manual release workflow is required.
