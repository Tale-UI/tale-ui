import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  AddTemplateRequest,
  InitializeProjectRequest,
  TaleTemplateManifest,
  TemplateMaterializationResult,
  TemplateSourceResult,
} from './contracts/materialize.js';
import type { ProjectMutationFile } from './contracts/operations.js';
import { TaleToolingError } from './contracts/errors.js';
import { applyProjectMutation, readProjectFile } from './operations.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const templateRootCandidates = [
  join(currentDirectory, 'templates'),
  join(currentDirectory, '..', 'templates'),
];

function templateRoot() {
  const root = templateRootCandidates.find((candidate) => existsSync(candidate));
  if (!root) {
    throw new TaleToolingError(
      'TALE_CORRUPT_REGISTRY',
      'Tale UI: installed template assets are unavailable.',
    );
  }
  return root;
}

async function parseJsonFile<T>(path: string, message: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    throw new TaleToolingError('TALE_CORRUPT_REGISTRY', message, { cause: error });
  }
}

function templateSlug(idOrSlug: string) {
  const slug = idOrSlug.replace(/^tale:template:/, '');
  if (!/^[a-z0-9][a-z0-9-]+$/.test(slug)) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: template identity must be a lowercase slug or stable template ID.',
    );
  }
  return slug;
}

export async function listTemplates(): Promise<TaleTemplateManifest[]> {
  const root = templateRoot();
  const directories = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  return Promise.all(
    directories.map((slug) =>
      parseJsonFile<TaleTemplateManifest>(
        join(root, slug, 'template.json'),
        `Tale UI: template metadata for ${slug} is unavailable or malformed.`,
      ),
    ),
  );
}

export async function getTemplate(idOrSlug: string): Promise<TaleTemplateManifest> {
  const slug = templateSlug(idOrSlug);
  const manifest = await parseJsonFile<TaleTemplateManifest>(
    join(templateRoot(), slug, 'template.json'),
    `Tale UI: template ${slug} is unavailable or malformed.`,
  );
  if (manifest.id !== `tale:template:${slug}`) {
    throw new TaleToolingError(
      'TALE_CORRUPT_REGISTRY',
      'Tale UI: template directory and stable identity do not match.',
    );
  }
  return manifest;
}

export async function getTemplateSource(
  idOrSlug: string,
  options: { skeleton?: boolean } = {},
): Promise<TemplateSourceResult> {
  const template = await getTemplate(idOrSlug);
  const variant = options.skeleton ? 'skeleton' : 'source';
  const file = variant === 'skeleton' ? template.skeleton : template.source;
  return {
    template,
    variant,
    content: await readFile(join(templateRoot(), templateSlug(template.id), file), 'utf8'),
  };
}

function managedBlock(existing: string, label: string, body: string) {
  const start = `<!-- tale-ui:${label}:start -->`;
  const end = `<!-- tale-ui:${label}:end -->`;
  const block = `${start}\n${body.trim()}\n${end}`;
  const startIndex = existing.indexOf(start);
  const endIndex = existing.indexOf(end);
  if (startIndex < 0 && endIndex < 0) {
    return `${existing.trimEnd()}${existing.trim() ? '\n\n' : ''}${block}\n`;
  }
  if (
    startIndex < 0 ||
    endIndex < startIndex ||
    existing.indexOf(start, startIndex + start.length) >= 0 ||
    existing.indexOf(end, endIndex + end.length) >= 0
  ) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      `Tale UI: ${label} managed-block markers are malformed or duplicated.`,
    );
  }
  const current = existing.slice(startIndex, endIndex + end.length);
  if (current !== block) {
    throw new TaleToolingError(
      'TALE_CHANGED_SINCE_PLAN',
      `Tale UI: the existing ${label} managed block differs from the approved content.`,
    );
  }
  return existing;
}

async function mergeMcpConfig(root: string) {
  const existing = await readProjectFile(root, '.mcp.json');
  let config: Record<string, unknown> = {};
  if (existing.exists) {
    try {
      config = JSON.parse(existing.content) as Record<string, unknown>;
    } catch (error) {
      throw new TaleToolingError(
        'TALE_MALFORMED_PROJECT_CONFIG',
        'Tale UI: .mcp.json is malformed, so init preserved it without changes.',
        { cause: error },
      );
    }
    if (!config || Array.isArray(config) || typeof config !== 'object') {
      throw new TaleToolingError(
        'TALE_MALFORMED_PROJECT_CONFIG',
        'Tale UI: .mcp.json must contain a JSON object.',
      );
    }
  }
  const mcpServers =
    config.mcpServers === undefined
      ? {}
      : config.mcpServers &&
          !Array.isArray(config.mcpServers) &&
          typeof config.mcpServers === 'object'
        ? { ...(config.mcpServers as Record<string, unknown>) }
        : null;
  if (!mcpServers) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      'Tale UI: .mcp.json mcpServers must contain a JSON object.',
    );
  }
  const taleServer = { command: 'tale-mcp', args: [] };
  if (
    mcpServers['tale-ui'] !== undefined &&
    JSON.stringify(mcpServers['tale-ui']) !== JSON.stringify(taleServer)
  ) {
    throw new TaleToolingError(
      'TALE_CHANGED_SINCE_PLAN',
      'Tale UI: .mcp.json already contains a different tale-ui server definition.',
    );
  }
  mcpServers['tale-ui'] = taleServer;
  return `${JSON.stringify({ ...config, mcpServers }, null, 2)}\n`;
}

async function mergePackageScripts(root: string) {
  const existing = await readProjectFile(root, 'package.json');
  if (!existing.exists) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      'Tale UI: optional script initialization requires an existing package.json.',
    );
  }
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(existing.content) as Record<string, unknown>;
  } catch (error) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      'Tale UI: package.json is malformed, so init preserved it without changes.',
      { cause: error },
    );
  }
  const scripts =
    manifest.scripts === undefined
      ? {}
      : manifest.scripts &&
          !Array.isArray(manifest.scripts) &&
          typeof manifest.scripts === 'object'
        ? { ...(manifest.scripts as Record<string, unknown>) }
        : null;
  if (!scripts) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      'Tale UI: package.json scripts must contain a JSON object.',
    );
  }
  const approved = {
    'tale:validate': 'tale validate src --rules registry,typescript',
    'tale:doctor': 'tale doctor --json',
  };
  for (const [name, command] of Object.entries(approved)) {
    if (scripts[name] !== undefined && scripts[name] !== command) {
      throw new TaleToolingError(
        'TALE_CHANGED_SINCE_PLAN',
        `Tale UI: package.json already contains a different ${name} script.`,
      );
    }
    scripts[name] = command;
  }
  return `${JSON.stringify({ ...manifest, scripts }, null, 2)}\n`;
}

export async function initializeProject(request: InitializeProjectRequest) {
  const agents = await readProjectFile(request.root, 'AGENTS.md');
  const cursor = await readProjectFile(request.root, '.cursorrules');
  const files = [
    {
      path: 'AGENTS.md',
      content: managedBlock(
        agents.content,
        'agents',
        'Use the installed Tale UI registry, `tale` CLI, and local `tale-mcp` server before generating interfaces. Run `tale validate` before considering generated UI complete.',
      ),
      overwrite: agents.exists,
    },
    {
      path: '.cursorrules',
      content: managedBlock(
        cursor.content,
        'cursor',
        'Use Tale UI package exports and design tokens. Prefer registry-backed components and run `tale validate` on generated TypeScript.',
      ),
      overwrite: cursor.exists,
    },
    {
      path: '.mcp.json',
      content: await mergeMcpConfig(request.root),
      overwrite: (await readProjectFile(request.root, '.mcp.json')).exists,
    },
  ];
  if (request.addScripts) {
    files.push({
      path: 'package.json',
      content: await mergePackageScripts(request.root),
      overwrite: true,
    });
  }
  return applyProjectMutation({
    schemaVersion: request.schemaVersion,
    requestId: request.requestId,
    root: request.root,
    operation: 'init',
    idempotencyKey: request.idempotencyKey,
    files,
  });
}

async function mergeDependencies(
  root: string,
  dependencies: Record<string, string>,
): Promise<{ content: string; exists: boolean }> {
  const existing = await readProjectFile(root, 'package.json');
  if (!existing.exists) {
    return { exists: false, content: '' };
  }
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(existing.content) as Record<string, unknown>;
  } catch (error) {
    throw new TaleToolingError(
      'TALE_MALFORMED_PROJECT_CONFIG',
      'Tale UI: package.json is malformed, so template dependencies were not changed.',
      { cause: error },
    );
  }
  const current =
    manifest.dependencies &&
    !Array.isArray(manifest.dependencies) &&
    typeof manifest.dependencies === 'object'
      ? { ...(manifest.dependencies as Record<string, unknown>) }
      : {};
  for (const [name, range] of Object.entries(dependencies)) {
    if (current[name] !== undefined && current[name] !== range) {
      throw new TaleToolingError(
        'TALE_TEMPLATE_CONFLICT',
        `Tale UI: package.json already declares ${name} with a different range.`,
      );
    }
    current[name] = range;
  }
  const ordered = Object.fromEntries(
    Object.entries(current).sort(([left], [right]) => left.localeCompare(right, 'en')),
  );
  return {
    exists: true,
    content: `${JSON.stringify({ ...manifest, dependencies: ordered }, null, 2)}\n`,
  };
}

export async function addTemplate(
  request: AddTemplateRequest,
): Promise<TemplateMaterializationResult> {
  const template = await getTemplate(request.template);
  const slug = templateSlug(template.id);
  const { content } = await getTemplateSource(template.id, { skeleton: request.skeleton });
  const target = request.target || `src/tale-templates/${slug}.tsx`;
  const files: ProjectMutationFile[] = [{ path: target, content }];
  if (request.addDependencies !== false && Object.keys(template.dependencies).length > 0) {
    const packageMerge = await mergeDependencies(request.root, template.dependencies);
    if (packageMerge.exists) {
      files.push({ path: 'package.json', content: packageMerge.content, overwrite: true });
    }
  }
  const result = await applyProjectMutation({
    schemaVersion: request.schemaVersion,
    requestId: request.requestId,
    root: request.root,
    operation: 'template-add',
    idempotencyKey: request.idempotencyKey,
    files,
  });
  return { ...result, template };
}
