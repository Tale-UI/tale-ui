import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig, defineProject } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import sharedConfig from '../../vitest.shared.mts';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  sharedConfig,
  defineProject({
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
    },
    resolve: {
      alias: {
        '@tale-ui/foundations': resolve(currentDirectory, '../foundations/src'),
        '@tale-ui/utils': resolve(currentDirectory, '../utils/src'),
      },
    },
  }),
);
