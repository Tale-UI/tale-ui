#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
// Ajv exposes its draft-2020 entry with the runtime extension.
// eslint-disable-next-line import/extensions
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
// The benchmark intentionally exercises the source runtime before packaging.
// eslint-disable-next-line import/extensions, import/no-relative-packages
import { initializeProject } from '../packages/tooling/src/materialize.ts';

const ROOT = resolve(process.cwd());
const CAPTURE = process.argv.includes('--capture');
const BASELINE_PATH = join(ROOT, 'analysis/baselines/agent-cold-start.json');
const TASKS = [
  {
    id: 'registry-first-guidance',
    files: ['AGENTS.md', '.cursorrules'],
    matches: /installed Tale UI registry|registry-backed components/,
  },
  {
    id: 'local-cli-discovery',
    files: ['AGENTS.md'],
    matches: /`tale` CLI/,
  },
  {
    id: 'local-mcp-discovery',
    files: ['.mcp.json'],
    matches: /"tale-ui"[\s\S]*"tale-mcp"/,
  },
  {
    id: 'validation-command-discovery',
    files: ['package.json'],
    matches: /"tale:validate"[\s\S]*tale validate/,
  },
  {
    id: 'recovery-command-discovery',
    files: ['package.json'],
    matches: /"tale:doctor"[\s\S]*tale doctor/,
  },
] as const;

async function measure(root: string) {
  const content = new Map<string, string>();
  for (const path of [...new Set(TASKS.flatMap(({ files }) => files))]) {
    try {
      content.set(path, await readFile(join(root, path), 'utf8'));
    } catch {
      // Missing optional discovery files are an expected cold-start state.
    }
  }
  const evidence = TASKS.map((task) => {
    const path = task.files.find((candidate) => task.matches.test(content.get(candidate) ?? ''));
    return { task: task.id, passed: path !== undefined, path: path ?? null };
  });
  const relevantPaths = new Set(
    evidence
      .filter(({ passed }) => passed)
      .map(({ path }) => path)
      .filter((path): path is string => path !== null),
  );
  const contextBytes = [...relevantPaths].reduce(
    (total, path) => total + Buffer.byteLength(content.get(path) ?? '', 'utf8'),
    0,
  );
  const passedTasks = evidence.filter(({ passed }) => passed).length;
  return {
    passedTasks,
    totalTasks: TASKS.length,
    passRate: passedTasks / TASKS.length,
    contextBytes,
    estimatedTokens: Math.ceil(contextBytes / 4),
    evidence,
  };
}

async function benchmark() {
  const root = await mkdtemp(join(tmpdir(), 'tale-agent-cold-start-'));
  try {
    await writeFile(
      join(root, 'package.json'),
      `${JSON.stringify({ name: 'clean-project', private: true, scripts: {} }, null, 2)}\n`,
    );
    const beforeInit = await measure(root);
    await initializeProject({
      schemaVersion: '1.0.0',
      requestId: 'agent-cold-start',
      root,
      idempotencyKey: 'agent-cold-start-v1',
      addScripts: true,
    });
    const afterInit = await measure(root);
    return {
      schemaVersion: '1.0.0',
      benchmarkId: 'tale:benchmark:agent-cold-start',
      method: {
        runtime: 'packages/tooling/src/materialize.ts#initializeProject',
        fixture: 'clean-project-with-empty-scripts',
        measurement:
          'deterministic instruction-discovery proxy; estimated tokens are ceil(UTF-8 bytes / 4)',
        tasks: TASKS.map(({ id }) => id),
      },
      history: [
        {
          revision: 'bundle-bc-initial',
          beforeInit,
          afterInit,
          change: {
            passedTasks: afterInit.passedTasks - beforeInit.passedTasks,
            passRate: afterInit.passRate - beforeInit.passRate,
            contextBytes: afterInit.contextBytes - beforeInit.contextBytes,
            estimatedTokens: afterInit.estimatedTokens - beforeInit.estimatedTokens,
          },
        },
      ],
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function main() {
  const result = await benchmark();
  const schema = JSON.parse(
    readFileSync(join(ROOT, 'schemas/agent-cold-start-benchmark.schema.json'), 'utf8'),
  );
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  assert.ok(validate(result), ajv.errorsText(validate.errors, { separator: '\n' }));
  assert.equal(result.history[0].beforeInit.passRate, 0);
  assert.equal(result.history[0].afterInit.passRate, 1);

  const rendered = `${JSON.stringify(result, null, 2)}\n`;
  if (CAPTURE) {
    writeFileSync(BASELINE_PATH, rendered);
    console.log('Captured agent cold-start discovery benchmark.');
  } else {
    assert.equal(
      readFileSync(BASELINE_PATH, 'utf8'),
      rendered,
      'Agent cold-start benchmark drifted; inspect the change and recapture intentionally.',
    );
    console.log(
      `OK: agent cold-start pass rate ${result.history[0].beforeInit.passRate} → ${result.history[0].afterInit.passRate}; ${result.history[0].afterInit.estimatedTokens} estimated context tokens`,
    );
  }
}

void main();
