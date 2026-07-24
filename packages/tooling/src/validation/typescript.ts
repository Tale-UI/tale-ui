import { existsSync, realpathSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import ts from 'typescript';
import { TaleToolingError } from '../contracts/errors.js';
import type { ValidationDiagnostic } from '../contracts/validation.js';
import { normalizeTypeScriptDiagnostics } from './diagnostics.js';
import { isWithinProject } from './project.js';

interface CompilerConfiguration {
  options: ts.CompilerOptions;
  fallbackConfig: boolean;
  declarationFiles: string[];
}

interface ParsedProjectConfiguration {
  configPath: string;
  parsed: ts.ParsedCommandLine;
}

const TYPESCRIPT_ROOT = realpathSync(dirname(ts.sys.getExecutingFilePath()));

function allowedCompilerRoots(root: string) {
  const roots = new Set([resolve(root), TYPESCRIPT_ROOT]);
  let ancestor = dirname(resolve(root));
  while (true) {
    const dependencyRoot = join(ancestor, 'node_modules');
    if (existsSync(dependencyRoot)) {
      try {
        if (statSync(dependencyRoot).isDirectory()) {
          roots.add(resolve(dependencyRoot));
          roots.add(realpathSync(dependencyRoot));
        }
      } catch {
        // Ignore inaccessible dependency roots; compiler reads remain denied.
      }
    }
    const parent = dirname(ancestor);
    if (parent === ancestor) {
      break;
    }
    ancestor = parent;
  }
  return [...roots];
}

function invalidConfig(): never {
  throw new TaleToolingError(
    'TALE_INVALID_TSCONFIG',
    'Tale UI: the project TypeScript configuration contains a path outside the project root.',
  );
}

function assertConfigurationPaths(
  root: string,
  configDirectory: string,
  config: Record<string, unknown>,
) {
  const extendsValues = Array.isArray(config.extends) ? config.extends : [config.extends];
  for (const value of extendsValues) {
    if (typeof value === 'string') {
      const pathLike = value.startsWith('.') || value.startsWith('/') || /^[A-Za-z]:/.test(value);
      if (pathLike && !isWithinProject(root, resolve(configDirectory, value))) {
        invalidConfig();
      }
      if (!pathLike && value.split(/[\\/]/).includes('..')) {
        invalidConfig();
      }
    }
  }
  const compilerOptions =
    config.compilerOptions && typeof config.compilerOptions === 'object'
      ? (config.compilerOptions as Record<string, unknown>)
      : {};
  const scalarPaths = ['baseUrl', 'rootDir', 'outDir', 'declarationDir', 'tsBuildInfoFile'];
  for (const key of scalarPaths) {
    const value = compilerOptions[key];
    if (typeof value === 'string' && !isWithinProject(root, resolve(configDirectory, value))) {
      invalidConfig();
    }
  }
  for (const key of ['typeRoots', 'rootDirs']) {
    const values = compilerOptions[key];
    if (
      Array.isArray(values) &&
      values.some(
        (value) =>
          typeof value === 'string' && !isWithinProject(root, resolve(configDirectory, value)),
      )
    ) {
      invalidConfig();
    }
  }
  const base = resolve(
    configDirectory,
    typeof compilerOptions.baseUrl === 'string' ? compilerOptions.baseUrl : '.',
  );
  const paths =
    compilerOptions.paths && typeof compilerOptions.paths === 'object'
      ? (compilerOptions.paths as Record<string, unknown>)
      : {};
  for (const values of Object.values(paths)) {
    if (
      Array.isArray(values) &&
      values.some(
        (value) => typeof value === 'string' && !isWithinProject(root, resolve(base, value)),
      )
    ) {
      invalidConfig();
    }
  }
}

function isWithinAllowedRoot(allowedRoots: string[], candidate: string) {
  return allowedRoots.some((allowedRoot) => isWithinProject(allowedRoot, candidate));
}

function isAllowedCompilerPath(allowedRoots: string[], fileName: string) {
  const lexical = resolve(fileName);
  if (!isWithinAllowedRoot(allowedRoots, lexical)) {
    return false;
  }
  if (!existsSync(lexical)) {
    return true;
  }
  try {
    return isWithinAllowedRoot(allowedRoots, realpathSync(lexical));
  } catch {
    return false;
  }
}

function createParseHost(root: string, allowedRoots: string[]): ts.ParseConfigHost {
  const readFile = (fileName: string) => {
    if (!isAllowedCompilerPath(allowedRoots, fileName)) {
      return undefined;
    }
    const content = ts.sys.readFile(fileName);
    if (content && fileName.endsWith('.json')) {
      const parsed = ts.parseConfigFileTextToJson(fileName, content);
      if (
        parsed.config &&
        typeof parsed.config === 'object' &&
        ('compilerOptions' in parsed.config || 'extends' in parsed.config)
      ) {
        assertConfigurationPaths(
          root,
          dirname(resolve(fileName)),
          parsed.config as Record<string, unknown>,
        );
      }
    }
    return content;
  };
  return {
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
    fileExists: (fileName) =>
      isAllowedCompilerPath(allowedRoots, fileName) && ts.sys.fileExists(fileName),
    readFile,
    readDirectory: (path, extensions, exclude, include, depth) => {
      if (!isAllowedCompilerPath(allowedRoots, path)) {
        return [];
      }
      return ts.sys
        .readDirectory(path, extensions, exclude, include, depth)
        .filter((entry) => isAllowedCompilerPath(allowedRoots, entry));
    },
  };
}

function parseProjectConfiguration(
  root: string,
  configPath: string,
  parseHost: ts.ParseConfigHost,
  allowedRoots: string[],
): ParsedProjectConfiguration {
  if (!isAllowedCompilerPath(allowedRoots, configPath)) {
    invalidConfig();
  }
  const loaded = ts.readConfigFile(configPath, parseHost.readFile);
  if (loaded.error) {
    throw new TaleToolingError(
      'TALE_INVALID_TSCONFIG',
      'Tale UI: the project TypeScript configuration could not be read.',
    );
  }
  assertConfigurationPaths(root, dirname(configPath), loaded.config as Record<string, unknown>);
  const parsed = ts.parseJsonConfigFileContent(
    loaded.config,
    parseHost,
    dirname(configPath),
    { noEmit: true },
    configPath,
  );
  if (parsed.errors.length > 0) {
    throw new TaleToolingError(
      'TALE_INVALID_TSCONFIG',
      'Tale UI: the project TypeScript configuration is invalid.',
    );
  }
  return { configPath, parsed };
}

function projectConfigurations(
  root: string,
  configPath: string,
  parseHost: ts.ParseConfigHost,
  allowedRoots: string[],
  seen = new Set<string>(),
): ParsedProjectConfiguration[] {
  const canonicalPath = resolve(configPath);
  if (seen.has(canonicalPath)) {
    return [];
  }
  seen.add(canonicalPath);
  const configuration = parseProjectConfiguration(root, canonicalPath, parseHost, allowedRoots);
  return [
    configuration,
    ...(configuration.parsed.projectReferences || []).flatMap((reference) =>
      projectConfigurations(
        root,
        ts.resolveProjectReferencePath(reference),
        parseHost,
        allowedRoots,
        seen,
      ),
    ),
  ];
}

function configurationOwnsTarget(configuration: ParsedProjectConfiguration, target: string) {
  if (configuration.parsed.fileNames.some((fileName) => resolve(fileName) === target)) {
    return true;
  }
  return Object.keys(configuration.parsed.wildcardDirectories || {}).some((directory) =>
    isWithinProject(directory, target),
  );
}

function compilerConfiguration(
  root: string,
  target: string,
  allowedRoots: string[],
): CompilerConfiguration {
  const configPath = join(root, 'tsconfig.json');
  if (!existsSync(configPath)) {
    return {
      fallbackConfig: true,
      declarationFiles: [],
      options: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        jsx: ts.JsxEmit.ReactJSX,
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
    };
  }

  const parseHost = createParseHost(root, allowedRoots);
  const configurations = projectConfigurations(root, configPath, parseHost, allowedRoots);
  const selected =
    configurations
      .filter((configuration) => configurationOwnsTarget(configuration, target))
      .sort((a, b) => b.configPath.length - a.configPath.length)[0] || configurations[0]!;
  const selectedTree = projectConfigurations(root, selected.configPath, parseHost, allowedRoots);
  const declarationFiles = selectedTree.flatMap((configuration) =>
    configuration.parsed.fileNames.filter((fileName) => /\.d\.[cm]?ts$/.test(fileName)),
  );
  if (declarationFiles.some((fileName) => !isAllowedCompilerPath(allowedRoots, fileName))) {
    invalidConfig();
  }
  return {
    options: {
      ...selected.parsed.options,
      composite: false,
      incremental: false,
      tsBuildInfoFile: undefined,
      noEmit: true,
    },
    fallbackConfig: false,
    declarationFiles: [...new Set(declarationFiles)],
  };
}

export function validateTypeScript(
  root: string,
  absoluteFile: string,
  code: string,
): { diagnostics: ValidationDiagnostic[]; fallbackConfig: boolean } {
  const target = resolve(absoluteFile);
  const allowedRoots = allowedCompilerRoots(root);
  const configuration = compilerConfiguration(root, target, allowedRoots);
  const host = ts.createCompilerHost(configuration.options, true);
  const originalFileExists = host.fileExists.bind(host);
  const originalReadFile = host.readFile.bind(host);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  const originalDirectoryExists = host.directoryExists?.bind(host);
  const originalGetDirectories = host.getDirectories?.bind(host);
  const sameTarget = (fileName: string) => resolve(fileName) === target;

  host.getCurrentDirectory = () => root;
  host.fileExists = (fileName) =>
    sameTarget(fileName) ||
    (isAllowedCompilerPath(allowedRoots, fileName) && originalFileExists(fileName));
  host.readFile = (fileName) => {
    if (sameTarget(fileName)) {
      return code;
    }
    return isAllowedCompilerPath(allowedRoots, fileName) ? originalReadFile(fileName) : undefined;
  };
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    if (sameTarget(fileName)) {
      return ts.createSourceFile(fileName, code, languageVersion, true);
    }
    return isAllowedCompilerPath(allowedRoots, fileName)
      ? originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : undefined;
  };
  if (originalDirectoryExists) {
    host.directoryExists = (directoryName) =>
      isAllowedCompilerPath(allowedRoots, directoryName) && originalDirectoryExists(directoryName);
  }
  if (originalGetDirectories) {
    host.getDirectories = (directoryName) =>
      isAllowedCompilerPath(allowedRoots, directoryName)
        ? originalGetDirectories(directoryName).filter((entry) =>
            isAllowedCompilerPath(allowedRoots, resolve(directoryName, entry)),
          )
        : [];
  }

  const program = ts.createProgram({
    rootNames: [
      target,
      ...configuration.declarationFiles.filter((fileName) => resolve(fileName) !== target),
    ],
    options: configuration.options,
    host,
  });
  return {
    diagnostics: normalizeTypeScriptDiagnostics(ts.getPreEmitDiagnostics(program), root),
    fallbackConfig: configuration.fallbackConfig,
  };
}
