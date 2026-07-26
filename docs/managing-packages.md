# Managing Packages

## Creating a New Package from Scratch

1. Create the directory: `packages/<name>/`, `apps/<name>/`, or `tools/<name>/`
2. Add a `package.json` with `"name": "@tale-ui/<name>"`
3. Mark apps and repository-only tooling as `"private": true`; public packages
   require `license`, `repository`, exports, package verification, and an
   approved release scope
4. Add a `CLAUDE.md` when the workspace has conventions beyond the root guide
5. Register lifecycle ownership and any required proposal/review evidence under
   `docs/governance/`
6. Run `pnpm install` from the root to link workspaces
7. Add the workspace to `docs/workspace-structure.md` and relevant root/package
   README tables
8. Run package tests plus `pnpm generate-docs:check`

## Importing an External Project

To bring an existing external project into the monorepo:

1. **Copy the project** into the appropriate subdirectory:

   ```bash
   cp -r /path/to/external-project apps/<name>
   # or for a package:
   cp -r /path/to/external-project packages/<name>
   ```

2. **Update its `package.json`** name to follow the workspace convention:

   ```json
   { "name": "@tale-ui/<name>" }
   ```

3. **Review provenance, licensing, and trust boundaries.** Do not copy private,
   generated, credential-bearing, or dependency build output into the repo.

4. **Add a `CLAUDE.md`** when the imported workspace needs scoped conventions.

5. **Run `pnpm install`** from the monorepo root to link the new workspace:

   ```bash
   pnpm install
   ```

6. **Verify** the package is recognized:

   ```bash
   pnpm --filter @tale-ui/<name> <cmd>
   ```

7. **Reconcile documentation and governance** as for a new package, then run its
   tests, build/package checks, and `pnpm generate-docs:check`.

> **Git submodules:** Introducing a submodule changes repository and release
> topology. Use one only after an explicit architecture/release decision.

> **Windows note:** `git mv` fails with "Permission denied" when VSCode has files open. Use `cp -r` + `git rm --cached` + `git add` instead.
