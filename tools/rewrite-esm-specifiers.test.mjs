import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { rewriteEsmSpecifiers } from './rewrite-esm-specifiers.mjs';

test('rewrites file and directory imports for Node-compatible ESM', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tale-esm-specifiers-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await fs.mkdir(path.join(root, 'button'));
  await fs.writeFile(path.join(root, 'Button.styled.js'), 'export const Button = {};\n');
  await fs.writeFile(
    path.join(root, 'button', 'index.js'),
    "export { Button } from '../Button.styled';\n",
  );
  await fs.writeFile(
    path.join(root, 'index.js'),
    "export * from './button';\nimport './styles.css';\n",
  );
  await fs.writeFile(
    path.join(root, 'index.d.ts'),
    [
      "export * from './button';",
      "export type { Button } from './Button.styled';",
      "export type Self = import('.').Button;",
      '',
    ].join('\n'),
  );

  const result = await rewriteEsmSpecifiers(root);

  assert.deepEqual(result, { rewrittenFiles: 3, rewrittenSpecifiers: 5 });
  assert.equal(
    await fs.readFile(path.join(root, 'index.js'), 'utf8'),
    "export * from './button/index.js';\nimport './styles.css';\n",
  );
  assert.equal(
    await fs.readFile(path.join(root, 'index.d.ts'), 'utf8'),
    [
      "export * from './button/index.js';",
      "export type { Button } from './Button.styled.js';",
      "export type Self = import('./index.js').Button;",
      '',
    ].join('\n'),
  );
  assert.equal(
    await fs.readFile(path.join(root, 'button', 'index.js'), 'utf8'),
    "export { Button } from '../Button.styled.js';\n",
  );
});

test('fails closed when a relative module cannot be resolved', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tale-esm-specifiers-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, 'index.js'), "export * from './missing';\n");

  await assert.rejects(
    rewriteEsmSpecifiers(root),
    /Cannot resolve relative ESM specifier "\.\/missing"/,
  );
});

test('ignores import-like syntax in comments', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tale-esm-specifiers-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const source = [
    "// 🚫 export * from './disabled-line';",
    "/* import './disabled-block'; */",
    `const message = "export * from './disabled-string'";`,
    "const example = `import('./disabled-template')`;",
    "const url = 'https://example.com/import';",
    '',
  ].join('\n');
  await fs.writeFile(path.join(root, 'index.js'), source);

  assert.deepEqual(await rewriteEsmSpecifiers(root), {
    rewrittenFiles: 0,
    rewrittenSpecifiers: 0,
  });
  assert.equal(await fs.readFile(path.join(root, 'index.js'), 'utf8'), source);
});
