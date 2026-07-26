import { mergeConfig, defineProject } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
// eslint-disable-next-line import/no-relative-packages
import sharedConfig from '../../vitest.shared.mts';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      environment: 'node',
      testTimeout: (process.env.CI ? 4 : 2) * 1000,
      browser: {
        provider: playwright(),
        enabled: false,
        instances: [{ browser: 'chromium' }],
      },
      env: {
        VITEST_ENV: 'node',
      },
    },
  }),
);
