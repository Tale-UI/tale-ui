// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-docs'), getAbsolutePath('@storybook/addon-a11y')],
  managerHead: (head) => {
    const cssDir = path.resolve(__dirname, '../../../packages/css/src');
    const files = [
      'tokens/_colors.css',
      'tokens/_neutrals.css',
      'tokens/_effects.css',
      'tokens/_typography.css',
      'themes/_color-modes.css',
    ];
    const css = files.map((f) => fs.readFileSync(path.join(cssDir, f), 'utf-8')).join('\n');
    // Override CSS variables that Storybook sets dynamically from the theme object and
    // that cannot be controlled via create(). The !important is required because emotion
    // sets these on individual elements (higher specificity than :root), but !important
    // in author styles always wins over non-!important author styles regardless of specificity.
    // :root { !important } only affects the html element — child elements with their own
    // matching declarations (from emotion CSS classes) still win via the cascade because
    // inheritance only fills in when NO matching rule exists. Using * targets elements
    // directly, making the !important win over emotion's normal author declarations.
    const overrides = `
* {
  /* Storybook computes lighten(45%, colorSecondary) for sidebar tree-node hover, which
     produces a vivid teal when colorSecondary is our dark brand (#025768). Override with
     a neutral that reads correctly in both light and dark mode via _color-modes.css.
     buildTheme() sets data-color-mode on <html> so the tokens invert correctly. */
  --tree-node-background-hover: var(--neutral-16) !important;
}
*[data-selected="true"] {
  /* Selected nodes use white text (Storybook hardcodes color.lightest). Restoring the
     brand background on hover keeps white text readable. Both rules are !important so
     specificity decides: attribute selector (0,1,0) beats universal (0,0,0). */
  --tree-node-background-hover: var(--color-60) !important;
}
.sidebar-item svg[type] {
  display: none;
}
.sidebar-item button {
  align-items: center;
  padding-bottom: 5px;
}
/* Sidebar context-menu (meatball) button — Storybook's Emotion styles set a
   vivid teal on hover (lighten of colorSecondary). Override with neutral tokens.
   Doubled attribute selector bumps specificity above Emotion's single class. */
button[data-testid="context-menu"][data-testid="context-menu"]:hover,
button[data-testid="context-menu"][data-testid="context-menu"]:focus-visible {
  color: var(--neutral-90) !important;
  background: var(--neutral-16) !important;
  border-radius: 4px;
}
/* Hide the onboarding checklist widget — the feature flag is overridden by
   Storybook's common-preset so CSS is the only reliable way to remove it. */
#storybook-checklist-widget {
  display: none !important;
}
}`;
    return `${head}<style id="tale-ui-tokens">${css}${overrides}</style>`;
  },
  framework: { name: getAbsolutePath('@storybook/react-vite'), options: {} },
  typescript: { reactDocgen: false },
  async viteFinal(config) {
    const baseUrl = process.env.STORYBOOK_BASE ?? '/';

    config.base = baseUrl;
    config.plugins = [stripUseClientDirectives(), ...(config.plugins ?? [])];
    config.resolve ??= {};
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : Object.entries((config.resolve.alias as Record<string, string>) ?? {}).map(
          ([find, replacement]) => ({ find, replacement }),
        );

    const taleAliasKeys = new Set([
      '@tale-ui/react',
      '@tale-ui/charts',
      '@tale-ui/foundations',
      '@tale-ui/utils',
      '@tale-ui/themes',
      '@tale-ui/react-styles',
      '@tale-ui/css',
      '@tale-ui/playground-scale',
    ]);

    const filteredAliases = existingAliases.filter((alias) => {
      if (typeof alias.find === 'string') {
        return !taleAliasKeys.has(alias.find);
      }

      return String(alias.find) !== String(/^@tale-ui\/utils\/(.+)$/u);
    });

    config.resolve.alias = [
      ...filteredAliases,
      {
        find: '@tale-ui/react',
        replacement: path.resolve(__dirname, '../../../packages/react/src'),
      },
      {
        find: '@tale-ui/charts',
        replacement: path.resolve(__dirname, '../../../packages/charts/src'),
      },
      {
        find: '@tale-ui/foundations',
        replacement: path.resolve(__dirname, '../../../packages/foundations/src'),
      },
      {
        find: /^@tale-ui\/utils\/(.+)$/u,
        replacement: path.resolve(__dirname, '../../../packages/utils/src/$1'),
      },
      {
        find: '@tale-ui/themes',
        replacement: path.resolve(__dirname, '../../../packages/themes/src'),
      },
      {
        find: '@tale-ui/react-styles',
        replacement: path.resolve(__dirname, '../../../packages/styles/src'),
      },
      {
        find: '@tale-ui/css',
        replacement: path.resolve(__dirname, '../../../packages/css/src/index.css'),
      },
      {
        find: '@tale-ui/playground-scale',
        replacement: path.resolve(__dirname, '../../scale/src'),
      },
    ];
    config.build ??= {};
    config.build.chunkSizeWarningLimit = 1500;
    // Allow Vite's dev server to read files from the monorepo root so that
    // CSS @import chains (e.g. @import '@tale-ui/css' inside packages/styles)
    // can resolve into packages/css/src without being blocked by fs restrictions.
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [
      ...(config.server.fs.allow ?? []),
      path.resolve(__dirname, '../../..'),
    ];
    return config;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

function stripUseClientDirectives() {
  return {
    name: 'tale-ui-storybook-strip-use-client-directives',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const shouldProcess =
        id.includes('/packages/react/src/') ||
        id.includes('/packages/utils/src/') ||
        id.includes('/node_modules/lucide-react/') ||
        id.includes('/node_modules/motion/') ||
        id.includes('/node_modules/framer-motion/');

      if (!shouldProcess) {
        return null;
      }

      const next = code.replace(/^(\s*(?:['"]use strict['"];?\s*)*)['"]use client['"];?\s*/u, '$1');

      if (next === code) {
        return null;
      }

      return { code: next, map: null };
    },
  };
}
