#!/usr/bin/env node
/**
 * Tale UI — Generated Code Validator
 *
 * Compatibility adapter over @tale-ui/tooling's packaged validation runtime.
 * It preserves the repository's legacy JSON shape while using the same
 * read-only compiler API as the public API, CLI, and local MCP server.
 */

import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { register } from 'tsx/esm/api';

register();

const { validateCode, validateFile } = await import('@tale-ui/tooling/validation');
const { toTaleError } = await import('@tale-ui/tooling/contracts');

const currentDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(currentDir, '..');
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const filteredArgs = args.filter((argument) => argument !== '--json');

function legacyRegistryType(code) {
  if (code === 'TALE_INVALID_IMPORT') {
    return 'invalid-import';
  }
  if (code === 'TALE_WRONG_COMPONENT_KIND') {
    return 'wrong-kind';
  }
  if (code === 'TALE_DEPRECATED_ARTIFACT') {
    return 'deprecated-artifact';
  }
  return 'registry';
}

function legacyResult(source, result) {
  const registryErrors = result.diagnostics
    .filter(
      (diagnostic) => diagnostic.severity === 'error' && diagnostic.ruleId?.startsWith('registry.'),
    )
    .map((diagnostic) => ({
      type: legacyRegistryType(diagnostic.code),
      message: diagnostic.message,
      ...(diagnostic.path ? { path: diagnostic.path } : {}),
      ...(diagnostic.line ? { line: diagnostic.line } : {}),
      ...(diagnostic.column ? { column: diagnostic.column } : {}),
    }));
  const typescriptErrors = result.diagnostics
    .filter((diagnostic) => diagnostic.severity === 'error' && typeof diagnostic.code === 'number')
    .map((diagnostic) => ({
      code: diagnostic.code,
      line: diagnostic.line || 0,
      ...(diagnostic.column ? { column: diagnostic.column } : {}),
      ...(diagnostic.path ? { path: diagnostic.path } : {}),
      message: diagnostic.message,
    }));
  return {
    source,
    valid: result.valid,
    registryErrors,
    typescriptErrors,
    diagnostics: result.diagnostics,
    versions: result.versions,
    fallbackConfig: result.fallbackConfig,
  };
}

function print(result) {
  if (jsonOutput) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if (result.valid) {
    process.stdout.write(`✅ ${result.source} — valid\n`);
    return;
  }
  const errors = [...result.registryErrors, ...result.typescriptErrors];
  process.stdout.write(`❌ ${result.source} — ${errors.length} error(s)\n\n`);
  for (const error of result.registryErrors) {
    process.stdout.write(`  [registry] ${error.message}\n`);
  }
  for (const error of result.typescriptErrors) {
    const location = error.line > 0 ? `:${error.line}` : '';
    process.stdout.write(`  [tsc${location}] ${error.message}\n`);
  }
}

let source;
let request;
const codeIndex = filteredArgs.indexOf('--code');
const goldenIndex = filteredArgs.indexOf('--golden');

if (codeIndex >= 0 && filteredArgs[codeIndex + 1]) {
  source = '<inline>';
  request = {
    code: filteredArgs[codeIndex + 1],
    virtualFile: 'playground/vite-app/src/generated-validation.tsx',
  };
} else if (goldenIndex >= 0 && filteredArgs[goldenIndex + 1]) {
  const goldenPath = resolve(filteredArgs[goldenIndex + 1]);
  const golden = JSON.parse(readFileSync(goldenPath, 'utf8'));
  source = filteredArgs[goldenIndex + 1];
  request = {
    code: golden.reference,
    virtualFile: 'playground/vite-app/src/generated-validation.tsx',
  };
} else if (filteredArgs[0] && !filteredArgs[0].startsWith('-')) {
  const filePath = resolve(filteredArgs[0]);
  if (filePath.endsWith('.json')) {
    const golden = JSON.parse(readFileSync(filePath, 'utf8'));
    source = filteredArgs[0];
    request = {
      code: golden.reference,
      virtualFile: 'playground/vite-app/src/generated-validation.tsx',
    };
  } else {
    source = filteredArgs[0];
    request = { file: relative(root, filePath).replaceAll('\\', '/') };
  }
} else {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, [resolve(currentDir, 'validate-golden-prompts.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
  process.exit(0);
}

try {
  const base = {
    schemaVersion: '1.0.0',
    requestId: 'repository-validation',
    root,
    timeoutMs: 30_000,
  };
  const result =
    'code' in request
      ? await validateCode({ ...base, ...request })
      : await validateFile({ ...base, ...request });
  const compatible = legacyResult(source, result);
  print(compatible);
  process.exitCode = compatible.valid ? 0 : 1;
} catch (error) {
  const normalized = toTaleError(error);
  const failed = {
    source,
    valid: false,
    registryErrors: [],
    typescriptErrors: [{ line: 0, message: normalized.message }],
    error: normalized,
  };
  print(failed);
  process.exitCode = 1;
}
