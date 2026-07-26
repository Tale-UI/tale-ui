# Managing Packages

## Creating a New Package from Scratch

1. Create the directory: `packages/<name>/`, `apps/<name>/`, or `tools/<name>/`
2. Add a `package.json` with `"name": "@tale-ui/<name>"`
3. Add a `CLAUDE.md` documenting conventions for that package
4. Run `pnpm install` from the root to link workspaces

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

3. **Add a `CLAUDE.md`** to the package documenting its conventions (if it doesn't have one)

4. **Run `pnpm install`** from the monorepo root to link the new workspace:
   ```bash
   pnpm install
   ```

5. **Verify** the package is recognized:
   ```bash
   pnpm --filter @tale-ui/<name> <cmd>
   ```

> **Git submodules:** If the external project must keep its own independent git history, use a submodule instead:
> `git submodule add <repo-url> packages/<name>`

> **Windows note:** `git mv` fails with "Permission denied" when VSCode has files open. Use `cp -r` + `git rm --cached` + `git add` instead.
