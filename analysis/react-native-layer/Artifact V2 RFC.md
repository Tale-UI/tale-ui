# Artifact V2 RFC

## Status

Draft; not approved for public Tooling, CLI, MCP, Studio, or hosted rollout.

## Compatibility invariant

Artifact v1 is byte- and behavior-compatible when no artifact version or
platform target is supplied. Native records never enter legacy results
implicitly.

## Proposed field-exact request

```ts
type ArtifactV2Request = {
  artifactVersion: 2;
  platform: 'react' | 'react-native';
  target?: 'ios' | 'android' | 'web';
  lifecycle?: 'stable' | 'experimental' | 'deprecated';
  cursor?: string;
  limit?: number;
};
```

## Proposed response requirements

- canonical artifact ID, digest, version, platform, target, lifecycle, owner,
  retirement authority, source provenance, packed-runtime provenance, and
  continuation cursor;
- explicit guidance kind (`implementation`, `native-alternative`, or
  `not-applicable`);
- archive retrieval that cannot collide with live IDs; and
- identical projection fixtures for Tooling, repository MCP, packed React MCP,
  Studio, and hosted MCP.

## Approval gates

The RFC cannot ship until canonical digest rules, pagination stability,
archive authority, installed-runtime attestation, and all cross-runtime
fixtures are independently reviewed and passing.
