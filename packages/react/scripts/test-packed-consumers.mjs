#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repositoryRoot = resolve(packageRoot, '../..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const matrix = JSON.parse(
  await readFile(join(packageRoot, 'test/packed-consumers/matrix.json'), 'utf8'),
);
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
assert.equal(matrix.schemaVersion, '1.0.0');

function readOption(name, environmentName, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : (process.env[environmentName] ?? fallback);
}

const nodeMajor = Number(
  readOption('--node-major', 'TALE_PACKED_NODE_MAJOR', process.versions.node.split('.')[0]),
);
const reactMajor = Number(readOption('--react-major', 'TALE_PACKED_REACT_MAJOR', 19));
assert.ok(matrix.nodeMajors.includes(nodeMajor), `Unsupported Node matrix major: ${nodeMajor}`);
assert.equal(
  Number(process.versions.node.split('.')[0]),
  nodeMajor,
  `This process is Node ${process.versions.node}; run it under Node ${nodeMajor}.`,
);
assert.ok(matrix.reactMajors.includes(reactMajor), `Unsupported React matrix major: ${reactMajor}`);

const fixtureRoot = await mkdtemp(join(tmpdir(), 'tale-react-packed-'));
const packRoot = join(fixtureRoot, 'packs');
const consumerRoot = join(fixtureRoot, 'consumer');
const prebuiltDirectory = process.env.TALE_PACKED_TARBALL_DIR;
const prebuiltBuildNodeMajor = Number(process.env.TALE_PACKED_BUILD_NODE_MAJOR);

async function packWorkspace(relativeDirectory) {
  const directory = join(repositoryRoot, relativeDirectory);
  const before = new Set(await readdir(packRoot));
  execFileSync(pnpm, ['--dir', directory, 'pack', '--pack-destination', packRoot, '--silent'], {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
  const created = (await readdir(packRoot)).filter(
    (file) => file.endsWith('.tgz') && !before.has(file),
  );
  assert.equal(created.length, 1, `Expected one tarball from ${relativeDirectory}.`);
  return join(packRoot, created[0]);
}

async function resolveTarball(packageName, environmentName, relativeDirectory) {
  const explicit = process.env[environmentName];
  if (explicit) {
    return resolve(explicit);
  }
  if (prebuiltDirectory) {
    const stem = packageName.replace(/^@/, '').replace('/', '-');
    const pattern = new RegExp(`^${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d.*\\.tgz$`);
    const matches = (await readdir(resolve(prebuiltDirectory))).filter((file) =>
      pattern.test(file),
    );
    assert.equal(matches.length, 1, `Expected one ${packageName} tarball in ${prebuiltDirectory}.`);
    return join(resolve(prebuiltDirectory), matches[0]);
  }
  return packWorkspace(relativeDirectory);
}

try {
  await mkdir(packRoot);
  await mkdir(consumerRoot);

  const individualTarballVariables = [
    'TALE_CSS_TARBALL',
    'TALE_STYLES_TARBALL',
    'TALE_UTILS_TARBALL',
    'TALE_REACT_TARBALL',
  ];
  const suppliedIndividualTarballs = individualTarballVariables.filter((name) => process.env[name]);
  if (!prebuiltDirectory && suppliedIndividualTarballs.length > 0) {
    assert.equal(
      suppliedIndividualTarballs.length,
      individualTarballVariables.length,
      `Supply all of ${individualTarballVariables.join(', ')} or use TALE_PACKED_TARBALL_DIR.`,
    );
  }
  const usesPrebuiltTarballs = Boolean(prebuiltDirectory || suppliedIndividualTarballs.length > 0);
  if (usesPrebuiltTarballs) {
    assert.equal(
      prebuiltBuildNodeMajor,
      matrix.packNodeMajor,
      `Prebuilt tarballs must declare TALE_PACKED_BUILD_NODE_MAJOR=${matrix.packNodeMajor}.`,
    );
  } else {
    execFileSync(pnpm, ['--filter', '@tale-ui/utils', 'build'], {
      cwd: repositoryRoot,
      stdio: 'inherit',
    });
    execFileSync(pnpm, ['--filter', '@tale-ui/react', 'build'], {
      cwd: repositoryRoot,
      stdio: 'inherit',
    });
  }

  const cssTarball = await resolveTarball('@tale-ui/css', 'TALE_CSS_TARBALL', 'packages/css');
  const stylesTarball = await resolveTarball(
    '@tale-ui/react-styles',
    'TALE_STYLES_TARBALL',
    'packages/styles',
  );
  const utilsTarball = await resolveTarball(
    '@tale-ui/utils',
    'TALE_UTILS_TARBALL',
    'packages/utils',
  );
  const reactTarball = await resolveTarball(
    '@tale-ui/react',
    'TALE_REACT_TARBALL',
    'packages/react',
  );

  const peerDependencies = { ...packageJson.peerDependencies };
  peerDependencies.react = matrix.reactVersions[String(reactMajor)];
  peerDependencies['react-dom'] = matrix.reactVersions[String(reactMajor)];
  peerDependencies['@types/react'] = matrix.reactTypeVersions[String(reactMajor)];

  await writeFile(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'tale-react-packed-consumer',
        private: true,
        type: 'module',
        dependencies: {
          ...peerDependencies,
          '@tale-ui/css': `file:${cssTarball}`,
          '@tale-ui/react-styles': `file:${stylesTarball}`,
          '@tale-ui/utils': `file:${utilsTarball}`,
          '@tale-ui/react': `file:${reactTarball}`,
          '@types/react-dom': matrix.reactDomTypeVersions[String(reactMajor)],
          '@modelcontextprotocol/sdk': packageJson.dependencies['@modelcontextprotocol/sdk'],
          esbuild: '0.27.3',
          jsdom: '24.1.3',
          'react-aria': packageJson.dependencies['react-aria'],
          typescript: '5.9.3',
        },
        pnpm: {
          onlyBuiltDependencies: ['@tale-ui/react'],
          overrides: {
            '@tale-ui/css': `file:${cssTarball}`,
            '@tale-ui/react-styles': `file:${stylesTarball}`,
            '@tale-ui/utils': `file:${utilsTarball}`,
          },
        },
      },
      null,
      2,
    )}\n`,
  );
  execFileSync(
    pnpm,
    [
      'install',
      '--strict-peer-dependencies=true',
      '--config.engine-strict=true',
      '--config.side-effects-cache=false',
    ],
    {
      cwd: consumerRoot,
      stdio: 'inherit',
    },
  );

  const consumerInstructions = await readFile(join(consumerRoot, 'CLAUDE.md'), 'utf8');
  assert.match(
    consumerInstructions,
    /## UI Components \(@tale-ui\/react\)/,
    'The packed postinstall must materialize consumer guidance.',
  );

  const installedReactRoot = join(consumerRoot, 'node_modules/@tale-ui/react');
  const installedUtilsRoot = join(consumerRoot, 'node_modules/@tale-ui/utils');
  const installedReactDocs = await readdir(join(installedReactRoot, 'docs'));
  assert.ok(
    !installedReactDocs.some((name) =>
      ['.next', 'archive', 'node_modules', 'out', 'src', 'versioned'].includes(name),
    ),
    'The packed React runtime docs must exclude site/cache/history trees.',
  );
  assert.deepEqual(
    [...(await readdir(join(installedReactRoot, 'registry')))].sort(),
    ['a2ui-catalog.json', 'components.json', 'pitfalls.json'],
    'The packed React registry must contain only MCP runtime data.',
  );
  const installedUtilsEntries = await readdir(installedUtilsRoot);
  for (const forbidden of ['docs', 'registry', 'mcp-core.mjs', 'mcp-server.mjs']) {
    assert.ok(
      !installedUtilsEntries.includes(forbidden),
      `The packed Utils package must not contain React runtime asset ${forbidden}.`,
    );
  }
  const setupBinary = join(
    consumerRoot,
    `node_modules/.bin/tale-ui-setup${process.platform === 'win32' ? '.cmd' : ''}`,
  );
  execFileSync(setupBinary, [], { cwd: consumerRoot, stdio: 'inherit' });
  assert.match(
    await readFile(join(consumerRoot, 'CLAUDE.md'), 'utf8'),
    /## UI Components \(@tale-ui\/react\)/,
    'The setup binary must remain idempotently usable.',
  );

  const runtimeSpecifiers = Object.keys(packageJson.exports)
    .filter((subpath) => subpath !== './styles')
    .map((subpath) => (subpath === '.' ? '@tale-ui/react' : `@tale-ui/react/${subpath.slice(2)}`));

  const esmImports = runtimeSpecifiers
    .map((specifier, index) => `import * as Contract${index} from ${JSON.stringify(specifier)};`)
    .join('\n');
  const esmAssertions = runtimeSpecifiers
    .map(
      (specifier, index) =>
        `for (const [name, value] of Object.entries(Contract${index})) {\n` +
        `  if (value === undefined) throw new Error(${JSON.stringify(specifier)} + ' exported undefined ' + name);\n` +
        `}`,
    )
    .join('\n');
  await writeFile(join(consumerRoot, 'probe.mjs'), `${esmImports}\n${esmAssertions}\n`);
  if (reactMajor === 17) {
    // React 17 predates package export maps and its extensionless
    // react/jsx-runtime ESM subpath cannot be loaded directly by Node. A real
    // ESM consumer bundler resolves the packed import-condition graph.
    execFileSync(
      pnpm,
      [
        'exec',
        'esbuild',
        'probe.mjs',
        '--bundle',
        '--platform=node',
        '--format=esm',
        '--outfile=probe.bundle.mjs',
      ],
      { cwd: consumerRoot, stdio: 'inherit' },
    );
    execFileSync(process.execPath, ['probe.bundle.mjs'], {
      cwd: consumerRoot,
      stdio: 'inherit',
    });
  } else {
    execFileSync(process.execPath, ['probe.mjs'], { cwd: consumerRoot, stdio: 'inherit' });
  }

  await writeFile(
    join(consumerRoot, 'probe.cjs'),
    `const specifiers = ${JSON.stringify(runtimeSpecifiers)};\n` +
      `for (const specifier of specifiers) {\n` +
      `  const loaded = require(specifier);\n` +
      `  for (const [name, value] of Object.entries(loaded)) {\n` +
      `    if (value === undefined) throw new Error(\`\${specifier} exported undefined \${name}\`);\n` +
      `  }\n` +
      `}\n`,
  );
  execFileSync(process.execPath, ['probe.cjs'], { cwd: consumerRoot, stdio: 'inherit' });

  await writeFile(
    join(consumerRoot, 'types.ts'),
    `${runtimeSpecifiers
      .map((specifier, index) => `import type * as Contract${index} from '${specifier}';`)
      .join('\n')}\nexport type Contracts = ${runtimeSpecifiers
      .map((_, index) => `keyof typeof Contract${index}`)
      .join(' | ')};\n`,
  );
  await writeFile(
    join(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          target: 'ES2022',
          jsx: 'react-jsx',
        },
        include: ['types.ts'],
      },
      null,
      2,
    )}\n`,
  );
  execFileSync(pnpm, ['exec', 'tsc', '--project', 'tsconfig.json'], {
    cwd: consumerRoot,
    stdio: 'inherit',
  });

  const stylesPath = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      "process.stdout.write(import.meta.resolve('@tale-ui/react/styles'))",
    ],
    { cwd: consumerRoot, encoding: 'utf8' },
  );
  assert.match(await readFile(new URL(stylesPath), 'utf8'), /@import/);

  await writeFile(
    join(consumerRoot, 'mcp-probe.mjs'),
    `import { Client } from '@modelcontextprotocol/sdk/client/index.js';\n` +
      `import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';\n` +
      `const command = ${JSON.stringify(
        join(
          consumerRoot,
          `node_modules/.bin/tale-ui-mcp${process.platform === 'win32' ? '.cmd' : ''}`,
        ),
      )};\n` +
      `const client = new Client({ name: 'packed-probe', version: '1.0.0' });\n` +
      `const transport = new StdioClientTransport({ command });\n` +
      `await client.connect(transport);\n` +
      `const { tools } = await client.listTools();\n` +
      `if (!tools.some(({ name }) => name === 'list_components')) throw new Error('MCP binary omitted list_components');\n` +
      `await client.close();\n`,
  );
  execFileSync(process.execPath, ['mcp-probe.mjs'], {
    cwd: consumerRoot,
    stdio: 'inherit',
    timeout: 20_000,
  });

  await writeFile(
    join(consumerRoot, 'render-probe.cjs'),
    `const React = require('react');\n` +
      `const { renderToString } = require('react-dom/server');\n` +
      `const { JSDOM, VirtualConsole } = require('jsdom');\n` +
      `const { Badge } = require('@tale-ui/react/badge');\n` +
      `const h = React.createElement;\n` +
      `const diagnostics = [];\n` +
      `const originalError = console.error;\n` +
      `const originalWarn = console.warn;\n` +
      `console.error = (...args) => diagnostics.push(['error', ...args].map(String).join(' '));\n` +
      `console.warn = (...args) => diagnostics.push(['warn', ...args].map(String).join(' '));\n` +
      `const virtualConsole = new VirtualConsole();\n` +
      `virtualConsole.on('jsdomError', (error) => diagnostics.push('jsdomError: ' + error.message));\n` +
      `function App() { return h(Badge, { id: 'packed-render-probe' }, 'Packed consumer'); }\n` +
      `async function main() {\n` +
      `  const markup = renderToString(h(App));\n` +
      `  if (!markup.includes('Packed consumer')) throw new Error('SSR omitted Badge content');\n` +
      `  const dom = new JSDOM(\`<main id="hydrate">\${markup}</main><main id="client"></main>\`, { pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });\n` +
      `  for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'SVGElement', 'MutationObserver', 'Node', 'Event']) globalThis[name] = dom.window[name];\n` +
      `  globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);\n` +
      `  globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);\n` +
      `  globalThis.cancelAnimationFrame = clearTimeout;\n` +
      `  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };\n` +
      `  const hydrateContainer = document.getElementById('hydrate');\n` +
      `  const clientContainer = document.getElementById('client');\n` +
      `  const beforeHydration = hydrateContainer.innerHTML;\n` +
      `  let unmountHydration;\n` +
      `  let unmountClient;\n` +
      `  if (${reactMajor} === 17) {\n` +
      `    const ReactDOM = require('react-dom');\n` +
      `    ReactDOM.hydrate(h(App), hydrateContainer);\n` +
      `    ReactDOM.render(h(App), clientContainer);\n` +
      `    unmountHydration = () => ReactDOM.unmountComponentAtNode(hydrateContainer);\n` +
      `    unmountClient = () => ReactDOM.unmountComponentAtNode(clientContainer);\n` +
      `  } else {\n` +
      `    const { hydrateRoot, createRoot } = require('react-dom/client');\n` +
      `    const hydratedRoot = hydrateRoot(hydrateContainer, h(App), { onRecoverableError: (error) => diagnostics.push('recoverable: ' + error.message) });\n` +
      `    const clientRoot = createRoot(clientContainer);\n` +
      `    clientRoot.render(h(App));\n` +
      `    unmountHydration = () => hydratedRoot.unmount();\n` +
      `    unmountClient = () => clientRoot.unmount();\n` +
      `  }\n` +
      `  await new Promise((resolve) => setTimeout(resolve, 50));\n` +
      `  if (hydrateContainer.innerHTML !== beforeHydration) throw new Error('Hydration changed the server structure');\n` +
      `  if (clientContainer.textContent !== 'Packed consumer') throw new Error('Client render omitted Badge content');\n` +
      `  if (diagnostics.length > 0) throw new Error('Render diagnostics:\\n' + diagnostics.join('\\n'));\n` +
      `  unmountHydration();\n` +
      `  unmountClient();\n` +
      `}\n` +
      `main().then(() => { console.error = originalError; console.warn = originalWarn; process.exit(0); }, (error) => { console.error = originalError; console.warn = originalWarn; originalError(error); process.exit(1); });\n`,
  );
  execFileSync(process.execPath, ['render-probe.cjs'], {
    cwd: consumerRoot,
    stdio: 'inherit',
    timeout: 20_000,
  });

  if (reactMajor === 17) {
    await writeFile(
      join(consumerRoot, 'react17-probe.cjs'),
      `const React = require('react');\n` +
        `const ReactDOM = require('react-dom');\n` +
        `const { renderToString } = require('react-dom/server');\n` +
        `const { JSDOM, VirtualConsole } = require('jsdom');\n` +
        `const { SSRProvider } = require('react-aria');\n` +
        `const { TextEditor } = require('@tale-ui/react/text-editor');\n` +
        `const { IPhoneMockup } = require('@tale-ui/react/iphone-mockup');\n` +
        `const { FileUpload } = require('@tale-ui/react/file-upload');\n` +
        `const { InputTags } = require('@tale-ui/react/input-tags');\n` +
        `const { MultiSelect } = require('@tale-ui/react/multi-select');\n` +
        `const { TagSelect } = require('@tale-ui/react/tag-select');\n` +
        `const h = React.createElement;\n` +
        `const diagnostics = [];\n` +
        `const allowedEnvironmentDiagnostics = [];\n` +
        `const originalError = console.error;\n` +
        `const originalWarn = console.warn;\n` +
        `console.error = (...args) => diagnostics.push(['error', ...args].map(String).join(' '));\n` +
        `console.warn = (...args) => diagnostics.push(['warn', ...args].map(String).join(' '));\n` +
        `function createDom(markup) {\n` +
        `  const virtualConsole = new VirtualConsole();\n` +
        `  virtualConsole.on('jsdomError', (error) => {\n` +
        `    if (error.message === 'Could not parse CSS stylesheet') {\n` +
        `      allowedEnvironmentDiagnostics.push('JSDOM 24 does not parse the upstream React Aria @layer stylesheet.');\n` +
        `      return;\n` +
        `    }\n` +
        `    diagnostics.push('jsdomError: ' + error.message);\n` +
        `  });\n` +
        `  return new JSDOM(markup, { pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });\n` +
        `}\n` +
        `function fixtures() {\n` +
        `  return [\n` +
        `    ['TextEditor', h(TextEditor.Root, null)],\n` +
        `    ['IPhoneMockup', h(React.Fragment, null,\n` +
        `      h(IPhoneMockup, { image: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }),\n` +
        `      h(IPhoneMockup, { image: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }),\n` +
        `    )],\n` +
        `    ['FileUpload', h(FileUpload.DropZone, null)],\n` +
        `    ['InputTags', h(InputTags.Root, { label: 'Tags' })],\n` +
        `    ['MultiSelect', h(MultiSelect.Root, { items: [], label: 'Options' }, () => null)],\n` +
        `    ['TagSelect', h(TagSelect.Root, { items: [], label: 'People' }, () => null)],\n` +
        `  ];\n` +
        `}\n` +
        `function App() {\n` +
        `  return h(SSRProvider, null, h(React.Fragment, null, ...fixtures().map(([name, fixture]) => h(React.Fragment, { key: name }, fixture))));\n` +
        `}\n` +
        `function assertCollisionFree(root, phase, expectedIdsPerPhone) {\n` +
        `  const phones = [...root.querySelectorAll('svg.tale-iphone-mockup')];\n` +
        `  if (phones.length !== 2) throw new Error(\`\${phase}: expected two iPhone mockups\`);\n` +
        `  const phoneIds = phones.map((phone) => [...phone.querySelectorAll('[id]')].map((node) => node.id));\n` +
        `  if (phoneIds.some((ids) => ids.length !== expectedIdsPerPhone)) throw new Error(\`\${phase}: expected \${expectedIdsPerPhone} SVG IDs per iPhone, received \${phoneIds.map((ids) => ids.length).join(', ')}\`);\n` +
        `  const ids = phoneIds.flat();\n` +
        `  if (ids.some((id) => id.includes('undefined'))) throw new Error(\`\${phase}: undefined SVG ID\`);\n` +
        `  if (new Set(ids).size !== ids.length) throw new Error(\`\${phase}: colliding SVG IDs\`);\n` +
        `}\n` +
        `function structure(node) {\n` +
        `  return [...node.childNodes].map((child) => {\n` +
        `    if (child.nodeType === 1 && child.classList.contains('tale-text-editor')) return null;\n` +
        `    return child.nodeType === 1 ? [child.tagName, structure(child)] : child.nodeType === 3 ? '#text' : '#other';\n` +
        `  }).filter((entry) => entry !== null);\n` +
        `}\n` +
        `async function main() {\n` +
        `  const failures = [];\n` +
        `  for (const [name, fixture] of fixtures()) {\n` +
        `    try {\n` +
        `      renderToString(h(SSRProvider, null, fixture));\n` +
        `    } catch (error) {\n` +
        `      failures.push(\`\${name}: \${error instanceof Error ? error.message : String(error)}\`);\n` +
        `    }\n` +
        `  }\n` +
        `  if (failures.length > 0) throw new Error(\`React 17 SSR fixture failures:\\n\${failures.join('\\n')}\`);\n` +
        `  const markup = renderToString(h(App));\n` +
        `  const serverDom = createDom(\`<main>\${markup}</main>\`);\n` +
        `  assertCollisionFree(serverDom.window.document, 'SSR', 0);\n` +
        `  const dom = createDom(\`<main id="hydrate">\${markup}</main><main id="client"></main>\`);\n` +
        `  for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'SVGElement', 'MutationObserver', 'Node']) globalThis[name] = dom.window[name];\n` +
        `  globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);\n` +
        `  globalThis.cancelAnimationFrame = clearTimeout;\n` +
        `  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };\n` +
        `  const hydrateContainer = document.getElementById('hydrate');\n` +
        `  const serverStructure = JSON.stringify(structure(hydrateContainer));\n` +
        `  ReactDOM.hydrate(h(App), hydrateContainer);\n` +
        `  const hydratedStructure = JSON.stringify(structure(hydrateContainer));\n` +
        `  if (hydratedStructure !== serverStructure) throw new Error('Hydration changed the server element structure\\nserver=' + serverStructure + '\\nhydrated=' + hydratedStructure);\n` +
        `  ReactDOM.render(h(App), document.getElementById('client'));\n` +
        `  await new Promise((resolve) => setTimeout(resolve, 50));\n` +
        `  if (diagnostics.length > 0) throw new Error('React 17 render diagnostics:\\n' + diagnostics.join('\\n'));\n` +
        `  for (const selector of ['.tale-text-editor', '.tale-file-upload-drop-zone', '.tale-input-tags', '.tale-multi-select', '.tale-tag-select']) {\n` +
        `    if (!hydrateContainer.querySelector(selector)) throw new Error('Hydration omitted ' + selector);\n` +
        `  }\n` +
        `  assertCollisionFree(hydrateContainer, 'hydration', 3);\n` +
        `  assertCollisionFree(document.getElementById('client'), 'client render', 3);\n` +
        `  ReactDOM.unmountComponentAtNode(hydrateContainer);\n` +
        `  ReactDOM.unmountComponentAtNode(document.getElementById('client'));\n` +
        `}\n` +
        `main().then(() => { console.error = originalError; console.warn = originalWarn; process.exit(0); }, (error) => { console.error = originalError; console.warn = originalWarn; originalError(error); process.exit(1); });\n`,
    );
    execFileSync(process.execPath, ['react17-probe.cjs'], {
      cwd: consumerRoot,
      stdio: 'inherit',
      timeout: 20_000,
    });
  }

  process.stdout.write(
    `Packed React consumer passed on Node ${nodeMajor} / React ${reactMajor}.\n`,
  );
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}
