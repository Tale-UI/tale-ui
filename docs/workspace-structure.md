# Workspace Structure

This monorepo is managed with **pnpm workspaces**.

## Directory Conventions

| Directory                   | Purpose                                                                         | Published to npm?                     |
| --------------------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| `packages/`                 | Reusable public packages                                                        | Package-specific                      |
| `apps/`                     | Private hosted services and maintainer applications                             | No                                    |
| `docs/`                     | Current documentation, public Next.js site, versioned snapshots, and governance | No                                    |
| `docs/upstream/`            | Maintainer adoption logs for upstream dependency releases                       | No                                    |
| `registry/sources/roadmap/` | Canonical roadmap inventories and disposition evidence                          | No                                    |
| `test/baselines/roadmap/`   | Maintained benchmark and repository-gate baselines                              | No                                    |
| `analysis/`                 | Ignored local development and research notes                                    | No                                    |
| `playground/`               | Storybook, Vite component playground, and colour-scale playground               | No                                    |
| `scripts/`                  | Release and repository automation                                               | No                                    |
| `tools/`                    | Audit, generation, evaluation, build, and release scripts                       | No                                    |
| `test/`                     | Shared unit helpers, browser projects, visual tests, and fixtures               | Workspace packages only; not released |

## Directory Layout

```
tale-ui/
├── package.json           # Workspace root (private)
├── pnpm-workspace.yaml    # Declares packages/*, apps/*, tools/*, etc.
├── packages/
│   ├── tokens/            # @tale-ui/tokens — canonical web/native token source
│   ├── foundations/       # @tale-ui/foundations — renderer-neutral contracts
│   ├── css/               # @tale-ui/css — generated CSS tokens & utilities
│   ├── react/             # @tale-ui/react — styled React components
│   ├── react-native/      # @tale-ui/react-native — native components
│   ├── styles/            # @tale-ui/react-styles — per-component CSS
│   ├── themes/            # @tale-ui/themes — optional standard and monochrome themes
│   ├── charts/            # @tale-ui/charts — Recharts-based chart components
│   ├── a2ui/              # @tale-ui/a2ui — protocol renderer and catalog
│   ├── tooling/           # @tale-ui/tooling — registry API, CLI, validation, operations
│   └── utils/             # @tale-ui/utils — shared hooks & helpers
├── apps/
│   ├── hosted-mcp/        # restricted Cloudflare Worker MCP surface
│   ├── metrics-dashboard/ # generated adoption and health dashboard
│   ├── mcp-studio/        # prompt/plan/render/pitfall maintainer studio
│   ├── recipe-studio/     # recipe authoring and preview app
│   └── tooling-dashboard/ # local tooling and roadmap dashboard
├── docs/                  # source docs, Next.js site, and versioned public snapshots
├── playground/
│   ├── storybook/         # Component Storybook (stories, visual reference)
│   ├── react-native-storybook/ # Expo/on-device native Storybook
│   ├── vite-app/          # Minimal Vite + React sandbox
│   └── scale/             # Tonal palette generator tool
├── scripts/               # Release, changelog, API docs scripts
├── test/                  # Shared unit, browser, visual, and end-to-end testing
└── tools/                 # Audit, generation, eval, build, and release scripts
```

## Packages

| Package                 | Path                     | Description                                            |
| ----------------------- | ------------------------ | ------------------------------------------------------ |
| `@tale-ui/tokens`       | `packages/tokens/`       | Canonical token source and generated native objects    |
| `@tale-ui/foundations`  | `packages/foundations/`  | Renderer-neutral themes, contracts, state, recipes     |
| `@tale-ui/css`          | `packages/css/`          | CSS tokens, foundations, layout utilities, themes      |
| `@tale-ui/react`        | `packages/react/`        | Styled React components (BEM class names auto-applied) |
| `@tale-ui/react-native` | `packages/react-native/` | Native components and behavior adapters                |
| `@tale-ui/react-styles` | `packages/styles/`       | Per-component CSS rules built on `@tale-ui/css` tokens |
| `@tale-ui/themes`       | `packages/themes/`       | Optional standard and monochrome theme presets         |
| `@tale-ui/charts`       | `packages/charts/`       | Recharts-based chart components                        |
| `@tale-ui/a2ui`         | `packages/a2ui/`         | A2UI protocol renderer and Tale UI catalog             |
| `@tale-ui/tooling`      | `packages/tooling/`      | Registry API, CLI, validation, and project operations  |
| `@tale-ui/utils`        | `packages/utils/`        | Shared hooks, colour utilities, DOM helpers            |

## Workspace CLI Commands

```bash
pnpm install                                         # Install all workspace deps
pnpm --filter @tale-ui/tokens <cmd>                  # Generate or validate shared tokens
pnpm --filter @tale-ui/css <cmd>                     # Run command in a specific package
pnpm --filter @tale-ui/react <cmd>                  # Run command in another package
pnpm -r <cmd>                                        # Run command in all packages
pnpm --filter @tale-ui/my-app add pkg               # Add a dep to a specific package
```

The workspace globs in `pnpm-workspace.yaml` are authoritative. Run
`pnpm --filter <package-name> <command>` rather than relying on the current
directory when documenting repository-level workflows.
