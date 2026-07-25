#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function walk(directory) {
  return readdirSync(directory)
    .sort()
    .flatMap((name) => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function historicalRoute(path) {
  return path
    .replace(/^docs\//, '')
    .replace(/^packages\/css\/docs\//, 'css/')
    .replace(/\.md$/, '');
}

function historicalPage(title, content, source, basePath) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} — Tale UI v1</title>
    <style>
      body { color: #17202a; font: 16px/1.6 system-ui, sans-serif; margin: 0 auto; max-width: 76rem; padding: 2rem; }
      .version-banner { background: #fff4d6; border: 1px solid #d7a20f; border-radius: .5rem; padding: .75rem 1rem; }
      article { max-width: 54rem; } pre { overflow: auto; } code { font-family: ui-monospace, monospace; }
      a { color: #0757a6; } img { max-width: 100%; }
    </style>
  </head>
  <body>
    <p class="version-banner">Archived Tale UI v1 documentation. <a href="${basePath}/docs/">View current v2 documentation</a>.</p>
    <article>${marked.parse(content)}</article>
    <footer><p>Immutable source: <code>${escapeHtml(source)}</code></p></footer>
  </body>
</html>
`;
}

export function assemblePages({ docsOutput, pagesOutput, basePath = '', root = ROOT }) {
  const docsTarget = join(pagesOutput, 'docs');
  mkdirSync(docsTarget, { recursive: true });
  cpSync(docsOutput, docsTarget, { recursive: true });
  cpSync(docsOutput, join(docsTarget, 'v2'), { recursive: true });
  cpSync(docsOutput, join(docsTarget, 'current'), { recursive: true });

  const manifestPath = join(root, 'docs/versioned/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const v1 = manifest.versions.find(({ major }) => major === 1);
  if (!v1) {
    throw new Error('Version manifest does not contain v1.');
  }
  const snapshotRoot = join(root, 'docs/versioned/v1/content');
  const links = [];
  for (const source of v1.publicAllowlist) {
    const snapshot = join(snapshotRoot, source);
    if (!existsSync(snapshot)) {
      throw new Error(`Versioned docs snapshot is missing ${source}.`);
    }
    const content = readFileSync(snapshot, 'utf8');
    const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? basename(source, '.md');
    const route = historicalRoute(source);
    const output = join(docsTarget, 'v1', route, 'index.html');
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, historicalPage(title, content, `${v1.source}:${source}`, basePath));
    links.push({ route, title });
  }
  const v1Index = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tale UI v1 documentation</title></head><body>
<main><h1>Tale UI v1 documentation</h1><p>Immutable public snapshot from ${escapeHtml(
    v1.source,
  )}.</p><ul>${links
    .map(
      ({ route, title }) =>
        `<li><a href="${basePath}/docs/v1/${route}/">${escapeHtml(title)}</a></li>`,
    )
    .join('')}</ul></main></body></html>`;
  mkdirSync(join(docsTarget, 'v1'), { recursive: true });
  writeFileSync(join(docsTarget, 'v1/index.html'), v1Index);

  cpSync(manifestPath, join(docsTarget, 'versions.json'));
  cpSync(join(root, 'docs/versioned/rollback.json'), join(docsTarget, 'rollback.json'));
  cpSync(join(root, 'llms.txt'), join(pagesOutput, 'llms.txt'));
  cpSync(join(root, 'llms.txt'), join(docsTarget, 'llms.txt'));
  if (existsSync(join(root, 'llms-full.txt'))) {
    cpSync(join(root, 'llms-full.txt'), join(pagesOutput, 'llms-full.txt'));
  }
  if (existsSync(join(root, 'apps/metrics-dashboard/dist'))) {
    cpSync(join(root, 'apps/metrics-dashboard/dist'), join(pagesOutput, 'metrics'), {
      recursive: true,
    });
  }
  return {
    currentRoutes: ['/docs/', '/docs/current/', '/docs/v2/'],
    previousRoutes: links.map(({ route }) => `/docs/v1/${route}/`),
    agentRoute: '/llms.txt',
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const docsOutput = resolve(ROOT, process.argv[2] ?? 'docs/out');
  const pagesOutput = resolve(ROOT, process.argv[3] ?? '.pages');
  const basePath = process.env.PAGES_BASE_PATH ?? '';
  const result = assemblePages({ docsOutput, pagesOutput, basePath });
  console.log(
    `Assembled ${result.currentRoutes.length} current routes, ${result.previousRoutes.length} v1 routes, and ${result.agentRoute}.`,
  );
}
