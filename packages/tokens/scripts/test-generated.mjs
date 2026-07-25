#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const packageRoot = path.resolve(import.meta.dirname, '..');
const generated = await fs.readFile(path.join(packageRoot, 'src/generated.ts'), 'utf8');
const figmaModule = await fs.readFile(path.join(packageRoot, 'src/figma.ts'), 'utf8');
const native = JSON.parse(await fs.readFile(path.join(packageRoot, 'native.json'), 'utf8'));
const figma = JSON.parse(await fs.readFile(path.join(packageRoot, 'figma/variables.json'), 'utf8'));

assert.match(generated, /space4xs: 5\.2/);
assert.match(generated, /radiusM: 10/);
assert.match(generated, /textM: 16/);
assert.match(generated, /brand60: '#025768'/);
assert.match(generated, /light:/);
assert.match(generated, /dark:/);
assert.equal(native.modes.light['--brand-60'], '#025768');
assert.equal(native.modes.dark['--color-60'], '#539198');
assert.deepEqual(figma.collections[0].modes, ['light', 'dark']);
assert.ok(figma.collections[0].variables.length > 500);
assert.match(figmaModule, /export const figmaVariables/);

process.stdout.write(
  '✓ Generated web, native, and Figma tokens contain the expected canonical values.\n',
);
