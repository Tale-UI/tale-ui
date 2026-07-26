'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnimationFrame } from '@tale-ui/utils/useAnimationFrame';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { Button, type ButtonProps } from '../button';
import {
  Dialog,
  type DialogBackdropProps,
  type DialogCloseProps,
  type DialogPopupProps,
} from '../dialog';
import { Icon } from '../icon';
import { useTaleI18n } from '../i18n-provider';
import { cx } from '../_cx';
import { useSwipeDismiss, type SwipeDirection } from '../utils/useSwipeDismiss';

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

export interface LightboxRenderContext {
  key: React.Key;
  index: number;
  count: number;
}

type LightboxOpenState =
  | {
      isOpen: boolean;
      defaultOpen?: never;
      onOpenChange?: ((open: boolean) => void) | undefined;
    }
  | {
      isOpen?: never;
      defaultOpen?: boolean | undefined;
      onOpenChange?: ((open: boolean) => void) | undefined;
    };

type LightboxSelectionState<T> =
  | {
      selectedKey: React.Key | null;
      defaultSelectedKey?: never;
      onSelectionChange?: ((key: React.Key | null, item: T | null) => void) | undefined;
    }
  | {
      selectedKey?: never;
      defaultSelectedKey?: React.Key | null | undefined;
      onSelectionChange?: ((key: React.Key | null, item: T | null) => void) | undefined;
    };

interface LightboxRootBaseProps<T> extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | OwnedActionCaptureProp>
> {
  items: readonly T[];
  getKey: (item: T) => React.Key;
  getLabel: (item: T) => string;
  renderContent: (item: T, context: LightboxRenderContext) => React.ReactNode;
  loop?: boolean | undefined;
  swipeNavigation?: boolean | undefined;
  children: React.ReactNode;
}

export type LightboxRootProps<T> = LightboxRootBaseProps<T> &
  LightboxOpenState &
  LightboxSelectionState<T>;

type LightboxOwnedActivation =
  | 'onPress'
  | 'onPressStart'
  | 'onPressEnd'
  | 'onPressChange'
  | 'onPressUp'
  | 'onClick';
type LightboxOwnedControlProp = LightboxOwnedActivation | OwnedActionDomProp;
type LightboxOwnedOpenStateProp = 'isOpen' | 'defaultOpen' | 'onOpenChange';
type LightboxControlName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string }
  | { 'aria-label'?: never; 'aria-labelledby'?: never };

export type LightboxTriggerProps = Omit<
  ButtonProps,
  LightboxOwnedControlProp | 'children' | 'className' | 'style' | 'dangerouslySetInnerHTML'
> & {
  itemKey: React.Key;
  children: React.ReactNode;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
};

export type LightboxBackdropProps = Omit<
  DialogBackdropProps,
  LightboxOwnedOpenStateProp | 'className' | 'dangerouslySetInnerHTML'
> & {
  className?: string | undefined;
};

export type LightboxPopupModalProps = Omit<
  NonNullable<DialogPopupProps['modalProps']>,
  LightboxOwnedOpenStateProp
>;

export type LightboxPopupProps = Omit<
  DialogPopupProps,
  'className' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'modalProps'
> & {
  className?: string | undefined;
  modalProps?: LightboxPopupModalProps | undefined;
};

export type LightboxContentProps = SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
>;

export interface LightboxCaptionProps extends SafeDomProps<
  React.HTMLAttributes<HTMLParagraphElement>
> {
  children?: React.ReactNode;
}

export type LightboxPreviousProps = Omit<
  ButtonProps,
  | LightboxOwnedControlProp
  | 'children'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
> &
  LightboxControlName & {
    children?: React.ReactNode;
  };

export type LightboxNextProps = LightboxPreviousProps;

export type LightboxCloseProps = Omit<
  DialogCloseProps,
  | LightboxOwnedControlProp
  | 'slot'
  | 'children'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
> &
  LightboxControlName & {
    children?: React.ReactNode;
  };

type SupportedKey = string | number | bigint;

interface CollectionRecord<T> {
  item: T;
  key: SupportedKey;
  label: string;
  index: number;
  token: string;
}

interface CollectionSnapshot<T> {
  valid: boolean;
  records: readonly CollectionRecord<T>[];
  byToken: ReadonlyMap<string, CollectionRecord<T>>;
}

interface TriggerRegistration {
  element: HTMLButtonElement;
  token: string;
}

interface LightboxContextValue {
  valid: boolean;
  open: boolean;
  loop: boolean;
  swipeNavigation: boolean;
  current: CollectionRecord<unknown> | null;
  records: readonly CollectionRecord<unknown>[];
  popupLabel: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  popupRef: React.RefObject<HTMLElement | null>;
  getRecord: (key: unknown) => CollectionRecord<unknown> | null;
  openFromTrigger: (record: CollectionRecord<unknown>, element: HTMLButtonElement) => void;
  navigate: (direction: -1 | 1) => void;
  renderCurrent: () => React.ReactNode;
  requestClose: () => void;
  registerTrigger: (element: HTMLButtonElement, token: string) => () => void;
  isTopmostFocused: () => boolean;
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null);

const ACTION_TARGET_PROPS = [
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
] as const;

const ACTION_PROPS = new Set<string>([
  ...ACTION_TARGET_PROPS,
  ...ACTION_TARGET_PROPS.map((name) => `${name}Capture`),
  'onPress',
  'onPressStart',
  'onPressEnd',
  'onPressChange',
  'onPressUp',
]);

const CAPTURE_PROPS = new Set<string>(ACTION_TARGET_PROPS.map((name) => `${name}Capture`));
const popupStacks = new WeakMap<Document, HTMLElement[]>();
const handledArrowEvents = new WeakSet<Event>();

function isSupportedKey(value: unknown): value is SupportedKey {
  return (
    typeof value === 'string' ||
    typeof value === 'bigint' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

function keyToken(key: SupportedKey): string {
  if (typeof key === 'string') {
    return `string:${key}`;
  }
  if (typeof key === 'bigint') {
    return `bigint:${key.toString()}`;
  }
  return `number:${Object.is(key, -0) ? '0' : String(key)}`;
}

function createCollection<T>(
  items: unknown,
  getKey: unknown,
  getLabel: unknown,
  renderContent: unknown,
): CollectionSnapshot<T> {
  if (
    !Array.isArray(items) ||
    typeof getKey !== 'function' ||
    typeof getLabel !== 'function' ||
    typeof renderContent !== 'function'
  ) {
    return { valid: false, records: [], byToken: new Map() };
  }

  const records: CollectionRecord<T>[] = [];
  const byToken = new Map<string, CollectionRecord<T>>();
  try {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index] as T;
      const key = (getKey as (value: T) => unknown)(item);
      const label = (getLabel as (value: T) => unknown)(item);
      if (!isSupportedKey(key) || typeof label !== 'string' || label.trim().length === 0) {
        return { valid: false, records: [], byToken: new Map() };
      }

      const token = keyToken(key);
      if (byToken.has(token)) {
        return { valid: false, records: [], byToken: new Map() };
      }

      const record = { item, key, label, index, token };
      records.push(record);
      byToken.set(token, record);
    }
  } catch {
    return { valid: false, records: [], byToken: new Map() };
  }

  return { valid: true, records, byToken };
}

function removeKeys(
  props: Record<string, unknown>,
  shouldRemove: (key: string) => boolean,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (!shouldRemove(key)) {
      result[key] = props[key];
    }
  }
  return result;
}

function sanitizeControlProps(props: Record<string, unknown>) {
  return removeKeys(props, (key) => key === 'dangerouslySetInnerHTML' || ACTION_PROPS.has(key));
}

function sanitizeDomProps(props: Record<string, unknown>) {
  return removeKeys(props, (key) => key === 'dangerouslySetInnerHTML');
}

function getPopupDirection(element: HTMLElement): 'ltr' | 'rtl' {
  const view = element.ownerDocument.defaultView;
  if (view) {
    const direction = view.getComputedStyle(element).direction;
    if (direction === 'rtl') {
      return 'rtl';
    }
  }
  return element.ownerDocument.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
}

function getNamedControlProps(
  props: Record<string, unknown>,
  fallback: string,
): { 'aria-label': string } | { 'aria-labelledby': string } {
  const label = props['aria-label'];
  const labelledBy = props['aria-labelledby'];
  const hasLabel = typeof label === 'string' && label.trim().length > 0;
  const hasLabelledBy = typeof labelledBy === 'string' && labelledBy.trim().length > 0;
  const specifiedLabel = label !== undefined;
  const specifiedLabelledBy = labelledBy !== undefined;
  if (specifiedLabel !== specifiedLabelledBy && hasLabel !== hasLabelledBy) {
    return hasLabel ? { 'aria-label': label } : { 'aria-labelledby': labelledBy as string };
  }
  return { 'aria-label': fallback };
}

function getStack(doc: Document): HTMLElement[] {
  const existing = popupStacks.get(doc);
  if (existing) {
    return existing;
  }
  const created: HTMLElement[] = [];
  popupStacks.set(doc, created);
  return created;
}

function canReceiveFocus(element: HTMLElement): boolean {
  if (!element.isConnected || element.hasAttribute('disabled')) {
    return false;
  }
  if (element.tabIndex >= 0) {
    return true;
  }
  return element.matches('a[href],button,input,select,textarea,[contenteditable="true"]');
}

/**
 * A collection-driven modal image viewer with controlled navigation, focus restoration,
 * localized controls, keyboard support, and optional swipe navigation.
 */
/**
 * A controlled or uncontrolled media viewer with owned navigation and focus restoration.
 *
 * @example
 * ```tsx
 * import { Image } from '@tale-ui/react/image';
 * import { Lightbox } from '@tale-ui/react/lightbox';
 *
 * <Lightbox.Root
 *   items={photos}
 *   getKey={(photo) => photo.id}
 *   getLabel={(photo) => photo.label}
 *   renderContent={(photo) => <Image src={photo.src} alt={photo.label} />}
 * >
 *   <Lightbox.Backdrop>
 *     <Lightbox.Popup>
 *       <Lightbox.Content />
 *       <Lightbox.Close />
 *     </Lightbox.Popup>
 *   </Lightbox.Backdrop>
 * </Lightbox.Root>
 * ```
 *
 * @status experimental
 */
const Root = React.forwardRef(function LightboxRoot<T>(
  props: LightboxRootProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    items,
    getKey,
    getLabel,
    renderContent,
    children,
    isOpen,
    defaultOpen,
    onOpenChange,
    selectedKey,
    defaultSelectedKey,
    onSelectionChange,
    loop,
    swipeNavigation,
    className,
    ...domProps
  } = props as LightboxRootProps<T> & Record<string, unknown>;

  const collection = React.useMemo(
    () => createCollection<T>(items, getKey, getLabel, renderContent),
    [getKey, getLabel, items, renderContent],
  );
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const popupRef = React.useRef<HTMLElement | null>(null);
  const mergedRootRef = useMergedRefs(rootRef, forwardedRef);
  const frame = useAnimationFrame();
  const [, rerender] = React.useReducer((value: number) => value + 1, 0);
  const modesRef = React.useRef<{
    open?: 'controlled' | 'uncontrolled';
    selection?: 'controlled' | 'uncontrolled';
  }>({});
  const uncontrolledOpenRef = React.useRef(false);
  const uncontrolledSelectionRef = React.useRef<SupportedKey | null>(null);
  const lastValidOpenRef = React.useRef(false);
  const lastValidSelectionRef = React.useRef<SupportedKey | null>(null);
  const triggerRegistrationsRef = React.useRef<TriggerRegistration[]>([]);
  const initiatingTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const lastSelectedTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const lastOpenProposalRef = React.useRef<boolean | null>(null);
  const lastSelectionProposalRef = React.useRef<string | null>(null);
  const observedControlledSelectionRef = React.useRef<string | null>(null);
  const previousOpenRef = React.useRef(false);
  const lastPopupLabelRef = React.useRef('Lightbox');

  const openBranchValid =
    !(isOpen !== undefined && defaultOpen !== undefined) &&
    (isOpen === undefined || typeof isOpen === 'boolean');
  const selectionBranchValid =
    !(selectedKey !== undefined && defaultSelectedKey !== undefined) &&
    (selectedKey === undefined || selectedKey === null || isSupportedKey(selectedKey));
  const callbacksValid =
    (onOpenChange === undefined || typeof onOpenChange === 'function') &&
    (onSelectionChange === undefined || typeof onSelectionChange === 'function');
  const optionsValid =
    (loop === undefined || typeof loop === 'boolean') &&
    (swipeNavigation === undefined || typeof swipeNavigation === 'boolean');
  const baseValid =
    collection.valid && openBranchValid && selectionBranchValid && callbacksValid && optionsValid;

  if (
    modesRef.current.open === undefined &&
    modesRef.current.selection === undefined &&
    baseValid
  ) {
    modesRef.current.open = isOpen !== undefined ? 'controlled' : 'uncontrolled';
    modesRef.current.selection = selectedKey !== undefined ? 'controlled' : 'uncontrolled';
    uncontrolledOpenRef.current = typeof defaultOpen === 'boolean' ? defaultOpen : false;

    if (defaultSelectedKey === null) {
      uncontrolledSelectionRef.current = null;
    } else if (isSupportedKey(defaultSelectedKey)) {
      const defaultRecord = collection.byToken.get(keyToken(defaultSelectedKey));
      uncontrolledSelectionRef.current = defaultRecord?.key ?? collection.records[0]?.key ?? null;
    } else {
      uncontrolledSelectionRef.current = collection.records[0]?.key ?? null;
    }
  }

  const modesEstablished =
    modesRef.current.open !== undefined && modesRef.current.selection !== undefined;
  const modesMatch =
    modesEstablished &&
    (modesRef.current.open === 'controlled' ? isOpen !== undefined : isOpen === undefined) &&
    (modesRef.current.selection === 'controlled'
      ? selectedKey !== undefined
      : selectedKey === undefined);
  const valid = baseValid && modesEstablished && modesMatch;

  let candidateOpen = false;
  let candidateSelection: SupportedKey | null = null;
  if (valid) {
    candidateOpen =
      modesRef.current.open === 'controlled' ? (isOpen as boolean) : uncontrolledOpenRef.current;
    candidateSelection =
      modesRef.current.selection === 'controlled'
        ? (selectedKey as SupportedKey | null)
        : uncontrolledSelectionRef.current;
    lastValidOpenRef.current = candidateOpen;
    lastValidSelectionRef.current = candidateSelection;
  }

  const selectionToken = valid && candidateSelection !== null ? keyToken(candidateSelection) : null;
  const current = valid && selectionToken ? (collection.byToken.get(selectionToken) ?? null) : null;
  if (current) {
    lastPopupLabelRef.current = current.label;
  }
  const open = Boolean(valid && candidateOpen && current);

  if (valid && modesRef.current.open === 'controlled' && lastValidOpenRef.current === isOpen) {
    if (lastOpenProposalRef.current === isOpen) {
      lastOpenProposalRef.current = null;
    }
  }
  if (
    valid &&
    modesRef.current.selection === 'controlled' &&
    lastValidSelectionRef.current === selectedKey
  ) {
    const selectedToken = selectedKey === null ? 'null' : keyToken(selectedKey as SupportedKey);
    if (
      observedControlledSelectionRef.current !== null &&
      observedControlledSelectionRef.current !== selectedToken
    ) {
      lastSelectionProposalRef.current = null;
    }
    observedControlledSelectionRef.current = selectedToken;
    if (lastSelectionProposalRef.current === selectedToken) {
      lastSelectionProposalRef.current = null;
    }
  }

  const validRef = React.useRef(valid);
  const openRef = React.useRef(candidateOpen);
  const currentRef = React.useRef(current);
  const selectedKeyRef = React.useRef<SupportedKey | null>(candidateSelection);
  const collectionRef = React.useRef(collection);
  validRef.current = valid;
  openRef.current = candidateOpen;
  currentRef.current = current;
  selectedKeyRef.current = candidateSelection;
  collectionRef.current = collection;

  const requestOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!validRef.current || nextOpen === openRef.current) {
        return;
      }
      if (modesRef.current.open === 'uncontrolled') {
        uncontrolledOpenRef.current = nextOpen;
        openRef.current = nextOpen;
        rerender();
      } else {
        if (lastOpenProposalRef.current === nextOpen) {
          return;
        }
        lastOpenProposalRef.current = nextOpen;
      }
      (onOpenChange as ((open: boolean) => void) | undefined)?.(nextOpen);
    },
    [onOpenChange],
  );

  const requestSelection = React.useCallback(
    (record: CollectionRecord<T> | null) => {
      if (!validRef.current) {
        return;
      }
      const nextKey = record?.key ?? null;
      const currentKey = selectedKeyRef.current;
      if (
        nextKey === currentKey ||
        (typeof nextKey === 'number' &&
          typeof currentKey === 'number' &&
          nextKey === 0 &&
          currentKey === 0)
      ) {
        return;
      }
      if (modesRef.current.selection === 'uncontrolled') {
        uncontrolledSelectionRef.current = nextKey;
        selectedKeyRef.current = nextKey;
        currentRef.current = record;
        rerender();
      } else {
        const proposalToken = nextKey === null ? 'null' : keyToken(nextKey);
        if (lastSelectionProposalRef.current === proposalToken) {
          return;
        }
        lastSelectionProposalRef.current = proposalToken;
      }
      (onSelectionChange as ((key: React.Key | null, item: T | null) => void) | undefined)?.(
        nextKey,
        record?.item ?? null,
      );
    },
    [onSelectionChange],
  );

  const registerTrigger = React.useCallback((element: HTMLButtonElement, token: string) => {
    const registration = { element, token };
    triggerRegistrationsRef.current.push(registration);
    return () => {
      const index = triggerRegistrationsRef.current.indexOf(registration);
      if (index >= 0) {
        triggerRegistrationsRef.current.splice(index, 1);
      }
    };
  }, []);

  const openFromTrigger = React.useCallback(
    (record: CollectionRecord<unknown>, element: HTMLButtonElement) => {
      if (!validRef.current) {
        return;
      }
      initiatingTriggerRef.current = element;
      lastSelectedTriggerRef.current = element;
      requestSelection(record as CollectionRecord<T>);
      requestOpen(true);
    },
    [requestOpen, requestSelection],
  );

  const isTopmostFocused = React.useCallback(() => {
    const popup = popupRef.current;
    if (!popup || !openRef.current || !validRef.current) {
      return false;
    }
    const doc = popup.ownerDocument;
    const stack = getStack(doc);
    return stack[stack.length - 1] === popup && popup.contains(doc.activeElement);
  }, []);

  const navigate = React.useCallback(
    (direction: -1 | 1) => {
      if (!validRef.current || !openRef.current || !isTopmostFocused()) {
        return;
      }
      const snapshot = collectionRef.current;
      const active = currentRef.current as CollectionRecord<T> | null;
      if (!active || snapshot.records.length <= 1) {
        return;
      }
      let nextIndex = active.index + direction;
      if (nextIndex < 0 || nextIndex >= snapshot.records.length) {
        if (!loop) {
          return;
        }
        nextIndex = nextIndex < 0 ? snapshot.records.length - 1 : 0;
      }
      requestSelection(snapshot.records[nextIndex] ?? null);
    },
    [isTopmostFocused, loop, requestSelection],
  );

  const requestClose = React.useCallback(() => requestOpen(false), [requestOpen]);

  useIsoLayoutEffect(() => {
    if (!valid || !modesEstablished || current) {
      return;
    }

    if (modesRef.current.selection === 'uncontrolled') {
      const replacement = collection.records[0] ?? null;
      uncontrolledSelectionRef.current = replacement?.key ?? null;
      selectedKeyRef.current = replacement?.key ?? null;
      (onSelectionChange as ((key: React.Key | null, item: T | null) => void) | undefined)?.(
        replacement?.key ?? null,
        replacement?.item ?? null,
      );
      if (openRef.current) {
        uncontrolledOpenRef.current = false;
        openRef.current = false;
        (onOpenChange as ((open: boolean) => void) | undefined)?.(false);
      }
      rerender();
    } else if (candidateSelection !== null) {
      requestSelection(null);
      requestOpen(false);
    } else {
      requestOpen(false);
    }
  }, [
    candidateSelection,
    collection,
    current,
    modesEstablished,
    onOpenChange,
    onSelectionChange,
    requestOpen,
    requestSelection,
    valid,
  ]);

  useIsoLayoutEffect(() => {
    const wasOpen = previousOpenRef.current;
    previousOpenRef.current = open;
    if (open || !wasOpen || !valid) {
      frame.cancel();
      return;
    }

    const selectedToken =
      lastValidSelectionRef.current === null ? null : keyToken(lastValidSelectionRef.current);
    frame.request(() => {
      frame.request(() => {
        const candidates: Array<HTMLElement | null | undefined> = [
          initiatingTriggerRef.current,
          lastSelectedTriggerRef.current,
          selectedToken
            ? triggerRegistrationsRef.current.find(
                (registration) => registration.token === selectedToken,
              )?.element
            : null,
          triggerRegistrationsRef.current[0]?.element,
          rootRef.current,
        ];
        const target = candidates.find((candidate) => candidate && canReceiveFocus(candidate));
        target?.focus();
      });
    });
  }, [frame, open, valid]);

  React.useEffect(() => frame.cancel, [frame]);

  const context = React.useMemo<LightboxContextValue>(
    () => ({
      valid,
      open,
      loop: loop ?? false,
      swipeNavigation: swipeNavigation ?? true,
      current: current as CollectionRecord<unknown> | null,
      records: collection.records as readonly CollectionRecord<unknown>[],
      popupLabel: current?.label ?? lastPopupLabelRef.current,
      rootRef,
      popupRef,
      getRecord(key) {
        return isSupportedKey(key)
          ? ((collection.byToken.get(keyToken(key)) as CollectionRecord<unknown> | undefined) ??
              null)
          : null;
      },
      openFromTrigger,
      navigate,
      renderCurrent() {
        const record = current as CollectionRecord<T> | null;
        return record
          ? renderContent(record.item, {
              key: record.key,
              index: record.index,
              count: collection.records.length,
            })
          : null;
      },
      requestClose,
      registerTrigger,
      isTopmostFocused,
    }),
    [
      collection,
      current,
      isTopmostFocused,
      loop,
      navigate,
      open,
      openFromTrigger,
      registerTrigger,
      renderContent,
      requestClose,
      swipeNavigation,
      valid,
    ],
  );

  const sanitizedRootProps = removeKeys(
    domProps as Record<string, unknown>,
    (key) => key === 'dangerouslySetInnerHTML' || CAPTURE_PROPS.has(key),
  );

  return (
    <LightboxContext.Provider value={context}>
      <div
        {...(sanitizedRootProps as React.HTMLAttributes<HTMLDivElement>)}
        ref={mergedRootRef}
        className={cx('tale-lightbox', className as string | undefined)}
        data-invalid={valid ? undefined : ''}
      >
        {children}
      </div>
    </LightboxContext.Provider>
  );
}) as <T>(
  props: LightboxRootProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> | undefined },
) => React.ReactElement;
Object.defineProperty(Root, 'displayName', { value: 'Lightbox.Root' });

const Trigger = React.forwardRef<HTMLButtonElement, LightboxTriggerProps>(
  ({ itemKey, className, style, children, ...props }, forwardedRef) => {
    const context = React.useContext(LightboxContext);
    const localRef = React.useRef<HTMLButtonElement | null>(null);
    const mergedRef = useMergedRefs(localRef, forwardedRef);
    const record = context?.getRecord(itemKey) ?? null;
    const enabled = Boolean(context?.valid && record);

    useIsoLayoutEffect(() => {
      const element = localRef.current;
      if (!context || !element || !record) {
        return;
      }
      return context.registerTrigger(element, record.token);
    }, [context, record]);

    const sanitized = sanitizeControlProps(props as Record<string, unknown>);
    return (
      <Button
        {...(sanitized as ButtonProps)}
        ref={mergedRef}
        className={cx('tale-lightbox__trigger', className)}
        style={style}
        isDisabled={!enabled || Boolean(props.isDisabled) || Boolean(props.disabled)}
        onPress={() => {
          if (context && record && localRef.current) {
            context.openFromTrigger(record, localRef.current);
          }
        }}
      >
        {children}
      </Button>
    );
  },
);
Trigger.displayName = 'Lightbox.Trigger';

const Backdrop = React.forwardRef<HTMLDivElement, LightboxBackdropProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(LightboxContext);
    const sanitized = removeKeys(
      props as Record<string, unknown>,
      (key) =>
        key === 'dangerouslySetInnerHTML' ||
        key === 'isOpen' ||
        key === 'defaultOpen' ||
        key === 'onOpenChange',
    );
    return (
      <Dialog.Backdrop
        {...(sanitized as DialogBackdropProps)}
        ref={ref}
        className={cx('tale-lightbox__backdrop', className)}
        isOpen={Boolean(context?.valid && context.open)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            context?.requestClose();
          }
        }}
      />
    );
  },
);
Backdrop.displayName = 'Lightbox.Backdrop';

function chainEventHandlers<E extends { defaultPrevented: boolean }>(
  consumer: ((event: E) => void) | undefined,
  owned: ((event: E) => void) | undefined,
) {
  if (!consumer) {
    return owned;
  }
  if (!owned) {
    return consumer;
  }
  return (event: E) => {
    consumer(event);
    if (!event.defaultPrevented) {
      owned(event);
    }
  };
}

const Popup = React.forwardRef<HTMLElement, LightboxPopupProps>(
  ({ className, modalProps, ...props }, forwardedRef) => {
    const context = React.useContext(LightboxContext);
    const localRef = React.useRef<HTMLElement | null>(null);
    const mergedRef = useMergedRefs(localRef, context?.popupRef, forwardedRef);
    const currentToken = context?.current?.token;

    const navigateFromSwipe = React.useCallback(
      (direction: SwipeDirection) => {
        const element = localRef.current;
        if (!context || !element || !context.isTopmostFocused()) {
          return;
        }
        const rtl = getPopupDirection(element) === 'rtl';
        const logicalDirection: -1 | 1 = direction === 'left' ? (rtl ? -1 : 1) : rtl ? 1 : -1;
        context.navigate(logicalDirection);
      },
      [context],
    );

    const swipe = useSwipeDismiss({
      enabled: Boolean(
        context?.valid && context.open && context.swipeNavigation && context.records.length > 1,
      ),
      directions: ['left', 'right'],
      elementRef: localRef,
      movementCssVars: {
        x: '--tale-lightbox-swipe-x',
        y: '--tale-lightbox-swipe-y',
      },
      swipeThreshold: 40,
      ignoreScrollableAncestors: true,
      trackDrag: false,
      canStart: () => context?.isTopmostFocused() ?? false,
      onDismiss: (_event, details) => navigateFromSwipe(details.direction),
    });
    const resetSwipe = swipe.reset;

    useIsoLayoutEffect(() => {
      const popup = localRef.current;
      if (!popup || !context?.valid || !context.open) {
        return;
      }
      const stack = getStack(popup.ownerDocument);
      stack.push(popup);
      return () => {
        const index = stack.lastIndexOf(popup);
        if (index >= 0) {
          stack.splice(index, 1);
        }
        if (stack.length === 0) {
          popupStacks.delete(popup.ownerDocument);
        }
      };
    }, [context?.open, context?.valid]);

    React.useEffect(() => {
      resetSwipe();
    }, [context?.open, context?.valid, currentToken, resetSwipe]);

    const handleKeyDown = React.useCallback(
      (event: KeyboardEvent) => {
        if (
          !context ||
          !context.isTopmostFocused() ||
          (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') ||
          handledArrowEvents.has(event)
        ) {
          return;
        }
        handledArrowEvents.add(event);
        const element = localRef.current;
        if (!element) {
          return;
        }
        event.preventDefault();
        const rtl = getPopupDirection(element) === 'rtl';
        context.navigate(event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : rtl ? -1 : 1);
      },
      [context],
    );

    useIsoLayoutEffect(() => {
      const popup = localRef.current;
      if (!popup) {
        return;
      }
      popup.addEventListener('keydown', handleKeyDown);
      return () => popup.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const pointerProps = swipe.getPointerProps();
    const touchProps = swipe.getTouchProps();
    const sanitizedModalProps = modalProps
      ? removeKeys(
          modalProps as Record<string, unknown>,
          (key) => key === 'isOpen' || key === 'defaultOpen' || key === 'onOpenChange',
        )
      : undefined;
    const sanitized = removeKeys(
      sanitizeDomProps(props as Record<string, unknown>),
      (key) => key === 'aria-label' || key === 'aria-labelledby',
    );

    return (
      <Dialog.Popup
        {...(sanitized as DialogPopupProps)}
        ref={mergedRef}
        className={cx('tale-lightbox__popup', className)}
        aria-label={context?.popupLabel ?? 'Lightbox'}
        modalProps={sanitizedModalProps as LightboxPopupModalProps | undefined}
        onPointerDown={chainEventHandlers(
          props.onPointerDown as React.PointerEventHandler<HTMLElement> | undefined,
          pointerProps.onPointerDown,
        )}
        onPointerMove={chainEventHandlers(
          props.onPointerMove as React.PointerEventHandler<HTMLElement> | undefined,
          pointerProps.onPointerMove,
        )}
        onPointerUp={chainEventHandlers(
          props.onPointerUp as React.PointerEventHandler<HTMLElement> | undefined,
          pointerProps.onPointerUp,
        )}
        onPointerCancel={chainEventHandlers(
          props.onPointerCancel as React.PointerEventHandler<HTMLElement> | undefined,
          pointerProps.onPointerCancel,
        )}
        onTouchStart={chainEventHandlers(
          props.onTouchStart as React.TouchEventHandler<HTMLElement> | undefined,
          touchProps.onTouchStart,
        )}
        onTouchMove={chainEventHandlers(
          props.onTouchMove as React.TouchEventHandler<HTMLElement> | undefined,
          touchProps.onTouchMove,
        )}
        onTouchEnd={chainEventHandlers(
          props.onTouchEnd as React.TouchEventHandler<HTMLElement> | undefined,
          touchProps.onTouchEnd,
        )}
        onTouchCancel={chainEventHandlers(
          props.onTouchCancel as React.TouchEventHandler<HTMLElement> | undefined,
          touchProps.onTouchCancel,
        )}
      />
    );
  },
);
Popup.displayName = 'Lightbox.Popup';

const Content = React.forwardRef<HTMLDivElement, LightboxContentProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(LightboxContext);
    const sanitized = sanitizeDomProps(props as Record<string, unknown>);
    return (
      <div
        {...(sanitized as React.HTMLAttributes<HTMLDivElement>)}
        ref={ref}
        className={cx('tale-lightbox__content', className)}
      >
        {context?.valid ? context.renderCurrent() : null}
      </div>
    );
  },
);
Content.displayName = 'Lightbox.Content';

const Caption = React.forwardRef<HTMLParagraphElement, LightboxCaptionProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(LightboxContext);
    const sanitized = sanitizeDomProps(props as Record<string, unknown>);
    return (
      <p
        {...(sanitized as React.HTMLAttributes<HTMLParagraphElement>)}
        ref={ref}
        className={cx('tale-lightbox__caption', className)}
      >
        {children === undefined ? context?.current?.label : children}
      </p>
    );
  },
);
Caption.displayName = 'Lightbox.Caption';

function useNavigationState(direction: -1 | 1) {
  const context = React.useContext(LightboxContext);
  const current = context?.current;
  const count = context?.records.length ?? 0;
  const atBoundary =
    !context?.loop &&
    Boolean(current && (direction < 0 ? current.index === 0 : current.index === count - 1));
  return {
    context,
    disabled: !context?.valid || !context.open || !current || count <= 1 || atBoundary,
  };
}

const Previous = React.forwardRef<HTMLButtonElement, LightboxPreviousProps>(
  ({ className, children, ...props }, ref) => {
    const { formatMessage } = useTaleI18n();
    const { context, disabled } = useNavigationState(-1);
    const sanitized = removeKeys(
      sanitizeControlProps(props as Record<string, unknown>),
      (key) => key === 'aria-label' || key === 'aria-labelledby',
    );
    const name = getNamedControlProps(
      props as Record<string, unknown>,
      formatMessage('lightbox.previous'),
    );
    return (
      <Button
        {...(sanitized as ButtonProps)}
        {...name}
        ref={ref}
        variant="ghost"
        className={cx('tale-lightbox__previous', className)}
        isDisabled={disabled || Boolean(props.isDisabled) || Boolean(props.disabled)}
        onPress={() => context?.navigate(-1)}
      >
        {children === undefined ? <Icon icon={ChevronLeft} size="md" /> : children}
      </Button>
    );
  },
);
Previous.displayName = 'Lightbox.Previous';

const Next = React.forwardRef<HTMLButtonElement, LightboxNextProps>(
  ({ className, children, ...props }, ref) => {
    const { formatMessage } = useTaleI18n();
    const { context, disabled } = useNavigationState(1);
    const sanitized = removeKeys(
      sanitizeControlProps(props as Record<string, unknown>),
      (key) => key === 'aria-label' || key === 'aria-labelledby',
    );
    const name = getNamedControlProps(
      props as Record<string, unknown>,
      formatMessage('lightbox.next'),
    );
    return (
      <Button
        {...(sanitized as ButtonProps)}
        {...name}
        ref={ref}
        variant="ghost"
        className={cx('tale-lightbox__next', className)}
        isDisabled={disabled || Boolean(props.isDisabled) || Boolean(props.disabled)}
        onPress={() => context?.navigate(1)}
      >
        {children === undefined ? <Icon icon={ChevronRight} size="md" /> : children}
      </Button>
    );
  },
);
Next.displayName = 'Lightbox.Next';

const Close = React.forwardRef<HTMLButtonElement, LightboxCloseProps>(
  ({ className, children, ...props }, ref) => {
    const { formatMessage } = useTaleI18n();
    const context = React.useContext(LightboxContext);
    const sanitized = removeKeys(
      sanitizeControlProps(props as Record<string, unknown>),
      (key) => key === 'aria-label' || key === 'aria-labelledby',
    );
    const name = getNamedControlProps(
      props as Record<string, unknown>,
      formatMessage('lightbox.close'),
    );
    return (
      <Dialog.Close
        {...(sanitized as DialogCloseProps)}
        {...name}
        ref={ref}
        slot="close"
        className={cx('tale-lightbox__close', className)}
        isDisabled={!context?.valid || !context.open || Boolean(props.isDisabled)}
      >
        {children}
      </Dialog.Close>
    );
  },
);
Close.displayName = 'Lightbox.Close';

export { Root, Trigger, Backdrop, Popup, Content, Caption, Previous, Next, Close };
