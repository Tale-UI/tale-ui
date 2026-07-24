# Plan

## Objective

Deliver the complete P0–P3 roadmap in `analysis/gap-analysis-astryx/05-prioritized-roadmap.md` through incremental capability releases while preserving Tale UI’s registry-first, React Aria, CSS-first, MCP, golden-prompt, and A2UI strengths.

This plan defines contracts, accountable roles, package and runtime ownership, dependencies, reviewable work packages, verification, rollout, rollback, and measurable exit gates. It is not a commitment to deliver every workstream in one release and does not invent dates, staffing, budgets, vendors, credentials, or individual owners.

## Evidence Checked

### Guidance, roadmap, and review artifacts

- `CLAUDE.md`
- `packages/react/CLAUDE.md`
- `packages/tokens/CLAUDE.md`
- `README.md`
- `docs/managing-packages.md`
- `docs/workspace-structure.md`
- `docs/package-dependencies.md`
- `docs/design-philosophy.md`
- `docs/authoring-components.md`
- `docs/react-aria-deviations.md`
- `docs/upstream/react-aria-components.md`
- `analysis/gap-analysis-astryx/05-prioritized-roadmap.md`
- `.agentic-loop/runs/20260724T083741Z/request.md`
- `.agentic-loop/runs/20260724T083741Z/memory.md`
- `.agentic-loop/runs/20260724T083741Z/reviewer-02/round-02/plan.md`
- `.agentic-loop/runs/20260724T083741Z/reviewer-02/round-02/feedback.md`
- `.agentic-loop/runs/20260724T083741Z/reviewer-03/round-01/feedback.md`
- `/Users/admin/.agents/skills/agentic-plan-verify-loop/SKILL.md`

### Workspace, packaging, release, and hosting

- `package.json`
- `pnpm-workspace.yaml`
- `lerna.json`
- `tsconfig.json`
- `pnpm-lock.yaml`
- `packages/react/package.json`
- `packages/a2ui/package.json`
- `packages/charts/package.json`
- `packages/tokens/package.json`
- `packages/styles/package.json`
- `docs/package.json`
- `tools/build-package.mjs`
- `scripts/release/sync-package-versions.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/pages.yml`
- `.github/workflows/publish.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/scorecards.yml`
- `docs/next.config.ts`
- `docs/archive/`
- repository tags and release history, including `react-v1.3.*`

### Registries, validation, MCP, setup, recipes, and applications

- `registry/components.json`
- `registry/pitfalls.json`
- `registry/a2ui-catalog.json`
- `tools/generate-registry.js`
- `tools/generate-pitfalls-registry.js`
- `tools/generate-a2ui-catalog.js`
- `tools/generate-a2ui-catalog-docs.js`
- `tools/generate-consumer-snippet.js`
- `tools/generate-cursorrules.js`
- `tools/generate-eval-context.js`
- `tools/validate-generated.mjs`
- `tools/tsconfig.generated.json`
- `tools/validate-recipes.mjs`
- `tools/validate-golden-prompts.mjs`
- `tools/golden-prompts/index.json`
- `tools/mcp-core.mjs`
- `tools/mcp-server.mjs`
- `packages/react/bin/setup.mjs`
- `docs/consumer-claude-md-snippet.md`
- `.cursorrules`
- `llms.txt`
- `llms-full.txt`
- `packages/a2ui/src/catalog.ts`
- `packages/a2ui/src/types.ts`
- `packages/a2ui/src/validation/validate.ts`
- `packages/a2ui/src/renderer/`
- `packages/a2ui/src/agent/`
- `docs/recipes/`
- `apps/mcp-studio/`
- `apps/recipe-studio/`
- `apps/tooling-dashboard/`

### Components, foundations, and tests

- Table, Row, Column, HeaderNav, Sidebar, I18nProvider, CSP provider, text-editor, and key-value-pairs source, styles, docs, stories, and tests
- `packages/react/src/table/Table.styled.tsx`
- Checkbox, Radio, and Switch sources, docs, registry entries, and deprecation metadata
- existing package names, import paths, token aliases, changelogs, and deprecation evidence relevant to starter migrations
- `packages/tokens/tokens.json`
- `packages/tokens/tokens.schema.json`
- `packages/tokens/scripts/generate.mjs`
- `packages/tokens/scripts/test-generated.mjs`
- `packages/tokens/src/generated.ts`
- `packages/tokens/src/native.ts`
- `packages/styles/src/_primitives.css`
- `playground/vite-app/src/demos/ComponentAudit.tsx`
- `playground/storybook/.storybook/`
- `test/bundle-size/`
- `test/public-types/`
- `test/node-resolution/`
- `test/e2e/`
- `test/regressions/`
- `test/visual/`
- `docs/src/app/`

### Commands and confirmed observations

- Used `rg --files`, `rg`, `find`, `sed`, `nl`, `jq`, `wc`, `shasum`, `git diff --no-index`, `git tag`, `git log`, and `git status`.
- `tools/mcp-core.mjs` sets `IS_MONOREPO` from the presence of `validate-generated.mjs`. `validateCodeCore` fails outside the monorepo.
- `tools/mcp-server.mjs` registers `validate_code` only when `IS_MONOREPO` is true.
- `tools/build-package.mjs` copies `tools/mcp-server.mjs`, `tools/mcp-core.mjs`, registries, and public docs to non-minimal builds, but does not copy `tools/validate-generated.mjs` or an equivalent consumer validator.
- `tools/validate-generated.mjs` writes to a monorepo scratch directory and invokes `npx tsc` against `tools/tsconfig.generated.json`; it is not a safe installed-project runtime.
- `packages/react/package.json` publishes `tale-ui-setup` and `tale-ui-mcp`; no `tale` binary or standalone tooling package exists.
- `lerna.json` uses independent versioning, while `scripts/release/sync-package-versions.mjs` synchronizes six core public packages.
- The component registry contains 116 public records: 112 stable, one experimental, and three deprecated. The A2UI catalog contains 149 records including compound parts.
- `tools/generate-a2ui-catalog.js` emits wall-clock-derived `generatedAt` and excludes it from drift comparison, so output is not byte-deterministic.
- Table is a thin React Aria namespace wrapper without a plugin controller.
- The roadmap’s Table inventory contains exactly ten candidates.
- The roadmap’s AppShell inventory contains eight distinct candidates; `sidebar` is duplicated typographically in the source list and is treated as one candidate.
- The roadmap’s Chat inventory contains nine candidates.
- The roadmap permits five extension contribution classes: components with structured docs, recipes/templates, validations/pitfalls, codemods, and A2UI types.
- The roadmap requires starter migrations for the package rename, deprecated Checkbox/Radio/Switch APIs, token/name migrations, and known import-path corrections.
- `docs/next.config.ts` uses static export. Pages copies `docs/out/` into `.pages/docs/`; repository-root `llms.txt` files are not deployed, and static Pages cannot host MCP.
- No analytics collector, ingestion service, aggregation workflow, metrics store, or metrics-dashboard deployment exists.
- Native token output exists, but conformance, high-contrast, example, and exception reports are incomplete.
- The bundle-size configuration retains a command for a removed runner dependency.
- `pnpm test:tokens` passed during prior inspection. No clean terminal result was captured for the full `pnpm generate-docs:check`.
- No product code or finalized plan file was modified.

## Current Understanding

### Executive delivery strategy

The unified artifact registry is the delivery spine. The CLI/API, local and hosted MCP, validator, templates, compositions, migrations, versioned docs, metrics, Figma mappings, extensions, and conformance reports consume common identifiers, lifecycle state, capability metadata, and package/registry version correlation.

Delivery uses capability gates:

1. **Phase 0:** approve contracts, inventories, source provenance, safety/privacy models, package/runtime boundaries, accountable roles, and non-fabricated baselines.
2. **P0:** deliver the registry, packaged tooling and validation, safe materialization, ten templates, and Table research/prototypes.
3. **P1:** deliver migrations, versioned docs and restricted hosted MCP, i18n operations, metrics, AppShell evidence, and the ranked Table plugin set.
4. **P2:** deliver motion/elevation, Chat, selected content primitives, governance, accessibility, and maintained performance budgets.
5. **P3:** deliver evidence-gated Figma, extension, and cross-platform token-conformance integrations.
6. **Cumulative release gate:** reconcile every traceability criterion and success measure, packaging path, compatibility record, privacy boundary, recovery path, and non-goal.

Discovery, RFCs, and private prototypes may overlap safely. Public API promotion requires its RFC, provenance, security, privacy, accessibility, compatibility, packaging, migration, observability, and rollback gates.

### Evidence-backed current-state architecture

- Component, pitfall, and A2UI registries are separate generated contracts.
- Existing generators, recipes, goldens, docs, and eval context provide canonical source material for a unified index.
- MCP business logic is shared between adapters but returns text-oriented `{text, isError?}` values rather than stable typed envelopes.
- Installed MCP cannot validate consumer code because its validator is monorepo-only and is not packaged.
- `@tale-ui/react` owns setup and MCP binaries and receives repository-root runtime assets through special build logic.
- Setup manages only `CLAUDE.md` and `.mcp.json` and lacks dry-run, root confinement, durable retry identity, recovery, deterministic reports, and malformed-config preservation.
- Recipes are validated Markdown examples, not versioned installable artifacts.
- Migration manifests and transform infrastructure do not exist.
- `I18nProvider` delegates locale/direction to React Aria; Tale-owned catalogs, pseudo-locales, overrides, string context, and translation operations do not exist.
- Static docs hosting cannot provide a runtime MCP endpoint or currently deploy root guidance.
- `docs/archive/` is research material, not an authoritative retained previous-major documentation tree.
- Metrics and maintained performance enforcement are absent.
- Lifecycle states exist in generated metadata, but ownership, promotion, exception, and retirement enforcement are incomplete.
- There is no extension trust registry, Figma mapping contract, AppShell family, Chat family, or native component library.

### Preserved constraints and non-goals

- `packages/tokens/tokens.json` remains the canonical platform-neutral source.
- React behavior remains React Aria-based; styling remains build-time and CSS-first.
- Existing registries remain canonical for their payloads; the unified registry references instead of duplicating them.
- Compound parts do not inflate component counts.
- Templates are versioned materialized copies, not a swizzling-first system.
- Charts are not destabilized to increase coverage.
- Project telemetry remains explicitly opt-in, minimal, documented, removable, and separate from public aggregate signals.
- Hosted MCP exposes retrieval and `plan_ui`; hosted validation requires a separately approved secure-sandbox threat model.
- Generic Markdown rendering remains deferred until sanitization, link policy, highlighting, CSP, and dependency approval.
- Native work covers tokens, examples, and conformance, not a component library.
- Third-party artifacts remain namespaced, provenance-visible, and explicitly trusted before executable code loads.
- Private Figma data cannot enter public docs, releases, errors, logs, or anonymous telemetry.
- The actual evidence-ranked Table top five must ship unless the user approves a documented exception.
- AppShell and Chat candidate enumeration is evaluation scope, not automatic commitment to public APIs.
- All four roadmap starter-migration groups are mandatory.

## Assumptions

- The roadmap’s P0–P3 order, dependency map, acceptance criteria, recommended first six issues, constraints, and success measures are binding.
- Package and app names remain provisional until Phase 0. Working paths are `packages/tooling/`, `apps/hosted-mcp/`, `apps/metrics-service/`, and `apps/metrics-dashboard/`.
- Schema versions are independent. Records correlate schema, producer, package, registry, capability, and release-channel versions.
- Phase 0 selects the authoritative previous-major source and public hosting origin before historical routes are committed.
- Unknown baselines are measured before thresholds are approved.
- Exact source/target versions for starter migrations are derived from release evidence before manifests merge.
- Canonical generated artifacts omit wall-clock metadata.
- Idempotency keys are caller-generated opaque values; raw keys and absolute project paths are never persisted or logged.
- No unresolved preflight decision authorizes irreversible implementation.

## Proposed Changes

### Target architecture

```text
Canonical components/docs/recipes/A2UI/tokens/lifecycle sources
                              |
           deterministic inventories, schemas, generators
                              |
 components / hooks / recipes / templates / docs / A2UI
 foundations / validations / codemods / compositions / extensions / reports
                              |
                  unified artifact registry
                              |
                 @tale-ui/tooling package
      typed API + local validator + CLI + local MCP adapter
          |               |                 |
 safe operations     project types     installed assets
          |
 templates / compose / init / codemods / recovery

Static docs assembly -------------------------- public Pages artifact
Hosted retrieval + plan_ui ------------------- independent MCP runtime
Public and opt-in metrics -------------------- aggregate dashboard
Figma/extensions/native ---------------------- evidence-gated integrations
```

### Unified artifact contract

Add:

- `schemas/artifact.schema.json`
- `schemas/capability.schema.json`
- `packages/tooling/src/contracts/artifact.ts`
- `tools/generate-artifacts.mjs`
- `registry/artifacts.json`
- `registry/capabilities.json`
- `registry/sources/`

Stable identifier: `<namespace>:<kind>:<slug>`.

First-party namespace is `tale`. Third-party namespaces use normalized npm package names or approved reverse-domain identifiers. Initial kinds are:

- `component`
- `hook`
- `recipe`
- `template`
- `doc`
- `a2ui-type`
- `foundation`
- `pitfall`
- `validation`
- `codemod`
- `composition`
- `extension`

IDs are immutable. Renames use aliases plus `deprecatedIn`, `replacementId`, and migration metadata.

Top-level registry fields include `schemaVersion`, `registryVersion`, `releaseChannel`, `generatedFrom`, `sourceRevision`, `digest`, `packageVersions`, `capabilityManifestId`, and `artifacts`.

Records include ID, namespace, kind, lifecycle, package/version correlation, aliases, replacements, relations, retrieval pointers, capabilities, platforms, locales, provenance, integrity, trust, permissions, and kind-specific metadata.

Generators reject duplicates, missing sources, dangling relations, incompatible replacements, inconsistent versions, unsupported schemas, invalid namespaces, and invalid trust metadata. CI verifies canonical JSON, source equality, schema validity, and two-run byte identity.

### CLI/API and error contract

The approved tooling package exports its package root, `/api`, `/contracts`, `/registry`, and `/validation`; provides a `tale` binary and local MCP adapter; and retains compatibility shims for the React MCP binary.

JSON mode emits exactly one schema-validated envelope to stdout. Progress uses stderr.

Success contains `ok`, command, request ID, correlated versions, negotiated capabilities, data, warnings, and bounded metadata. Failure contains a stable code, sanitized message, content-free details, retryability, and documentation link.

| Exit | Stable error codes                                                                                                                                                                                                                                                                  |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2`  | `TALE_INVALID_ARGUMENT`, `TALE_UNSUPPORTED_COMMAND`                                                                                                                                                                                                                                 |
| `3`  | `TALE_UNSUPPORTED_CAPABILITY`, `TALE_UNSUPPORTED_CONTRACT_VERSION`, `TALE_UNSUPPORTED_REGISTRY_VERSION`, `TALE_VERSION_RANGE_MISMATCH`, `TALE_SCHEMA_MISMATCH`, `TALE_EXTENSION_UNSUPPORTED`                                                                                        |
| `4`  | `TALE_ARTIFACT_NOT_FOUND`, `TALE_OPERATION_NOT_FOUND`, `TALE_MIGRATION_UNAVAILABLE`                                                                                                                                                                                                 |
| `5`  | `TALE_VALIDATION_FAILED`, `TALE_VALIDATION_TIMEOUT`, `TALE_VALIDATION_CANCELLED`                                                                                                                                                                                                    |
| `6`  | `TALE_OUTSIDE_PROJECT_ROOT`, `TALE_UNSAFE_PATH`, `TALE_SYMLINK_REFUSED`, `TALE_OVERWRITE_REFUSED`, `TALE_CHANGED_SINCE_PLAN`, `TALE_IDEMPOTENCY_CONFLICT`, `TALE_TEMPLATE_CONFLICT`, `TALE_EXTENSION_UNTRUSTED`, `TALE_RECOVERY_PRECONDITION_FAILED`, `TALE_UNVERIFIABLE_POSTIMAGE` |
| `7`  | `TALE_CONCURRENT_MUTATION`, `TALE_OPERATION_IN_PROGRESS`, `TALE_RECOVERY_IN_PROGRESS`, `TALE_RETRYABLE_EXTERNAL_ERROR`                                                                                                                                                              |
| `8`  | `TALE_CORRUPT_REGISTRY`, `TALE_CORRUPT_OPERATION_STATE`, `TALE_MALFORMED_PROJECT_CONFIG`, `TALE_INVALID_TSCONFIG`                                                                                                                                                                   |
| `1`  | `TALE_INTERNAL_ERROR`                                                                                                                                                                                                                                                               |

Error constants are append-only within a contract major. Deprecation requires `deprecatedIn` and `replacementCode`; meanings cannot change within that major.

### Command/API surface

| Command/API                        | Contract                                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `init` / `initProject`             | Root, integrations/scripts, dry-run, request ID, idempotency key, expected plan digest |
| `manifest` / `getManifest`         | Requested contract range; versions, compatibility, capabilities                        |
| `search` / `searchArtifacts`       | Query, kinds, statuses, cursor/range                                                   |
| `component`, `recipe`              | ID/alias; lifecycle, replacements, retrieval pointers                                  |
| `plan` / `planUi`                  | Task, bounded context, capability range, optional composition                          |
| `validate` / `validateFile`        | Root-relative file, rules, timeout, cancellation, content-free diagnostics             |
| `doctor`                           | Strictly read-only project and recovery checks                                         |
| `recover` / `recoverOperation`     | Recovery reference, journal digest, action, recovery identity                          |
| `template --list/--skeleton/--add` | Discovery and safe materialization                                                     |
| `generate` / `generateArtifact`    | Artifact/version and mutation identities                                               |
| `compose` / `composeUi`            | Validated composition and mutation identities                                          |
| `upgrade --list/--dry-run/apply`   | Version range, backup policy, plan digest, mutation identities                         |

### Local consumer validation runtime

Replace the monorepo-only execution path with a packaged, side-effect-free validation service:

- `packages/tooling/src/validation/index.ts`: public `validateFile` and `validateCode` API.
- `packages/tooling/src/validation/registry.ts`: deterministic import, artifact-kind, lifecycle, replacement, and registry rules.
- `packages/tooling/src/validation/typescript.ts`: TypeScript compiler-API integration.
- `packages/tooling/src/validation/project.ts`: project-root, `tsconfig`, dependency, and module-resolution discovery.
- `packages/tooling/src/validation/worker.ts`: bounded worker execution, cancellation, and timeout termination.
- `packages/tooling/src/validation/diagnostics.ts`: stable diagnostic normalization and redaction.
- `schemas/validation-request.schema.json`
- `schemas/validation-result.schema.json`
- packed registry, capability, validation-rule, and compatibility assets.

Validation rules:

1. Resolve a canonical project root before reading the target.
2. Accept only root-relative files or bounded inline code associated with that root.
3. Reject traversal, escaping symlinks, unsupported encodings, oversized inputs, and configuration paths outside the root or approved installed-package locations.
4. Parse the project’s selected `tsconfig.json` with the packaged TypeScript compiler API. Do not invoke `npx`, package-manager commands, or arbitrary subprocesses.
5. Resolve `@tale-ui/*`, React, JSX, and consumer dependencies from the target project using TypeScript’s module resolver and installed package exports/types.
6. Use approved deterministic defaults only when no config exists and report that fallback explicitly; clean Vite and Next fixtures must exercise their real configs.
7. Do not write scratch files in the project. Inline code uses an in-memory virtual source; file validation reads without mutation.
8. Run registry and TypeScript validation through one orchestration function so CLI `validate`, API `validateFile`, and local MCP `validate_code` receive identical normalized results.
9. Enforce input, diagnostic-count, memory, and time limits. `AbortSignal` cancellation and timeout terminate the worker and return stable sanitized errors.
10. Diagnostics contain root-relative paths, line/column, stable rule or TypeScript codes, bounded messages, registry/package versions, and no source excerpts, absolute paths, environment values, or dependency inventories.
11. The local MCP registers `validate_code` in installed mode when the capability manifest confirms validator assets and compiler compatibility. Hosted MCP must continue to omit it.
12. The tooling package declares the selected TypeScript runtime dependency and Node range, includes validator JS/types/schemas/rule assets in `files` and exports, and proves installed loading without monorepo paths.
13. The old `tools/validate-generated.mjs` becomes a thin repository adapter over the packaged validator or is retired only after golden, CLI, and CI parity is demonstrated.

Packed Vite and Next fixtures must each cover valid and invalid materialized templates, invalid imports, invalid props, compound/simple misuse, deprecated APIs, corrupt registries, missing dependencies, malformed configs, cancellation, timeout, redaction, and identical CLI/API/local-MCP results.

### Durable mutation and recovery contract

`init`, template add, generate, compose, and upgrade use:

- a payload-independent idempotency slot derived from canonical root, operation, and privacy-safe key digest;
- a separate payload digest covering versions, options, plan digest, and planned postimages;
- one immutable operation ID and journal;
- lock order: idempotency slot → journal → project mutation;
- states `reserved`, `journal-linked`, `in-progress`, `completed`, `rolled-back`, `manual-intervention`, and `tombstoned`;
- same-key/different-payload rejection before mutation;
- matching retry resume, terminal replay, or in-progress response;
- non-expiring incomplete operations and privacy-safe completed tombstones.

Recovery uses a distinct recovery slot and payload digest covering the original operation, journal state, action, tooling versions, and pre-recovery digest. Resume and rollback are mutually guarded, idempotent, journaled, and tested under interruption and concurrent opposite actions.

All reports contain relative paths and digests, never raw keys, absolute roots, prompts, environment values, or file contents.

### Init, template, composition, and migration contracts

`tale init` manages one root-scoped transaction:

| Output                          | Merge policy                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                     | One marker-delimited Tale block; preserve unmanaged content; changed managed content conflicts              |
| `.cursorrules`                  | Same managed-block rules                                                                                    |
| `.mcp.json`                     | Merge only `mcpServers["tale-ui"]`; malformed/non-object/conflicting input fails without overwrite          |
| optional `package.json` scripts | Merge approved keys only; malformed or occupied non-equivalent keys conflict; no implicit lifecycle scripts |

Each `templates/<slug>/` contains `template.json`, `source/`, `skeleton/`, preview metadata, dependency and compatibility ranges, golden reference, appearance/RTL flags, digests, provenance, and license data.

Composition manifests contain schema and producer versions, composition ID/digest, request ID, ordered artifact IDs and versions, relative targets, dependencies, conflicts, capabilities, validation rules, and compatibility.

Each `migrations/<range-or-id>/` contains a manifest, JS/TS transform, optional CSS/config transforms, fixtures, and migration/rollback documentation. Manifests define ordering, supported versions, dependencies, affected artifacts, deprecations/replacements, parsers, sensitive/generated-file policy, reversibility, backup policy, idempotency, and checksums.

Mandatory starter groups are:

1. package rename;
2. deprecated Checkbox/Radio/Switch APIs;
3. token/name migrations; and
4. known import-path corrections.

Phase 0 derives exact records and ranges from release tags, changelogs, registries, exports, package artifacts, and token history. Guessed ranges cannot merge.

Dry runs emit a schema-validated ordered machine report and, only when explicitly requested, a permission-restricted local deterministic unified diff. Every selected file has a complete planned postimage digest and size even when display is omitted. Apply revalidates the full input fingerprint and plan digest, verifies staged outputs, commits atomically where supported, and rereads every committed output.

All mutating operations enforce root confinement, traversal and symlink refusal, overwrite refusal, compare-before-write, same-filesystem staging, recovery, deterministic reporting, concurrency control, and sanitized errors.

### Table inventory and ranking contract

The immutable initial inventory is:

1. selection;
2. sorting;
3. pagination;
4. filtering;
5. column visibility/settings;
6. column resize;
7. sticky columns;
8. row expansion;
9. grouped/tree rows; and
10. virtualization.

Add `analysis/table-plugins/ranking.json` and a schema requiring one record per candidate with demand evidence, React Aria compatibility, accessibility risks, client/server state, SSR/hydration, controlled/uncontrolled behavior, 1k/10k performance implications, implementation/migration/maintenance cost, disposition, rank, and evidence digest.

A deterministic set-equality check rejects missing, duplicate, substituted, or extra candidates. Selection and sorting remain mandatory prototypes but receive no automatic ranking advantage.

### AppShell evaluation contract

The RFC inventory contains exactly these eight distinct candidates:

1. root;
2. header;
3. sidebar;
4. main;
5. secondary panel;
6. mobile navigation;
7. skip link; and
8. resizable-region adapter.

`analysis/app-shell/candidate-dispositions.json` records an evidence-backed `approve`, `defer`, or `reject` disposition for every candidate, with repeated-template evidence, accessibility/state/SSR implications, ownership boundary, rationale, and evidence digest. Set equality is enforced.

No public family is committed until the first template set demonstrates repeated structure under the Phase 0-approved threshold. An approved AppShell must not own routing, data loading, authentication, or application state.

### Chat evaluation contract

The RFC inventory contains exactly:

1. `ChatLayout`;
2. `MessageList`;
3. `Message`;
4. `MessageBubble`;
5. `MessageMetadata`;
6. `SystemMessage`;
7. `Composer`;
8. `ToolCall`; and
9. streaming-text utility.

`analysis/chat/candidate-dispositions.json` records an `approve`, `defer`, or `reject` disposition for every candidate, with ordinary-data API, accessibility, streaming/state, localization, security, SSR, performance, ownership, and migration evidence. Set equality is enforced.

Enumeration does not commit each candidate to a public API. Stable promotion follows the RFC and evidence gate. Mobile and artifact-panel templates remain required outcomes.

### Async and state contracts

- **Table:** scoped controller; stable table/row/column IDs; controlled/default state; request IDs and query revisions; `AbortSignal`; stale rejection; SSR/hydration; virtualization; server sorting/filtering/pagination.
- **Chat:** stream/request/message/tool-state IDs; ordered chunks; duplicate/stale rejection; cancellation; terminal states; batching; live-region policy; SSR; plain-text default; no raw HTML; separate A2UI adapter.
- **AppShell:** instance and revision IDs; parent-owned controlled state; deterministic SSR defaults; cleaned media/persistence subscriptions; stale-instance rejection.
- **Hosted MCP:** request IDs, cancellation, timeouts, bounded results, correlated source/version data, version-keyed caches, rate limits, and no validation/mutation handlers.
- **Metrics:** atomic unique-event acceptance before aggregation; deterministic duplicate, retry, out-of-order, quarantine, and partial-failure behavior.
- **Validation:** worker-scoped request IDs, cancellation, timeout, bounded diagnostics, immutable inputs, and stale-result rejection by callers.

### Extension contribution and trust contract

The extension contract preserves all five roadmap classes:

| Contribution class             | Artifact kinds          | Loading boundary                                                                                                                                    |
| ------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components and structured docs | `component`, `doc`      | Metadata/docs may be discovered without execution; component runtime requires explicit package installation and normal application imports          |
| Recipes and templates          | `recipe`, `template`    | Declarative retrieval is allowed; materialization uses normal safe-operation controls                                                               |
| Validations and pitfalls       | `validation`, `pitfall` | Declarative rules/pitfalls may load after schema/integrity checks; executable validators require explicit local installation, permission, and trust |
| Codemods                       | `codemod`               | Discovery is metadata-only; execution requires explicit local installation, trust, version compatibility, and operation/recovery controls           |
| A2UI types                     | `a2ui-type`             | Schema/catalog discovery is allowed; render adapters or executable mappings require explicit local trust and capability negotiation                 |

`validation` is a first-class artifact kind. Its schema includes `ruleId`, schema/version range, applicable artifact/file kinds, severity, deterministic input/output schema, execution mode (`declarative` or `executable`), required capabilities, permissions, timeout, provenance, integrity, and replacement metadata.

Extension manifests define namespace, package/version, publisher, provenance, integrity/signature policy, license, contribution classes, contract ranges, capabilities, permissions, trust state, source links, and revocation metadata.

Discovery never executes code. Hosted services expose metadata and retrieval only. Representative fixtures cover every contribution class and subtype, mixed first/third-party results, namespace collision, corrupt schema, unsupported version, missing integrity, untrusted executable validation/codemod, revoked publisher, duplicate records, and trusted local loading.

### Metrics, documentation, Figma, and native contracts

Metrics use versioned event, aggregate, ingestion-result, dashboard, definition, provenance, coverage, and freshness schemas. Missing data is `unavailable` or `partial`, never zero. Project events require explicit opt-in and an approved authenticated data plane.

Historical docs use `docs/versions/manifest.json`, an approved release source, isolated import, public allowlists, immutable content-addressed snapshots, asset digests, package/registry correlation, and static-route validation. `docs/archive/` is ineligible.

Figma records are classified public/internal/private before normalization or caching. Public reports contain only approved public records and non-reversible aggregates. Private identifiers, names, URLs, token values, screenshots, and free text are excluded.

Native expansion provides deterministic token parity, examples, appearance/high-contrast guidance, and exception evidence only.

### Runtime asset ownership

| Runtime/asset               | Canonical source                                                                          | Pack/deploy path                                     | Required proof                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| Unified/existing registries | `registry/*.json`                                                                         | tooling registry assets and React compatibility shim | Pack list, installed loader, digest/version cache key           |
| Local validator             | `packages/tooling/src/validation/`, validation schemas/rules, selected TypeScript runtime | tooling JS/types/exports/assets                      | Packed Vite/Next valid-invalid parity outside monorepo          |
| Current docs/recipes        | approved public allowlist                                                                 | tooling docs assets                                  | Private/archive exclusion                                       |
| Historical docs             | approved release source and manifest                                                      | immutable versioned Pages tree                       | Provenance, links, assets, regeneration isolation               |
| Init guidance               | generated guidance/manifests                                                              | tooling init assets                                  | Schema, digest, clean-project merge tests                       |
| Templates/compositions      | `templates/`, schemas                                                                     | tooling immutable assets                             | Packed materialization and validation                           |
| Migrations                  | `migrations/`                                                                             | compiled tooling assets                              | Loader, exact starter inventory, postimage fidelity             |
| CLI/local MCP               | tooling source and bins                                                                   | tooling build                                        | Executable, Node matrix, stdio handshake, validation capability |
| Hosted MCP                  | hosted app artifact                                                                       | independent deployment                               | Build/start/readiness, capability absence assertions            |
| Metrics                     | definitions, collectors, snapshots                                                        | workflow and Pages/service artifacts                 | Coverage, freshness, dedupe, rollback                           |
| Extensions                  | manifests and virtual registries                                                          | metadata caches; trusted local package resolution    | Per-class discovery, integrity, trust, revocation               |
| Figma/conformance reports   | classified/generated records                                                              | authenticated or public-safe release artifacts       | Schema, provenance, disclosure/parity                           |

Every public runtime enters `files`, exports, binaries, build/copy logic, version policy, publish ordering, provenance, npm-pack checks, installed loading, and version-keyed cache invalidation. The package-boundary ADR must pass before public tooling package metadata or binaries merge.

## Scope-Preservation And Criterion Traceability Matrix

Identifiers in this table are canonical for this plan. `Rnn.m` identifies a roadmap workstream criterion; `SMnn` identifies one source success measure. `registry/roadmap-traceability.json`, validated by `schemas/roadmap-traceability.schema.json`, must reproduce these identifiers, text, deliverables, checks, evidence, owner roles, and release gates exactly.

| ID    | Exact requirement                                                                                                             | Phase and deliverable   | Automated verification                        | Manual evidence and owner                            | Release gate |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------- | ---------------------------------------------------- | ------------ |
| R01.1 | Every public component, recipe, A2UI type, and foundation topic is indexed                                                    | P0-A registry           | source-set equality                           | Design Systems/Developer Experience inventory review | P0-A         |
| R01.2 | Search returns mixed kinds with stable IDs                                                                                    | P0-A search/API         | mixed-query contract tests                    | Developer Experience API review                      | P0-A         |
| R01.3 | Deprecated entries retain replacements                                                                                        | P0-A lifecycle metadata | relation/schema checks                        | Governance review                                    | P0-A         |
| R01.4 | Registry is deterministic and versioned                                                                                       | P0-A generator          | two-run byte identity/version tests           | Release Engineering review                           | P0-A         |
| R02.1 | Typed envelopes, append-only errors, capabilities, shared pure functions, and correlated versions                             | P0-B tooling            | schema/parity/version tests                   | Developer Experience review                          | P0-B         |
| R02.2 | `init` idempotently manages AGENTS, cursorrules, MCP, and optional scripts                                                    | P0-B operations         | mutation/replay fixtures                      | Security/Release Engineering recovery review         | P0-B         |
| R02.3 | Clean Vite/Next projects install, initialize, search, plan, generate, and validate without the monorepo                       | P0-B validator/tooling  | packed end-to-end fixtures                    | Developer Experience acceptance                      | P0-B         |
| R02.4 | Manifest drift and JSON schemas are CI-gated                                                                                  | P0-B CI                 | drift/schema jobs                             | Release Engineering review                           | P0-B         |
| R02.5 | Agent cold-start discovery is measured before/after init                                                                      | P0-B benchmark          | reproducible benchmark artifact               | Developer Experience evaluation                      | P0-B         |
| R03.1 | Ten named templates have metadata, source, skeleton, dependencies, preview, golden, and version                               | P0-C templates          | exact inventory/schema/pack tests             | Design Systems review                                | P0-C         |
| R03.2 | Template list, skeleton, and add commands work                                                                                | P0-C tooling            | command/API tests                             | Developer Experience review                          | P0-C         |
| R03.3 | Add refuses destructive overwrites and reports files                                                                          | P0-C materializer       | safety/recovery fixtures                      | Security review                                      | P0-C         |
| R03.4 | Materialized code passes installed validation and TypeScript                                                                  | P0-C validator          | packed Vite/Next valid-output tests           | Developer Experience review                          | P0-C         |
| R03.5 | Templates render in light and dark                                                                                            | P0-C previews           | visual snapshots                              | Design Systems/Accessibility QA                      | P0-C         |
| R04.1 | All ten Table candidates are assessed and plugins share state                                                                 | P0-D/P1-F               | candidate equality/controller tests           | Design Systems review                                | P0-D/P1-F    |
| R04.2 | Keyboard/screen-reader behavior remains React Aria-compatible                                                                 | P1-F                    | interaction/a11y tests                        | Accessibility QA                                     | P1-F         |
| R04.3 | Server sorting/filtering/pagination are first-class                                                                           | P1-F controller         | request/stale/cancel tests                    | Developer Experience review                          | P1-F         |
| R04.4 | Controlled/uncontrolled forms follow Tale conventions                                                                         | P1-F                    | state/SSR tests                               | Design Systems review                                | P1-F         |
| R04.5 | 1k/10k benchmarks and current-API migration exist                                                                             | P0-D/P1-F               | benchmarks/migration fixtures                 | Performance/Release Engineering review               | P1-F         |
| R05.1 | Ordered version manifests cover JS/TS, CSS, and project config                                                                | P1-A migrations         | manifest/loader/transform tests               | Developer Experience review                          | P1-A         |
| R05.2 | Dry-run diff/report, idempotency, fixtures, and deprecation links exist                                                       | P1-A operations         | postimage/replay/relation tests               | Release Engineering review                           | P1-A         |
| R05.3 | All four prescribed starter groups ship with verified ranges                                                                  | P1-A migrations         | exact inventory/per-group compatibility tests | Developer Experience/Release Engineering review      | P1-A         |
| R06.1 | Current and one previous major are hosted                                                                                     | P1-B docs               | provenance/route tests                        | Docs Platform review                                 | P1-B         |
| R06.2 | Root `llms.txt` points to CLI and hosted MCP                                                                                  | P1-B assembly           | deployed-route/content tests                  | Docs Platform review                                 | P1-B         |
| R06.3 | Hosted MCP exposes retrieval plus `plan_ui`, not validation                                                                   | P1-B runtime            | capability/absence/load tests                 | Security review                                      | P1-B         |
| R06.4 | Responses include registry version/source and budgets are documented                                                          | P1-B contracts          | response/budget tests                         | Developer Experience review                          | P1-B         |
| R07.1 | Tale-owned strings are inventoried with keys and English catalog                                                              | P1-C i18n               | inventory/schema tests                        | Localization review                                  | P1-C         |
| R07.2 | Pseudo-locale, RTL, overrides, contribution workflow, context, and screenshots exist                                          | P1-C operations         | fallback/RTL/SSR tests                        | Localization/Accessibility QA                        | P1-C         |
| R07.3 | Application-owned copy remains outside Tale catalogs                                                                          | P1-C boundary           | inventory allowlist tests                     | Localization review                                  | P1-C         |
| R08.1 | Dashboard covers downloads/version, docs/search, errors, templates, codemods, issues, health, and cadence/lag where evidenced | P1-D metrics            | coverage/freshness schemas                    | Product Analytics review                             | P1-D         |
| R08.2 | Project telemetry is opt-in, minimal, documented, removable, and separate                                                     | P1-D privacy            | capability/consent/absence tests              | Privacy/Security review                              | P1-D         |
| R09.1 | All eight AppShell candidates receive evidence-backed dispositions after template evidence                                    | P1-E RFC                | exact inventory/disposition tests             | Design Systems review                                | P1-E         |
| R09.2 | Approved AppShell excludes routing, data loading, auth, and app-state ownership                                               | P1-E contract           | API/state boundary tests                      | Architecture/Accessibility review                    | P1-E         |
| R10.1 | Semantic motion roles/tokens, reduced-motion mapping, and elevation hierarchy exist                                           | P2-A foundations        | token/drift/raw-value tests                   | Design Systems/Accessibility review                  | P2-A         |
| R10.2 | Examples and enter/exit/state Storybook matrix exist                                                                          | P2-A stories            | coverage/visual tests                         | Design Systems QA                                    | P2-A         |
| R11.1 | All nine Chat candidates receive RFC dispositions and approved APIs use ordinary app data                                     | P2-B RFC/family         | inventory/schema/API tests                    | Design Systems review                                | P2-B         |
| R11.2 | Keyboard, live region, streaming, reduced motion, and long content are specified                                              | P2-B family             | interaction/stream tests                      | Accessibility QA                                     | P2-B         |
| R11.3 | HTML/Markdown security boundaries and four tool states are explicit                                                           | P2-B security           | sanitization/CSP/state tests                  | Security review                                      | P2-B         |
| R11.4 | Mobile and artifact-panel templates exist                                                                                     | P2-B templates          | pack/materialize/validate tests               | Design Systems review                                | P2-B         |
| R12.1 | Kbd, Timestamp, Blockquote, Citation, CodeBlock, and MetadataList receive dispositions                                        | P2-C rubric             | exact inventory/disposition tests             | Design Systems/Accessibility/Security review         | P2-C         |
| R12.2 | Markdown remains deferred until sanitization, link, highlighting, and CSP approval                                            | P2-C boundary           | absence/capability tests                      | Security review                                      | P2-C         |
| R13.1 | Lifecycle definitions, promotion/deprecation gates, ownership, proposal, rubric, review, and exception policies exist         | Phase 0/P2-D governance | schema/coverage/expiry checks                 | Governance review                                    | P2-D         |
| R14.1 | Budgets cover ESM, minimal app JS, CSS, SSR/hydration, Table, charts, and A2UI                                                | P2-E performance        | maintained benchmark runner                   | Performance review                                   | P2-E         |
| R14.2 | CI trends results and blocks only understood regressions                                                                      | P2-E workflow           | baseline/trend/exception tests                | Performance/Release Engineering review               | P2-E         |
| R15.1 | Tokens generate Figma variables and components/variants map to registry IDs                                                   | P3-A integration        | mapping/parity tests                          | Design Tooling review                                | P3-A         |
| R15.2 | Code connection, parity reporting, and design/code ownership exist                                                            | P3-A reports            | correlation/disclosure tests                  | Design Systems/Privacy review                        | P3-A         |
| R16.1 | All five extension contribution classes are supported and namespaced                                                          | P3-B extensions         | exact class/kind fixture matrix               | Developer Experience review                          | P3-B         |
| R16.2 | Third parties remain provenance-visible and explicitly trusted before execution                                               | P3-B trust              | integrity/revocation/execution tests          | Security/Governance review                           | P3-B         |
| R17.1 | RN examples, token parity, platform exceptions, and dark/high-contrast guidance exist                                         | P3-C conformance        | deterministic report/example build            | Mobile Platform/Accessibility review                 | P3-C         |
| R17.2 | No native component library is introduced                                                                                     | P3-C boundary           | package/capability absence test               | Governance review                                    | P3-C         |
| SM01  | Clean project completes `init → plan → template or compose → validate`                                                        | P0-B/P0-C               | packed Vite/Next end-to-end tests             | Developer Experience acceptance                      | P0-C         |
| SM02  | At least ten canonical templates are installable and versioned                                                                | P0-C                    | exact inventory/pack tests                    | Design Systems review                                | P0-C         |
| SM03  | Table supports the evidence-ranked five most-demanded plugins with React Aria semantics                                       | P1-F                    | ranking equality/plugin/a11y tests            | Design Systems/Accessibility review                  | P1-F         |
| SM04  | Supported upgrades have codemods and reports                                                                                  | P1-A                    | range/transform/report tests                  | Release Engineering review                           | P1-A         |
| SM05  | Docs, CLI, MCP, registry, and npm package versions align                                                                      | P1-B                    | version-correlation tests                     | Release Engineering review                           | P1-B         |
| SM06  | RTL/pseudo-locale and changed-component axe checks are routine                                                                | P1-C/P2-E               | recurring CI jobs                             | Localization/Accessibility review                    | P2-E         |
| SM07  | Agent pass rate and context cost are tracked over time                                                                        | P0-B/P1-D               | benchmark trend artifacts                     | Developer Experience/Product Analytics review        | P1-D         |
| SM08  | Adoption decisions use measured searches, templates, issues, and upgrades rather than component counts                        | P1-D                    | coverage/decision-record checks               | Product Analytics/Governance review                  | P1-D         |

A criterion can pass only with both its automated evidence and required manual review. Unavailable metrics keep affected criteria open unless the user approves an explicit exception.

## Implementation Steps

### Phase 0 — Contracts, provenance, decisions, and baselines

1. Add package/release, Node/OS, version-correlation, root-identity, mutation/recovery, runtime-asset, local-validation, historical-doc, public-origin, hosted-MCP, metrics, Figma privacy, and extension-trust ADRs under `docs/architecture/`.
2. Approve the tooling package/release ADR before public package metadata, binaries, loading paths, or release workflow integration.
3. Add the artifact, capability, error, validation, operation, recovery, migration, dry-run, template, composition, metrics, docs provenance, lifecycle, Table ranking, candidate-disposition, extension, conformance, and traceability schemas.
4. Add `registry/roadmap-traceability.json` from the canonical criterion matrix and CI equality validation.
5. Select the authoritative previous-major docs source and origin-root hosting boundary.
6. Select metrics source/consent/coverage semantics; no telemetry implementation precedes approval.
7. Define Figma classification, least privilege, disclosure, retention, cache isolation, and publication.
8. Define extension namespace, validation-kind, integrity, trust, revocation, and execution policy.
9. Inventory exports, recipes, A2UI types, foundations, strings, runtime assets, docs history, private/public data, and accessibility coverage.
10. Freeze the Table, AppShell, Chat, content, and extension contribution inventories with deterministic set-equality checks.
11. Derive exact starter-migration ranges and affected records from tags, changelogs, registries, exports, token history, and published artifacts.
12. Define lifecycle, changed-component axe, performance, content-selection, and AppShell repetition policies.
13. Capture non-fabricated cold-start, validation, context, search, template, Table, package-size, route, i18n, axe, performance, and metrics baselines.
14. Add current, historical, deprecated, experimental, corrupt, unsupported, private, sensitive, third-party, already-migrated, and mixed-version fixtures.
15. Exit when all contracts, inventories, roles, sources, runtime boundaries, privacy controls, ranges, and baseline methods are approved.

### P0-A — Unified registry

Implement schemas, source manifests, canonical serialization, artifact and capability registries, deterministic A2UI metadata, mixed-kind search, lifecycle relations, version correlation, and CI source-equality/drift checks. Exit on R01.1–R01.4.

### P0-B — Tooling, local validation, safe materialization, and recovery

1. Extract pure MCP behavior behind existing adapters.
2. After the package ADR, create the approved tooling package, exports, bins, loaders, assets, build paths, and release policy.
3. Implement typed envelopes, errors, capability negotiation, and adapter parity.
4. Implement the packaged validation modules, compiler dependency, project/config resolution, worker bounds, diagnostic normalization, registry rules, and local-MCP capability registration.
5. Convert `tools/validate-generated.mjs` into a repository adapter after parity.
6. Implement operation slots, journals, locks, tombstones, crash recovery, and read-only `doctor`.
7. Implement recovery identities, transition guards, terminal replay, and interruption safety.
8. Implement the four-output init and shared template/generate/compose materializer.
9. Update package `files`, exports, bins, workspace metadata, lockfile, build copies, version policy, publish workflow/order, provenance, and duplicate-publish behavior.
10. Add clean packed Vite/Next fixtures covering valid/invalid validation, installed registry loading, executable and MCP handshake, CLI/API/MCP parity, cancellation, timeout, redaction, concurrency, crash, response loss, doctor, and recovery.
11. Exit on R02.1–R02.5 and the P0-B portions of SM01.

### P0-C — Ten initial templates

Register settings page, chart dashboard, sortable table, validated form, React Hook Form, sidebar/header, app header, command-palette dashboard, empty state, and loading patterns.

Each includes source, skeleton, dependencies, preview, golden, compatibility, provenance, appearance, accessibility, responsive, and RTL metadata. Test packed Vite/Next materialization, installed validation, TypeScript, light/dark rendering, replay, recovery, and repeat-run no-op. Exit on R03.1–R03.5, SM01, and SM02.

### P0-D — Table RFC, ranking, and prototype

Create the Table RFC, exact ten-candidate inventory, evidence records, ranking schema, set-equality test, shared controller contract, and private/experimental selection and sorting prototypes. Cover server correlation, cancellation, controlled/default state, SSR, accessibility, and 1k/10k fixtures. Exit only after every candidate has a reviewed disposition and rank.

### P1-A — Migration and codemod infrastructure

Implement list/dry-run/apply, ordered manifests, packed transform loading, deterministic protected diffs, complete postimage verification, sensitive/generated authorization, and JS/TS/CSS/config transforms.

Deliver all four starter groups with verified ranges, positive, already-migrated, mixed, unsupported, stale-plan, concurrent, interruption, replay, backup, resume, rollback, installed-loading, and source/target compatibility fixtures. Generate replacement/deprecation links from the registry. Exit on R05.1–R05.3 and SM04.

### P1-B — Versioned docs, hosted MCP, and `llms.txt`

Import an approved previous-major source, freeze its public-safe snapshot, generate current/previous manifests and version-aligned guidance, assemble Pages at the approved origin, deploy hosted MCP independently, and test routes, corruption, redaction, cancellation, load, cache, compatibility, and rollback. Hosted capability tests must prove validation, mutation, and extension execution are absent. Exit on R06.1–R06.4 and SM05.

### P1-C — Internationalization operations

Inventory Tale-owned strings; add schema, English catalog, fallback/interpolation/override APIs, pseudo-locale and RTL modes, contribution workflow, context, and screenshots. Test corrupt/unsupported locales, precedence, SSR, bidi isolation, interpolation safety, and application-copy exclusion. Exit on R07.1–R07.3.

### P1-D — Adoption and health metrics

Implement approved public collectors, provenance, checkpointed snapshots, coverage/freshness manifests, static dashboard generation, Pages assembly, and last-known-good rollback. If separately approved, add opt-in authenticated ingestion with atomic deduplication, retention/deletion, quarantine, replay-safe aggregation, kill switch, and rollback-compatible migrations.

Missing inputs remain `unavailable` or `partial`. Exit only when R08.1–R08.2, SM07, and SM08 have source evidence or explicit user-approved exceptions.

### P1-E — AppShell evidence gate

Create the exact eight-candidate inventory and disposition artifact. Analyze repeated structure from the first template set. If the approved evidence threshold passes, write an RFC and release an experimental family for approved candidates; otherwise keep the criterion open or obtain a user exception.

Test responsive surfaces, focus, escape, skip links, zoom, RTL, reduced motion, SSR, persistence, instance/revision scoping, stale rejection, and non-ownership boundaries. Exit on R09.1–R09.2.

### P1-F — Five stable Table plugins

Implement the actual top five from the completed ranking without feasibility substitution. Each plugin uses the shared controller and includes React Aria semantics, controlled/default modes, client/server behavior, cancellation/stale handling, SSR, docs, stories, ComponentAudit, migrations, goldens, A2UI decision, registry records, and benchmarks.

A blocked top-five candidate keeps R04/SM03 incomplete unless explicitly excepted by the user. Exit on R04.1–R04.5 and SM03.

### P2-A — Motion and elevation

Inventory raw motion/shadows; add semantic tokens, reduced-motion mappings, elevation hierarchy, platform exceptions, generated outputs, migrations, registry records, audits, examples, and Storybook transition matrices. Exit on R10.1–R10.2.

### P2-B — Protocol-agnostic Chat

Create the exact nine-candidate inventory and disposition artifact, then approve the RFC before public exports. Implement approved ordinary-data APIs, scoped IDs, ordered chunks, cancellation, duplicate/stale rejection, terminal states, batching, SSR, accessibility, RTL, reduced motion, and security boundaries.

Default to plain text, reject raw HTML, defer generic Markdown, isolate A2UI mapping, cover collapsed/running/success/error tool states, and register mobile and artifact-panel templates. Exit on R11.1–R11.4.

### P2-C — Selected content primitives

Evaluate the exact six candidates and record approve/defer/reject outcomes. Each approved slice includes source, styles, exports, docs, stories, ComponentAudit, golden, A2UI decision, registry, validation, tests, performance, and migration treatment. At least one primitive ships unless the user approves a zero-delivery exception. Exit on R12.1–R12.2.

### P2-D — Lifecycle and governance

Publish lifecycle, promotion, deprecation, retirement, ownership, proposal, review, and exception contracts. Generate ownership, status, replacement, migration, and exception reports and enforce them in CI. Exit on R13.1.

### P2-E — Accessibility and maintained performance

Select and smoke-test maintained runners. Implement changed-component axe selection, shared-change fallback, new-violation blocking, expiring exceptions, scheduled full runs, and retained manual screen-reader/zoom/keyboard/touch/reduced-motion evidence.

Baseline and trend all roadmap performance surfaces and block only understood regressions. Exit on R14.1–R14.2 and SM06.

### P3-A — Figma/code parity

After authentication/privacy approval, generate token interchange, registry and variant mappings, code connection, lifecycle normalization, authenticated internal reports, and separately generated public-safe reports. Prove cache isolation and non-disclosure. Writes require separate approval. Exit on R15.1–R15.2.

### P3-B — Extensible ecosystem packages

Approve the RFC and threat model; implement schema-only discovery, namespaced virtual registries, first-class validation artifacts, integrity/provenance normalization, trust/revocation state, and explicit local execution approval.

Add discovery and trusted-loading fixtures for components/docs, recipes/templates, validations/pitfalls, codemods, and A2UI types. Hosted execution remains prohibited. Exit on R16.1–R16.2.

### P3-C — Cross-platform token conformance

Add conformance and exception schemas, deterministic light/dark parity, high-contrast guidance, React Native examples using `@tale-ui/tokens/native`, and approved platform exceptions. Exit on R17.1–R17.2.

### Dependency-aware backlog

Blocking prerequisites:

- **P-01:** Approve tooling package, validator runtime, and release ADR.
- **P-02:** Add CI policy preventing package/bin/release integration without P-01.
- **P-03:** Approve metrics source/consent/coverage semantics.
- **P-04:** Verify source/target ranges for all starter migrations.
- **P-05:** Freeze Table, AppShell, Chat, content, and extension inventories.
- **P-06:** Add canonical roadmap traceability schema and registry.

Recommended first six issues remain:

1. RFC: unified artifact schema and versioning.
2. Extract MCP business logic into a publishable package.
3. CLI spike: manifest/search/component/plan/validate.
4. Template schema plus `settings-page` conversion.
5. Table plugin RFC and selection/sorting prototype.
6. Agent cold-start benchmark: current README/MCP setup versus CLI `init`.

Subsequent reviewable slices:

7. Registry source equality and deterministic A2UI output.
8. Capability/version correlation and traceability registry.
9. Tooling package build/export/pack paths after P-01.
10. Validation registry rules and normalized diagnostics.
11. TypeScript project resolver and bounded worker.
12. Packed Vite/Next CLI/API/MCP validation parity.
13. Envelopes, errors, and adapter parity.
14. Operation slots, journals, locks, tombstones, doctor, and crash fixtures.
15. Recovery identities and concurrency fixtures.
16. Four init planners and structural merges.
17. Shared materializer and installed fixtures.
18. Ten templates in independently reviewable slices.
19. Table inventory, ranking schema, evidence records, and prototypes.
20. One PR per evidence-ranked stable Table plugin.
21. Migration schemas, loader, protected diff, and fidelity harness.
22. One PR per mandatory starter-migration group.
23. Cross-group replay/recovery and traceability gate.
24. Historical-doc importer and immutable snapshot tests.
25. Versioned Pages assembly, root guidance, and route checks.
26. Hosted MCP independent artifact.
27. I18n catalogs, context, screenshots, and RTL harness.
28. Metrics definitions, coverage, collectors, dashboard, and rollback.
29. Optional metrics ingestion only after approval.
30. AppShell exact inventory, evidence, RFC, and approved experimental slices.
31. Motion/elevation foundations and Storybook matrix.
32. Chat exact inventory, RFC, approved family, and two templates.
33. Content inventory, dispositions, and approved primitives.
34. Lifecycle/governance enforcement.
35. Performance runner and axe CI.
36. Figma classification, mapping, disclosure, and parity reports.
37. Extension contribution schemas, trust model, per-class fixtures, and beta loader.
38. Native conformance and React Native examples.
39. Final criterion, success-measure, package, route, recovery, privacy, and non-goal reconciliation.

## Verification

### Quality-gate matrix

| Gate                      | Automated proof                                               | Manual/evidence review                   |
| ------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| Traceability              | Schema and exact ID/text/evidence equality                    | Release Engineering                      |
| Registry                  | Source equality and two-run identity                          | Generated-source ownership               |
| Tooling sequencing        | ADR policy blocks premature package/bin/release changes       | Release Engineering                      |
| CLI/API                   | Exact envelopes, exits, errors, versions                      | Developer Experience                     |
| Local validation          | Packed Vite/Next valid-invalid CLI/API/MCP parity             | Developer Experience/Security            |
| Operations/recovery       | Conflict, crash, replay, tombstone, no-write tests            | Recovery drill                           |
| Templates                 | Exact inventory, pack, validation, appearance                 | Design Systems/Accessibility             |
| Migrations                | Exact four-group inventory, ranges, fidelity, replay          | Developer Experience/Release Engineering |
| Table                     | Exact ten candidates, ranking, controller, a11y, server modes | Design Systems/Accessibility/Performance |
| AppShell                  | Exact eight candidates and dispositions                       | Design Systems/Accessibility             |
| Chat                      | Exact nine candidates and dispositions; streaming/security    | Design Systems/Accessibility/Security    |
| Extensions                | Exact five classes, validation kind, trust/loading fixtures   | Security/Governance                      |
| Historical docs           | Provenance, allowlist, immutability, routes                   | Docs Platform                            |
| Hosted MCP                | Independent build/start/load and absent capabilities          | Security/Operations                      |
| Metrics                   | Coverage, freshness, privacy, dedupe, rollback                | Product Analytics/Privacy                |
| I18n                      | Catalog, context, pseudo, RTL, bidi, SSR                      | Localization/Accessibility               |
| Figma/native              | Classification/non-disclosure and parity/conformance          | Privacy/Platform                         |
| Accessibility/performance | Axe routing, runner, baselines, trends                        | Assistive-technology review              |
| Final release             | R01.1–R17.2 and SM01–SM08 reconciliation                      | Cross-role go/no-go                      |

### Existing commands

Run applicable existing checks:

- `pnpm generate-docs:check`
- `pnpm tokens:check`
- `pnpm test:tokens`
- `pnpm typescript`
- `pnpm eslint:ci`
- `pnpm lint:css`
- `pnpm stylelint`
- `pnpm markdownlint`
- `pnpm test:jsdom`
- `pnpm test:chromium`
- `pnpm audit:bem`
- `pnpm audit:brand`
- `pnpm audit:docs`
- `pnpm audit:components`
- `pnpm audit:coverage:check`
- `pnpm golden:validate`
- A2UI catalog, docs, example, golden, and audit checks
- `pnpm build`
- package-local `test:package`

Add focused scripts for registry determinism, traceability equality, tooling pack/load, validation parity, operations/recovery, migration inventories, postimage fidelity, candidate set equality, historical routes, hosted MCP, metrics, i18n, Chat, motion, lifecycle, axe, performance, Figma, extensions, conformance, and cumulative release reconciliation.

### Compatibility and fixture matrices

Maintain matrices for:

- Node/OS and durability fallbacks;
- contract, registry, package, schema, validation, template, composition, migration, operation, recovery, route, cache, metrics, docs, and extension versions;
- Vite/Next, TSConfig variants, JSX modes, module formats, installed/missing dependencies, valid/invalid code, cancellation, and timeout;
- current, historical, deprecated, experimental, corrupt, unsupported, private, sensitive, and third-party records;
- all four starter migrations and current/mixed/already-migrated/unsupported states;
- all ten Table, eight AppShell, nine Chat, six content, and five extension-class candidates;
- controlled/default, client/server, SSR/hydration, multi-instance, cancellation, and stale updates;
- light/dark, RTL, pseudo-locale, reduced motion, zoom, and high contrast;
- mutation dry-run/apply/retry/conflict/crash/recovery;
- sensitive/generated/binary/oversized/unsupported files;
- metrics availability, partial coverage, staleness, duplicates, deletion, and rollback;
- Figma public/internal/private records;
- trusted, untrusted, unsupported, corrupt, and revoked extensions.

### Rollout, observability, rollback, and deprecation

- Contracts and schemas begin internal-only, then canary, beta, and stable.
- Existing registries and React MCP/setup shims remain during compatibility windows.
- Templates, migrations, Table plugins, AppShell, Chat, content primitives, and extensions promote independently.
- Runtime responses report correlated versions, capability states, request IDs, bounded errors, and source links.
- Package, route, cache, and registry changes have explicit rollback artifacts.
- Failed static builds retain the last-known-good Pages artifact.
- Hosted MCP and optional metrics ingestion have kill switches.
- Migration manifests can be disabled without deleting recovery data.
- Deprecations carry introduction, deprecation, removal eligibility, replacement, docs, and codemod metadata.
- Experimental APIs cannot become stable without their criterion evidence and migration story.

### Final Definition of Done

The roadmap is complete only when:

1. Every canonical `R01.1`–`R17.2` and `SM01`–`SM08` entry has passing evidence or an explicit user-approved exception.
2. The traceability registry exactly matches this plan’s criterion table and points to automated evidence, manual review, role, and release gate.
3. All artifact kinds pass schema, source equality, relation, version, installed-loading, and two-run determinism checks.
4. CLI, API, local MCP, installed fixtures, and hosted clients use exact versioned contracts and stable errors.
5. Installed validation works outside the monorepo in clean Vite and Next projects and produces equivalent registry and TypeScript results across CLI, API, and local MCP.
6. Validation is read-only, root-scoped, bounded, cancellable, redacted, and packaged with all required compiler/rule assets.
7. Every mutation passes confinement, traversal/symlink, overwrite, concurrency, idempotency, crash, replay, recovery, and sanitization tests.
8. Every mutation has deterministic complete postimages and staged/post-commit verification.
9. `init` safely manages all four requested outputs.
10. Ten initial templates and two Chat templates are registered, packed, versioned, materialized, and validated.
11. Table assesses exactly ten candidates and ships the evidence-ranked top five unless explicitly excepted.
12. AppShell assesses exactly eight distinct candidates after template evidence; Chat assesses exactly nine candidates before public API promotion.
13. Migration infrastructure includes all four prescribed starter groups with verified ranges, reports, fixtures, installed loading, and recovery.
14. Current and one previous documentation major have authoritative provenance and immutable hosting.
15. Hosted MCP exposes only bounded retrieval and `plan_ui`.
16. Tale-owned strings have catalogs, context, overrides, pseudo/RTL checks, and contribution operations.
17. Changed-component axe checks and retained manual accessibility evidence run routinely.
18. Motion/elevation, lifecycle/governance, and maintained performance budgets pass their gates.
19. Metrics expose source, consent class, coverage, provenance, freshness, and definition version; missing data is never zero.
20. All six content candidates have dispositions; at least one approved primitive ships unless explicitly excepted; Markdown remains deferred.
21. Extension support covers all five roadmap contribution classes; `validation` is first-class; executable validators and codemods require explicit local trust.
22. Figma reports enforce classification and non-disclosure.
23. Native conformance provides evidence and examples without a native component library.
24. Every new package, binary, runtime asset, generated artifact, workflow, hosted surface, and report passes build, copy, export, pack, publish/deploy, load, cache, provenance, and rollback checks.
25. No prohibited Astryx pattern, mandatory project telemetry, generic Markdown renderer, hosted validation, hosted extension execution, or native component library is introduced without separate approval.

## Risks And Mitigations

- **Installed validation remains monorepo-bound:** replace the subprocess/scratch implementation with a packaged compiler-API runtime and packed-project parity tests.
- **Registry duplication or nondeterminism:** generate pointers from canonical sources and enforce source equality and byte identity.
- **Adapter divergence:** share orchestration functions and require exact CLI/API/MCP parity.
- **Mutation conflicts or data loss:** use durable identities, fixed lock ordering, staging, complete postimages, journals, and recovery.
- **Incorrect migration ranges:** derive ranges from release evidence and reject unsupported states.
- **Candidate inventories silently shrink:** enforce exact set equality for Table, AppShell, Chat, content, and extension classes.
- **Discovery is mistaken for API commitment:** require explicit dispositions and RFC promotion gates.
- **Extension validators bypass trust:** distinguish declarative rules from executable validators and require local installation, integrity, permissions, and trust.
- **Runtime assets work only in the workspace:** require npm-pack and installed Vite/Next tests.
- **Historical docs are reconstructed incorrectly:** import only approved release sources and freeze immutable snapshots.
- **Metrics overclaim coverage or create mandatory telemetry:** use explicit coverage states and keep telemetry opt-in.
- **Hosted scope expands:** assert absence of validation, mutation, and extension execution.
- **Private Figma metadata leaks:** classify before processing, partition caches, suppress protected fields, and test non-disclosure.
- **Async results reach stale surfaces:** require scoped IDs, revisions, cancellation, cleanup, and stale rejection.
- **Traceability labels become ambiguous:** define all IDs once in a schema-validated canonical registry.
- **Accessibility or performance remains advisory:** require evidence and expiring exceptions for promotion.

## Reviewer Feedback Decisions

### F-001

- Decision: ACCEPTED
- Rationale: Repository inspection confirms that `validateCodeCore` is monorepo-only, installed MCP omits `validate_code`, the package build does not copy the validator, and the existing validator depends on monorepo scratch files and `npx tsc`. Generic package tests could therefore pass while consumer validation remains unavailable.
- Plan change: Added a dedicated packaged local-validation architecture, modules, dependencies, assets, project/type-resolution behavior, worker timeout/cancellation, redaction, runtime ownership, CLI/API/local-MCP parity, and packed Vite/Next valid-invalid fixtures. Added validation-specific implementation, verification, risk, traceability, and Definition of Done gates.

### F-002

- Decision: ACCEPTED
- Rationale: The roadmap explicitly lists eight distinct AppShell candidates and nine Chat candidates. The previous plan described behavior without preserving those evaluation inventories.
- Plan change: Enumerated both exact inventories, added schema-validated disposition artifacts and set-equality checks, kept AppShell contingent on repeated-template evidence, and kept Chat public promotion behind its RFC.

### F-003

- Decision: ACCEPTED
- Rationale: The roadmap permits validations as well as pitfalls, while the prior artifact-kind set and extension plan did not define validation contributions or their executable trust boundary.
- Plan change: Added first-class `validation` artifacts; defined their schema, declarative/executable modes, permissions, timeout, integrity, trust, and loading rules; enumerated all five extension contribution classes; and added representative discovery/loading fixtures and exit criteria.

### F-004

- Decision: ACCEPTED
- Rationale: The prior `R1–R17`, `R5`, `SM1–SM8`, and `SM6a` shorthand lacked canonical criterion-level definitions and could not support deterministic release reconciliation.
- Plan change: Replaced the shorthand with canonical `R01.1`–`R17.2` and `SM01`–`SM08` identifiers. Added a self-contained scope-preservation and traceability matrix plus a machine-readable traceability schema/registry requirement. Removed the undefined `SM6a` split.

### Reviewer concern: false MCP source path

- Decision: ACCEPTED
- Rationale: `packages/react/mcp-server.mjs` is not a source-tree file. `tools/mcp-server.mjs` is canonical and is copied to the built package root.
- Plan change: Removed the nonexistent path from `Evidence Checked` and described the copy behavior explicitly.

### Prior reviewer-approved baseline

- Decision: ACCEPTED
- Rationale: The restored starter-migration and Table inventories and the established mutation, recovery, metrics, privacy, historical-doc, Figma, async, packaging, accessibility, content, and governance controls remain supported by repository and roadmap evidence.
- Plan change: Preserved those requirements while adding the reviewer-03 corrections.

## Changes Since Previous Plan

- Added an implementation-ready installed validation runtime and explicit build, dependency, export, loading, timeout, cancellation, redaction, and Vite/Next parity requirements.
- Corrected the MCP source-path evidence.
- Added exact eight-candidate AppShell and nine-candidate Chat inventories with approve/defer/reject disposition gates.
- Added first-class `validation` artifacts and complete extension contribution-class coverage.
- Added canonical criterion-level roadmap and success-measure identifiers with machine-checkable traceability.
- Removed undefined `R1–R17`, `R5`, `SM1–SM8`, and `SM6a` shorthand.
- Preserved the four mandatory starter migrations, exact ten-candidate Table ranking, filesystem safety, recovery, metrics/privacy, historical docs, Figma, async-state, packaging, accessibility, performance, governance, and non-goal requirements.

## Open Questions

These are implementation preflight decisions and do not block plan approval:

- Final tooling/local-MCP package boundary and independent-versus-lockstep release policy.
- Supported TypeScript and Node ranges for the packaged validator.
- Validator worker memory/time limits and deterministic fallback compiler options.
- Exact operation/recovery storage paths, permissions, retention, and durability fallbacks.
- Exact starter-migration source/target ranges and affected records.
- Authoritative previous-major source and static snapshot storage.
- Canonical public origin and root-routing mechanism.
- Hosted MCP vendor, transport, rate-limit storage, and deployment platform.
- Metrics aggregate-only versus opt-in project events and approved source coverage.
- Figma authentication, approved files, disclosure thresholds, and code-connection mechanism.
- Evidence-ranked Table top five.
- AppShell repetition threshold and resulting candidate dispositions.
- Chat and content candidate dispositions.
- Maintained performance and axe runners and post-baseline thresholds.
- Extension integrity/signature and revocation distribution policy.

No irreversible implementation occurs before its applicable gate.

## Status

READY_FOR_IMPLEMENTATION

## Clarifying Questions

None.
