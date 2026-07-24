import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VALIDATOR = resolve(__dirname, 'validate-generated.mjs');

function runValidator(code) {
  try {
    const stdout = execFileSync(process.execPath, [VALIDATOR, '--json', '--code', code], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return JSON.parse(stdout);
  } catch (err) {
    const stdout = err.stdout || '';
    return JSON.parse(stdout);
  }
}

test('validate-generated accepts app-level @tale-ui/react/styles imports', () => {
  const result = runValidator(
    "import '@tale-ui/react/styles';\nimport { Button } from '@tale-ui/react/button';\n\nexport function Demo() {\n  return <Button variant=\"primary\">Save</Button>;\n}\n",
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.registryErrors, []);
  assert.deepEqual(result.typescriptErrors, []);
});

test('validate-generated retains warnings without reporting legacy errors', () => {
  const result = runValidator(
    "import { Checkbox } from '@tale-ui/react/checkbox';\n\nexport const Example = Checkbox;\n",
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.registryErrors, []);
  assert.deepEqual(result.typescriptErrors, []);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === 'TALE_DEPRECATED_ARTIFACT' && diagnostic.severity === 'warning',
    ),
  );
});
