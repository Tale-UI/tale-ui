export type SafeUrlProtocol = 'http:' | 'https:' | 'mailto:';

export interface SafeUrlOptions {
  /** Protocols accepted after WHATWG URL parsing. */
  protocols: readonly SafeUrlProtocol[];
  /** An already-validated, absolute HTTP(S) base for relative input. */
  baseUrl?: string | undefined;
  /** Whether a same-document fragment is valid without a base URL. */
  allowFragment?: boolean | undefined;
  /** Preserve an explicit absolute URL instead of returning its normalized href. */
  preserveAbsoluteInput?: boolean | undefined;
}

const ABSOLUTE_SCHEME = /^[A-Za-z][A-Za-z\d+.-]*:/;
const FRAGMENT_VALIDATION_BASE = 'https://tale.invalid/';

function containsControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) {
      return true;
    }
  }

  return false;
}

/**
 * Parses a URL at Tale's shared WHATWG trust boundary.
 *
 * Relative and protocol-relative input is accepted only when the caller supplies
 * a validated explicit base. This function never consults browser location.
 */
export function getSafeUrl(value: unknown, options: SafeUrlOptions): string | undefined {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.trim() !== value ||
    containsControlCharacter(value)
  ) {
    return undefined;
  }

  if (value.startsWith('#')) {
    if (options.allowFragment) {
      try {
        // Validate with WHATWG URL semantics without introducing an ambient origin.
        const url = new URL(value, FRAGMENT_VALIDATION_BASE);
        void url;
        return value;
      } catch {
        return undefined;
      }
    }

    if (options.baseUrl === undefined) {
      return undefined;
    }
  }

  const hasAbsoluteScheme = ABSOLUTE_SCHEME.test(value);
  if (!hasAbsoluteScheme && options.baseUrl === undefined) {
    return undefined;
  }

  try {
    const url = options.baseUrl === undefined ? new URL(value) : new URL(value, options.baseUrl);

    if (
      !options.protocols.includes(url.protocol as SafeUrlProtocol) ||
      url.username !== '' ||
      url.password !== ''
    ) {
      return undefined;
    }

    return options.preserveAbsoluteInput && hasAbsoluteScheme ? value : url.href;
  } catch {
    return undefined;
  }
}
