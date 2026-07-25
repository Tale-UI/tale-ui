const REACT_ARIA_GENERATED_PREFIX = /\breact-aria\d+-/g;

export function normalizeAxeTarget(target) {
  return target.replace(REACT_ARIA_GENERATED_PREFIX, 'react-aria-');
}

export function accessibilityViolationKey({ storyId, rule, target }) {
  return `${storyId}\n${rule}\n${normalizeAxeTarget(target)}`;
}

export function resolvedAccessibilityViolations(known, current, scannedStoryIds) {
  const scanned = new Set(scannedStoryIds);
  const currentKeys = new Set(current.map(accessibilityViolationKey));
  return known.filter(
    (violation) =>
      scanned.has(violation.storyId) && !currentKeys.has(accessibilityViolationKey(violation)),
  );
}
