#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function isHistorical(relativePath) {
  return (
    relativePath.startsWith('analysis/') ||
    relativePath.startsWith('plans/') ||
    relativePath.startsWith('docs/plans/') ||
    relativePath.startsWith('docs/archive/') ||
    relativePath.startsWith('docs/versioned/') ||
    relativePath.startsWith('research/') ||
    /(^|\/)CHANGELOG\.md$/i.test(relativePath)
  );
}

const trackedDocs = execFileSync('git', ['ls-files', '-z'], {
  cwd: ROOT,
  encoding: 'utf8',
})
  .split('\0')
  .filter((file) => /\.(?:md|mdx)$/i.test(file) && !isHistorical(file));

const stalePatterns = [
  ['retired repository URL', /github\.com\/Tale-UI\/core/i],
  ['retired Pages path', /tale-ui\.github\.io\/core/i],
  ['retired checkout path', /(?:path\/to|\.\.)\/core\/packages\//i],
  ['nonexistent docs build command', /\bpnpm docs:build\b/i],
  ['retired playground path', /\/vite-playground(?:\/|`|\s|$)/i],
  ['nonexistent shadow token', /--shadow-md\b/],
  ['obsolete tooling lifecycle label', /\binternal-first\b/i],
];

const markdownLink = /!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^)]*)?\)/g;

for (const relativePath of trackedDocs) {
  const content = read(relativePath);

  for (const [label, pattern] of stalePatterns) {
    if (pattern.test(content)) {
      failures.push(`${relativePath}: contains ${label} (${pattern})`);
    }
  }

  for (const match of content.matchAll(markdownLink)) {
    let target = match[1].replace(/^<|>$/g, '');
    if (
      target.startsWith('#') ||
      target.startsWith('/') ||
      target.startsWith('//') ||
      /^[a-z][a-z\d+.-]*:/i.test(target) ||
      target.includes('{')
    ) {
      continue;
    }

    target = target.split('#', 1)[0].split('?', 1)[0];
    if (!target) {
      continue;
    }

    try {
      target = decodeURIComponent(target);
    } catch {
      failures.push(`${relativePath}: malformed link target ${match[1]}`);
      continue;
    }

    const resolved = path.resolve(ROOT, path.dirname(relativePath), target);
    if (!resolved.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(resolved)) {
      failures.push(`${relativePath}: broken relative link ${match[1]}`);
    }
  }
}

const rootReadme = read('README.md');
const packageDirectories = fs.readdirSync(path.join(ROOT, 'packages'), {
  withFileTypes: true,
});
for (const entry of packageDirectories) {
  if (!entry.isDirectory()) {
    continue;
  }

  const manifestPath = path.join(ROOT, 'packages', entry.name, 'package.json');
  if (!fs.existsSync(manifestPath)) {
    continue;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.private !== true && manifest.name && !rootReadme.includes(manifest.name)) {
    failures.push(`README.md: missing public workspace package ${manifest.name}`);
  }
}

const reactManifest = JSON.parse(read('packages/react/package.json'));
const currentMajor = String(reactManifest.version).split('.')[0];
if (!read('SECURITY.md').includes(`${currentMajor}.x.x`)) {
  failures.push(`SECURITY.md: missing current coordinated major ${currentMajor}.x.x`);
}

const mcpSource = read('tools/mcp-server.mjs');
const documentedTools = read('tools/README.md');
const toolNames = [...mcpSource.matchAll(/server\.tool\(\s*['"]([^'"]+)/g)].map(
  (match) => match[1],
);
for (const toolName of toolNames) {
  if (!documentedTools.includes(`\`${toolName}\``)) {
    failures.push(`tools/README.md: missing MCP tool ${toolName}`);
  }
}

const staleToolingClaims = [
  '90 components',
  '9 MCP tools',
  '17 automated checks',
  '125 reference prompts',
  '41 reference prompts',
  '135 A2UI types',
  'Maps 85 A2UI types',
  'all 41 golden prompt',
  'all 12 recipes',
  '121 documentation files',
  'run 35 unit tests',
];
for (const claim of staleToolingClaims) {
  if (documentedTools.toLowerCase().includes(claim.toLowerCase())) {
    failures.push(`tools/README.md: contains volatile or stale inventory claim "${claim}"`);
  }
}

const setupSource = read('packages/react/bin/setup.mjs');
if (!setupSource.includes('docs/consumer-claude-md-snippet.md')) {
  failures.push('packages/react/bin/setup.mjs: does not consume generated guidance');
}

if (failures.length > 0) {
  console.error('Documentation semantic audit failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Documentation semantic audit passed (${trackedDocs.length} current Markdown/MDX files, ${toolNames.length} MCP tools).`,
);
