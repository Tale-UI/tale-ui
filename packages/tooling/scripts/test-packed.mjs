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

const validationOutput = execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '--eval',
    "import { validateCode } from '@tale-ui/tooling/validation'; const base = { schemaVersion: '1.0.0', requestId: 'packed-validation', root: process.cwd(), virtualFile: 'src/example.ts', timeoutMs: 10000 }; const valid = await validateCode({ ...base, code: 'export const answer: number = 42;' }); const invalid = await validateCode({ ...base, code: 'export const answer: string = 42;' }); const registryValid = await validateCode({ ...base, code: \"import { parseColor } from '@tale-ui/react/aria'; export const color = parseColor;\", rules: ['registry'] }); let timeoutCode; let timeoutMessage; try { await validateCode({ ...base, code: 'export const value = true;', timeoutMs: 1 }); } catch (error) { timeoutCode = error.code; timeoutMessage = error.message; } const controller = new AbortController(); controller.abort(); let cancelCode; try { await validateCode({ ...base, code: 'export const value = true;' }, { signal: controller.signal }); } catch (error) { cancelCode = error.code; } process.stdout.write(JSON.stringify({ valid, invalid, registryValid, timeoutCode, timeoutMessage, cancelCode }));",
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const validationResult = JSON.parse(validationOutput);
if (
  !validationResult.valid.valid ||
  validationResult.invalid.valid ||
  !validationResult.registryValid.valid ||
  !validationResult.invalid.diagnostics.some((diagnostic) => diagnostic.code === 2322) ||
  validationResult.timeoutCode !== 'TALE_VALIDATION_TIMEOUT' ||
  !validationResult.timeoutMessage.includes('Increase timeoutMs') ||
  !validationResult.timeoutMessage.includes('reduce the input') ||
  validationResult.cancelCode !== 'TALE_VALIDATION_CANCELLED' ||
  validationOutput.includes(fixtureRoot)
) {
  throw new Error('Packed validation failed compiler parity or leaked its project root');
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
process.stdout.write(
  'Packed @tale-ui/tooling API, validation worker, and CLI load without monorepo paths.\n',
);
