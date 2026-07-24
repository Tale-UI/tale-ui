import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { TaleToolingError } from '../contracts/errors.js';
import type { ValidationDiagnostic } from '../contracts/validation.js';
import { normalizeTypeScriptDiagnostics } from './diagnostics.js';
import { isWithinProject } from './project.js';

interface CompilerConfiguration {
  options: ts.CompilerOptions;
  fallbackConfig: boolean;
}

function invalidConfig(): never {
  throw new TaleToolingError(
    'TALE_INVALID_TSCONFIG',
    'Tale UI: the project TypeScript configuration contains a path outside the project root.',
  );
}

function assertConfigurationPaths(root: string, config: Record<string, unknown>) {
  const extendsValues = Array.isArray(config.extends) ? config.extends : [config.extends];
  for (const value of extendsValues) {
    if (typeof value === 'string' && value.split(/[\\/]/).includes('..')) {
      invalidConfig();
    }
    if (
      typeof value === 'string' &&
      (value.startsWith('.') || value.startsWith('/') || /^[A-Za-z]:/.test(value)) &&
      !isWithinProject(root, resolve(root, value))
    ) {
      invalidConfig();
    }
  }
  const compilerOptions =
    config.compilerOptions && typeof config.compilerOptions === 'object'
      ? (config.compilerOptions as Record<string, unknown>)
      : {};
  const scalarPaths = ['baseUrl', 'rootDir', 'outDir', 'declarationDir', 'tsBuildInfoFile'];
  for (const key of scalarPaths) {
    const value = compilerOptions[key];
    if (typeof value === 'string' && !isWithinProject(root, resolve(root, value))) {
      invalidConfig();
    }
  }
  for (const key of ['typeRoots', 'rootDirs']) {
    const values = compilerOptions[key];
    if (
      Array.isArray(values) &&
      values.some(
        (value) => typeof value === 'string' && !isWithinProject(root, resolve(root, value)),
      )
    ) {
      invalidConfig();
    }
  }
  const base = resolve(
    root,
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

function isAllowedCompilerPath(root: string, fileName: string) {
  const normalized = resolve(fileName).split('\\').join('/');
  return isWithinProject(root, normalized) || normalized.includes('/node_modules/');
}

function compilerConfiguration(root: string): CompilerConfiguration {
  const configPath = join(root, 'tsconfig.json');
  if (!existsSync(configPath)) {
    return {
      fallbackConfig: true,
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

  const loaded = ts.readConfigFile(configPath, ts.sys.readFile);
  if (loaded.error) {
    throw new TaleToolingError(
      'TALE_INVALID_TSCONFIG',
      'Tale UI: the project TypeScript configuration could not be read.',
    );
  }
  assertConfigurationPaths(root, loaded.config as Record<string, unknown>);
  const parsed = ts.parseJsonConfigFileContent(
    loaded.config,
    ts.sys,
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
  return { options: { ...parsed.options, noEmit: true }, fallbackConfig: false };
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

  const program = ts.createProgram({
    rootNames: [target],
    options: configuration.options,
    host,
  });
  return {
    diagnostics: normalizeTypeScriptDiagnostics(ts.getPreEmitDiagnostics(program), root),
    fallbackConfig: configuration.fallbackConfig,
  };
}
