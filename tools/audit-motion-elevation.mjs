#!/usr/bin/env node

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(import.meta.dirname, '..');
const STYLE_ROOT = join(ROOT, 'packages/styles/src');
const INVENTORY_PATH = join(ROOT, 'test/baselines/roadmap/motion-elevation.json');
const CHECK = process.argv.includes('--check');
const TODAY = new Date().toISOString().slice(0, 10);

const REQUIRED_TOKENS = [
  '--elevation-flat',
  '--elevation-floating',
  '--elevation-modal',
  '--elevation-overlay',
  '--elevation-raised',
  '--elevation-toast',
  '--motion-content-duration',
  '--motion-content-easing',
  '--motion-enter-duration',
  '--motion-enter-easing',
  '--motion-exit-duration',
  '--motion-exit-easing',
  '--motion-feedback-duration',
  '--motion-feedback-easing',
  '--motion-state-duration',
  '--motion-state-easing',
];

const declarationPattern =
  /(?:^|\n)\s*(transition(?:-[a-z-]+)?|animation(?:-[a-z-]+)?|box-shadow)\s*:\s*([^;]+);/g;
const rawMotionPattern =
  /(?:^|[\s,(])(?:\d*\.?\d+)(?:ms|s)\b|\b(?:ease(?:-in|-out|-in-out)?|linear|cubic-bezier)\b/;
const rawShadowPattern = /(?:^|,)\s*-?\d*\.?\d+(?:px|rem)?\s/;

function scan() {
  const motion = new Map();
  const shadows = new Map();
  for (const name of readdirSync(STYLE_ROOT)
    .filter((entry) => entry.endsWith('.css'))
    .sort()) {
    const path = `packages/styles/src/${name}`;
    const css = readFileSync(join(ROOT, path), 'utf8');
    for (const match of css.matchAll(declarationPattern)) {
      const [, property, value] = match;
      if (property.startsWith('box-shadow')) {
        if (rawShadowPattern.test(value) && !value.trim().startsWith('var(')) {
          shadows.set(path, (shadows.get(path) ?? 0) + 1);
        }
      } else if (rawMotionPattern.test(value) && !value.includes('var(--motion-')) {
        motion.set(path, (motion.get(path) ?? 0) + 1);
      }
    }
  }
  const inventory = (values) => ({
    declarationCount: [...values.values()].reduce((sum, count) => sum + count, 0),
    files: [...values].map(([path, count]) => ({ path, count })),
  });
  return { rawMotion: inventory(motion), rawShadows: inventory(shadows) };
}

const scanned = scan();
if (!CHECK) {
  const inventory = {
    schemaVersion: '1.0.0',
    generatedAt: TODAY,
    source: 'packages/styles/src',
    policy: {
      mode: 'ratchet',
      maxRawMotionDeclarations: scanned.rawMotion.declarationCount,
      maxRawShadowDeclarations: scanned.rawShadows.declarationCount,
    },
    ...scanned,
    semanticTokens: REQUIRED_TOKENS,
    platformExceptions: [
      {
        platform: 'react-native',
        scope: 'CSS box-shadow recipes and cubic-bezier strings',
        reason:
          'Native shadow and animation APIs use platform objects; P3-C owns deterministic mappings.',
        owner: 'Design Systems',
        reviewBy: '2027-01-31',
      },
    ],
  };
  writeFileSync(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(`GENERATED: ${INVENTORY_PATH.slice(ROOT.length + 1)}`);
  process.exit(0);
}

assert.ok(existsSync(INVENTORY_PATH), 'Run pnpm audit:motion:elevation to create the baseline');
const inventory = JSON.parse(readFileSync(INVENTORY_PATH, 'utf8'));
const schema = JSON.parse(readFileSync(join(ROOT, 'schemas/motion-elevation.schema.json'), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
assert.ok(validate(inventory), ajv.errorsText(validate.errors, { separator: '\n' }));
assert.ok(
  scanned.rawMotion.declarationCount <= inventory.policy.maxRawMotionDeclarations,
  `Raw motion declarations increased from ${inventory.policy.maxRawMotionDeclarations} to ${scanned.rawMotion.declarationCount}`,
);
assert.ok(
  scanned.rawShadows.declarationCount <= inventory.policy.maxRawShadowDeclarations,
  `Raw shadow declarations increased from ${inventory.policy.maxRawShadowDeclarations} to ${scanned.rawShadows.declarationCount}`,
);

const tokenSource = readFileSync(join(ROOT, 'packages/tokens/tokens.json'), 'utf8');
for (const token of REQUIRED_TOKENS) {
  assert.ok(tokenSource.includes(`"${token}"`), `Missing semantic token ${token}`);
}
assert.match(tokenSource, /"media": "\(prefers-reduced-motion: reduce\)"/);
for (const exception of inventory.platformExceptions) {
  assert.ok(exception.reviewBy >= TODAY, `Expired motion exception: ${exception.scope}`);
}
for (const path of [
  'packages/styles/src/app-shell.css',
  'packages/styles/src/chat.css',
  'packages/styles/src/code-block.css',
  'packages/styles/src/kbd.css',
]) {
  const css = readFileSync(join(ROOT, path), 'utf8');
  for (const match of css.matchAll(declarationPattern)) {
    if (!match[1].startsWith('box-shadow')) {
      assert.ok(
        !rawMotionPattern.test(match[2]) || match[2].includes('var(--motion-'),
        `${path} introduces raw motion: ${match[0].trim()}`,
      );
    }
  }
}
console.log(
  `OK: semantic motion/elevation tokens; raw debt ratcheted at ${scanned.rawMotion.declarationCount} motion and ${scanned.rawShadows.declarationCount} shadow declarations`,
);
