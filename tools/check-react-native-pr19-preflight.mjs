#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPOSITORY = 'Tale-UI/tale-ui';
const PR_NUMBER = '19';
const PACKAGE_NAME = '@tale-ui/react-native';
const PACKAGE_PATHS = ['packages/react-native/package.json', 'packages/foundations/package.json'];

export class PreflightError extends Error {
  constructor(message, decision = 'ambiguous') {
    super(message);
    this.name = 'PreflightError';
    this.decision = decision;
  }
}

const command = (executable, args, options = {}) =>
  execFileSync(executable, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();

const defaultDependencies = {
  queryPr: () =>
    JSON.parse(
      command('gh', [
        'pr',
        'view',
        PR_NUMBER,
        '--repo',
        REPOSITORY,
        '--json',
        'baseRefName,baseRefOid',
      ]),
    ),
  fetchBase: (baseName) => {
    command('git', ['fetch', '--no-tags', 'origin', baseName]);
    return command('git', ['rev-parse', 'FETCH_HEAD']);
  },
  commitExists: (oid) => {
    try {
      command('git', ['cat-file', '-e', `${oid}^{commit}`]);
      return true;
    } catch {
      return false;
    }
  },
  pathExistsAtBase: (oid, path) => {
    try {
      command('git', ['cat-file', '-e', `${oid}:${path}`]);
      return true;
    } catch {
      return false;
    }
  },
  resolveRegistry: () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(ROOT, 'packages/react-native/package.json'), 'utf8'),
    );
    return packageJson.publishConfig?.registry || command('npm', ['config', 'get', 'registry']);
  },
  inspectRegistry: (registry) => inspectRegistry(registry),
};

const normalizeRegistry = (registry) => {
  if (!registry || registry === 'undefined' || registry === 'null') {
    throw new PreflightError('No npm registry is configured.', 'unavailable');
  }
  try {
    const url = new URL(registry);
    url.pathname = `${url.pathname.replace(/\/?$/, '/')}`;
    return url.href;
  } catch {
    throw new PreflightError(`Invalid npm registry URL: ${registry}`, 'unavailable');
  }
};

const packageUrl = (registry, suffix = '') =>
  new URL(`${encodeURIComponent(PACKAGE_NAME)}${suffix}`, normalizeRegistry(registry)).href;

const wildcardMatches = (pattern, subpath) => {
  if (!pattern.includes('*')) {
    return pattern === subpath;
  }
  const escaped = pattern
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${escaped}$`).test(subpath);
};

export const exportsRadioField = (exportsMap) => {
  if (!exportsMap || typeof exportsMap !== 'object' || Array.isArray(exportsMap)) {
    throw new PreflightError(
      'A published manifest is missing an explicit exports map.',
      'ambiguous',
    );
  }
  return Object.keys(exportsMap).some((key) => wildcardMatches(key, './radio-field'));
};

const readJsonResponse = async (response, description) => {
  try {
    return await response.json();
  } catch {
    throw new PreflightError(`${description} returned invalid JSON.`, 'unavailable');
  }
};

export async function inspectRegistry(registry, fetchImpl = globalThis.fetch) {
  const normalizedRegistry = normalizeRegistry(registry);
  let packageResponse;
  try {
    packageResponse = await fetchImpl(packageUrl(normalizedRegistry), {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
    });
  } catch (error) {
    throw new PreflightError(`Registry package query failed: ${error.message}`, 'unavailable');
  }

  if (packageResponse.status === 404) {
    return { registry: normalizedRegistry, inspectedVersions: [], decision: 'safe-unpublished' };
  }
  if (!packageResponse.ok) {
    throw new PreflightError(
      `Registry package query returned HTTP ${packageResponse.status}.`,
      'unavailable',
    );
  }

  const packument = await readJsonResponse(packageResponse, 'Registry package query');
  const versions = Object.keys(packument.versions ?? {}).sort((a, b) =>
    a.localeCompare(b, 'en', { numeric: true }),
  );
  if (versions.length === 0) {
    throw new PreflightError('Published package data has no versions.', 'ambiguous');
  }

  for (const version of versions) {
    let manifestResponse;
    try {
      manifestResponse = await fetchImpl(packageUrl(normalizedRegistry, `/${version}`), {
        headers: { accept: 'application/json' },
      });
    } catch (error) {
      throw new PreflightError(
        `Registry manifest query for ${version} failed: ${error.message}`,
        'unavailable',
      );
    }
    if (!manifestResponse.ok) {
      throw new PreflightError(
        `Registry manifest query for ${version} returned HTTP ${manifestResponse.status}.`,
        manifestResponse.status >= 500 ? 'unavailable' : 'ambiguous',
      );
    }
    const manifest = await readJsonResponse(manifestResponse, `Manifest ${version}`);
    if (!manifest || manifest.version !== version) {
      throw new PreflightError(`Manifest ${version} is missing or incomplete.`, 'ambiguous');
    }
    if (exportsRadioField(manifest.exports)) {
      throw new PreflightError(`Published version ${version} exposes ./radio-field.`, 'exposed');
    }
  }

  return {
    registry: normalizedRegistry,
    inspectedVersions: versions,
    decision: 'safe-explicitly-unexposed',
  };
}

const requireBase = (pr, label) => {
  if (!pr?.baseRefName || !pr?.baseRefOid) {
    throw new PreflightError(`${label} PR query is missing baseRefName or baseRefOid.`);
  }
  return pr;
};

export async function validatePreflight({
  expectedBaseOid,
  dependencies = defaultDependencies,
} = {}) {
  const initial = requireBase(await dependencies.queryPr(), 'Initial');
  if (expectedBaseOid && initial.baseRefOid !== expectedBaseOid) {
    throw new PreflightError(
      `PR base ${initial.baseRefOid} differs from expected base ${expectedBaseOid}.`,
    );
  }

  const fetchedOid = await dependencies.fetchBase(initial.baseRefName);
  if (fetchedOid !== initial.baseRefOid) {
    throw new PreflightError(
      `Fetched ${initial.baseRefName} at ${fetchedOid}, expected ${initial.baseRefOid}.`,
    );
  }
  if (!(await dependencies.commitExists(initial.baseRefOid))) {
    throw new PreflightError(`PR base ${initial.baseRefOid} does not resolve to a commit.`);
  }
  for (const path of PACKAGE_PATHS) {
    if (await dependencies.pathExistsAtBase(initial.baseRefOid, path)) {
      throw new PreflightError(`PR base unexpectedly contains ${path}.`);
    }
  }

  const registry = await dependencies.resolveRegistry();
  const compatibility = await dependencies.inspectRegistry(registry);
  if (!['safe-unpublished', 'safe-explicitly-unexposed'].includes(compatibility.decision)) {
    throw new PreflightError(
      `Registry compatibility decision is ${compatibility.decision}.`,
      compatibility.decision,
    );
  }

  const final = requireBase(await dependencies.queryPr(), 'Final');
  if (
    final.baseRefName !== initial.baseRefName ||
    final.baseRefOid !== initial.baseRefOid ||
    (expectedBaseOid && final.baseRefOid !== expectedBaseOid)
  ) {
    throw new PreflightError(
      `PR base changed from ${initial.baseRefName}@${initial.baseRefOid} to ` +
        `${final.baseRefName}@${final.baseRefOid}.`,
    );
  }

  return {
    baseName: final.baseRefName,
    baseOid: final.baseRefOid,
    registry: compatibility.registry,
    inspectedVersions: compatibility.inspectedVersions,
    decision: compatibility.decision,
  };
}

const expectedFlag = process.argv.indexOf('--expected-base-oid');
const expectedBaseOid = expectedFlag === -1 ? undefined : process.argv[expectedFlag + 1];
if (expectedFlag !== -1 && !expectedBaseOid) {
  process.stderr.write('Missing value for --expected-base-oid.\n');
  process.exitCode = 1;
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const result = await validatePreflight({ expectedBaseOid });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    const decision = error instanceof PreflightError ? error.decision : 'unavailable';
    process.stderr.write(`React Native PR #19 preflight (${decision}): ${error.message}\n`);
    process.exitCode = 1;
  }
}
