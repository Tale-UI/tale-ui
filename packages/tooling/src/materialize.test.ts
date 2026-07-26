import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { TaleToolingError } from './contracts/errors.js';
import { addTemplate, initializeProject, listTemplates } from './materialize.js';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'tale-materialize-'));
  await writeFile(
    join(root, 'package.json'),
    `${JSON.stringify({ name: 'fixture', private: true, scripts: {} }, null, 2)}\n`,
  );
  return root;
}

test('template inventory contains the exact ten starters and two Chat templates', async () => {
  const templates = await listTemplates();
  assert.deepEqual(
    templates.map((template) => template.id),
    [
      'tale:template:app-header',
      'tale:template:chart-dashboard',
      'tale:template:chat-artifact-panel',
      'tale:template:chat-mobile',
      'tale:template:command-palette-dashboard',
      'tale:template:empty-state',
      'tale:template:loading-patterns',
      'tale:template:react-hook-form',
      'tale:template:settings-page',
      'tale:template:sidebar-header',
      'tale:template:sortable-table',
      'tale:template:validated-form',
    ],
  );
  for (const template of templates) {
    assert.deepEqual(template.appearance, ['light', 'dark']);
    assert.equal(template.rtl, true);
    assert.match(template.digest, /^sha256:[a-f0-9]{64}$/);
  }
});

test('init safely manages the four requested outputs and terminally replays', async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, 'AGENTS.md'), '# Consumer instructions\n');
    const request = {
      schemaVersion: '1.0.0' as const,
      requestId: 'init-1',
      root,
      idempotencyKey: 'init-key',
      addScripts: true,
    };
    const result = await initializeProject(request);
    assert.equal(result.files.length, 4);
    assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /tale-ui:agents:start/);
    assert.match(await readFile(join(root, '.cursorrules'), 'utf8'), /tale-ui:cursor:start/);
    assert.deepEqual(JSON.parse(await readFile(join(root, '.mcp.json'), 'utf8')).mcpServers, {
      'tale-ui': { command: 'tale-mcp', args: [] },
    });
    assert.deepEqual(JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).scripts, {
      'tale:doctor': 'tale doctor --json',
      'tale:validate': 'tale validate src --rules registry,typescript',
    });
    const replay = await initializeProject({ ...request, requestId: 'init-2' });
    assert.equal(replay.replayed, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('template add materializes source, merges dependencies, and refuses overwrite', async () => {
  const root = await fixture();
  try {
    const request = {
      schemaVersion: '1.0.0' as const,
      requestId: 'template-1',
      root,
      idempotencyKey: 'template-key',
      template: 'empty-state',
    };
    const result = await addTemplate(request);
    assert.equal(result.template.id, 'tale:template:empty-state');
    assert.match(
      await readFile(join(root, 'src/tale-templates/empty-state.tsx'), 'utf8'),
      /export function Example/,
    );
    assert.equal(
      JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).dependencies['@tale-ui/react'],
      '^3.0.0',
    );
    const replay = await addTemplate({ ...request, requestId: 'template-2' });
    assert.equal(replay.replayed, true);
    await assert.rejects(
      () =>
        addTemplate({
          ...request,
          requestId: 'template-3',
          idempotencyKey: 'other-key',
          skeleton: true,
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_TEMPLATE_CONFLICT',
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
