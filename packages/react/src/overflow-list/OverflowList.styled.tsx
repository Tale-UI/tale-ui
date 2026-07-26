import * as React from 'react';
import { useAnimationFrame } from '@tale-ui/utils/useAnimationFrame';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

export interface OverflowRenderContext {
  overflowControlRef: React.RefCallback<HTMLElement>;
}

export interface OverflowListProps<T> extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'tabIndex'>
> {
  /** Ordered collection to fit inside the root's inline content box. */
  items: readonly T[];
  /** Returns a stable primitive key for an item. Called once per collection generation. */
  getKey: (item: T) => React.Key;
  /** Renders one item. Called once per item per React render. */
  renderItem: (item: T) => React.ReactNode;
  /** Renders the single overflow control for the committed hidden partition. */
  renderOverflow: (hiddenItems: readonly T[], context: OverflowRenderContext) => React.ReactNode;
  /** Edge from which items collapse. @default 'end' */
  collapseFrom?: 'start' | 'end' | undefined;
  /** Minimum item count retained even when it overflows. @default 0 */
  minVisibleItems?: number | undefined;
  /** Stable primitive key used to invalidate cached measurements. */
  measurementKey?: React.Key | undefined;
  /** Called after a measurable partition settles. */
  onVisibilityChange?: (visibleItems: readonly T[], hiddenItems: readonly T[]) => void;
}

type RuntimeOverflowListProps<T> = OverflowListProps<T> & {
  collapseFrom?: unknown;
  dangerouslySetInnerHTML?: unknown;
  getKey?: unknown;
  items?: unknown;
  measurementKey?: unknown;
  minVisibleItems?: unknown;
  onVisibilityChange?: unknown;
  renderItem?: unknown;
  renderOverflow?: unknown;
  tabIndex?: unknown;
};

type PrimitiveKey = string | number | bigint;

interface Collection<T> {
  items: readonly T[];
  keys: readonly PrimitiveKey[];
  tokens: readonly string[];
}

interface Partition {
  generation: object;
  visibleCount: number;
}

interface FocusRecord {
  descendant: HTMLElement;
  generation: object;
  handoffTarget: HTMLElement;
  itemIndex: number;
  valid: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function normalizeKey(value: unknown): PrimitiveKey | null {
  if (typeof value === 'string' || typeof value === 'bigint') {
    return value;
  }
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function keyToken(value: PrimitiveKey): string {
  if (typeof value === 'string') {
    return `s:${value.length}:${value}`;
  }
  if (typeof value === 'bigint') {
    return `b:${value.toString()}`;
  }
  return `n:${Object.is(value, -0) ? '0' : value.toString()}`;
}

function createCollection<T>(
  items: readonly T[],
  getKey: (item: T) => React.Key,
): Collection<T> | null {
  const keys: PrimitiveKey[] = [];
  const tokens: string[] = [];
  const seen = new Set<string>();
  let valid = true;

  for (let index = 0; index < items.length; index += 1) {
    let value: unknown;
    try {
      value = getKey(items[index] as T);
    } catch {
      valid = false;
      continue;
    }
    const key = normalizeKey(value);
    if (key === null) {
      valid = false;
      continue;
    }
    const token = keyToken(key);
    if (seen.has(token)) {
      valid = false;
      continue;
    }
    seen.add(token);
    keys.push(key);
    tokens.push(token);
  }

  return valid ? { items, keys, tokens } : null;
}

function isValidMinimum(value: unknown, itemCount: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= itemCount;
}

function isSupportedMeasurementKey(value: unknown): boolean {
  return value === undefined || normalizeKey(value) !== null;
}

function parseLength(value: string): number {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function getContentInlineSize(element: HTMLElement): number {
  const styles = element.ownerDocument.defaultView?.getComputedStyle(element);
  if (!styles) {
    return 0;
  }
  const rect = element.getBoundingClientRect();
  const verticalWritingMode = styles.writingMode.startsWith('vertical');
  const borderBoxSize = verticalWritingMode ? rect.height : rect.width;
  const borderStart = verticalWritingMode
    ? parseLength(styles.borderTopWidth)
    : parseLength(styles.borderLeftWidth);
  const borderEnd = verticalWritingMode
    ? parseLength(styles.borderBottomWidth)
    : parseLength(styles.borderRightWidth);
  const paddingStart = verticalWritingMode
    ? parseLength(styles.paddingTop)
    : parseLength(styles.paddingLeft);
  const paddingEnd = verticalWritingMode
    ? parseLength(styles.paddingBottom)
    : parseLength(styles.paddingRight);
  return Math.max(0, borderBoxSize - borderStart - borderEnd - paddingStart - paddingEnd);
}

function getInlineBorderBoxSize(element: HTMLElement, root: HTMLElement): number {
  const styles = root.ownerDocument.defaultView?.getComputedStyle(root);
  const rect = element.getBoundingClientRect();
  return styles?.writingMode.startsWith('vertical') ? rect.height : rect.width;
}

function getInlineGap(element: HTMLElement): number {
  const styles = element.ownerDocument.defaultView?.getComputedStyle(element);
  if (!styles) {
    return 0;
  }
  return parseLength(styles.writingMode.startsWith('vertical') ? styles.rowGap : styles.columnGap);
}

function isIndexVisible(
  index: number,
  visibleCount: number,
  itemCount: number,
  from: 'start' | 'end',
) {
  return from === 'end' ? index < visibleCount : index >= itemCount - visibleCount;
}

function getPartitionItems<T>(
  items: readonly T[],
  visibleCount: number,
  from: 'start' | 'end',
): { visible: readonly T[]; hidden: readonly T[] } {
  const boundary = from === 'end' ? visibleCount : items.length - visibleCount;
  return from === 'end'
    ? { visible: items.slice(0, boundary), hidden: items.slice(boundary) }
    : { visible: items.slice(boundary), hidden: items.slice(0, boundary) };
}

function findFocusable(element: HTMLElement): HTMLElement | null {
  if (element.matches(FOCUSABLE_SELECTOR)) {
    return element;
  }
  return element.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
}

function isEnabledControl(element: HTMLElement | null): element is HTMLElement {
  if (
    !element ||
    element.getAttribute('aria-disabled') === 'true' ||
    element.hasAttribute('data-disabled')
  ) {
    return false;
  }
  try {
    return !element.matches(':disabled');
  } catch {
    return true;
  }
}

/**
 * A measured list that retains a deterministic visible partition and renders one overflow control.
 *
 * @example
 * ```tsx
 * import { OverflowList } from '@tale-ui/react/overflow-list';
 *
 * <OverflowList
 *   items={actions}
 *   getKey={(action) => action.id}
 *   renderItem={(action) => <button>{action.label}</button>}
 *   renderOverflow={(hidden, { overflowControlRef }) => (
 *     <button ref={overflowControlRef}>More ({hidden.length})</button>
 *   )}
 * />
 * ```
 *
 * @status experimental
 */
function OverflowListInner<T>(
  runtimeProps: OverflowListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    collapseFrom: collapseFromProp = 'end',
    dangerouslySetInnerHTML: blockedDangerouslySetInnerHTML,
    getKey: getKeyProp,
    items: itemsProp,
    measurementKey,
    minVisibleItems: minVisibleItemsProp = 0,
    onVisibilityChange: onVisibilityChangeProp,
    renderItem: renderItemProp,
    renderOverflow: renderOverflowProp,
    tabIndex: blockedTabIndex,
    ...domProps
  } = runtimeProps as RuntimeOverflowListProps<T>;

  const items = Array.isArray(itemsProp) ? (itemsProp as readonly T[]) : null;
  const getKey = typeof getKeyProp === 'function' ? getKeyProp : null;
  const renderItem = typeof renderItemProp === 'function' ? renderItemProp : null;
  const renderOverflow = typeof renderOverflowProp === 'function' ? renderOverflowProp : null;
  const onVisibilityChange =
    typeof onVisibilityChangeProp === 'function' ? onVisibilityChangeProp : null;
  const collapseFrom = collapseFromProp === 'start' ? 'start' : 'end';

  const canRenderItems = items !== null && renderItem !== null;
  const collection = React.useMemo(
    () => (items && getKey && renderItem ? createCollection(items, getKey) : null),
    [getKey, items, renderItem],
  );
  const normalizedMeasurementKey = normalizeKey(measurementKey);
  const measurementToken =
    measurementKey === undefined
      ? 'undefined'
      : normalizedMeasurementKey === null
        ? 'invalid'
        : keyToken(normalizedMeasurementKey);
  const canMeasure =
    canRenderItems &&
    collection !== null &&
    renderOverflow !== null &&
    isValidMinimum(minVisibleItemsProp, items.length) &&
    isSupportedMeasurementKey(measurementKey);

  void blockedDangerouslySetInnerHTML;
  void blockedTabIndex;

  const generation = React.useMemo(
    () => ({
      collapseFrom,
      collection,
      measurementToken,
      minVisibleItemsProp,
      renderItem,
      renderOverflow,
    }),
    [collapseFrom, collection, measurementToken, minVisibleItemsProp, renderItem, renderOverflow],
  );
  const [partition, setPartition] = React.useState<Partition | null>(null);
  const visibleCount =
    canMeasure && partition?.generation === generation
      ? partition.visibleCount
      : (items?.length ?? 0);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs(rootRef, forwardedRef);
  const itemRefs = React.useRef<Array<HTMLElement | null>>([]);
  const itemWidthsRef = React.useRef<number[]>([]);
  const overflowControlElementRef = React.useRef<HTMLElement | null>(null);
  const frame = useAnimationFrame();
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const measurementGenerationRef = React.useRef(0);
  const cycleRef = React.useRef({ identities: new Set<string>(), passes: 0 });
  const settledRef = React.useRef(false);
  const publishedRef = React.useRef<{ generation: object; signature: string } | null>(null);
  const focusRecordRef = React.useRef<FocusRecord | null>(null);
  const isProgrammaticFocusRef = React.useRef(false);

  const overflowControlRef = useStableCallback((element: HTMLElement | null) => {
    overflowControlElementRef.current = element;
  });
  const overflowContext = React.useMemo<OverflowRenderContext>(
    () => ({ overflowControlRef }),
    [overflowControlRef],
  );

  const clearFocusRecord = useStableCallback(() => {
    focusRecordRef.current = null;
  });

  const focusWithoutInvalidating = useStableCallback((element: HTMLElement) => {
    isProgrammaticFocusRef.current = true;
    try {
      element.focus();
    } finally {
      isProgrammaticFocusRef.current = false;
    }
  });

  const prepareFocusHandoff = useStableCallback((nextVisibleCount: number) => {
    const root = rootRef.current;
    if (!root || !items || nextVisibleCount === visibleCount) {
      return;
    }
    const activeElement = root.ownerDocument.activeElement;
    const OwnerHTMLElement = root.ownerDocument.defaultView?.HTMLElement;
    if (!OwnerHTMLElement || !(activeElement instanceof OwnerHTMLElement)) {
      return;
    }
    let activeIndex = -1;
    for (let index = 0; index < itemRefs.current.length; index += 1) {
      const item = itemRefs.current[index];
      if (item?.contains(activeElement)) {
        activeIndex = index;
        break;
      }
    }
    if (
      activeIndex < 0 ||
      isIndexVisible(activeIndex, nextVisibleCount, items.length, collapseFrom)
    ) {
      return;
    }

    const control = overflowControlElementRef.current;
    let handoffTarget: HTMLElement | null = isEnabledControl(control) ? control : null;
    if (!handoffTarget) {
      const candidates = itemRefs.current
        .map((element, index) => ({ element, index }))
        .filter(
          (candidate): candidate is { element: HTMLElement; index: number } =>
            candidate.element !== null &&
            isIndexVisible(candidate.index, nextVisibleCount, items.length, collapseFrom),
        )
        .sort(
          (left, right) =>
            Math.abs(left.index - activeIndex) - Math.abs(right.index - activeIndex) ||
            left.index - right.index,
        );
      for (const candidate of candidates) {
        handoffTarget = findFocusable(candidate.element);
        if (handoffTarget) {
          break;
        }
      }
    }
    handoffTarget ??= root;
    focusRecordRef.current = {
      descendant: activeElement,
      generation,
      handoffTarget,
      itemIndex: activeIndex,
      valid: true,
    };
  });

  const publish = useStableCallback((settledVisibleCount: number) => {
    if (!items || !onVisibilityChange) {
      return;
    }
    const { visible, hidden } = getPartitionItems(items, settledVisibleCount, collapseFrom);
    const signature = `${collapseFrom}:${settledVisibleCount}`;
    if (
      publishedRef.current?.generation === generation &&
      publishedRef.current.signature === signature
    ) {
      return;
    }
    publishedRef.current = { generation, signature };
    settledRef.current = true;
    onVisibilityChange(visible, hidden);
  });

  const measure = useStableCallback(() => {
    const root = rootRef.current;
    if (!canMeasure || !collection || !items || !root || !root.isConnected) {
      if (items && visibleCount !== items.length) {
        prepareFocusHandoff(items.length);
        setPartition({ generation, visibleCount: items.length });
      }
      return;
    }

    const available = getContentInlineSize(root);
    if (available <= 0) {
      if (visibleCount !== items.length) {
        prepareFocusHandoff(items.length);
        setPartition({ generation, visibleCount: items.length });
      }
      return;
    }

    for (let index = 0; index < itemRefs.current.length; index += 1) {
      const element = itemRefs.current[index];
      if (element && !element.hidden) {
        itemWidthsRef.current[index] = getInlineBorderBoxSize(element, root);
      }
    }
    if (
      itemWidthsRef.current.length !== items.length ||
      itemWidthsRef.current.some((width) => !Number.isFinite(width))
    ) {
      return;
    }

    const gap = getInlineGap(root);
    const control = overflowControlElementRef.current;
    const measuredControlWidth =
      visibleCount < items.length && control ? getInlineBorderBoxSize(control, root) : 0;
    let nextVisibleCount = items.length;
    const minimum = minVisibleItemsProp as number;

    for (let candidate = items.length; candidate >= minimum; candidate -= 1) {
      let itemsWidth = 0;
      for (let index = 0; index < items.length; index += 1) {
        if (isIndexVisible(index, candidate, items.length, collapseFrom)) {
          itemsWidth += itemWidthsRef.current[index] ?? 0;
        }
      }
      const hasControl = candidate < items.length;
      const childCount = candidate + (hasControl ? 1 : 0);
      const required =
        itemsWidth + (hasControl ? measuredControlWidth : 0) + Math.max(0, childCount - 1) * gap;
      if (required <= available + 0.5 || candidate === minimum) {
        nextVisibleCount = candidate;
        break;
      }
    }

    const visibleTokens = collection.tokens.filter((_, index) =>
      isIndexVisible(index, nextVisibleCount, items.length, collapseFrom),
    );
    const roundedControlWidth = Math.round(measuredControlWidth);
    const cycleIdentity = `${visibleTokens.join('|')}@${roundedControlWidth}`;
    const cycle = cycleRef.current;
    const repeated = cycle.identities.has(cycleIdentity);
    cycle.identities.add(cycleIdentity);
    cycle.passes += 1;
    const exceeded = cycle.passes > 2 * (items.length + 1);

    if (nextVisibleCount !== visibleCount && !repeated && !exceeded) {
      settledRef.current = false;
      prepareFocusHandoff(nextVisibleCount);
      setPartition({ generation, visibleCount: nextVisibleCount });
      return;
    }

    settledRef.current = true;
    publish(visibleCount);
  });

  const scheduleMeasurement = useStableCallback(() => {
    const generationId = measurementGenerationRef.current;
    frame.request(() => {
      if (measurementGenerationRef.current === generationId) {
        measure();
      }
    });
  });

  useIsoLayoutEffect(() => {
    measurementGenerationRef.current += 1;
    cycleRef.current = { identities: new Set(), passes: 0 };
    settledRef.current = false;
    publishedRef.current = null;
    itemWidthsRef.current = [];
    overflowControlElementRef.current = null;
    clearFocusRecord();
    frame.cancel();
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;

    if (!canMeasure) {
      setPartition(null);
      return undefined;
    }

    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const ownerWindow = root.ownerDocument.defaultView;
    const Observer = ownerWindow?.ResizeObserver;
    if (Observer) {
      const observer = new Observer(() => {
        if (settledRef.current) {
          cycleRef.current = { identities: new Set(), passes: 0 };
          settledRef.current = false;
        }
        scheduleMeasurement();
      });
      observer.observe(root);
      resizeObserverRef.current = observer;
    }
    scheduleMeasurement();

    return () => {
      measurementGenerationRef.current += 1;
      frame.cancel();
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      clearFocusRecord();
    };
  }, [canMeasure, clearFocusRecord, frame, generation, scheduleMeasurement]);

  useIsoLayoutEffect(() => {
    if (canMeasure) {
      const root = rootRef.current;
      const observer = resizeObserverRef.current;
      if (root && observer) {
        observer.disconnect();
        observer.observe(root);
        for (const item of itemRefs.current) {
          if (item && !item.hidden) {
            observer.observe(item);
          }
        }
        if (overflowControlElementRef.current) {
          observer.observe(overflowControlElementRef.current);
        }
      }
      scheduleMeasurement();
    }
  }, [canMeasure, scheduleMeasurement, visibleCount]);

  useIsoLayoutEffect(() => {
    const record = focusRecordRef.current;
    const root = rootRef.current;
    if (!record || !root || record.generation !== generation || !items) {
      return undefined;
    }

    const onFocusIn = (event: FocusEvent) => {
      if (!isProgrammaticFocusRef.current && event.target !== record.handoffTarget) {
        record.valid = false;
      }
    };
    root.ownerDocument.addEventListener('focusin', onFocusIn, true);

    const isVisible = isIndexVisible(record.itemIndex, visibleCount, items.length, collapseFrom);
    if (isVisible && record.valid && record.descendant.isConnected) {
      focusWithoutInvalidating(record.descendant);
      clearFocusRecord();
      return () => root.ownerDocument.removeEventListener('focusin', onFocusIn, true);
    }
    if (!isVisible && record.valid) {
      const currentControl = overflowControlElementRef.current;
      if (isEnabledControl(currentControl)) {
        record.handoffTarget = currentControl;
      }
      focusWithoutInvalidating(record.handoffTarget);
    }

    return () => root.ownerDocument.removeEventListener('focusin', onFocusIn, true);
  }, [clearFocusRecord, collapseFrom, focusWithoutInvalidating, generation, items, visibleCount]);

  const renderedItems =
    canRenderItems && items
      ? items.map((item) => (renderItem as (item: T) => React.ReactNode)(item))
      : [];
  const partitionItems =
    items && canMeasure
      ? getPartitionItems(items, visibleCount, collapseFrom)
      : { visible: items ?? [], hidden: [] };
  const overflowNode =
    canMeasure && partitionItems.hidden.length > 0
      ? renderOverflow(partitionItems.hidden, overflowContext)
      : null;
  const safeClassName = typeof className === 'string' ? className : undefined;

  return (
    <div
      {...domProps}
      ref={mergedRef}
      className={cx('tale-overflow-list', safeClassName)}
      data-collapse-from={collapseFrom}
      data-invalid={!canMeasure && canRenderItems ? '' : undefined}
      tabIndex={-1}
    >
      {collapseFrom === 'start' && overflowNode !== null ? (
        <div className="tale-overflow-list__overflow">{overflowNode}</div>
      ) : null}
      {renderedItems.map((node, index) => {
        const hidden =
          canMeasure && !isIndexVisible(index, visibleCount, renderedItems.length, collapseFrom);
        return (
          <div
            key={collection?.tokens[index] ?? index}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="tale-overflow-list__item"
            data-overflow-hidden={hidden || undefined}
            hidden={hidden}
          >
            {node}
          </div>
        );
      })}
      {collapseFrom === 'end' && overflowNode !== null ? (
        <div className="tale-overflow-list__overflow">{overflowNode}</div>
      ) : null}
    </div>
  );
}

const OverflowListForwardRef = React.forwardRef(OverflowListInner);
OverflowListForwardRef.displayName = 'OverflowList';

export const OverflowList = OverflowListForwardRef as <T>(
  props: OverflowListProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;
