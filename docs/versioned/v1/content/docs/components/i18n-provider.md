# I18nProvider

`import { I18nProvider, useLocale } from '@tale-ui/react/i18n-provider';`

Sets the locale and text direction (LTR/RTL) for all Tale UI components. Wraps React Aria's `I18nProvider`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `string` | Browser default | BCP 47 locale string (e.g. `"en-US"`, `"ar-AE"`, `"ja-JP"`) |
| `children` | `ReactNode` | — | App content |

## Basic Usage

Wrap your app root to set the locale for all Tale UI components:

```tsx
import { I18nProvider } from '@tale-ui/react/i18n-provider';

<I18nProvider locale="en-US">
  <App />
</I18nProvider>
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
  return <p>Locale: {locale}, Direction: {direction}</p>;
}
```

## Notes

- If omitted, Tale UI uses the browser's default locale.
- This provider affects date/time formatting (Calendar, DatePicker, DateRangePicker, TimeField), number formatting (NumberField, Slider), and text direction for all components.
- Place `I18nProvider` at or near the root of your React tree, above any Tale UI components.
