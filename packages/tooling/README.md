# @tale-ui/tooling

Internal-first Node tooling for Tale UI artifact discovery and future local
validation and safe project operations.

The package is ESM-only and requires Node 22 or newer.

The current slice exposes read-only manifest, artifact search, and artifact
lookup APIs plus the corresponding `tale` CLI commands. Validation and mutation
remain capability-gated.

```ts
import { getManifest, searchArtifacts } from '@tale-ui/tooling';

const manifest = getManifest();
const results = searchArtifacts({ query: 'table' });
```
