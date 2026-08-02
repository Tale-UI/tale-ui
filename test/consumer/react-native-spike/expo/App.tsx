import { getFixtureButtonLabel } from '@tale-ui/react-native-spike-fixture/button';
import { Pressable, Text, View } from 'react-native';

export default function App() {
  return (
    <View accessibilityLabel="Tale UI compatibility fixture">
      <Text>Tale UI React Native compatibility spike</Text>
      <Pressable accessibilityRole="button">
        <Text>{getFixtureButtonLabel()}</Text>
      </Pressable>
    </View>
  );
}
