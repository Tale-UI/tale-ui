# @tale-ui/react-native

Tale UI components for React Native.

```tsx
import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { Button } from '@tale-ui/react-native/button';
import { TaleProvider } from '@tale-ui/react-native/provider';

export function App() {
  return (
    <TaleProvider theme={harbourTheme}>
      <Button onPress={() => {}}>Continue</Button>
    </TaleProvider>
  );
}
```

Expo is not required by this package.
