import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { Button } from '@tale-ui/react-native';
import { TaleProvider } from '@tale-ui/react-native/provider';
import { Text } from '@tale-ui/react-native/text';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { ProviderApiProbe } from './provider-api';
import { getPackedNativeSurface } from './surface';

export default function App() {
  const [presses, setPresses] = React.useState(0);
  const surfaceCount = Object.keys(getPackedNativeSurface()).length;

  return (
    <TaleProvider theme={harbourTheme} appearance="system">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, gap: 16, justifyContent: 'center', padding: 24 }}>
          <Text accessibilityRole="header">Packed Tale UI consumer</Text>
          <Text>Reachable native symbols: {surfaceCount}</Text>
          <Button
            accessibilityLabel="Increment packed counter"
            onPress={() => setPresses((count) => count + 1)}
          >
            Presses: {presses}
          </Button>
          <ProviderApiProbe />
        </View>
      </SafeAreaView>
    </TaleProvider>
  );
}
