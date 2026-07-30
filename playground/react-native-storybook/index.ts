import { registerRootComponent } from 'expo';

const App =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./.rnstorybook').default
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./src/App').default;

registerRootComponent(App);
