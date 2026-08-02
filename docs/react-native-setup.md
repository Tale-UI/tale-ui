# React Native setup

`@tale-ui/foundations` and `@tale-ui/react-native` are workspace-supported
experimental packages. The current repository publication workflow does not
publish them, so use workspace links or the clean packed-consumer fixture
rather than a registry installation command.

Within the workspace or packed fixture, wrap the application once:

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

The package currently has 40 experimental implementation subpaths. `RadioField`
is a completed native-alternative disposition with no native implementation;
use `RadioGroup` only for native option selection and let the application own
the surrounding field contract.

See the tracked
[`React Native Compatibility Matrix`](../analysis/react-native-layer/React%20Native%20Compatibility%20Matrix.md)
for the current compatibility line.
