#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixtureRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(fixtureRoot, '../../..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const platformIndex = process.argv.indexOf('--platform');
const requestedPlatform = platformIndex >= 0 ? process.argv[platformIndex + 1] : 'all';
const platforms = requestedPlatform === 'all' ? ['ios', 'android'] : [requestedPlatform];

assert.ok(
  platforms.every((platform) => platform === 'ios' || platform === 'android'),
  `Unsupported platform: ${requestedPlatform}`,
);

const temporaryRoot = mkdtempSync(join(tmpdir(), 'tale-native-packed-'));
const packRoot = join(temporaryRoot, 'packs');
mkdirSync(packRoot);

function run(command, arguments_, options = {}) {
  execFileSync(command, arguments_, {
    stdio: 'inherit',
    ...options,
  });
}

function packBuiltPackage(relativeDirectory) {
  const before = new Set(readdirSync(packRoot));
  run(pnpm, ['pack', '--pack-destination', packRoot, '--silent'], {
    cwd: join(repositoryRoot, relativeDirectory),
  });
  const created = readdirSync(packRoot).filter(
    (name) => name.endsWith('.tgz') && !before.has(name),
  );
  assert.equal(created.length, 1, `Expected one tarball from ${relativeDirectory}.`);
  return join(packRoot, created[0]);
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function createConsumer(name, dependencies) {
  const root = join(temporaryRoot, name);
  mkdirSync(root);
  copyFileSync(join(fixtureRoot, 'App.tsx'), join(root, 'App.tsx'));
  writeJson(join(root, 'package.json'), {
    name: `tale-ui-${name}`,
    private: true,
    version: '0.0.0',
    dependencies,
    devDependencies: {
      '@types/react': '19.2.14',
      typescript: '~6.0.3',
    },
    pnpm: {
      overrides: {
        '@tale-ui/tokens': dependencies['@tale-ui/tokens'],
        '@tale-ui/foundations': dependencies['@tale-ui/foundations'],
      },
    },
  });
  writeJson(join(root, 'tsconfig.json'), {
    compilerOptions: {
      allowJs: false,
      esModuleInterop: true,
      jsx: 'react-jsx',
      lib: ['ES2023'],
      module: 'Preserve',
      moduleResolution: 'Bundler',
      noEmit: true,
      resolveJsonModule: true,
      skipLibCheck: true,
      strict: true,
      target: 'ES2022',
      types: ['react'],
    },
    include: ['App.tsx'],
  });
  return root;
}

try {
  for (const packageName of ['@tale-ui/tokens', '@tale-ui/foundations', '@tale-ui/react-native']) {
    run(pnpm, ['--filter', packageName, 'build'], { cwd: repositoryRoot });
  }

  const tokensTarball = packBuiltPackage('packages/tokens/build');
  const foundationsTarball = packBuiltPackage('packages/foundations/build');
  const nativeTarball = packBuiltPackage('packages/react-native/build');
  const taleDependencies = {
    '@tale-ui/tokens': `file:${tokensTarball}`,
    '@tale-ui/foundations': `file:${foundationsTarball}`,
    '@tale-ui/react-native': `file:${nativeTarball}`,
  };

  const expoRoot = createConsumer('expo-packed-consumer', {
    ...taleDependencies,
    expo: '57.0.8',
    react: '19.2.3',
    'react-native': '0.86.0',
  });
  writeJson(join(expoRoot, 'app.json'), {
    expo: {
      name: 'Tale UI packed Expo consumer',
      slug: 'tale-ui-packed-expo-consumer',
      version: '0.0.0',
      newArchEnabled: true,
      ios: { deploymentTarget: '16.4' },
      android: { minSdkVersion: 24 },
    },
  });
  writeFileSync(
    join(expoRoot, 'metro.config.cjs'),
    "const { getDefaultConfig } = require('expo/metro-config');\n" +
      'module.exports = getDefaultConfig(__dirname);\n',
  );

  const plainRoot = createConsumer('plain-packed-consumer', {
    ...taleDependencies,
    '@babel/runtime': '^7.28.6',
    '@react-native-community/cli': '20.2.0',
    '@react-native/metro-config': '0.86.0',
    react: '19.2.3',
    'react-native': '0.86.0',
  });
  writeFileSync(
    join(plainRoot, 'index.js'),
    "import { AppRegistry } from 'react-native';\n" +
      "import App from './App';\n" +
      "AppRegistry.registerComponent('TaleUIPackedConsumer', () => App);\n",
  );
  writeFileSync(
    join(plainRoot, 'metro.config.cjs'),
    "const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');\n" +
      'module.exports = mergeConfig(getDefaultConfig(__dirname), {\n' +
      '  resolver: { unstable_enablePackageExports: true },\n' +
      '});\n',
  );

  for (const consumerRoot of [expoRoot, plainRoot]) {
    run(
      pnpm,
      [
        'install',
        '--ignore-workspace',
        '--strict-peer-dependencies=true',
        '--config.side-effects-cache=false',
      ],
      { cwd: consumerRoot },
    );
    run(pnpm, ['exec', 'tsc', '--noEmit'], { cwd: consumerRoot });
  }

  for (const platform of platforms) {
    run(
      pnpm,
      ['exec', 'expo', 'export', '--platform', platform, '--output-dir', `dist-${platform}`],
      { cwd: expoRoot },
    );
    run(
      pnpm,
      [
        'exec',
        'react-native',
        'bundle',
        '--entry-file',
        'index.js',
        '--platform',
        platform,
        '--dev',
        'false',
        '--minify',
        'true',
        '--bundle-output',
        `dist-${platform}/index.bundle`,
        '--sourcemap-output',
        `dist-${platform}/index.bundle.map`,
      ],
      { cwd: plainRoot },
    );
  }

  const packedManifest = JSON.parse(
    readFileSync(join(plainRoot, 'node_modules/@tale-ui/react-native/package.json'), 'utf8'),
  );
  for (const forbidden of ['expo', 'react-dom', '@tale-ui/themes', 'storybook']) {
    assert.equal(
      packedManifest.dependencies?.[forbidden],
      undefined,
      `Packed native package must not depend on ${forbidden}.`,
    );
  }
  assert.ok(packedManifest.exports['./provider']);
  assert.ok(packedManifest.exports['./button']);

  process.stdout.write(
    `Packed Expo and plain React Native consumers passed for ${platforms.join(', ')}.\n`,
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
