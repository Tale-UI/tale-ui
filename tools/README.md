# Monorepo Tools

Scripts in this directory support development, auditing, building, releasing, and AI-assisted code generation for Tale UI packages. All scripts are run from the **workspace root**.

## How It All Fits Together

The agentic infrastructure forms a pipeline from source code to validated AI output:

```
Source (.styled.tsx, index.ts, CSS, docs)
  │
  ├─► generate-registry.js ──► registry/components.json
  │                                │
  │                                ├─► mcp-server.mjs ──► component, recipe, docs, A2UI, and planning tools
  │                                ├─► generate-cursorrules.js ──► .cursorrules (Cursor/Windsurf)
  │                                └─► validate-generated.mjs ──► validates any .tsx against registry + tsc
  │
  ├─► consumer-claude-md-snippet.md ──► consuming projects copy into their CLAUDE.md
  │
  └─► audit-snippet-kinds.js ──► verifies snippet lists match registry
```

**When you add a new component**, regenerate and verify the complete derived-document chain:

```bash
pnpm generate-docs
pnpm generate-docs:check
```

**CI is organized by responsibility:**

| Job                               | Responsibility                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| `check-css`                       | Tokens, CSS, component completeness, generated artifacts, roadmap contracts, and TSX goldens |
| `check-code`                      | TypeScript, packed React/tooling contracts, and jsdom unit tests                             |
| `check-accessibility-performance` | Changed-component accessibility and maintained performance budgets                           |
| `check-a2ui`                      | A2UI catalog docs, examples, catalog registry, and guidance                                  |
| `check-formatting`                | Semantic documentation reconciliation, Markdown lint, and formatting                         |
| `test-dev`                        | Release builds on supported macOS, Windows, and Linux development environments               |

The workflow in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) is authoritative. Avoid copying check counts into prose because the workflow evolves.

`pnpm generate-docs` orders source-derived outputs before their correlated
governance, current-version provenance, metrics, integration, conformance, and
roadmap evidence. Keep `pnpm generate-docs:check` aligned whenever a new
deterministic output joins that pipeline.

## Audit Tools

| Script                         | pnpm command                | CI                          | Purpose                                                                          |
| ------------------------------ | --------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `audit-bem.js`                 | `pnpm audit:bem`            | Yes                         | Verifies every `cx()` class in styled components has matching CSS                |
| `audit-brand.js`               | `pnpm audit:brand`          | Yes                         | Verifies component CSS never uses `--brand-*` tokens                             |
| `audit-docs.js`                | `pnpm audit:docs`           | Yes                         | Verifies component markdown docs list all Tale UI-specific props                 |
| `audit-doc-semantics.mjs`      | `pnpm audit:docs:semantics` | Yes                         | Detects stale current-state claims, broken local links, and inventory drift      |
| `audit-components.js`          | `pnpm audit:components`     | Yes                         | Comprehensive 19-check component completeness audit                              |
| `audit-coverage.js`            | `pnpm audit:coverage`       | `pnpm audit:coverage:check` | Reports components missing from ComponentAudit, Storybook, or A2UI full-showcase |
| `audit-pitfall-coverage.js`    | `pnpm pitfalls:audit`       | No                          | Reports which component docs are still missing pitfall sections                  |
| `audit-pitfall-consistency.js` | `pnpm pitfalls:audit`       | No                          | Verifies component pitfall markers match the generated registry                  |
| `audit-pitfall-truth.mjs`      | `pnpm pitfalls:truth`       | No                          | Verifies pitfall wording is supported by the current implementation              |
| `apply-pitfall-patch.mjs`      | `pnpm pitfalls:patch`       | No                          | Validates and dry-runs or writes one structured pitfall patch payload            |

### audit-bem.js

Scans every `packages/react/src/*/*.styled.tsx` file for `cx()` calls, extracts the BEM class strings passed to them (e.g. `cx('tale-button tale-button--primary', className)`), then verifies each class has a matching CSS rule in `packages/styles/src/`. Catches typos and renamed classes that would silently produce unstyled components.

### audit-brand.js

Greps all `packages/styles/src/*.css` files for `--brand-*` token usage. `--brand-*` tokens define the palette but don't invert in dark mode — component CSS must use `--color-*` instead. This prevents dark mode breakage.

### audit-docs.js

For each component with a `.styled.tsx` file, extracts the Tale UI-specific props from the TypeScript interfaces (variant, size, disabled, etc.) and checks that `docs/components/{name}.md` has a `## Props` table row for each one. Catches props that were added to the code but never documented.

### audit-components.js

The most thorough audit. Dynamically discovers all component directories under `packages/react/src/` and checks each one against 19 completeness criteria. New components are automatically picked up — no configuration needed for standard components.

```bash
pnpm audit:components                        # audit all components
pnpm audit:components -- --component=button  # audit a single component
pnpm audit:components -- --json              # machine-readable output
pnpm audit:components -- --verbose           # include warnings
```

**How it works:** For each component directory, the script reads the styled file, index, CSS, markdown doc, package.json exports, and cross-references them against each other. It parses JSDoc `@example` blocks to verify import paths, extracts exported part names to verify the component index is accurate, and diffs CSS selectors against documented class lists.

**What it checks (19 points):**

1. Styled file exists (`{Component}.styled.tsx`)
2. `index.ts` exists with re-exports
3. CSS file exists in `packages/styles/src/`
4. CSS `@import` in `packages/styles/src/index.css`
5. Markdown doc exists in `docs/components/`
6. Doc has required sections (Props/Parts, Examples, CSS Classes)
7. JSDoc `@example` on main export
8. `@example` import path matches `package.json` exports
9. Listed in `docs/component-index.md`
10. Present in generated `docs/consumer-claude-md-snippet.md` after registry/snippet generation
11. Listed in `packages/react/README.md`
12. Export in `packages/react/package.json`
13. Export in `packages/styles/package.json`
14. Storybook story exists
15. `ComponentAudit.tsx` entry exists
16. `CLAUDE.md` audit table row exists
17. Parts consistency (index vs actual exports)
18. Doc example import paths valid
19. CSS class documentation matches actual CSS

**Skip lists:** Non-component directories (adapters, types) and special-case components (providers, re-exports, utilities) are handled via hardcoded skip lists at the top of the file. Standard components require no configuration.

See also [`component-audit-prompt.md`](component-audit-prompt.md) — an AI agent guide for deep quality auditing beyond what the automated script checks.

### audit-coverage.js

Cross-checks three coverage surfaces against the canonical component and A2UI type lists:

1. **ComponentAudit.tsx** — visual playground audit (`playground/vite-app/src/demos/ComponentAudit.tsx`)
2. **Storybook stories** — scans `@tale-ui/react/*` imports across all `.stories.tsx` files, handling grouped stories (e.g. `ColorComponents.stories.tsx`) automatically
3. **A2UI full-showcase** — scans all component type names used in `packages/a2ui/src/agent/examples/full-showcase.json` against catalog non-sub-part types

Non-visual utilities (`CSPProvider`, `I18nProvider`, `mergeProps`) are excluded from coverage checks.

```bash
pnpm audit:coverage          # human-readable report
pnpm audit:coverage:check    # exit 1 if any coverage gaps
node tools/audit-coverage.js --json   # machine-readable JSON
```

## Build Tools

| Script              | pnpm command     | Purpose                                                      |
| ------------------- | ---------------- | ------------------------------------------------------------ |
| `build-css.js`      | `pnpm build:css` | Concatenates `@tale-ui/css` CSS source into `dist/style.css` |
| `build-package.mjs` | _(internal)_     | Produces publish-ready CJS + ESM package output              |

### build-css.js

Reads `packages/css/src/index.css`, resolves one level of `@import` statements, and concatenates everything into a single `packages/css/dist/style.css`. No PostCSS, no minification — just simple file concatenation. Only resolves imports one level deep (imports within imported files are not followed), so all component CSS must be imported directly from `index.css`.

### build-package.mjs

Used internally by the charts, React, themes, tokens, and utils package build scripts. Babel emits separate CJS and ESM JavaScript trees, TypeScript emits declarations when a `tsconfig.build.json` is present, and the script copies package-specific static files through `--copy`.

The publish root is explicitly marked CommonJS and the `esm/` subtree is marked ESM. Relative specifiers in ESM JavaScript and declarations are normalized to explicit `.js` or `/index.js` targets so Node 16 resolution, Publint, and Are the Types Wrong validate the packed package consistently. The `--ignore`, `--copy`, and `--minimal` flags support package-specific output needs. This script is not intended to be run directly.

## Release Tools

| Script           | pnpm command       | Purpose                                                   |
| ---------------- | ------------------ | --------------------------------------------------------- |
| `release-css.js` | `pnpm release:css` | Version bump, git tag, and npm publish for `@tale-ui/css` |

### release-css.js

Bumps the version in `packages/css/package.json`, rebuilds `dist/style.css`, commits the changes, creates a git tag (`@tale-ui/css@{version}`), and publishes to npm. Aborts if the git working tree is dirty.

```bash
pnpm release:css:patch      # bump patch version
pnpm release:css:minor      # bump minor version
pnpm release:css:major      # bump major version
pnpm release:css:dry-run    # patch bump without publishing
```

## Registry & Generators

| Script                          | pnpm command                | CI                       | Purpose                                                          |
| ------------------------------- | --------------------------- | ------------------------ | ---------------------------------------------------------------- |
| `generate-registry.js`          | `pnpm registry:generate`    | `pnpm registry:check`    | Generates `registry/components.json` from source                 |
| `generate-pitfalls-registry.js` | `pnpm pitfalls:generate`    | `pnpm pitfalls:check`    | Generates `registry/pitfalls.json` from shared pitfall docs      |
| `generate-cursorrules.js`       | `pnpm cursorrules:generate` | `pnpm cursorrules:check` | Generates `.cursorrules` from registry + consumer snippet        |
| `audit-snippet-kinds.js`        | `pnpm audit:snippet-kinds`  | Yes                      | Validates consumer snippet namespace/simple lists match registry |

### generate-registry.js

Scans the component source directories and produces `registry/components.json` — a machine-readable catalog with each component's name, import path, category, description, kind (compound/simple), props, parts, examples, and CSS classes.

Data sources per component:

- **kind** — from `index.ts` export pattern (`export * as` = compound, `export { }` = simple)
- **props** — from `.styled.tsx` interface definitions (regex-parsed)
- **parts** — from exported `const` declarations in `.styled.tsx`
- **category/description** — from `docs/component-index.md` table
- **examples** — from `docs/components/{name}.md` tsx code blocks
- **cssClasses** — from `packages/styles/src/{name}.css` BEM selectors

The registry includes `schemaVersion` (format version) and `taleUiVersion` (which `@tale-ui/react` version it was generated from).

```bash
pnpm registry:generate   # write registry/components.json
pnpm registry:check      # compare generated vs committed; exit 1 if different
```

### generate-cursorrules.js

Generates `.cursorrules` (Cursor/Windsurf rules file) by combining:

- **Dynamic data** from `registry/components.json` — namespace vs simple component lists stay in sync automatically
- **Static data** from `docs/consumer-claude-md-snippet.md` — setup, workflow, CSS token, and dark mode guidance; the full pitfall corpus is retrieved just in time

```bash
pnpm cursorrules:generate   # write .cursorrules
pnpm cursorrules:check      # compare generated vs committed; exit 1 if different
```

### generate-pitfalls-registry.js

Parses `docs/pitfalls.md` and writes `registry/pitfalls.json`, which powers shared cross-component pitfalls for MCP responses, eval context generation, and prompt tooling.

```bash
pnpm pitfalls:generate   # write registry/pitfalls.json
pnpm pitfalls:check      # compare generated vs committed; exit 1 if different
```

### Pitfall audits

The pitfall tooling has three layers:

- `pnpm pitfalls:audit` runs coverage, consistency, and truth audits together
- `pnpm pitfalls:check` verifies the generated shared pitfalls registry is up to date
- `pnpm pitfalls:truth` checks that pitfall wording is supported by the current implementation
- `pnpm pitfalls:patch -- --json path/to/fix.json --dry-run` validates and previews one structured patch payload

The underlying scripts are:

- `tools/audit-pitfall-coverage.js`
- `tools/audit-pitfall-consistency.js`
- `tools/audit-pitfall-truth.mjs`
- `tools/apply-pitfall-patch.mjs`

Current truth-audit checks catch contradictions such as:

- claims that a part should not be added even though it is exported
- shared trigger rules that assume every listed trigger renders a `<button>`
- "use self-closing" rules for parts that explicitly support custom children with fallback content
- known absolute guidance that is not actually enforced by the component implementation

```bash
pnpm pitfalls:audit
pnpm pitfalls:truth
pnpm pitfalls:patch -- --json /tmp/fix.json --dry-run
```

### audit-snippet-kinds.js

Parses the namespace/simple component lists in `docs/consumer-claude-md-snippet.md` and cross-checks every entry against the registry's `kind` field. Catches:

- Components listed as namespace that are actually simple (or vice versa)
- Components in the registry but missing from both lists
- Components in the lists but not in the registry

## MCP Server

| Script           | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `mcp-server.mjs` | Model Context Protocol server exposing Tale UI data as tools |

### mcp-server.mjs

A stdio-based MCP server that exposes the component registry, recipe docs, and full documentation as tools for AI agents. Configured in `.mcp.json` at the project root.

**Tools:**

| Tool                    | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `list_components`       | List registry components with name, import, category, description, kind  |
| `get_component`         | Get full details for one component (props, parts, examples, CSS classes) |
| `search_components`     | Fuzzy search by intent (e.g. "date input", "navigation sidebar")         |
| `list_recipes`          | List all indexed recipes                                                 |
| `get_recipe`            | Get a recipe's full markdown content by slug                             |
| `search_docs`           | Keyword search across the current documentation index                    |
| `list_a2ui_types`       | List all A2UI catalog types with descriptions                            |
| `get_a2ui_type`         | Get details for one A2UI type (props, allowed values)                    |
| `get_a2ui_example`      | Get a few-shot A2UI example by name                                      |
| `validate_code`         | Validate TSX against the registry and TypeScript (monorepo only)         |
| `get_component_stories` | Get Storybook stories for a component (monorepo only)                    |
| `plan_ui`               | Plan components, recipes, and relevant pitfalls for a UI request         |

**How agents use it:** Compatible agents discover the server through `.mcp.json`. The public-beta `@tale-ui/tooling` package exposes the supported consumer tooling surface; the hosted MCP exposes artifact search, artifact retrieval, and UI planning. Monorepo-only tools may depend on source, Storybook, or TypeScript state that is not shipped to consumers.

**Configuration (`.mcp.json`):**

```json
{
  "mcpServers": {
    "tale-ui": {
      "command": "node",
      "args": ["tools/mcp-server.mjs"]
    }
  }
}
```

## Validation & Evaluation

| Script                             | pnpm command                  | CI  | Purpose                                                                         |
| ---------------------------------- | ----------------------------- | --- | ------------------------------------------------------------------------------- |
| `validate-generated.mjs`           | `pnpm validate:generated`     | No  | Validates any `.tsx` against registry + TypeScript                              |
| `validate-golden-prompts.mjs`      | `pnpm golden:validate`        | Yes | Validates all golden prompt reference implementations                           |
| `eval-golden-prompts.mjs`          | `pnpm golden:eval`            | No  | Runs golden prompts against the selected provider and scores L1–L3              |
| `eval-fix-review.mjs`              | `pnpm golden:fix-review`      | No  | Full pipeline: eval → propose/review docs and pitfall fixes → visual review     |
| `eval-golden-harden.mjs`           | `pnpm golden:harden`          | No  | Re-runs prompts until each gets N fresh clean passes in a row                   |
| `run-validator-tests.mjs`          | `pnpm validate:test`          | No  | Tests the validator itself against known-good and known-bad samples             |
| `validate-a2ui-golden-prompts.mjs` | `pnpm a2ui:golden:validate`   | Yes | Validates all A2UI golden prompt reference implementations against live catalog |
| `eval-a2ui-golden-prompts.mjs`     | `pnpm a2ui:golden:eval`       | No  | Runs A2UI golden prompts against a model and scores L1–L3                       |
| `eval-a2ui-fix-review.mjs`         | `pnpm a2ui:golden:fix-review` | No  | Full pipeline: eval → auto-fix A2UI system prompt based on failures             |

### validate-generated.mjs

Standalone code validator that checks generated `.tsx` files against the component registry and TypeScript compiler. No API key needed — works on any code, whether LLM-generated or hand-written.

**Validation pipeline:**

1. **Registry checks** (fast, no subprocess) — invalid import paths, compound components used without `.Root`, simple components used with `.Root`
2. **TypeScript check** (`tsc --noEmit`) — type errors, missing props, wrong types

```bash
node tools/validate-generated.mjs path/to/file.tsx          # validate a file
node tools/validate-generated.mjs --code '<Button>Hi</Button>'  # validate inline code
node tools/validate-generated.mjs --golden prompt.json       # validate a golden prompt reference
node tools/validate-generated.mjs --json path/to/file.tsx    # JSON output
```

Uses `tsconfig.generated.json` (isolated tsconfig) and writes temp files to `.generated-scratch/` (gitignored).

### validate-golden-prompts.mjs

Runs `validate-generated.mjs` against every golden prompt reference implementation in `golden-prompts/`. Ensures references stay valid as components evolve. Runs in CI.

### eval-golden-prompts.mjs

Runs each golden prompt against an LLM and scores the generated code across three automated levels:

| Level           | What it checks                                                 | How             |
| --------------- | -------------------------------------------------------------- | --------------- |
| L1 — Validity   | Output passes `validate-generated.mjs` (registry + TypeScript) | Subprocess call |
| L2 — Components | All expected `tags` components appear in the output            | String search   |
| L3 — Imports    | No imports from packages outside the allowed set               | Import parsing  |

Supports three providers. Not run in CI — intended for manual runs before releases or model upgrades.

**Claude Code CLI (default):** No separate API key needed — uses your existing Claude Code login.

```bash
pnpm golden:eval                              # all prompts, default model (sonnet)
pnpm golden:eval -- --model opus              # opus
pnpm golden:eval -- --model haiku             # haiku
pnpm golden:eval -- --model claude-haiku-4-5-20251001  # full model ID also accepted
pnpm golden:eval -- --difficulty simple       # only simple prompts
pnpm golden:eval -- --slug settings-page      # single prompt
pnpm golden:eval -- --slugs a,b,c             # specific prompts (comma-separated)
pnpm golden:eval -- --json                    # machine-readable output
pnpm golden:eval -- --no-cache                # skip call cache, always call provider
pnpm golden:eval -- --fresh                   # skip both caches (true benchmark run)
```

**MCP mode (Claude CLI or Codex CLI):** Runs the selected CLI in agentic mode with the Tale UI MCP server active. Instead of front-loading all pitfalls in the system prompt (~11k tokens), MCP mode uses the lightweight consumer snippet (~1,300 tokens) and lets the model call `plan_ui` and `get_component` for just-in-time pitfall delivery. This tests the real consumer experience end-to-end.

Requires `.mcp.json` in the repo root (already committed). Claude reads it directly; Codex converts the repo-local `tale-ui` server entry into a per-run `codex exec -c mcp_servers=...` override, so no global `codex mcp add` setup is needed.

| Flag              | Default | Description                                                                             |
| ----------------- | ------- | --------------------------------------------------------------------------------------- |
| `--mcp`           | off     | Enable real MCP mode — Claude or Codex calls `plan_ui`/`get_component` for JIT pitfalls |
| `--mcp-max-turns` | `5`     | Max agent turns (each MCP tool call counts as one turn)                                 |

```bash
pnpm golden:eval -- --mcp                                      # MCP mode, default model (sonnet)
pnpm golden:eval -- --mcp --model opus                         # MCP mode with opus
pnpm golden:eval -- --provider codex --model gpt-5.4 --mcp    # MCP mode with Codex (repo-local config)
pnpm golden:eval -- --mcp --slug primary-button --no-cache     # single prompt, skip call cache
pnpm golden:eval -- --mcp --difficulty simple --no-cache       # all simple prompts, skip call cache
pnpm golden:eval -- --mcp --mcp-max-turns 8                    # allow more agent turns (default: 5)
```

MCP runs are cached separately from non-MCP runs (different cache key prefix). Use `--no-cache` or `--fresh` as usual to bypass.

**Straico provider:** Requires `STRAICO_API_KEY` environment variable (get it at https://platform.straico.com/user-settings). Straico is a multi-provider proxy — any model it supports can be used, including OpenAI, Google Gemini, Meta Llama, Mistral, and Anthropic models.

```bash
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico --model sonnet        # anthropic/claude-sonnet-4
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico --model gpt-4o        # openai/gpt-4o
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico --model gpt-4o-mini   # openai/gpt-4o-mini
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico --model gemini-flash  # google/gemini-2.0-flash
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico --model gemini-pro    # google/gemini-2.5-pro-exp
STRAICO_API_KEY=xxx pnpm golden:eval -- --provider straico --model anthropic/claude-opus-4  # full ID also accepted
```

Model shorthands for `--provider straico` (full list: https://straico.com/multimodel/):

| Shorthand          | Straico model ID                |
| ------------------ | ------------------------------- |
| `sonnet` (default) | `anthropic/claude-sonnet-4.5`   |
| `sonnet-4`         | `anthropic/claude-sonnet-4`     |
| `sonnet-4.5`       | `anthropic/claude-sonnet-4.5`   |
| `opus`             | `claude-opus-4-5`               |
| `opus-4`           | `anthropic/claude-opus-4`       |
| `opus-4.5`         | `claude-opus-4-5`               |
| `haiku`            | `claude-haiku-4-5-5`            |
| `gpt-4o`           | `openai/gpt-4o-2024-11-20`      |
| `gpt-4o-mini`      | `openai/gpt-4o-mini`            |
| `gpt-4.1`          | `openai/gpt-4.1`                |
| `gpt-4.1-mini`     | `openai/gpt-4.1-mini`           |
| `gpt-4.1-nano`     | `openai/gpt-4.1-nano`           |
| `gpt-5`            | `openai/gpt-5`                  |
| `gpt-5-mini`       | `openai/gpt-5-mini`             |
| `o3`               | `o3-2025-04-16`                 |
| `o4-mini`          | `openai/o4-mini`                |
| `gemini-flash`     | `google/gemini-2.5-flash-lite`  |
| `gemini-pro`       | `google/gemini-3.1-pro-preview` |
| `deepseek`         | `deepseek/deepseek-chat-v3.1`   |
| `deepseek-r1`      | `deepseek/deepseek-r1`          |
| `llama4`           | `meta-llama/llama-4-maverick`   |
| `grok4`            | `x-ai/grok-4`                   |
| `grok3`            | `x-ai/grok-3-beta`              |

Any model ID not in the shorthand table passes through as-is, so you can use the full Straico model string directly (e.g. `--model openai/gpt-5-pro`).

**Local provider (Ollama / LM Studio):** Requires a locally running OpenAI-compatible server. Pass the model name as-is (no alias lookup is done for local models).

| Server                           | Provider shorthand     | Default URL                 |
| -------------------------------- | ---------------------- | --------------------------- |
| [Ollama](https://ollama.com)     | `--provider ollama`    | `http://localhost:11434/v1` |
| [LM Studio](https://lmstudio.ai) | `--provider lm-studio` | `http://localhost:1234/v1`  |

```bash
# Ollama (shorthand — uses http://localhost:11434/v1 automatically)
pnpm golden:eval -- --provider ollama --model llama3.2

# LM Studio (shorthand — uses http://localhost:1234/v1 automatically)
pnpm golden:eval -- --provider lm-studio --model llama3.2

# --provider local is equivalent to --provider ollama (Ollama port)
# Use --local-url to override the endpoint for any OpenAI-compatible server
pnpm golden:eval -- --provider local --local-url http://localhost:8080/v1 --model custom-model
```

**Codex CLI provider:** Requires the `codex` binary on PATH (or set `CODEX_PATH` env var). Uses `codex exec` non-interactively with `-s read-only`. The system prompt is prepended to the user message (Codex has no `--system` flag). Defaults to `o4-mini` when no `--model` is specified. With `--mcp`, the script wires the repo-local `tale-ui` MCP server from `.mcp.json` into the run automatically and hard-fails if that wiring cannot be established.

| Shorthand      | Codex model ID |
| -------------- | -------------- |
| (default)      | `o4-mini`      |
| `o3`           | `o3`           |
| `o3-mini`      | `o3-mini`      |
| `gpt-4.1`      | `gpt-4.1`      |
| `gpt-4.1-mini` | `gpt-4.1-mini` |
| `gpt-4.1-nano` | `gpt-4.1-nano` |
| `gpt-4o`       | `gpt-4o`       |
| `gpt-4o-mini`  | `gpt-4o-mini`  |
| `gpt-5`        | `gpt-5`        |
| `gpt-5-mini`   | `gpt-5-mini`   |
| `gpt-5.4`      | `gpt-5.4`      |
| `gpt-5.4-mini` | `gpt-5.4-mini` |

```bash
pnpm golden:eval -- --provider codex                          # default model: o4-mini
pnpm golden:eval -- --provider codex --model o3
pnpm golden:eval -- --provider codex --model gpt-4.1
pnpm golden:eval -- --provider codex --model gpt-5.4 --mcp    # real Tale UI MCP, repo-local
pnpm golden:eval -- --provider codex --slug primary-button --no-cache
# Mix providers: codex for eval, Claude for fixes
pnpm golden:fix-review -- --provider codex --fix-provider claude --fix-model sonnet
```

**Two-level cache** (`tools/.eval-call-cache.json`, `tools/.eval-check-cache.json` — both gitignored):

| Cache       | Key                                                | Value            | Accurate?                                                       | Bypassed by             |
| ----------- | -------------------------------------------------- | ---------------- | --------------------------------------------------------------- | ----------------------- |
| Call cache  | model + snippet hash + registry hash + prompt hash | generated code   | No — same inputs can produce different LLM output               | `--no-cache`, `--fresh` |
| Check cache | code hash + registry hash                          | L1/L2/L3 results | Yes — same code + same registry always produces the same result | `--fresh` only          |

The call cache is an **iteration shortcut**, not a benchmark. When patching canonical component docs or pitfalls and re-running to confirm a fix worked, prompts that were already passing do not need another provider call. Because LLMs are non-deterministic, a cached pass does not guarantee the prompt would pass on every run.

The check cache is **always accurate** — L1 (TypeScript), L2 (component presence), and L3 (import cleanliness) are all deterministic given the same code and registry. It avoids re-running `tsc` on code the validator has already seen.

**Recommended workflows:**

```bash
# Iterating on docs (fast — reuses cached passing results)
pnpm golden:eval

# Check if your specific fix worked (bypasses call cache for those slugs only)
pnpm golden:eval -- --slugs color-wheel-hue,autocomplete-search

# Accurate benchmark score (bypasses both caches — full re-run)
pnpm golden:eval -- --fresh

# Compare front-loaded pitfalls (default) vs MCP just-in-time delivery
pnpm golden:eval -- --difficulty simple --no-cache --json > /tmp/no-mcp.json
pnpm golden:eval -- --mcp --difficulty simple --no-cache --json > /tmp/mcp.json

# Hardening documentation with repeated fresh local-model generations
pnpm golden:harden -- --provider ollama --model qwen3.6 --passes 3 --slug primary-button
```

**Example output:**

```text
=== Golden Prompt Eval — claude-sonnet-4-6 ===

  primary-button                 [simple]   ✓ L1  ✓ L2  ✓ L3
  settings-page                  [complex]  ✓ L1  ✗ L2  ✓ L3
      L2: missing components: Column

──────────────────────────────────────────────────────
  Model:   claude-sonnet-4-6
  Overall: 22/23 passed all checks
  L1 validity:    23/23
  L2 components:  22/23
  L3 imports:     23/23
  simple  : 8/8
  medium  : 11/12
  complex : 3/3
```

### eval-fix-review.mjs

Full pipeline combining eval, automated fixing, and visual review:

1. **Eval** — runs all golden prompts, collects failures and generated code
2. **Fix loop** — for each failure, the fix model diagnoses the root cause, returns a corrected `fixedCode`, and proposes a structured pitfall-doc patch; the corrected code is scored deterministically without a fresh generation
3. **Documentation patching** — source fixes are applied to `docs/pitfalls.md` or `docs/components/{slug}.md ## Pitfalls` through slug-targeted operations: `append_pitfall`, `replace_pitfall`, or `replace_subbullets`
4. **Review page** — generates `playground/vite-app/src/demos/EvalReview.tsx` with all passing components rendered, registers the route at `/eval-review`
5. **Serve** — starts the Vite playground and opens `http://localhost:5173/eval-review` in the browser for visual L4 inspection

Before eval starts, the pipeline runs pitfall truth, pitfall shape, and golden patchability preflights so bad source documentation does not silently feed the golden prompt workflow. After the fix loop, it reruns the pitfall audits before creating `EvalReview.tsx`; if docs were corrupted by a fix attempt, the script fails closed before opening the review page.

Source patching is intentionally structured. The fix payload must name `section`, `targetFile`, `operation`, and either `targetPitfallSlug` for updates or `newPitfallSlug` for appends. The payload also supplies `summary`, `details`, `antiPatterns`, `fixes`, and optional `completeExample`; the script serializes canonical markdown itself and validates the changed section before writing. Deprecated raw markdown in `new` is ignored by the successful patch path.

The deterministic markdown patcher lives in `tools/pitfall-patch-lib.mjs`, with pure unit coverage in `tools/pitfall-patch-lib.test.mjs`. Keep parsing, serialization, payload validation, and section patching behavior there so `eval-fix-review.mjs` remains responsible for orchestration and source-target routing. Patch operation requirements are declared in `PITFALL_FIX_OPERATION_SPECS`; both the payload validator and the fix-model prompt render their operation rules from that exported spec.

During each run, `golden:fix-review` writes patch replay artifacts under `tools/.golden-patches/{timestamp}/`. Rejected payloads go in `rejected/` and successful source patches go in `applied/`. Rejected patch logs include a replay command so the exact payload can be debugged without rerunning eval chunks.

After the run, check `git diff docs/pitfalls.md docs/components` to review documentation changes before committing.

```bash
pnpm golden:fix-review                                         # full pipeline
pnpm golden:fix-review -- --skip-pitfall-truth                 # skip pitfall truth preflight
pnpm golden:fix-review -- --no-fix                            # skip fix loop, go straight to review
pnpm golden:fix-review -- --no-source-patch                   # score fixed code without writing pitfall docs
pnpm golden:fix-review -- --slug primary-button               # single prompt
pnpm golden:fix-review -- --slugs a,b,c                       # specific prompts (comma-separated)
pnpm golden:fix-review -- --no-review                         # skip EvalReview.tsx generation and server
pnpm golden:fix-review -- --no-serve                          # generate review page without starting server
pnpm golden:fix-review -- --summary-file /tmp/fix.json        # write machine-readable run summary
pnpm golden:fix-review -- --resume                            # continue from tools/.golden-fix-review-state.json
pnpm golden:fix-review -- --resume --state-file /tmp/fix-state.json  # continue from an explicit checkpoint
pnpm golden:fix-review -- --reset-resume                      # ignore an existing checkpoint and start fresh
pnpm golden:fix-review -- --exit-code-on-fail                 # exit non-zero when prompts still fail
pnpm golden:fix-review -- --skip-validate                     # skip pre-flight tsc check (open playground even if EvalReview.tsx has errors)
pnpm golden:fix-review -- --difficulty simple                 # only simple prompts (faster)
pnpm golden:fix-review -- --model sonnet                      # model for both eval and fix
pnpm golden:fix-review -- --model haiku --fix-model sonnet    # haiku for eval, sonnet for fixes
pnpm golden:fix-review -- --concurrency 2                    # lower eval concurrency (useful for slower providers/MCP)
pnpm golden:fix-review -- --mcp --mcp-max-turns 8            # allow more agent turns during MCP evals
pnpm golden:fix-review -- --until-pass                        # fix each prompt until it passes (no attempt cap)
pnpm golden:fix-review -- --until-pass --max-iter 20          # fix each prompt until it passes, max 20 attempts each
pnpm golden:fix-review -- --max-iter 10                       # raise per-prompt attempt cap (default: 3)
pnpm golden:fix-review -- --provider straico                  # use Straico instead of Claude CLI
pnpm golden:fix-review -- --provider straico --model haiku --fix-model sonnet  # cheaper evals, smarter fixes
pnpm golden:fix-review -- --provider ollama --model llama3.2                  # Ollama (port 11434)
pnpm golden:fix-review -- --provider lm-studio --model llama3.2               # LM Studio (port 1234)
pnpm golden:fix-review -- --provider ollama --model llama3.2 --fix-provider claude --fix-model sonnet  # local eval, Claude fixes
```

Structured patch operations:

| Operation            | Required target fields                            | Behavior                                                          |
| -------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `append_pitfall`     | `targetFile`, `newPitfallSlug`                    | Appends one new canonical `<!-- pitfall: ... -->` block           |
| `replace_pitfall`    | `targetFile`, `targetPitfallSlug`                 | Rewrites exactly one existing pitfall block by slug               |
| `replace_subbullets` | `targetFile`, `targetPitfallSlug`, optional `old` | Rewrites the structured content inside one existing pitfall block |

When operation rules change, update `PITFALL_FIX_OPERATION_SPECS` first; the prompt instructions, validator behavior, and tests should then follow the same source of truth.

To debug a rejected patch without rerunning the LLM eval loop, use the replay command printed by `golden:fix-review`, or point the deterministic patch CLI at any saved JSON payload:

```bash
pnpm pitfalls:patch -- --json tools/.golden-patches/2026-05-02T10-20-30-000Z/rejected/image-cropper-basic-02.json --dry-run
pnpm pitfalls:patch -- --json /tmp/fix.json --dry-run  # validate, resolve target, print diff
pnpm pitfalls:patch -- --json /tmp/fix.json --write    # write docs and regenerate registries
```

`apply-pitfall-patch.mjs` shares the same source-target resolver as `golden:fix-review` via `tools/pitfall-source-target-lib.mjs`, so target-file/section conflicts reproduce the runner behavior.

`golden:fix-review` writes a resume checkpoint after each completed prompt to `tools/.golden-fix-review-state.json` by default. If Claude/Codex quota is exhausted, rerun the same command with `--resume` after the reset window; the runner skips completed prompts and keeps previously generated passing code for the review page. Use `--state-file PATH` for a named long-running checkpoint, or `--reset-resume` when intentionally changing filters/model/provider options.

### eval-golden-harden.mjs

Runs the `eval-fix-review.mjs` pipeline repeatedly for each selected golden prompt until that prompt gets `--passes N` clean fresh generations in a row. A clean pass means the prompt passed on the initial eval for that round with no documentation fix needed. If a round fails, `golden:fix-review` applies the structured pitfall documentation fix loop, the streak resets to zero, and hardening retries the same prompt before moving on.

`golden:harden` does not implement its own source patcher; it inherits deterministic patching by shelling through `golden:fix-review` with `--no-review` and a temporary summary file.

This is intended for cheap repeated local-model hardening, where one or two passing runs are not enough signal. By default it passes `--fresh` to bypass both eval caches so each round calls the model again. Use `--allow-cache` only when debugging the runner itself.

Resume checkpoints are tied to the selected prompt set, pass target, max rounds, cache policy, provider, and other non-model options. `--model` and `--fix-model` are ignored for resume compatibility, so a previous run can be continued with a different model under the same provider.

```bash
pnpm golden:harden -- --provider ollama --model qwen3.6 --passes 3
pnpm golden:harden -- --provider lm-studio --model qwen3.6 --passes 5
pnpm golden:harden -- --provider local --local-url http://localhost:8080/v1 --model custom-model --passes 3
pnpm golden:harden -- --slug primary-button --passes 3
pnpm golden:harden -- --slugs color-wheel-hue,autocomplete-search --passes 3 --max-rounds 30
pnpm golden:harden -- --difficulty simple --passes 2 --concurrency 1
pnpm golden:harden -- --provider ollama --model qwen3.6 --fix-provider claude --fix-model sonnet --passes 3
pnpm golden:harden -- --allow-cache --slug primary-button --passes 1
pnpm golden:harden -- --resume --provider claude --model sonnet --passes 3
pnpm golden:harden -- --resume --state-file /tmp/harden-state.json --provider claude --model sonnet --passes 3
```

Useful flags:

| Flag             | Default       | Description                                                                                     |
| ---------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `--passes`       | `3`           | Required clean-pass streak before moving to the next prompt                                     |
| `--max-rounds`   | `passes * 10` | Safety cap per prompt                                                                           |
| `--slug`         | all prompts   | Harden one prompt                                                                               |
| `--slugs`        | all prompts   | Harden a comma-separated prompt list                                                            |
| `--difficulty`   | all prompts   | Harden one difficulty group                                                                     |
| `--allow-cache`  | off           | Do not inject `--fresh`; useful only for runner debugging                                       |
| `--resume`       | off           | Continue prompt streaks from the checkpoint written by a previous run                           |
| `--state-file`   | tool default  | Use a named checkpoint file, useful for separate provider or prompt-selection windows           |
| `--reset-resume` | off           | Ignore an existing checkpoint and start fresh                                                   |
| provider options | Claude        | Passed through to `golden:fix-review`; structured source patching is inherited from that script |

### golden-prompts/

The index-derived prompt set contains validated implementations covering Tale UI React and chart components. Run `pnpm golden:validate` for the current total and difficulty breakdown.

Each file (`{slug}.json`) contains:

```json
{
  "slug": "primary-button",
  "difficulty": "simple",
  "prompt": "Create a primary action button that says 'Save changes'",
  "reference": "import { Button } from '@tale-ui/react/button';\n...",
  "tags": ["button"]
}
```

### validate-a2ui-golden-prompts.mjs

Runs deep multi-source validation on every A2UI golden prompt reference implementation in `a2ui-golden-prompts/`. Ensures references stay valid as the catalog evolves. Runs in CI.

**Validation pipeline (6 sources of truth):**

| Source                                                 | What it validates                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `registry/a2ui-catalog.json`                           | Component type names and per-type allowed prop names                                        |
| `tools/a2ui-catalog-metadata.js` `PROP_ALLOWED_VALUES` | Enum prop values with type-specific overrides (e.g. `Button.variant`)                       |
| `packages/a2ui/src/icon-registry.ts`                   | Valid Lucide icon names for `Icon` and `EmptyState` icon props                              |
| `packages/a2ui/src/catalog.ts` `mapTextHint()`         | Valid `usageHint` values for `Text` components                                              |
| Protocol structure                                     | `beginRendering` ordering, `rootComponentId` exists, no orphaned children, no duplicate IDs |

### eval-a2ui-golden-prompts.mjs

Runs each A2UI golden prompt against an LLM and scores the generated A2UI JSON across three automated levels:

| Level          | What it checks                                                              | How                                    |
| -------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| L1 — Validity  | Output passes multi-source catalog validation                               | Same 6-source check as validate script |
| L2 — Types     | All expected `tags` component types appear in `surfaceUpdate`               | Type key search in components array    |
| L3 — Structure | Protocol correctness (ordering, rootComponentId, no orphans, no duplicates) | Message structure parse                |

Supports the same three providers (Claude CLI, Straico, local) and the same flags as `eval-golden-prompts.mjs`. Not run in CI — intended for manual runs before releases or model upgrades. Uses separate cache files (`.eval-a2ui-call-cache.json`, `.eval-a2ui-check-cache.json`) so A2UI and TSX eval runs do not interfere.

```bash
pnpm a2ui:golden:eval                              # all prompts, default model (sonnet)
pnpm a2ui:golden:eval -- --model opus              # opus
pnpm a2ui:golden:eval -- --difficulty simple       # only simple prompts
pnpm a2ui:golden:eval -- --slug marketing-buttons  # single prompt
pnpm a2ui:golden:eval -- --slugs a,b,c             # specific prompts (comma-separated)
pnpm a2ui:golden:eval -- --json                    # machine-readable output
pnpm a2ui:golden:eval -- --no-cache                # skip call cache
pnpm a2ui:golden:eval -- --fresh                   # skip both caches (true benchmark run)
pnpm a2ui:golden:eval -- --provider straico --model gpt-4o
pnpm a2ui:golden:eval -- --provider ollama --model qwen2.5-coder
```

The Straico model shorthand table from `eval-golden-prompts.mjs` applies here too — same aliases, same pass-through behaviour for full model IDs.

**Example output:**

```text
=== A2UI Golden Prompt Eval — claude-sonnet-4-6 ===

  single-button                  [simple]   ✓ L1  ✓ L2  ✓ L3
  dashboard                      [complex]  ✓ L1  ✗ L2  ✓ L3
      L2: missing types: ProgressBar

──────────────────────────────────────────────────────
  Model:   claude-sonnet-4-6
  Overall: 40/41 passed all checks
  L1 validity:    41/41
  L2 types:       40/41
  L3 structure:   41/41
  simple  : 8/8
  medium  : 21/22
  complex : 11/11
```

### eval-a2ui-fix-review.mjs

Automated fix-review loop for the A2UI system prompt:

1. **Eval** — runs all A2UI golden prompts, collects failures
2. **Fix loop** — for each failure, Claude diagnoses the root cause against the specific source-of-truth violated (e.g. "`Button.variant`: `PROP_ALLOWED_VALUES` allows `primary|neutral|ghost|danger`, model used `outlined`") and proposes a targeted patch (`{old, new}`) to `packages/a2ui/src/agent/system-prompt.md`; re-evals the failing prompts; repeats up to 3 times
3. **Report** — prints before/after scores, what was fixed, what remains

After the run, check `git diff packages/a2ui/src/agent/system-prompt.md` to review any documentation changes before committing. Unlike `eval-fix-review.mjs`, there is no playground review step — A2UI output is JSON, not renderable TSX.

```bash
pnpm a2ui:golden:fix-review
pnpm a2ui:golden:fix-review -- --max-iter 5
pnpm a2ui:golden:fix-review -- --model haiku --fix-model sonnet
pnpm a2ui:golden:fix-review -- --provider straico --model gpt-4o
pnpm a2ui:golden:fix-review -- --provider ollama --model qwen2.5-coder --fix-provider claude --fix-model sonnet
```

### a2ui-golden-prompts/

The index-derived A2UI prompt set exercises the current catalog across simple, medium, and complex compositions:

- **simple** — Single/few-component prompts: Button, Badge, Text, Icon, Spinner, ProgressBar, Banner, EmptyState
- **medium** — Multi-component compositions: DataTable, ProfileCard, Card with footer, CheckboxGroup, Tabs, forms, Accordion, Settings pages, Card list, Avatar detail
- **complex** — Full UI patterns: Dashboard, DialogConfirm, DrawerPanel, Tooltip/Popover, DropdownMenu, ContextMenu, BreadcrumbNav, Pagination, NavigationBar, advanced form controls, form field wrappers, Select variants, PinInput/PaymentInput, date/time pickers, color controls, TagGroup/Disclosure, Carousel, Grid/Tree, FileUpload, DecorativeDisplay, MarketingButtons

Each file (`{slug}.json`) contains:

```json
{
  "slug": "marketing-buttons",
  "difficulty": "simple",
  "prompt": "Show a download section with an Apple App Store button, a Google Play Store button, and social login buttons for Google and GitHub.",
  "reference": {
    "messages": [
      { "type": "beginRendering", "surfaceId": "marketing", "rootComponentId": "root" },
      { "type": "surfaceUpdate", "surfaceId": "marketing", "components": [...] }
    ]
  },
  "tags": ["AppStoreButton", "SocialButton"]
}
```

The `reference.messages` array must pass `pnpm a2ui:golden:validate` — run it after any reference changes.

## A2UI Integration

The `@tale-ui/a2ui` package (`packages/a2ui/`) provides an A2UI protocol renderer that maps agent messages to Tale UI components. It includes:

| Artifact          | Path                                       | Purpose                                                 |
| ----------------- | ------------------------------------------ | ------------------------------------------------------- |
| Protocol types    | `packages/a2ui/src/types.ts`               | TypeScript types for A2UI messages, components, catalog |
| Catalog           | `packages/a2ui/src/catalog.ts`             | Maps registry-derived A2UI types to Tale UI components  |
| Icon registry     | `packages/a2ui/src/icon-registry.ts`       | 65 lucide-react icons resolvable by name string         |
| Renderer          | `packages/a2ui/src/renderer/`              | React provider, surface renderer, tree reconstruction   |
| Validator         | `packages/a2ui/src/validation/validate.ts` | Message + catalog validation with structured errors     |
| Agent prompt      | `packages/a2ui/src/agent/system-prompt.md` | LLM system prompt documenting the Tale UI A2UI catalog  |
| Few-shot examples | `packages/a2ui/src/agent/examples/`        | Validated example A2UI message sequences                |

**Anti-drift tooling:**

| Script                             | pnpm command                  | CI                     | Purpose                                                                                       |
| ---------------------------------- | ----------------------------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| `generate-a2ui-catalog-docs.js`    | `pnpm a2ui:generate-docs`     | `pnpm a2ui:check-docs` | Regenerates catalog tables in system-prompt.md and a2ui-integration.md from catalog.ts source |
| `validate-a2ui-examples.js`        | `pnpm a2ui:validate-examples` | Yes                    | Validates few-shot example JSON against live catalog (types, icons, usageHints, child refs)   |
| `audit-a2ui-catalog-docs.js`       | `pnpm a2ui:audit-docs`        | Yes                    | Cross-checks counts, type lists, and icon counts in all A2UI docs against source              |
| `validate-a2ui-golden-prompts.mjs` | `pnpm a2ui:golden:validate`   | Yes                    | Validates all indexed golden prompt references against the live catalog                       |
| `eval-a2ui-golden-prompts.mjs`     | `pnpm a2ui:golden:eval`       | No                     | Runs golden prompts against an LLM and scores generated A2UI JSON L1–L3                       |
| `eval-a2ui-fix-review.mjs`         | `pnpm a2ui:golden:fix-review` | No                     | Automated fix loop: eval → patch system-prompt.md → re-eval → repeat                          |

**When you change `catalog.ts` or `icon-registry.ts`**, run:

```bash
pnpm a2ui:generate-docs       # regenerate sentinel-delimited sections in docs
pnpm a2ui:validate-examples   # verify examples still valid
pnpm a2ui:audit-docs          # cross-check all docs
pnpm a2ui:golden:validate     # verify golden prompt references still valid
```

**Testing:**

```bash
pnpm vitest run --project @tale-ui/a2ui   # run the A2UI unit tests
pnpm playground:dev                        # open http://localhost:5173/a2ui for interactive demo
```

**Consumer guide:** See [docs/a2ui-integration.md](../docs/a2ui-integration.md).

## AI Rules & Prompts

| File                          | Purpose                                                |
| ----------------------------- | ------------------------------------------------------ |
| `prompts/self-critique.md`    | Second-pass validation checklist for AI-generated code |
| `eslint-restrict-imports.mjs` | Shareable ESLint config blocking non-Tale UI imports   |
| `component-audit-prompt.md`   | AI agent guide for deep component quality auditing     |

### prompts/self-critique.md

A 5-step validation checklist designed to be used as a second-pass prompt after code generation:

1. Verify all import paths exist in registry
2. Check compound vs simple usage (`.Root` or not)
3. Check common pitfalls (Drawer vs Dialog, Icon refs, Checkbox.Indicator, etc.)
4. Validate CSS tokens (no `--brand-*`, valid shade numbers, `--space-*` for spacing)
5. Fix and explain each issue found

### eslint-restrict-imports.mjs

A shareable ESLint flat config that warns when importing from competing component libraries (Chakra, MUI, Radix, Headless UI, Mantine, Ant Design, NextUI, shadcn). Consuming projects spread it into their ESLint config:

```js
import taleUiRestrictions from './path/to/eslint-restrict-imports.mjs';

export default [...yourConfig, taleUiRestrictions];
```
