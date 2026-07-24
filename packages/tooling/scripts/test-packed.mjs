#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const fixtureRoot = await mkdtemp(join(tmpdir(), 'tale-tooling-pack-'));
const packOutput = execFileSync(
  'npm',
  ['pack', './build', '--pack-destination', fixtureRoot, '--json'],
  { cwd: new URL('..', import.meta.url), encoding: 'utf8' },
);
const [{ filename }] = JSON.parse(packOutput);
execFileSync('npm', ['install', '--ignore-scripts', join(fixtureRoot, filename)], {
  cwd: fixtureRoot,
  stdio: 'inherit',
});

const apiOutput = execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '--eval',
    "import { getManifest, searchArtifacts } from '@tale-ui/tooling'; const manifest = getManifest(); const result = searchArtifacts({ query: 'table' }); process.stdout.write(JSON.stringify({ manifest, result }));",
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const apiResult = JSON.parse(apiOutput);
if (
  apiResult.manifest.releaseChannel !== 'internal' ||
  !apiResult.result.results.some((artifact) => artifact.id === 'tale:component:table')
) {
  throw new Error('Packed API failed to load its installed registry assets');
}

const cliPath = join(fixtureRoot, 'node_modules/.bin/tale');
const cliOutput = execFileSync(cliPath, ['manifest', '--json'], {
  cwd: fixtureRoot,
  encoding: 'utf8',
});
const cliResult = JSON.parse(cliOutput);
if (!cliResult.ok || cliResult.data.registryVersion !== '1.0.0') {
  throw new Error('Packed CLI manifest command failed');
}
if (
  !cliResult.capabilities.includes('manifest.get') ||
  cliResult.capabilities.includes('ui.plan')
) {
  throw new Error('Packed CLI reported capabilities outside the CLI surface');
}
const failedCli = spawnSync(cliPath, ['unsupported', '--json'], {
  cwd: fixtureRoot,
  encoding: 'utf8',
});
const failedEnvelope = JSON.parse(failedCli.stdout);
if (
  failedCli.status !== 2 ||
  failedCli.stderr !== '' ||
  failedEnvelope.error?.code !== 'TALE_UNSUPPORTED_COMMAND'
) {
  throw new Error('Packed CLI did not preserve its JSON error and exit-code contract');
}
if (cliOutput.includes(fixtureRoot) || (await readFile(cliPath, 'utf8')).includes(process.cwd())) {
  throw new Error('Packed CLI output or launcher leaked an absolute project path');
}

await rm(fixtureRoot, { recursive: true, force: true });
process.stdout.write('Packed @tale-ui/tooling API and CLI load without monorepo paths.\n');
