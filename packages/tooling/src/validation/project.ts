import { existsSync, lstatSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { TaleToolingError } from '../contracts/errors.js';

function isOutside(root: string, candidate: string) {
  const path = relative(root, candidate);
  return path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path);
}

export function isWithinProject(root: string, candidate: string) {
  return !isOutside(root, resolve(candidate));
}

export function resolveProjectRoot(root: string) {
  if (typeof root !== 'string' || !root.trim()) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: validation requires a project root.',
    );
  }
  try {
    const canonical = realpathSync(root);
    if (!statSync(canonical).isDirectory()) {
      throw new Error('not a directory');
    }
    return canonical;
  } catch (cause) {
    throw new TaleToolingError(
      'TALE_OUTSIDE_PROJECT_ROOT',
      'Tale UI: the validation root is unavailable or is not a directory.',
      { cause },
    );
  }
}

export function resolveProjectFile(root: string, path: string, options: { mustExist: boolean }) {
  if (
    typeof path !== 'string' ||
    !path.trim() ||
    path.includes('\0') ||
    isAbsolute(path) ||
    /^[A-Za-z]:/.test(path) ||
    path.split(/[\\/]/).includes('..')
  ) {
    throw new TaleToolingError(
      'TALE_UNSAFE_PATH',
      'Tale UI: validation paths must be portable, project-relative paths without traversal.',
    );
  }

  const absolute = resolve(root, path.replaceAll(/[\\/]/g, sep));
  if (isOutside(root, absolute)) {
    throw new TaleToolingError(
      'TALE_OUTSIDE_PROJECT_ROOT',
      'Tale UI: the validation target resolves outside the project root.',
    );
  }

  if (options.mustExist) {
    try {
      const canonical = realpathSync(absolute);
      if (isOutside(root, canonical)) {
        throw new TaleToolingError(
          'TALE_SYMLINK_REFUSED',
          'Tale UI: the validation target follows a symlink outside the project root.',
        );
      }
      if (!statSync(canonical).isFile()) {
        throw new Error('not a file');
      }
      return canonical;
    } catch (cause) {
      if (cause instanceof TaleToolingError) {
        throw cause;
      }
      throw new TaleToolingError(
        'TALE_OUTSIDE_PROJECT_ROOT',
        'Tale UI: the validation target is unavailable or is not a file.',
        { cause },
      );
    }
  }

  const parent = resolve(absolute, '..');
  if (existsSync(parent)) {
    const canonicalParent = realpathSync(parent);
    if (isOutside(root, canonicalParent) || lstatSync(parent).isSymbolicLink()) {
      throw new TaleToolingError(
        'TALE_SYMLINK_REFUSED',
        'Tale UI: the virtual validation path traverses an untrusted symlink.',
      );
    }
  }
  return absolute;
}

export function relativeProjectPath(root: string, absolute: string) {
  return relative(root, absolute).split(sep).join('/');
}
