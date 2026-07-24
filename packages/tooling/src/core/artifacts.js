function score(query, artifact) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return 1;
  }
  const words = normalized.split(/\s+/);
  const fields = [
    artifact.id,
    artifact.slug,
    artifact.name,
    artifact.description,
    artifact.kind,
    ...(artifact.aliases || []),
    ...artifact.keywords,
  ].map((value) => value.toLowerCase());

  let total = 0;
  for (const field of fields) {
    if (field === normalized) {
      total = Math.max(total, 100);
    } else if (field.includes(normalized)) {
      total = Math.max(total, 80);
    }
    const matched = words.filter((word) => field.includes(word)).length;
    total = Math.max(total, Math.round((matched / words.length) * 60));
  }
  return total;
}

export function searchArtifactsInRegistry(
  registry,
  { query = '', kinds, lifecycle, limit = 20, cursor = 0 } = {},
) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new TypeError('limit must be an integer between 1 and 100');
  }
  if (!Number.isInteger(cursor) || cursor < 0) {
    throw new TypeError('cursor must be a non-negative integer');
  }
  const kindSet = kinds ? new Set(kinds) : null;
  const lifecycleSet = lifecycle ? new Set(lifecycle) : null;
  const matches = registry.artifacts
    .filter((artifact) => !kindSet || kindSet.has(artifact.kind))
    .filter((artifact) => !lifecycleSet || lifecycleSet.has(artifact.lifecycle))
    .map((artifact) => ({ artifact, score: score(query, artifact) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.artifact.id.localeCompare(b.artifact.id));
  const page = matches.slice(cursor, cursor + limit).map(({ artifact, score: relevance }) => ({
    id: artifact.id,
    kind: artifact.kind,
    name: artifact.name,
    lifecycle: artifact.lifecycle,
    description: artifact.description,
    retrieval: artifact.retrieval,
    relevance,
    ...(artifact.replacementId ? { replacementId: artifact.replacementId } : {}),
  }));
  return {
    registryVersion: registry.registryVersion,
    sourceRevision: registry.sourceRevision,
    results: page,
    nextCursor: cursor + page.length < matches.length ? cursor + page.length : null,
  };
}

export function getArtifactFromRegistry(registry, idOrAlias, { kind } = {}) {
  const query = idOrAlias.trim().toLowerCase();
  const exactId = registry.artifacts.find((artifact) => artifact.id.toLowerCase() === query);
  if (exactId) {
    return exactId;
  }
  const matches = registry.artifacts.filter(
    (artifact) =>
      (!kind || artifact.kind === kind) &&
      (artifact.slug.toLowerCase() === query ||
        artifact.name.toLowerCase() === query ||
        (artifact.aliases || []).some((alias) => alias.toLowerCase() === query)),
  );
  if (matches.length > 1) {
    throw new TypeError(
      `Artifact lookup "${idOrAlias}" is ambiguous: ${matches
        .map((artifact) => artifact.id)
        .join(', ')}. Pass a stable ID or kind.`,
    );
  }
  return matches[0] || null;
}
