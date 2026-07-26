'use client';

import * as React from 'react';
import {
  Button as AriaButton,
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastList as AriaToastList,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { useTaleI18n } from '../i18n-provider';
import { cx } from '../_cx';

type ToastVariant = 'neutral' | 'success' | 'warning' | 'danger';

/**
 * Registry metadata for Toast visual variants. The public message contract extends this shape,
 * while consumers import `ToastMessage` rather than an independently rendered Toast primitive.
 */
export interface ToastProps {
  /** Announcement and visual treatment. */
  variant?: ToastVariant;
}

export interface ToastMessage extends ToastProps {
  title: string;
  description?: string;
}

export interface CreateToastQueueOptions {
  maxVisibleToasts?: number;
  defaultTimeout?: number;
}

export interface ToastAddOptions {
  timeout?: number;
  onClose?: () => void;
}

export interface ToastQueue {
  add(message: ToastMessage, options?: ToastAddOptions): string;
  close(key: string): void;
  clear(): void;
  pauseAll(): void;
  resumeAll(): void;
}

/* eslint-disable react/no-unused-prop-types -- Runtime validation reads the complete prop bag
 * through a sealed Record before forwarding the normalized values. */
export interface ToastRegionProps {
  queue: ToastQueue;
  'aria-label'?: string;
  className?: string;
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  dismissLabel?: string;
}
/* eslint-enable react/no-unused-prop-types */

type ToastPlacement = NonNullable<ToastRegionProps['placement']>;

interface NormalizedToastMessage {
  readonly title: string;
  readonly description?: string;
  readonly variant: ToastVariant;
}

interface RawToastRecord {
  readonly opaqueKey: string;
  readonly message: NormalizedToastMessage;
}

type RawQueue = AriaToastQueue<RawToastRecord>;
type RawQueuedToast = RawQueue['visibleToasts'][number];
type RawToastOptions = Parameters<RawQueue['add']>[1];

interface TaleToastRecord {
  readonly key: string;
  readonly message: NormalizedToastMessage;
}

interface ToastTimerState {
  readonly timeout: number;
  remaining: number;
  timerId: ReturnType<typeof setTimeout> | null;
  timerStartedAt: number | null;
  timerGeneration: number;
}

type StagedOperation =
  | {
      readonly type: 'add';
      readonly key: string;
      readonly message: NormalizedToastMessage;
      readonly options: NormalizedAddOptions;
      canceled: boolean;
    }
  | { readonly type: 'close'; readonly key: string; readonly source: CloseSource }
  | { readonly type: 'clear' }
  | { readonly type: 'manual-pause' }
  | { readonly type: 'manual-resume' };

type CloseSource = 'public' | 'rac' | 'timer';

interface NormalizedQueueOptions {
  maxVisibleToasts: number;
  defaultTimeout: number;
}

interface NormalizedAddOptions {
  timeout: number;
  callback?: () => void;
}

interface Lease {
  readonly id: symbol;
  interactionPaused: boolean;
}

interface AnnouncementSnapshot {
  readonly version: number;
  readonly ordered: readonly TaleToastRecord[];
  readonly polite: readonly TaleToastRecord[];
  readonly assertive: readonly TaleToastRecord[];
}

interface ToastDebugSnapshot {
  readonly adapter: StableToastAdapter;
  readonly generation: RawQueue;
  readonly records: readonly TaleToastRecord[];
  readonly forwardMap: ReadonlyMap<string, string>;
  readonly reverseMap: ReadonlyMap<string, string>;
  readonly manualPauseDepth: number;
  readonly leaseCount: number;
  readonly timerCount: number;
  readonly callbackCount: number;
  readonly announcementCount: number;
  readonly announcementKeys: readonly string[];
  readonly poisoned: boolean;
}

const queueInternals = new WeakMap<object, ToastController>();
const MAX_TIMER_DELAY = 2_147_483_647;
const POISONED_ERROR =
  'Tale UI: Toast queue is poisoned after unrecoverable state corruption; create a new queue.';

function toastTypeError(operation: string, domain: string): TypeError {
  return new TypeError(
    `Tale UI: Toast ${operation} rejected an input outside ${domain}; correct the input before retrying.`,
  );
}

function toastRangeError(operation: string, domain: string): RangeError {
  return new RangeError(
    `Tale UI: Toast ${operation} rejected an input outside ${domain}; correct the input before retrying.`,
  );
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateOptionalObject(
  value: unknown,
  operation: string,
  domain: string,
): Record<string, unknown> {
  if (value === undefined) {
    return {};
  }

  if (!isObjectRecord(value)) {
    throw toastTypeError(operation, domain);
  }

  return value;
}

function validateTimeout(value: unknown, operation: string): number {
  if (typeof value !== 'number') {
    throw toastTypeError(operation, 'the finite non-negative timeout domain');
  }

  if (!Number.isFinite(value) || value < 0) {
    throw toastRangeError(operation, 'the finite non-negative timeout domain');
  }

  return value;
}

function readPropertyOnce(
  value: Record<string, unknown>,
  property: string,
  operation: string,
): unknown {
  try {
    return value[property];
  } catch (error) {
    throw recoveryError(
      [error],
      `Tale UI: Toast ${operation} could not read ${property}; replace the throwing accessor before retrying.`,
    );
  }
}

function normalizeQueueOptions(options: unknown): NormalizedQueueOptions {
  const value = validateOptionalObject(
    options,
    'queue creation',
    'the undefined-or-non-null-object options domain',
  );
  let maxVisibleToasts = 1;
  let defaultTimeout = 5000;
  const candidateMaxVisibleToasts = readPropertyOnce(value, 'maxVisibleToasts', 'queue creation');
  const candidateDefaultTimeout = readPropertyOnce(value, 'defaultTimeout', 'queue creation');

  if (candidateMaxVisibleToasts !== undefined) {
    if (typeof candidateMaxVisibleToasts !== 'number') {
      throw toastTypeError('queue creation', 'the positive finite integer maxVisibleToasts domain');
    }

    if (
      !Number.isFinite(candidateMaxVisibleToasts) ||
      !Number.isInteger(candidateMaxVisibleToasts) ||
      candidateMaxVisibleToasts <= 0
    ) {
      throw toastRangeError(
        'queue creation',
        'the positive finite integer maxVisibleToasts domain',
      );
    }
    maxVisibleToasts = candidateMaxVisibleToasts;
  }

  if (candidateDefaultTimeout !== undefined) {
    defaultTimeout = validateTimeout(candidateDefaultTimeout, 'queue creation');
  }

  return { maxVisibleToasts, defaultTimeout };
}

function normalizeMessage(message: unknown): NormalizedToastMessage {
  if (!isObjectRecord(message)) {
    throw toastTypeError('add', 'the non-null, non-array ToastMessage object domain');
  }

  const title = readPropertyOnce(message, 'title', 'add');
  const description = readPropertyOnce(message, 'description', 'add');
  const candidateVariant = readPropertyOnce(message, 'variant', 'add');

  if (typeof title !== 'string') {
    throw toastTypeError('add', 'the string title domain');
  }

  if (title.trim().length === 0) {
    throw toastRangeError('add', 'the non-empty title domain');
  }

  if (description !== undefined && typeof description !== 'string') {
    throw toastTypeError('add', 'the optional string description domain');
  }

  const variant = candidateVariant ?? 'neutral';
  if (
    variant !== 'neutral' &&
    variant !== 'success' &&
    variant !== 'warning' &&
    variant !== 'danger'
  ) {
    throw toastTypeError('add', 'the neutral, success, warning, or danger variant domain');
  }

  return Object.freeze({
    title,
    ...(description === undefined ? {} : { description }),
    variant,
  });
}

function normalizeAddOptions(options: unknown, defaultTimeout: number): NormalizedAddOptions {
  const value = validateOptionalObject(
    options,
    'add',
    'the undefined-or-non-null-object ToastAddOptions domain',
  );
  const candidateTimeout = readPropertyOnce(value, 'timeout', 'add');
  const candidateOnClose = readPropertyOnce(value, 'onClose', 'add');
  const timeout =
    candidateTimeout === undefined ? defaultTimeout : validateTimeout(candidateTimeout, 'add');

  if (candidateOnClose !== undefined && typeof candidateOnClose !== 'function') {
    throw toastTypeError('add', 'the optional callable onClose domain');
  }

  return {
    timeout,
    ...(candidateOnClose === undefined ? {} : { callback: candidateOnClose as () => void }),
  };
}

function monotonicNow(): number {
  return typeof performance === 'object' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function orderedError(errors: readonly unknown[], message: string): unknown {
  if (errors.length === 1) {
    return errors[0];
  }
  return new AggregateError(errors, message);
}

function recoveryError(errors: readonly unknown[], message: string): AggregateError {
  return new AggregateError(errors, message);
}

class StableToastAdapter extends AriaToastQueue<RawToastRecord> {
  override visibleToasts: RawQueuedToast[] = [];
  readonly #subscriptions = new Set<() => void>();
  readonly #controller: ToastController;

  constructor(controller: ToastController, maxVisibleToasts: number) {
    super({ maxVisibleToasts });
    this.#controller = controller;
  }

  override subscribe(callback: () => void): () => void {
    this.#subscriptions.add(callback);
    return () => this.#subscriptions.delete(callback);
  }

  override add(content: RawToastRecord, options?: RawToastOptions): string {
    return this.#controller.adapterAdd(content, options);
  }

  override close(rawKey: string): void {
    this.#controller.closeRaw(rawKey);
  }

  override clear(): void {
    this.#controller.clear();
  }

  override pauseAll(): void {
    this.#controller.setOwnerInteractionPaused(true);
  }

  override resumeAll(): void {
    this.#controller.setOwnerInteractionPaused(false);
  }

  publish(): unknown[] {
    const errors: unknown[] = [];
    for (const callback of [...this.#subscriptions]) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }
    return errors;
  }

  get subscriptionCount(): number {
    return this.#subscriptions.size;
  }
}

class ToastController {
  readonly facade: ToastQueue;
  readonly adapter: StableToastAdapter;
  readonly maxVisibleToasts: number;
  readonly defaultTimeout: number;

  #generation: RawQueue;
  #rawFactory: () => RawQueue;
  #records: TaleToastRecord[] = [];
  #timers = new Map<string, ToastTimerState>();
  #callbacks = new Map<string, () => void>();
  #announced = new Set<string>();
  #opaqueToRaw = new Map<string, string>();
  #rawToOpaque = new Map<string, string>();
  #nextKey = 0;
  #transactionActive = false;
  #staged: StagedOperation[] = [];
  #reservedAdds = new Map<string, Extract<StagedOperation, { type: 'add' }>>();
  #manualPauseDepth = 0;
  #leases: Lease[] = [];
  #renderListeners = new Set<() => void>();
  #announcementVersion = 0;
  #announcementSnapshot: AnnouncementSnapshot = {
    version: 0,
    ordered: [],
    polite: [],
    assertive: [],
  };
  #poisoned = false;
  #diagnosedLeasePairs = new Set<string>();

  constructor(options: NormalizedQueueOptions) {
    this.maxVisibleToasts = options.maxVisibleToasts;
    this.defaultTimeout = options.defaultTimeout;
    this.#rawFactory = () =>
      new AriaToastQueue<RawToastRecord>({
        maxVisibleToasts: this.maxVisibleToasts,
      });
    this.#generation = this.#rawFactory();
    this.adapter = new StableToastAdapter(this, this.maxVisibleToasts);
    this.facade = Object.freeze({
      add: (message: ToastMessage, addOptions?: ToastAddOptions) => this.add(message, addOptions),
      close: (key: string) => this.close(key, 'public'),
      clear: () => this.clear(),
      pauseAll: () => this.pauseAll(),
      resumeAll: () => this.resumeAll(),
    });
  }

  add(messageInput: unknown, optionsInput?: unknown): string {
    this.assertHealthy();
    // The complete public input is validated before key allocation or either mirror is touched.
    const message = normalizeMessage(messageInput);
    const options = normalizeAddOptions(optionsInput, this.defaultTimeout);
    const key = this.allocateKey();
    const operation: Extract<StagedOperation, { type: 'add' }> = {
      type: 'add',
      key,
      message,
      options,
      canceled: false,
    };

    if (this.#transactionActive) {
      this.#reservedAdds.set(key, operation);
      this.#staged.push(operation);
      return key;
    }

    this.coordinate(() => this.performAdd(operation));
    return key;
  }

  adapterAdd(content: unknown, options?: unknown): string {
    if (!isObjectRecord(content) || !('message' in content)) {
      return this.add(content, options);
    }
    return this.add(content.message, options);
  }

  close(key: unknown, source: CloseSource): void {
    this.assertHealthy();
    if (typeof key !== 'string') {
      return;
    }

    const reserved = this.#reservedAdds.get(key);
    if (reserved) {
      reserved.canceled = true;
      this.#reservedAdds.delete(key);
      return;
    }

    if (this.#transactionActive) {
      this.#staged.push({ type: 'close', key, source });
      return;
    }

    this.coordinate(() => this.performClose(key, source));
  }

  closeRaw(rawKey: string): void {
    const opaqueKey = this.#rawToOpaque.get(rawKey);
    if (opaqueKey !== undefined) {
      this.close(opaqueKey, 'rac');
    }
  }

  clear(): void {
    this.assertHealthy();
    if (this.#transactionActive) {
      this.#staged.push({ type: 'clear' });
      return;
    }
    this.coordinate(() => this.performClear());
  }

  pauseAll(): void {
    this.assertHealthy();
    if (this.#transactionActive) {
      this.#staged.push({ type: 'manual-pause' });
      return;
    }
    this.coordinate(() => {
      this.#manualPauseDepth += 1;
      this.syncTimers();
    });
  }

  resumeAll(): void {
    this.assertHealthy();
    if (this.#transactionActive) {
      this.#staged.push({ type: 'manual-resume' });
      return;
    }
    this.coordinate(() => {
      this.#manualPauseDepth = Math.max(0, this.#manualPauseDepth - 1);
      this.syncTimers();
    });
  }

  setOwnerInteractionPaused(paused: boolean): void {
    if (this.#poisoned) {
      return;
    }
    const owner = this.#leases[0];
    if (!owner || owner.interactionPaused === paused) {
      return;
    }
    owner.interactionPaused = paused;
    this.syncTimers();
  }

  registerLease(id: symbol): () => void {
    if (!this.#leases.some((lease) => lease.id === id)) {
      this.#leases.push({ id, interactionPaused: false });
      this.diagnoseMultipleOwners();
      this.notifyRenderers();
      this.syncTimers();
    }

    let active = true;
    return () => {
      if (!active) {
        return;
      }
      active = false;
      const index = this.#leases.findIndex((lease) => lease.id === id);
      if (index < 0) {
        return;
      }
      this.#leases.splice(index, 1);
      this.notifyRenderers();
      this.syncTimers();
    };
  }

  isOwner(id: symbol): boolean {
    return this.#leases[0]?.id === id;
  }

  subscribeRenderer(callback: () => void): () => void {
    this.#renderListeners.add(callback);
    return () => this.#renderListeners.delete(callback);
  }

  get announcements(): AnnouncementSnapshot {
    return this.#announcementSnapshot;
  }

  consumeAnnouncements(version: number): void {
    if (this.#announcementSnapshot.version !== version) {
      return;
    }
    this.#announcementSnapshot = {
      version,
      ordered: [],
      polite: [],
      assertive: [],
    };
  }

  debugSnapshot(): ToastDebugSnapshot {
    return {
      adapter: this.adapter,
      generation: this.#generation,
      records: this.#records,
      forwardMap: this.#opaqueToRaw,
      reverseMap: this.#rawToOpaque,
      manualPauseDepth: this.#manualPauseDepth,
      leaseCount: this.#leases.length,
      timerCount: this.#timers.size,
      callbackCount: this.#callbacks.size,
      announcementCount: this.#announced.size,
      announcementKeys: this.#announcementSnapshot.ordered.map((record) => record.key),
      poisoned: this.#poisoned,
    };
  }

  setRawFactory(factory: () => RawQueue): void {
    this.#rawFactory = factory;
  }

  replaceGenerationForTesting(generation: RawQueue): void {
    this.#generation = generation;
  }

  private assertHealthy(): void {
    if (this.#poisoned) {
      throw new Error(POISONED_ERROR);
    }
  }

  private allocateKey(): string {
    this.#nextKey += 1;
    return `tale-toast-${this.#nextKey}`;
  }

  private coordinate(operation: () => void): void {
    this.#transactionActive = true;
    const errors: unknown[] = [];
    try {
      try {
        operation();
      } catch (error) {
        errors.push(error);
      }

      while (!this.#poisoned && this.#staged.length > 0) {
        const staged = this.#staged.shift()!;
        try {
          this.performStaged(staged);
        } catch (error) {
          errors.push(error);
        }
      }
    } finally {
      this.#transactionActive = false;
      this.#reservedAdds.clear();
      if (this.#poisoned) {
        this.#staged = [];
      }
    }

    if (errors.length > 0) {
      const [onlyError] = errors;
      if (
        errors.length === 1 &&
        onlyError instanceof Error &&
        onlyError.message.startsWith('Tale UI: Toast ')
      ) {
        throw onlyError;
      }
      throw orderedError(
        errors,
        'Tale UI: Toast transaction and staged operations failed; correct the reported operation failures before retrying.',
      );
    }
  }

  private performStaged(operation: StagedOperation): void {
    switch (operation.type) {
      case 'add':
        this.#reservedAdds.delete(operation.key);
        if (!operation.canceled) {
          this.performAdd(operation);
        }
        break;
      case 'close':
        this.performClose(operation.key, operation.source);
        break;
      case 'clear':
        this.performClear();
        break;
      case 'manual-pause':
        this.#manualPauseDepth += 1;
        this.syncTimers();
        break;
      case 'manual-resume':
        this.#manualPauseDepth = Math.max(0, this.#manualPauseDepth - 1);
        this.syncTimers();
        break;
    }
  }

  private performAdd(operation: Extract<StagedOperation, { type: 'add' }>): void {
    const previousRecords = [...this.#records];
    const previousAnnouncements = this.#announcementSnapshot;
    let publicationRollbackAttempted = false;
    const record: TaleToastRecord = Object.freeze({
      key: operation.key,
      message: operation.message,
    });
    const timer: ToastTimerState = {
      timeout: operation.options.timeout,
      remaining: operation.options.timeout,
      timerId: null,
      timerStartedAt: null,
      timerGeneration: 0,
    };
    const rawRecord: RawToastRecord = Object.freeze({
      opaqueKey: record.key,
      message: record.message,
    });
    let rawKey: string;

    try {
      // Deliberately one argument: upstream timers and callbacks never own Tale lifecycle.
      rawKey = this.#generation.add(rawRecord);
    } catch (rawError) {
      throw this.recoverOrPoison(rawError, previousRecords);
    }

    try {
      if (this.#rawToOpaque.has(rawKey)) {
        throw new Error(
          'Tale UI: Toast raw add returned a duplicate key; the previous queue state was restored.',
        );
      }
      this.#opaqueToRaw.set(record.key, rawKey);
      this.#rawToOpaque.set(rawKey, record.key);
      this.#records.unshift(record);
      this.#timers.set(record.key, timer);
      if (operation.options.callback) {
        this.#callbacks.set(record.key, operation.options.callback);
      }
      this.alignAdapterSnapshot();
      this.verifyInvariants();
      this.stageFirstAnnouncements();
      const subscriberErrors = this.publish();

      if (subscriberErrors.length > 0) {
        publicationRollbackAttempted = true;
        try {
          this.rollbackAddedRecord(record, rawKey, previousRecords, previousAnnouncements);
        } catch (rollbackError) {
          throw orderedError(
            [...subscriberErrors, rollbackError],
            'Tale UI: Toast add publication failed and rollback publication also failed; the previous queue state was restored. Correct the subscriber before retrying.',
          );
        }
        throw orderedError(
          subscriberErrors,
          'Tale UI: Toast add publication failed and the previous queue state was restored; correct the subscriber before retrying.',
        );
      }

      this.syncTimers();
    } catch (error) {
      if (publicationRollbackAttempted) {
        throw error;
      }
      if (this.#records.includes(record)) {
        try {
          this.rollbackAddedRecord(record, rawKey, previousRecords, previousAnnouncements);
        } catch (rollbackError) {
          throw orderedError(
            [error, rollbackError],
            'Tale UI: Toast add failed and recovery also failed.',
          );
        }
      } else {
        throw this.recoverOrPoison(error, previousRecords);
      }
      throw error;
    }
  }

  private rollbackAddedRecord(
    record: TaleToastRecord,
    rawKey: string,
    previousRecords: TaleToastRecord[],
    previousAnnouncements: AnnouncementSnapshot,
  ): void {
    this.cancelTimer(record);
    this.#timers.delete(record.key);
    this.#callbacks.delete(record.key);
    this.#announced.delete(record.key);
    let cleanupError: unknown;
    try {
      this.#generation.close(rawKey);
    } catch (error) {
      cleanupError = error;
    }

    this.#records = previousRecords;
    this.#opaqueToRaw.delete(record.key);
    this.#rawToOpaque.delete(rawKey);
    this.#announcementSnapshot = previousAnnouncements;
    if (cleanupError !== undefined) {
      throw this.recoverOrPoison(cleanupError, previousRecords);
    }
    this.alignAdapterSnapshot();
    this.verifyInvariants();
    const recoveryPublicationErrors = this.publish();
    this.syncTimers();
    if (recoveryPublicationErrors.length > 0) {
      throw orderedError(
        recoveryPublicationErrors,
        'Tale UI: Toast add rollback publication failed.',
      );
    }
  }

  private performClose(key: string, source: CloseSource): void {
    const record = this.#records.find((candidate) => candidate.key === key);
    const rawKey = this.#opaqueToRaw.get(key);
    if (!record || rawKey === undefined) {
      return;
    }

    const previousRecords = [...this.#records];
    try {
      this.#generation.close(rawKey);
    } catch (rawError) {
      const recoveredError = this.recoverOrPoison(rawError, previousRecords);
      if (source === 'timer' && !this.#poisoned) {
        this.syncTimers();
      }
      throw recoveredError;
    }

    this.#records = this.#records.filter((candidate) => candidate !== record);
    this.#opaqueToRaw.delete(key);
    this.#rawToOpaque.delete(rawKey);
    const callback = this.#callbacks.get(record.key);
    this.cancelTimer(record);
    this.#timers.delete(record.key);
    this.#callbacks.delete(record.key);
    this.#announced.delete(record.key);
    this.alignAdapterSnapshot();
    this.verifyInvariants();
    this.removePendingAnnouncement(record.key);
    const errors = this.publish();
    this.syncTimers();
    if (callback) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      throw orderedError(errors, 'Tale UI: Toast close committed with observer errors.');
    }
  }

  private performClear(): void {
    if (this.#records.length === 0) {
      return;
    }
    const previousRecords = [...this.#records];
    try {
      this.#generation.clear();
    } catch (rawError) {
      throw this.recoverOrPoison(rawError, previousRecords);
    }

    const callbacks = [...this.#records]
      .reverse()
      .map((record) => this.#callbacks.get(record.key))
      .filter((callback): callback is () => void => callback !== undefined);
    for (const record of this.#records) {
      this.cancelTimer(record);
    }
    this.#records = [];
    this.#timers.clear();
    this.#callbacks.clear();
    this.#announced.clear();
    this.#opaqueToRaw.clear();
    this.#rawToOpaque.clear();
    this.alignAdapterSnapshot();
    this.verifyInvariants();
    this.clearAnnouncementBatch();
    const errors = this.publish();

    for (const callback of callbacks) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      throw orderedError(errors, 'Tale UI: Toast clear committed with observer errors.');
    }
  }

  private recoverOrPoison(rawError: unknown, records: TaleToastRecord[]): unknown {
    try {
      const recoveryPublicationErrors = this.rebuild(records);
      const errors = [rawError, ...recoveryPublicationErrors];
      return recoveryError(
        errors,
        'Tale UI: Toast operation failed and the previous queue state was restored; correct the upstream queue failure before retrying.',
      );
    } catch (rebuildError) {
      return this.poisonReset(rawError, rebuildError, records);
    }
  }

  private rebuild(records: TaleToastRecord[]): unknown[] {
    const generation = this.#rawFactory();
    const opaqueToRaw = new Map<string, string>();
    const rawToOpaque = new Map<string, string>();

    for (const record of [...records].reverse()) {
      const rawRecord: RawToastRecord = Object.freeze({
        opaqueKey: record.key,
        message: record.message,
      });
      // Deliberately one argument during replay as well.
      const rawKey = generation.add(rawRecord);
      if (rawToOpaque.has(rawKey)) {
        throw new Error('Tale UI: Toast recovery received a duplicate raw key.');
      }
      opaqueToRaw.set(record.key, rawKey);
      rawToOpaque.set(rawKey, record.key);
    }

    this.#generation = generation;
    this.#records = [...records];
    this.#opaqueToRaw = opaqueToRaw;
    this.#rawToOpaque = rawToOpaque;
    this.alignAdapterSnapshot();
    this.verifyInvariants();
    const errors = this.publish();
    this.syncTimers();
    return errors;
  }

  private poisonReset(
    originalError: unknown,
    rebuildError: unknown,
    discardedRecords: TaleToastRecord[],
  ): unknown {
    this.#poisoned = true;
    const callbacks = [...discardedRecords]
      .reverse()
      .map((record) => this.#callbacks.get(record.key))
      .filter((callback): callback is () => void => callback !== undefined);
    for (const record of discardedRecords) {
      this.cancelTimer(record);
    }
    this.#records = [];
    this.#timers.clear();
    this.#callbacks.clear();
    this.#announced.clear();
    this.#opaqueToRaw.clear();
    this.#rawToOpaque.clear();
    this.adapter.visibleToasts = [];
    this.clearAnnouncementBatch();
    const errors: unknown[] = [originalError, rebuildError, ...this.publish()];

    for (const callback of callbacks) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }
    return orderedError(errors, 'Tale UI: Toast queue was poison-reset.');
  }

  private alignAdapterSnapshot(): void {
    this.adapter.visibleToasts = this.#generation.visibleToasts;
  }

  private verifyInvariants(): void {
    if (
      this.#records.length !== this.#opaqueToRaw.size ||
      this.#records.length !== this.#rawToOpaque.size
    ) {
      throw new Error('Tale UI: Toast mirror cardinality invariant failed.');
    }

    for (const record of this.#records) {
      const rawKey = this.#opaqueToRaw.get(record.key);
      if (rawKey === undefined || this.#rawToOpaque.get(rawKey) !== record.key) {
        throw new Error('Tale UI: Toast forward/reverse mapping invariant failed.');
      }
      if (!this.#timers.has(record.key)) {
        throw new Error('Tale UI: Toast timer ownership invariant failed.');
      }
    }

    const currentKeys = new Set(this.#records.map((record) => record.key));
    for (const key of this.#timers.keys()) {
      if (!currentKeys.has(key)) {
        throw new Error('Tale UI: Toast removed timer ownership invariant failed.');
      }
    }
    for (const key of this.#callbacks.keys()) {
      if (!currentKeys.has(key)) {
        throw new Error('Tale UI: Toast removed callback ownership invariant failed.');
      }
    }
    for (const key of this.#announced) {
      if (!currentKeys.has(key)) {
        throw new Error('Tale UI: Toast removed announcement ownership invariant failed.');
      }
    }

    if (this.adapter.visibleToasts !== this.#generation.visibleToasts) {
      throw new Error('Tale UI: Toast stable adapter snapshot identity invariant failed.');
    }

    const expectedVisible = this.#records.slice(0, this.maxVisibleToasts);
    if (this.adapter.visibleToasts.length !== expectedVisible.length) {
      throw new Error('Tale UI: Toast visible partition length invariant failed.');
    }
    for (let index = 0; index < expectedVisible.length; index += 1) {
      const raw = this.adapter.visibleToasts[index];
      const expected = expectedVisible[index];
      if (!raw || !expected || this.#rawToOpaque.get(raw.key) !== expected.key) {
        throw new Error('Tale UI: Toast visible partition order invariant failed.');
      }
    }
  }

  private publish(): unknown[] {
    const errors = this.adapter.publish();
    this.notifyRenderers();
    return errors;
  }

  private notifyRenderers(): void {
    for (const callback of [...this.#renderListeners]) {
      try {
        callback();
      } catch {
        // React-owned renderer notifications are best-effort and are not consumer subscribers.
      }
    }
  }

  private stageFirstAnnouncements(): void {
    const visibleKeys = new Set(
      this.#records.slice(0, this.maxVisibleToasts).map((record) => record.key),
    );
    const newlyVisible = this.#records.filter(
      (record) => visibleKeys.has(record.key) && !this.#announced.has(record.key),
    );
    for (const record of newlyVisible) {
      this.#announced.add(record.key);
    }

    const ordered = [...this.#announcementSnapshot.ordered, ...newlyVisible];
    this.#announcementVersion += 1;
    this.#announcementSnapshot = {
      version: this.#announcementVersion,
      ordered,
      polite: ordered.filter(
        (record) => record.message.variant === 'neutral' || record.message.variant === 'success',
      ),
      assertive: ordered.filter(
        (record) => record.message.variant === 'warning' || record.message.variant === 'danger',
      ),
    };
  }

  private removePendingAnnouncement(key: string): void {
    const ordered = this.#announcementSnapshot.ordered.filter((record) => record.key !== key);
    this.#announcementVersion += 1;
    this.#announcementSnapshot = {
      version: this.#announcementVersion,
      ordered,
      polite: ordered.filter(
        (record) => record.message.variant === 'neutral' || record.message.variant === 'success',
      ),
      assertive: ordered.filter(
        (record) => record.message.variant === 'warning' || record.message.variant === 'danger',
      ),
    };
  }

  private clearAnnouncementBatch(): void {
    this.#announcementVersion += 1;
    this.#announcementSnapshot = {
      version: this.#announcementVersion,
      ordered: [],
      polite: [],
      assertive: [],
    };
  }

  private isPaused(): boolean {
    return (
      this.#manualPauseDepth > 0 ||
      this.#leases.length === 0 ||
      this.#leases[0]?.interactionPaused === true
    );
  }

  private syncTimers(): void {
    const visible = new Set(
      this.#records.slice(0, this.maxVisibleToasts).map((record) => record.key),
    );
    const paused = this.isPaused();
    for (const record of this.#records) {
      const timer = this.#timers.get(record.key);
      if (!timer) {
        continue;
      }
      if (!visible.has(record.key) || paused || timer.timeout === 0) {
        this.pauseTimer(record);
      } else {
        this.resumeTimer(record);
      }
    }
  }

  private pauseTimer(record: TaleToastRecord): void {
    const timer = this.#timers.get(record.key);
    if (!timer || timer.timerId === null) {
      return;
    }
    clearTimeout(timer.timerId);
    timer.timerId = null;
    if (timer.timerStartedAt !== null) {
      timer.remaining = Math.max(0, timer.remaining - (monotonicNow() - timer.timerStartedAt));
      timer.timerStartedAt = null;
    }
    timer.timerGeneration += 1;
  }

  private resumeTimer(record: TaleToastRecord): void {
    const timer = this.#timers.get(record.key);
    if (!timer || timer.timerId !== null || timer.timeout === 0) {
      return;
    }
    const generation = timer.timerGeneration + 1;
    timer.timerGeneration = generation;
    timer.timerStartedAt = monotonicNow();
    const delay = Math.min(MAX_TIMER_DELAY, Math.max(0, timer.remaining));
    timer.timerId = setTimeout(() => {
      if (timer.timerGeneration !== generation || !this.#records.includes(record)) {
        return;
      }
      const elapsed = timer.timerStartedAt === null ? delay : monotonicNow() - timer.timerStartedAt;
      timer.timerId = null;
      timer.timerStartedAt = null;
        timer.remaining = Math.max(0, timer.remaining - Math.max(delay, elapsed));
      if (timer.remaining > 0) {
        this.resumeTimer(record);
        return;
      }
      try {
        this.close(record.key, 'timer');
      } catch {
        // Code-only diagnostics avoid disclosing consumer message data.
        console.error('Tale UI: Toast timer close failed.');
      }
    }, delay);
  }

  private cancelTimer(record: TaleToastRecord): void {
    const timer = this.#timers.get(record.key);
    if (!timer) {
      return;
    }
    if (timer.timerId !== null) {
      clearTimeout(timer.timerId);
    }
    timer.timerId = null;
    timer.timerStartedAt = null;
    timer.timerGeneration += 1;
  }

  private diagnoseMultipleOwners(): void {
    if (process.env.NODE_ENV === 'production' || this.#leases.length < 2) {
      return;
    }
    const pair = this.#leases
      .slice(0, 2)
      .map((lease) => lease.id.description ?? 'ToastRegion')
      .join(':');
    if (this.#diagnosedLeasePairs.has(pair)) {
      return;
    }
    this.#diagnosedLeasePairs.add(pair);
    console.error(
      'Tale UI: Toast queue has multiple mounted ToastRegion owners; only the oldest lease renders.',
    );
  }
}

/**
 * Creates a Tale-owned Toast queue with stable React Aria adaptation.
 *
 * @status experimental
 */
export function createToastQueue(options?: CreateToastQueueOptions): ToastQueue {
  const controller = new ToastController(normalizeQueueOptions(options));
  queueInternals.set(controller.facade as object, controller);
  return controller.facade;
}

function isValidLabel(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizePlacement(value: unknown): ToastPlacement {
  return value === 'top-start' ||
    value === 'top-end' ||
    value === 'bottom-start' ||
    value === 'bottom-end'
    ? value
    : 'bottom-end';
}

function ToastAnnouncement({
  records,
  politeness,
}: {
  records: readonly TaleToastRecord[];
  politeness: 'polite' | 'assertive';
}) {
  return (
    <div
      className="tale-toast__announcer"
      aria-live={politeness}
      aria-atomic="false"
      data-toast-announcer={politeness}
    >
      {records.map((record) => (
        <div key={record.key}>
          {record.message.title}
          {record.message.description ? `: ${record.message.description}` : ''}
        </div>
      ))}
    </div>
  );
}

function RawToastView({ toast, dismissLabel }: { toast: RawQueuedToast; dismissLabel: string }) {
  return (
    <AriaToast toast={toast} className="tale-toast" data-variant={toast.content.message.variant}>
      <div className="tale-toast__content">
        <AriaText slot="title" className="tale-toast__title">
          {toast.content.message.title}
        </AriaText>
        {toast.content.message.description === undefined ? null : (
          <AriaText slot="description" className="tale-toast__description">
            {toast.content.message.description}
          </AriaText>
        )}
      </div>
      <AriaButton slot="close" className="tale-toast__dismiss" aria-label={dismissLabel}>
        ×
      </AriaButton>
    </AriaToast>
  );
}

function OwnedToastRegion({
  controller,
  leaseId,
  regionLabel,
  dismissLabel,
  placement,
  className,
  forwardedRef,
}: {
  controller: ToastController;
  leaseId: symbol;
  regionLabel: string;
  dismissLabel: string;
  placement: ToastPlacement;
  className?: string;
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const announcements = controller.announcements;
  const [presentedAnnouncementVersion, setPresentedAnnouncementVersion] = React.useState<
    number | null
  >(null);
  const presentAnnouncements = presentedAnnouncementVersion === announcements.version;

  React.useEffect(() => {
    setPresentedAnnouncementVersion(announcements.version);
  }, [announcements.version]);

  React.useEffect(() => {
    if (!presentAnnouncements) {
      return;
    }
    controller.consumeAnnouncements(announcements.version);
  }, [announcements.version, controller, presentAnnouncements]);

  if (!controller.isOwner(leaseId)) {
    return null;
  }

  return (
    <AriaToastRegion
      ref={forwardedRef}
      queue={controller.adapter}
      aria-label={regionLabel}
      data-placement={placement}
      className={cx('tale-toast-region', className)}
    >
      <ToastAnnouncement
        records={presentAnnouncements ? announcements.polite : []}
        politeness="polite"
      />
      <ToastAnnouncement
        records={presentAnnouncements ? announcements.assertive : []}
        politeness="assertive"
      />
      <AriaToastList className="tale-toast-list">
        {({ toast }) => (
          <RawToastView toast={toast as RawQueuedToast} dismissLabel={dismissLabel} />
        )}
      </AriaToastList>
    </AriaToastRegion>
  );
}

/**
 * Renders the active lease for a Tale-owned Toast queue.
 *
 * SSR and the first hydration pass intentionally render no Region.
 *
 * @status experimental
 *
 * @example
 * ```tsx
 * import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';
 *
 * const queue = createToastQueue();
 * queue.add({ title: 'Saved', variant: 'success' });
 *
 * <ToastRegion queue={queue} />
 * ```
 */
export const ToastRegion = React.forwardRef<HTMLDivElement, ToastRegionProps>(
  (runtimeProps, ref) => {
    const { formatMessage } = useTaleI18n();
    const leaseId = React.useRef(Symbol('ToastRegion')).current;
    const [, forceRender] = React.useReducer((value: number) => value + 1, 0);
    const propRecord = runtimeProps as unknown as Record<string, unknown>;
    const runtimeQueue = readPropertyOnce(propRecord, 'queue', 'Region render');
    const runtimeRegionLabel = readPropertyOnce(propRecord, 'aria-label', 'Region render');
    const runtimeDismissLabel = readPropertyOnce(propRecord, 'dismissLabel', 'Region render');
    const runtimeClassName = readPropertyOnce(propRecord, 'className', 'Region render');
    const runtimePlacement = readPropertyOnce(propRecord, 'placement', 'Region render');
    const controller = queueInternals.get(runtimeQueue as object);

    React.useEffect(() => {
      if (!controller) {
        return;
      }
      const unsubscribeRenderer = controller.subscribeRenderer(forceRender);
      const unregisterLease = controller.registerLease(leaseId);
      return () => {
        unsubscribeRenderer();
        unregisterLease();
      };
    }, [controller, leaseId]);

    if (!controller || !controller.isOwner(leaseId)) {
      return null;
    }

    const regionLabel = isValidLabel(runtimeRegionLabel)
      ? runtimeRegionLabel
      : formatMessage('toast.region');
    const dismissLabel = isValidLabel(runtimeDismissLabel)
      ? runtimeDismissLabel
      : formatMessage('toast.dismiss');
    const className = typeof runtimeClassName === 'string' ? runtimeClassName : undefined;

    return (
      <OwnedToastRegion
        controller={controller}
        leaseId={leaseId}
        regionLabel={regionLabel}
        dismissLabel={dismissLabel}
        placement={normalizePlacement(runtimePlacement)}
        className={className}
        forwardedRef={ref}
      />
    );
  },
);
ToastRegion.displayName = 'ToastRegion';

/**
 * Private test seam. It is intentionally not re-exported from the Toast package subpath.
 */
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention -- Private, deliberately non-public test and benchmark seam.
export const __toastTestHooks = {
  get(queue: ToastQueue): ToastDebugSnapshot | null {
    return queueInternals.get(queue as object)?.debugSnapshot() ?? null;
  },
  setRawFactory(queue: ToastQueue, factory: () => RawQueue): void {
    queueInternals.get(queue as object)?.setRawFactory(factory);
  },
  replaceGeneration(queue: ToastQueue, generation: RawQueue): void {
    queueInternals.get(queue as object)?.replaceGenerationForTesting(generation);
  },
};
