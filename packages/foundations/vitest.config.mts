import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineProject } from 'vitest/config';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default defineProject({
  resolve: {
    alias: {
      '@tale-ui/tokens/native': resolve(currentDirectory, '../tokens/src/native.ts'),
    },
  },
  test: {
    name: '@tale-ui/foundations',
    environment: 'node',
  },
});
