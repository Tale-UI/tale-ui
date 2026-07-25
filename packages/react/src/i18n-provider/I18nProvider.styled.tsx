'use client';
import * as React from 'react';
import { I18nProvider as AriaI18nProvider, useLocale } from 'react-aria-components';
import {
  interpolateMessage,
  pseudoLocalize,
  taleEnglishMessages,
  type TaleMessageCatalog,
  type TaleMessageCatalogs,
  type TaleMessageId,
  type TaleMessageValues,
} from './messages';

export interface TaleI18nContextValue {
  locale: string;
  mode: 'default' | 'pseudo' | 'rtl';
  formatMessage: (id: TaleMessageId, values?: TaleMessageValues) => string;
}

const TaleI18nContext = React.createContext<TaleI18nContextValue>({
  locale: 'en-US',
  mode: 'default',
  formatMessage(id, values) {
    return interpolateMessage(taleEnglishMessages[id], values);
  },
});

export interface I18nProviderProps {
  /** Contents that should have the locale applied. */
  children: React.ReactNode;
  /** The locale to apply to the children (e.g. `"en-US"`, `"ar-AE"`). */
  locale?: string | undefined;
  /** Locale catalogs containing Tale-owned operational strings only. */
  catalogs?: TaleMessageCatalogs | undefined;
  /** Per-provider overrides with higher precedence than locale catalogs. */
  messages?: TaleMessageCatalog | undefined;
  /** Catalog to use before the built-in English fallback. */
  fallbackLocale?: string | undefined;
  /** Pseudo-localization and forced-RTL QA modes. */
  mode?: 'default' | 'pseudo' | 'rtl' | undefined;
}

/**
 * Sets the locale and text direction for Tale UI components.
 * Wraps React Aria's `I18nProvider`.
 *
 * @example
 * ```tsx
 * import { I18nProvider } from '@tale-ui/react/i18n-provider';
 *
 * <I18nProvider locale="en-US">
 *   <App />
 * </I18nProvider>
 * ```
 */
export function I18nProvider({
  children,
  locale = 'en-US',
  catalogs = {},
  messages = {},
  fallbackLocale = 'en-US',
  mode = 'default',
}: I18nProviderProps) {
  const resolvedLocale = mode === 'pseudo' ? 'en-XA' : mode === 'rtl' ? 'ar-XB' : locale;
  const language = locale.split('-')[0]!;
  const value = React.useMemo<TaleI18nContextValue>(
    () => ({
      locale: resolvedLocale,
      mode,
      formatMessage(id, values) {
        const message =
          messages[id] ??
          catalogs[locale]?.[id] ??
          catalogs[language]?.[id] ??
          catalogs[fallbackLocale]?.[id] ??
          taleEnglishMessages[id];
        return interpolateMessage(mode === 'pseudo' ? pseudoLocalize(message) : message, values);
      },
    }),
    [catalogs, fallbackLocale, language, locale, messages, mode, resolvedLocale],
  );
  const contents =
    mode === 'rtl' ? (
      <div dir="rtl" style={{ display: 'contents' }}>
        {children}
      </div>
    ) : (
      children
    );
  return (
    <TaleI18nContext.Provider value={value}>
      <AriaI18nProvider locale={resolvedLocale}>{contents}</AriaI18nProvider>
    </TaleI18nContext.Provider>
  );
}

export function useTaleI18n() {
  return React.useContext(TaleI18nContext);
}

export { useLocale };
