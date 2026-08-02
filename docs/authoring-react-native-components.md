# Authoring React Native components

Native components share Tale UI decisions, not DOM mechanics.

1. Add or update a renderer-neutral contract and recipe in
   `@tale-ui/foundations` only when that exact contract or portable recipe
   exists.
2. Implement native interaction and accessibility using React Native
   primitives in `@tale-ui/react-native`.
3. Add an explicit package subpath export and a matching record in
   `registry/platforms/react-native-implementations.json`.
4. Record disposition overrides, including native alternatives without
   implementations, in
   `registry/platforms/react-native-disposition-overrides.json`.
5. Add the component's category, serializable property controls, event actions,
   descriptions, and any non-serializable exclusion rationale to
   `tools/generate-react-native-stories.mjs`. Add its visual fixture to
   `Registry.fixtures.tsx`; the generator creates its component-level
   `Playground` and `All Variations` stories.
6. Add state, package, device, RTL, dynamic-type, reduced-motion, and
   performance evidence appropriate to the component.
7. Run `native:surface:check`, native registry, conformance, type, package,
   `native:storybook:check`, and Storybook build checks.

Do not add DOM events, ARIA props, CSS parsing, global focus traps, or Expo
runtime dependencies to the component package.
