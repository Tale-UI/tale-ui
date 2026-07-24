import { readFileSync } from 'node:fs';
import { TextDecoder } from 'node:util';
import ts from 'typescript';
import type {
  ValidationCodeRequest,
  ValidationRequest,
  ValidationResult,
  ValidationRule,
} from '../contracts/validation.js';
import { TaleToolingError } from '../contracts/errors.js';
import { getManifest } from '../api.js';
import { loadArtifactRegistry } from '../registry.js';
import { boundDiagnostics } from './diagnostics.js';
import { relativeProjectPath, resolveProjectFile, resolveProjectRoot } from './project.js';
import { validateRegistryRules } from './registry.js';
import { validateTypeScript } from './typescript.js';

const MAX_INPUT_BYTES = 1_000_000;
const AVAILABLE_RULES = new Set<ValidationRule>(['registry', 'typescript']);
const utf8 = new TextDecoder('utf-8', { fatal: true });

function assertRequest(request: ValidationRequest) {
  const fileMode = typeof request.file === 'string';
  const codeMode = typeof request.code === 'string' && typeof request.virtualFile === 'string';
  if (
    request.schemaVersion !== '1.0.0' ||
    typeof request.requestId !== 'string' ||
    !request.requestId ||
    !Number.isInteger(request.timeoutMs) ||
    request.timeoutMs < 1 ||
    request.timeoutMs > 60_000 ||
    fileMode === codeMode ||
    (codeMode && !/\.[cm]?[jt]sx?$/.test(request.virtualFile!))
  ) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: validation requires schema version 1.0.0, a request ID, and a 1–60000ms timeout.',
    );
  }
  for (const rule of request.rules || []) {
    if (!AVAILABLE_RULES.has(rule)) {
      throw new TaleToolingError(
        'TALE_INVALID_ARGUMENT',
        'Tale UI: validation rules must be registry or typescript.',
      );
    }
  }
  if (request.rules && new Set(request.rules).size !== request.rules.length) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: validation rules must not contain duplicates.',
    );
  }
  if (codeMode && Buffer.byteLength(request.code!, 'utf8') > MAX_INPUT_BYTES) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: inline validation input exceeds the 1,000,000-byte limit.',
    );
  }
}

function isCodeRequest(request: ValidationRequest): request is ValidationCodeRequest {
  return typeof request.code === 'string' && typeof request.virtualFile === 'string';
}

function readTarget(path: string) {
  try {
    const value = readFileSync(path);
    if (value.byteLength > MAX_INPUT_BYTES) {
      throw new TaleToolingError(
        'TALE_INVALID_ARGUMENT',
        'Tale UI: the validation file exceeds the 1,000,000-byte limit.',
      );
    }
    return utf8.decode(value);
  } catch (cause) {
    if (cause instanceof TaleToolingError) {
      throw cause;
    }
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: the validation file must contain valid UTF-8 text.',
      { cause },
    );
  }
}

export function validateRequestCore(request: ValidationRequest): ValidationResult {
  assertRequest(request);
  const root = resolveProjectRoot(request.root);
  const inline = isCodeRequest(request);
  const absoluteFile = resolveProjectFile(root, inline ? request.virtualFile : request.file, {
    mustExist: !inline,
  });
  const path = relativeProjectPath(root, absoluteFile);
  const code = inline ? request.code : readTarget(absoluteFile);
  const rules = new Set(request.rules || AVAILABLE_RULES);
  const diagnostics = rules.has('registry')
    ? validateRegistryRules(code, path, loadArtifactRegistry())
    : [];
  let fallbackConfig = false;
  if (rules.has('typescript')) {
    const result = validateTypeScript(root, absoluteFile, code);
    diagnostics.push(...result.diagnostics);
    fallbackConfig = result.fallbackConfig;
  }
  const bounded = boundDiagnostics(diagnostics);
  const manifest = getManifest();
  return {
    schemaVersion: '1.0.0',
    requestId: request.requestId,
    valid: bounded.every((diagnostic) => diagnostic.severity !== 'error'),
    diagnostics: bounded,
    versions: {
      contract: manifest.contractVersion,
      registry: manifest.registryVersion,
      capabilityManifest: manifest.capabilityManifestVersion,
      packages: manifest.packageVersions,
      typescript: ts.version,
    },
    fallbackConfig,
  };
}
