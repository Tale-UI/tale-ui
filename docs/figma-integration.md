# Figma and code parity

Tale UI generates a Variables-compatible interchange file from
`packages/tokens/tokens.json`. It also maps public component names, variant
values, import paths, source paths, lifecycle state, and design/code owners to
stable registry IDs.

Generated public contracts:

- `packages/tokens/figma/variables.json`;
- `registry/integrations/figma-public.json`;
- `registry/integrations/code-connect.json`; and
- `registry/integrations/figma-parity-public.json`.

The live Figma allowlist is intentionally empty. Live parity is therefore
reported as `unavailable`, not as a pass. Adding a file identifier requires a
reviewed repository change and read-only credentials; it does not require a
new mapping format.

Public reports cannot contain file keys, node IDs, URLs, screenshots, free
text, private names, credentials, or private token values. Authenticated
internal reports, when enabled, remain access-controlled workflow artifacts
for 30 days. Figma writes and library publication require separate approval.
