import { nativeTokenModes } from '@tale-ui/tokens/native';
import { Text, View, useColorScheme } from 'react-native';

export function TokenCard() {
  const mode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const tokens = nativeTokenModes[mode];

  return (
    <View
      accessible
      accessibilityRole="summary"
      style={{
        backgroundColor: tokens.neutral10,
        borderColor: tokens.neutral30,
        borderRadius: tokens.radiusM,
        borderWidth: 1,
        gap: tokens.spaceXs,
        padding: tokens.spaceS,
      }}
    >
      <Text style={{ color: tokens.textColor, fontSize: tokens.titleMFontSize }}>
        Tale UI native tokens
      </Text>
      <Text style={{ color: tokens.neutral80, fontSize: tokens.textSFontSize }}>
        Platform components remain application-owned.
      </Text>
    </View>
  );
}
