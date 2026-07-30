import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { TaleProvider } from '@tale-ui/react-native/provider';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <TaleProvider theme={harbourTheme}>
      <View>
        <Text>Run with STORYBOOK_ENABLED=true to open Tale UI Native Storybook.</Text>
      </View>
    </TaleProvider>
  );
}
