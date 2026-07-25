# Hosted documentation and MCP

Tale UI has one public documentation origin:
`https://tale-ui.github.io/tale-ui/`.

## Version routes

| Route                 | Contract                                                    |
| --------------------- | ----------------------------------------------------------- |
| `/docs/`              | Current v2 documentation                                    |
| `/docs/current/`      | Current-major alias                                         |
| `/docs/v2/`           | Explicit current major                                      |
| `/docs/v1/`           | Immutable public snapshot from `react-v1.3.56`              |
| `/docs/versions.json` | Version, provenance, registry, package, and content digests |
| `/docs/rollback.json` | Last-known-good static rollback target                      |
| `/llms.txt`           | Compact agent entry point                                   |

The v1 snapshot uses a public-path allowlist. Private experiments, build
outputs, dependencies, local analysis, and secrets are excluded. CI verifies
every retained file against the content-addressed manifest.

## Hosted MCP

The MCP Streamable HTTP endpoint is `https://mcp.tale-ui.dev/mcp`.
It bundles the public canonical artifact registry and exposes only:

- `search_artifacts`;
- `get_artifact`; and
- `plan_ui`.

Validation, materialization, project mutation, recovery, migrations,
extension execution, and Figma access are absent. Use `@tale-ui/tooling`
locally for those capabilities.

The hosted runtime accepts at most 16 KiB per request, 256 characters per
search, 20 search results, 4,000 characters per planning prompt, 12 plan
recommendations, and 64 KiB per response. Results include the registry
version, source revision, public source link, and active limits.

Request content is not persisted. The runtime requires no user credentials
and does not write prompts, results, network identifiers, or private
identifiers to application logs. A Durable Object limits each daily rotated
HMAC network bucket to 500 requests and deletes the bucket after 24 hours;
the raw network identifier is never stored. The runtime fails closed if the
limiter binding or HMAC secret is missing. Production deployment, credentials,
and DNS remain separately approved operational actions.
