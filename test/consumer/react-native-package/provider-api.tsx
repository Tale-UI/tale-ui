import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import {
  TaleProvider,
  useTale,
  useTaleTheme,
  type TaleProviderProps,
} from '@tale-ui/react-native/provider';
import * as React from 'react';

function ProviderHooksProbe() {
  const context = useTale();
  const theme = useTaleTheme();
  return context.theme === theme ? null : null;
}

const retainedProviderProps = {
  appearance: 'system',
  colorScheme: 'dark',
  density: 'comfortable',
  direction: 'rtl',
  locale: 'ar',
  reducedMotion: true,
  textScale: 1.5,
  theme: harbourTheme,
} satisfies TaleProviderProps;

export function ProviderApiProbe() {
  return (
    <TaleProvider {...retainedProviderProps}>
      <ProviderHooksProbe />
    </TaleProvider>
  );
}
