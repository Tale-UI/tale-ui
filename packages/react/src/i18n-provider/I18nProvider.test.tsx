import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import englishCatalog from './catalogs/en.json';
import { I18nProvider, taleEnglishMessages, useLocale, useTaleI18n } from './index';

function Consumer() {
  const { locale, direction } = useLocale();
  const { formatMessage, mode } = useTaleI18n();
  return (
    <output>
      {locale}|{direction}|{mode}|{formatMessage('table.page', { page: 2, pageCount: 5 })}
    </output>
  );
}

describe('I18nProvider operations', () => {
  const { render, renderToString } = createRenderer();

  it('applies override, locale, language, fallback, and English precedence', async () => {
    await render(
      <I18nProvider
        locale="fr-CA"
        fallbackLocale="de"
        catalogs={{
          fr: { 'table.page': 'Page {page} sur {pageCount}' },
          de: { 'table.empty': 'Keine Zeilen' },
        }}
        messages={{ 'common.close': 'Fermer' }}
      >
        <Consumer />
      </I18nProvider>,
    );
    expect(screen.getByRole('status').textContent).toContain('fr-CA|ltr|default|Page ⁨2⁩ sur ⁨5⁩');
  });

  it('supports deterministic pseudo-locale and forced RTL QA modes', async () => {
    const view = await render(
      <I18nProvider mode="pseudo">
        <Consumer />
      </I18nProvider>,
    );
    expect(screen.getByRole('status').textContent).toContain('en-XA|ltr|pseudo|[Págë ⁨2⁩ öf ⁨5⁩');
    view.unmount();

    await render(
      <I18nProvider mode="rtl">
        <Consumer />
      </I18nProvider>,
    );
    const rtlStatus = screen.getByRole('status');
    expect(rtlStatus.textContent).toContain('ar-XB|rtl|rtl|');
    expect(rtlStatus.closest('[dir="rtl"]')).not.toBeNull();
  });

  it('preserves locale and message output across SSR and hydration', () => {
    const view = renderToString(
      <I18nProvider locale="ar-AE">
        <Consumer />
      </I18nProvider>,
    );
    expect(screen.getByRole('status').textContent).toContain('ar-AE|rtl|default|');
    const hydrated = view.hydrate();
    expect(screen.getByRole('status').textContent).toContain('ar-AE|rtl|default|');
    hydrated.unmount();
  });

  it('keeps the runtime English catalog aligned with the contribution artifact', () => {
    expect(englishCatalog.messages).toEqual(taleEnglishMessages);
  });
});
