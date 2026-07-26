# Workspace Structure

This monorepo is managed with **pnpm workspaces**.

## Directory Conventions

| Directory        | Purpose                                                     | Published to npm? |
| ---------------- | ----------------------------------------------------------- | ----------------- |
| `packages/`      | Shared, reusable libraries (CSS, component libs, utilities) | Yes               |
| `docs/`          | Next.js static documentation site                           | No                |
| `docs/upstream/` | Maintainer adoption logs for upstream dependency releases   | No                |
| `playground/`    | Development sandboxes (Storybook, Vite app, scale tool)     | No                |

| `apps/` | End-user applications | No |
| `scripts/` | Release, changelog, and API docs scripts | No |
| `tools/` | Audit, build, and release scripts ([README](../tools/README.md)) | No |

## Directory Layout

```
tale-ui/
├── package.json           # Workspace root (private)
├── pnpm-workspace.yaml    # Declares packages/*, apps/*, tools/*, etc.
├── packages/
│   ├── tokens/            # @tale-ui/tokens — canonical web/native token source
│   ├── css/               # @tale-ui/css — generated CSS tokens & utilities
│   ├── react/             # @tale-ui/react — styled React components
│   ├── styles/            # @tale-ui/react-styles — per-component CSS
│   ├── themes/            # @tale-ui/themes — optional standard and monochrome themes
│   └── utils/             # @tale-ui/utils — shared hooks & helpers
├── docs/                  # Next.js documentation site
├── playground/
│   ├── storybook/         # Component Storybook (stories, visual reference)
│   ├── vite-app/          # Minimal Vite + React sandbox
│   └── scale/             # Tonal palette generator tool

├── scripts/               # Release, changelog, API docs scripts
└── tools/                 # Audit, build, and release scripts (see tools/README.md)
```

## Packages

| Package                 | Path               | Description                                            |
| ----------------------- | ------------------ | ------------------------------------------------------ |
| `@tale-ui/tokens`       | `packages/tokens/` | Canonical token source and generated native objects    |
| `@tale-ui/css`          | `packages/css/`    | CSS tokens, foundations, layout utilities, themes      |
| `@tale-ui/react`        | `packages/react/`  | Styled React components (BEM class names auto-applied) |
| `@tale-ui/react-styles` | `packages/styles/` | Per-component CSS rules built on `@tale-ui/css` tokens |
| `@tale-ui/themes`       | `packages/themes/` | Optional standard and monochrome theme presets         |
| `@tale-ui/utils`        | `packages/utils/`  | Shared hooks, colour utilities, DOM helpers            |

## Workspace CLI Commands

```bash
pnpm install                                         # Install all workspace deps
pnpm --filter @tale-ui/tokens <cmd>                  # Generate or validate shared tokens
pnpm --filter @tale-ui/css <cmd>                     # Run command in a specific package
pnpm --filter @tale-ui/react <cmd>                  # Run command in another package
pnpm -r <cmd>                                        # Run command in all packages
pnpm --filter @tale-ui/my-app add pkg               # Add a dep to a specific package
```
