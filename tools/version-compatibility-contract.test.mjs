import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const ROOT = resolve(import.meta.dirname, '..');
const coordinated = ['tokens', 'css', 'react', 'styles', 'themes', 'utils'];

function read(path) {
  return readFileSync(join(ROOT, path), 'utf8');
}

function json(path) {
  return JSON.parse(read(path));
}

function gitJson(revision, path) {
  return JSON.parse(
    execFileSync('git', ['show', `${revision}:${path}`], {
      cwd: ROOT,
      encoding: 'utf8',
    }),
  );
}

test('release preparation keeps coordinated and independent versions exact', () => {
  for (const packageDirectory of coordinated) {
    assert.equal(
      json(`packages/${packageDirectory}/package.json`).version,
      '2.2.0',
      `${packageDirectory} must be coordinated at 2.2.0`,
    );
  }
  assert.equal(json('packages/tooling/package.json').version, '0.2.0');
  assert.equal(json('packages/react/package.json').engines.node, '>=18');
  assert.equal(json('packages/tooling/package.json').engines.node, '>=22');
  assert.match(json('package.json').engines.node, /^>=22/);
});

test('historical documentation anchors remain pinned to exact revisions', () => {
  assert.equal(
    execFileSync('git', ['rev-parse', 'release-v2.0.0'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim(),
    'be1b3be433ddf244f57e252260afda448249169d',
  );
  assert.equal(
    execFileSync('git', ['rev-parse', 'react-v1.3.56'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim(),
    '16e8ae2b3f26fdc2015cc10aa2d689edcbf60ca2',
  );
  const manifest = json('docs/versioned/manifest.json');
  assert.deepEqual(
    manifest.versions.map(({ major }) => major),
    [3, 2, 1],
  );
  assert.equal(manifest.versions[1].source, 'release-v2.0.0');
  assert.equal(manifest.versions[2].source, 'react-v1.3.56');
  assert.deepEqual(json('docs/versioned/rollback.json'), {
    schemaVersion: '1.0.0',
    currentMajor: 3,
    previousMajor: 2,
    lastKnownGood: '/docs/v2/',
    manifestDigest: json('docs/versioned/rollback.json').manifestDigest,
  });
});

test('historical Node declarations cannot become Node 14 or 16 recommendations', () => {
  for (const revision of ['release-v2.0.0', 'react-v1.3.56']) {
    const manifest = gitJson(revision, 'packages/react/package.json');
    assert.match(manifest.engines.node, />=14/);
    assert.match(manifest.dependencies['@modelcontextprotocol/sdk'], /1\.28\.0/);
  }
  const compatibility = read('docs/compatibility.md');
  const migration = read('docs/migrating-to-v3.md');
  const security = read('SECURITY.md');
  for (const document of [compatibility, migration, security]) {
    assert.match(document, /Node 14/);
    assert.match(document, /Node 16/);
    assert.match(document, /upgrade Node/i);
  }
  assert.match(compatibility, /does not recommend a\s+historical release line/i);
  assert.match(compatibility, /Maintained 2\.x guidance is limited[\s\S]*Node 18/i);
  assert.match(security, /\|\s*3\.x\.x[\s\S]*Current major[\s\S]*Node 18\+/);
});

test('all 12 maintained templates carry the React 3 content contract', () => {
  const directories = readdirSync(join(ROOT, 'packages/tooling/templates'), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .toSorted();
  assert.equal(directories.length, 12);
  for (const directory of directories) {
    const template = json(`packages/tooling/templates/${directory}/template.json`);
    assert.equal(template.schemaVersion, '1.0.0');
    assert.equal(template.version, '2.0.0');
    assert.equal(template.dependencies['@tale-ui/react'], '^3.0.0');
    assert.equal(template.compatibility.tale, '>=3.0.0 <4.0.0');
    assert.deepEqual(template.compatibility.frameworks, ['next', 'vite']);
    assert.match(template.digest, /^sha256:[a-f0-9]{64}$/);
  }
});
