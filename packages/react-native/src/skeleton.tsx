import { View, type ViewProps } from 'react-native';
import { useTaleTheme } from './provider';

export function Skeleton({ style, ...props }: ViewProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...props}
      style={[
        {
          backgroundColor: tokens.neutral20,
          borderRadius: tokens.radiusM,
          minHeight: tokens.spaceL,
        },
        style,
      ]}
    />
  );
}
