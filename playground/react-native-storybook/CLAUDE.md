# React Native Storybook

Dedicated Expo/on-device Storybook for `@tale-ui/react-native`.

- Keep Storybook and Expo dependencies in this host, never the component
  package.
- Use entry-point swapping so Storybook is absent from normal application
  bundles.
- Every implemented native component needs an All Variations story.
- Record expected VoiceOver and TalkBack behavior in story parameters.
