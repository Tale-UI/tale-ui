# Contributing to Tale UI

## Overview

Tale UI is a styled React component library built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/). Components are thin styled wrappers that apply BEM class names to React Aria primitives.

## Getting Started

```bash
pnpm install
pnpm playground:dev    # launch the development playground
pnpm test:jsdom        # run unit tests
```

See [CLAUDE.md](CLAUDE.md) for full development workflow and conventions.

## Before opening a pull request

Use the checks that match your change, then run the deterministic documentation
and generated-artifact gates:

```bash
pnpm typescript
pnpm test:jsdom --no-watch
pnpm audit:docs:semantics
pnpm generate-docs:check
pnpm markdownlint
pnpm prettier
```

Component changes must follow
[`docs/authoring-components.md`](docs/authoring-components.md) and include their
public docs, styles, stories, audit coverage, and golden guidance. See
[`test/README.md`](test/README.md) for focused browser, end-to-end, visual,
accessibility, and regression commands.

Generated documentation is not an independent editing surface. Follow
[`docs/documentation-governance.md`](docs/documentation-governance.md), change
the canonical source or generator, and run `pnpm generate-docs`.

Changes to React exports, declarations, package metadata, or shared package
build tooling must also pass `pnpm react:test:package`.
