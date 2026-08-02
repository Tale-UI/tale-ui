#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, lstat, mkdir, mkdtemp, readFile, rm, stat, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const metadata = async (path) => {
  const value = await stat(path);
  return {
    mode: value.mode,
    size: value.size,
    mtimeMs: value.mtimeMs,
  };
};

export async function checkStorybookLoader({
  root = ROOT,
  temporaryParent = tmpdir(),
  onTemporaryRoot,
} = {}) {
  const project = join(root, 'playground/react-native-storybook');
  const configuration = join(project, '.rnstorybook');
  const loader = join(configuration, 'storybook.requires.ts');
  const main = join(configuration, 'main.ts');
  const preview = join(configuration, 'preview.tsx');
  const source = join(project, 'src');
  const executable = join(
    project,
    'node_modules/.bin',
    process.platform === 'win32' ? 'sb-rn-get-stories.cmd' : 'sb-rn-get-stories',
  );

  for (const required of [loader, main, preview, source, executable]) {
    await lstat(required);
  }
  const repositoryBytes = await readFile(loader);
  const repositoryMetadata = await metadata(loader);
  const temporaryRoot = await mkdtemp(join(temporaryParent, 'tale-native-storybook-loader-'));
  onTemporaryRoot?.(temporaryRoot);

  try {
    const temporaryConfiguration = join(temporaryRoot, '.rnstorybook');
    await mkdir(temporaryConfiguration);
    await cp(source, join(temporaryRoot, 'src'), { recursive: true });
    await cp(main, join(temporaryConfiguration, 'main.ts'), { recursive: true });
    await cp(preview, join(temporaryConfiguration, 'preview.tsx'), { recursive: true });
    await symlink(join(project, 'node_modules'), join(temporaryRoot, 'node_modules'), 'dir');

    await execFileAsync(executable, ['--config-path', './.rnstorybook'], {
      cwd: temporaryRoot,
      encoding: 'utf8',
    });
    const candidate = await readFile(join(temporaryConfiguration, 'storybook.requires.ts'));
    assert.deepEqual(
      candidate,
      repositoryBytes,
      'React Native Storybook loader is stale; run pnpm native:storybook:generate.',
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }

  assert.deepEqual(
    await readFile(loader),
    repositoryBytes,
    'Loader check modified the tracked React Native Storybook loader.',
  );
  assert.deepEqual(
    await metadata(loader),
    repositoryMetadata,
    'Loader check modified tracked loader metadata.',
  );
  return { temporaryRoot, repositoryMetadata };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await checkStorybookLoader();
  process.stdout.write('OK: isolated React Native Storybook loader matches the tracked loader.\n');
}
