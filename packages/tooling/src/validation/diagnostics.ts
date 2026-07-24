import type { Diagnostic, DiagnosticCategory } from 'typescript';
import ts from 'typescript';
import type { ValidationDiagnostic } from '../contracts/validation.js';
import { relativeProjectPath } from './project.js';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_DIAGNOSTICS = 200;

function boundedMessage(message: string, root: string) {
  return message
    .replaceAll(root, '.')
    .replaceAll(root.replaceAll('\\', '/'), '.')
    .replace(/[A-Za-z]:[\\/][^\s'"]+|\/(?:Users|home|private|tmp|var)\/[^\s'"]+/g, '<path>')
    .slice(0, MAX_MESSAGE_LENGTH);
}

function severity(category: DiagnosticCategory): ValidationDiagnostic['severity'] {
  if (category === ts.DiagnosticCategory.Error) {
    return 'error';
  }
  if (category === ts.DiagnosticCategory.Warning) {
    return 'warning';
  }
  return 'info';
}

export function normalizeTypeScriptDiagnostics(
  diagnostics: readonly Diagnostic[],
  root: string,
): ValidationDiagnostic[] {
  return diagnostics.slice(0, MAX_DIAGNOSTICS).map((diagnostic) => {
    const message = boundedMessage(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      root,
    );
    if (!diagnostic.file || diagnostic.start === undefined) {
      return {
        code: diagnostic.code,
        severity: severity(diagnostic.category),
        message,
      };
    }
    const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const path = relativeProjectPath(root, diagnostic.file.fileName);
    return {
      code: diagnostic.code,
      severity: severity(diagnostic.category),
      ...(path !== '..' && !path.startsWith('../') ? { path } : {}),
      line: position.line + 1,
      column: position.character + 1,
      message,
    };
  });
}

export function boundDiagnostics(diagnostics: ValidationDiagnostic[]) {
  return diagnostics.slice(0, MAX_DIAGNOSTICS).map((diagnostic) => ({
    ...diagnostic,
    message: diagnostic.message.slice(0, MAX_MESSAGE_LENGTH),
  }));
}
