import { View, type ViewProps } from 'react-native';
import { useTaleTheme } from './provider';

export type SeparatorProps = ViewProps & { orientation?: 'horizontal' | 'vertical' };

export function Separator({ orientation = 'horizontal', style, ...props }: SeparatorProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityRole="none"
      {...props}
      style={[
        {
          alignSelf: 'stretch',
          backgroundColor: tokens.neutral20,
          flexShrink: 0,
          height: orientation === 'horizontal' ? 1 : undefined,
          width: orientation === 'vertical' ? 1 : '100%',
        },
        style,
      ]}
    />
  );
}
