import * as React from 'react';
import { useAnimationFrame } from '@tale-ui/utils/useAnimationFrame';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import { warn } from '@tale-ui/utils/warn';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

export interface OutlineItem {
  id: string;
  targetId: string;
  label: string;
  level: number;
}

type OutlineAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type OutlineActiveState =
  | {
      activeId: string | null;
      defaultActiveId?: never;
      onActiveChange?: (id: string | null) => void;
    }
  | {
      activeId?: never;
      defaultActiveId?: string | null;
      onActiveChange?: (id: string | null) => void;
    };

interface OutlineBaseProps extends SafeDomProps<
  Omit<
    React.HTMLAttributes<HTMLElement>,
    'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'onChange'
  >
> {
  /** Ordered headings. Levels must form a valid hierarchy starting at one. */
  items: readonly OutlineItem[];
  /** Runs before an active-state proposal for an unmodified primary activation. */
  onAction?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Enables target observation. @default true */
  observeTargets?: boolean;
  /** Resolves the observer root from this Outline's navigation landmark. */
  getObserverRoot?: (nav: HTMLElement) => Element | Document | null;
  /** IntersectionObserver root margin. @default "0px 0px -70% 0px" */
  observerRootMargin?: string;
  /** IntersectionObserver threshold or thresholds. @default [0, .25, .5, .75, 1] */
  observerThreshold?: number | readonly number[];
}

export type OutlineProps = OutlineBaseProps & OutlineAccessibleName & OutlineActiveState;

type RuntimeOutlineProps = OutlineProps & {
  activeId?: unknown;
  defaultActiveId?: unknown;
  dangerouslySetInnerHTML?: unknown;
  getObserverRoot?: unknown;
  items?: unknown;
  observeTargets?: unknown;
  observerRootMargin?: unknown;
  observerThreshold?: unknown;
  onAction?: unknown;
  onActiveChange?: unknown;
  role?: unknown;
};

type ActiveMode = 'controlled' | 'uncontrolled';

interface OutlineNode {
  item: OutlineItem;
  children: OutlineNode[];
}

interface ValidatedItems {
  items: OutlineItem[];
  itemIds: Set<string>;
  tree: OutlineNode[];
  signature: string;
}

interface OutlineItemSnapshot {
  id: unknown;
  targetId: unknown;
  label: unknown;
  level: unknown;
}

interface LatestState {
  activeId: string | null;
  canAct: boolean;
  itemIds: Set<string>;
  mode: ActiveMode | undefined;
}

const DEFAULT_ROOT_MARGIN = '0px 0px -70% 0px';
const DEFAULT_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1] as const;

function isNonWhitespaceString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function containsControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) {
      return true;
    }
  }
  return false;
}

function isValidId(value: unknown): value is string {
  return (
    isNonWhitespaceString(value) &&
    value.trim() === value &&
    !/\s|#/u.test(value) &&
    !containsControlCharacter(value)
  );
}

function snapshotItems(value: unknown): Array<OutlineItemSnapshot | null> | null {
  let candidates: unknown[];
  try {
    if (!Array.isArray(value)) {
      return null;
    }
    candidates = Array.from(value);
  } catch {
    return null;
  }

  return candidates.map((candidate) => {
    try {
      if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) {
        return null;
      }

      const item = candidate as Partial<OutlineItem>;
      return {
        id: item.id,
        targetId: item.targetId,
        label: item.label,
        level: item.level,
      };
    } catch {
      return null;
    }
  });
}

function validateItems(
  value: readonly (OutlineItemSnapshot | null)[] | null,
): ValidatedItems | null {
  if (value === null) {
    return null;
  }

  const items: OutlineItem[] = [];
  const itemIds = new Set<string>();
  const targetIds = new Set<string>();
  const stack: OutlineNode[] = [];
  const tree: OutlineNode[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    if (item === null) {
      return null;
    }

    if (
      !isValidId(item.id) ||
      !isValidId(item.targetId) ||
      !isNonWhitespaceString(item.label) ||
      typeof item.level !== 'number' ||
      !Number.isInteger(item.level) ||
      item.level < 1 ||
      itemIds.has(item.id) ||
      targetIds.has(item.targetId)
    ) {
      return null;
    }

    if (
      (index === 0 && item.level !== 1) ||
      (index > 0 && item.level > items[index - 1]!.level + 1) ||
      item.level > stack.length + 1
    ) {
      return null;
    }

    const normalizedItem: OutlineItem = {
      id: item.id,
      targetId: item.targetId,
      label: item.label,
      level: item.level,
    };
    const node: OutlineNode = { item: normalizedItem, children: [] };

    stack.length = normalizedItem.level - 1;
    if (normalizedItem.level === 1) {
      tree.push(node);
    } else {
      const parent = stack[normalizedItem.level - 2];
      if (!parent) {
        return null;
      }
      parent.children.push(node);
    }
    stack.push(node);
    items.push(normalizedItem);
    itemIds.add(normalizedItem.id);
    targetIds.add(normalizedItem.targetId);
  }

  return {
    items,
    itemIds,
    tree,
    signature: JSON.stringify(
      items.map(({ id, targetId, label, level }) => [id, targetId, label, level]),
    ),
  };
}

function getSafeFallbackItems(
  value: readonly (OutlineItemSnapshot | null)[] | null,
): OutlineItem[] {
  if (value === null) {
    return [];
  }

  const result: OutlineItem[] = [];
  const itemIds = new Set<string>();
  const targetIds = new Set<string>();
  for (const item of value) {
    if (item === null) {
      continue;
    }

    if (
      isValidId(item.id) &&
      isValidId(item.targetId) &&
      isNonWhitespaceString(item.label) &&
      !itemIds.has(item.id) &&
      !targetIds.has(item.targetId)
    ) {
      result.push({ id: item.id, targetId: item.targetId, label: item.label, level: 1 });
      itemIds.add(item.id);
      targetIds.add(item.targetId);
    }
  }
  return result;
}

function normalizeThresholds(value: unknown): number[] | null {
  let candidates: readonly unknown[];
  try {
    candidates =
      value === undefined ? DEFAULT_THRESHOLDS : Array.isArray(value) ? Array.from(value) : [value];
  } catch {
    return null;
  }

  if (candidates.length === 0) {
    return null;
  }

  const normalized: number[] = [];
  for (const threshold of candidates) {
    if (
      typeof threshold !== 'number' ||
      !Number.isFinite(threshold) ||
      threshold < 0 ||
      threshold > 1
    ) {
      return null;
    }
    normalized.push(threshold);
  }

  return [...new Set(normalized)].sort((left, right) => left - right);
}

function isValidObserverRoot(root: unknown, nav: HTMLElement): root is Element | Document | null {
  try {
    if (root === null) {
      return true;
    }

    if (typeof root !== 'object') {
      return false;
    }

    if (root === nav.ownerDocument) {
      return true;
    }

    return (root as Node).nodeType === 1 && (root as Element).ownerDocument === nav.ownerDocument;
  } catch {
    return false;
  }
}

function isPrimaryUnmodifiedActivation(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

function chooseObservedId(
  items: readonly OutlineItem[],
  entries: ReadonlyMap<string, IntersectionObserverEntry>,
): string | null {
  let selected:
    | {
        id: string;
        distance: number;
        top: number;
        ratio: number;
        index: number;
      }
    | undefined;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]!;
    const entry = entries.get(item.id);

    if (!entry?.isIntersecting || entry.intersectionRatio <= 0) {
      continue;
    }

    const rootTop = entry.rootBounds?.top ?? 0;
    const top = entry.boundingClientRect.top - rootTop;
    const candidate = {
      id: item.id,
      distance: Math.abs(top),
      top,
      ratio: entry.intersectionRatio,
      index,
    };

    if (
      !selected ||
      candidate.distance < selected.distance ||
      (candidate.distance === selected.distance && candidate.top < selected.top) ||
      (candidate.distance === selected.distance &&
        candidate.top === selected.top &&
        candidate.ratio > selected.ratio) ||
      (candidate.distance === selected.distance &&
        candidate.top === selected.top &&
        candidate.ratio === selected.ratio &&
        candidate.index < selected.index)
    ) {
      selected = candidate;
    }
  }

  return selected?.id ?? null;
}

interface OutlineListProps {
  activeId: string | null;
  canAct: boolean;
  nodes: readonly OutlineNode[];
  onActivate: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  nested?: boolean;
}

function OutlineList({ activeId, canAct, nodes, onActivate, nested = false }: OutlineListProps) {
  return (
    <ol className={nested ? 'tale-outline__list tale-outline__list--nested' : 'tale-outline__list'}>
      {nodes.map(({ item, children }) => {
        const isActive = canAct && activeId === item.id;
        return (
          <li key={item.id} className="tale-outline__item">
            <a
              aria-current={isActive ? 'location' : undefined}
              className="tale-outline__link"
              data-active={isActive || undefined}
              href={`#${item.targetId}`}
              onClick={
                canAct
                  ? (event) => {
                      if (isPrimaryUnmodifiedActivation(event)) {
                        onActivate(item.id, event);
                      }
                    }
                  : undefined
              }
            >
              {item.label}
            </a>
            {children.length > 0 ? (
              <OutlineList
                activeId={activeId}
                canAct={canAct}
                nodes={children}
                onActivate={onActivate}
                nested
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * A document outline with semantic nested navigation and optional observed active state.
 *
 * @example
 * ```tsx
 * import { Outline } from '@tale-ui/react/outline';
 *
 * <Outline
 *   aria-label="On this page"
 *   items={[
 *     {id: 'overview', targetId: 'overview', label: 'Overview', level: 1},
 *     {id: 'details', targetId: 'details', label: 'Details', level: 2}
 *   ]}
 * />
 * ```
 *
 * @status experimental
 */
export const Outline = React.forwardRef<HTMLElement, OutlineProps>((props, forwardedRef) => {
  const runtimeProps = props as RuntimeOutlineProps;
  const {
    activeId: activeIdProp,
    className,
    defaultActiveId,
    dangerouslySetInnerHTML,
    getObserverRoot,
    items: itemsProp,
    observeTargets = true,
    observerRootMargin = DEFAULT_ROOT_MARGIN,
    observerThreshold,
    onAction,
    onActiveChange,
    role: blockedRole,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...domProps
  } = runtimeProps;

  if (dangerouslySetInnerHTML !== undefined) {
    warn('OUTLINE_DANGEROUS_HTML_OMITTED');
  }
  void blockedRole;

  const itemSnapshots = snapshotItems(itemsProp);
  const parsedItems = validateItems(itemSnapshots);
  const validatedItemsCacheRef = React.useRef<ValidatedItems | null>(null);
  if (parsedItems && validatedItemsCacheRef.current?.signature !== parsedItems.signature) {
    validatedItemsCacheRef.current = parsedItems;
  }
  const validatedItems = parsedItems ? validatedItemsCacheRef.current : null;
  const safeFallbackItems = validatedItems ? [] : getSafeFallbackItems(itemSnapshots);
  const hasValidName =
    (isNonWhitespaceString(ariaLabel) && ariaLabelledby === undefined) ||
    (ariaLabel === undefined && isNonWhitespaceString(ariaLabelledby));
  const hasControlledProp = activeIdProp !== undefined;
  const hasDefaultProp = defaultActiveId !== undefined;
  const candidateMode: ActiveMode = hasControlledProp ? 'controlled' : 'uncontrolled';
  const modeRef = React.useRef<ActiveMode | undefined>(undefined);
  const uncontrolledInitializedRef = React.useRef(false);
  const initialDefault =
    !hasControlledProp && !hasDefaultProp
      ? null
      : validatedItems &&
          typeof defaultActiveId === 'string' &&
          validatedItems.itemIds.has(defaultActiveId)
        ? defaultActiveId
        : null;
  const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState<string | null>(
    initialDefault,
  );
  const activeSnapshotRef = React.useRef<string | null>(initialDefault);

  const modeShapeValid = !hasControlledProp || !hasDefaultProp;
  const modeMatches = modeRef.current === undefined || modeRef.current === candidateMode;
  const controlledIdValid =
    candidateMode !== 'controlled' ||
    activeIdProp === null ||
    (typeof activeIdProp === 'string' &&
      validatedItems !== null &&
      validatedItems.itemIds.has(activeIdProp));
  const canEstablishMode =
    validatedItems !== null && modeShapeValid && modeMatches && controlledIdValid;
  const renderMode = modeRef.current ?? (canEstablishMode ? candidateMode : undefined);
  const initializingUncontrolled = modeRef.current === undefined && renderMode === 'uncontrolled';
  const pendingUncontrolledDefault =
    renderMode === 'uncontrolled' && initializingUncontrolled && !uncontrolledInitializedRef.current
      ? initialDefault
      : uncontrolledActiveId;
  const unresolvedUncontrolledRemoval =
    renderMode === 'uncontrolled' &&
    validatedItems !== null &&
    pendingUncontrolledDefault !== null &&
    !validatedItems.itemIds.has(pendingUncontrolledDefault);
  const stateValid = renderMode !== undefined && modeShapeValid && modeMatches && controlledIdValid;
  const callbacksValid =
    (onAction === undefined || typeof onAction === 'function') &&
    (onActiveChange === undefined || typeof onActiveChange === 'function');
  const canAct =
    hasValidName && validatedItems !== null && stateValid && !unresolvedUncontrolledRemoval;
  const renderedActiveId: string | null = !canAct
    ? null
    : renderMode === 'controlled'
      ? (activeIdProp as string | null)
      : pendingUncontrolledDefault;

  const safeOnAction =
    typeof onAction === 'function'
      ? (onAction as (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void)
      : undefined;
  const safeOnActiveChange =
    typeof onActiveChange === 'function'
      ? (onActiveChange as (id: string | null) => void)
      : undefined;
  const onActionStable = useStableCallback(safeOnAction);
  const onActiveChangeStable = useStableCallback(safeOnActiveChange);
  const latestStateRef = React.useRef<LatestState>({
    activeId: renderedActiveId,
    canAct,
    itemIds: validatedItems?.itemIds ?? new Set(),
    mode: renderMode,
  });
  latestStateRef.current = {
    activeId: renderedActiveId,
    canAct,
    itemIds: validatedItems?.itemIds ?? new Set(),
    mode: renderMode,
  };

  if (!hasValidName) {
    warn('OUTLINE_INVALID_ACCESSIBLE_NAME');
  }
  if (!validatedItems) {
    warn('OUTLINE_INVALID_ITEMS');
  }
  if (!stateValid) {
    warn('OUTLINE_INVALID_ACTIVE_STATE');
  }
  if (!callbacksValid) {
    warn('OUTLINE_INVALID_CALLBACK');
  }

  useIsoLayoutEffect(() => {
    if (modeRef.current === undefined && canEstablishMode) {
      modeRef.current = candidateMode;
      if (initializingUncontrolled && !uncontrolledInitializedRef.current) {
        uncontrolledInitializedRef.current = true;
        activeSnapshotRef.current = initialDefault;
        setUncontrolledActiveId(initialDefault);
      }
    }
  }, [canEstablishMode, candidateMode, initialDefault, initializingUncontrolled]);

  useIsoLayoutEffect(() => {
    if (
      unresolvedUncontrolledRemoval &&
      stateValid &&
      activeSnapshotRef.current === pendingUncontrolledDefault
    ) {
      activeSnapshotRef.current = null;
      setUncontrolledActiveId(null);
      onActiveChangeStable?.(null);
    }
  }, [onActiveChangeStable, pendingUncontrolledDefault, stateValid, unresolvedUncontrolledRemoval]);

  if (renderMode === 'controlled') {
    activeSnapshotRef.current = renderedActiveId;
  } else if (!unresolvedUncontrolledRemoval) {
    activeSnapshotRef.current = pendingUncontrolledDefault;
  }

  const proposeActiveId = useStableCallback((nextActiveId: string | null) => {
    const latest = latestStateRef.current;
    if (
      !latest.canAct ||
      (nextActiveId !== null && !latest.itemIds.has(nextActiveId)) ||
      latest.activeId === nextActiveId
    ) {
      return;
    }

    if (latest.mode === 'uncontrolled') {
      activeSnapshotRef.current = nextActiveId;
      latest.activeId = nextActiveId;
      setUncontrolledActiveId(nextActiveId);
    }
    onActiveChangeStable?.(nextActiveId);
  });

  const activate = useStableCallback((id: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!latestStateRef.current.canAct) {
      return;
    }

    onActionStable?.(id, event);
    if (!event.defaultPrevented) {
      proposeActiveId(id);
    }
  });

  const parsedThresholds = normalizeThresholds(observerThreshold);
  const parsedThresholdSignature = parsedThresholds?.join(',') ?? '';
  const thresholdCacheRef = React.useRef<{
    signature: string;
    values: number[];
  } | null>(null);
  if (parsedThresholds && thresholdCacheRef.current?.signature !== parsedThresholdSignature) {
    thresholdCacheRef.current = {
      signature: parsedThresholdSignature,
      values: parsedThresholds,
    };
  }
  const thresholds = parsedThresholds ? (thresholdCacheRef.current?.values ?? null) : null;
  const observerSettingsValid =
    (observeTargets === true || observeTargets === false) &&
    typeof observerRootMargin === 'string' &&
    observerRootMargin.trim().length > 0 &&
    thresholds !== null &&
    (getObserverRoot === undefined || typeof getObserverRoot === 'function');
  const shouldObserve =
    canAct && observeTargets === true && observerSettingsValid && validatedItems !== null;
  if (!observerSettingsValid) {
    warn('OUTLINE_INVALID_OBSERVER_CONFIG');
  }

  const navRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(navRef, forwardedRef);
  const frame = useAnimationFrame();
  const observerGenerationRef = React.useRef(0);
  useIsoLayoutEffect(() => {
    observerGenerationRef.current += 1;
    const generation = observerGenerationRef.current;
    frame.cancel();

    const nav = navRef.current;
    if (!shouldObserve || !nav || !validatedItems || !thresholds) {
      return;
    }

    const ownerWindow = nav.ownerDocument.defaultView;
    const Observer = ownerWindow?.IntersectionObserver;
    if (!Observer) {
      warn('OUTLINE_OBSERVER_UNAVAILABLE');
      return;
    }

    let root: Element | Document | null = null;
    if (typeof getObserverRoot === 'function') {
      try {
        root = getObserverRoot(nav);
      } catch {
        warn('OUTLINE_OBSERVER_ROOT_FAILED');
        return;
      }

      if (!isValidObserverRoot(root, nav)) {
        warn('OUTLINE_OBSERVER_ROOT_FAILED');
        return;
      }
    }

    const targetToId = new Map<Element, string>();
    for (const item of validatedItems.items) {
      const target = nav.ownerDocument.getElementById(item.targetId);
      if (target) {
        targetToId.set(target, item.id);
      }
    }
    const latestEntries = new Map<string, IntersectionObserverEntry>();
    let observer: IntersectionObserver;

    try {
      observer = new Observer(
        (entries) => {
          if (observerGenerationRef.current !== generation) {
            return;
          }

          for (const entry of entries) {
            const id = targetToId.get(entry.target);
            if (id !== undefined) {
              latestEntries.set(id, entry);
            }
          }
          frame.request(() => {
            if (observerGenerationRef.current !== generation) {
              return;
            }
            proposeActiveId(chooseObservedId(validatedItems.items, latestEntries));
          });
        },
        {
          root,
          rootMargin: observerRootMargin as string,
          threshold: thresholds,
        },
      );
    } catch {
      warn('OUTLINE_OBSERVER_CONSTRUCTION_FAILED');
      return;
    }

    for (const target of targetToId.keys()) {
      observer.observe(target);
    }

    return () => {
      if (observerGenerationRef.current === generation) {
        observerGenerationRef.current += 1;
      }
      frame.cancel();
      observer.disconnect();
      latestEntries.clear();
      targetToId.clear();
    };
  }, [
    frame,
    getObserverRoot,
    observerRootMargin,
    proposeActiveId,
    shouldObserve,
    thresholds,
    validatedItems,
  ]);

  const safeClassName = typeof className === 'string' ? className : undefined;
  const Root = hasValidName ? 'nav' : 'div';
  const rootProps = hasValidName
    ? ariaLabel !== undefined
      ? { 'aria-label': ariaLabel }
      : { 'aria-labelledby': ariaLabelledby as string }
    : {};
  const tree = validatedItems?.tree ?? safeFallbackItems.map((item) => ({ item, children: [] }));

  return (
    <Root
      {...domProps}
      {...rootProps}
      ref={mergedRef}
      className={cx('tale-outline', safeClassName)}
      data-invalid={!canAct || undefined}
    >
      <OutlineList activeId={renderedActiveId} canAct={canAct} nodes={tree} onActivate={activate} />
    </Root>
  );
});
Outline.displayName = 'Outline';
