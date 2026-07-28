import { View, type ViewProps } from 'react-native';
import { useTaleTheme } from './provider';

export function Separator({ style, ...props }: ViewProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityRole="none"
      {...props}
      style={[{ backgroundColor: tokens.neutral30, height: 1, alignSelf: 'stretch' }, style]}
    />
  );
}
