# Tale UI hosted MCP

Restricted, read-only MCP Streamable HTTP worker for
`https://mcp.tale-ui.dev/mcp`.

The runtime bundles the canonical artifact registry and exposes only
`search_artifacts`, `get_artifact`, and `plan_ui`. Validation, mutation,
recovery, migrations, extension execution, and Figma access are intentionally
absent. The worker does not require secrets, persist request content, or log
prompts and results.

Production fails closed unless the `RATE_LIMITER` Durable Object binding and
`RATE_LIMIT_HMAC_KEY` secret are configured. The limiter stores only a daily
rotated HMAC bucket with a 24-hour expiry; raw network identifiers are never
persisted or exported. The default limit is 500 requests per network bucket
per day.

## Budgets

- request body: 16 KiB;
- search query: 256 characters and 20 results;
- artifact ID: 200 characters;
- planning prompt: 4,000 characters and 12 recommendations;
- response body: 64 KiB.

The worker returns registry version, immutable source revision, and source
links in every tool result. Cloudflare deployment and DNS changes require
separate operational approval.
