'use client';
import * as React from 'react';
import { useMove, type MoveMoveEvent } from 'react-aria';
import { useId } from '@tale-ui/utils/useId';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import { warn } from '@tale-ui/utils/warn';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

type OwnedActionTargetProp =
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onKeyPress'
  | 'onClick'
  | 'onAuxClick'
  | 'onContextMenu'
  | 'onDoubleClick'
  | 'onMouseDown'
  | 'onMouseMove'
  | 'onMouseUp'
  | 'onMouseOver'
  | 'onMouseOut'
  | 'onTouchStart'
  | 'onTouchMove'
  | 'onTouchEnd'
  | 'onTouchCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onPointerOver'
  | 'onPointerOut'
  | 'onGotPointerCapture'
  | 'onLostPointerCapture'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop';

type OwnedActionCaptureProp = `${OwnedActionTargetProp}Capture`;
type OwnedActionDomProp = OwnedActionTargetProp | OwnedActionCaptureProp;

export type ResizablePanelId = string;
export type ResizableSizes = Readonly<Record<ResizablePanelId, number>>;

export interface ResizableChangeMeta {
  handleId: string;
  source: 'pointer' | 'keyboard';
}

type ResizableSizeState =
  | { sizes: ResizableSizes; defaultSizes?: never }
  | { sizes?: never; defaultSizes?: ResizableSizes };

interface ResizableRootBaseProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | OwnedActionCaptureProp>
> {
  orientation?: 'horizontal' | 'vertical';
  onSizesChange?: (sizes: ResizableSizes, meta: ResizableChangeMeta) => void;
  onSizesCommit?: (sizes: ResizableSizes, meta: ResizableChangeMeta) => void;
  keyboardStep?: number;
  keyboardLargeStep?: number;
  precision?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  children: React.ReactNode;
}

export type ResizableRootProps = ResizableRootBaseProps & ResizableSizeState;

export interface ResizablePanelProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'id'>
> {
  id: ResizablePanelId;
  minSize?: number;
  maxSize?: number;
  children?: React.ReactNode;
}

type ResizableHandleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type ResizableOwnedHandleProp =
  | OwnedActionDomProp
  | 'role'
  | 'tabIndex'
  | 'draggable'
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-orientation'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext';

export type ResizableHandleProps = SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, ResizableOwnedHandleProp>
> &
  ResizableHandleName & {
    id: string;
    before: ResizablePanelId;
    after: ResizablePanelId;
    isDisabled?: boolean;
  };

type RuntimeRootProps = ResizableRootProps & Record<string, unknown>;
type RuntimePanelProps = ResizablePanelProps & Record<string, unknown>;
type RuntimeHandleProps = ResizableHandleProps & Record<string, unknown>;
type SizeMode = 'controlled' | 'uncontrolled';

interface PanelRecord {
  id: string;
  min: number;
  max: number;
  domId: string;
}

interface HandleRecord {
  id: string;
  before: string;
  after: string;
  beforeIndex: number;
  afterIndex: number;
  domId: string;
}

interface Topology {
  panels: PanelRecord[];
  panelById: Map<string, PanelRecord>;
  handles: HandleRecord[];
  handleById: Map<string, HandleRecord>;
  signature: string;
  boundsSignature: string;
}

interface RootConfiguration {
  orientation: 'horizontal' | 'vertical';
  keyboardStep: number;
  keyboardLargeStep: number;
  precision: number;
  isDisabled: boolean;
  isReadOnly: boolean;
}

interface Gesture {
  handleId: string;
  source: 'pointer' | 'keyboard';
  changed: boolean;
  lastProposal: ResizableSizes | null;
  pointerId: number | null;
  captureElement: HTMLDivElement | null;
  rootPixels: number;
  direction: 1 | -1;
  topologySignature: string;
}

interface PanelView {
  domId: string;
  size: number | undefined;
  valid: boolean;
}

interface HandleView {
  beforeDomId: string | undefined;
  afterDomId: string | undefined;
  disabled: boolean;
  domId: string | undefined;
  lower: number | undefined;
  orientation: 'horizontal' | 'vertical';
  upper: number | undefined;
  valid: boolean;
  value: number | undefined;
  valueText: string | undefined;
}

interface ResizableContextValue {
  acquirePointer: (handleId: string, element: HTMLDivElement, pointerId: number | null) => boolean;
  bubble: (name: OwnedActionTargetProp, event: React.SyntheticEvent<HTMLDivElement>) => void;
  cancel: (handleId?: string) => void;
  end: (handleId: string, source: 'pointer' | 'keyboard') => void;
  getHandle: (id: string, before: string, after: string, disabled: boolean) => HandleView;
  getPanel: (id: string) => PanelView;
  keyboardCommand: (handleId: string, command: 'home' | 'end' | 'page-up' | 'page-down') => void;
  move: (handleId: string, event: MoveMoveEvent) => void;
  start: (handleId: string, source: 'pointer' | 'keyboard') => boolean;
}

const ResizableContext = React.createContext<ResizableContextValue | null>(null);
const ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;
const ACTION_TARGET_PROPS = new Set<string>([
  'onKeyDown',
  'onKeyUp',
  'onKeyPress',
  'onClick',
  'onAuxClick',
  'onContextMenu',
  'onDoubleClick',
  'onMouseDown',
  'onMouseMove',
  'onMouseUp',
  'onMouseOver',
  'onMouseOut',
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onTouchCancel',
  'onPointerDown',
  'onPointerMove',
  'onPointerUp',
  'onPointerCancel',
  'onPointerOver',
  'onPointerOut',
  'onGotPointerCapture',
  'onLostPointerCapture',
  'onDrag',
  'onDragStart',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDrop',
]);
const ACTION_CAPTURE_PROPS = new Set(
  [...ACTION_TARGET_PROPS].map((property) => `${property}Capture`),
);
const HANDLE_OWNED_PROPS = new Set<string>([
  ...ACTION_TARGET_PROPS,
  ...ACTION_CAPTURE_PROPS,
  'role',
  'tabIndex',
  'draggable',
  'aria-controls',
  'aria-disabled',
  'aria-orientation',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
]);

function isValidId(value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function roundTo(value: number, precision: number): number {
  const scale = 10 ** precision;
  const rounded = Math.round((value + Number.EPSILON) * scale) / scale;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function toleranceFor(precision: number): number {
  return 10 ** -precision;
}

function immutableSizes(values: Record<string, number>, panels: readonly PanelRecord[]) {
  const ordered: Record<string, number> = {};
  for (const panel of panels) {
    ordered[panel.id] = values[panel.id]!;
  }
  return Object.freeze(ordered);
}

function normalizeResidual(
  values: Record<string, number>,
  panels: readonly PanelRecord[],
  precision: number,
): ResizableSizes | null {
  const normalized: Record<string, number> = {};
  for (const panel of panels) {
    const value = roundTo(values[panel.id]!, precision);
    if (
      value < panel.min - toleranceFor(precision) ||
      value > panel.max + toleranceFor(precision)
    ) {
      return null;
    }
    normalized[panel.id] = Math.min(panel.max, Math.max(panel.min, value));
  }

  let residual = roundTo(
    100 - panels.reduce((sum, panel) => sum + normalized[panel.id]!, 0),
    precision,
  );
  if (residual !== 0) {
    const panel = panels.find((candidate) =>
      residual > 0
        ? candidate.max - normalized[candidate.id]! >= residual - toleranceFor(precision)
        : normalized[candidate.id]! - candidate.min >= -residual - toleranceFor(precision),
    );
    if (!panel) {
      return null;
    }
    normalized[panel.id] = roundTo(normalized[panel.id]! + residual, precision);
    residual = roundTo(
      100 - panels.reduce((sum, candidate) => sum + normalized[candidate.id]!, 0),
      precision,
    );
  }

  return Math.abs(residual) <= toleranceFor(precision) ? immutableSizes(normalized, panels) : null;
}

function projectSizes(
  panels: readonly PanelRecord[],
  seeds: Readonly<Record<string, number>>,
  precision: number,
): ResizableSizes | null {
  const values: Record<string, number> = {};
  for (const panel of panels) {
    const seed = isFiniteNumber(seeds[panel.id]) ? seeds[panel.id]! : panel.min;
    values[panel.id] = Math.min(panel.max, Math.max(panel.min, seed));
  }

  for (let pass = 0; pass <= panels.length; pass += 1) {
    const total = panels.reduce((sum, panel) => sum + values[panel.id]!, 0);
    const delta = 100 - total;
    if (Math.abs(delta) <= toleranceFor(precision) / 2) {
      break;
    }

    const candidates = panels.filter((panel) =>
      delta > 0
        ? values[panel.id]! < panel.max - toleranceFor(precision) / 2
        : values[panel.id]! > panel.min + toleranceFor(precision) / 2,
    );
    if (candidates.length === 0) {
      return null;
    }

    const share = delta / candidates.length;
    let changed = false;
    for (const panel of candidates) {
      const current = values[panel.id]!;
      const next =
        delta > 0 ? Math.min(panel.max, current + share) : Math.max(panel.min, current + share);
      values[panel.id] = next;
      changed ||= next !== current;
    }
    if (!changed) {
      return null;
    }
  }

  return normalizeResidual(values, panels, precision);
}

function normalizeSizeRecord(
  value: unknown,
  panels: readonly PanelRecord[],
  precision: number,
): ResizableSizes | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  let keys: string[];
  const values: Record<string, number> = {};
  try {
    keys = Object.keys(value);
    if (
      keys.length !== panels.length ||
      keys.some((key) => !panels.some((panel) => panel.id === key))
    ) {
      return null;
    }
    for (const panel of panels) {
      const candidate = (value as Record<string, unknown>)[panel.id];
      if (!isFiniteNumber(candidate) || candidate < panel.min || candidate > panel.max) {
        return null;
      }
      values[panel.id] = candidate;
    }
  } catch {
    return null;
  }

  const sum = panels.reduce((total, panel) => total + values[panel.id]!, 0);
  if (Math.abs(sum - 100) > toleranceFor(precision)) {
    return null;
  }
  return normalizeResidual(values, panels, precision);
}

function sizesEqual(
  left: ResizableSizes | null,
  right: ResizableSizes | null,
  panels: readonly PanelRecord[],
  precision: number,
): boolean {
  return (
    left !== null &&
    right !== null &&
    panels.every(
      (panel) => roundTo(left[panel.id]!, precision) === roundTo(right[panel.id]!, precision),
    )
  );
}

function stripOwnedProps(
  input: Record<string, unknown>,
  owned: ReadonlySet<string>,
): { props: Record<string, unknown>; stripped: boolean } {
  const props: Record<string, unknown> = {};
  let stripped = false;
  for (const [key, value] of Object.entries(input)) {
    if (key === 'dangerouslySetInnerHTML' || owned.has(key)) {
      stripped ||= value !== undefined;
    } else {
      props[key] = value;
    }
  }
  return { props, stripped };
}

function flattenChildren(children: React.ReactNode): React.ReactNode[] | null {
  const output: React.ReactNode[] = [];
  try {
    React.Children.forEach(children, (child) => {
      if (child === null || child === undefined || typeof child === 'boolean') {
        return;
      }
      if (React.isValidElement(child) && child.type === React.Fragment) {
        const nested = flattenChildren((child.props as { children?: React.ReactNode }).children);
        if (nested === null) {
          throw new Error('Invalid fragment');
        }
        output.push(...nested);
      } else {
        output.push(child);
      }
    });
  } catch {
    return null;
  }
  return output;
}

function validateRootConfiguration(
  orientation: unknown,
  keyboardStep: unknown,
  keyboardLargeStep: unknown,
  precision: unknown,
  isDisabled: unknown,
  isReadOnly: unknown,
): RootConfiguration | null {
  const normalizedOrientation = orientation === undefined ? 'horizontal' : orientation;
  const normalizedStep = keyboardStep === undefined ? 1 : keyboardStep;
  const normalizedLargeStep = keyboardLargeStep === undefined ? 10 : keyboardLargeStep;
  const normalizedPrecision = precision === undefined ? 4 : precision;
  const normalizedDisabled = isDisabled === undefined ? false : isDisabled;
  const normalizedReadOnly = isReadOnly === undefined ? false : isReadOnly;

  if (
    (normalizedOrientation !== 'horizontal' && normalizedOrientation !== 'vertical') ||
    !isFiniteNumber(normalizedStep) ||
    normalizedStep <= 0 ||
    !isFiniteNumber(normalizedLargeStep) ||
    normalizedLargeStep <= 0 ||
    !isFiniteNumber(normalizedPrecision) ||
    !Number.isInteger(normalizedPrecision) ||
    normalizedPrecision < 0 ||
    normalizedPrecision > 10 ||
    typeof normalizedDisabled !== 'boolean' ||
    typeof normalizedReadOnly !== 'boolean'
  ) {
    return null;
  }

  return {
    orientation: normalizedOrientation,
    keyboardStep: normalizedStep,
    keyboardLargeStep: normalizedLargeStep,
    precision: normalizedPrecision,
    isDisabled: normalizedDisabled,
    isReadOnly: normalizedReadOnly,
  };
}

function parseTopology(
  children: React.ReactNode,
  rootId: string,
): {
  content: React.ReactNode[];
  topology: Topology | null;
} {
  const content = flattenChildren(children);
  if (content === null) {
    return { content: [], topology: null };
  }

  const panels: PanelRecord[] = [];
  const handles: HandleRecord[] = [];
  const panelIds = new Set<string>();
  const handleIds = new Set<string>();
  let valid = content.length > 0 && content.length % 2 === 1;

  for (let index = 0; index < content.length; index += 1) {
    const child = content[index];
    if (!React.isValidElement(child)) {
      valid = false;
      continue;
    }

    try {
      if (index % 2 === 0 && child.type === Panel) {
        const props = child.props as RuntimePanelProps;
        const min = props.minSize === undefined ? 0 : props.minSize;
        const max = props.maxSize === undefined ? 100 : props.maxSize;
        if (
          !isValidId(props.id) ||
          panelIds.has(props.id) ||
          handleIds.has(props.id) ||
          !isFiniteNumber(min) ||
          !isFiniteNumber(max) ||
          min < 0 ||
          max > 100 ||
          min > max
        ) {
          valid = false;
          continue;
        }
        panelIds.add(props.id);
        panels.push({
          id: props.id,
          min,
          max,
          domId: `${rootId}-panel-${panels.length}`,
        });
      } else if (index % 2 === 1 && child.type === Handle) {
        const props = child.props as RuntimeHandleProps;
        const hasName =
          (typeof props['aria-label'] === 'string' &&
            props['aria-label'].trim().length > 0 &&
            props['aria-labelledby'] === undefined) ||
          (props['aria-label'] === undefined &&
            typeof props['aria-labelledby'] === 'string' &&
            props['aria-labelledby'].trim().length > 0);
        if (
          !isValidId(props.id) ||
          !isValidId(props.before) ||
          !isValidId(props.after) ||
          (props.isDisabled !== undefined && typeof props.isDisabled !== 'boolean') ||
          handleIds.has(props.id) ||
          panelIds.has(props.id) ||
          !hasName
        ) {
          valid = false;
          continue;
        }
        handleIds.add(props.id);
        handles.push({
          id: props.id,
          before: props.before,
          after: props.after,
          beforeIndex: index - 1,
          afterIndex: index + 1,
          domId: `${rootId}-handle-${handles.length}`,
        });
      } else {
        valid = false;
      }
    } catch {
      valid = false;
    }
  }

  if (valid && (panels.length !== handles.length + 1 || panels.length === 0)) {
    valid = false;
  }

  if (valid) {
    for (let index = 0; index < handles.length; index += 1) {
      const handle = handles[index]!;
      if (
        handle.before !== panels[index]!.id ||
        handle.after !== panels[index + 1]!.id ||
        panelIds.has(handle.id)
      ) {
        valid = false;
        break;
      }
    }
  }

  if (valid) {
    const minimum = panels.reduce((sum, panel) => sum + panel.min, 0);
    const maximum = panels.reduce((sum, panel) => sum + panel.max, 0);
    valid = minimum <= 100 && maximum >= 100;
  }

  if (!valid) {
    return { content, topology: null };
  }

  const panelById = new Map(panels.map((panel) => [panel.id, panel]));
  const handleById = new Map(handles.map((handle) => [handle.id, handle]));
  return {
    content,
    topology: {
      panels,
      panelById,
      handles,
      handleById,
      signature: JSON.stringify([
        panels.map(({ id, min, max }) => [id, min, max]),
        handles.map(({ id, before, after }) => [id, before, after]),
      ]),
      boundsSignature: JSON.stringify(panels.map(({ id, min, max }) => [id, min, max])),
    },
  };
}

function releaseCapture(gesture: Gesture | null) {
  if (
    gesture?.captureElement &&
    gesture.pointerId !== null &&
    typeof gesture.captureElement.releasePointerCapture === 'function'
  ) {
    try {
      if (
        typeof gesture.captureElement.hasPointerCapture !== 'function' ||
        gesture.captureElement.hasPointerCapture(gesture.pointerId)
      ) {
        gesture.captureElement.releasePointerCapture(gesture.pointerId);
      }
    } catch {
      // Capture may already have been released by the user agent.
    }
  }
}

function pairBounds(
  topology: Topology,
  handle: HandleRecord,
  sizes: ResizableSizes,
): { lower: number; upper: number; total: number } {
  const before = topology.panelById.get(handle.before)!;
  const after = topology.panelById.get(handle.after)!;
  const total = sizes[before.id]! + sizes[after.id]!;
  return {
    lower: Math.max(before.min, total - after.max),
    upper: Math.min(before.max, total - after.min),
    total,
  };
}

function updatePair(
  topology: Topology,
  handle: HandleRecord,
  sizes: ResizableSizes,
  nextBefore: number,
  precision: number,
): ResizableSizes {
  const { lower, upper, total } = pairBounds(topology, handle, sizes);
  const before = roundTo(Math.min(upper, Math.max(lower, nextBefore)), precision);
  const values = {
    ...sizes,
    [handle.before]: before,
    [handle.after]: roundTo(total - before, precision),
  };
  return immutableSizes(values, topology.panels);
}

function rootDirection(element: HTMLDivElement): 1 | -1 {
  try {
    return element.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl'
      ? -1
      : 1;
  } catch {
    return 1;
  }
}

/* ─── Panel ───────────────────────────────────────────────────────────────── */

/** A flex-sized region owned by the nearest Resizable Root. @status experimental */
export const Panel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (inputProps, forwardedRef) => {
    const { props, stripped } = stripOwnedProps(inputProps as RuntimePanelProps, new Set());
    const { id, minSize, maxSize, className, style, ...domProps } = props as RuntimePanelProps;
    void minSize;
    void maxSize;
    const context = React.useContext(ResizableContext);
    const view = context?.getPanel(typeof id === 'string' ? id : '') ?? {
      domId: '',
      size: undefined,
      valid: false,
    };
    const warnedRef = React.useRef(false);
    if (stripped && !warnedRef.current) {
      warnedRef.current = true;
      warn('RESIZABLE_DANGEROUS_HTML_OMITTED');
    } else if (!stripped) {
      warnedRef.current = false;
    }

    const ownedStyle = view.valid
      ? {
          ...(style as React.CSSProperties | undefined),
          flexBasis: `${view.size}%`,
          flexGrow: 0,
          flexShrink: 0,
        }
      : (style as React.CSSProperties | undefined);

    return (
      <div
        {...domProps}
        ref={forwardedRef}
        id={view.valid ? view.domId : undefined}
        className={cx(
          'tale-resizable__panel',
          typeof className === 'string' ? className : undefined,
        )}
        style={ownedStyle}
        data-panel-id={isValidId(id) ? id : undefined}
        data-invalid={!view.valid || undefined}
      />
    );
  },
);
Panel.displayName = 'Resizable.Panel';

/* ─── Handle ──────────────────────────────────────────────────────────────── */

/** An accessible separator controlling its exact adjacent Panels. @status experimental */
export const Handle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  (inputProps, forwardedRef) => {
    const { props, stripped } = stripOwnedProps(
      inputProps as RuntimeHandleProps,
      HANDLE_OWNED_PROPS,
    );
    const {
      id,
      before,
      after,
      isDisabled = false,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...domProps
    } = props as RuntimeHandleProps;
    const context = React.useContext(ResizableContext);
    const handleId = typeof id === 'string' ? id : '';
    const view = context?.getHandle(
      handleId,
      typeof before === 'string' ? before : '',
      typeof after === 'string' ? after : '',
      isDisabled === true,
    ) ?? {
      beforeDomId: undefined,
      afterDomId: undefined,
      disabled: true,
      domId: undefined,
      lower: undefined,
      orientation: 'horizontal' as const,
      upper: undefined,
      valid: false,
      value: undefined,
      valueText: undefined,
    };
    const localRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(localRef, forwardedRef);
    const warnedRef = React.useRef(false);
    if (stripped && !warnedRef.current) {
      warnedRef.current = true;
      warn('RESIZABLE_OWNED_HANDLER_OMITTED');
    } else if (!stripped) {
      warnedRef.current = false;
    }

    const { moveProps } = useMove({
      onMoveStart(event) {
        context?.start(handleId, event.pointerType === 'keyboard' ? 'keyboard' : 'pointer');
      },
      onMove(event) {
        context?.move(handleId, event);
      },
      onMoveEnd(event) {
        context?.end(handleId, event.pointerType === 'keyboard' ? 'keyboard' : 'pointer');
      },
    });

    const pointerDown = moveProps.onPointerDown;
    const mouseDown = moveProps.onMouseDown;
    const moveKeyDown = moveProps.onKeyDown;
    const interactive = view.valid && !view.disabled;

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
      if (
        !interactive ||
        event.button !== 0 ||
        !context?.acquirePointer(handleId, event.currentTarget, event.pointerId)
      ) {
        return;
      }
      pointerDown?.(event);
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Global useMove listeners remain the movement authority.
      }
      context.bubble('onPointerDown', event);
    };

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
      if (
        !interactive ||
        event.button !== 0 ||
        !context?.acquirePointer(handleId, event.currentTarget, null)
      ) {
        return;
      }
      mouseDown?.(event);
      context.bubble('onMouseDown', event);
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (!interactive) {
        return;
      }
      if (
        event.key === 'Home' ||
        event.key === 'End' ||
        event.key === 'PageUp' ||
        event.key === 'PageDown'
      ) {
        event.preventDefault();
        event.stopPropagation();
        context?.keyboardCommand(
          handleId,
          event.key === 'Home'
            ? 'home'
            : event.key === 'End'
              ? 'end'
              : event.key === 'PageUp'
                ? 'page-up'
                : 'page-down',
        );
        context?.bubble('onKeyDown', event);
        return;
      }
      moveKeyDown?.(event);
      context?.bubble('onKeyDown', event);
    };

    // A separator is interactive when Tale supplies its owned keyboard and pointer handlers.
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    const element = (
      <div
        {...domProps}
        {...moveProps}
        ref={mergedRef}
        id={view.domId}
        role="separator"
        tabIndex={interactive ? 0 : -1}
        draggable={false}
        aria-label={typeof ariaLabel === 'string' ? ariaLabel : undefined}
        aria-labelledby={typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined}
        aria-controls={
          view.beforeDomId && view.afterDomId ? `${view.beforeDomId} ${view.afterDomId}` : undefined
        }
        aria-disabled={view.disabled || !view.valid || undefined}
        aria-orientation={view.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuemin={view.lower}
        aria-valuemax={view.upper}
        aria-valuenow={view.value}
        aria-valuetext={view.valueText}
        className={cx(
          'tale-resizable__handle',
          typeof className === 'string' ? className : undefined,
        )}
        data-disabled={view.disabled || undefined}
        data-handle-id={isValidId(id) ? id : undefined}
        data-invalid={!view.valid || undefined}
        onPointerDown={onPointerDown}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onPointerCancel={() => context?.cancel(handleId)}
        onLostPointerCapture={() => context?.cancel(handleId)}
      />
    );
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    return element;
  },
);
Handle.displayName = 'Resizable.Handle';

/* ─── Root ────────────────────────────────────────────────────────────────── */

/**
 * A deterministic, accessible panel-resizing state model powered by React Aria `useMove`.
 *
 * @example
 * ```tsx
 * import { Resizable } from '@tale-ui/react/resizable';
 *
 * <Resizable.Root defaultSizes={{navigation: 30, content: 70}}>
 *   <Resizable.Panel id="navigation" minSize={20}>Navigation</Resizable.Panel>
 *   <Resizable.Handle id="navigation-content" before="navigation" after="content" aria-label="Resize navigation" />
 *   <Resizable.Panel id="content" minSize={40}>Content</Resizable.Panel>
 * </Resizable.Root>
 * ```
 *
 * @status experimental
 */
export const Root = React.forwardRef<HTMLDivElement, ResizableRootProps>(
  (inputProps, forwardedRef) => {
    const { props: safeProps, stripped } = stripOwnedProps(
      inputProps as RuntimeRootProps,
      ACTION_CAPTURE_PROPS,
    );
    const {
      children,
      sizes: sizesInput,
      defaultSizes: defaultSizesInput,
      orientation,
      keyboardStep,
      keyboardLargeStep,
      precision,
      isDisabled,
      isReadOnly,
      onSizesChange,
      onSizesCommit,
      className,
      ...domProps
    } = safeProps as RuntimeRootProps;
    const generatedId = useId(undefined, 'tale-resizable') ?? 'tale-resizable-ssr';
    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(rootRef, forwardedRef);
    const { content, topology } = parseTopology(
      children,
      generatedId.replace(/[^A-Za-z0-9_-]/g, ''),
    );
    const configuration = validateRootConfiguration(
      orientation,
      keyboardStep,
      keyboardLargeStep,
      precision,
      isDisabled,
      isReadOnly,
    );
    const callbacksValid =
      (onSizesChange === undefined || typeof onSizesChange === 'function') &&
      (onSizesCommit === undefined || typeof onSizesCommit === 'function');
    const modeRef = React.useRef<SizeMode | undefined>(undefined);
    const hasControlled = sizesInput !== undefined;
    const hasDefault = defaultSizesInput !== undefined;
    const candidateMode: SizeMode = hasControlled ? 'controlled' : 'uncontrolled';
    const modeShapeValid = !(hasControlled && hasDefault);
    const modeMatches = modeRef.current === undefined || modeRef.current === candidateMode;
    const normalizedControlled =
      topology && configuration
        ? normalizeSizeRecord(sizesInput, topology.panels, configuration.precision)
        : null;
    const normalizedDefault =
      topology && configuration && hasDefault && modeRef.current !== 'uncontrolled'
        ? normalizeSizeRecord(defaultSizesInput, topology.panels, configuration.precision)
        : null;
    const initialUncontrolled =
      topology && configuration
        ? hasDefault
          ? normalizedDefault
          : projectSizes(topology.panels, {}, configuration.precision)
        : null;
    const initialRef = React.useRef<ResizableSizes | null>(initialUncontrolled);
    const [uncontrolledSizes, setUncontrolledSizes] = React.useState<ResizableSizes | null>(
      initialRef.current,
    );
    const committedSizesRef = React.useRef<ResizableSizes | null>(initialRef.current);
    const committedTopologyRef = React.useRef<Topology | null>(topology);
    const gestureRef = React.useRef<Gesture | null>(null);
    const topologyValid = topology !== null;
    const rootConfigValid = configuration !== null && callbacksValid;
    const recordValid =
      candidateMode === 'controlled'
        ? normalizedControlled !== null
        : modeRef.current === 'uncontrolled' || !hasDefault || normalizedDefault !== null;
    const canEstablish =
      topologyValid && rootConfigValid && modeShapeValid && modeMatches && recordValid;
    const renderMode = modeRef.current ?? (canEstablish ? candidateMode : undefined);

    let projectedUncontrolled: ResizableSizes | null =
      topology && committedTopologyRef.current?.signature === topology.signature
        ? committedSizesRef.current
        : uncontrolledSizes;
    if (
      renderMode === 'uncontrolled' &&
      topology &&
      configuration &&
      committedTopologyRef.current?.signature !== topology.signature
    ) {
      const seeds: Record<string, number> = {};
      for (const panel of topology.panels) {
        seeds[panel.id] = committedSizesRef.current?.[panel.id] ?? panel.min;
      }
      projectedUncontrolled = projectSizes(topology.panels, seeds, configuration.precision);
    } else if (
      renderMode === 'uncontrolled' &&
      topology &&
      configuration &&
      projectedUncontrolled === null
    ) {
      projectedUncontrolled =
        modeRef.current === undefined && hasDefault
          ? normalizedDefault
          : projectSizes(topology.panels, {}, configuration.precision);
    }

    const stateValid =
      renderMode !== undefined &&
      topology !== null &&
      configuration !== null &&
      callbacksValid &&
      modeShapeValid &&
      modeMatches &&
      (renderMode === 'controlled'
        ? normalizedControlled !== null
        : projectedUncontrolled !== null);
    const renderedSizes =
      stateValid && topology && configuration
        ? renderMode === 'controlled'
          ? normalizedControlled
          : projectedUncontrolled
        : null;
    const latestRef = React.useRef({
      configuration,
      mode: renderMode,
      sizes: renderedSizes,
      topology,
      valid: stateValid,
    });
    latestRef.current = {
      configuration,
      mode: renderMode,
      sizes: renderedSizes,
      topology,
      valid: stateValid,
    };
    const onChangeStable = useStableCallback(
      typeof onSizesChange === 'function' ? onSizesChange : undefined,
    );
    const onCommitStable = useStableCallback(
      typeof onSizesCommit === 'function' ? onSizesCommit : undefined,
    );
    const warningRef = React.useRef({ stripped: false, invalid: false });
    if (stripped && !warningRef.current.stripped) {
      warn('RESIZABLE_OWNED_HANDLER_OMITTED');
    }
    if (!stateValid && !warningRef.current.invalid) {
      warn('RESIZABLE_INVALID_CONFIGURATION');
    }
    warningRef.current = { stripped, invalid: !stateValid };

    const cancel = useStableCallback((handleId?: string) => {
      const gesture = gestureRef.current;
      if (!gesture || (handleId !== undefined && gesture.handleId !== handleId)) {
        return;
      }
      gestureRef.current = null;
      releaseCapture(gesture);
    });

    useIsoLayoutEffect(() => {
      if (modeRef.current === undefined && canEstablish) {
        modeRef.current = candidateMode;
      }
      if (stateValid && topology && renderedSizes) {
        committedTopologyRef.current = topology;
        committedSizesRef.current = renderedSizes;
      }
    }, [canEstablish, candidateMode, renderMode, renderedSizes, stateValid, topology]);

    useIsoLayoutEffect(() => {
      const gesture = gestureRef.current;
      if (!gesture) {
        return;
      }
      const latest = latestRef.current;
      if (
        !latest.valid ||
        !latest.configuration ||
        !latest.sizes ||
        !latest.topology ||
        latest.configuration.isDisabled ||
        latest.configuration.isReadOnly ||
        !latest.topology.handleById.has(gesture.handleId) ||
        latest.topology.signature !== gesture.topologySignature ||
        (latest.mode === 'controlled' &&
          gesture.lastProposal !== null &&
          !sizesEqual(
            latest.sizes,
            gesture.lastProposal,
            latest.topology.panels,
            latest.configuration.precision,
          ))
      ) {
        cancel();
      }
    }, [
      cancel,
      configuration?.isDisabled,
      configuration?.isReadOnly,
      renderedSizes,
      stateValid,
      topology?.boundsSignature,
      topology?.signature,
    ]);

    React.useEffect(() => {
      const root = rootRef.current;
      const ownerWindow = root?.ownerDocument.defaultView;
      if (!ownerWindow) {
        return;
      }
      const onResize = () => cancel();
      ownerWindow.addEventListener('resize', onResize);
      return () => {
        ownerWindow.removeEventListener('resize', onResize);
        cancel();
      };
    }, [cancel]);

    const commitMutation = useStableCallback(
      (next: ResizableSizes, handleId: string, source: 'pointer' | 'keyboard', commit: boolean) => {
        const latest = latestRef.current;
        if (!latest.valid || !latest.topology || !latest.configuration || !latest.sizes) {
          return false;
        }
        if (
          sizesEqual(latest.sizes, next, latest.topology.panels, latest.configuration.precision)
        ) {
          return false;
        }

        if (latest.mode === 'uncontrolled') {
          committedSizesRef.current = next;
          latest.sizes = next;
          setUncontrolledSizes(next);
        }
        const meta = Object.freeze({ handleId, source });
        onChangeStable?.(next, meta);
        if (commit) {
          onCommitStable?.(next, meta);
        }
        return true;
      },
    );

    const start = useStableCallback((handleId: string, source: 'pointer' | 'keyboard') => {
      const latest = latestRef.current;
      if (
        !latest.valid ||
        !latest.configuration ||
        latest.configuration.isDisabled ||
        latest.configuration.isReadOnly ||
        !latest.topology?.handleById.has(handleId)
      ) {
        return false;
      }
      if (gestureRef.current) {
        return gestureRef.current.handleId === handleId && gestureRef.current.source === source;
      }
      gestureRef.current = {
        handleId,
        source,
        changed: false,
        lastProposal: null,
        pointerId: null,
        captureElement: null,
        rootPixels: 0,
        direction: 1,
        topologySignature: latest.topology.signature,
      };
      return true;
    });

    const acquirePointer = useStableCallback(
      (handleId: string, element: HTMLDivElement, pointerId: number | null) => {
        if (gestureRef.current) {
          return false;
        }
        if (!start(handleId, 'pointer')) {
          return false;
        }
        const root = rootRef.current;
        const latest = latestRef.current;
        if (!root || !latest.configuration) {
          cancel(handleId);
          return false;
        }
        const rect = root.getBoundingClientRect();
        const rootPixels =
          latest.configuration.orientation === 'horizontal' ? rect.width : rect.height;
        if (!Number.isFinite(rootPixels) || rootPixels <= 0) {
          cancel(handleId);
          return false;
        }
        const gesture = gestureRef.current!;
        gesture.pointerId = pointerId;
        gesture.captureElement = element;
        gesture.rootPixels = rootPixels;
        gesture.direction =
          latest.configuration.orientation === 'horizontal' ? rootDirection(root) : 1;
        return true;
      },
    );

    const bubble = useStableCallback(
      (name: OwnedActionTargetProp, event: React.SyntheticEvent<HTMLDivElement>) => {
        if (!event.isPropagationStopped()) {
          return;
        }
        const handler = (safeProps as Record<string, unknown>)[name];
        const root = rootRef.current;
        if (typeof handler !== 'function' || !root) {
          return;
        }
        const routedEvent = Object.create(event) as React.SyntheticEvent<HTMLDivElement>;
        Object.defineProperty(routedEvent, 'currentTarget', {
          configurable: true,
          value: root,
        });
        (handler as (routedEvent: React.SyntheticEvent<HTMLDivElement>) => void)(routedEvent);
      },
    );

    const applyDelta = useStableCallback(
      (handleId: string, source: 'pointer' | 'keyboard', amount: number) => {
        const latest = latestRef.current;
        const gesture = gestureRef.current;
        if (
          !gesture ||
          gesture.handleId !== handleId ||
          gesture.source !== source ||
          !latest.valid ||
          !latest.topology ||
          !latest.configuration ||
          !latest.sizes
        ) {
          return;
        }
        if (
          latest.mode === 'controlled' &&
          gesture.lastProposal !== null &&
          !sizesEqual(
            latest.sizes,
            gesture.lastProposal,
            latest.topology.panels,
            latest.configuration.precision,
          )
        ) {
          cancel(handleId);
          return;
        }

        const handle = latest.topology.handleById.get(handleId)!;
        const next = updatePair(
          latest.topology,
          handle,
          latest.sizes,
          latest.sizes[handle.before]! + amount,
          latest.configuration.precision,
        );
        if (commitMutation(next, handleId, source, source === 'keyboard')) {
          gesture.changed = true;
          gesture.lastProposal = next;
        }
      },
    );

    const move = useStableCallback((handleId: string, event: MoveMoveEvent) => {
      const gesture = gestureRef.current;
      const latest = latestRef.current;
      if (!gesture || !latest.configuration) {
        return;
      }
      if (event.pointerType === 'keyboard') {
        const raw = latest.configuration.orientation === 'horizontal' ? event.deltaX : event.deltaY;
        const sign = Math.sign(raw);
        if (sign !== 0) {
          const direction =
            latest.configuration.orientation === 'horizontal' ? rootDirection(rootRef.current!) : 1;
          applyDelta(
            handleId,
            'keyboard',
            sign *
              direction *
              (event.shiftKey
                ? latest.configuration.keyboardLargeStep
                : latest.configuration.keyboardStep),
          );
        }
      } else {
        const pixels =
          latest.configuration.orientation === 'horizontal' ? event.deltaX : event.deltaY;
        applyDelta(handleId, 'pointer', (pixels / gesture.rootPixels) * 100 * gesture.direction);
      }
    });

    const end = useStableCallback((handleId: string, source: 'pointer' | 'keyboard') => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.handleId !== handleId || gesture.source !== source) {
        return;
      }
      if (source === 'pointer' && gesture.changed && gesture.lastProposal) {
        const latest = latestRef.current;
        if (
          latest.valid &&
          latest.topology &&
          latest.configuration &&
          (latest.mode !== 'controlled' ||
            sizesEqual(
              latest.sizes,
              gesture.lastProposal,
              latest.topology.panels,
              latest.configuration.precision,
            ))
        ) {
          onCommitStable?.(
            gesture.lastProposal,
            Object.freeze({ handleId, source: 'pointer' as const }),
          );
        }
      }
      gestureRef.current = null;
      releaseCapture(gesture);
    });

    const keyboardCommand = useStableCallback(
      (handleId: string, command: 'home' | 'end' | 'page-up' | 'page-down') => {
        if (!start(handleId, 'keyboard')) {
          return;
        }
        const latest = latestRef.current;
        const handle = latest.topology?.handleById.get(handleId);
        if (!latest.configuration || !latest.topology || !latest.sizes || !handle) {
          cancel(handleId);
          return;
        }
        const bounds = pairBounds(latest.topology, handle, latest.sizes);
        const current = latest.sizes[handle.before]!;
        const target =
          command === 'home'
            ? bounds.lower
            : command === 'end'
              ? bounds.upper
              : current + (command === 'page-up' ? 1 : -1) * latest.configuration.keyboardLargeStep;
        applyDelta(handleId, 'keyboard', target - current);
        end(handleId, 'keyboard');
      },
    );

    const getPanel = React.useCallback((id: string): PanelView => {
      const latest = latestRef.current;
      const panel = latest.topology?.panelById.get(id);
      return {
        domId: panel?.domId ?? '',
        size: latest.valid && panel ? latest.sizes?.[id] : undefined,
        valid: Boolean(latest.valid && panel),
      };
    }, []);

    const getHandle = React.useCallback(
      (id: string, before: string, after: string, disabled: boolean): HandleView => {
        const latest = latestRef.current;
        const handle = latest.topology?.handleById.get(id);
        const valid = Boolean(
          latest.valid && handle && handle.before === before && handle.after === after,
        );
        if (!valid || !handle || !latest.topology || !latest.sizes || !latest.configuration) {
          return {
            beforeDomId: undefined,
            afterDomId: undefined,
            disabled: true,
            domId: handle?.domId,
            lower: undefined,
            orientation: latest.configuration?.orientation ?? 'horizontal',
            upper: undefined,
            valid: false,
            value: undefined,
            valueText: undefined,
          };
        }
        const bounds = pairBounds(latest.topology, handle, latest.sizes);
        const beforePanel = latest.topology.panelById.get(before)!;
        const afterPanel = latest.topology.panelById.get(after)!;
        const beforeValue = latest.sizes[before]!;
        const afterValue = latest.sizes[after]!;
        return {
          beforeDomId: beforePanel.domId,
          afterDomId: afterPanel.domId,
          disabled: disabled || latest.configuration.isDisabled || latest.configuration.isReadOnly,
          domId: handle.domId,
          lower: bounds.lower,
          orientation: latest.configuration.orientation,
          upper: bounds.upper,
          valid: true,
          value: beforeValue,
          valueText: `${beforeValue}% / ${afterValue}%`,
        };
      },
      [],
    );

    const context: ResizableContextValue = {
      acquirePointer,
      bubble,
      cancel,
      end,
      getHandle,
      getPanel,
      keyboardCommand,
      move,
      start,
    };

    return (
      <ResizableContext.Provider value={context}>
        <div
          {...domProps}
          ref={mergedRef}
          className={cx(
            `tale-resizable tale-resizable--${configuration?.orientation ?? 'horizontal'}`,
            typeof className === 'string' ? className : undefined,
          )}
          data-disabled={configuration?.isDisabled || undefined}
          data-invalid={!stateValid || undefined}
          data-orientation={configuration?.orientation}
          data-readonly={configuration?.isReadOnly || undefined}
        >
          {content}
        </div>
      </ResizableContext.Provider>
    );
  },
);
Root.displayName = 'Resizable.Root';
