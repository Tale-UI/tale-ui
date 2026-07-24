import { existsSync, realpathSync } from 'node:fs';
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

const TYPESCRIPT_ROOT = realpathSync(dirname(ts.sys.getExecutingFilePath()));

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

function isWithinAllowedRoot(root: string, candidate: string) {
  return isWithinProject(root, candidate) || isWithinProject(TYPESCRIPT_ROOT, candidate);
}

function isAllowedCompilerPath(root: string, fileName: string) {
  const lexical = resolve(fileName);
  if (!isWithinAllowedRoot(root, lexical)) {
    return false;
  }
  if (!existsSync(lexical)) {
    return true;
  }
  try {
    return isWithinAllowedRoot(root, realpathSync(lexical));
  } catch {
    return false;
  }
}

function createParseHost(root: string): ts.ParseConfigHost {
  const readFile = (fileName: string) => {
    if (!isAllowedCompilerPath(root, fileName)) {
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
    fileExists: (fileName) => isAllowedCompilerPath(root, fileName) && ts.sys.fileExists(fileName),
    readFile,
    readDirectory: (path, extensions, exclude, include, depth) => {
      if (!isAllowedCompilerPath(root, path)) {
        return [];
      }
      return ts.sys
        .readDirectory(path, extensions, exclude, include, depth)
        .filter((entry) => isAllowedCompilerPath(root, entry));
    },
  };
}

function compilerConfiguration(root: string): CompilerConfiguration {
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

  const parseHost = createParseHost(root);
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
    root,
    { noEmit: true },
    configPath,
  );
  if (parsed.errors.length > 0) {
    throw new TaleToolingError(
      'TALE_INVALID_TSCONFIG',
      'Tale UI: the project TypeScript configuration is invalid.',
    );
  }
  const declarationFiles = parsed.fileNames.filter((fileName) => /\.d\.[cm]?ts$/.test(fileName));
  if (declarationFiles.some((fileName) => !isAllowedCompilerPath(root, fileName))) {
    invalidConfig();
  }
  return {
    options: { ...parsed.options, noEmit: true },
    fallbackConfig: false,
    declarationFiles,
  };
}

export function validateTypeScript(
  root: string,
  absoluteFile: string,
  code: string,
): { diagnostics: ValidationDiagnostic[]; fallbackConfig: boolean } {
  const configuration = compilerConfiguration(root);
  const target = resolve(absoluteFile);
  const host = ts.createCompilerHost(configuration.options, true);
  const originalFileExists = host.fileExists.bind(host);
  const originalReadFile = host.readFile.bind(host);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  const originalDirectoryExists = host.directoryExists?.bind(host);
  const originalGetDirectories = host.getDirectories?.bind(host);
  const sameTarget = (fileName: string) => resolve(fileName) === target;

  host.getCurrentDirectory = () => root;
  host.fileExists = (fileName) =>
    sameTarget(fileName) || (isAllowedCompilerPath(root, fileName) && originalFileExists(fileName));
  host.readFile = (fileName) => {
    if (sameTarget(fileName)) {
      return code;
    }
    return isAllowedCompilerPath(root, fileName) ? originalReadFile(fileName) : undefined;
  };
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    if (sameTarget(fileName)) {
      return ts.createSourceFile(fileName, code, languageVersion, true);
    }
    return isAllowedCompilerPath(root, fileName)
      ? originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : undefined;
  };
  if (originalDirectoryExists) {
    host.directoryExists = (directoryName) =>
      isAllowedCompilerPath(root, directoryName) && originalDirectoryExists(directoryName);
  }
  if (originalGetDirectories) {
    host.getDirectories = (directoryName) =>
      isAllowedCompilerPath(root, directoryName)
        ? originalGetDirectories(directoryName).filter((entry) =>
            isAllowedCompilerPath(root, resolve(directoryName, entry)),
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
