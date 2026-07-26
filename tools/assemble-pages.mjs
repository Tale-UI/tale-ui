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
import { basename, dirname, join, posix, relative, resolve } from 'node:path';
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

function rewriteHistoricalHref(href, source, publicSources, basePath, major) {
  if (/^(?:[a-z]+:|#|\/)/i.test(href)) {
    return href;
  }
  const match = href.match(/^([^?#]+\.md)([?#].*)?$/);
  if (!match) {
    return href;
  }
  const target =
    match[1].startsWith('docs/') || match[1].startsWith('packages/')
      ? posix.normalize(match[1])
      : posix.normalize(posix.join(posix.dirname(source), match[1]));
  if (!publicSources.has(target)) {
    return href;
  }
  return `${basePath}/docs/v${major}/${historicalRoute(target)}/${match[2] ?? ''}`;
}

function historicalPage(title, content, source, sourcePath, publicSources, basePath, major) {
  const rendered = marked.parse(content, {
    walkTokens(token) {
      if (token.type === 'link') {
        token.href = rewriteHistoricalHref(token.href, sourcePath, publicSources, basePath, major);
      }
    },
  });
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} — Tale UI v${major}</title>
    <style>
      body { color: #17202a; font: 16px/1.6 system-ui, sans-serif; margin: 0 auto; max-width: 76rem; padding: 2rem; }
      .version-banner { background: #fff4d6; border: 1px solid #d7a20f; border-radius: .5rem; padding: .75rem 1rem; }
      article { max-width: 54rem; } pre { overflow: auto; } code { font-family: ui-monospace, monospace; }
      a { color: #0757a6; } img { max-width: 100%; }
    </style>
  </head>
  <body>
    <p class="version-banner">${major === 2 ? 'Previous supported Tale UI v2 documentation.' : `Archived Tale UI v${major} documentation.`} <a href="${basePath}/docs/">View current v3 documentation</a>.</p>
    <article>${rendered}</article>
    <footer><p>Immutable source: <code>${escapeHtml(source)}</code></p></footer>
  </body>
</html>
`;
}

export function assemblePages({ docsOutput, pagesOutput, basePath = '', root = ROOT }) {
  const docsTarget = join(pagesOutput, 'docs');
  mkdirSync(docsTarget, { recursive: true });
  cpSync(docsOutput, docsTarget, { recursive: true });
  cpSync(docsOutput, join(docsTarget, 'v3'), { recursive: true });
  cpSync(docsOutput, join(docsTarget, 'current'), { recursive: true });

  const manifestPath = join(root, 'docs/versioned/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const previousRoutes = [];
  for (const major of [2, 1]) {
    const version = manifest.versions.find((entry) => entry.major === major);
    if (!version) {
      throw new Error(`Version manifest does not contain v${major}.`);
    }
    const snapshotRoot = join(root, `docs/versioned/v${major}/content`);
    const publicSources = new Set(version.publicAllowlist);
    const links = [];
    for (const source of version.publicAllowlist) {
      const snapshot = join(snapshotRoot, source);
      if (!existsSync(snapshot)) {
        throw new Error(`Versioned v${major} docs snapshot is missing ${source}.`);
      }
      const content = readFileSync(snapshot, 'utf8');
      const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? basename(source, '.md');
      const route = historicalRoute(source);
      const output = join(docsTarget, `v${major}`, route, 'index.html');
      mkdirSync(dirname(output), { recursive: true });
      writeFileSync(
        output,
        historicalPage(
          title,
          content,
          `${version.source}:${source}`,
          source,
          publicSources,
          basePath,
          major,
        ),
      );
      links.push({ route, title });
      previousRoutes.push(`/docs/v${major}/${route}/`);
    }
    const versionIndex = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tale UI v${major} documentation</title></head><body>
<main><h1>Tale UI v${major} documentation</h1><p>Immutable public snapshot from ${escapeHtml(
      version.source,
    )}.</p><ul>${links
      .map(
        ({ route, title }) =>
          `<li><a href="${basePath}/docs/v${major}/${route}/">${escapeHtml(title)}</a></li>`,
      )
      .join('')}</ul></main></body></html>`;
    mkdirSync(join(docsTarget, `v${major}`), { recursive: true });
    writeFileSync(join(docsTarget, `v${major}/index.html`), versionIndex);
  }

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
    currentRoutes: ['/docs/', '/docs/current/', '/docs/v3/'],
    previousRoutes,
    agentRoute: '/llms.txt',
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const docsOutput = resolve(ROOT, process.argv[2] ?? 'docs/out');
  const pagesOutput = resolve(ROOT, process.argv[3] ?? '.pages');
  const basePath = process.env.PAGES_BASE_PATH ?? '';
  const result = assemblePages({ docsOutput, pagesOutput, basePath });
  console.log(
    `Assembled ${result.currentRoutes.length} current routes, ${result.previousRoutes.length} historical routes, and ${result.agentRoute}.`,
  );
}
