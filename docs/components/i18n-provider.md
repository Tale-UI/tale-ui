# I18nProvider

`import { I18nProvider, useLocale, useTaleI18n } from '@tale-ui/react/i18n-provider';`

Sets locale and direction through React Aria and provides Tale-owned
operational messages with explicit fallback, override, pseudo-locale, and RTL
QA behavior. Application copy remains owned by the application.

## Props

| Prop             | Type                                 | Default     | Description                                                        |
| ---------------- | ------------------------------------ | ----------- | ------------------------------------------------------------------ |
| `locale`         | `string`                             | `"en-US"`   | BCP 47 locale string (for example `"en-US"`, `"ar-AE"`, `"ja-JP"`) |
| `catalogs`       | `Record<string, TaleMessageCatalog>` | `{}`        | Locale and language catalogs for Tale operational message IDs      |
| `messages`       | `TaleMessageCatalog`                 | `{}`        | Highest-precedence overrides scoped to this provider               |
| `fallbackLocale` | `string`                             | `"en-US"`   | Catalog checked before built-in English                            |
| `mode`           | `"default" \| "pseudo" \| "rtl"`     | `"default"` | Deterministic localization QA mode                                 |
| `children`       | `ReactNode`                          | —           | App content                                                        |

## Basic Usage

Wrap your app root to set the locale for all Tale UI components:

```tsx
import { I18nProvider } from '@tale-ui/react/i18n-provider';

<I18nProvider locale="en-US">
  <App />
</I18nProvider>;
```

### RTL Support

Pass an RTL locale and text direction is applied automatically:

```tsx
<I18nProvider locale="ar-AE">
  <App />
</I18nProvider>
```

### Reading the Current Locale

Use the `useLocale` hook inside the provider tree:

```tsx
import { useLocale } from '@tale-ui/react/i18n-provider';

function LocaleDisplay() {
  const { locale, direction } = useLocale();
  return (
    <p>
      Locale: {locale}, Direction: {direction}
    </p>
  );
}
```

### Formatting Tale operational messages

`useTaleI18n` formats only stable Tale-owned messages such as loading, empty,
pagination, and control labels. Interpolated values are wrapped in Unicode
bidi-isolation marks and returned as plain text. Missing values keep their
placeholder visible.

```tsx
import { useTaleI18n } from '@tale-ui/react/i18n-provider';

function PageStatus() {
  const { formatMessage } = useTaleI18n();
  return <output>{formatMessage('table.page', { page: 2, pageCount: 8 })}</output>;
}
```

Resolution order is provider `messages`, exact-locale catalog, language
catalog, `fallbackLocale` catalog, then built-in English.

### Localization QA

```tsx
<I18nProvider mode="pseudo">
  <App />
</I18nProvider>

<I18nProvider mode="rtl">
  <App />
</I18nProvider>
```

Pseudo mode uses `en-XA`, accent expansion, and visible brackets. RTL mode uses
`ar-XB` so direction can be tested without claiming an Arabic translation.
Both modes are deterministic across SSR and hydration.

### Contributing a catalog

Catalogs follow `schemas/i18n-catalog.schema.json`. A contribution must:

1. preserve the complete stable message-ID set;
2. keep `{placeholder}` names unchanged;
3. contain Tale component operations only, never product/application copy;
4. pass pseudo-locale, RTL, interpolation, and SSR tests; and
5. include translator context for any newly proposed ID.

## Pitfalls

<!-- pitfall: i18n-provider-no-application-copy -->

- **Do not put application copy in `I18nProvider` catalogs** — catalogs are limited to Tale-owned operational labels and statuses.
  - anti-pattern: `<I18nProvider messages={{ 'product.welcome': 'Welcome back' }}>`
  - fix: `<Text>{appMessages.welcome}</Text>`

## Notes

- The built-in locale is English; pass `locale` explicitly when the app uses another locale.
- This provider affects date/time formatting (Calendar, DatePicker, DateRangePicker, TimeField), number formatting (NumberField, Slider), and text direction for all components.
- Place `I18nProvider` at or near the root of your React tree, above any Tale UI components.
- Catalog text is rendered as text; Tale UI does not accept or render catalog HTML.
