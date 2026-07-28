# @tale-ui/foundations

Renderer-neutral design-system contracts for themes, component state, and
portable style recipes.

## Boundaries

- Never import React, React DOM, React Native, Expo, Storybook, browser globals,
  or application code.
- Keep all outputs deterministic, immutable, and serializable.
- Public errors start with `Tale UI:`, explain the problem, and point to a fix.
- Portable recipes contain no selectors, pseudo-elements, media queries,
  native responder details, or runtime CSS parsing.

## Verification

Run `pnpm test`, `pnpm typescript`, `pnpm build`, and `pnpm test:package`.
