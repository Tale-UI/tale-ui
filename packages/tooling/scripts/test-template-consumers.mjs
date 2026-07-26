#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repositoryRoot = resolve(packageRoot, '../..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const skipToolingBuild = process.argv.includes('--tooling-built');
const skipPackageBuilds = process.argv.includes('--packages-built');
const expectedTemplateIds = [
  'tale:template:app-header',
  'tale:template:chart-dashboard',
  'tale:template:chat-artifact-panel',
  'tale:template:chat-mobile',
  'tale:template:command-palette-dashboard',
  'tale:template:empty-state',
  'tale:template:loading-patterns',
  'tale:template:react-hook-form',
  'tale:template:settings-page',
  'tale:template:sidebar-header',
  'tale:template:sortable-table',
  'tale:template:validated-form',
];
const localPackages = [
  {
    name: '@tale-ui/css',
    directory: 'packages/css',
    build: true,
  },
  {
    name: '@tale-ui/react-styles',
    directory: 'packages/styles',
    build: false,
  },
  {
    name: '@tale-ui/utils',
    directory: 'packages/utils',
    build: true,
  },
  {
    name: '@tale-ui/react',
    directory: 'packages/react',
    build: true,
  },
  {
    name: '@tale-ui/charts',
    directory: 'packages/charts',
    build: true,
  },
  {
    name: '@tale-ui/tooling',
    directory: 'packages/tooling',
    build: !skipToolingBuild,
  },
];

const fixtureRoot = await mkdtemp(join(tmpdir(), 'tale-template-consumers-'));
const packRoot = join(fixtureRoot, 'packs');
const consumerRoot = join(fixtureRoot, 'consumer');

function runPnpm(args, options = {}) {
  return execFileSync(pnpm, args, {
    cwd: options.cwd ?? repositoryRoot,
    stdio: options.stdio ?? 'inherit',
    encoding: options.encoding,
  });
}

async function packWorkspace({ name, directory }) {
  const destination = join(packRoot, name.replace(/^@/, '').replace('/', '-'));
  await mkdir(destination);
  runPnpm(
    [
      '--dir',
      join(repositoryRoot, directory),
      'pack',
      '--pack-destination',
      destination,
      '--silent',
    ],
    { cwd: repositoryRoot, stdio: 'pipe' },
  );
  const created = (await readdir(destination)).filter((file) => file.endsWith('.tgz'));
  assert.equal(created.length, 1, `Expected one packed tarball for ${name}.`);
  return join(destination, created[0]);
}

try {
  await mkdir(packRoot);
  await mkdir(consumerRoot);

  for (const entry of localPackages) {
    if (entry.build && !skipPackageBuilds) {
      runPnpm(['--filter', entry.name, 'build']);
    }
  }

  const tarballs = Object.fromEntries(
    await Promise.all(localPackages.map(async (entry) => [entry.name, await packWorkspace(entry)])),
  );
  const localDependencies = Object.fromEntries(
    Object.entries(tarballs).map(([name, tarball]) => [name, `file:${tarball}`]),
  );

  await writeFile(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'tale-template-packed-consumer',
        private: true,
        type: 'module',
        dependencies: {
          ...localDependencies,
          '@types/react': '19.2.14',
          '@types/react-dom': '19.2.3',
          'lucide-react': '^0.468.0',
          react: '19.2.4',
          'react-dom': '19.2.4',
          'react-hook-form': '^7.62.0',
          recharts: '^3.8.1',
          typescript: '5.9.3',
        },
        pnpm: {
          overrides: localDependencies,
        },
      },
      null,
      2,
    )}\n`,
  );
  runPnpm(
    [
      'install',
      '--ignore-scripts',
      '--strict-peer-dependencies=false',
      '--config.engine-strict=true',
    ],
    { cwd: consumerRoot },
  );

  const packedReactManifest = JSON.parse(
    await readFile(join(consumerRoot, 'node_modules/@tale-ui/react/package.json'), 'utf8'),
  );
  assert.equal(
    packedReactManifest.version,
    '3.0.0',
    'Template consumers must compile against packed @tale-ui/react 3.0.0.',
  );

  const frameworkRoots = Object.fromEntries(
    await Promise.all(
      ['vite', 'next'].map(async (framework) => {
        const root = join(consumerRoot, framework);
        await mkdir(root);
        await cp(
          new URL(`../fixtures/template-consumers/${framework}/tsconfig.json`, import.meta.url),
          join(root, 'tsconfig.json'),
        );
        return [framework, root];
      }),
    ),
  );

  const materializeProgram = `
    import { addTemplate, listTemplates } from '@tale-ui/tooling/materialize';

    const frameworkRoots = JSON.parse(process.env.TALE_TEMPLATE_FRAMEWORK_ROOTS);
    const templates = await listTemplates();
    for (const [framework, root] of Object.entries(frameworkRoots)) {
      for (const template of templates) {
        const slug = template.id.slice('tale:template:'.length);
        for (const variant of ['source', 'skeleton']) {
          await addTemplate({
            schemaVersion: '1.0.0',
            requestId: \`template-consumer-\${framework}-\${slug}-\${variant}\`,
            root,
            idempotencyKey: \`template-consumer-\${framework}-\${slug}-\${variant}\`,
            template: template.id,
            target: \`src/templates/\${slug}.\${variant}.tsx\`,
            skeleton: variant === 'skeleton',
            addDependencies: false,
          });
        }
      }
    }
    process.stdout.write(JSON.stringify(templates));
  `;
  const materializedOutput = execFileSync(
    process.execPath,
    ['--input-type=module', '--eval', materializeProgram],
    {
      cwd: consumerRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        TALE_TEMPLATE_FRAMEWORK_ROOTS: JSON.stringify(frameworkRoots),
      },
    },
  );
  const templates = JSON.parse(materializedOutput);
  assert.deepEqual(
    templates.map(({ id }) => id),
    expectedTemplateIds,
    'Packed Tooling must expose exactly the 12 maintained template IDs.',
  );

  for (const template of templates) {
    assert.equal(template.schemaVersion, '1.0.0', `${template.id} schemaVersion changed.`);
    assert.equal(template.version, '2.0.0', `${template.id} content version changed.`);
    assert.equal(
      template.dependencies['@tale-ui/react'],
      '^3.0.0',
      `${template.id} does not target React 3.`,
    );
    assert.equal(
      template.compatibility.tale,
      '>=3.0.0 <4.0.0',
      `${template.id} Tale compatibility changed.`,
    );
    assert.deepEqual(
      template.compatibility.frameworks,
      ['next', 'vite'],
      `${template.id} must remain compatible with Next and Vite.`,
    );
    assert.match(template.source, /^source\/.+\.tsx$/, `${template.id} source asset is invalid.`);
    assert.match(
      template.skeleton,
      /^skeleton\/.+\.tsx$/,
      `${template.id} skeleton asset is invalid.`,
    );
  }

  await Promise.all(
    templates.flatMap((template) => {
      const slug = template.id.slice('tale:template:'.length);
      return Object.values(frameworkRoots).flatMap((root) =>
        ['source', 'skeleton'].map(async (variant) => {
          const materialized = join(root, `src/templates/${slug}.${variant}.tsx`);
          await access(materialized);
          assert.ok(
            (await readFile(materialized, 'utf8')).trim().length > 0,
            `${template.id} ${variant} materialized as an empty asset.`,
          );
        }),
      );
    }),
  );

  for (const [framework, root] of Object.entries(frameworkRoots)) {
    runPnpm(['exec', 'tsc', '--project', join(root, 'tsconfig.json')], {
      cwd: consumerRoot,
    });
    process.stdout.write(
      `Compiled ${templates.length * 2} packed template variants for ${framework}.\n`,
    );
  }

  process.stdout.write(
    `Validated ${templates.length} maintained templates from packed Tooling against packed React ${packedReactManifest.version}.\n`,
  );
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}
