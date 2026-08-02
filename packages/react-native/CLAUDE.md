# @tale-ui/react-native

Native Tale UI components for iOS, Android, and explicitly declared React
Native Web surfaces.

## Boundaries

- Depend on `@tale-ui/foundations` and `@tale-ui/tokens`, never
  `@tale-ui/themes`, React DOM, Expo, or Storybook.
- Use React Native primitives, native accessibility roles/state/actions, and
  component-scoped refs.
- Keep platform divergence explicit in platform files.
- Never parse CSS at runtime.
- Export every public component through an explicit package subpath.

## Verification

Run `pnpm test`, `pnpm typescript`, `pnpm build`, and `pnpm test:package`.
