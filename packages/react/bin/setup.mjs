#!/usr/bin/env node
/**
 * tale-ui-setup
 *
 * Adds the generated Tale UI agent instructions to a consuming project's
 * CLAUDE.md and configures the packaged MCP server.
 *
 * Run once after installing @tale-ui/react:
 *
 *   npx tale-ui-setup
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKER = '## UI Components (@tale-ui/react)';
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snippetPath = path.join(packageRoot, 'docs/consumer-claude-md-snippet.md');
const generatedSnippet = fs.readFileSync(snippetPath, 'utf8');
const markerIndex = generatedSnippet.indexOf(MARKER);

if (markerIndex === -1) {
  throw new Error(`Tale UI consumer guidance is malformed: ${snippetPath}`);
}

const SNIPPET = generatedSnippet.slice(markerIndex).trimEnd();

// Walk up from cwd looking for the consuming project's root. node_modules is
// accepted because a package manager may create it before package.json exists.
function findProjectRoot(startDir) {
  let dir = startDir;
  while (true) {
    const hasPackageJson = fs.existsSync(path.join(dir, 'package.json'));
    const hasNodeModules = fs.existsSync(path.join(dir, 'node_modules'));
    if ((hasPackageJson || hasNodeModules) && !dir.includes('node_modules')) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return startDir;
}

const projectRoot = findProjectRoot(process.cwd());

// Skip in workspace/monorepo development.
const projectPkgPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(projectPkgPath)) {
  try {
    const projectPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
    if (projectPkg.name === '@tale-ui/react' || projectPkg.name === '@tale-ui/monorepo') {
      process.exit(0);
    }
  } catch {
    // Continue when the consuming package manifest cannot be read.
  }
}

const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

if (fs.existsSync(claudeMdPath)) {
  const existing = fs.readFileSync(claudeMdPath, 'utf8');

  if (existing.includes(MARKER)) {
    console.log('✓ CLAUDE.md already contains Tale UI instructions. Skipping.');
  } else {
    const separator = existing.endsWith('\n') ? '\n' : '\n\n';
    fs.writeFileSync(claudeMdPath, existing + separator + SNIPPET);
    console.log('✓ Appended Tale UI instructions to existing CLAUDE.md');
    console.log(`  → ${claudeMdPath}`);
  }
} else {
  fs.writeFileSync(claudeMdPath, `# Project Instructions\n\n${SNIPPET}`);
  console.log('✓ Created CLAUDE.md with Tale UI instructions');
  console.log(`  → ${claudeMdPath}`);
}

const MCP_SERVER_KEY = 'tale-ui';
const MCP_SERVER_CONFIG = {
  command: 'node',
  args: ['./node_modules/@tale-ui/react/mcp-server.mjs'],
};
const mcpJsonPath = path.join(projectRoot, '.mcp.json');

let mcpJson = { mcpServers: {} };
if (fs.existsSync(mcpJsonPath)) {
  try {
    mcpJson = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
    if (!mcpJson.mcpServers) {
      mcpJson.mcpServers = {};
    }
  } catch {
    // Replace malformed configuration with the minimal valid MCP shape.
  }
}

if (mcpJson.mcpServers[MCP_SERVER_KEY]) {
  console.log('✓ .mcp.json already contains the tale-ui MCP server. Nothing to do.');
} else {
  mcpJson.mcpServers[MCP_SERVER_KEY] = MCP_SERVER_CONFIG;
  fs.writeFileSync(mcpJsonPath, `${JSON.stringify(mcpJson, null, 2)}\n`);
  console.log('✓ Configured tale-ui MCP server in .mcp.json');
  console.log(`  → ${mcpJsonPath}`);
}
