import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { TaleToolingError } from './contracts/errors.js';
import { applyMigration, listMigrations, planMigration } from './migrations.js';

async function fixture(dependencies: Record<string, string> = {}) {
  const root = await mkdtemp(join(tmpdir(), 'tale-migration-'));
  await writeFile(
    join(root, 'package.json'),
    `${JSON.stringify({ name: 'fixture', private: true, dependencies }, null, 2)}\n`,
  );
  await mkdir(join(root, 'src'));
  return root;
}

test('migration inventory contains exactly four ordered starter groups', async () => {
  const migrations = await listMigrations();
  assert.deepEqual(
    migrations.map(({ id, order, group }) => ({ id, order, group })),
    [
      { id: 'v1-to-v2-package-rename', order: 10, group: 'package-rename' },
      { id: 'deprecated-field-controls', order: 20, group: 'deprecated-api' },
      { id: 'ui-color-token-aliases', order: 30, group: 'token-name' },
      { id: 'known-import-path-corrections', order: 40, group: 'import-path' },
    ],
  );
});

test('package rename dry-runs, applies, verifies postimages, and is idempotent', async () => {
  const root = await fixture({ '@tale-ui/core': '^1.3.56' });
  try {
    await writeFile(join(root, 'src/app.css'), "@import '@tale-ui/core';\n");
    const request = {
      schemaVersion: '1.0.0' as const,
      requestId: 'package-rename',
      root,
      migration: 'v1-to-v2-package-rename',
    };
    const plan = await planMigration(request);
    assert.equal(plan.state, 'applicable');
    assert.deepEqual(
      plan.files.map(({ path, action }) => ({ path, action })),
      [
        { path: 'package.json', action: 'update' },
        { path: 'src/app.css', action: 'update' },
      ],
    );
    const result = await applyMigration({ ...request, planDigest: plan.planDigest });
    assert.ok(result.operationId);
    assert.match(await readFile(join(root, 'package.json'), 'utf8'), /@tale-ui\/css/);
    assert.equal(await readFile(join(root, 'src/app.css'), 'utf8'), "@import '@tale-ui/css';\n");
    assert.equal((await planMigration(request)).state, 'already-migrated');
    assert.equal((await applyMigration(request)).replayed, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('field-control migration preserves labels inside field buttons', async () => {
  const root = await fixture({ '@tale-ui/react': '^2.0.0' });
  try {
    await writeFile(
      join(root, 'src/controls.tsx'),
      [
        "import { Checkbox, type CheckboxRootProps } from '@tale-ui/react/checkbox';",
        "import { Radio } from '@tale-ui/react/radio';",
        "import { Switch } from '@tale-ui/react/switch';",
        '<Checkbox.Root><Checkbox.Indicator />Accept</Checkbox.Root>',
        '<Radio.Group><Radio.Root value="a"><Radio.Indicator><Radio.Dot /></Radio.Indicator>A</Radio.Root></Radio.Group>',
        '<Switch.Root><Switch.Thumb />Enable</Switch.Root>',
        '',
      ].join('\n'),
    );
    await applyMigration({
      schemaVersion: '1.0.0',
      requestId: 'controls',
      root,
      migration: 'deprecated-field-controls',
    });
    const output = await readFile(join(root, 'src/controls.tsx'), 'utf8');
    assert.match(output, /CheckboxField\.Root><CheckboxField\.Button>/);
    assert.match(output, /RadioGroup>/);
    assert.match(output, /RadioField\.Button>/);
    assert.match(output, /SwitchField\.Button>/);
    assert.match(output, /import \{ type CheckboxRootProps \} from '@tale-ui\/react\/checkbox';/);
    assert.match(output, /import \{ CheckboxField \} from '@tale-ui\/react\/checkbox-field';/);
    assert.doesNotMatch(output, /import \{ Checkbox(?:,|\s*\})/);
    assert.doesNotMatch(output, /@tale-ui\/react\/(?:radio|switch)'/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('token and import-path groups make only their evidence-backed corrections', async () => {
  const root = await fixture({ '@tale-ui/react': '^2.0.0' });
  try {
    await writeFile(
      join(root, 'src/component.css'),
      ':root { --brand-50: red; }\n.component { color: var(--brand-50); }\n',
    );
    await writeFile(
      join(root, 'src/imports.ts'),
      [
        "import { TextArea } from '@tale-ui/react/textarea';",
        "import { ToggleButtonGroup } from '@tale-ui/react/toggle-button-group';",
        "import { Virtualizer } from 'react-aria-components/virtualizer';",
        '',
      ].join('\n'),
    );
    await applyMigration({
      schemaVersion: '1.0.0',
      requestId: 'tokens',
      root,
      migration: 'ui-color-token-aliases',
    });
    await applyMigration({
      schemaVersion: '1.0.0',
      requestId: 'imports',
      root,
      migration: 'known-import-path-corrections',
    });
    assert.equal(
      await readFile(join(root, 'src/component.css'), 'utf8'),
      ':root { --brand-50: red; }\n.component { color: var(--color-50); }\n',
    );
    const imports = await readFile(join(root, 'src/imports.ts'), 'utf8');
    assert.match(imports, /@tale-ui\/react\/text-area/);
    assert.match(imports, /@tale-ui\/react\/toggle-button/);
    assert.match(imports, /@tale-ui\/react\/virtualizer/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('migration rejects mixed, unsupported, stale, and unapproved sensitive states', async () => {
  const mixed = await fixture({ '@tale-ui/core': '^1.3.56', '@tale-ui/css': '^2.0.0' });
  const unsupported = await fixture({ '@tale-ui/react': '^3.0.0' });
  const stale = await fixture({ '@tale-ui/core': '^1.3.56' });
  try {
    await assert.rejects(
      () =>
        planMigration({
          schemaVersion: '1.0.0',
          requestId: 'mixed',
          root: mixed,
          migration: 'v1-to-v2-package-rename',
        }),
      (error) =>
        error instanceof TaleToolingError && error.code === 'TALE_MALFORMED_PROJECT_CONFIG',
    );
    await assert.rejects(
      () =>
        planMigration({
          schemaVersion: '1.0.0',
          requestId: 'unsupported',
          root: unsupported,
          migration: 'known-import-path-corrections',
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_VERSION_RANGE_MISMATCH',
    );
    await writeFile(join(stale, 'src/file.ts'), "import '@tale-ui/core';\n");
    const request = {
      schemaVersion: '1.0.0' as const,
      requestId: 'stale',
      root: stale,
      migration: 'v1-to-v2-package-rename',
      files: ['src/file.ts'],
    };
    const plan = await planMigration(request);
    await writeFile(join(stale, 'src/file.ts'), "import '@tale-ui/core/min';\n");
    await assert.rejects(
      () => applyMigration({ ...request, planDigest: plan.planDigest }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_CHANGED_SINCE_PLAN',
    );
    await writeFile(join(stale, '.env.ts'), "import '@tale-ui/core';\n");
    const protectedPlan = await planMigration({
      ...request,
      requestId: 'sensitive',
      files: ['.env.ts'],
    });
    assert.equal(protectedPlan.files[0]?.action, 'skipped');
    assert.equal(protectedPlan.files[0]?.reason, 'sensitive');
  } finally {
    await Promise.all(
      [mixed, unsupported, stale].map((root) => rm(root, { recursive: true, force: true })),
    );
  }
});
