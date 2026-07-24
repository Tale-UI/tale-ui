#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

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

const materializeOutput = execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '--eval',
    "import { listTemplates } from '@tale-ui/tooling/materialize'; const templates = await listTemplates(); process.stdout.write(JSON.stringify(templates.map(({ id }) => id)));",
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const materializeResult = JSON.parse(materializeOutput);
if (
  materializeResult.length !== 10 ||
  !materializeResult.includes('tale:template:sortable-table')
) {
  throw new Error('Packed materialization API failed to load its installed template assets');
}
const migrationOutput = execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '--eval',
    "import { listMigrations } from '@tale-ui/tooling/migrations'; const migrations = await listMigrations(); process.stdout.write(JSON.stringify(migrations.map(({ id }) => id)));",
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
if (JSON.parse(migrationOutput).length !== 4) {
  throw new Error('Packed migration API failed to load its installed transform assets');
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

await Promise.all(
  ['vite', 'next'].map(async (fixture) => {
    const projectRoot = join(fixtureRoot, `${fixture}-app`);
    await cp(new URL(`../fixtures/${fixture}`, import.meta.url), projectRoot, { recursive: true });
    const fixtureOutput = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        "import { validateFile } from '@tale-ui/tooling/validation'; const base = { schemaVersion: '1.0.0', requestId: 'packed-fixture', root: process.cwd(), timeoutMs: 10000, rules: ['typescript'] }; const valid = await validateFile({ ...base, file: 'src/valid.ts' }); const invalid = await validateFile({ ...base, file: 'src/invalid.ts' }); process.stdout.write(JSON.stringify({ valid, invalid }));",
      ],
      { cwd: projectRoot, encoding: 'utf8' },
    );
    const fixtureResult = JSON.parse(fixtureOutput);
    if (
      !fixtureResult.valid.valid ||
      fixtureResult.invalid.valid ||
      fixtureResult.valid.fallbackConfig ||
      fixtureResult.invalid.fallbackConfig ||
      !fixtureResult.invalid.diagnostics.some((diagnostic) => diagnostic.code === 2322) ||
      fixtureOutput.includes(projectRoot)
    ) {
      throw new Error(`Packed validation failed the ${fixture} project-config fixture`);
    }
  }),
);

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
  !cliResult.capabilities.includes('code.validate') ||
  cliResult.capabilities.includes('ui.plan')
) {
  throw new Error('Packed CLI reported capabilities outside the CLI surface');
}
const consumerRoot = join(fixtureRoot, 'materialize-app');
await mkdir(consumerRoot);
await writeFile(
  join(consumerRoot, 'package.json'),
  `${JSON.stringify({ name: 'materialize-app', private: true, scripts: {} }, null, 2)}\n`,
);
const initResult = JSON.parse(
  execFileSync(cliPath, ['init', '--scripts', '--json'], {
    cwd: consumerRoot,
    encoding: 'utf8',
  }),
);
const templateListResult = JSON.parse(
  execFileSync(cliPath, ['template', '--list', '--json'], {
    cwd: consumerRoot,
    encoding: 'utf8',
  }),
);
const templateSourceResult = JSON.parse(
  execFileSync(cliPath, ['template', 'empty-state', '--skeleton', '--json'], {
    cwd: consumerRoot,
    encoding: 'utf8',
  }),
);
const templateAddResult = JSON.parse(
  execFileSync(cliPath, ['template', 'empty-state', '--skeleton', '--add', '--json'], {
    cwd: consumerRoot,
    encoding: 'utf8',
  }),
);
const doctorResult = JSON.parse(
  execFileSync(cliPath, ['doctor', '--json'], {
    cwd: consumerRoot,
    encoding: 'utf8',
  }),
);
await writeFile(
  join(consumerRoot, 'src/tale-templates/import-fixture.ts'),
  "import { TextArea } from '@tale-ui/react/textarea';\nexport { TextArea };\n",
);
const migrationPlanResult = JSON.parse(
  execFileSync(cliPath, ['upgrade', 'known-import-path-corrections', '--json'], {
    cwd: consumerRoot,
    encoding: 'utf8',
  }),
);
const migrationApplyResult = JSON.parse(
  execFileSync(
    cliPath,
    [
      'upgrade',
      'known-import-path-corrections',
      '--apply',
      '--plan-digest',
      migrationPlanResult.data.planDigest,
      '--json',
    ],
    {
      cwd: consumerRoot,
      encoding: 'utf8',
    },
  ),
);
if (
  !initResult.ok ||
  initResult.data.files.length !== 4 ||
  !templateListResult.ok ||
  templateListResult.data.length !== 10 ||
  !templateSourceResult.ok ||
  templateSourceResult.data.variant !== 'skeleton' ||
  !templateAddResult.ok ||
  templateAddResult.data.template.id !== 'tale:template:empty-state' ||
  !doctorResult.ok ||
  !doctorResult.data.healthy ||
  !migrationPlanResult.ok ||
  migrationPlanResult.data.state !== 'applicable' ||
  !migrationApplyResult.ok ||
  !migrationApplyResult.data.operationId ||
  !(await readFile(join(consumerRoot, 'src/tale-templates/empty-state.tsx'), 'utf8')).includes(
    'export function Example',
  ) ||
  !(await readFile(join(consumerRoot, 'src/tale-templates/import-fixture.ts'), 'utf8')).includes(
    '@tale-ui/react/text-area',
  )
) {
  throw new Error('Packed CLI init, template, migration, or doctor command failed');
}
const cliValidation = spawnSync(
  cliPath,
  [
    'validate',
    '--code',
    'export const answer: string = 42;',
    '--virtual-file',
    'src/example.ts',
    '--root',
    fixtureRoot,
    '--timeout',
    '10000',
    '--rules',
    'typescript',
    '--json',
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const cliValidationResult = JSON.parse(cliValidation.stdout);
if (
  cliValidation.status !== 5 ||
  !cliValidationResult.ok ||
  cliValidationResult.data.valid ||
  JSON.stringify(cliValidationResult.data.diagnostics) !==
    JSON.stringify(validationResult.invalid.diagnostics) ||
  JSON.stringify(cliValidationResult.data.versions) !==
    JSON.stringify(validationResult.invalid.versions) ||
  cliValidation.stderr !== ''
) {
  throw new Error('Packed CLI validation did not preserve normalized diagnostics and exit status');
}
const orderedFileValidation = spawnSync(
  cliPath,
  [
    'validate',
    '--root',
    join(fixtureRoot, 'vite-app'),
    '--rules',
    'typescript',
    'src/valid.ts',
    '--json',
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const orderedFileResult = JSON.parse(orderedFileValidation.stdout);
if (
  orderedFileValidation.status !== 0 ||
  !orderedFileResult.ok ||
  !orderedFileResult.data.valid ||
  orderedFileValidation.stderr !== ''
) {
  throw new Error('Packed CLI validation did not accept a positional file after options');
}
const conflictingInput = spawnSync(
  cliPath,
  [
    'validate',
    '--code',
    'export const answer = 42;',
    'src/other.ts',
    '--root',
    fixtureRoot,
    '--json',
  ],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const conflictingInputResult = JSON.parse(conflictingInput.stdout);
if (
  conflictingInput.status !== 2 ||
  conflictingInputResult.error?.code !== 'TALE_INVALID_ARGUMENT' ||
  conflictingInput.stderr !== ''
) {
  throw new Error('Packed CLI validation did not reject conflicting ordered inputs');
}
const invalidTimeout = spawnSync(
  cliPath,
  ['validate', '--code', 'export const answer = 42;', '--timeout', 'nope', '--json'],
  { cwd: fixtureRoot, encoding: 'utf8' },
);
const invalidTimeoutResult = JSON.parse(invalidTimeout.stdout);
if (
  invalidTimeout.status !== 2 ||
  invalidTimeoutResult.error?.code !== 'TALE_INVALID_ARGUMENT' ||
  !invalidTimeoutResult.error.message.startsWith('Tale UI:') ||
  !invalidTimeoutResult.error.message.includes('whole-number value') ||
  !invalidTimeoutResult.error.message.includes('retry') ||
  invalidTimeout.stderr !== ''
) {
  throw new Error('Packed CLI validation did not normalize its timeout error');
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

const mcpPath = join(fixtureRoot, 'node_modules/.bin/tale-mcp');
const mcpTransport = new StdioClientTransport({
  command: mcpPath,
  cwd: fixtureRoot,
  stderr: 'pipe',
});
const mcpClient = new Client({ name: 'tale-tooling-packed-test', version: '1.0.0' });
try {
  await mcpClient.connect(mcpTransport);
  const tools = await mcpClient.listTools();
  if (!tools.tools.some((tool) => tool.name === 'validate_code')) {
    throw new Error('Packed local MCP did not register validate_code');
  }
  const response = await mcpClient.callTool({
    name: 'validate_code',
    arguments: {
      code: 'export const answer: string = 42;',
      virtualFile: 'src/example.ts',
      timeoutMs: 10_000,
      rules: ['typescript'],
    },
  });
  const content = response.content.find((entry) => entry.type === 'text');
  const mcpValidationResult = JSON.parse(content?.text || '{}');
  if (
    response.isError !== true ||
    mcpValidationResult.valid ||
    JSON.stringify(mcpValidationResult.diagnostics) !==
      JSON.stringify(validationResult.invalid.diagnostics) ||
    JSON.stringify(mcpValidationResult.versions) !==
      JSON.stringify(validationResult.invalid.versions) ||
    JSON.stringify(response).includes(fixtureRoot)
  ) {
    throw new Error('Packed local MCP validation diverged from the API result or leaked its root');
  }
  const emptyRulesResponse = await mcpClient.callTool({
    name: 'validate_code',
    arguments: {
      code: 'export const answer: string = 42;',
      rules: [],
    },
  });
  if (
    emptyRulesResponse.isError !== true ||
    !emptyRulesResponse.content.some(
      (entry) => entry.type === 'text' && entry.text.includes('validation'),
    )
  ) {
    throw new Error('Packed local MCP accepted an empty validation rule selection');
  }
} finally {
  await mcpClient.close();
}

await rm(fixtureRoot, { recursive: true, force: true });
process.stdout.write(
  'Packed @tale-ui/tooling API, CLI, local MCP, and validation worker preserve parity without monorepo paths.\n',
);
