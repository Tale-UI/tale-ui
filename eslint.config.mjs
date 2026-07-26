import { includeIgnoreFile } from '@eslint/compat';
import eslintJs from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import compatPlugin from 'eslint-plugin-compat';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import nextjs from '@next/eslint-plugin-next';
import globals from 'globals';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'url';
import * as tseslint from 'typescript-eslint';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const playgroundRootDir = path.join(dirname, 'playground', 'vite-app');

// ── File extension patterns ────────────────────────────────────────────────
const EXTENSION_TS = '.?(c|m)[jt]s?(x)';
const EXTENSION_TEST_FILE = `.test${EXTENSION_TS}`;

// ── Helpers ────────────────────────────────────────────────────────────────
function includeIgnoreIfExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    return includeIgnoreFile(filePath, description);
  }
  return [];
}

const OneLevelImportMessage = [
  'Prefer one level nested imports to avoid bundling everything in dev mode or breaking CJS/ESM split.',
].join('\n');

const NO_RESTRICTED_IMPORTS_PATTERNS_DEEPLY_NESTED = [
  {
    group: ['@tale-ui/react/*/*'],
    message: OneLevelImportMessage,
  },
];

const NO_RESTRICTED_IMPORTS_PATHS_TOP_LEVEL_PACKAGES = [];

// ── Restricted syntax helpers ──────────────────────────────────────────────
const restrictedMethods = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];
const restrictedSyntaxRules = restrictedMethods.map((method) => ({
  message: `Use global ${method} instead of window.${method}.`,
  selector: `MemberExpression[object.name='window'][property.name='${method}']`,
}));

const nodeGlobalNamingAllowlist = '^(?:__dirname|__filename)$';

// ── Core rules (Airbnb-derived) ───────────────────────────────────────────
const coreRules = {
  // Security & Best Practices
  'no-eval': 'error',
  'no-script-url': 'error',
  'array-callback-return': ['error', { allowImplicit: true }],
  'consistent-return': 'error',
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'guard-for-in': 'error',
  radix: 'error',
  'no-proto': 'error',
  'vars-on-top': 'error',
  'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
  'no-lone-blocks': 'error',
  'no-new': 'error',
  'no-new-func': 'error',
  'no-self-compare': 'error',
  'no-restricted-globals': ['error', 'isFinite', 'isNaN'],

  // Style
  'new-cap': [
    'error',
    { newIsCap: true, newIsCapExceptions: [], capIsNew: false, capIsNewExceptions: [] },
  ],
  'no-plusplus': 'error',
  'no-bitwise': 'error',
  'no-lonely-if': 'error',
  'no-var': 'error',
  'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],
  'prefer-template': 'error',
  'object-shorthand': ['error', 'always'],
  'no-template-curly-in-string': 'error',
  'no-promise-executor-return': 'error',

  // Import
  'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
  'import/first': 'error',
  'import/no-mutable-exports': 'error',
  'import/newline-after-import': 'error',
  'import/namespace': 'off',
  'import/no-dynamic-require': 'error',
  'import/named': 'off',
  'import/no-named-as-default-member': 'off',
  'import/no-unresolved': 'off',
  'import/prefer-default-export': 'off',
  'import/no-cycle': 'off',
  'import/no-extraneous-dependencies': 'off',
  'import/no-webpack-loader-syntax': 'off',
  'import/no-relative-packages': 'error',

  // Additional best practices
  'default-case': ['error', { commentPattern: '^no default$' }],
  'default-case-last': 'error',
  'no-else-return': ['error', { allowElseIf: false }],
  'no-multi-assign': 'error',
  'no-nested-ternary': 'error',
  'no-unneeded-ternary': ['error', { defaultAssignment: false }],
  'spaced-comment': [
    'error',
    'always',
    {
      line: { markers: ['/'], exceptions: ['-', '+'] },
      block: { markers: ['*'], exceptions: ['*'], balanced: true },
    },
  ],
  'global-require': 'error',
  'no-return-assign': ['error', 'always'],
  'no-useless-concat': 'error',
  'no-await-in-loop': 'error',
  'no-cond-assign': ['error', 'always'],
  curly: ['error', 'all'],
  'dot-notation': 'error',
  'max-classes-per-file': 'off',
  'no-alert': 'error',
  'arrow-body-style': 'off',
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-param-reassign': 'off',
  'func-names': 'error',
  'no-continue': 'off',
  'no-constant-condition': 'error',
  'no-implied-eval': 'error',
  'no-throw-literal': 'error',
  'no-prototype-builtins': 'off',
  'no-underscore-dangle': 'error',
  'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
  'prefer-destructuring': 'off',
  'consistent-this': ['error', 'self'],
  'no-restricted-exports': 'off',
  'lines-around-directive': 'off',
  'id-denylist': ['error', 'e'],

  // TypeScript overrides
  'default-param-last': 'off',
  '@typescript-eslint/default-param-last': 'error',
  'no-array-constructor': 'off',
  '@typescript-eslint/no-array-constructor': 'error',
  '@typescript-eslint/triple-slash-reference': 'off',
  'no-empty-function': 'off',
  '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
  'no-loss-of-precision': 'error',
  'no-loop-func': 'off',
  '@typescript-eslint/no-loop-func': 'error',
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': 'error',
  'no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: false, allowTernary: false }],
  'no-useless-constructor': 'off',
  '@typescript-eslint/no-useless-constructor': 'error',
  'require-await': 'off',
  camelcase: 'off',
  '@typescript-eslint/naming-convention': [
    'error',
    { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
    { selector: 'function', format: ['camelCase', 'PascalCase'] },
    { selector: 'typeLike', format: ['PascalCase'] },
  ],
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-this-alias': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-redeclare': 'off',
  'no-redeclare': 'off',
  '@typescript-eslint/return-await': 'off',
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrors: 'none' },
  ],
  'import/extensions': [
    'error',
    'ignorePackages',
    { js: 'never', mjs: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
  ],

  // JSX A11y
  'jsx-a11y/alt-text': ['error', { elements: ['img'] }],
  'jsx-a11y/anchor-is-valid': [
    'error',
    { components: ['Link'], specialLink: ['to'], aspects: ['noHref', 'invalidHref', 'preferButton'] },
  ],
  'jsx-a11y/control-has-associated-label': [
    'error',
    {
      labelAttributes: ['label'],
      controlComponents: [],
      ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
      ignoreRoles: ['grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'row', 'tablist', 'toolbar', 'tree', 'treegrid'],
      depth: 5,
    },
  ],
  'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
  'jsx-a11y/no-autofocus': 'off',

  // React
  'react/button-has-type': ['error', { button: true, submit: true, reset: false }],
  'react/display-name': ['off', { ignoreTranspilerName: false }],
  'react/function-component-definition': [
    'error',
    { namedComponents: ['function-declaration', 'function-expression'], unnamedComponents: 'function-expression' },
  ],
  'react/jsx-no-constructed-context-values': 'error',
  'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
  'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
  'react/jsx-key': 'off',
  'react/no-unused-prop-types': ['error', { customValidators: [], skipShapeProps: true }],
  'react/default-props-match-prop-types': ['error', { allowRequiredDefaults: true }],
  'react/destructuring-assignment': 'off',
  'react/forbid-prop-types': 'off',
  'react/jsx-curly-brace-presence': 'off',
  'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
  'react/jsx-fragments': ['error', 'element'],
  'react/jsx-no-bind': 'off',
  'react/jsx-props-no-spreading': 'off',
  'react/no-array-index-key': 'off',
  'react/no-danger': 'error',
  'react/no-unknown-property': ['error', { ignore: ['sx'] }],
  'react/no-direct-mutation-state': 'error',
  'react/require-default-props': 'off',
  'react/sort-prop-types': 'error',
  'react/state-in-constructor': 'off',
  'react/static-property-placement': 'off',
  'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
  'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
  'react/no-invalid-html-attribute': 'off',
  'react-hooks/exhaustive-deps': ['error', { additionalHooks: '(useEnhancedEffect|useIsoLayoutEffect)' }],
  'react-hooks/rules-of-hooks': 'error',

  'no-restricted-syntax': [
    'error',
    {
      message: "Do not import default or named exports from React. Use a namespace import (import * as React from 'react';) instead.",
      selector: 'ImportDeclaration[source.value="react"] ImportDefaultSpecifier, ImportDeclaration[source.value="react"] ImportSpecifier',
    },
    {
      message: "Do not import default or named exports from ReactDOM. Use a namespace import (import * as ReactDOM from 'react-dom';) instead.",
      selector: 'ImportDeclaration[source.value="react-dom"] ImportDefaultSpecifier, ImportDeclaration[source.value="react-dom"] ImportSpecifier',
    },
    {
      message: "Do not import default or named exports from ReactDOM. Use a namespace import (import * as ReactDOM from 'react-dom/client';) instead.",
      selector: 'ImportDeclaration[source.value="react-dom/client"] ImportDefaultSpecifier, ImportDeclaration[source.value="react-dom/client"] ImportSpecifier',
    },
    {
      message: "Do not import default or named exports from ReactDOMServer. Use a namespace import (import * as ReactDOM from 'react-dom/server';) instead.",
      selector: 'ImportDeclaration[source.value="react-dom/server"] ImportDefaultSpecifier, ImportDeclaration[source.value="react-dom/server"] ImportSpecifier',
    },
    {
      message: "The 'use client' pragma can't be used with export * in the same module. This is not supported by Next.js.",
      selector: 'ExpressionStatement[expression.value="use client"] ~ ExportAllDeclaration',
    },
    {
      message: 'Do not call `Error(...)` without `new`. Use `new Error(...)` instead.',
      selector: "CallExpression[callee.name='Error']",
    },
    ...restrictedSyntaxRules,
  ],
};

// ── Export ──────────────────────────────────────────────────────────────────
export default defineConfig(
  globalIgnores([
    './examples',
    './playground/vite-app/dist',
    './apps/mcp-studio/*.js',
    './apps/mcp-studio/*.d.ts',
  ]),
  includeIgnoreIfExists(path.join(dirname, '.gitignore'), 'Ignore rules from .gitignore'),
  includeIgnoreIfExists(path.join(dirname, '.lintignore'), 'Ignore rules from .lintignore'),
  prettier,
  {
    name: 'Base config',
    files: [`**/*${EXTENSION_TS}`],
    extends: defineConfig([
      eslintJs.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.react,
      jsxA11yPlugin.flatConfigs.recommended,
      reactPlugin.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      tseslint.configs.recommended,
      importPlugin.flatConfigs.typescript,
      compatPlugin.configs['flat/recommended'],
      {
        name: 'typescript-eslint-parser',
        languageOptions: {
          ecmaVersion: 7,
          globals: {
            ...globals.es2020,
            ...globals.browser,
            ...globals.node,
          },
        },
        settings: {
          browserslistOpts: {
            config: path.join(dirname, '.browserslistrc'),
            env: 'stable',
            ignoreUnknownVersions: true,
          },
          'import/resolver': {
            node: { extensions: ['.mjs', '.js', '.json'] },
            typescript: {
              project: ['tsconfig.node.json', 'apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
            },
          },
          'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
          'import/core-modules': [],
          'import/ignore': ['node_modules', '\\.(css|svg|json)$'],
          'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
          'import/external-module-folders': ['node_modules', 'node_modules/@types'],
          react: {
            version: 'detect',
          },
        },
        rules: coreRules,
      },
    ]),
  },
  {
    name: 'ESM JS files',
    files: ['**/*.mjs'],
    rules: {
      'import/extensions': ['error', 'ignorePackages', { js: 'always', mjs: 'always' }],
    },
  },
  {
    name: 'Node CLI/tooling',
    files: [
      'tools/**/*.{js,mjs,ts,mts}',
      'scripts/**/*.{js,mjs,ts,mts}',
      'packages/*/bin/**/*.{js,mjs,ts,mts}',
      '**/*.config.{js,mjs,ts,mts}',
      '**/postcss.config.js',
      'test/vite.shared.config.mjs',
      'test/visual/playwright.config.mts',
      'playground/storybook/.storybook/**/*.{js,ts,mjs,mts}',
      'apps/mcp-studio/vite-plugin-studio-api.ts',
    ],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'function'],
          filter: { regex: nodeGlobalNamingAllowlist, match: true },
          format: null,
        },
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'compat/compat': 'off',
      'consistent-return': 'off',
      'no-dupe-keys': 'off',
      'no-await-in-loop': 'off',
      'no-cond-assign': 'off',
      'no-console': 'off',
      'no-empty': 'off',
      'no-lonely-if': 'off',
      'no-nested-ternary': 'off',
      'no-plusplus': 'off',
      'no-promise-executor-return': 'off',
      'no-restricted-globals': 'off',
      'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
      'no-useless-escape': 'off',
      'preserve-caught-error': 'off',
    },
  },
  {
    name: 'Deterministic component performance fixtures',
    files: ['tools/performance-fixtures/component-expansion/**/*.{ts,tsx}'],
    rules: {
      'import/extensions': 'off',
      'import/no-relative-packages': 'off',
      'prefer-template': 'off',
    },
  },
  {
    name: 'CommonJS tooling',
    files: ['tools/**/*.js', 'scripts/**/*.js', 'packages/*/bin/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'import/extensions': 'off',
    },
  },
  {
    name: 'A2UI source import extensions',
    files: ['packages/a2ui/src/**/*.{ts,tsx}'],
    rules: {
      'import/extensions': 'off',
    },
  },
  {
    name: 'Chart package component style',
    files: ['packages/charts/src/**/*.{ts,tsx}'],
    rules: {
      'react/function-component-definition': 'off',
    },
  },
  {
    name: 'Storybook story runtime examples',
    files: ['playground/storybook/src/stories/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-alert': 'off',
      'no-console': 'off',
      'no-nested-ternary': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    name: 'React package legacy component style',
    files: ['packages/react/src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'consistent-return': 'off',
      'default-case': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'no-nested-ternary': 'off',
      'no-return-assign': 'off',
      'no-useless-assignment': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-constructed-context-values': 'off',
    },
  },
  {
    name: 'A2UI renderer/source cleanup',
    files: ['packages/a2ui/src/**/*.{ts,tsx}'],
    rules: {
      'consistent-return': 'off',
      'default-case': 'off',
      'no-console': 'off',
      'no-nested-ternary': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    name: 'MCP studio intentional runtime patterns',
    files: ['apps/mcp-studio/src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-cond-assign': 'off',
      'no-nested-ternary': 'off',
      'no-new-func': 'off',
      'react/no-danger': 'off',
    },
  },
  {
    name: 'Playground example conventions',
    files: ['playground/scale/src/**/*.{js,jsx,ts,tsx}', 'playground/vite-app/src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'no-nested-ternary': 'off',
    },
  },
  {
    name: 'Streaming demo clients',
    files: ['playground/vite-app/src/demos/chat/**/*.{ts,tsx}'],
    rules: {
      'no-await-in-loop': 'off',
    },
  },
  {
    name: 'Legacy scale playground test',
    files: ['playground/scale/src/App.test.js'],
    rules: {
      'react/jsx-filename-extension': 'off',
      'react/no-deprecated': 'off',
    },
  },
  {
    name: 'Storybook config conventions',
    files: ['playground/storybook/.storybook/**/*.{ts,tsx}'],
    rules: {
      'func-names': 'off',
      'react/function-component-definition': 'off',
    },
  },
  {
    name: 'Playground Vite app overrides',
    files: ['playground/vite-app/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: playgroundRootDir,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    name: 'Tale UI overrides',
    files: [`**/*${EXTENSION_TS}`],
    settings: {
      'import/resolver': {
        typescript: { project: ['tsconfig.json'] },
      },
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      'import/export': 'off',
      'no-restricted-imports': [
        'error',
        { patterns: NO_RESTRICTED_IMPORTS_PATTERNS_DEEPLY_NESTED },
      ],
      'no-irregular-whitespace': ['warn', { skipJSXText: true, skipStrings: true }],
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': ['error', { additionalHooks: 'useIsoLayoutEffect' }],
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/refs': 'off',
    },
  },
  {
    name: 'Test files',
    files: [`**/*${EXTENSION_TEST_FILE}`],
    extends: defineConfig(
      testingLibrary.configs['flat/dom'],
      testingLibrary.configs['flat/react'],
    ),
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 7 },
      globals: globals.mocha,
    },
    rules: {
      'compat/compat': 'off',
      'import/named': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/iframe-has-title': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/tabindex-no-positive': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'react/button-has-type': 'off',
      'react/forbid-foreign-prop-types': 'off',
      'react/prop-types': 'off',
      'react/no-unused-prop-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    name: 'Spec files rules',
    files: [`**/*.spec${EXTENSION_TS}`],
    rules: {
      'compat/compat': 'off',
      'no-alert': 'off',
      'no-console': 'off',
      'no-empty-pattern': 'off',
      'no-lone-blocks': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/prefer-default-export': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/tabindex-no-positive': 'off',
      'react/default-props-match-prop-types': 'off',
      'react/no-access-state-in-setstate': 'off',
      'react/no-unused-prop-types': 'off',
      'react/prefer-stateless-function': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/state-in-constructor': 'off',
      'react/static-property-placement': 'off',
      'react/function-component-definition': 'off',
    },
  },
  {
    name: 'Docs config',
    files: [`docs/**/*${EXTENSION_TS}`],
    extends: defineConfig(
      nextjs.configs
        ? nextjs.configs.recommended
        : /** @type {any} */ (nextjs).flatConfig.recommended,
      {
        settings: { next: { rootDir: 'docs' } },
        files: ['**/*.js', '**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        rules: {
          '@next/next/no-html-link-for-pages': 'off',
          'compat/compat': 'off',
          'jsx-a11y/anchor-is-valid': 'off',
          'no-irregular-whitespace': ['error', { skipJSXText: true, skipStrings: true }],
        },
      },
    ),
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        { ts: 'never', tsx: 'never', mjs: 'always' },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: NO_RESTRICTED_IMPORTS_PATHS_TOP_LEVEL_PACKAGES,
          patterns: NO_RESTRICTED_IMPORTS_PATTERNS_DEEPLY_NESTED,
        },
      ],
    },
  },
  {
    files: [`docs/src/app/(private)/experiments/**/*${EXTENSION_TS}`],
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      'no-alert': 'off',
      'no-console': 'off',
      'import/no-relative-packages': 'off',
    },
  },
  {
    files: [`docs/src/app/(docs)/react/utils/use-render/demos/**/*${EXTENSION_TS}`],
    rules: {
      'jsx-a11y/control-has-associated-label': 'off',
      'react/button-has-type': 'off',
    },
  },
  {
    name: 'Disable image rule for demos',
    files: [
      `docs/src/app/(docs)/**/demos/**/*${EXTENSION_TS}`,
      `docs/src/app/(private)/experiments/**/*${EXTENSION_TS}`,
    ],
    ignores: ['docs/src/app/(private)/experiments/**/page.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: [`test/**/*${EXTENSION_TS}`],
    rules: {
      'guard-for-in': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'testing-library/prefer-screen-queries': 'off',
      'testing-library/no-await-sync-queries': 'off',
      'testing-library/render-result-naming-convention': 'off',
    },
  },
);
