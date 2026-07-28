# React Native setup

Install the native package, foundations, tokens, and compatible peers:

```bash
pnpm add @tale-ui/react-native @tale-ui/foundations @tale-ui/tokens react react-native
```

Wrap the application once:

```tsx
import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { TaleProvider } from '@tale-ui/react-native/provider';

export function App() {
  return (
    <TaleProvider theme={harbourTheme} appearance="system">
      <Application />
    </TaleProvider>
  );
}
```

Import components through public subpaths. The package supports the React
Native New Architecture and does not require Expo. iOS and Android are primary
targets. React Native Web support is component-specific; use
`@tale-ui/react` for DOM-first applications.

See `React Native Compatibility Matrix.md` in the implementation evidence for
the current compatibility line.
