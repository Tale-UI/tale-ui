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
    throw new TaleToolingError('TALE_INVALID_ARGUMENT', `${name} must be an integer.`);
  }
  return parsed;
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
  } else {
    throw new TaleToolingError(
      'TALE_UNSUPPORTED_COMMAND',
      'Supported commands are manifest, search, and component.',
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
