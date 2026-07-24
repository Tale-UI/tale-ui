import { createHash } from 'node:crypto';

export function compareCanonicalStrings(a, b) {
  return a.localeCompare(b);
}

export function normalizeArtifactSourceText(value) {
  return value.replace(/\r\n/g, '\n');
}

export function computeArtifactSourceRevision(paths, readSource) {
  const preimage = paths
    .map((path) => `${path}\0${normalizeArtifactSourceText(readSource(path))}`)
    .join('\0');
  return `sha256:${createHash('sha256').update(preimage).digest('hex')}`;
}
