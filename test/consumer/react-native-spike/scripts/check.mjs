import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fixture = join(root, 'fixture');
const dist = join(fixture, 'dist');
mkdirSync(dist, { recursive: true });

for (const name of ['index', 'button']) {
  const source = readFileSync(join(fixture, 'src', `${name}.ts`), 'utf8')
    .replace(/: string/g, '')
    .replace("from './button'", "from './button.js'");
  writeFileSync(join(dist, `${name}.js`), source);
  writeFileSync(join(dist, `${name}.cjs`), source.replace('export const', 'exports.'));
  writeFileSync(
    join(dist, `${name}.d.ts`),
    name === 'button'
      ? 'export declare const getFixtureButtonLabel: () => string;\n'
      : "export { getFixtureButtonLabel } from './button.js';\n",
  );
}

const packOutput = execFileSync('pnpm', ['pack', '--pack-destination', root], {
  cwd: fixture,
  encoding: 'utf8',
});
const tarball = packOutput.trim().split('\n').at(-1);
const consumer = mkdtempSync(join(tmpdir(), 'tale-rn-spike-'));
mkdirSync(join(consumer, 'node_modules', '@tale-ui'), { recursive: true });
execFileSync('tar', ['-xzf', tarball, '-C', join(consumer, 'node_modules', '@tale-ui')]);
cpSync(
  join(consumer, 'node_modules', '@tale-ui', 'package'),
  join(consumer, 'node_modules', '@tale-ui', 'react-native-spike-fixture'),
  { recursive: true },
);
const imported = await import(
  join(consumer, 'node_modules/@tale-ui/react-native-spike-fixture/dist/index.js')
);
if (imported.getFixtureButtonLabel() !== 'Fixture button') {
  throw new Error('Packed fixture public export returned an unexpected value.');
}
process.stdout.write(`Packed fixture import passed: ${tarball}\n`);
