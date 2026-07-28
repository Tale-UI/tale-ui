import { View, type ViewProps } from 'react-native';
import { useTaleTheme } from './provider';

export function Card({ style, ...props }: ViewProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: tokens.background,
          borderColor: tokens.neutral30,
          borderRadius: tokens.radiusM,
          borderWidth: 1,
          padding: tokens.spaceM,
        },
        style,
      ]}
    />
  );
}
