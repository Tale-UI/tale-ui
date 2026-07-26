import * as React from 'react';
import { warn } from '@tale-ui/utils/warn';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

type RuntimeUnsafeHtmlProps = {
  dangerouslySetInnerHTML?: unknown;
};

type NormalizedCitationSource = Readonly<{
  id: string;
  title: string;
  href?: string;
  resolvedHref?: string;
  author?: string;
  publisher?: string;
  publishedAt?: string;
  normalizedPublishedAt?: string;
}>;

type NormalizedCitationRegistry = Readonly<{
  rootId: string;
  sources: readonly NormalizedCitationSource[];
  sourcesById: ReadonlyMap<string, Readonly<{ ordinal: number; source: NormalizedCitationSource }>>;
}>;

const CitationContext = React.createContext<NormalizedCitationRegistry | null>(null);
const ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;
const OFFSET_TIMESTAMP_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.(\d{1,9}))?(Z|([+-])(\d{2}):(\d{2}))$/;

export interface CitationSource {
  id: string;
  title: string;
  href?: string;
  author?: string;
  publisher?: string;
  publishedAt?: string;
}

export interface CitationRootProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'id'>
> {
  id: string;
  sources: readonly CitationSource[];
  baseUrl?: string;
  children: React.ReactNode;
}

export interface CitationReferenceProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLElement>, 'children'>
> {
  sourceId: string;
  children?: React.ReactNode;
}

export interface CitationListProps extends SafeDomProps<
  Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children' | 'reversed' | 'start' | 'type'>
> {
  emptyFallback?: React.ReactNode;
}

function isValidId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && ID_PATTERN.test(value);
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

function parseSafeHttpUrl(value: unknown, baseUrl?: string): string | undefined {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.trim() !== value ||
    containsControlCharacter(value)
  ) {
    return undefined;
  }

  try {
    const url = baseUrl === undefined ? new URL(value) : new URL(value, baseUrl);
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      url.username !== '' ||
      url.password !== ''
    ) {
      return undefined;
    }

    return url.href;
  } catch {
    return undefined;
  }
}

function normalizeBaseUrl(value: unknown): string | undefined {
  return parseSafeHttpUrl(value);
}

function normalizeOptionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function normalizePublishedAt(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }

  const match = OFFSET_TIMESTAMP_PATTERN.exec(value);
  if (match === null) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const fractionalMilliseconds = Number(`0.${match[8] ?? ''}`) * 1000;
  const offsetHour = match[11] === undefined ? 0 : Number(match[11]);
  const offsetMinute = match[12] === undefined ? 0 : Number(match[12]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    offsetHour > 23 ||
    offsetMinute > 59
  ) {
    return undefined;
  }

  const local = new Date(0);
  local.setUTCFullYear(year, month - 1, day);
  local.setUTCHours(hour, minute, second, Math.floor(fractionalMilliseconds));

  if (
    local.getUTCFullYear() !== year ||
    local.getUTCMonth() !== month - 1 ||
    local.getUTCDate() !== day ||
    local.getUTCHours() !== hour ||
    local.getUTCMinutes() !== minute ||
    local.getUTCSeconds() !== second
  ) {
    return undefined;
  }

  const offsetSign = match[10] === '-' ? -1 : 1;
  const offsetMilliseconds = offsetSign * (offsetHour * 60 + offsetMinute) * 60_000;
  const instant = new Date(local.getTime() - offsetMilliseconds);

  return Number.isNaN(instant.getTime()) ? undefined : instant.toISOString();
}

function normalizeRegistry(
  rootId: unknown,
  sourceInput: unknown,
  baseUrlInput: unknown,
): NormalizedCitationRegistry | null {
  if (!isValidId(rootId)) {
    return null;
  }

  let isArray: boolean;
  try {
    isArray = Array.isArray(sourceInput);
  } catch {
    return null;
  }

  if (!isArray) {
    return null;
  }

  const baseUrl = normalizeBaseUrl(baseUrlInput);
  const normalizedSources: NormalizedCitationSource[] = [];
  const seenIds = new Set<string>();

  try {
    const sources = sourceInput as readonly unknown[];
    for (let index = 0; index < sources.length; index += 1) {
      const candidate = sources[index];
      if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) {
        return null;
      }

      const record = candidate as Record<string, unknown>;
      const id = record.id;
      const title = record.title;
      const href = record.href;
      const author = record.author;
      const publisher = record.publisher;
      const publishedAt = record.publishedAt;

      if (
        !isValidId(id) ||
        typeof title !== 'string' ||
        title.trim().length === 0 ||
        seenIds.has(id)
      ) {
        return null;
      }

      const normalizedHref = typeof href === 'string' && href.length > 0 ? href : undefined;
      const normalizedPublishedAt =
        typeof publishedAt === 'string' && publishedAt.length > 0 ? publishedAt : undefined;
      const source = Object.freeze({
        id,
        title,
        ...(normalizedHref === undefined ? {} : { href: normalizedHref }),
        ...(normalizedHref === undefined
          ? {}
          : { resolvedHref: parseSafeHttpUrl(normalizedHref, baseUrl) }),
        ...(normalizeOptionalText(author) === undefined
          ? {}
          : { author: normalizeOptionalText(author) }),
        ...(normalizeOptionalText(publisher) === undefined
          ? {}
          : { publisher: normalizeOptionalText(publisher) }),
        ...(normalizedPublishedAt === undefined ? {} : { publishedAt: normalizedPublishedAt }),
        ...(normalizePublishedAt(normalizedPublishedAt) === undefined
          ? {}
          : { normalizedPublishedAt: normalizePublishedAt(normalizedPublishedAt) }),
      }) satisfies NormalizedCitationSource;

      normalizedSources.push(source);
      seenIds.add(id);
    }
  } catch {
    return null;
  }

  const immutableSources = Object.freeze(normalizedSources.slice());
  const sourcesById = new Map<
    string,
    Readonly<{ ordinal: number; source: NormalizedCitationSource }>
  >();
  immutableSources.forEach((source, index) => {
    sourcesById.set(source.id, Object.freeze({ ordinal: index + 1, source }));
  });

  return Object.freeze({
    rootId,
    sources: immutableSources,
    sourcesById,
  });
}

function stripDangerousHtml<T extends object>(props: T): T {
  const { dangerouslySetInnerHTML, ...safeProps } = props as T & RuntimeUnsafeHtmlProps;

  if (dangerouslySetInnerHTML !== undefined) {
    warn('CITATION_DANGEROUS_HTML_OMITTED');
  }

  return safeProps as T;
}

function sourceAccessibleName(ordinal: number, source: NormalizedCitationSource): string {
  return `Citation ${ordinal}: ${source.title}`;
}

/**
 * Provides an immutable, normalized source registry to citation references and lists.
 *
 * @example
 * ```tsx
 * import { Citation } from '@tale-ui/react/citation';
 *
 * <Citation.Root
 *   id="release-notes"
 *   sources={[{ id: 'spec', title: 'Platform specification', href: '/spec' }]}
 *   baseUrl="https://example.com/docs/"
 * >
 *   The platform follows the specification<Citation.Reference sourceId="spec" />.
 *   <Citation.List />
 * </Citation.Root>
 * ```
 *
 * @status experimental
 */
export const Root = React.forwardRef<HTMLDivElement, CitationRootProps>((inputProps, ref) => {
  const props = stripDangerousHtml(inputProps);
  const { id, sources, baseUrl, children, className, ...domProps } = props;
  const registry = normalizeRegistry(id, sources, baseUrl);
  const safeRootId = isValidId(id) ? id : undefined;

  if (registry === null) {
    warn('CITATION_INVALID_REGISTRY');
  }

  return (
    <CitationContext.Provider value={registry}>
      <div {...domProps} ref={ref} id={safeRootId} className={cx('tale-citation', className)}>
        {children}
      </div>
    </CitationContext.Provider>
  );
});
Root.displayName = 'Citation.Root';

/** A superscript source reference with Tale-owned target and accessible name. @status experimental */
export const Reference = React.forwardRef<HTMLElement, CitationReferenceProps>(
  (inputProps, ref) => {
    const hasExplicitChildren = Object.prototype.hasOwnProperty.call(inputProps, 'children');
    const props = stripDangerousHtml(inputProps);
    const { sourceId, children, className, 'aria-label': ignoredAriaLabel, ...domProps } = props;
    const registry = React.useContext(CitationContext);
    const record = isValidId(sourceId) ? registry?.sourcesById.get(sourceId) : undefined;

    if (ignoredAriaLabel !== undefined) {
      warn('CITATION_REFERENCE_ACCESSIBLE_NAME_OWNED');
    }

    if (record === undefined) {
      return (
        <sup
          {...domProps}
          ref={ref}
          className={cx('tale-citation__reference', className)}
          aria-label="Unavailable citation"
        >
          {hasExplicitChildren ? children : '[?]'}
        </sup>
      );
    }

    return (
      <sup {...domProps} ref={ref} className={cx('tale-citation__reference', className)}>
        <a
          className="tale-citation__reference-link"
          href={`#${registry?.rootId}-source-${record.ordinal}`}
          aria-label={sourceAccessibleName(record.ordinal, record.source)}
        >
          {hasExplicitChildren ? children : `[${record.ordinal}]`}
        </a>
      </sup>
    );
  },
);
Reference.displayName = 'Citation.Reference';

function renderSourceMetadata(source: NormalizedCitationSource): React.ReactNode {
  const items: React.ReactNode[] = [];

  if (source.author !== undefined) {
    items.push(<span key="author">{source.author}</span>);
  }
  if (source.publisher !== undefined) {
    items.push(<span key="publisher">{source.publisher}</span>);
  }
  if (source.publishedAt !== undefined) {
    items.push(
      source.normalizedPublishedAt === undefined ? (
        <span key="published-at">{source.publishedAt}</span>
      ) : (
        <time key="published-at" dateTime={source.normalizedPublishedAt}>
          {source.publishedAt}
        </time>
      ),
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <span className="tale-citation__metadata">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 ? null : <span aria-hidden="true"> · </span>}
          {item}
        </React.Fragment>
      ))}
    </span>
  );
}

/** Renders the normalized source registry in owned decimal order. @status experimental */
export const List = React.forwardRef<HTMLOListElement, CitationListProps>((inputProps, ref) => {
  const props = stripDangerousHtml(inputProps);
  const {
    emptyFallback,
    className,
    reversed: ignoredReversed,
    start: ignoredStart,
    type: ignoredType,
    ...domProps
  } = props as CitationListProps & {
    reversed?: unknown;
    start?: unknown;
    type?: unknown;
  };
  const registry = React.useContext(CitationContext);

  if (ignoredReversed !== undefined || ignoredStart !== undefined || ignoredType !== undefined) {
    warn('CITATION_LIST_NUMBERING_OWNED');
  }

  return (
    <ol {...domProps} ref={ref} className={cx('tale-citation__list', className)} start={1} type="1">
      {registry === null || registry.sources.length === 0
        ? emptyFallback
        : registry.sources.map((source, index) => {
            const ordinal = index + 1;
            const title =
              source.resolvedHref === undefined ? (
                <span className="tale-citation__title">{source.title}</span>
              ) : (
                <a className="tale-citation__title" href={source.resolvedHref}>
                  {source.title}
                </a>
              );

            return (
              <li
                key={source.id}
                id={`${registry.rootId}-source-${ordinal}`}
                className="tale-citation__source"
              >
                {title}
                {renderSourceMetadata(source)}
              </li>
            );
          })}
    </ol>
  );
});
List.displayName = 'Citation.List';
