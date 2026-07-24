#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import {
  createErrorEnvelope,
  createSuccessEnvelope,
  getArtifact,
  getManifest,
  searchArtifacts,
} from './api.js';
import type { ArtifactKind } from './contracts/artifact.js';
import { TALE_ERROR_EXIT, TaleToolingError } from './contracts/errors.js';
import type { ValidationRule } from './contracts/validation.js';
import {
  addTemplate,
  getTemplateSource,
  initializeProject,
  listTemplates,
} from './materialize.js';
import { doctorProject, recoverProjectOperation } from './operations.js';
import { validateCode, validateFile } from './validation/index.js';

const ARTIFACT_KINDS = new Set<ArtifactKind>([
  'component',
  'hook',
  'recipe',
  'template',
  'doc',
  'a2ui-type',
  'foundation',
  'pitfall',
  'validation',
  'codemod',
  'composition',
  'extension',
]);

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const filteredArgs = args.filter((argument) => argument !== '--json');
const command = filteredArgs[0] || '';
const requestId = randomUUID();

function option(name: string) {
  const index = filteredArgs.indexOf(name);
  return index >= 0 ? filteredArgs[index + 1] : undefined;
}

function write(value: unknown) {
  process.stdout.write(`${JSON.stringify(value, null, jsonMode ? 0 : 2)}\n`);
}

function integerOption(name: string, value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      `Tale UI: ${name} must be an integer, so the command could not be interpreted. ` +
        'Provide a whole-number value and retry.',
    );
  }
  return parsed;
}

function positionalArguments(valueOptions: ReadonlySet<string>) {
  const positional: string[] = [];
  for (let index = 1; index < filteredArgs.length; index += 1) {
    const argument = filteredArgs[index]!;
    if (valueOptions.has(argument)) {
      index += 1;
    } else if (!argument.startsWith('--')) {
      positional.push(argument);
    }
  }
  return positional;
}

function validationRules(value: string | undefined): ValidationRule[] | undefined {
  if (!value) {
    return undefined;
  }
  const rules = value.split(',').filter(Boolean) as ValidationRule[];
  if (
    rules.length === 0 ||
    new Set(rules).size !== rules.length ||
    rules.some((rule) => rule !== 'registry' && rule !== 'typescript')
  ) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: --rules must contain unique registry or typescript values. ' +
        'Use --rules registry,typescript and retry.',
    );
  }
  return rules;
}

try {
  let data: unknown;
  if (command === 'manifest') {
    data = getManifest();
  } else if (command === 'search') {
    const query = filteredArgs[1];
    if (!query || query.startsWith('--')) {
      throw new TaleToolingError('TALE_INVALID_ARGUMENT', 'search requires a query.');
    }
    const kindValue = option('--kind');
    if (kindValue && !ARTIFACT_KINDS.has(kindValue as ArtifactKind)) {
      throw new TaleToolingError(
        'TALE_INVALID_ARGUMENT',
        `--kind must be one of: ${[...ARTIFACT_KINDS].join(', ')}.`,
      );
    }
    const kind = kindValue as ArtifactKind | undefined;
    const limit = integerOption('--limit', option('--limit'));
    const cursor = integerOption('--cursor', option('--cursor'));
    data = searchArtifacts({
      query,
      ...(kind ? { kinds: [kind] } : {}),
      ...(limit !== undefined ? { limit } : {}),
      ...(cursor !== undefined ? { cursor } : {}),
    });
  } else if (command === 'component') {
    const idOrAlias = filteredArgs[1];
    if (!idOrAlias || idOrAlias.startsWith('--')) {
      throw new TaleToolingError('TALE_INVALID_ARGUMENT', 'component requires an ID or alias.');
    }
    data = getArtifact(idOrAlias, { kind: 'component' });
    if (!data) {
      throw new TaleToolingError(
        'TALE_ARTIFACT_NOT_FOUND',
        'The requested component artifact was not found.',
      );
    }
  } else if (command === 'validate') {
    const code = option('--code');
    const files = positionalArguments(
      new Set(['--code', '--root', '--timeout', '--rules', '--virtual-file']),
    );
    const file = files.length === 1 ? files[0] : undefined;
    if ((code === undefined) === (file === undefined) || files.length > 1) {
      throw new TaleToolingError(
        'TALE_INVALID_ARGUMENT',
        'Tale UI: validate requires exactly one project-relative file or --code input. ' +
          'Choose one input mode and retry.',
      );
    }
    const root = option('--root') || process.cwd();
    const timeoutMs = integerOption('--timeout', option('--timeout')) ?? 30_000;
    const rules = validationRules(option('--rules'));
    const validationResult =
      code !== undefined
        ? await validateCode({
            schemaVersion: '1.0.0',
            requestId,
            root,
            code,
            virtualFile: option('--virtual-file') || 'src/tale-validation.tsx',
            timeoutMs,
            ...(rules ? { rules } : {}),
          })
        : await validateFile({
            schemaVersion: '1.0.0',
            requestId,
            root,
            file: file!,
            timeoutMs,
            ...(rules ? { rules } : {}),
          });
    data = validationResult;
    if (!validationResult.valid) {
      process.exitCode = TALE_ERROR_EXIT.TALE_VALIDATION_FAILED;
    }
  } else if (command === 'init') {
    data = await initializeProject({
      schemaVersion: '1.0.0',
      requestId,
      root: option('--root') || process.cwd(),
      idempotencyKey: option('--idempotency-key') || 'tale-init-v1',
      addScripts: filteredArgs.includes('--scripts'),
    });
  } else if (command === 'template') {
    if (filteredArgs.includes('--list')) {
      data = await listTemplates();
    } else {
      const templates = positionalArguments(
        new Set(['--root', '--target', '--idempotency-key']),
      );
      const template = templates.length === 1 ? templates[0] : undefined;
      if (!template || templates.length > 1) {
        throw new TaleToolingError(
          'TALE_INVALID_ARGUMENT',
          'Tale UI: template requires exactly one template ID or --list.',
        );
      }
      if (filteredArgs.includes('--add')) {
        data = await addTemplate({
          schemaVersion: '1.0.0',
          requestId,
          root: option('--root') || process.cwd(),
          idempotencyKey:
            option('--idempotency-key') ||
            `tale-template-${template}-${filteredArgs.includes('--skeleton') ? 'skeleton' : 'source'}-v1`,
          template,
          target: option('--target'),
          skeleton: filteredArgs.includes('--skeleton'),
          addDependencies: !filteredArgs.includes('--no-dependencies'),
        });
      } else {
        data = await getTemplateSource(template, {
          skeleton: filteredArgs.includes('--skeleton'),
        });
      }
    }
  } else if (command === 'doctor') {
    data = await doctorProject(option('--root') || process.cwd());
  } else if (command === 'recover') {
    const operations = positionalArguments(new Set(['--root']));
    const operationId = operations.length === 1 ? operations[0] : undefined;
    const resume = filteredArgs.includes('--resume');
    const rollback = filteredArgs.includes('--rollback');
    if (!operationId || operations.length > 1 || resume === rollback) {
      throw new TaleToolingError(
        'TALE_INVALID_ARGUMENT',
        'Tale UI: recover requires one operation ID and exactly one of --resume or --rollback.',
      );
    }
    data = await recoverProjectOperation({
      schemaVersion: '1.0.0',
      requestId,
      root: option('--root') || process.cwd(),
      operationId,
      action: resume ? 'resume' : 'rollback',
    });
  } else {
    throw new TaleToolingError(
      'TALE_UNSUPPORTED_COMMAND',
      'Tale UI: the requested command is unsupported, so no tooling action ran. ' +
        'Use manifest, search, component, validate, init, template, doctor, or recover and retry.',
    );
  }
  write(jsonMode ? createSuccessEnvelope(command, requestId, data, { surface: 'cli' }) : data);
} catch (error) {
  const envelope = createErrorEnvelope(command || 'unknown', requestId, error);
  if (jsonMode) {
    write(envelope);
  } else {
    process.stderr.write(`${envelope.error.message}\n`);
  }
  process.exitCode = TALE_ERROR_EXIT[envelope.error.code];
}
