#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(ROOT, 'packages/tooling/migrations');
const CHECK = process.argv.includes('--check');

const migrations = [
  {
    slug: '10-package-rename',
    manifest: {
      id: 'v1-to-v2-package-rename',
      order: 10,
      group: 'package-rename',
      description: 'Rename the v1 @tale-ui/core CSS package to @tale-ui/css for v2.',
      from: '@tale-ui/core@>=1.0.0 <2.0.0',
      to: '@tale-ui/css@>=2.0.0 <3.0.0',
      dependencies: [],
      affectedArtifacts: ['tale:foundation:css-architecture'],
      deprecations: [
        {
          id: '@tale-ui/core',
          replacementId: '@tale-ui/css',
          documentation: 'https://tale-ui.dev/migrations/v1-to-v2-package-rename',
        },
      ],
      sourceEvidence: ['CHANGELOG.md#v200--2026-07-24', 'css-v1.3.56'],
      parsers: ['text', 'json', 'css', 'typescript'],
      sensitiveFiles: 'require-explicit',
      generatedFiles: 'require-explicit',
      reversible: true,
      backupPolicy: 'required',
      idempotent: true,
    },
    transform: {
      schemaVersion: '1.0.0',
      operation: 'literal-replacements',
      replacements: [{ search: '@tale-ui/core', replacement: '@tale-ui/css' }],
      extensions: ['.css', '.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'],
    },
  },
  {
    slug: '20-field-controls',
    manifest: {
      id: 'deprecated-field-controls',
      order: 20,
      group: 'deprecated-api',
      description:
        'Migrate deprecated Checkbox, Radio, and Switch namespaces to field/button APIs.',
      from: '@tale-ui/react@>=1.3.53 <3.0.0',
      to: '@tale-ui/react field controls@>=1.3.53 <3.0.0',
      dependencies: [],
      affectedArtifacts: [
        'tale:component:checkbox',
        'tale:component:checkbox-field',
        'tale:component:radio',
        'tale:component:radio-field',
        'tale:component:switch',
        'tale:component:switch-field',
      ],
      deprecations: [
        {
          id: 'tale:component:checkbox',
          replacementId: 'tale:component:checkbox-field',
          documentation: 'https://tale-ui.dev/components/checkbox-field',
        },
        {
          id: 'tale:component:radio',
          replacementId: 'tale:component:radio-field',
          documentation: 'https://tale-ui.dev/components/radio-field',
        },
        {
          id: 'tale:component:switch',
          replacementId: 'tale:component:switch-field',
          documentation: 'https://tale-ui.dev/components/switch-field',
        },
      ],
      sourceEvidence: [
        'docs/upstream/react-aria-components.md#deprecated-feature',
        'react-v1.3.53',
      ],
      parsers: ['typescript'],
      sensitiveFiles: 'require-explicit',
      generatedFiles: 'require-explicit',
      reversible: true,
      backupPolicy: 'required',
      idempotent: true,
    },
    transform: {
      schemaVersion: '1.0.0',
      operation: 'field-controls',
      extensions: ['.jsx', '.tsx'],
    },
  },
  {
    slug: '30-ui-color-aliases',
    manifest: {
      id: 'ui-color-token-aliases',
      order: 30,
      group: 'token-name',
      description:
        'Move component-facing palette usage from fixed brand tokens to color-mode-aware aliases.',
      from: 'component CSS using --brand-{5..100}',
      to: 'component CSS using --color-{5..100}',
      dependencies: [],
      affectedArtifacts: ['tale:foundation:design-tokens'],
      deprecations: [],
      sourceEvidence: ['docs/design-philosophy.md#color-system'],
      parsers: ['css'],
      sensitiveFiles: 'require-explicit',
      generatedFiles: 'require-explicit',
      reversible: true,
      backupPolicy: 'required',
      idempotent: true,
    },
    transform: {
      schemaVersion: '1.0.0',
      operation: 'color-aliases',
      levels: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      extensions: ['.css'],
    },
  },
  {
    slug: '40-import-paths',
    manifest: {
      id: 'known-import-path-corrections',
      order: 40,
      group: 'import-path',
      description: 'Correct known non-existent or non-canonical Tale UI import paths.',
      from: '@tale-ui/react@>=1.0.0 <3.0.0',
      to: '@tale-ui/react canonical exports@>=2.0.0 <3.0.0',
      dependencies: [],
      affectedArtifacts: [
        'tale:component:text-area',
        'tale:component:toggle-button',
        'tale:component:table',
      ],
      deprecations: [],
      sourceEvidence: [
        'docs/consumer-claude-md-snippet-full.md',
        'packages/react/package.json',
      ],
      parsers: ['typescript'],
      sensitiveFiles: 'require-explicit',
      generatedFiles: 'require-explicit',
      reversible: true,
      backupPolicy: 'required',
      idempotent: true,
    },
    transform: {
      schemaVersion: '1.0.0',
      operation: 'literal-replacements',
      replacements: [
        {
          search: '@tale-ui/react/textarea',
          replacement: '@tale-ui/react/text-area',
        },
        {
          search: '@tale-ui/react/toggle-button-group',
          replacement: '@tale-ui/react/toggle-button',
        },
        {
          search: 'react-aria-components/virtualizer',
          replacement: '@tale-ui/react/virtualizer',
        },
      ],
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
    },
  },
];

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(value) {
  return `sha256:${createHash('sha256').update(canonical(value)).digest('hex')}`;
}

function writeOrCheck(path, content) {
  if (CHECK) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) {
      throw new Error(`STALE: ${path.slice(ROOT.length + 1)} — run pnpm migrations:generate`);
    }
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

for (const migration of migrations) {
  const transformPath = join(OUTPUT, migration.slug, 'transform.json');
  const manifestPath = join(OUTPUT, migration.slug, 'manifest.json');
  writeOrCheck(transformPath, canonical(migration.transform));
  writeOrCheck(
    manifestPath,
    canonical({
      schemaVersion: '1.0.0',
      ...migration.manifest,
      transforms: [
        {
          id: migration.transform.operation,
          kind:
            migration.transform.extensions.length === 1 &&
            migration.transform.extensions[0] === '.css'
              ? 'css'
              : migration.transform.extensions.includes('.json')
                ? 'config'
                : 'typescript',
          path: 'transform.json',
          files: migration.transform.extensions.map((extension) => `**/*${extension}`),
        },
      ],
      checksum: digest(migration.transform),
    }),
  );
}

console.log(
  `${CHECK ? 'OK' : 'GENERATED'}: ${migrations.length} ordered roadmap migration groups`,
);
