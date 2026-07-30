# @tale-ui/react-native

Workspace-supported experimental Tale UI components for React Native. The
current repository publication workflow does not publish this package.

The package exposes 40 experimental component implementations through explicit
subpaths. The following is a workspace or packed-fixture example:

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

`TaleProvider` subscribes to the device colour scheme in system mode. An
explicit `appearance` wins over the deterministic `colorScheme` injection,
which wins over the subscribed device value. `locale`, `direction`, and
provider-level `density` remain deprecated metadata-only compatibility fields.
`textScale` is a manual Tale Text multiplier, and `reducedMotion` is consumed
by motion-aware components.

The native `RadioField` subpath is intentionally absent. The earlier alias only
renamed `RadioGroup`; it did not implement the web compound contract.
Applications using `RadioGroup` own field description, validation, option
structure, accessibility, and physical verification.
